import React, { useState } from "react";
import { useGet, usePost, usePatch, useDelete } from "../../../hooks/useGetFetch";

const CategoryPage = () => {
  // ================= QUERIES =================
  const {
    data: categories = [],
    isLoading,
    error,
  } = useGet("categories", "category");

  // ================= MUTATIONS =================
  const createCategory = usePost("category", "categories");
  const updateCategory = usePatch("category", "categories");
  const deleteCategory = useDelete("category", "categories");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialState = {
    name: "",
    name_uz: "",
    name_ru: "",
    slug: "",
    icon: "",
    description: "",
    parent_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    sort_order: 0,
    is_active: false,
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

  const openCreateModal = () => {
    setEditingId(null);
    setFormData(initialState);
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingId(cat.id);
    setFormData({ ...cat });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      updateCategory.mutate(
        { id: editingId, body: formData },
        { onSuccess: () => setModalOpen(false) },
      );
    } else {
      createCategory.mutate(formData, { onSuccess: () => setModalOpen(false) });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this category?")) {
      deleteCategory.mutate(id);
    }
  };

  // ================= UI =================
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Category Management
        </h1>
        <button
          onClick={openCreateModal}
          className="px-5 py-2 bg-black text-white rounded-xl hover:opacity-80 transition"
        >
          + New Category
        </button>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error.message}</p>}

      <div className="bg-white shadow-md rounded-2xl overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Created</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Name Uz</th>
              <th className="px-4 py-3 text-left">Name Ru</th>
              <th className="px-4 py-3 text-left">Slug</th>
              <th className="px-4 py-3 text-left">Icon</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Parent ID</th>
              <th className="px-4 py-3 text-left">Sort</th>
              <th className="px-4 py-3 text-left">Active</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-3 text-xs text-gray-500">{cat.id}</td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {new Date(cat.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 font-medium">{cat.name}</td>
                <td className="px-4 py-3">{cat.name_uz}</td>
                <td className="px-4 py-3">{cat.name_ru}</td>
                <td className="px-4 py-3 text-gray-500">{cat.slug}</td>
                <td className="px-4 py-3">
                  <img src={cat.icon} alt="" />
                </td>
                <td className="px-4 py-3 max-w-[200px] truncate">
                  {cat.description}
                </td>
                <td className="px-4 py-3 text-xs text-gray-400">
                  {cat.parent_id}
                </td>
                <td className="px-4 py-3">{cat.sort_order}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      cat.is_active
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {cat.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 flex justify-end gap-2">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:opacity-80 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
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
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 animate-fadeIn">
            <h2 className="text-xl font-semibold mb-5">
              {editingId ? "Edit Category" : "Create Category"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
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

              <input
                type="text"
                name="icon"
                placeholder="Icon"
                value={formData.icon}
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

              <input
                type="number"
                name="sort_order"
                placeholder="Sort Order"
                value={formData.sort_order}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
              />

              <label className="flex items-center gap-3 text-sm mt-2">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                Active
              </label>

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
                    createCategory.isPending || updateCategory.isPending
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

export default CategoryPage;
