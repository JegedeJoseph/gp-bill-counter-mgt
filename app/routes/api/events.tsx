import { json } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/react";

// Define the event interface
export interface Event {
  id: number;
  name: string;
  date: string;
  guestCount: number;
  location?: string;
  description?: string;
  recipes: Array<{
    id: string;
    name: string;
    type: string;
    servings: number;
  }>;
  createdAt: string;
}

// Define and export the events data
export const eventsData: Event[] = [
  {
    id: 1,
    name: "Corporate Lunch",
    date: "2023-12-15",
    guestCount: 50,
    location: "Office Building",
    description: "Annual company lunch",
    recipes: [
      { id: "1", name: "Caesar Salad", type: "appetizer", servings: 60 },
      { id: "2", name: "Grilled Chicken", type: "main", servings: 55 },
      { id: "3", name: "Chocolate Mousse", type: "dessert", servings: 50 },
    ],
    createdAt: "2023-11-01T12:00:00Z",
  },
];

// GET all events
export const loader: LoaderFunction = async () => {
  return json(eventsData);
};

// POST a new event
export const action: ActionFunction = async ({ request }) => {
  const method = request.method.toLowerCase();

  if (method === "post") {
    const formData = await request.json();
    const newId =
      eventsData.length > 0
        ? Math.max(...eventsData.map((event) => event.id)) + 1
        : 1;

    const newEvent = {
      id: newId,
      ...formData,
      createdAt: new Date().toISOString(),
    };

    eventsData.push(newEvent);
    return json(newEvent, { status: 201 });
  }

  return json({ error: "Method not allowed" }, { status: 405 });
};
