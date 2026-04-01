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
import { Payment } from "@/lib/types";
import { paymentService } from "@/lib/services/payment-service";
import { toast } from "sonner";
import { format } from "date-fns";
import { Search, CreditCard, Building, Banknote, Check, DollarSign } from "lucide-react";

// Mock data
const mockPayments: Payment[] = [
  {
    id: 1,
    invoice: {
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
    amount: 340,
    paymentMethod: "CREDIT_CARD",
    status: "COMPLETED",
    transactionId: "TXN-20260325-001",
    paymentDate: "2026-03-25T14:30:00Z",
  },
  {
    id: 2,
    invoice: {
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
    amount: 360,
    paymentMethod: "BANK_TRANSFER",
    status: "PENDING",
    paymentDate: "2026-03-19T10:00:00Z",
  },
  {
    id: 3,
    invoice: {
      id: 4,
      booking: {
        id: 4,
        car: { id: 4, brand: "BMW", model: "3 Series", year: 2023, color: "Blue", licensePlate: "BMW-320", dailyRate: 110, available: true, seats: 5, transmission: "AUTOMATIC", fuelType: "PETROL" },
        user: { id: 4, username: "alicew", email: "alice@example.com", fullName: "Alice Williams", role: "CUSTOMER" },
        startDate: "2026-03-10",
        endDate: "2026-03-12",
        totalPrice: 220,
        status: "COMPLETED",
      },
      amount: 220,
      status: "PAID",
      issuedDate: "2026-03-08",
      dueDate: "2026-03-10",
      paidDate: "2026-03-09",
    },
    amount: 220,
    paymentMethod: "DEBIT_CARD",
    status: "COMPLETED",
    transactionId: "TXN-20260309-003",
    paymentDate: "2026-03-09T16:45:00Z",
  },
];

const paymentMethodIcons = {
  CREDIT_CARD: CreditCard,
  DEBIT_CARD: CreditCard,
  BANK_TRANSFER: Building,
  CASH: Banknote,
};

const paymentMethodLabels = {
  CREDIT_CARD: "Credit Card",
  DEBIT_CARD: "Debit Card",
  BANK_TRANSFER: "Bank Transfer",
  CASH: "Cash",
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await paymentService.getAllPayments();
        setPayments(response.content);
        setFilteredPayments(response.content);
      } catch {
        setPayments(mockPayments);
        setFilteredPayments(mockPayments);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, []);

  useEffect(() => {
    let result = [...payments];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.invoice.booking.user.fullName.toLowerCase().includes(term) ||
          p.transactionId?.toLowerCase().includes(term) ||
          p.id.toString().includes(term)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter);
    }

    setFilteredPayments(result);
  }, [searchTerm, statusFilter, payments]);

  const handleConfirmPayment = async (payment: Payment) => {
    try {
      const updated = await paymentService.confirmPayment(payment.id);
      setPayments((prev) => prev.map((p) => (p.id === payment.id ? updated : p)));
      toast.success("Payment confirmed successfully");
    } catch {
      toast.error("Failed to confirm payment");
    }
  };

  const totalCompleted = payments.filter((p) => p.status === "COMPLETED").reduce((sum, p) => sum + p.amount, 0);
  const pendingCount = payments.filter((p) => p.status === "PENDING").length;

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Payments</h1>
            <p className="text-muted-foreground">
              View and manage customer payments
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Received</p>
                  <p className="text-2xl font-bold">${totalCompleted.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500/10">
                  <CreditCard className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Confirmation</p>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Transactions</p>
                  <p className="text-2xl font-bold">{payments.length}</p>
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
                  placeholder="Search by customer or transaction ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Payments Table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner className="h-8 w-8" />
            </div>
          ) : filteredPayments.length === 0 ? (
            <Empty
              title="No payments found"
              description="No payments match your search criteria"
            />
          ) : (
            <Card>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => {
                      const MethodIcon = paymentMethodIcons[payment.paymentMethod];
                      return (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">
                            <div>
                              <p>#{payment.id}</p>
                              {payment.transactionId && (
                                <p className="text-xs text-muted-foreground">{payment.transactionId}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{payment.invoice.booking.user.fullName}</p>
                              <p className="text-sm text-muted-foreground">{payment.invoice.booking.user.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>Invoice #{payment.invoice.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <MethodIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{paymentMethodLabels[payment.paymentMethod]}</span>
                            </div>
                          </TableCell>
                          <TableCell>{format(new Date(payment.paymentDate), "MMM d, yyyy")}</TableCell>
                          <TableCell className="font-semibold">${payment.amount}</TableCell>
                          <TableCell>
                            <StatusBadge status={payment.status} />
                          </TableCell>
                          <TableCell className="text-right">
                            {payment.status === "PENDING" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleConfirmPayment(payment)}
                              >
                                <Check className="mr-1 h-3 w-3" />
                                Confirm
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
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
