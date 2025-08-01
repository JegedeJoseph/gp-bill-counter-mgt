import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/react";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { createUserSession, getUserId } from "~/utils/session.server";
import { signup } from "../utils/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "ASL BoQ - Sign Up" },
    { name: "description", content: "Sign up for ASL BoQ System" },
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

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/dashboard");
  return json({});
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const role = formData.get("role");
  const password = formData.get("password");
  const redirectTo = formData.get("redirectTo") || "/dashboard";

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof role !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return json({ formError: "Form submitted incorrectly" }, { status: 400 });
  }

  const fields = { name, email, role, password };
  // You can add validation here if needed

  // Use MongoDB signup
  const user = await signup(name, email, role, password);
  if (!user) {
    return json(
      {
        fields,
        formError: "Email already exists",
      },
      { status: 400 }
    );
  }

  // Store user id and role in session
  return createUserSession(user._id.toString(), redirectTo, user.role);
};

export default function Signup() {
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
    <section className="h-screen w-full flex flex-col items-center justify-center bg-gray-100">
      <div>
        <h1 className="text-4xl font-bold text-center">Sign Up</h1>
      </div>

      <div className="w-96 mt-5 shadow-lg p-8 bg-white">
        {actionData?.formError && (
          <div className="p-3 mb-4 text-white bg-red-500 rounded">
            {actionData.formError}
          </div>
        )}

        <Form method="post">
          <input type="hidden" name="redirectTo" value={redirectTo} />

          <div className="flex flex-col mt-4">
            <label htmlFor="name" className="text-gray-500">
              Name
            </label>
            <input
              ref={usernameRef}
              type="text"
              id="name"
              name="name"
              className="px-4 py-2 border"
              defaultValue={actionData?.fields?.name}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label htmlFor="email" className="text-gray-500">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="px-4 py-2 border"
              defaultValue={actionData?.fields?.email}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label htmlFor="role" className="text-gray-500">
              Role
            </label>
            <select id="role" name="role" className="px-4 py-2 border" defaultValue={actionData?.fields?.role || "user"}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
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
              className="px-4 py-2 border"
              defaultValue={actionData?.fields?.password}
              aria-invalid={Boolean(actionData?.fieldErrors?.password)}
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

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="px-6 py-2 text-white bg-lime-600 hover:bg-lime-700 active:bg-lime-900 rounded-full"
            >
              Create Account
            </button>
          </div>
        </Form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/" className="text-blue-500 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
