import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {}
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user) {
      const user = data.user;
      const role = user.user_metadata?.role || "worker";

      // Check if profile is already complete (has contact info)
      const { data: profile } = await supabase
        .from("profiles")
        .select("current_address")
        .eq("id", user.id)
        .single();

      if (!profile?.current_address) {
        // Profile incomplete — send to onboarding
        return NextResponse.redirect(`${origin}/onboarding`, { status: 303 });
      }

      // Profile complete — send to dashboard
      const destination =
        role === "employer" ? "/employer/dashboard" : "/dashboard/worker";
      return NextResponse.redirect(`${origin}${destination}`, { status: 303 });
    }
  }

  // Something went wrong
  return NextResponse.redirect(`${origin}/?auth_error=true`, { status: 303 });
}