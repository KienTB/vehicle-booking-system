"use client";

import Link from "next/link";
import { Car } from "@/lib/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Fuel, Settings2, ChevronRight } from "lucide-react";

interface CarCardProps {
  car: Car;
}

export function CarCard({ car }: CarCardProps) {
  const fuelTypeLabels = {
    PETROL: "Petrol",
    DIESEL: "Diesel",
    ELECTRIC: "Electric",
    HYBRID: "Hybrid",
  };

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      {/* Car Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {car.imageUrl ? (
          <img
            src={car.imageUrl}
            alt={`${car.brand} ${car.model}`}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-6xl text-muted-foreground/30">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="h-20 w-20">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.5-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                <circle cx="7" cy="17" r="2" />
                <path d="M9 17h6" />
                <circle cx="17" cy="17" r="2" />
              </svg>
            </div>
          </div>
        )}
        
        {/* Availability Badge */}
        <Badge
          variant={car.available ? "default" : "secondary"}
          className="absolute right-3 top-3"
        >
          {car.available ? "Available" : "Not Available"}
        </Badge>
      </div>

      <CardContent className="p-4">
        {/* Car Name */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-foreground">
            {car.brand} {car.model}
          </h3>
          <p className="text-sm text-muted-foreground">
            {car.year} • {car.color}
          </p>
        </div>

        {/* Car Features */}
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{car.seats} seats</span>
          </div>
          <div className="flex items-center gap-1">
            <Settings2 className="h-4 w-4" />
            <span>{car.transmission === "AUTOMATIC" ? "Auto" : "Manual"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="h-4 w-4" />
            <span>{fuelTypeLabels[car.fuelType]}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t p-4">
        <div>
          <span className="text-2xl font-bold text-foreground">${car.dailyRate}</span>
          <span className="text-sm text-muted-foreground">/day</span>
        </div>
        <Button asChild size="sm">
          <Link href={`/cars/${car.id}`}>
            View Details
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
