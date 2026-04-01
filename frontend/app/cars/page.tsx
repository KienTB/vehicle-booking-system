"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layouts/main-layout";
import { CarCard } from "@/components/cars/car-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Empty } from "@/components/ui/empty";
import { Car } from "@/lib/types";
import { carService } from "@/lib/services/car-service";
import { Search, SlidersHorizontal, X } from "lucide-react";

// Mock data for demo purposes
const mockCars: Car[] = [
  {
    id: 1,
    brand: "Toyota",
    model: "Camry",
    year: 2024,
    color: "Silver",
    licensePlate: "ABC-1234",
    dailyRate: 65,
    available: true,
    seats: 5,
    transmission: "AUTOMATIC",
    fuelType: "PETROL",
    description: "Comfortable mid-size sedan perfect for city driving and long trips.",
  },
  {
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
    description: "Versatile SUV with excellent fuel economy and spacious interior.",
  },
  {
    id: 3,
    brand: "Tesla",
    model: "Model 3",
    year: 2024,
    color: "White",
    licensePlate: "EV-0001",
    dailyRate: 120,
    available: true,
    seats: 5,
    transmission: "AUTOMATIC",
    fuelType: "ELECTRIC",
    description: "Premium electric sedan with autopilot and cutting-edge technology.",
  },
  {
    id: 4,
    brand: "BMW",
    model: "3 Series",
    year: 2023,
    color: "Blue",
    licensePlate: "BMW-320",
    dailyRate: 110,
    available: false,
    seats: 5,
    transmission: "AUTOMATIC",
    fuelType: "PETROL",
    description: "Luxury sports sedan with dynamic handling and premium features.",
  },
  {
    id: 5,
    brand: "Ford",
    model: "Mustang",
    year: 2024,
    color: "Red",
    licensePlate: "MUS-2024",
    dailyRate: 150,
    available: true,
    seats: 4,
    transmission: "MANUAL",
    fuelType: "PETROL",
    description: "Iconic American muscle car with powerful V8 engine.",
  },
  {
    id: 6,
    brand: "Mercedes",
    model: "E-Class",
    year: 2024,
    color: "Gray",
    licensePlate: "MB-E300",
    dailyRate: 180,
    available: true,
    seats: 5,
    transmission: "AUTOMATIC",
    fuelType: "DIESEL",
    description: "Executive sedan with world-class comfort and advanced technology.",
  },
];

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    transmission: "all",
    fuelType: "all",
    availability: "all",
    priceRange: "all",
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await carService.getAllCars();
        setCars(response);
        setFilteredCars(response);
      } catch {
        // Use mock data if API fails
        setCars(mockCars);
        setFilteredCars(mockCars);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
  }, []);

  useEffect(() => {
    let result = [...cars];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (car) =>
          car.brand.toLowerCase().includes(term) ||
          car.model.toLowerCase().includes(term) ||
          car.color.toLowerCase().includes(term)
      );
    }

    // Transmission filter
    if (filters.transmission !== "all") {
      result = result.filter((car) => car.transmission === filters.transmission);
    }

    // Fuel type filter
    if (filters.fuelType !== "all") {
      result = result.filter((car) => car.fuelType === filters.fuelType);
    }

    // Availability filter
    if (filters.availability !== "all") {
      result = result.filter((car) => 
        filters.availability === "available" ? car.available : !car.available
      );
    }

    // Price range filter
    if (filters.priceRange !== "all") {
      const [min, max] = filters.priceRange.split("-").map(Number);
      result = result.filter((car) => {
        if (max) {
          return car.dailyRate >= min && car.dailyRate <= max;
        }
        return car.dailyRate >= min;
      });
    }

    setFilteredCars(result);
  }, [searchTerm, filters, cars]);

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({
      transmission: "all",
      fuelType: "all",
      availability: "all",
      priceRange: "all",
    });
  };

  const hasActiveFilters = 
    searchTerm || 
    filters.transmission !== "all" || 
    filters.fuelType !== "all" || 
    filters.availability !== "all" || 
    filters.priceRange !== "all";

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Browse Cars</h1>
          <p className="text-muted-foreground">
            Find the perfect vehicle for your next trip
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by brand, model, or color..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    !
                  </span>
                )}
              </Button>

              {hasActiveFilters && (
                <Button variant="ghost" onClick={clearFilters} className="gap-2">
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="mt-4 grid gap-4 border-t pt-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Transmission</label>
                  <Select
                    value={filters.transmission}
                    onValueChange={(value) => setFilters((f) => ({ ...f, transmission: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="AUTOMATIC">Automatic</SelectItem>
                      <SelectItem value="MANUAL">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Fuel Type</label>
                  <Select
                    value={filters.fuelType}
                    onValueChange={(value) => setFilters((f) => ({ ...f, fuelType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="PETROL">Petrol</SelectItem>
                      <SelectItem value="DIESEL">Diesel</SelectItem>
                      <SelectItem value="ELECTRIC">Electric</SelectItem>
                      <SelectItem value="HYBRID">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Availability</label>
                  <Select
                    value={filters.availability}
                    onValueChange={(value) => setFilters((f) => ({ ...f, availability: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="unavailable">Not Available</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Price Range</label>
                  <Select
                    value={filters.priceRange}
                    onValueChange={(value) => setFilters((f) => ({ ...f, priceRange: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="0-50">Under $50</SelectItem>
                      <SelectItem value="50-100">$50 - $100</SelectItem>
                      <SelectItem value="100-150">$100 - $150</SelectItem>
                      <SelectItem value="150-99999">$150+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredCars.length} of {cars.length} vehicles
          </p>
        </div>

        {/* Cars Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner className="h-8 w-8" />
          </div>
        ) : filteredCars.length === 0 ? (
          <Empty
            title="No cars found"
            description="Try adjusting your search or filters to find what you're looking for."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
