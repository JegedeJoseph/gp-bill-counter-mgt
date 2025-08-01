import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { useEffect } from "react";
import { ClientOnly } from "~/utils/client-only";
import { isBrowser } from "~/utils/browser";

import "./tailwind.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/700.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap",
  },
];

// Separate client-side prefetching logic
function PrefetchResources() {
  const location = useLocation();

  useEffect(() => {
    // Prefetch dashboard resources if we're on the login page
    if (location.pathname === "/") {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = "/dashboard";
      link.as = "document";
      document.head.appendChild(link);
    }
  }, [location]);

  return null;
}

export function Layout({ children }: { children: React.ReactNode }) {
  // Add a null check for children to prevent the error
  if (!children) {
    // Return a minimal layout if children is null
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
        </head>
        <body>
          <div>An error occurred loading the application.</div>
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        {/* Only run prefetching on client */}
        <ClientOnly>
          <PrefetchResources />
        </ClientOnly>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

// Add a custom error boundary
export function ErrorBoundary() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <title>Error</title>
      </head>
      <body>
        <div className="error-container">
          <h1>Something went wrong</h1>
          <p>An unexpected error occurred. Please try again later.</p>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
