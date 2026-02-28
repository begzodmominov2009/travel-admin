import React, { useEffect, useState } from "react";
import { useApi } from "../../../hooks/useGetFetch";
const CategoryPage = () => {
  const { data, loading, error, get, post, put, del } = useApi();
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    name_uz: "",
    name_ru: "",
    slug: "",
    icon: "",
    description: "",
    parent_id: null,
    sort_order: 0,
    is_active: false,
  });
  const [editingId, setEditingId] = useState(null);

  // GET all categories on load
  useEffect(() => {
    get("category");
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      name: "",
      name_uz: "",
      name_ru: "",
      slug: "",
      icon: "",
      description: "",
      parent_id: null,
      sort_order: 0,
      is_active: false,
    });
    setModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingId(category.id);
    setFormData({ ...category });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await put(`category/${editingId}`, formData);
    } else {
      await post("category", formData);
    }
    get("category"); // Refresh table
    setModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      await del(`category/${id}`);
      get("category");
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-4">Category Page</h1>

      <button
        onClick={openCreateModal}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Create Category
      </button>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Slug</th>
              <th className="border px-2 py-1">Parent ID</th>
              <th className="border px-2 py-1">Active</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="border px-2 py-1">{cat.id}</td>
                <td className="border px-2 py-1">{cat.name}</td>
                <td className="border px-2 py-1">{cat.slug}</td>
                <td className="border px-2 py-1">{cat.parent_id || "-"}</td>
                <td className="border px-2 py-1">
                  {cat.is_active ? "Yes" : "No"}
                </td>
                <td className="border px-2 py-1 flex gap-2">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="px-2 py-1 bg-yellow-400 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">
              {editingId ? "Edit Category" : "Create Category"}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              />
              <input
                type="text"
                name="name_uz"
                placeholder="Name Uz"
                value={formData.name_uz}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                name="name_ru"
                placeholder="Name Ru"
                value={formData.name_ru}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                name="slug"
                placeholder="Slug"
                value={formData.slug}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                name="icon"
                placeholder="Icon"
                value={formData.icon}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                name="parent_id"
                placeholder="Parent ID"
                value={formData.parent_id}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
              <input
                type="number"
                name="sort_order"
                placeholder="Sort Order"
                value={formData.sort_order}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                />
                Active
              </label>

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-500 text-white rounded"
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
