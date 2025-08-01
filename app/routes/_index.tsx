import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { createUserSession, getUserId } from "~/utils/session.server";
import { login } from "../utils/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "ASL BoQ - Login" },
    { name: "description", content: "Login to ASL BoQ System" },
  ];
};

type ActionData = {
  formError?: string;
  fieldErrors?: {
    username?: string;
    password?: string;
  };
  fields?: {
    username: string;
    password: string;
  };
};

// Validate the form inputs
function validateUsername(username: string) {
  if (username.length < 3) {
    return "Username must be at least 3 characters";
  }
}

function validatePassword(password: string) {
  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }
}

// Check if user is already logged in
export const loader: LoaderFunction = async ({
  request,
}: {
  request: Request;
}) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/dashboard");
  return json({});
};

// Handle login form submission
export const action: ActionFunction = async ({
  request,
}: {
  request: Request;
}) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = formData.get("redirectTo") || "/dashboard";

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return json({ formError: "Form submitted incorrectly" }, { status: 400 });
  }

  const fields = { email, password };
  // You can add email/password validation here if needed

  // Use MongoDB login
  const user = await login(email, password);
  if (!user) {
    return json(
      {
        fields,
        formError: "Invalid email or password",
      },
      { status: 400 }
    );
  }

  // Store user id and role in session
  return createUserSession(user._id.toString(), redirectTo, user.role);
};

export default function Index() {
  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.fieldErrors?.username) {
      usernameRef.current?.focus();
    } else if (actionData?.fieldErrors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h3 className="text-4xl font-bold text-center">Login</h3>
      <h5 className="text-gray-400">Sign In to Continue</h5>

      <div className="px-8 py-8 mt-4 bg-white shadow-lg w-96">
        {actionData?.formError && (
          <div className="p-3 mb-4 text-white bg-red-500 rounded">
            {actionData.formError}
          </div>
        )}

        <Form method="post">
          <input type="hidden" name="redirectTo" value={redirectTo} />

          <div className="flex flex-col">
            <label htmlFor="email" className="text-gray-500">
            Email
            </label>
            <input
            ref={usernameRef}
            type="email"
            id="email"
            name="email"
            className="w-full px-4 py-2 border"
            defaultValue={actionData?.fields?.email}
            />
            </div>

          <div className="flex flex-col mt-4">
            <label htmlFor="password" className="text-gray-500">
              Password
            </label>
            <input
              ref={passwordRef}
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-2 border"
              defaultValue={actionData?.fields?.password}
              aria-invalid={
                actionData?.fieldErrors?.password ? "true" : undefined
              }
              aria-errormessage={
                actionData?.fieldErrors?.password ? "password-error" : undefined
              }
            />
            {actionData?.fieldErrors?.password && (
              <p className="text-red-500 text-sm" id="password-error">
                {actionData.fieldErrors.password}
              </p>
            )}
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full px-4 py-2 text-white font-bold bg-blue-500 hover:bg-blue-800 rounded-md"
            >
              Login
            </button>
          </div>
        </Form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
