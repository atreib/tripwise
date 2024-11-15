import { appConstants } from "@/app/constants";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-primary p-4">
      <SignIn
        signUpForceRedirectUrl={`${process.env.APP_URL}${appConstants.SIGN_UP_CALLBACK_PATH}`}
        forceRedirectUrl={`${process.env.APP_URL}${appConstants.SIGN_UP_CALLBACK_PATH}`}
      />
    </div>
  );
}
