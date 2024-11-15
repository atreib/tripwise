import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { appConstants } from "./constants";
import { GetStartedButton } from "./get-started-btn";

export const experimental_ppr = true;

type Props = {
  searchParams: Promise<{
    message?: string;
  }>;
};

export default async function LandingPage({ searchParams }: Props) {
  const { message } = await searchParams;

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="px-4 lg:px-6 h-14 flex items-center fixed w-full bg-background/30 backdrop-blur-sm">
        <img
          src="/icons/logo-no-background.svg"
          alt={appConstants.APP_NAME}
          className="hidden lg:inline-block h-8 w-auto"
        />
        <img
          src="/icons/logo-only.png"
          alt={appConstants.APP_NAME}
          className="inline-block lg:hidden h-8 w-auto"
        />
        <nav className="ml-auto flex gap-2 sm:gap-4 items-center">
          <Button className="hidden lg:inline-block" variant="ghost" asChild>
            <Link href="/#features">Features</Link>
          </Button>
          <Button className="hidden lg:inline-block" variant="ghost" asChild>
            <Link href="/#testimonials">Testimonials</Link>
          </Button>
          <GetStartedButton
            label="Sign up"
            whenSignedIn={{ useAvatarButton: true }}
          />
        </nav>
      </header>
      <main className="flex-1 ">
        <section className="w-full py-12 md:py-24 lg:py-24 xl:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px] mt-8 lg:mt-0">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl text-balance text-center lg:text-left">
                    AI-Powered Travel Magic: Your Perfect Trip, Planned in
                    Seconds
                  </h1>
                  <p className="max-w-[600px] mx-auto lg:mx-0 text-center lg:text-left">
                    From personalized itineraries to smart packing lists,{" "}
                    {appConstants.APP_NAME}&apos;s AI crafts your dream vacation
                    effortlessly.{" "}
                    <span className="font-semibold">
                      Explore more, stress less.
                    </span>
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row mx-auto lg:mx-0">
                  <GetStartedButton label="Plan your next trip" />
                </div>
                {message ? (
                  <aside className="text-base text-destructive text-center lg:text-left">
                    {message}
                  </aside>
                ) : (
                  <aside className="text-sm text-muted-foreground animate-pulse text-center lg:text-left">
                    Free for the first {appConstants.FREE_TIER_LIMIT} users,
                    hurry up!
                  </aside>
                )}
              </div>
              <img
                src="/assets/man-enjoying-travel-planned-using-tripwise.png"
                alt="Hero"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted text-foreground"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg px-3 py-1 text-sm">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  {appConstants.APP_NAME}: Your Personal Travel Companion
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {appConstants.APP_NAME} uses advanced AI algorithms to provide
                  you personalized travel recommendations, budget planning, and
                  seamless itinerary generation, making your travel experience
                  effortless and enjoyable.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <img
                src="/assets/tripwise-dashboard-helping-to-plan-your-next-travel.png"
                alt="Feature"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              />
              <div className="flex flex-col justify-center space-y-4">
                <ul className="grid gap-6">
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">
                        Personalized Recommendations
                      </h3>
                      <p className="text-muted-foreground">
                        {appConstants.APP_NAME} analyzes your preferences and
                        travel history to provide you tailored recommendations
                        for destinations, accommodations, and activities.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Budget Planning</h3>
                      <p className="text-muted-foreground">
                        {appConstants.APP_NAME} helps you plan your trip within
                        your budget by providing cost estimates and suggestions
                        for saving money.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">
                        Seamless Itinerary Generation
                      </h3>
                      <p className="text-muted-foreground">
                        {appConstants.APP_NAME} creates a detailed, optimized
                        itinerary for your trip, taking into account your
                        preferences, travel dates, and budget.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section
          id="testimonials"
          className="w-full py-12 md:py-24 lg:py-32 bg-background text-foreground"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg px-3 py-1 text-sm">
                  Testimonials
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  What Our Customers Say
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Hear from real {appConstants.APP_NAME} users about how our
                  AI-powered travel planning has transformed their travel
                  experiences.
                </p>
              </div>
              <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
                <div className="flex flex-col justify-center space-y-4">
                  <div className="space-y-2 bg-muted p-6 rounded-lg">
                    <div className="flex items-center gap-4 justify-center">
                      <Avatar>
                        <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                        <AvatarFallback className="bg-background text-foreground">
                          JD
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">
                          John Doe
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Frequent Traveler
                        </p>
                      </div>
                    </div>
                    <blockquote>
                      {`"${appConstants.APP_NAME} has been a game-changer for my travel\n
                      planning. The personalized recommendations and budget\n
                      guidance have saved me so much time and money. I\n
                      wouldn't plan a trip without it!"`}
                    </blockquote>
                  </div>
                </div>
                <div className="flex flex-col justify-center space-y-4">
                  <div className="space-y-2 bg-muted p-6 rounded-lg">
                    <div className="flex items-center gap-4 justify-center">
                      <Avatar>
                        <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                        <AvatarFallback className="bg-background text-foreground">
                          JS
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">
                          Jane Smith
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Adventurous Traveler
                        </p>
                      </div>
                    </div>
                    <blockquote>
                      {`"I love how ${appConstants.APP_NAME} helps me discover new and\n exciting
                      destinations that fit my travel style and\n budget. The
                      itinerary planning feature is a\n lifesaver!"`}
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container grid items-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Join the {appConstants.APP_NAME} Community
              </h2>
              <p className="mx-auto max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Sign up now to experience the ultimate in personalized travel
                planning and start exploring the world with{" "}
                {appConstants.APP_NAME}.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <form className="flex py-2 mx-auto justify-center items-center">
                <GetStartedButton label="Get started" variant="secondary" />
              </form>
              <p className="text-xs">
                By signing up, you agree to our{" "}
                <Link
                  href="#"
                  className="underline underline-offset-2"
                  prefetch={false}
                >
                  Terms &amp; Conditions
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 bg-primary text-primary-foreground">
        <p className="text-xs">
          &copy; {new Date().getFullYear()} {appConstants.APP_NAME}. All rights
          reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/privacy-policy"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms-of-service"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Terms of Service
          </Link>
        </nav>
      </footer>
    </div>
  );
}
