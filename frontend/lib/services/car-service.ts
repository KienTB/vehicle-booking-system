import api from "@/lib/api";
import { Car, CreateCarRequest, PaginatedResponse } from "@/lib/types";

export const carService = {
  async getCars(params?: {
    page?: number;
    size?: number;
    available?: boolean;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<PaginatedResponse<Car>> {
    const response = await api.get<PaginatedResponse<Car>>("/cars", { params });
    return response.data;
  },

  async getAllCars(): Promise<Car[]> {
    const response = await api.get<Car[]>("/cars/all");
    return response.data;
  },

  async getAvailableCars(): Promise<Car[]> {
    const response = await api.get<Car[]>("/cars/available");
    return response.data;
  },

  async getCarById(id: number): Promise<Car> {
    const response = await api.get<Car>(`/cars/${id}`);
    return response.data;
  },

  async createCar(data: CreateCarRequest): Promise<Car> {
    const response = await api.post<Car>("/cars", data);
    return response.data;
  },

  async updateCar(id: number, data: Partial<CreateCarRequest>): Promise<Car> {
    const response = await api.put<Car>(`/cars/${id}`, data);
    return response.data;
  },

  async deleteCar(id: number): Promise<void> {
    await api.delete(`/cars/${id}`);
  },

  async toggleAvailability(id: number): Promise<Car> {
    const response = await api.patch<Car>(`/cars/${id}/availability`);
    return response.data;
  },
};
