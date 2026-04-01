"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layouts/main-layout";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { StatusBadge } from "@/components/shared/status-badge";
import { useAuth } from "@/contexts/auth-context";
import { Booking, Invoice } from "@/lib/types";
import { bookingService } from "@/lib/services/booking-service";
import { invoiceService } from "@/lib/services/invoice-service";
import {
  CalendarDays,
  FileText,
  Car,
  ChevronRight,
  Clock,
  CreditCard,
} from "lucide-react";
import { format } from "date-fns";

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
  },
];

const mockInvoices: Invoice[] = [
  {
    id: 1,
    booking: mockBookings[0],
    amount: 195,
    status: "PAID",
    issuedDate: "2026-03-25",
    dueDate: "2026-03-28",
    paidDate: "2026-03-26",
  },
  {
    id: 2,
    booking: mockBookings[1],
    amount: 425,
    status: "UNPAID",
    issuedDate: "2026-03-25",
    dueDate: "2026-04-05",
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsResponse, invoicesResponse] = await Promise.all([
          bookingService.getMyBookings({ size: 5 }),
          invoiceService.getMyInvoices({ size: 5 }),
        ]);
        setBookings(bookingsResponse.content);
        setInvoices(invoicesResponse.content);
      } catch {
        // Use mock data if API fails
        setBookings(mockBookings);
        setInvoices(mockInvoices);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const activeBookings = bookings.filter((b) => b.status === "CONFIRMED" || b.status === "PENDING");
  const unpaidInvoices = invoices.filter((i) => i.status === "UNPAID");

  return (
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-foreground">
              Welcome back, {user?.fullName || user?.username}
            </h1>
            <p className="text-muted-foreground">
              Manage your bookings and view your rental history
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner className="h-8 w-8" />
            </div>
          ) : (
            <>
              {/* Quick Stats */}
              <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <CalendarDays className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Active Bookings</p>
                      <p className="text-2xl font-bold">{activeBookings.length}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                      <Clock className="h-6 w-6 text-warning" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pending</p>
                      <p className="text-2xl font-bold">
                        {bookings.filter((b) => b.status === "PENDING").length}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                      <CreditCard className="h-6 w-6 text-destructive" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Unpaid Invoices</p>
                      <p className="text-2xl font-bold">{unpaidInvoices.length}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                      <FileText className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Bookings</p>
                      <p className="text-2xl font-bold">{bookings.length}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="mb-8">
                <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
                <div className="flex flex-wrap gap-3">
                  <Button asChild>
                    <Link href="/cars">
                      <Car className="mr-2 h-4 w-4" />
                      Browse Cars
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/bookings">
                      <CalendarDays className="mr-2 h-4 w-4" />
                      View All Bookings
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/invoices">
                      <FileText className="mr-2 h-4 w-4" />
                      View Invoices
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="grid gap-8 lg:grid-cols-2">
                {/* Recent Bookings */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <CalendarDays className="h-5 w-5" />
                      Recent Bookings
                    </CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/bookings">
                        View All
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {bookings.length === 0 ? (
                      <p className="py-8 text-center text-muted-foreground">
                        No bookings yet. Start by browsing our cars!
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {bookings.slice(0, 3).map((booking) => (
                          <Link
                            key={booking.id}
                            href={`/bookings/${booking.id}`}
                            className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                          >
                            <div>
                              <p className="font-medium">
                                {booking.car.brand} {booking.car.model}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(booking.startDate), "MMM d")} -{" "}
                                {format(new Date(booking.endDate), "MMM d, yyyy")}
                              </p>
                            </div>
                            <div className="text-right">
                              <StatusBadge status={booking.status} />
                              <p className="mt-1 text-sm font-medium">${booking.totalPrice}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Invoices */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Recent Invoices
                    </CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/invoices">
                        View All
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {invoices.length === 0 ? (
                      <p className="py-8 text-center text-muted-foreground">
                        No invoices yet.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {invoices.slice(0, 3).map((invoice) => (
                          <Link
                            key={invoice.id}
                            href={`/invoices`}
                            className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                          >
                            <div>
                              <p className="font-medium">Invoice #{invoice.id}</p>
                              <p className="text-sm text-muted-foreground">
                                Due: {format(new Date(invoice.dueDate), "MMM d, yyyy")}
                              </p>
                            </div>
                            <div className="text-right">
                              <StatusBadge status={invoice.status} />
                              <p className="mt-1 text-sm font-medium">${invoice.amount}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
