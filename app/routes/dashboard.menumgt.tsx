import React, { useState } from "react";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { ClientOnly } from "~/utils/client-only";
import React, { useEffect, useState } from "react";

type NewMenuItemState = {
  name: string;
  price: string;
  recipe: { name: string; quantity: number }[];
};

type EditMenuItemState = {
  originalName: string;
  name: string;
  price: string;
  recipe: { name: string; quantity: number }[];
} | null;

function MenuManagementPage() {
  // Enhanced ingredients database with stock levels
  const [ingredients, setIngredients] = useState<Record<string, any>>({});
  // Enhanced menu items with recipes
  const [menuItems, setMenuItems] = useState<any[]>([]);

  // Menu management states
  const [newMenuItem, setNewMenuItem] = useState({ name: "", price: "", recipe: [] as { name: string; quantity: number }[] });
  const [newRecipeIngredient, setNewRecipeIngredient] = useState({
    name: "",
    quantity: "",
  });
  // Menu management states
  const [editMenuItem, setEditMenuItem] = useState<any | null>(null);
  const [menuError, setMenuError] = useState<string>("");

  // Fetch menus and ingredients from API
  useEffect(() => {
    fetch("/api/menus").then(res => res.json()).then(setMenuItems);
    fetch("/api/ingredients").then(res => res.json()).then(data => {
      // Flatten categorized ingredients for easy lookup
      const flat: Record<string, any> = {};
      Object.values(data).forEach((arr: any) => arr.forEach((ing: any) => { flat[ing.name] = ing; }));
      setIngredients(flat);
    });
  }, []);

  // Add ingredient to new menu
  const addRecipeIngredient = () => {
    if (newRecipeIngredient.name && newRecipeIngredient.quantity) {
      setNewMenuItem(prev => ({
        ...prev,
        recipe: [...prev.recipe, { name: newRecipeIngredient.name, quantity: parseFloat(newRecipeIngredient.quantity) }]
      }));
      setNewRecipeIngredient({ name: "", quantity: "" });
    }
  };

  // Remove ingredient from new menu
  const removeRecipeIngredient = (index: number) => {
    setNewMenuItem(prev => ({
      ...prev,
      recipe: prev.recipe.filter((_, i) => i !== index)
    }));
  };

  // Add new menu to DB
  const saveMenuItem = async () => {
    setMenuError("");
    const { name, price, recipe } = newMenuItem;
    if (!name.trim() || !price || recipe.length === 0) {
      setMenuError("All fields are required and recipe must have at least one ingredient.");
      return;
    }
    const res = await fetch("/api/menus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price: parseFloat(price), recipe })
    });
    const created = await res.json();
    setMenuItems(prev => [...prev, created]);
    setNewMenuItem({ name: "", price: "", recipe: [] });
  };

  // Delete menu from DB
  const deleteMenuItem = async (_id: string) => {
    await fetch("/api/menus", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id })
    });
    setMenuItems(prev => prev.filter(m => m._id !== _id));
    setEditMenuItem(null);
  };

  // Start editing a menu
  const startEditMenuItem = (menu: any) => {
    setEditMenuItem({ ...menu });
    setMenuError("");
  };

  // Edit menu in DB
  const saveEditMenuItem = async () => {
    if (!editMenuItem) return;
    setMenuError("");
    const { _id, name, price, recipe } = editMenuItem;
    if (!name.trim() || !price || recipe.length === 0) {
      setMenuError("All fields are required and recipe must have at least one ingredient.");
      return;
    }
    const res = await fetch("/api/menus", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id, name, price, recipe })
    });
    const updated = await res.json();
    setMenuItems(prev => prev.map(m => m._id === updated._id ? updated : m));
    setEditMenuItem(null);
  };

  // Remove ingredient from edit menu
  const removeEditMenuRecipeIngredient = (index: number) => {
    if (!editMenuItem) return;
    setEditMenuItem({
      ...editMenuItem,
      recipe: editMenuItem.recipe.filter((_, i) => i !== index)
    });
  };

  // Add ingredient to edit menu
  const addEditMenuRecipeIngredient = () => {
    if (!editMenuItem) return;
    if (newRecipeIngredient.name && newRecipeIngredient.quantity) {
      setEditMenuItem({
        ...editMenuItem,
        recipe: [
          ...editMenuItem.recipe,
          { name: newRecipeIngredient.name, quantity: parseFloat(newRecipeIngredient.quantity) }
        ]
      });
      setNewRecipeIngredient({ name: "", quantity: "" });
    }
  };

  const renderMenuManagementTab = () => (
    <div className="space-y-6">
      {/* Add/Edit Menu Item */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          {editMenuItem
            ? `Edit Menu Item: ${editMenuItem.originalName}`
            : "Add New Menu Item"}
        </h3>
        {menuError && <div className="text-red-600 mb-2">{menuError}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Menu item name"
            value={editMenuItem ? editMenuItem.name : newMenuItem.name}
            onChange={(e) =>
              editMenuItem
                ? handleEditMenuItemChange("name", e.target.value)
                : setNewMenuItem((prev) => ({ ...prev, name: e.target.value }))
            }
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
          <div className="relative">
            <input
              type="number"
              placeholder="Price per portion (₦)"
              value={editMenuItem ? editMenuItem.price : newMenuItem.price}
              onChange={(e) =>
                editMenuItem
                  ? handleEditMenuItemChange("price", e.target.value)
                  : setNewMenuItem((prev) => ({
                      ...prev,
                      price: e.target.value,
                    }))
              }
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full"
            />
            {/* Sum of unit prices of ingredients */}
            <div className="absolute right-0 top-0 mt-1 mr-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {(() => {
                const recipe = editMenuItem
                  ? editMenuItem.recipe
                  : newMenuItem.recipe;
                const sumUnitPrices = recipe.reduce((sum, ing) => {
                  const data = ingredients[ing.name];
                  return data ? sum + data.unitPrice : sum;
                }, 0);
                return `Sum of unit prices: ₦${sumUnitPrices.toLocaleString()}`;
              })()}
            </div>
          </div>
        </div>

        {/* Add/Edit Recipe Ingredients */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Recipe Ingredients</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
            <select
              aria-label="Recipe ingredient"
              value={newRecipeIngredient.name}
              onChange={(e) =>
                setNewRecipeIngredient((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Select ingredient</option>
              {Object.keys(ingredients).map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Quantity"
              value={newRecipeIngredient.quantity}
              onChange={(e) =>
                setNewRecipeIngredient((prev) => ({
                  ...prev,
                  quantity: e.target.value,
                }))
              }
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            />
            <button
              type="button"
              onClick={
                editMenuItem ? addEditMenuRecipeIngredient : addRecipeIngredient
              }
              className="bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Add Ingredient
            </button>
          </div>

          {/* Recipe Ingredients List */}
          {(editMenuItem
            ? editMenuItem.recipe.length > 0
            : newMenuItem.recipe.length > 0) && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-2">Recipe:</h5>
              <div className="space-y-2">
                {(editMenuItem ? editMenuItem.recipe : newMenuItem.recipe).map(
                  (ingredient, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-white p-2 rounded border"
                    >
                      <span>
                        {ingredient.name} - {ingredient.quantity}
                        {ingredients[ingredient.name]
                          ? ingredients[ingredient.name].unit
                          : ""}
                      </span>
                      <button
                        type="button"
                        aria-label="Remove recipe ingredient"
                        onClick={() =>
                          editMenuItem
                            ? removeEditMenuRecipeIngredient(index)
                            : removeRecipeIngredient(index)
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {editMenuItem ? (
            <>
              <button
                type="button"
                onClick={saveEditMenuItem}
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <Save size={16} />
                Save Changes
              </button>
              <button
                type="button"
                onClick={cancelEditMenuItem}
                className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors flex items-center gap-2"
              >
                <X size={16} />
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={saveMenuItem}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <Save size={16} />
              Save Menu Item
            </button>
          )}
        </div>
      </div>

      {/* Existing Menu Items */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Menu Items</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(menuItems).map(([name, menu]) => (
            <div key={name} className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-gray-800">{name}</h4>
                <span className="text-blue-700 font-semibold">
                  ₦{menu.price.toLocaleString()}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <h5 className="font-medium mb-1">Ingredients:</h5>
                <ul className="space-y-1">
                  {menu.recipe.map((ingredient, index) => {
                    const ingData = ingredients[ingredient.name];
                    return (
                      <li key={index} className="flex justify-between">
                        <span>
                          {ingredient.name}
                          {ingData ? (
                            <span className="ml-2 text-xs text-gray-500">
                              (₦{ingData.unitPrice.toLocaleString()} per{" "}
                              {ingData.unit})
                            </span>
                          ) : null}
                        </span>
                        <span>
                          {ingredient.quantity}
                          {ingData ? ingData.unit : ""}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  aria-label="Edit menu item"
                  onClick={() => startEditMenuItem(name)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Edit size={16} />
                </button>
                <button
                  type="button"
                  aria-label="Delete menu item"
                  onClick={() => deleteMenuItem(name)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-5 bg-slate-200">
      <div className="flex space-x-4 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab("menu")}
          className={`px-4 py-2 rounded-lg ${
            true ? "bg-blue-500 text-white" : "bg-slate-400 text-gray-600"
          }`}
        >
          Menu Management
        </button>
      </div>
      {renderMenuManagementTab()}
    </div>
  );
}
export default MenuManagementPage;
