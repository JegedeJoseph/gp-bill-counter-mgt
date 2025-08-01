import React, { useState } from "react";
import { requireRole } from "~/utils/session.server";

export const loader = async ({ request }) => {
  await requireRole(request, ["admin"]); // Only allow admins
  // ...rest of your loader logic
};
import { Plus, Edit, Trash2, Save, X, AlertTriangle } from "lucide-react";
import {
  ingredients as sharedIngredients,
} from "~/data/cateringData";

function IngredientsInventory() {
  const [ingredients, setIngredients] = useState<typeof sharedIngredients>(sharedIngredients);
  const [newIngredient, setNewIngredient] = useState({
    name: "",
    unitPrice: "",
    unit: "",
    stock: "",
    minStock: "",
  });
  const [editingIngredient, setEditingIngredient] = useState<string | null>(null);

  const addIngredient = () => {
    if (
      newIngredient.name &&
      newIngredient.unitPrice &&
      newIngredient.unit &&
      newIngredient.stock &&
      newIngredient.minStock
    ) {
      setIngredients((prev) => ({
        ...prev,
        [newIngredient.name]: {
          unitPrice: parseFloat(newIngredient.unitPrice),
          unit: newIngredient.unit,
          stock: parseFloat(newIngredient.stock),
          minStock: parseFloat(newIngredient.minStock),
        },
      }));
      setNewIngredient({
        name: "",
        unitPrice: "",
        unit: "",
        stock: "",
        minStock: "",
      });
    }
  };

  const deleteIngredient = (name: string) => {
    setIngredients((prev) => {
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });
  };

  const getLowStockIngredients = () => {
    return Object.entries(ingredients).filter(
      ([, ingredient]) => ingredient.stock <= ingredient.minStock
    );
  };

  return (
    <div className="p-5 bg-slate-200 min-h-screen">
      <div className="space-y-6">
        {/* Low Stock Alert */}
        {getLowStockIngredients().length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="text-red-500" size={20} />
              <h3 className="font-semibold text-red-800">Low Stock Alert</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {getLowStockIngredients().map(([name, ingredient]) => (
                <div key={name} className="bg-red-100 p-2 rounded text-sm">
                  <span className="font-medium">{name}</span>: {ingredient.stock}
                  {ingredient.unit}
                  <span className="text-red-600">
                    {" "}(Min: {ingredient.minStock}
                    {ingredient.unit})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New Ingredient */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Add New Ingredient
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Ingredient name"
              value={newIngredient.name}
              onChange={(e) =>
                setNewIngredient((prev) => ({ ...prev, name: e.target.value }))
              }
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            <input
              type="number"
              placeholder="Unit price"
              value={newIngredient.unitPrice}
              onChange={(e) =>
                setNewIngredient((prev) => ({
                  ...prev,
                  unitPrice: e.target.value,
                }))
              }
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            <select
              aria-label="Unit"
              value={newIngredient.unit}
              onChange={(e) =>
                setNewIngredient((prev) => ({ ...prev, unit: e.target.value }))
              }
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Select unit</option>
              <option value="g">Grams (g)</option>
              <option value="ml">Milliliters (ml)</option>
              <option value="pieces">Pieces</option>
              <option value="kg">Kilograms (kg)</option>
              <option value="kg">Tuber</option>
              <option value="liters">Liters</option>
              <option value="service">Service</option>
            </select>
            <input
              type="number"
              placeholder="Current stock"
              value={newIngredient.stock}
              onChange={(e) =>
                setNewIngredient((prev) => ({ ...prev, stock: e.target.value }))
              }
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            <input
              type="number"
              placeholder="Min stock"
              value={newIngredient.minStock}
              onChange={(e) =>
                setNewIngredient((prev) => ({
                  ...prev,
                  minStock: e.target.value,
                }))
              }
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <button
            type="button"
            onClick={addIngredient}
            className="mt-4 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            Add Ingredient
          </button>
        </div>

        {/* Ingredients List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Ingredients Inventory
          </h3>
          <div>
            <table className="min-w-full bg-white">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Ingredient</th>
                  <th className="text-right py-3">Unit Price (₦)</th>
                  <th className="text-center py-3">Unit</th>
                  <th className="text-right py-3">Current Stock</th>
                  <th className="text-right py-3">Min Stock</th>
                  <th className="text-center py-3">Status</th>
                  <th className="text-center py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(ingredients).map(([name, ingredient]) => (
                  <tr key={name} className="border-b">
                    <td className="py-3 font-medium">{name}</td>
                    <td className="py-3 text-right">
                      ₦{ingredient.unitPrice.toLocaleString()}
                    </td>
                    <td className="py-3 text-center">{ingredient.unit}</td>
                    <td className="py-3 text-right">
                      {ingredient.stock.toLocaleString()}
                    </td>
                    <td className="py-3 text-right">
                      {ingredient.minStock.toLocaleString()}
                    </td>
                    <td className="py-3 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          ingredient.stock <= ingredient.minStock
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {ingredient.stock <= ingredient.minStock ? "Low" : "OK"}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          aria-label="Edit ingredient"
                          onClick={() => setEditingIngredient(name)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          type="button"
                          aria-label="Delete ingredient"
                          onClick={() => deleteIngredient(name)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Ingredient Modal */}
        {editingIngredient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Edit Ingredient: {editingIngredient}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit Price (₦)
                  </label>
                  <input
                    type="number"
                    placeholder="Unit Price"
                    value={ingredients[editingIngredient].unitPrice}
                    onChange={(e) =>
                      setIngredients((prev) => ({
                        ...prev,
                        [editingIngredient]: {
                          ...prev[editingIngredient],
                          unitPrice: parseFloat(e.target.value),
                        },
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Stock
                  </label>
                  <input
                    type="number"
                    placeholder="Current Stock"
                    value={ingredients[editingIngredient].stock}
                    onChange={(e) =>
                      setIngredients((prev) => ({
                        ...prev,
                        [editingIngredient]: {
                          ...prev[editingIngredient],
                          stock: parseFloat(e.target.value),
                        },
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Stock
                  </label>
                  <input
                    type="number"
                    value={ingredients[editingIngredient].minStock}
                    placeholder="Minimum Stock"
                    onChange={(e) =>
                      setIngredients((prev) => ({
                        ...prev,
                        [editingIngredient]: {
                          ...prev[editingIngredient],
                          minStock: parseFloat(e.target.value),
                        },
                      }))
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  aria-label="Cancel edit"
                  onClick={() => setEditingIngredient(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  <X size={16} />
                </button>
                <button
                  type="button"
                  aria-label="Save changes"
                  onClick={() => setEditingIngredient(null)}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2"
                >
                  <Save size={16} />
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default IngredientsInventory;
