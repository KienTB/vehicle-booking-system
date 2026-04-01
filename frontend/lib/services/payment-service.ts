import api from "@/lib/api";
import { Payment, CreatePaymentRequest, PaginatedResponse } from "@/lib/types";

export const paymentService = {
  async getMyPayments(params?: {
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<Payment>> {
    const response = await api.get<PaginatedResponse<Payment>>("/payments/my", {
      params,
    });
    return response.data;
  },

  async getAllPayments(params?: {
    page?: number;
    size?: number;
    status?: string;
  }): Promise<PaginatedResponse<Payment>> {
    const response = await api.get<PaginatedResponse<Payment>>("/payments", {
      params,
    });
    return response.data;
  },

  async getPaymentById(id: number): Promise<Payment> {
    const response = await api.get<Payment>(`/payments/${id}`);
    return response.data;
  },

  async createPayment(data: CreatePaymentRequest): Promise<Payment> {
    const response = await api.post<Payment>("/payments", data);
    return response.data;
  },

  async confirmPayment(id: number): Promise<Payment> {
    const response = await api.patch<Payment>(`/payments/${id}/confirm`);
    return response.data;
  },
};
