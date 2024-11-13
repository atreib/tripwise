import { getAuthService } from "@/lib/auth-service";
import { getUserService } from "@/lib/user-service";
import { FeedbackForm } from "./feedback-form.client";

export default async function BetaFeedbackPage() {
  const userId = await getAuthService().requireAuthSession();
  await getUserService().requireBetaAccess(userId);

  return (
    <div className="flex flex-col gap-8 bg-card border rounded-lg p-8 w-full">
      <header>
        <h1 className="text-2xl font-bold">Feedback form</h1>
        <p className="text-sm text-muted-foreground">
          We&apos;re always looking for ways to improve our product. Please take
          a moment to share your thoughts and suggestions.
        </p>
      </header>
      <section>
        <FeedbackForm />
      </section>
    </div>
  );
}
