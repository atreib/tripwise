"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2Icon } from "lucide-react";
import { useState } from "react";

type Props = {
  destinations: string[];
  onSelect: (destination: string) => void;
  selectedDestination?: string;
};

export function DestinationSelector({
  destinations,
  onSelect,
  selectedDestination,
}: Props) {
  const [search, setSearch] = useState("");

  const filteredDestinations = search
    ? destinations
        .filter((destination) =>
          destination.toLowerCase().includes(search.toLowerCase())
        )
        .sort()
        .slice(0, 5)
    : destinations.slice(0, 5).sort();

  return (
    <div className="w-full flex flex-col gap-4">
      <header>
        <Input
          placeholder="Type to search for other destinations"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </header>
      {selectedDestination ? (
        <section className="text-muted-foreground text-sm">
          Selected: {selectedDestination}
        </section>
      ) : null}
      <section className="divide-y">
        {filteredDestinations.map((destination) => (
          <div
            className="p-2 flex justify-between items-center"
            key={destination}
          >
            {destination}
            <div className="flex gap-2 items-center">
              {selectedDestination === destination ? (
                <CheckCircle2Icon className="text-primary h-6 w-6" />
              ) : null}
              <Button
                onClick={() => onSelect(destination)}
                variant="secondary"
                disabled={selectedDestination === destination}
              >
                {selectedDestination === destination ? "Selected" : "Select"}
              </Button>
            </div>
          </div>
        ))}
      </section>
      <footer className="text-sm text-muted-foreground">
        Hey, I know we are missing a lot of cool places to go! We are working on
        adding more destinations pretty soon. Thanks for your patience!
      </footer>
    </div>
  );
}
