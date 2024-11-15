import { appConstants } from "@/app/constants";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-primary p-4">
      <SignUp
        signInForceRedirectUrl={`${process.env.APP_URL}${appConstants.SIGN_UP_CALLBACK_PATH}`}
      />
    </div>
  );
}
