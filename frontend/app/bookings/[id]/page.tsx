"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layouts/main-layout";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StatusBadge } from "@/components/shared/status-badge";
import { Booking, Invoice } from "@/lib/types";
import { bookingService } from "@/lib/services/booking-service";
import { invoiceService } from "@/lib/services/invoice-service";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  ChevronLeft,
  AlertCircle,
  Car,
  CalendarDays,
  Users,
  Fuel,
  Settings2,
  FileText,
  CreditCard,
  XCircle,
} from "lucide-react";

// Mock data
const mockBooking: Booking = {
  id: 1,
  car: {
    id: 1,
    brand: "Toyota",
    model: "Camry",
    year: 2024,
    color: "Silver",
    licensePlate: "ABC-1234",
    dailyRate: 65,
    available: false,
    seats: 5,
    transmission: "AUTOMATIC",
    fuelType: "PETROL",
    description: "Comfortable mid-size sedan perfect for city driving.",
  },
  user: { id: 1, username: "user", email: "user@example.com", fullName: "John Doe", role: "CUSTOMER" },
  startDate: "2026-03-28",
  endDate: "2026-03-31",
  totalPrice: 195,
  status: "CONFIRMED",
  createdAt: "2026-03-25T10:00:00Z",
};

const mockInvoice: Invoice = {
  id: 1,
  booking: mockBooking,
  amount: 195,
  status: "UNPAID",
  issuedDate: "2026-03-25",
  dueDate: "2026-03-28",
};

export default function BookingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingData = await bookingService.getBookingById(parseInt(id));
        setBooking(bookingData);
        
        try {
          const invoiceData = await invoiceService.getInvoiceByBookingId(parseInt(id));
          setInvoice(invoiceData);
        } catch {
          // Invoice might not exist yet
        }
      } catch {
        setBooking(mockBooking);
        setInvoice(mockInvoice);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleCancel = async () => {
    if (!booking || booking.status !== "PENDING") return;

    setIsCancelling(true);
    try {
      const updated = await bookingService.cancelBooking(booking.id);
      setBooking(updated);
      toast.success("Booking cancelled successfully");
    } catch {
      toast.error("Failed to cancel booking");
    } finally {
      setIsCancelling(false);
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
      <ProtectedRoute allowedRoles={["CUSTOMER"]}>
        <MainLayout>
          <div className="flex min-h-[60vh] items-center justify-center">
            <Spinner className="h-8 w-8" />
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  if (!booking) {
    return (
      <ProtectedRoute allowedRoles={["CUSTOMER"]}>
        <MainLayout>
          <div className="container mx-auto px-4 py-8">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Booking not found</AlertDescription>
            </Alert>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  const days = Math.ceil(
    (new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Button variant="ghost" onClick={() => router.back()} className="mb-6 gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Bookings
          </Button>

          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <h1 className="text-3xl font-bold">Booking #{booking.id}</h1>
                <StatusBadge status={booking.status} />
              </div>
              <p className="text-muted-foreground">
                Created on {format(new Date(booking.createdAt || booking.startDate), "MMMM d, yyyy")}
              </p>
            </div>
            {booking.status === "PENDING" && (
              <Button
                variant="destructive"
                onClick={handleCancel}
                disabled={isCancelling}
              >
                {isCancelling ? (
                  <Spinner className="mr-2 h-4 w-4" />
                ) : (
                  <XCircle className="mr-2 h-4 w-4" />
                )}
                Cancel Booking
              </Button>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-6 lg:col-span-2">
              {/* Car Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    Vehicle Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-6 sm:flex-row">
                    <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted sm:w-48">
                      {booking.car.imageUrl ? (
                        <img
                          src={booking.car.imageUrl}
                          alt={`${booking.car.brand} ${booking.car.model}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Car className="h-12 w-12 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-1 text-xl font-semibold">
                        {booking.car.brand} {booking.car.model}
                      </h3>
                      <p className="mb-4 text-muted-foreground">
                        {booking.car.year} • {booking.car.color} • {booking.car.licensePlate}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1.5">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {booking.car.seats} seats
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Settings2 className="h-4 w-4 text-muted-foreground" />
                          {booking.car.transmission === "AUTOMATIC" ? "Automatic" : "Manual"}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Fuel className="h-4 w-4 text-muted-foreground" />
                          {fuelTypeLabels[booking.car.fuelType]}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Booking Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" />
                    Rental Period
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="rounded-lg bg-muted/50 p-4">
                      <p className="mb-1 text-sm text-muted-foreground">Pick-up Date</p>
                      <p className="text-lg font-semibold">
                        {format(new Date(booking.startDate), "EEEE, MMMM d, yyyy")}
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-4">
                      <p className="mb-1 text-sm text-muted-foreground">Return Date</p>
                      <p className="text-lg font-semibold">
                        {format(new Date(booking.endDate), "EEEE, MMMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-center rounded-lg border-2 border-dashed p-4">
                    <p className="text-lg">
                      <span className="font-bold">{days}</span>{" "}
                      <span className="text-muted-foreground">{days === 1 ? "day" : "days"} rental</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Price Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Price Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Daily Rate</span>
                      <span>${booking.car.dailyRate}/day</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Duration</span>
                      <span>{days} {days === 1 ? "day" : "days"}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Total</span>
                        <span className="text-2xl font-bold">${booking.totalPrice}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Invoice */}
              {invoice && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Invoice
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Invoice #</span>
                        <span className="font-medium">{invoice.id}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <StatusBadge status={invoice.status} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Due Date</span>
                        <span>{format(new Date(invoice.dueDate), "MMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Amount</span>
                        <span className="font-semibold">${invoice.amount}</span>
                      </div>
                      {invoice.status === "UNPAID" && (
                        <Button className="mt-4 w-full" asChild>
                          <a href="/invoices">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Pay Now
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
