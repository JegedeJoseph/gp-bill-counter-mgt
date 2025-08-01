import { createCookieSessionStorage, redirect } from "@remix-run/node";

// Session storage configuration
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "asl_boq_session",
    secure: process.env.NODE_ENV === "production",
    secrets: ["s3cr3t"], // Replace with env variable in production
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
  },
});

// Create user session with role
export async function createUserSession(
  userId: string,
  redirectTo: string,
  role: string
) {
  const session = await sessionStorage.getSession();
  session.set("userId", userId);
  session.set("role", role);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

// Get the user session
export async function getUserSession(request: Request) {
  return sessionStorage.getSession(request.headers.get("Cookie"));
}

// Get the logged in user ID (string)
export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") return null;
  return userId;
}

// Get the logged in user's role
export async function getUserRole(request: Request) {
  const session = await getUserSession(request);
  const role = session.get("role");
  if (!role || typeof role !== "string") return null;
  return role;
}

// Require user to be logged in
export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const userId = await getUserId(request);
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/?${searchParams}`);
  }
  return userId;
}

// Require user to have a specific role
export async function requireRole(
  request: Request,
  allowedRoles: string[] = []
) {
  const role = await getUserRole(request);
  if (!role || (allowedRoles.length > 0 && !allowedRoles.includes(role))) {
    throw redirect("/unauthorized");
  }
  return role;
}

// Logout user
export async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
