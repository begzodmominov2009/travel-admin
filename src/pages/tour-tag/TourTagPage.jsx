"use client";

import React, { useState } from "react";
import { useDelete, useGet, usePatch, usePost } from "../../../hooks/useGetFetch";

const TourTagPage = () => {
  // ================= FETCH DATA =================
  const { data: tours = [], isLoading, error, get } = useGet("tours", "tour_tag");
  const createTour = usePost("tour_tag", "tours");
  const updateTour = usePatch("tour_tag", "tours");
  const deleteTour = useDelete("tour_tag", "tours");

  // ================= STATE =================
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialState = {
    name: "",
    description: "",
    tags: [],
  };
  const [formData, setFormData] = useState(initialState);

  // ================= HANDLERS =================
  const openCreateModal = () => {
    setEditingId(null);
    setFormData(initialState);
    setModalOpen(true);
  };

  const openEditModal = (tour) => {
    setEditingId(tour.id);
    setFormData({ ...tour });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, tags: value.split(",").map((t) => t.trim()) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      // PATCH: Tour update
      updateTour.mutate(
        { id: editingId, body: formData },
        { onSuccess: () => get("tour_tag") }
      );
    } else {
      // POST: New tour
      createTour.mutate(formData, { onSuccess: () => get("tour_tag") });
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this tour?")) {
      // DELETE: Remove tour
      deleteTour.mutate(id, { onSuccess: () => get("tour_tag") });
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Tour & Tag Management</h1>
        <button
          onClick={openCreateModal}
          className="px-5 py-2 bg-black text-white rounded-xl"
        >
          + New Tour
        </button>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error.message}</p>}

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl shadow p-4 overflow-auto max-h-[70vh]">
        <table className="min-w-[600px] w-full border-collapse text-sm">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {["Name", "Description", "Tags", "Actions"].map((th) => (
                <th
                  key={th}
                  className="border-b border-gray-200 px-3 py-2 font-medium text-gray-700 text-left"
                >
                  {th}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tours.map((tour) => (
              <tr key={tour.id} className="hover:bg-gray-100">
                <td className="border-b border-gray-200 px-3 py-2">{tour.name}</td>
                <td className="border-b border-gray-200 px-3 py-2">{tour.description}</td>
                <td className="border-b border-gray-200 px-3 py-2">{tour.tags?.join(", ")}</td>
                <td className="border-b border-gray-200 px-3 py-2 flex gap-2">
                  <button
                    onClick={() => openEditModal(tour)}
                    className="px-2 py-1 bg-yellow-400 text-white rounded text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(tour.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL ================= */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl p-6 rounded-2xl shadow-xl space-y-4">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Tour" : "Create Tour"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block mb-1 font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Tags (comma separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags?.join(", ")}
                  onChange={handleTagsChange}
                  className="w-full border p-3 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-xl"
                >
                  {editingId ? "Update Tour" : "Create Tour"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourTagPage;