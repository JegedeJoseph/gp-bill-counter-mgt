import React, { useState, useEffect } from "react";
import { Link, useLocation } from "@remix-run/react";
import { getStableId } from "~/utils/stable-id";
import {
  DownArrow,
  UpArrow,
  PlusIcon,
  EventIcon,
  ID,
  NewEventIcon,
} from "./icons";

export function SideMenu() {
  // Initialize with closed state for SSR consistency
  const [isVisibleCustomer, setIsVisibleCustomer] = useState<boolean>(false);
  const [isVisibleEvent, setIsVisibleEvent] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<string>("");
  const location = useLocation();

  // Update active item based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("customer")) {
      setActiveItem("customers");
      setIsVisibleCustomer(true);
      setIsVisibleEvent(false);
    } else if (path.includes("event")) {
      setActiveItem("events");
      setIsVisibleEvent(true);
      setIsVisibleCustomer(false);
    } else if (path.includes("menumgt")) {
      setActiveItem("menumgt");
      setIsVisibleCustomer(false);
      setIsVisibleEvent(false);
    } else if (path.includes("boqs")) {
      setActiveItem("boqs");
      setIsVisibleCustomer(false);
      setIsVisibleEvent(false);
    } else if (path.includes("dashboard")) {
      setActiveItem("dashboard");
      setIsVisibleCustomer(false);
      setIsVisibleEvent(false);
    }
  }, [location]);

  const onMenuArrowCustomer = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisibleCustomer(!isVisibleCustomer);
    setIsVisibleEvent(false);
  };

  const onMenuArrowEvent = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisibleEvent(!isVisibleEvent);
    setIsVisibleCustomer(false);
  };

  const getItemClass = (itemName: string) => {
    return `p-3 hover:bg-blue-500 hover:text-white flex justify-between border-b-2 ${
      activeItem === itemName ? "bg-blue-500 text-white" : ""
    }`;
  };

  return (
    <aside className="w-[15%] bg-white border h-[100%]">
      <ul className="list-inside list-none">
        <Link
          to="/dashboard"
          onClick={() => setActiveItem("dashboard")}
          id={getStableId("menu", "dashboard")}
        >
          <li className={getItemClass("dashboard")}>
            <div className="flex">
              <span
                className={
                  activeItem === "dashboard"
                    ? "text-white"
                    : "text-yellow-300 hover:text-white"
                }
              >
                {ID}
              </span>
              <span className="ml-2">Dashboard</span>
            </div>
          </li>
        </Link>
      </ul>
      <ul className="list-inside list-none">
        <Link
          to="./customers"
          onClick={() => setActiveItem("customers")}
          id={getStableId("menu", "customers")}
        >
          <li className={getItemClass("customers")}>
            <div className="flex">
              <span
                className={
                  activeItem === "customers"
                    ? "text-white"
                    : "text-yellow-300 hover:text-white"
                }
              >
                {ID}
              </span>
              <span className="ml-2">Customers</span>
            </div>
            {/*<span onClick={onMenuArrowCustomer}>
              {isVisibleCustomer ? UpArrow : DownArrow}
            </span>*/}
          </li>
        </Link>
        {/*{isVisibleCustomer && (
          <ul className="bg-blue-100 ml-3">
            <Link
              to="./newcustomer"
              onClick={() => setActiveItem("newcustomer")}
              id={getStableId("menu", "newcustomer")}
            >
              <li
                className={`p-3 hover:bg-blue-500 hover:text-white border-b-2 ${
                  activeItem === "newcustomer" ? "bg-blue-500 text-white" : ""
                }`}
              >
                <div className="flex">
                  <span
                    className={
                      activeItem === "newcustomer"
                        ? "text-white"
                        : "text-yellow-300 hover:text-white"
                    }
                  >
                    {PlusIcon}
                  </span>
                  <span className="ml-2">New Customer</span>
                </div>
              </li>
            </Link>
          </ul>
        )}
        */}
        <Link to="./events" onClick={() => setActiveItem("events")}>
          <li className={getItemClass("events")}>
            <div className="flex">
              <span
                className={
                  activeItem === "events"
                    ? "text-white"
                    : "text-yellow-300 hover:text-white"
                }
              >
                {EventIcon}
              </span>
              <span className="ml-2">Events</span>
            </div>
            {/*<span onClick={onMenuArrowEvent}>
              {isVisibleEvent ? UpArrow : DownArrow}
            </span>*/}
          </li>
        </Link>
        {/*{isVisibleEvent && (
          <ul className="bg-blue-100 ml-10">
            <Link to="./newevent" onClick={() => setActiveItem("newevent")}>
              <li
                className={`p-3 hover:bg-blue-500 hover:text-white border-b-2 ${
                  activeItem === "newevent" ? "bg-blue-500 text-white" : ""
                }`}
              >
                <div className="flex">
                  <span
                    className={
                      activeItem === "newevent"
                        ? "text-white"
                        : "text-yellow-300 hover:text-white"
                    }
                  >
                    {NewEventIcon}
                  </span>
                  <span className="ml-2">New Event</span>
                </div>
                <span className="flex"></span>
              </li>
            </Link>
          </ul>
        )}*/}
        <Link to="./menumgt" onClick={() => setActiveItem("menumgt")}>
          <li className={getItemClass("menumgt")}>Menu Management</li>
        </Link>
        <Link
        to="./ingredients_inventory"
        onClick={() => setActiveItem("ingredients_inventory")}
        >
        <li className={getItemClass("ingredients_inventory")}> 
        Ingredients Inventory
        </li>
        </Link>
        <Link
        to="/dashboard/data-editor"
        onClick={() => setActiveItem("data-editor")}
        >
        <li className={getItemClass("data-editor")}> 
        Data Editor
        </li>
        </Link>
        <Link to="./boqs" onClick={() => setActiveItem("boqs")}>
          <li className={getItemClass("boqs")}>BoQ's Generated</li>
        </Link>
      </ul>
    </aside>
  );
}
