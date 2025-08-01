import { json, LoaderFunction } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { Card, Descriptions, Table, Tag, Divider } from "antd";
import { eventsData, Event } from "~/routes/api/events";

export const loader: LoaderFunction = async ({ params }) => {
  const eventId = params.eventID ? parseInt(params.eventID) : null;
  if (!eventId) {
    throw new Response("Event ID is required", { status: 400 });
  }

  const event = eventsData.find((e) => e.id === eventId);
  if (!event) {
    throw new Response("Event not found", { status: 404 });
  }

  return json({ event });
};

export default function EventDetails() {
  const { event } = useLoaderData<{ event: Event }>();

  const recipeColumns = [
    {
      title: "Recipe Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: string) => (
        <Tag color={getRecipeTypeColor(type)}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Tag>
      ),
    },
    {
      title: "Servings",
      dataIndex: "servings",
      key: "servings",
    },
    {
      title: "Servings per Guest",
      key: "servingsPerGuest",
      render: (_, record: any) => (
        <span>{(record.servings / event.guestCount).toFixed(2)}</span>
      ),
    },
  ];

  const getRecipeTypeColor = (type: string) => {
    switch (type) {
      case "appetizer":
        return "green";
      case "main":
        return "red";
      case "side":
        return "orange";
      case "dessert":
        return "purple";
      case "beverage":
        return "blue";
      default:
        return "default";
    }
  };

  return (
    <section className="container h-[100%] bg-slate-100 p-5">
      <h1 className="text-4xl mb-5">Event Details</h1>

      <Card className="mb-5">
        <Descriptions title="Event Information" bordered>
          <Descriptions.Item label="Event Name" span={3}>
            {event.name}
          </Descriptions.Item>
          <Descriptions.Item label="Date">
            {new Date(event.date).toLocaleDateString()}
          </Descriptions.Item>
          <Descriptions.Item label="Number of Guests">
            {event.guestCount}
          </Descriptions.Item>
          <Descriptions.Item label="Location">
            {event.location || "Not specified"}
          </Descriptions.Item>
          <Descriptions.Item label="Description" span={3}>
            {event.description || "No description provided"}
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {new Date(event.createdAt).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Divider orientation="left">Recipes</Divider>

      <Table
        dataSource={event.recipes}
        columns={recipeColumns}
        rowKey="id"
        pagination={false}
      />

      <Divider orientation="left">Recipe Management</Divider>

      <div className="grid grid-cols-2 gap-4">
        <Card title="Recipe Distribution" className="bg-white">
          <div className="flex flex-wrap gap-2">
            {["appetizer", "main", "side", "dessert", "beverage"].map(
              (type) => {
                const count = event.recipes.filter(
                  (r) => r.type === type
                ).length;
                if (count === 0) return null;
                return (
                  <div key={type} className="text-center p-2">
                    <Tag color={getRecipeTypeColor(type)} className="px-2 py-1">
                      {type.charAt(0).toUpperCase() + type.slice(1)}: {count}
                    </Tag>
                  </div>
                );
              }
            )}
          </div>
        </Card>

        <Card title="Servings Analysis" className="bg-white">
          <ul className="list-disc pl-5">
            <li>
              Total servings:{" "}
              {event.recipes.reduce((sum, r) => sum + r.servings, 0)}
            </li>
            <li>
              Average servings per guest:{" "}
              {(
                event.recipes.reduce((sum, r) => sum + r.servings, 0) /
                event.guestCount
              ).toFixed(2)}
            </li>
            <li>
              Main course servings per guest:{" "}
              {(
                event.recipes
                  .filter((r) => r.type === "main")
                  .reduce((sum, r) => sum + r.servings, 0) / event.guestCount
              ).toFixed(2)}
            </li>
          </ul>
        </Card>
      </div>
    </section>
  );
}
