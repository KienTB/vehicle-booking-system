export type UserRole = "ADMIN" | "USER";

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  userId: number;
  name: string;
  phone: string;
  role: string;
}

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  address?: string;
}

export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  dailyRate: number;
  available: boolean;
  imageUrl?: string;
  description?: string;
  seats: number;
  transmission: "AUTOMATIC" | "MANUAL";
  fuelType: "PETROL" | "DIESEL" | "ELECTRIC" | "HYBRID";
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCarRequest {
  brand: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  dailyRate: number;
  imageUrl?: string;
  description?: string;
  seats: number;
  transmission: "AUTOMATIC" | "MANUAL";
  fuelType: "PETROL" | "DIESEL" | "ELECTRIC" | "HYBRID";
}

export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

export interface Booking {
  id: number;
  car: Car;
  user: User;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: BookingStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBookingRequest {
  carId: number;
  startDate: string;
  endDate: string;
}

export type InvoiceStatus = "UNPAID" | "PAID" | "CANCELLED";

export interface Invoice {
  id: number;
  booking: Booking;
  amount: number;
  status: InvoiceStatus;
  issuedDate: string;
  dueDate: string;
  paidDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type PaymentMethod = "CREDIT_CARD" | "DEBIT_CARD" | "BANK_TRANSFER" | "CASH";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export interface Payment {
  id: number;
  invoice: Invoice;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  paymentDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePaymentRequest {
  invoiceId: number;
  paymentMethod: PaymentMethod;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  phone?: string;
  address?: string;
}

export interface DashboardStats {
  totalCars: number;
  totalBookings: number;
  totalRevenue: number;
  pendingBookings: number;
  activeBookings: number;
  availableCars: number;
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  errorCode?: string | null;
  data: T | null;
}
