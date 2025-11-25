// YourFarm.tsx
import React, { useEffect, useState } from "react";
import { Sprout, Users } from "lucide-react";
import Chatbot from "@/components/ui/chatbot";
import Report from "@/components/ui/report.tsx";

interface FarmData {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  farmerName: string;
  farmName: string;
  location: string;
  farmSize: string;
  cropTypes: string;
  livestock: string;
  irrigationType: string;
  soilType: string;
  contactNumber: string;
  email: string;
  additionalNotes: string;
}

const API_BASE = "http://localhost:3001/your-farm";

const emptyForm: FarmData = {
  farmerName: "",
  farmName: "",
  location: "",
  farmSize: "",
  cropTypes: "",
  livestock: "",
  irrigationType: "",
  soilType: "",
  contactNumber: "",
  email: "",
  additionalNotes: "",
};

const YourFarm: React.FC = () => {
  const [farms, setFarms] = useState<FarmData[]>([]);
  const [formData, setFormData] = useState<FarmData>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isLocked = farms.length > 0 && !editingId;

  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error("Failed to load farms");
      const data = await res.json();

      const farmList = Array.isArray(data) ? data : [];
      setFarms(farmList);

      // ✅ Auto-fill all input boxes if farm exists
      if (farmList.length > 0) {
        setFormData(farmList[0]);
      }
    } catch (err) {
      console.error("Failed to load farms:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to save farm");
      const saved = await res.json();

      setFarms((prev) => [saved, ...prev]);
      showToast("✅ Success", `${saved.farmName || "Farm"} added successfully!`);
    } catch (err) {
      console.error("Submit error:", err);
      showToast("❌ Error", "Failed to save farm details.");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    try {
      const res = await fetch(`${API_BASE}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update farm");
      const updated = await res.json();

      setFarms((prev) =>
        prev.map((f) => (f._id === updated._id ? updated : f))
      );

      setEditingId(null);
      showToast("✏️ Updated", `${updated.farmName || "Farm"} updated successfully!`);
    } catch (err) {
      console.error("Update error:", err);
      showToast("❌ Error", "Failed to update farm details.");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);

    // Reset to latest saved values
    if (farms.length > 0) {
      setFormData(farms[0]);
    } else {
      setFormData(emptyForm);
    }
  };

  const showToast = (title: string, description: string) => {
    const div = document.createElement("div");
    div.className =
      "fixed bottom-4 right-4 bg-white border border-gray-300 shadow-lg p-4 rounded-lg z-50 animate-in fade-in";
    div.innerHTML = `<div class="font-bold text-green-700">${title}</div><div>${description}</div>`;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
  };

  return (
    <div className="min-h-screen bg-white mt-20">
      <Report />
      <Chatbot />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <div className="flex justify-center items-center gap-3">
            <Sprout className="w-10 h-10 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-800">Farm Registry</h1>
          </div>
          <p className="text-gray-600 mt-2">
            Submit and manage your farm details easily
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={editingId ? handleUpdate : handleSubmit}
          className="border border-gray-200 rounded-lg p-6 mb-12 shadow-sm"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {Object.keys(emptyForm).map((key) => (
              <div key={key}>
                <label className="block font-semibold mb-1 capitalize">{key}</label>

                {key === "additionalNotes" ? (
                  <textarea
                    name={key}
                    value={(formData as any)[key]}
                    onChange={handleInputChange}
                    disabled={isLocked}
                    className="w-full border rounded-md p-2 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                ) : (
                  <input
                    name={key}
                    value={(formData as any)[key]}
                    onChange={handleInputChange}
                    disabled={isLocked}
                    className="w-full border rounded-md p-2 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="mt-6 flex gap-4">
            {isLocked ? (
              <button
                type="button"
                onClick={() => {
                  setEditingId(farms[0]._id || "");
                  setFormData(farms[0]);
                }}
                className=""
              >
             
              </button>
            ) : !editingId ? (
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-md w-full"
              >
                Submit Farm Details
              </button>
            ) : (
              <>
                <button
                  type="submit"
                  className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-6 py-3 rounded-md flex-1"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="border border-gray-400 text-gray-600 px-6 py-3 rounded-md flex-1"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </form>

        {/* Registered Farms */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-semibold text-gray-800">
              Registered Farms ({farms.length})
            </h2>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : farms.length === 0 ? (
            <p className="text-gray-500 text-center">No farms registered yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {farms.map((farm) => (
                <div
                  key={farm._id}
                  className="border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition p-4"
                >
                  <h3 className="text-xl font-bold text-green-700 mb-2">
                    {farm.farmName}
                  </h3>
                  <p>
                    <strong>Farmer:</strong> {farm.farmerName}
                  </p>
                  <p>
                    <strong>Location:</strong> {farm.location}
                  </p>
                  <p>
                    <strong>Crops:</strong> {farm.cropTypes}
                  </p>
                  <p>
                    <strong>Size:</strong> {farm.farmSize} acres
                  </p>

                  <button
                    onClick={() => {
                      setEditingId(farm._id || "");
                      setFormData(farm);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="mt-3 px-4 py-2 border rounded-md text-sm hover:bg-gray-100"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default YourFarm;
