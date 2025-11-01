import { getAuthService } from "@/lib/auth-service";
import { getBackpackService } from "@/lib/backpack-service";
import { notFound } from "next/navigation";
import { BackpackItems } from "./backpack-items.client";
import { Metadata } from "next";

export const experimental_ppr = true;

type Props = {
  params: Promise<{
    backpackId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { backpackId } = await params;
  const backpack = await getBackpackService().getBackpackById({ backpackId });

  if (!backpack) {
    return {
      title: "Backpack not found",
    };
  }

  return {
    title: backpack.name,
  };
}

export default async function BackpackPage({ params }: Props) {
  await getAuthService().requireAuthSession();
  const { backpackId } = await params;

  const [backpack, items] = await Promise.all([
    getBackpackService().getBackpackById({ backpackId }),
    getBackpackService().getBackpackItems({ backpackId }),
  ]);

  if (!backpack) {
    notFound();
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <header>
        <h1 className="text-2xl font-bold">{backpack.name}</h1>
        <p className="text-sm text-muted-foreground">
          Created on {new Date(backpack.created_at).toLocaleDateString()}
        </p>
      </header>
      <section>
        <BackpackItems backpackId={backpackId} initialItems={items} />
      </section>
    </div>
  );
}
