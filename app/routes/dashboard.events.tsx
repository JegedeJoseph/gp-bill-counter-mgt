import { json, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { eventsData, Event } from "~/routes/api/events";
import { ClientOnly } from "~/utils/client-only";
import React from "react";
import { Table } from "antd";

export const loader = async () => {
  return json({ events: eventsData });
};

export default function Events() {
  const { events } = useLoaderData<{ events: Event[] }>();

  const getRecipeTypeColorClass = (type: string) => {
    switch (type) {
      case "appetizer":
        return "bg-green-500";
      case "main":
        return "bg-red-500";
      case "side":
        return "bg-orange-500";
      case "dessert":
        return "bg-purple-500";
      case "beverage":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const columns = [
    {
      title: "Event Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Event) => (
        <Link to={`/dashboard/eventdetails/${record.id}`}>
          <span className="text-blue-600 hover:underline">{text}</span>
        </Link>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Guests",
      dataIndex: "guestCount",
      key: "guestCount",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Recipes",
      dataIndex: "recipes",
      key: "recipes",
      render: (recipes: any[]) => (
        <div>
          {recipes.slice(0, 3).map((recipe, index) => (
            <span
              key={index}
              className={`inline-block px-2 py-1 mr-1 rounded-full text-white text-xs ${getRecipeTypeColorClass(
                recipe.type
              )}`}
            >
              {recipe.name}
            </span>
          ))}
          {recipes.length > 3 && (
            <span className="inline-block px-2 py-1 rounded-full bg-gray-200 text-gray-700 text-xs">
              +{recipes.length - 3} more
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Event) => (
        <Link to={`../eventdetails/${record.id}`}>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm flex items-center">
            <span className="mr-1">👁️</span> View Details
          </button>
        </Link>
      ),
    },
  ];

  // Fallback table for server-side rendering
  const fallbackTable = (
    <div className="mt-5 ml-5 w-[90%]">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">Event Name</th>
            <th className="py-2 px-4 border-b">Date</th>
            <th className="py-2 px-4 border-b">Guests</th>
            <th className="py-2 px-4 border-b">Location</th>
            <th className="py-2 px-4 border-b">Recipes</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.slice(0, 10).map((event) => (
            <tr key={event.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">
                <Link to={`/dashboard/eventdetails/${event.id}`}>
                  <span className="text-blue-600 hover:underline">
                    {event.name}
                  </span>
                </Link>
              </td>
              <td className="py-2 px-4 border-b">
                {new Date(event.date).toLocaleDateString()}
              </td>
              <td className="py-2 px-4 border-b">{event.guestCount}</td>
              <td className="py-2 px-4 border-b">{event.location}</td>
              <td className="py-2 px-4 border-b">
                {event.recipes.slice(0, 3).map((recipe, index) => (
                  <span
                    key={index}
                    className={`inline-block px-2 py-1 mr-1 rounded-full text-white text-xs ${getRecipeTypeColorClass(
                      recipe.type
                    )}`}
                  >
                    {recipe.name}
                  </span>
                ))}
                {event.recipes.length > 3 && (
                  <span className="inline-block px-2 py-1 rounded-full bg-gray-200 text-gray-700 text-xs">
                    +{event.recipes.length - 3} more
                  </span>
                )}
              </td>
              <td className="py-2 px-4 border-b">
                <Link to={`/dashboard/eventdetails/${event.id}`}>
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm">
                    View Details
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <section className="container h-[100%] bg-slate-100">
      <div className="w-[80%] flex justify-between items-center mt-3 ml-5">
        <h1 className="text-4xl text-gray-900 tracking-tighter">Events</h1>
        <Link to="/dashboard/newevent">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center">
            <span className="mr-1">+</span> Create New Event
          </button>
        </Link>
      </div>

      <ClientOnly fallback={fallbackTable}>
        <div className="mt-5 ml-5 w-[90%]">
          <Table
            dataSource={events}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </div>
      </ClientOnly>
    </section>
  );
}
