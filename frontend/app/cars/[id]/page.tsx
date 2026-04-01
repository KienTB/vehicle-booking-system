"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layouts/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Car } from "@/lib/types";
import { carService } from "@/lib/services/car-service";
import { bookingService } from "@/lib/services/booking-service";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import {
  Users,
  Fuel,
  Settings2,
  Calendar,
  ChevronLeft,
  AlertCircle,
  Check,
} from "lucide-react";

// Mock car for demo
const mockCar: Car = {
  id: 1,
  brand: "Toyota",
  model: "Camry",
  year: 2024,
  color: "Silver",
  licensePlate: "ABC-1234",
  dailyRate: 65,
  available: true,
  seats: 5,
  transmission: "AUTOMATIC",
  fuelType: "PETROL",
  description: "Comfortable mid-size sedan perfect for city driving and long trips. Features include advanced safety systems, Apple CarPlay, Android Auto, and excellent fuel economy.",
};

export default function CarDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [car, setCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const { isAuthenticated, isCustomer } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const data = await carService.getCarById(parseInt(id));
        setCar(data);
      } catch {
        // Use mock data if API fails
        setCar(mockCar);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  useEffect(() => {
    if (startDate && endDate && car) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      if (days > 0) {
        setTotalPrice(days * car.dailyRate);
      } else {
        setTotalPrice(0);
      }
    }
  }, [startDate, endDate, car]);

  const handleBooking = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!startDate || !endDate) {
      toast.error("Please select start and end dates");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      toast.error("Start date cannot be in the past");
      return;
    }

    if (end <= start) {
      toast.error("End date must be after start date");
      return;
    }

    setIsBooking(true);
    try {
      await bookingService.createBooking({
        carId: parseInt(id),
        startDate,
        endDate,
      });
      toast.success("Booking created successfully!");
      router.push("/bookings");
    } catch {
      toast.error("Failed to create booking. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  const fuelTypeLabels = {
    PETROL: "Petrol",
    DIESEL: "Diesel",
    ELECTRIC: "Electric",
    HYBRID: "Hybrid",
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      </MainLayout>
    );
  }

  if (!car) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Car not found</AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Cars
        </Button>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Car Details */}
          <div className="lg:col-span-2">
            {/* Car Image */}
            <Card className="mb-6 overflow-hidden">
              <div className="relative aspect-video bg-muted">
                {car.imageUrl ? (
                  <img
                    src={car.imageUrl}
                    alt={`${car.brand} ${car.model}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-muted-foreground/30">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="h-32 w-32">
                        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.5-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                        <circle cx="7" cy="17" r="2" />
                        <path d="M9 17h6" />
                        <circle cx="17" cy="17" r="2" />
                      </svg>
                    </div>
                  </div>
                )}
                <Badge
                  variant={car.available ? "default" : "secondary"}
                  className="absolute right-4 top-4"
                >
                  {car.available ? "Available" : "Not Available"}
                </Badge>
              </div>
            </Card>

            {/* Car Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">
                      {car.brand} {car.model}
                    </CardTitle>
                    <p className="text-muted-foreground">
                      {car.year} • {car.color} • {car.licensePlate}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">${car.dailyRate}</div>
                    <div className="text-sm text-muted-foreground">per day</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Features */}
                <div className="mb-6 grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center rounded-lg bg-muted/50 p-4">
                    <Users className="mb-2 h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">{car.seats} Seats</span>
                  </div>
                  <div className="flex flex-col items-center rounded-lg bg-muted/50 p-4">
                    <Settings2 className="mb-2 h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {car.transmission === "AUTOMATIC" ? "Automatic" : "Manual"}
                    </span>
                  </div>
                  <div className="flex flex-col items-center rounded-lg bg-muted/50 p-4">
                    <Fuel className="mb-2 h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">{fuelTypeLabels[car.fuelType]}</span>
                  </div>
                </div>

                {/* Description */}
                {car.description && (
                  <div>
                    <h3 className="mb-2 font-semibold">Description</h3>
                    <p className="text-muted-foreground">{car.description}</p>
                  </div>
                )}

                {/* Features List */}
                <div className="mt-6">
                  <h3 className="mb-3 font-semibold">Features Included</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {["Air Conditioning", "GPS Navigation", "Bluetooth", "USB Port", "Backup Camera", "Cruise Control"].map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-success" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Card */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Book This Car
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!car.available ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      This car is currently not available for booking.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="startDate">Pick-up Date</FieldLabel>
                      <Input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="endDate">Return Date</FieldLabel>
                      <Input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate || new Date().toISOString().split("T")[0]}
                      />
                    </Field>

                    {totalPrice > 0 && (
                      <div className="rounded-lg bg-muted p-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Daily Rate</span>
                          <span>${car.dailyRate}/day</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between border-t pt-2">
                          <span className="font-semibold">Total</span>
                          <span className="text-xl font-bold">${totalPrice}</span>
                        </div>
                      </div>
                    )}

                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleBooking}
                      disabled={isBooking || !car.available}
                    >
                      {isBooking ? (
                        <>
                          <Spinner className="mr-2 h-4 w-4" />
                          Creating Booking...
                        </>
                      ) : !isAuthenticated ? (
                        "Sign in to Book"
                      ) : (
                        "Book Now"
                      )}
                    </Button>

                    {!isAuthenticated && (
                      <p className="text-center text-sm text-muted-foreground">
                        You need to sign in to make a booking
                      </p>
                    )}
                  </FieldGroup>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
