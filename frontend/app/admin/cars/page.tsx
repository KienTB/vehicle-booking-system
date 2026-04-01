"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layouts/admin-layout";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Empty } from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Car, CreateCarRequest } from "@/lib/types";
import { carService } from "@/lib/services/car-service";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Search, Car as CarIcon } from "lucide-react";

// Mock data
const mockCars: Car[] = [
  { id: 1, brand: "Toyota", model: "Camry", year: 2024, color: "Silver", licensePlate: "ABC-1234", dailyRate: 65, available: true, seats: 5, transmission: "AUTOMATIC", fuelType: "PETROL" },
  { id: 2, brand: "Honda", model: "CR-V", year: 2024, color: "Black", licensePlate: "XYZ-5678", dailyRate: 85, available: true, seats: 5, transmission: "AUTOMATIC", fuelType: "HYBRID" },
  { id: 3, brand: "Tesla", model: "Model 3", year: 2024, color: "White", licensePlate: "EV-0001", dailyRate: 120, available: false, seats: 5, transmission: "AUTOMATIC", fuelType: "ELECTRIC" },
  { id: 4, brand: "BMW", model: "3 Series", year: 2023, color: "Blue", licensePlate: "BMW-320", dailyRate: 110, available: true, seats: 5, transmission: "AUTOMATIC", fuelType: "PETROL" },
  { id: 5, brand: "Ford", model: "Mustang", year: 2024, color: "Red", licensePlate: "MUS-2024", dailyRate: 150, available: true, seats: 4, transmission: "MANUAL", fuelType: "PETROL" },
];

const emptyFormData: CreateCarRequest = {
  brand: "",
  model: "",
  year: new Date().getFullYear(),
  color: "",
  licensePlate: "",
  dailyRate: 0,
  seats: 5,
  transmission: "AUTOMATIC",
  fuelType: "PETROL",
  imageUrl: "",
  description: "",
};

