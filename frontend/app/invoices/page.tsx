"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layouts/main-layout";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Empty } from "@/components/ui/empty";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Invoice, PaymentMethod } from "@/lib/types";
import { invoiceService } from "@/lib/services/invoice-service";
import { paymentService } from "@/lib/services/payment-service";
import { toast } from "sonner";
import { format } from "date-fns";
import { FileText, CreditCard, Building, Banknote, Car } from "lucide-react";

// Mock data
const mockInvoices: Invoice[] = [
  {
    id: 1,
    booking: {
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
    amount: 195,
    status: "UNPAID",
    issuedDate: "2026-03-25",
    dueDate: "2026-03-28",
  },
  {
    id: 2,
    booking: {
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
      startDate: "2026-03-15",
      endDate: "2026-03-18",
      totalPrice: 255,
      status: "COMPLETED",
    },
    amount: 255,
    status: "PAID",
    issuedDate: "2026-03-12",
    dueDate: "2026-03-15",
    paidDate: "2026-03-13",
  },
];

const paymentMethods: { value: PaymentMethod; label: string; icon: typeof CreditCard }[] = [
  { value: "CREDIT_CARD", label: "Credit Card", icon: CreditCard },
  { value: "DEBIT_CARD", label: "Debit Card", icon: CreditCard },
  { value: "BANK_TRANSFER", label: "Bank Transfer", icon: Building },
  { value: "CASH", label: "Cash", icon: Banknote },
];

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>("CREDIT_CARD");
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await invoiceService.getMyInvoices();
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
    if (statusFilter === "all") {
      setFilteredInvoices(invoices);
    } else {
      setFilteredInvoices(invoices.filter((i) => i.status === statusFilter));
    }
  }, [statusFilter, invoices]);

  const handlePayment = async () => {
    if (!selectedInvoice) return;

    setIsProcessing(true);
    try {
      await paymentService.createPayment({
        invoiceId: selectedInvoice.id,
        paymentMethod: selectedPaymentMethod,
      });

      // Update the invoice in local state
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === selectedInvoice.id
            ? { ...inv, status: "PAID" as const, paidDate: new Date().toISOString() }
            : inv
        )
      );

      toast.success("Payment successful!");
      setIsPaymentDialogOpen(false);
      setSelectedInvoice(null);
    } catch {
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const unpaidTotal = invoices
    .filter((i) => i.status === "UNPAID")
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-foreground">My Invoices</h1>
            <p className="text-muted-foreground">
              View and pay your rental invoices
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner className="h-8 w-8" />
            </div>
          ) : (
            <>
              {/* Summary Card */}
              {unpaidTotal > 0 && (
                <Card className="mb-6 border-warning/50 bg-warning/5">
                  <CardContent className="flex items-center justify-between p-6">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Unpaid</p>
                      <p className="text-3xl font-bold">${unpaidTotal}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/20">
                      <CreditCard className="h-6 w-6 text-warning" />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Filters */}
              <Card className="mb-6">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Status:</span>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="UNPAID">Unpaid</SelectItem>
                        <SelectItem value="PAID">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Showing {filteredInvoices.length} invoice(s)
                  </span>
                </CardContent>
              </Card>

              {/* Invoices List */}
              {filteredInvoices.length === 0 ? (
                <Empty
                  title="No invoices found"
                  description={
                    statusFilter !== "all"
                      ? "Try changing the status filter"
                      : "No invoices have been issued yet"
                  }
                />
              ) : (
                <div className="space-y-4">
                  {filteredInvoices.map((invoice) => (
                    <Card key={invoice.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                              <FileText className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div>
                              <div className="mb-1 flex items-center gap-3">
                                <h3 className="font-semibold">Invoice #{invoice.id}</h3>
                                <StatusBadge status={invoice.status} />
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {invoice.booking.car.brand} {invoice.booking.car.model} •{" "}
                                {format(new Date(invoice.booking.startDate), "MMM d")} -{" "}
                                {format(new Date(invoice.booking.endDate), "MMM d, yyyy")}
                              </p>
                              <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                                <span>
                                  Issued: {format(new Date(invoice.issuedDate), "MMM d, yyyy")}
                                </span>
                                <span>
                                  Due: {format(new Date(invoice.dueDate), "MMM d, yyyy")}
                                </span>
                                {invoice.paidDate && (
                                  <span className="text-success">
                                    Paid: {format(new Date(invoice.paidDate), "MMM d, yyyy")}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-2xl font-bold">${invoice.amount}</p>
                            </div>
                            {invoice.status === "UNPAID" && (
                              <Button
                                onClick={() => {
                                  setSelectedInvoice(invoice);
                                  setIsPaymentDialogOpen(true);
                                }}
                              >
                                <CreditCard className="mr-2 h-4 w-4" />
                                Pay Now
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Payment Dialog */}
        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Make Payment</DialogTitle>
              <DialogDescription>
                Pay Invoice #{selectedInvoice?.id}
              </DialogDescription>
            </DialogHeader>

            {selectedInvoice && (
              <div className="space-y-6">
                {/* Invoice Summary */}
                <div className="rounded-lg bg-muted p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <Car className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">
                      {selectedInvoice.booking.car.brand} {selectedInvoice.booking.car.model}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Rental Period</span>
                    <span>
                      {format(new Date(selectedInvoice.booking.startDate), "MMM d")} -{" "}
                      {format(new Date(selectedInvoice.booking.endDate), "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t pt-3">
                    <span className="font-semibold">Amount Due</span>
                    <span className="text-2xl font-bold">${selectedInvoice.amount}</span>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div>
                  <label className="mb-3 block text-sm font-medium">Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.value}
                        type="button"
                        onClick={() => setSelectedPaymentMethod(method.value)}
                        className={`flex items-center gap-3 rounded-lg border p-4 transition-colors ${
                          selectedPaymentMethod === method.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <method.icon className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">{method.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsPaymentDialogOpen(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button onClick={handlePayment} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay ${selectedInvoice?.amount}
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </MainLayout>
    </ProtectedRoute>
  );
}
