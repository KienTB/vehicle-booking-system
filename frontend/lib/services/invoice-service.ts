import api from "@/lib/api";
import { Invoice, PaginatedResponse } from "@/lib/types";

export const invoiceService = {
  async getMyInvoices(params?: {
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<Invoice>> {
    const response = await api.get<PaginatedResponse<Invoice>>("/invoices/my", {
      params,
    });
    return response.data;
  },

  async getAllInvoices(params?: {
    page?: number;
    size?: number;
    status?: string;
  }): Promise<PaginatedResponse<Invoice>> {
    const response = await api.get<PaginatedResponse<Invoice>>("/invoices", {
      params,
    });
    return response.data;
  },

  async getInvoiceById(id: number): Promise<Invoice> {
    const response = await api.get<Invoice>(`/invoices/${id}`);
    return response.data;
  },

  async getInvoiceByBookingId(bookingId: number): Promise<Invoice> {
    const response = await api.get<Invoice>(`/invoices/booking/${bookingId}`);
    return response.data;
  },
};
