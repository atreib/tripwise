import { ClerkProvider } from "@clerk/nextjs";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
