import React, { useState } from "react";
import { requireRole } from "~/utils/session.server";
import { useEffect, useState } from "react";

export const loader = async ({ request }) => {
  await requireRole(request, ["admin"]); // Only allow admins
  return null;
};

export default function DataEditor() {
  // Menus
  const [menus, setMenus] = useState<any[]>([]);
  // Catering Types
  const [cateringTypes, setCateringTypes] = useState<any[]>([]);
  // New Catering Type
  const [newCateringType, setNewCateringType] = useState({
    name: "",
    extraCost: "",
  });
  // New Menu
  const [newMenu, setNewMenu] = useState({ name: "", price: "" });
  // Categorized Ingredients
  const [categorizedIngredients, setCategorizedIngredients] = useState<
    Record<string, any[]>
  >({});

  // Fetch all data from APIs
  useEffect(() => {
    fetch("/api/ingredients")
      .then((res) => res.json())
      .then((data) => setCategorizedIngredients(data));
    fetch("/api/catering-types")
      .then((res) => res.json())
      .then((data) => setCateringTypes(data));
    fetch("/api/menus")
      .then((res) => res.json())
      .then((data) => setMenus(data));
  }, []);

  // Add Catering Type
  const addCateringType = async () => {
    if (!newCateringType.name || !newCateringType.extraCost) return;
    const res = await fetch("/api/catering-types", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newCateringType.name,
        extraCost: parseFloat(newCateringType.extraCost),
      }),
    });
    const created = await res.json();
    setCateringTypes((prev) => [...prev, created]);
    setNewCateringType({ name: "", extraCost: "" });
  };

  // Delete Catering Type
  const deleteCateringType = async (_id: string) => {
    await fetch("/api/catering-types", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id }),
    });
    setCateringTypes((prev) => prev.filter((ct) => ct._id !== _id));
  };

  // Add Menu
  const addMenu = async () => {
    if (!newMenu.name || !newMenu.price) return;
    const res = await fetch("/api/menus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newMenu.name,
        price: parseFloat(newMenu.price),
        recipe: [],
      }),
    });
    const created = await res.json();
    setMenus((prev) => [...prev, created]);
    setNewMenu({ name: "", price: "" });
  };

  // Delete Menu
  const deleteMenu = async (_id: string) => {
    await fetch("/api/menus", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id }),
    });
    setMenus((prev) => prev.filter((m) => m._id !== _id));
  };

  return (
    <div className="p-8 bg-slate-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Admin Data Editor</h1>
      {/* Catering Types Section */}
      <div className="mb-10 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Catering Types</h2>
        <table className="w-full mb-4">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Name</th>
              <th className="text-right py-2">Extra Cost (₦)</th>
              <th className="text-center py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cateringTypes.map((ct) => (
              <tr key={ct._id} className="border-b">
                <td className="py-2">{ct.name}</td>
                <td className="py-2 text-right">
                  ₦{ct.extraCost.toLocaleString()}
                </td>
                <td className="py-2 text-center">
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => deleteCateringType(ct._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Catering type name"
            value={newCateringType.name}
            onChange={(e) =>
              setNewCateringType((ct) => ({ ...ct, name: e.target.value }))
            }
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Extra cost (₦)"
            value={newCateringType.extraCost}
            onChange={(e) =>
              setNewCateringType((ct) => ({ ...ct, extraCost: e.target.value }))
            }
            className="p-2 border rounded"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={addCateringType}
          >
            Add
          </button>
        </div>
      </div>
      {/* Menus Section */}
      <div className="mb-10 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Menus</h2>
        <table className="w-full mb-4">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Name</th>
              <th className="text-right py-2">Price (₦)</th>
              <th className="text-center py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {menus.map((menu) => (
              <tr key={menu._id} className="border-b">
                <td className="py-2">{menu.name}</td>
                <td className="py-2 text-right">
                  ₦{menu.price.toLocaleString()}
                </td>
                <td className="py-2 text-center">
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => deleteMenu(menu._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Menu name"
            value={newMenu.name}
            onChange={(e) =>
              setNewMenu((m) => ({ ...m, name: e.target.value }))
            }
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Price (₦)"
            value={newMenu.price}
            onChange={(e) =>
              setNewMenu((m) => ({ ...m, price: e.target.value }))
            }
            className="p-2 border rounded"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={addMenu}
          >
            Add
          </button>
        </div>
      </div>
      {/* Ingredients Section */}
      <div className="mb-10 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          Ingredients (by Category)
        </h2>
        {Object.keys(categorizedIngredients).length === 0 ? (
          <div>Loading ingredients...</div>
        ) : (
          Object.entries(categorizedIngredients).map(
            ([category, ingredients]) => (
              <div key={category} className="mb-6">
                <h3 className="text-lg font-bold mb-2">{category}</h3>
                <table className="w-full mb-2">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Name</th>
                      <th className="text-right py-2">Unit</th>
                      <th className="text-right py-2">Price (₦)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingredients.map((ing) => (
                      <tr key={ing.id} className="border-b">
                        <td className="py-2">{ing.name}</td>
                        <td className="py-2 text-right">{ing.unit}</td>
                        <td className="py-2 text-right">
                          ₦{ing.price.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )
        )}
      </div>
      {/* You can add more sections for other entities as needed */}
    </div>
  );
}
