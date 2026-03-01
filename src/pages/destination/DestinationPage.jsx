import React, { useState } from "react";
import { useGet, usePost, usePatch, useDelete } from "../../../hooks/useGetFetch";

const DestinationPage = () => {
  const {
    data: destinations = [],
    isLoading,
    error,
  } = useGet("destinations", "destination");

  const { data: countries = [] } = useGet("countries", "country");

  // ================= MUTATIONS =================
  const createDestination = usePost("destination", "destinations");
  const updateDestination = usePatch("destination", "destinations");
  const deleteDestination = useDelete("destination", "destinations");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [highlightInput, setHighlightInput] = useState("");

  const initialState = {
    country_id: "",
    name: "",
    name_uz: "",
    name_ru: "",
    slug: "",
    description: "",
    highlights: [],
    latitude: 0,
    longitude: 0,
    timezone: "",
    best_season: "",
    cover_image: "",
    is_popular: false,
    is_active: false,
    updated_at: 0,
  };

  const [formData, setFormData] = useState(initialState);

  // ================= HANDLERS =================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addHighlight = () => {
    if (highlightInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        highlights: [...prev.highlights, highlightInput.trim()],
      }));
      setHighlightInput("");
    }
  };

  const removeHighlight = (index) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData(initialState);
    setHighlightInput("");
    setModalOpen(true);
  };

  const openEditModal = (dest) => {
    setEditingId(dest.id);
    setFormData({ ...dest });
    setHighlightInput("");
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      updated_at: Date.now(),
    };
    if (editingId) {
      updateDestination.mutate(
        { id: editingId, body: payload },
        { onSuccess: () => setModalOpen(false) }
      );
    } else {
      createDestination.mutate(payload, {
        onSuccess: () => setModalOpen(false),
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this destination?")) {
      deleteDestination.mutate(id);
    }
  };

  // ================= UI =================
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Destination Management
        </h1>
        <button
          onClick={openCreateModal}
          className="px-5 py-2 bg-black text-white rounded-xl hover:opacity-80 transition"
        >
          + New Destination
        </button>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error.message}</p>}

      <div className="bg-white shadow-md rounded-2xl overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Country</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Name Uz</th>
              <th className="px-4 py-3 text-left">Name Ru</th>
              <th className="px-4 py-3 text-left">Slug</th>
              <th className="px-4 py-3 text-left">Timezone</th>
              <th className="px-4 py-3 text-left">Best Season</th>
              <th className="px-4 py-3 text-left">Lat</th>
              <th className="px-4 py-3 text-left">Lng</th>
              <th className="px-4 py-3 text-left">Popular</th>
              <th className="px-4 py-3 text-left">Active</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {destinations.map((dest) => (
              <tr
                key={dest.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3 text-xs text-gray-500">{dest.id}</td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {countries.find((c) => c.id === dest.country_id)?.name ||
                    dest.country_id}
                </td>
                <td className="px-4 py-3 font-medium">{dest.name}</td>
                <td className="px-4 py-3">{dest.name_uz}</td>
                <td className="px-4 py-3">{dest.name_ru}</td>
                <td className="px-4 py-3 text-gray-500">{dest.slug}</td>
                <td className="px-4 py-3">{dest.timezone}</td>
                <td className="px-4 py-3">{dest.best_season}</td>
                <td className="px-4 py-3">{dest.latitude}</td>
                <td className="px-4 py-3">{dest.longitude}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      dest.is_popular
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {dest.is_popular ? "Popular" : "No"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      dest.is_active
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {dest.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 flex justify-end gap-2">
                  <button
                    onClick={() => openEditModal(dest)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:opacity-80 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(dest.id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:opacity-80 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-5">
              {editingId ? "Edit Destination" : "Create Destination"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Country Select */}
              <select
                name="country_id"
                value={formData.country_id}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-black outline-none bg-white"
                required
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
                required
              />
              <input
                type="text"
                name="name_uz"
                placeholder="Name Uz"
                value={formData.name_uz}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
              />
              <input
                type="text"
                name="name_ru"
                placeholder="Name Ru"
                value={formData.name_ru}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
              />
              <input
                type="text"
                name="slug"
                placeholder="Slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
              />

              {/* Highlights */}
              <div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add highlight"
                    value={highlightInput}
                    onChange={(e) => setHighlightInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addHighlight())
                    }
                    className="flex-1 border p-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
                  />
                  <button
                    type="button"
                    onClick={addHighlight}
                    className="px-4 py-2 bg-gray-800 text-white rounded-xl hover:opacity-80 transition"
                  >
                    Add
                  </button>
                </div>
                {formData.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {h}
                        <button
                          type="button"
                          onClick={() => removeHighlight(i)}
                          className="text-gray-400 hover:text-red-500 transition ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  name="latitude"
                  placeholder="Latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  step="any"
                  className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
                />
                <input
                  type="number"
                  name="longitude"
                  placeholder="Longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  step="any"
                  className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
                />
              </div>

              <input
                type="text"
                name="timezone"
                placeholder="Timezone (e.g. Asia/Tashkent)"
                value={formData.timezone}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
              />
              <input
                type="text"
                name="best_season"
                placeholder="Best Season (e.g. Spring, Summer)"
                value={formData.best_season}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
              />
              <input
                type="text"
                name="cover_image"
                placeholder="Cover Image URL"
                value={formData.cover_image}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
              />

              <div className="flex gap-6 mt-2">
                <label className="flex items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    name="is_popular"
                    checked={formData.is_popular}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  Popular
                </label>
                <label className="flex items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  Active
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    createDestination.isPending || updateDestination.isPending
                  }
                  className="px-4 py-2 rounded-xl bg-black text-white hover:opacity-80 transition"
                >
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinationPage;
