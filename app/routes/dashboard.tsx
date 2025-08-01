import { Outlet } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/react";
import { AppNav } from "../appnav";
import { SideMenu } from "../sidemenu";
import { getUserId } from "~/utils/session.server";
import { AntdProvider } from "~/utils/antd-config";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  // If you need the full user object, fetch it from MongoDB here using userId
  return json({ userId });
};

export default function Dashboard() {
  return (
    <AntdProvider>
      <main className="w-screen h-screen">
        <AppNav />
        <section className="w-screen h-[100%] flex">
          <SideMenu />
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </section>
      </main>
    </AntdProvider>
  );
}
