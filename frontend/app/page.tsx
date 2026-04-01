"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MainLayout } from "@/components/layouts/main-layout";
import { 
  Car, 
  Shield, 
  Clock, 
  CreditCard,
  ChevronRight,
  MapPin,
  Calendar
} from "lucide-react";

const features = [
  {
    icon: Car,
    title: "Wide Selection",
    description: "Choose from our extensive fleet of vehicles, from economy to luxury cars.",
  },
  {
    icon: Shield,
    title: "Fully Insured",
    description: "All our vehicles come with comprehensive insurance coverage for your peace of mind.",
  },
  {
    icon: Clock,
    title: "Flexible Booking",
    description: "Book a rental car the same day or months in advance with free cancellation.",
  },
  {
    icon: CreditCard,
    title: "Easy Payments",
    description: "Multiple payment options available with transparent pricing and no hidden fees.",
  },
];

export default function HomePage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-card">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground lg:text-6xl">
              Find your perfect ride
            </h1>
            <p className="mb-8 text-lg text-muted-foreground lg:text-xl">
              Rent a car for a weekend getaway or even a month. Compare and book in minutes with DriveEase.
            </p>
            
            {/* Search Card */}
            <Card className="mx-auto max-w-2xl">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                  <div className="flex-1">
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      <MapPin className="mb-1 inline h-4 w-4" /> Pick-up Location
                    </label>
                    <input
                      type="text"
                      placeholder="City or airport"
                      className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      <Calendar className="mb-1 inline h-4 w-4" /> Pick-up Date
                    </label>
                    <input
                      type="date"
                      className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <Button size="lg" asChild>
                    <Link href="/cars">
                      Search
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              Car rental made easy
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Compare prices and cars from popular rental companies to find the best deal for you.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 bg-card shadow-none">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-primary-foreground">
            Ready to hit the road?
          </h2>
          <p className="mb-8 text-primary-foreground/80">
            Browse our selection of vehicles and book your perfect ride today.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/cars">
              Browse All Cars
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </MainLayout>
  );
}
