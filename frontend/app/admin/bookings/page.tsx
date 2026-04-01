"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts/admin-layout";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Empty } from "@/components/ui/empty";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Booking } from "@/lib/types";
import { bookingService } from "@/lib/services/booking-service";
import { toast } from "sonner";
import { format } from "date-fns";
import { Search, MoreVertical, Check, X, CheckCircle, Car } from "lucide-react";

// Mock data
const mockBookings: Booking[] = [
  {
    id: 1,
    car: { id: 1, brand: "Toyota", model: "Camry", year: 2024, color: "Silver", licensePlate: "ABC-1234", dailyRate: 65, available: false, seats: 5, transmission: "AUTOMATIC", fuelType: "PETROL" },
    user: { id: 1, username: "johndoe", email: "john@example.com", fullName: "John Doe", role: "CUSTOMER" },
    startDate: "2026-03-28",
    endDate: "2026-03-31",
    totalPrice: 195,
    status: "PENDING",
    createdAt: "2026-03-25T10:00:00Z",
  },
  {
    id: 2,
    car: { id: 2, brand: "Honda", model: "CR-V", year: 2024, color: "Black", licensePlate: "XYZ-5678", dailyRate: 85, available: false, seats: 5, transmission: "AUTOMATIC", fuelType: "HYBRID" },
    user: { id: 2, username: "janedoe", email: "jane@example.com", fullName: "Jane Doe", role: "CUSTOMER" },
    startDate: "2026-03-26",
    endDate: "2026-03-30",
    totalPrice: 340,
    status: "CONFIRMED",
    createdAt: "2026-03-24T14:30:00Z",
  },
  {
    id: 3,
    car: { id: 3, brand: "Tesla", model: "Model 3", year: 2024, color: "White", licensePlate: "EV-0001", dailyRate: 120, available: true, seats: 5, transmission: "AUTOMATIC", fuelType: "ELECTRIC" },
    user: { id: 3, username: "bobsmith", email: "bob@example.com", fullName: "Bob Smith", role: "CUSTOMER" },
    startDate: "2026-03-20",
    endDate: "2026-03-23",
    totalPrice: 360,
    status: "COMPLETED",
    createdAt: "2026-03-18T09:15:00Z",
  },
  {
    id: 4,
    car: { id: 4, brand: "BMW", model: "3 Series", year: 2023, color: "Blue", licensePlate: "BMW-320", dailyRate: 110, available: true, seats: 5, transmission: "AUTOMATIC", fuelType: "PETROL" },
    user: { id: 4, username: "alicew", email: "alice@example.com", fullName: "Alice Williams", role: "CUSTOMER" },
    startDate: "2026-03-15",
    endDate: "2026-03-17",
    totalPrice: 220,
    status: "CANCELLED",
    createdAt: "2026-03-12T11:00:00Z",
  },
];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingService.getAllBookings();
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
    let result = [...bookings];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (b) =>
          b.user.fullName.toLowerCase().includes(term) ||
          b.car.brand.toLowerCase().includes(term) ||
          b.car.model.toLowerCase().includes(term) ||
          b.car.licensePlate.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((b) => b.status === statusFilter);
    }

    setFilteredBookings(result);
  }, [searchTerm, statusFilter, bookings]);

  const handleConfirm = async (booking: Booking) => {
    try {
      const updated = await bookingService.confirmBooking(booking.id);
      setBookings((prev) => prev.map((b) => (b.id === booking.id ? updated : b)));
      toast.success("Booking confirmed successfully");
    } catch {
      toast.error("Failed to confirm booking");
    }
  };

  const handleCancel = async (booking: Booking) => {
    try {
      const updated = await bookingService.cancelBooking(booking.id);
      setBookings((prev) => prev.map((b) => (b.id === booking.id ? updated : b)));
      toast.success("Booking cancelled");
    } catch {
      toast.error("Failed to cancel booking");
    }
  };

  const handleComplete = async (booking: Booking) => {
    try {
      const updated = await bookingService.completeBooking(booking.id);
      setBookings((prev) => prev.map((b) => (b.id === booking.id ? updated : b)));
      toast.success("Booking marked as completed");
    } catch {
      toast.error("Failed to complete booking");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Manage Bookings</h1>
            <p className="text-muted-foreground">
              View and manage all customer bookings
            </p>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="flex flex-col gap-4 p-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by customer, car, or plate..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Results count */}
          <p className="text-sm text-muted-foreground">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </p>

          {/* Bookings Table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner className="h-8 w-8" />
            </div>
          ) : filteredBookings.length === 0 ? (
            <Empty
              title="No bookings found"
              description="No bookings match your search criteria"
            />
          ) : (
            <Card>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">#{booking.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{booking.user.fullName}</p>
                            <p className="text-sm text-muted-foreground">{booking.user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded bg-muted">
                              <Car className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium">{booking.car.brand} {booking.car.model}</p>
                              <p className="text-xs text-muted-foreground">{booking.car.licensePlate}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">
                            {format(new Date(booking.startDate), "MMM d")} -{" "}
                            {format(new Date(booking.endDate), "MMM d, yyyy")}
                          </p>
                        </TableCell>
                        <TableCell className="font-semibold">${booking.totalPrice}</TableCell>
                        <TableCell>
                          <StatusBadge status={booking.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {booking.status === "PENDING" && (
                                <>
                                  <DropdownMenuItem onClick={() => handleConfirm(booking)}>
                                    <Check className="mr-2 h-4 w-4 text-success" />
                                    Confirm Booking
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleCancel(booking)}>
                                    <X className="mr-2 h-4 w-4 text-destructive" />
                                    Cancel Booking
                                  </DropdownMenuItem>
                                </>
                              )}
                              {booking.status === "CONFIRMED" && (
                                <>
                                  <DropdownMenuItem onClick={() => handleComplete(booking)}>
                                    <CheckCircle className="mr-2 h-4 w-4 text-success" />
                                    Mark Complete
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleCancel(booking)}>
                                    <X className="mr-2 h-4 w-4 text-destructive" />
                                    Cancel Booking
                                  </DropdownMenuItem>
                                </>
                              )}
                              {(booking.status === "COMPLETED" || booking.status === "CANCELLED") && (
                                <DropdownMenuItem disabled>
                                  No actions available
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
