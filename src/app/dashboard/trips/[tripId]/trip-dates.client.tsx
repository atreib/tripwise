"use client";

import { useState } from "react";
import { Trip } from "@/lib/trips-service/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, PencilIcon } from "lucide-react";
import { updateTripDatesAction } from "./actions";
import { useAction } from "next-safe-action/hooks";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

type Props = {
  trip: Trip;
};

export function TripDates({ trip }: Props) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [departureDate, setDepartureDate] = useState<Date | undefined>(
    trip.departure_date ? new Date(trip.departure_date) : undefined
  );
  const [returnDate, setReturnDate] = useState<Date | undefined>(
    trip.return_date ? new Date(trip.return_date) : undefined
  );

  const { execute, isExecuting } = useAction(updateTripDatesAction, {
    onSuccess: () => {
      toast({
        title: "Trip dates updated",
        description: "Your trip dates have been updated successfully.",
      });
      setOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update trip dates. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    execute({
      tripId: trip.id,
      departureDate: departureDate ? departureDate.toISOString() : null,
      returnDate: returnDate ? returnDate.toISOString() : null,
    });
  };

  const handleClear = () => {
    setDepartureDate(undefined);
    setReturnDate(undefined);
  };

  const formatDateRange = () => {
    if (!trip.departure_date && !trip.return_date) {
      return "No dates set";
    }

    if (trip.departure_date && trip.return_date) {
      const departure = new Date(trip.departure_date);
      const returnD = new Date(trip.return_date);
      return `${format(departure, "MMM d, yyyy")} to ${format(returnD, "MMM d, yyyy")}`;
    }

    if (trip.departure_date) {
      return `Departing ${format(new Date(trip.departure_date), "MMM d, yyyy")}`;
    }

    if (trip.return_date) {
      return `Returning ${format(new Date(trip.return_date), "MMM d, yyyy")}`;
    }
  };

  return (
    <div className="flex items-center gap-2">
      <CalendarIcon className="w-5 h-5 text-muted-foreground" />
      <span className="text-muted-foreground">{formatDateRange()}</span>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <PencilIcon className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Trip Dates</DialogTitle>
            <DialogDescription>
              Set your departure and return dates for this trip.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row gap-4 py-4">
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-medium">Departure Date</label>
              <Calendar
                mode="single"
                selected={departureDate}
                onSelect={setDepartureDate}
                className="rounded-md border"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-medium">Return Date</label>
              <Calendar
                mode="single"
                selected={returnDate}
                onSelect={setReturnDate}
                className="rounded-md border"
              />
            </div>
          </div>
          <DialogFooter className="flex flex-row justify-between">
            <Button
              variant="outline"
              onClick={handleClear}
              disabled={isExecuting}
            >
              Clear Dates
            </Button>
            <Button onClick={handleSave} disabled={isExecuting}>
              {isExecuting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
