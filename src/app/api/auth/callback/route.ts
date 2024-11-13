import { appConstants } from "@/app/constants";
import { getAnalyticsService } from "@/lib/analytics-service/index.server";
import { getAuthService } from "@/lib/auth-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  const user = await getAuthService().authenticateWithMagicLink(token);
  const { id, ...attrs } = user;
  await getAnalyticsService().identify({ userId: id, properties: attrs });

  return NextResponse.redirect(
    new URL(appConstants.AUTHENTICATED_REDIRECT_PATH, request.url)
  );
}
