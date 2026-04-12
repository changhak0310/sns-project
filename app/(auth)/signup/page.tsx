import { redirect } from "next/navigation";

import { SignupForm } from "@/features/auth/components/signup-form";
import { getSessionUser } from "@/lib/session/auth-session";
import { resolveRedirectTo } from "@/lib/session/redirect";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string | string[] }>;
}) {
  const sessionUser = await getSessionUser();
  const { redirect: redirectTo } = await searchParams;

  if (sessionUser) {
    redirect(resolveRedirectTo(redirectTo));
  }

  return <SignupForm />;
}
