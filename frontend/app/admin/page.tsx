"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/layouts/admin-layout";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { StatusBadge } from "@/components/shared/status-badge";
import { DashboardStats, Booking } from "@/lib/types";
import { dashboardService } from "@/lib/services/dashboard-service";
import { bookingService } from "@/lib/services/booking-service";
import { format } from "date-fns";
import {
  Car,
  CalendarDays,
  DollarSign,
  Clock,
  CheckCircle,
  TrendingUp,
  ChevronRight,
} from "lucide-react";

// Mock data
const mockStats: DashboardStats = {
  totalCars: 12,
  totalBookings: 48,
  totalRevenue: 15750,
  pendingBookings: 5,
  activeBookings: 8,
  availableCars: 7,
};

const mockRecentBookings: Booking[] = [
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
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, bookingsData] = await Promise.all([
          dashboardService.getStats(),
          bookingService.getAllBookings({ size: 5 }),
        ]);
        setStats(statsData);
        setRecentBookings(bookingsData.content);
      } catch {
        setStats(mockStats);
        setRecentBookings(mockRecentBookings);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = stats
    ? [
        {
          title: "Total Cars",
          value: stats.totalCars,
          icon: Car,
          color: "bg-blue-500/10 text-blue-600",
          href: "/admin/cars",
        },
        {
          title: "Total Bookings",
          value: stats.totalBookings,
          icon: CalendarDays,
          color: "bg-green-500/10 text-green-600",
          href: "/admin/bookings",
        },
        {
          title: "Total Revenue",
          value: `$${stats.totalRevenue.toLocaleString()}`,
          icon: DollarSign,
          color: "bg-yellow-500/10 text-yellow-600",
          href: "/admin/payments",
        },
        {
          title: "Pending Bookings",
          value: stats.pendingBookings,
          icon: Clock,
          color: "bg-orange-500/10 text-orange-600",
          href: "/admin/bookings?status=PENDING",
        },
        {
          title: "Active Bookings",
          value: stats.activeBookings,
          icon: TrendingUp,
          color: "bg-purple-500/10 text-purple-600",
          href: "/admin/bookings?status=CONFIRMED",
        },
        {
          title: "Available Cars",
          value: stats.availableCars,
          icon: CheckCircle,
          color: "bg-teal-500/10 text-teal-600",
          href: "/admin/cars",
        },
      ]
    : [];

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AdminLayout>
        <div className="space-y-8">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here is an overview of your business.
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner className="h-8 w-8" />
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {statCards.map((stat, index) => (
                  <Link key={index} href={stat.href}>
                    <Card className="transition-colors hover:bg-muted/50">
                      <CardContent className="flex items-center gap-4 p-6">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color}`}>
                          <stat.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{stat.title}</p>
                          <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Recent Bookings */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Bookings</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin/bookings">
                      View All
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                            <Car className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {booking.car.brand} {booking.car.model}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {booking.user.fullName} • {format(new Date(booking.startDate), "MMM d")} -{" "}
                              {format(new Date(booking.endDate), "MMM d")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <StatusBadge status={booking.status} />
                          <span className="font-semibold">${booking.totalPrice}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild>
                      <Link href="/admin/cars">
                        <Car className="mr-2 h-4 w-4" />
                        Manage Cars
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/admin/bookings">
                        <CalendarDays className="mr-2 h-4 w-4" />
                        View Bookings
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/admin/invoices">
                        <DollarSign className="mr-2 h-4 w-4" />
                        View Invoices
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
