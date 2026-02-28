import React, { useState } from "react";
import {
  useGet,
  usePost,
  usePatch,
  useDelete,
} from "../../../hooks/useGetFetch";

const TagsPage = () => {
  // ================= DATA =================
  const { data: tagData = [], isLoading, error, get } = useGet("tag", "tag");

  const createTag = usePost("tag", "tag");
  const updateTag = usePatch("tag", "tag");
  const deleteTag = useDelete("tag", "tag");

  // ================= STATE =================
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialState = {
    name: "",
    slug: "",
    color: "#000000",
  };

  const [formData, setFormData] = useState(initialState);

  // ================= HANDLERS =================
  const openCreateModal = () => {
    setEditingId(null);
    setFormData(initialState);
    setModalOpen(true);
  };

  const openEditModal = (tag) => {
    setEditingId(tag.id);
    setFormData({ ...tag });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      updateTag.mutate(
        { id: editingId, body: formData },
        { onSuccess: () => setModalOpen(false) },
      );
    } else {
      createTag.mutate(formData, { onSuccess: () => setModalOpen(false) });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this tag?")) {
      deleteTag.mutate(id, { onSuccess: () => get("tag") });
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Tag Management</h1>
        <button
          onClick={openCreateModal}
          className="px-5 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition"
        >
          + New Tag
        </button>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error.message}</p>}

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow p-4 overflow-auto max-h-[70vh]">
        <table className="w-full border-collapse text-sm min-w-[600px]">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {["ID", "Name", "Slug", "Color", "Preview", "Actions"].map(
                (th) => (
                  <th
                    key={th}
                    className="border-b px-4 py-3 text-left text-gray-700 font-medium"
                  >
                    {th}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {tagData.map((tag, i) => (
              <tr
                key={tag.id}
                className={`${i % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}
              >
                <td className="border-b px-4 py-3">{tag.id}</td>
                <td className="border-b px-4 py-3">{tag.name}</td>
                <td className="border-b px-4 py-3">{tag.slug}</td>
                <td className="border-b px-4 py-3">{tag.color}</td>
                <td className="border-b px-4 py-3">
                  <div
                    className="w-6 h-6 rounded-full border"
                    style={{ backgroundColor: tag.color }}
                  />
                </td>
                <td className="border-b px-4 py-3 flex gap-2">
                  <button
                    onClick={() => openEditModal(tag)}
                    className="px-2 py-1 bg-yellow-400 text-white rounded text-xs hover:bg-yellow-500 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(tag.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {tagData.length === 0 && !isLoading && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-400">
                  No tags found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl space-y-4">
            <h2 className="text-xl font-semibold">
              {editingId ? "Edit Tag" : "Create Tag"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block mb-1 font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border p-3 rounded-xl"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block mb-1 font-medium">Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  className="w-full border p-3 rounded-xl"
                />
              </div>

              {/* Color */}
              <div>
                <label className="block mb-1 font-medium">Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="w-16 h-10 border rounded-lg"
                  />
                  <span className="text-sm text-gray-500">
                    {formData.color}
                  </span>
                </div>
              </div>

              {/* ACTIONS */}
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
                  disabled={createTag.isPending || updateTag.isPending}
                  className="px-4 py-2 bg-black text-white rounded-xl"
                >
                  {editingId ? "Update Tag" : "Create Tag"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagsPage;
