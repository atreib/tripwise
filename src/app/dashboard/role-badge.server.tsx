import { Badge } from "@/components/ui/badge";
import { getAuthService } from "@/lib/auth-service";
import { getUserService } from "@/lib/user-service";

export async function RoleBadge() {
  const userId = await getAuthService().requireAuthSession();
  const user = await getUserService().requireUserById(userId);

  if (user.role === "regular") return null;

  return (
    <Badge variant="secondary" className="capitalize">
      {user.role}
    </Badge>
  );
}
