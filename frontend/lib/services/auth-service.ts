import api from "@/lib/api";
import {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  ChangePasswordRequest,
  UpdateProfileRequest,
} from "@/lib/types";

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>("/auth/login", data);
    if (!response.data.data) {
      throw new Error(response.data.message || "Login failed");
    }
    return response.data.data;
  },

  async register(data: RegisterRequest): Promise<{ message: string }> {
    const response = await api.post("/auth/signup", data);
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get<User>("/users/profile");
    return response.data;
  },

  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    const response = await api.put<User>("/users/profile", data);
    return response.data;
  },

  async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    const response = await api.put("/users/change-password", data);
    return response.data;
  },

  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

  getStoredUser(): User | null {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  getStoredToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  },

  setAuthData(token: string, user: User) {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    }
  },
};
