import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Edit, PlusCircle } from "lucide-react";

const Crud = ({ token }) => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchItems = async () => {
    try {
      const response = await axios.get("http://localhost:5000/items", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(response.data);
    } catch (error) {
      alert("Failed to fetch items.");
    }
  };

  const addItem = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/items",
        { name, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setName("");
      setDescription("");
      fetchItems();
    } catch (error) {
      alert("Failed to add item.");
    }
  };

  const updateItem = async (id, updatedName, updatedDescription) => {
    try {
      await axios.put(
        `http://localhost:5000/items/${id}`,
        { name: updatedName, description: updatedDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingId(null);
      fetchItems();
    } catch (error) {
      alert("Failed to update item.");
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchItems();
    } catch (error) {
      alert("Failed to delete item.");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Item Management
      </h2>

      {/* Add Item Form */}
      <form
        onSubmit={addItem}
        className="bg-white shadow-md rounded-lg p-6 mb-6"
      >
        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            placeholder="Item Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Add Item</span>
          </button>
        </div>
      </form>

      {/* Items List */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center px-6 py-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition"
          >
            {editingId === item.id ? (
              <>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) =>
                    updateItem(item.id, e.target.value, item.description)
                  }
                  className="flex-1 mr-4 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) =>
                    updateItem(item.id, item.name, e.target.value)
                  }
                  className="flex-1 mr-4 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      updateItem(item.id, item.name, item.description)
                    }
                    className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-gray-500 text-sm">{item.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingId(item.id)}
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Crud;
