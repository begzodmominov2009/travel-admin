import React, { useState } from "react";
import {
  useGet,
  usePost,
  usePatch,
  useDelete,
} from "../../../hooks/useGetFetch";

const TourTagPage = () => {
  // ================= QUERIES =================
  const {
    data: tourTags = [],
    isLoading,
    error,
  } = useGet("tour_tag", "tour_tag");
  const { data: tours = [] } = useGet("tours", "tour");
  const { data: tags = [] } = useGet("tags", "tag");

  // ================= MUTATIONS =================
  const createTourTag = usePost("tour_tag", "tour_tag");
  const updateTourTag = usePatch("tour_tag", "tour_tag");
  const deleteTourTag = useDelete("tour_tag", "tour_tag");

  // ================= STATE =================
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    tour_id: "",
    tag_id: "",
  });

  // ================= HANDLERS =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({ tour_id: "", tag_id: "" });
    setModalOpen(true);
  };

  const openEditModal = (tt) => {
    setEditingId(tt.id);
    setFormData({ tour_id: tt.tour_id, tag_id: tt.tag_id });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateTourTag.mutate(
        { id: editingId, body: formData },
        { onSuccess: () => setModalOpen(false) },
      );
    } else {
      createTourTag.mutate(formData, {
        onSuccess: () => setModalOpen(false),
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this tour-tag association?")) {
      deleteTourTag.mutate(id);
    }
  };

  // ================= UI =================
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Tour Tag Management
        </h1>
        <button
          onClick={openCreateModal}
          className="px-5 py-2 bg-black text-white rounded-xl hover:opacity-80 transition"
        >
          + New Tour Tag
        </button>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error.message}</p>}

      {/* ================= TABLE ================= */}
      <div className="bg-white shadow-md rounded-2xl overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Tour</th>
              <th className="px-4 py-3 text-left">Tag</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tourTags.map((tt) => (
              <tr key={tt.id} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-3 text-xs text-gray-500">{tt.id}</td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {tours.find((t) => t.id === tt.tour_id)?.title || tt.tour_id}
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {tags.find((t) => t.id === tt.tag_id)?.name || tt.tag_id}
                </td>
                <td className="px-4 py-3 flex justify-end gap-2">
                  <button
                    onClick={() => openEditModal(tt)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:opacity-80 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(tt.id)}
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

      {/* ================= MODAL ================= */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-fadeIn">
            <h2 className="text-xl font-semibold mb-5">
              {editingId ? "Edit Tour Tag" : "Create Tour Tag"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Tour Select */}
              <select
                name="tour_id"
                value={formData.tour_id}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-black outline-none bg-white"
                required
              >
                <option value="">Select Tour</option>
                {tours.map((tour) => (
                  <option key={tour.id} value={tour.id}>
                    {tour.title}
                  </option>
                ))}
              </select>

              {/* Tag Select */}
              <select
                name="tag_id"
                value={formData.tag_id}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-black outline-none bg-white"
                required
              >
                <option value="">Select Tag</option>
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </select>

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
                  disabled={createTourTag.isPending || updateTourTag.isPending}
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

export default TourTagPage;
