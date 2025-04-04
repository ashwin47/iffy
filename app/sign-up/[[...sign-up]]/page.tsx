import { env } from "@/lib/env";
import { SignUp } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";

export default async function Page() {
  const { userId } = await auth();

  if (!env.ENABLE_PUBLIC_SIGNUP) {
    return notFound();
  }

  if (!userId) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <SignUp />
      </div>
    );
  }

  return redirect("/dashboard");
}
