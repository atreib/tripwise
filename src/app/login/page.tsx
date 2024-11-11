import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "./components.client";
import { appConstants } from "../constants";

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-primary p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="gap-4">
          <CardTitle className="text-3xl font-bold text-center text-primary">
            <span className="sr-only">{appConstants.APP_NAME}</span>
            <img
              src="/icons/logo-no-background.svg"
              alt={appConstants.APP_NAME}
              className="overflow-hidden object-cover object-center mx-auto w-[70%]"
            />
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to plan your next adventure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
