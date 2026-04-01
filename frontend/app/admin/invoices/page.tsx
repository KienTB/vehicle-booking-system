"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts/admin-layout";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Card, CardContent } from "@/components/ui/card";
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
import { Invoice } from "@/lib/types";
import { invoiceService } from "@/lib/services/invoice-service";
import { format } from "date-fns";
import { Search, FileText } from "lucide-react";

// Mock data
const mockInvoices: Invoice[] = [
  {
    id: 1,
    booking: {
      id: 1,
      car: { id: 1, brand: "Toyota", model: "Camry", year: 2024, color: "Silver", licensePlate: "ABC-1234", dailyRate: 65, available: false, seats: 5, transmission: "AUTOMATIC", fuelType: "PETROL" },
      user: { id: 1, username: "johndoe", email: "john@example.com", fullName: "John Doe", role: "CUSTOMER" },
      startDate: "2026-03-28",
      endDate: "2026-03-31",
      totalPrice: 195,
      status: "CONFIRMED",
    },
    amount: 195,
    status: "UNPAID",
    issuedDate: "2026-03-25",
    dueDate: "2026-03-28",
  },
  {
    id: 2,
    booking: {
      id: 2,
      car: { id: 2, brand: "Honda", model: "CR-V", year: 2024, color: "Black", licensePlate: "XYZ-5678", dailyRate: 85, available: false, seats: 5, transmission: "AUTOMATIC", fuelType: "HYBRID" },
      user: { id: 2, username: "janedoe", email: "jane@example.com", fullName: "Jane Doe", role: "CUSTOMER" },
      startDate: "2026-03-26",
      endDate: "2026-03-30",
      totalPrice: 340,
      status: "CONFIRMED",
    },
    amount: 340,
    status: "PAID",
    issuedDate: "2026-03-24",
    dueDate: "2026-03-26",
    paidDate: "2026-03-25",
  },
  {
    id: 3,
    booking: {
      id: 3,
      car: { id: 3, brand: "Tesla", model: "Model 3", year: 2024, color: "White", licensePlate: "EV-0001", dailyRate: 120, available: true, seats: 5, transmission: "AUTOMATIC", fuelType: "ELECTRIC" },
      user: { id: 3, username: "bobsmith", email: "bob@example.com", fullName: "Bob Smith", role: "CUSTOMER" },
      startDate: "2026-03-20",
      endDate: "2026-03-23",
      totalPrice: 360,
      status: "COMPLETED",
    },
    amount: 360,
    status: "PAID",
    issuedDate: "2026-03-18",
    dueDate: "2026-03-20",
    paidDate: "2026-03-19",
  },
];

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await invoiceService.getAllInvoices();
        setInvoices(response.content);
        setFilteredInvoices(response.content);
      } catch {
        setInvoices(mockInvoices);
        setFilteredInvoices(mockInvoices);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  useEffect(() => {
    let result = [...invoices];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (i) =>
          i.booking.user.fullName.toLowerCase().includes(term) ||
          i.booking.car.brand.toLowerCase().includes(term) ||
          i.booking.car.model.toLowerCase().includes(term) ||
          i.id.toString().includes(term)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((i) => i.status === statusFilter);
    }

    setFilteredInvoices(result);
  }, [searchTerm, statusFilter, invoices]);

  const totalUnpaid = invoices.filter((i) => i.status === "UNPAID").reduce((sum, i) => sum + i.amount, 0);
  const totalPaid = invoices.filter((i) => i.status === "PAID").reduce((sum, i) => sum + i.amount, 0);

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Invoices</h1>
            <p className="text-muted-foreground">
              View all customer invoices and payment status
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Paid</p>
                  <p className="text-2xl font-bold">${totalPaid.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500/10">
                  <FileText className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Unpaid</p>
                  <p className="text-2xl font-bold">${totalUnpaid.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Invoices</p>
                  <p className="text-2xl font-bold">{invoices.length}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="flex flex-col gap-4 p-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by customer, car, or invoice #..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="UNPAID">Unpaid</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Invoices Table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner className="h-8 w-8" />
            </div>
          ) : filteredInvoices.length === 0 ? (
            <Empty
              title="No invoices found"
              description="No invoices match your search criteria"
            />
          ) : (
            <Card>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Issued</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">#{invoice.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{invoice.booking.user.fullName}</p>
                            <p className="text-sm text-muted-foreground">{invoice.booking.user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p>{invoice.booking.car.brand} {invoice.booking.car.model}</p>
                          <p className="text-xs text-muted-foreground">{invoice.booking.car.licensePlate}</p>
                        </TableCell>
                        <TableCell>{format(new Date(invoice.issuedDate), "MMM d, yyyy")}</TableCell>
                        <TableCell>{format(new Date(invoice.dueDate), "MMM d, yyyy")}</TableCell>
                        <TableCell className="font-semibold">${invoice.amount}</TableCell>
                        <TableCell>
                          <StatusBadge status={invoice.status} />
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
