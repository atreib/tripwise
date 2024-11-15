"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Plane,
  Calendar,
  Palmtree,
  Wallet,
  Heart,
  Loader2Icon,
  ClockIcon,
  TreePalmIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as React from "react";
import { createTripAction } from "./actions";
import { Trip } from "@/lib/trips-service/types";
import LongLoading from "./long-loading.client";
import { destinations } from "@/lib/destinations-service/destinations.client";
import { DestinationSelector } from "./destination-selector.client";

const steps = [
  {
    id: "destination",
    title: "Where would you like to go?",
    description: "The world is your oyster! Where shall we whisk you away to?",
    icon: <Plane className="w-6 h-6" />,
  },
  {
    id: "duration",
    title: "How long is your adventure?",
    description:
      "From quick getaways to extended explorations, let's tailor your time away!",
    icon: <Calendar className="w-6 h-6" />,
  },
  {
    id: "season",
    title: "When are you planning to embark?",
    description:
      "Every season has its charm. When do you want to make memories?",
    icon: <Palmtree className="w-6 h-6" />,
  },
  {
    id: "budget",
    title: "What's your ideal spending style?",
    description:
      "From cozy to luxurious, let's find the perfect fit for your wallet!",
    icon: <Wallet className="w-6 h-6" />,
  },
  {
    id: "purpose",
    title: "What's the occasion?",
    description: "Business or pleasure? Or perhaps a bit of both?",
    icon: <Heart className="w-6 h-6" />,
  },
  {
    id: "loading",
    title: "We are planning your trip...",
    description: "This might take a while, please be patient.",
    icon: <ClockIcon className="w-6 h-6" />,
  },
];

type Props = {
  defaultOpen?: boolean;
};

export default function TripPlannerWizard({ defaultOpen = false }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(defaultOpen);
  const [error, setError] = useState<string>();
  const [currentStep, setCurrentStep] = useState(0);
  const [tripPlan, setTripPlan] = useState<
    Pick<Trip, "destination" | "duration" | "season" | "budget" | "purpose">
  >({
    destination: "",
    duration: "days",
    season: "spring",
    budget: "luxury",
    purpose: "leisure",
  });

  const handleNext = async () => {
    if (isLoading) return;
    if (currentStep === steps.length - 1) return;
    setIsLoading(true);
    let isCreating = false;
    try {
      if (currentStep < steps.length - 2) {
        setCurrentStep(currentStep + 1);
      } else {
        isCreating = true;
        setCurrentStep(currentStep + 1);
        const res = await createTripAction({
          destination: tripPlan.destination,
          duration: tripPlan.duration,
          season: tripPlan.season,
          budget: tripPlan.budget,
          purpose: tripPlan.purpose,
        });
        if (!res?.serverError || !res.data?.id)
          throw new Error(res?.serverError ?? "Whoops, something went wrong");
      }
    } catch (err) {
      const error = err as Error;
      if (error.message !== "NEXT_REDIRECT") {
        setError(error.message);
        setIsLoading(false);
      }
    } finally {
      if (!isCreating) setIsLoading(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      setOpen(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setTripPlan({ ...tripPlan, [field]: value });
  };

  const isStepComplete = () => {
    const currentField = steps[currentStep].id;
    return tripPlan[currentField as keyof typeof tripPlan] !== "";
  };

  const renderStepContent = () => {
    const step = steps[currentStep];
    switch (step.id) {
      case "destination":
        return (
          <DestinationSelector
            destinations={destinations}
            onSelect={(value) => handleInputChange("destination", value)}
            selectedDestination={tripPlan.destination}
          />
        );
      case "duration":
        return (
          <RadioGroup
            value={tripPlan.duration}
            onValueChange={(value) => handleInputChange("duration", value)}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="days" id="days" />
              <Label htmlFor="days">Days</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="weeks" id="weeks" />
              <Label htmlFor="weeks">Weeks</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="months" id="months" />
              <Label htmlFor="months">Months</Label>
            </div>
          </RadioGroup>
        );
      case "season":
        return (
          <RadioGroup
            value={tripPlan.season}
            onValueChange={(value) => handleInputChange("season", value)}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="spring" id="spring" />
              <Label htmlFor="spring">Spring</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="summer" id="summer" />
              <Label htmlFor="summer">Summer</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="autumn" id="autumn" />
              <Label htmlFor="autumn">Autumn</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="winter" id="winter" />
              <Label htmlFor="winter">Winter</Label>
            </div>
          </RadioGroup>
        );
      case "budget":
        return (
          <RadioGroup
            value={tripPlan.budget}
            onValueChange={(value) => handleInputChange("budget", value)}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="luxury" id="luxury" />
              <Label htmlFor="luxury">Luxury</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="moderate" id="moderate" />
              <Label htmlFor="moderate">Mid-range</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="low budget" id="low budget" />
              <Label htmlFor="low budget">Budget-friendly</Label>
            </div>
          </RadioGroup>
        );
      case "purpose":
        return (
          <RadioGroup
            value={tripPlan.purpose}
            onValueChange={(value) => handleInputChange("purpose", value)}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="business" id="business" />
              <Label htmlFor="business">Business</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="leisure" id="leisure" />
              <Label htmlFor="leisure">Leisure</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="romantic getaway" id="romantic getaway" />
              <Label htmlFor="romantic getaway">Romantic Getaway</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="family" id="family" />
              <Label htmlFor="family">Family</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="adventure" id="adventure" />
              <Label htmlFor="adventure">Adventure</Label>
            </div>
          </RadioGroup>
        );
      case "loading":
        return <LongLoading />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <TreePalmIcon className="w-4 h-4" />
          Plan a new trip
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {steps[currentStep].icon}
            {steps[currentStep].title}
          </DialogTitle>
          <DialogDescription>
            {steps[currentStep].description}
          </DialogDescription>
        </DialogHeader>
        <AnimatePresence mode="wait">
          <motion.div
            className="mx-1"
            key={currentStep}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
        {error ? (
          <aside>
            <p className="text-destructive text-sm">{error}</p>
          </aside>
        ) : null}
        <div className="w-full flex items-center justify-between">
          <Button
            onClick={handlePrevious}
            variant="outline"
            disabled={isLoading}
          >
            {currentStep === 0 ? "Cancel" : "Previous"}
          </Button>
          <Button
            onClick={handleNext}
            disabled={isLoading || !isStepComplete()}
          >
            {isLoading ? (
              <>
                <Loader2Icon className="w-4 h-4 animate-spin mr-2" />
                Planning your trip
              </>
            ) : currentStep === steps.length - 2 ? (
              "Plan my trip"
            ) : (
              "Next"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
