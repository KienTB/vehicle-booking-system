import api from "@/lib/api";
import { Booking, CreateBookingRequest, PaginatedResponse } from "@/lib/types";

export const bookingService = {
  async getMyBookings(params?: {
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<Booking>> {
    const response = await api.get<PaginatedResponse<Booking>>("/bookings/my", {
      params,
    });
    return response.data;
  },

  async getAllBookings(params?: {
    page?: number;
    size?: number;
    status?: string;
  }): Promise<PaginatedResponse<Booking>> {
    const response = await api.get<PaginatedResponse<Booking>>("/bookings", {
      params,
    });
    return response.data;
  },

  async getBookingById(id: number): Promise<Booking> {
    const response = await api.get<Booking>(`/bookings/${id}`);
    return response.data;
  },

  async createBooking(data: CreateBookingRequest): Promise<Booking> {
    const response = await api.post<Booking>("/bookings", data);
    return response.data;
  },

  async confirmBooking(id: number): Promise<Booking> {
    const response = await api.patch<Booking>(`/bookings/${id}/confirm`);
    return response.data;
  },

  async cancelBooking(id: number): Promise<Booking> {
    const response = await api.patch<Booking>(`/bookings/${id}/cancel`);
    return response.data;
  },

  async completeBooking(id: number): Promise<Booking> {
    const response = await api.patch<Booking>(`/bookings/${id}/complete`);
    return response.data;
  },
};
