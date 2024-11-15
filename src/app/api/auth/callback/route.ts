import { appConstants } from "@/app/constants";
import { getAnalyticsService } from "@/lib/analytics-service/index.server";
import { getUserService } from "@/lib/user-service";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const sessionUser = await currentUser();
  if (!sessionUser)
    return NextResponse.redirect(new URL(appConstants.LOGIN_PATH, request.url));

  const { id, firstName, emailAddresses } = sessionUser;
  const email = emailAddresses.at(0)?.emailAddress;
  if (!email)
    return NextResponse.redirect(new URL(appConstants.LOGIN_PATH, request.url));

  let user = await getUserService().getUserByEmail(email);

  if (!user) {
    const totalUsers = await getUserService().getTotalUsers();
    if (totalUsers < appConstants.FREE_TIER_LIMIT) {
      user = await getUserService().createUser({
        id,
        email,
        name: firstName ?? email.split("@")[0],
        role: "beta",
      });
    }
  } else {
    // Required because of migration between magic link and clerk
    if (user.id !== id) {
      await getUserService().changeUserId(user.id, id);
    }

    user = await getUserService().updateUser(id, {
      email: email,
      name: firstName ?? email.split("@")[0],
    });
  }

  if (!user) {
    return redirect(
      `${appConstants.UNAUTHENTICATED_REDIRECT_PATH}?message=${appConstants.FREE_TIER_FULL_MESSAGE}`
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _, ...attrs } = user;
  await getAnalyticsService().identify({ userId: id, properties: attrs });

  return NextResponse.redirect(
    new URL(appConstants.AUTHENTICATED_REDIRECT_PATH, request.url)
  );
}