export default function AdminCarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [formData, setFormData] = useState<CreateCarRequest>(emptyFormData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await carService.getAllCars();
        setCars(data);
        setFilteredCars(data);
      } catch {
        setCars(mockCars);
        setFilteredCars(mockCars);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      setFilteredCars(
        cars.filter(
          (car) =>
            car.brand.toLowerCase().includes(term) ||
            car.model.toLowerCase().includes(term) ||
            car.licensePlate.toLowerCase().includes(term)
        )
      );
    } else {
      setFilteredCars(cars);
    }
  }, [searchTerm, cars]);

  const handleOpenDialog = (car?: Car) => {
    if (car) {
      setSelectedCar(car);
      setFormData({
        brand: car.brand,
        model: car.model,
        year: car.year,
        color: car.color,
        licensePlate: car.licensePlate,
        dailyRate: car.dailyRate,
        seats: car.seats,
        transmission: car.transmission,
        fuelType: car.fuelType,
        imageUrl: car.imageUrl || "",
        description: car.description || "",
      });
    } else {
      setSelectedCar(null);
      setFormData(emptyFormData);
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.brand || !formData.model || !formData.licensePlate || formData.dailyRate <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSaving(true);
    try {
      if (selectedCar) {
        const updated = await carService.updateCar(selectedCar.id, formData);
        setCars((prev) => prev.map((c) => (c.id === selectedCar.id ? updated : c)));
        toast.success("Car updated successfully");
      } else {
        const created = await carService.createCar(formData);
        setCars((prev) => [...prev, created]);
        toast.success("Car created successfully");
      }
      setIsDialogOpen(false);
    } catch {
      toast.error(selectedCar ? "Failed to update car" : "Failed to create car");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCar) return;

    try {
      await carService.deleteCar(selectedCar.id);
      setCars((prev) => prev.filter((c) => c.id !== selectedCar.id));
      toast.success("Car deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedCar(null);
    } catch {
      toast.error("Failed to delete car");
    }
  };

  const handleToggleAvailability = async (car: Car) => {
    try {
      const updated = await carService.toggleAvailability(car.id);
      setCars((prev) => prev.map((c) => (c.id === car.id ? updated : c)));
      toast.success(`Car is now ${updated.available ? "available" : "unavailable"}`);
    } catch {
      toast.error("Failed to update availability");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Manage Cars</h1>
              <p className="text-muted-foreground">
                Add, edit, or remove vehicles from your fleet
              </p>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Car
            </Button>
          </div>

          {/* Search */}
          <Card>
            <CardContent className="p-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by brand, model, or license plate..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Cars Table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner className="h-8 w-8" />
            </div>
          ) : filteredCars.length === 0 ? (
            <Empty
              title="No cars found"
              description={searchTerm ? "Try a different search term" : "Add your first car to get started"}
            />
          ) : (
            <Card>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>License Plate</TableHead>
                      <TableHead>Daily Rate</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Specs</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCars.map((car) => (
                      <TableRow key={car.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                              <CarIcon className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium">{car.brand} {car.model}</p>
                              <p className="text-sm text-muted-foreground">
                                {car.year} • {car.color}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="rounded bg-muted px-2 py-1 text-sm">{car.licensePlate}</code>
                        </TableCell>
                        <TableCell className="font-semibold">${car.dailyRate}/day</TableCell>
                        <TableCell>
                          <Badge
                            variant={car.available ? "default" : "secondary"}
                            className="cursor-pointer"
                            onClick={() => handleToggleAvailability(car)}
                          >
                            {car.available ? "Available" : "Unavailable"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {car.seats} seats • {car.transmission === "AUTOMATIC" ? "Auto" : "Manual"}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenDialog(car)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedCar(car);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          )}
        </div>

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedCar ? "Edit Car" : "Add New Car"}</DialogTitle>
              <DialogDescription>
                {selectedCar ? "Update the car details below" : "Fill in the details for the new car"}
              </DialogDescription>
            </DialogHeader>

            <FieldGroup>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel>Brand *</FieldLabel>
                  <Input
                    value={formData.brand}
                    onChange={(e) => setFormData((f) => ({ ...f, brand: e.target.value }))}
                    placeholder="Toyota"
                  />
                </Field>
                <Field>
                  <FieldLabel>Model *</FieldLabel>
                  <Input
                    value={formData.model}
                    onChange={(e) => setFormData((f) => ({ ...f, model: e.target.value }))}
                    placeholder="Camry"
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel>Year *</FieldLabel>
                  <Input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData((f) => ({ ...f, year: parseInt(e.target.value) }))}
                  />
                </Field>
                <Field>
                  <FieldLabel>Color *</FieldLabel>
                  <Input
                    value={formData.color}
                    onChange={(e) => setFormData((f) => ({ ...f, color: e.target.value }))}
                    placeholder="Silver"
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel>License Plate *</FieldLabel>
                  <Input
                    value={formData.licensePlate}
                    onChange={(e) => setFormData((f) => ({ ...f, licensePlate: e.target.value }))}
                    placeholder="ABC-1234"
                  />
                </Field>
                <Field>
                  <FieldLabel>Daily Rate ($) *</FieldLabel>
                  <Input
                    type="number"
                    value={formData.dailyRate}
                    onChange={(e) => setFormData((f) => ({ ...f, dailyRate: parseFloat(e.target.value) }))}
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Field>
                  <FieldLabel>Seats</FieldLabel>
                  <Input
                    type="number"
                    value={formData.seats}
                    onChange={(e) => setFormData((f) => ({ ...f, seats: parseInt(e.target.value) }))}
                  />
                </Field>
                <Field>
                  <FieldLabel>Transmission</FieldLabel>
                  <Select
                    value={formData.transmission}
                    onValueChange={(v) => setFormData((f) => ({ ...f, transmission: v as "AUTOMATIC" | "MANUAL" }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AUTOMATIC">Automatic</SelectItem>
                      <SelectItem value="MANUAL">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>Fuel Type</FieldLabel>
                  <Select
                    value={formData.fuelType}
                    onValueChange={(v) => setFormData((f) => ({ ...f, fuelType: v as CreateCarRequest["fuelType"] }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PETROL">Petrol</SelectItem>
                      <SelectItem value="DIESEL">Diesel</SelectItem>
                      <SelectItem value="ELECTRIC">Electric</SelectItem>
                      <SelectItem value="HYBRID">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <Field>
                <FieldLabel>Image URL</FieldLabel>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) => setFormData((f) => ({ ...f, imageUrl: e.target.value }))}
                  placeholder="https://example.com/car-image.jpg"
                />
              </Field>

              <Field>
                <FieldLabel>Description</FieldLabel>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Brief description of the car"
                />
              </Field>
            </FieldGroup>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Spinner className="mr-2 h-4 w-4" /> : null}
                {selectedCar ? "Update Car" : "Add Car"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Car</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {selectedCar?.brand} {selectedCar?.model}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </AdminLayout>
    </ProtectedRoute>
  );
}
