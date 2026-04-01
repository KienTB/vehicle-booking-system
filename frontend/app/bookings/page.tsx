"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layouts/main-layout";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Empty } from "@/components/ui/empty";
import { StatusBadge } from "@/components/shared/status-badge";
import { Booking, BookingStatus } from "@/lib/types";
import { bookingService } from "@/lib/services/booking-service";
import { format } from "date-fns";
import { CalendarDays, Car, ChevronRight, Eye } from "lucide-react";

// Mock data
const mockBookings: Booking[] = [
  {
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
    },
    user: { id: 1, username: "user", email: "user@example.com", fullName: "John Doe", role: "CUSTOMER" },
    startDate: "2026-03-28",
    endDate: "2026-03-31",
    totalPrice: 195,
    status: "CONFIRMED",
    createdAt: "2026-03-25T10:00:00Z",
  },
  {
    id: 2,
    car: {
      id: 2,
      brand: "Honda",
      model: "CR-V",
      year: 2024,
      color: "Black",
      licensePlate: "XYZ-5678",
      dailyRate: 85,
      available: true,
      seats: 5,
      transmission: "AUTOMATIC",
      fuelType: "HYBRID",
    },
    user: { id: 1, username: "user", email: "user@example.com", fullName: "John Doe", role: "CUSTOMER" },
    startDate: "2026-04-05",
    endDate: "2026-04-10",
    totalPrice: 425,
    status: "PENDING",
    createdAt: "2026-03-24T14:30:00Z",
  },
  {
    id: 3,
    car: {
      id: 3,
      brand: "Tesla",
      model: "Model 3",
      year: 2024,
      color: "White",
      licensePlate: "EV-0001",
      dailyRate: 120,
      available: true,
      seats: 5,
      transmission: "AUTOMATIC",
      fuelType: "ELECTRIC",
    },
    user: { id: 1, username: "user", email: "user@example.com", fullName: "John Doe", role: "CUSTOMER" },
    startDate: "2026-03-15",
    endDate: "2026-03-18",
    totalPrice: 360,
    status: "COMPLETED",
    createdAt: "2026-03-10T09:15:00Z",
  },
];

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingService.getMyBookings();
        setBookings(response.content);
        setFilteredBookings(response.content);
      } catch {
        setBookings(mockBookings);
        setFilteredBookings(mockBookings);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter((b) => b.status === statusFilter));
    }
  }, [statusFilter, bookings]);

  return (
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-foreground">My Bookings</h1>
              <p className="text-muted-foreground">
                View and manage all your vehicle bookings
              </p>
            </div>
            <Button asChild>
              <Link href="/cars">
                <Car className="mr-2 h-4 w-4" />
                Book a Car
              </Link>
            </Button>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <span className="text-sm text-muted-foreground">
                Showing {filteredBookings.length} booking(s)
              </span>
            </CardContent>
          </Card>

          {/* Bookings List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner className="h-8 w-8" />
            </div>
          ) : filteredBookings.length === 0 ? (
            <Empty
              title="No bookings found"
              description={
                statusFilter !== "all"
                  ? "Try changing the status filter"
                  : "Start by browsing our available cars"
              }
            />
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col lg:flex-row">
                      {/* Car Image */}
                      <div className="relative aspect-video w-full bg-muted lg:aspect-auto lg:w-48">
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

                      {/* Booking Details */}
                      <div className="flex flex-1 flex-col justify-between p-4 lg:p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="mb-2 flex items-center gap-3">
                              <h3 className="text-lg font-semibold">
                                {booking.car.brand} {booking.car.model}
                              </h3>
                              <StatusBadge status={booking.status} />
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {booking.car.year} • {booking.car.color} • {booking.car.licensePlate}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold">${booking.totalPrice}</p>
                            <p className="text-sm text-muted-foreground">Total</p>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                              <CalendarDays className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">
                                  {format(new Date(booking.startDate), "MMM d, yyyy")} -{" "}
                                  {format(new Date(booking.endDate), "MMM d, yyyy")}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Booked on {format(new Date(booking.createdAt || booking.startDate), "MMM d, yyyy")}
                                </p>
                              </div>
                            </div>
                          </div>

                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/bookings/${booking.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
