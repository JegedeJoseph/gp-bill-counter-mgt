import { json, LoaderFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import React, { useState } from "react";
import {
  Plus,
  Minus,
  Calculator,
  Users,
  Calendar,
  Clock,
  ChefHat,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ingredients, menuItems } from "~/data/cateringData";

// Types

type SelectedMenu = {
  name: string;
  quantity: number; // number of guests/portions for this menu
  unitPrice: number;
  totalPrice: number;
  ingredients: Array<{
    name: string;
    quantity: string;
    unitPrice: number;
    totalPrice: number;
  }>;
};

type EventDetails = {
  eventName: string;
  eventType: string;
  numberOfGuests: string; // still input, but not used in bill summary
  cateringService: string;
  eventDate: string;
  eventStartTime: string;
  eventEndTime: string;
  selectedMenus: SelectedMenu[];
};

export const loader: LoaderFunction = async () => {
  return json({});
};

// Extra cost mapping for catering services
const cateringServiceExtraCost: Record<string, number> = {
  "Full Service": 50000,
  "Drop-off": 10000,
  "Buffet Style": 30000,
  "Plated Service": 40000,
  "Cocktail Reception": 20000,
};

// Cost per hour for event duration
const costPerHour = 10000;

export default function NewEvent() {
  const [eventDetails, setEventDetails] = useState<EventDetails>({
    eventName: "",
    eventType: "",
    numberOfGuests: "",
    cateringService: "",
    eventDate: "",
    eventStartTime: "",
    eventEndTime: "",
    selectedMenus: [],
  });
  // Track which ingredient breakdowns are open
  const [openMenus, setOpenMenus] = useState<Record<number, boolean>>({});

  const eventTypes = [
    "Wedding",
    "Birthday",
    "Corporate Event",
    "Conference",
    "Anniversary",
    "Baby Shower",
    "Graduation",
    "Other",
  ];
  const cateringServices = [
    "Full Service",
    "Drop-off",
    "Buffet Style",
    "Plated Service",
    "Cocktail Reception",
  ];

  // Calculate ingredient breakdown for menu items
  const calculateIngredientBreakdown = (menuName: string) => {
    const menu = menuItems[menuName];
    if (!menu) return [];
    return menu.recipe
      .map((recipeItem) => {
        const ingredient = ingredients[recipeItem.name];
        if (!ingredient) return null;
        return {
          name: recipeItem.name,
          quantity: `${recipeItem.quantity}${ingredient.unit}`,
          unitPrice: ingredient.unitPrice,
          totalPrice:
            Math.round(
              (ingredient.unitPrice / 1000) * recipeItem.quantity * 100
            ) / 100,
        };
      })
      .filter((item) => item !== null) as SelectedMenu["ingredients"];
  };

  // Event Management Functions
  const handleInputChange = (field: keyof EventDetails, value: string) => {
    setEventDetails((prev) => ({ ...prev, [field]: value }));
  };

  const addMenuItemToEvent = (menuName: string) => {
    const menu = menuItems[menuName];
    const ingredientBreakdown = calculateIngredientBreakdown(menuName);
    const newMenuItem: SelectedMenu = {
      name: menuName,
      quantity: 1,
      unitPrice: menu.price,
      totalPrice: menu.price,
      ingredients: ingredientBreakdown,
    };
    setEventDetails((prev) => ({
      ...prev,
      selectedMenus: [...prev.selectedMenus, newMenuItem],
    }));
  };

  const updateMenuQuantity = (index: number, value: number) => {
    setEventDetails((prev) => {
      const updatedMenus = [...prev.selectedMenus];
      const newQuantity = Math.max(1, value);
      updatedMenus[index].quantity = newQuantity;
      updatedMenus[index].totalPrice =
        updatedMenus[index].unitPrice * newQuantity;
      return { ...prev, selectedMenus: updatedMenus };
    });
  };

  const removeMenuItem = (index: number) => {
    setEventDetails((prev) => ({
      ...prev,
      selectedMenus: prev.selectedMenus.filter((_, i) => i !== index),
    }));
    setOpenMenus((prev) => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });
  };

  // Calculate total for all menu items (sum of all menu totalPrice)
  const calculateMenuTotal = () => {
    return eventDetails.selectedMenus.reduce(
      (total, menu) => total + menu.totalPrice,
      0
    );
  };

  // Catering service extra cost
  const getCateringServiceExtra = () => {
    return cateringServiceExtraCost[eventDetails.cateringService] || 0;
  };

  // Duration cost
  const getDurationExtra = () => {
    if (!eventDetails.eventStartTime || !eventDetails.eventEndTime) return 0;
    const [startH, startM] = eventDetails.eventStartTime.split(":").map(Number);
    const [endH, endM] = eventDetails.eventEndTime.split(":").map(Number);
    let duration = endH + endM / 60 - (startH + startM / 60);
    if (duration < 0) duration += 24; // handle overnight events
    return Math.ceil(duration) * costPerHour;
  };

  // Grand total
  const calculateGrandTotal = () => {
    return (
      calculateMenuTotal() + getCateringServiceExtra() + getDurationExtra()
    );
  };

  // Toggle ingredient dropdown for a menu
  const toggleMenuDropdown = (index: number) => {
    setOpenMenus((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <section className="bg-slate-100">
      <div className="w-[80%] flex justify-between items-center mt-2 ml-5">
        <h1 className="text-4xl text-gray-900 tracking-tighter flex items-center gap-2">
          <ChefHat className="text-blue-500" /> New Event
        </h1>
        <Link to="/dashboard/events">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center">
            Back to Events
          </button>
        </Link>
      </div>
      <div className="space-y-6 mt-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Calendar className="text-blue-500" /> Event Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Name
              </label>
              <input
                type="text"
                value={eventDetails.eventName}
                onChange={(e) => handleInputChange("eventName", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter event name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Type
              </label>
              <select
                value={eventDetails.eventType}
                onChange={(e) => handleInputChange("eventType", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Select event type</option>
                {eventTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Users size={16} /> Number of Guests
              </label>
              <input
                type="number"
                value={eventDetails.numberOfGuests}
                onChange={(e) =>
                  handleInputChange("numberOfGuests", e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter number of guests (for info only)"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catering Service Type
              </label>
              <select
                value={eventDetails.cateringService}
                onChange={(e) =>
                  handleInputChange("cateringService", e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Select service type</option>
                {cateringServices.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 items-center gap-2">
                <Calendar size={16} /> Event Date
              </label>
              <input
                type="date"
                value={eventDetails.eventDate}
                onChange={(e) => handleInputChange("eventDate", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Clock size={16} /> Start Time
              </label>
              <input
                type="time"
                value={eventDetails.eventStartTime}
                onChange={(e) =>
                  handleInputChange("eventStartTime", e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Clock size={16} /> End Time
              </label>
              <input
                type="time"
                value={eventDetails.eventEndTime}
                onChange={(e) =>
                  handleInputChange("eventEndTime", e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
        </div>
        {/* Menu Selection */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Select Menu Items
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.keys(menuItems).map((menuName) => (
              <div key={menuName} className="bg-gray-50 p-4 rounded-lg border">
                <h4 className="font-medium text-gray-800 mb-2">{menuName}</h4>
                <p className="text-blue-600 font-semibold mb-3">
                  ₦{menuItems[menuName].price.toLocaleString()}/portion
                </p>
                <button
                  onClick={() => addMenuItemToEvent(menuName)}
                  className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> Add to Menu
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* Selected Menu Items with Ingredient Breakdown */}
        {eventDetails.selectedMenus.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Selected Menu Items & Ingredient Breakdown
            </h3>
            <div className="space-y-6">
              {eventDetails.selectedMenus.map((menu, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg border">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">
                        {menu.name}
                      </h4>
                      <p className="text-gray-600">
                        ₦{menu.unitPrice.toLocaleString()} per portion
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          updateMenuQuantity(index, menu.quantity - 1)
                        }
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                      >
                        <Minus size={16} />
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={menu.quantity}
                        onChange={(e) =>
                          updateMenuQuantity(
                            index,
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="w-14 text-center border border-gray-300 rounded p-1 mx-1"
                        style={{ width: 50 }}
                      />
                      <button
                        onClick={() =>
                          updateMenuQuantity(index, menu.quantity + 1)
                        }
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                      >
                        <Plus size={16} />
                      </button>
                      <button
                        onClick={() => removeMenuItem(index)}
                        className="ml-4 text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  {/* Ingredient Breakdown Dropdown */}
                  <div className="bg-white p-4 rounded-lg">
                    <button
                      type="button"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-2"
                      onClick={() => toggleMenuDropdown(index)}
                    >
                      {openMenus[index] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      {openMenus[index] ? "Hide Ingredients" : "Show Ingredients"}
                    </button>
                    {openMenus[index] && (
                      <>
                        <h5 className="font-medium text-gray-700 mb-3">
                          Ingredient Breakdown (per portion)
                        </h5>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2">Ingredient</th>
                                <th className="text-left py-2">Quantity</th>
                                <th className="text-right py-2">Unit Price (₦)</th>
                                <th className="text-right py-2">Total (₦)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {menu.ingredients.map((ingredient, idx) => (
                                <tr key={idx} className="border-b">
                                  <td className="py-2">{ingredient.name}</td>
                                  <td className="py-2">{ingredient.quantity}</td>
                                  <td className="py-2 text-right">
                                    {ingredient.unitPrice.toLocaleString()}
                                  </td>
                                  <td className="py-2 text-right">
                                    {ingredient.totalPrice.toLocaleString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                    <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total per portion:</span>
                        <span className="font-semibold text-blue-600">
                          ₦{menu.unitPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-medium">
                          Total for {menu.quantity} portion(s):
                        </span>
                        <span className="font-semibold text-blue-600">
                          ₦{menu.totalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Bill Summary */}
        {eventDetails.selectedMenus.length > 0 && (
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg border-2 border-orange-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Calculator className="text-blue-500" /> Bill Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">
                  Event Details
                </h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Event:</span>{" "}
                    {eventDetails.eventName || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Type:</span>{" "}
                    {eventDetails.eventType || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Guests:</span>{" "}
                    {eventDetails.numberOfGuests || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Service:</span>{" "}
                    {eventDetails.cateringService || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Date:</span>{" "}
                    {eventDetails.eventDate || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Start Time:</span>{" "}
                    {eventDetails.eventStartTime || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">End Time:</span>{" "}
                    {eventDetails.eventEndTime || "N/A"}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">
                  Cost Breakdown
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Menu total:</span>
                    <span className="font-semibold">
                      ₦{calculateMenuTotal().toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Catering service extra:</span>
                    <span className="font-semibold">
                      ₦{getCateringServiceExtra().toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration extra:</span>
                    <span className="font-semibold">
                      ₦{getDurationExtra().toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg">
                      <span className="font-semibold">Grand Total:</span>
                      <span className="font-bold text-blue-600">
                        ₦{calculateGrandTotal().toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
