import React from "react";
import { Form } from "@remix-run/react";
import { logout } from "./icons";
import asl_logo from "/images/asl_logo.png";

export function AppNav() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <nav className="flex items-center justify-between w-[100%] text-white h-[5%] bg-cyan-600">
      <div>
        <img src={asl_logo} alt="logo" />
      </div>
      <a className="text-xl ">ASL BoQ</a>

      <div className="flex items-center justify-around w-[15%]">
        <label className="font-bold">{currentDate}</label>
        <Form method="post" action="/logout">
          <button
            type="submit"
            className="bg-transparent border-none cursor-pointer"
          >
            <span className="font-bold">{logout}</span>
          </button>
        </Form>
      </div>
    </nav>
  );
}
