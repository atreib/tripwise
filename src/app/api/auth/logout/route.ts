import { getAuthService } from "@/lib/auth-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await getAuthService().logout();
  return NextResponse.redirect(new URL("/", request.url));
}
