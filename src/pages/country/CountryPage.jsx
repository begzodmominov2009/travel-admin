import React, { useEffect, useState } from "react";
import { useApi } from "../../../hooks/useGetFetch";

const CountryPage = () => {
  const { data, loading, error, get, post, put, del } = useApi();
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    name_uz: "",
    name_ru: "",
    code: "",
    flag_url: "",
    continent: "",
    currency: "",
    language: "",
    visa_required: false,
    description: "",
    is_popular: false,
    is_active: false,
    updated_at: 0,
  });
  const [editingId, setEditingId] = useState(null);

  // GET all countries on load
  useEffect(() => {
    get("country");
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
      code: "",
      flag_url: "",
      continent: "",
      currency: "",
      language: "",
      visa_required: false,
      description: "",
      is_popular: false,
      is_active: false,
      updated_at: 0,
    });
    setModalOpen(true);
  };

  const openEditModal = (country) => {
    setEditingId(country.id);
    setFormData({ ...country });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await put(`country/${editingId}`, formData);
    } else {
      await post("country", formData);
    }
    get("country"); // Refresh table
    setModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this country?")) {
      await del(`country/${id}`);
      get("country");
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-4">Country Page</h1>

      <button
        onClick={openCreateModal}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Create Country
      </button>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Code</th>
              <th className="border px-2 py-1">Flag</th>
              <th className="border px-2 py-1">Continent</th>
              <th className="border px-2 py-1">Currency</th>
              <th className="border px-2 py-1">Visa</th>
              <th className="border px-2 py-1">Active</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="border px-2 py-1">{c.id}</td>
                <td className="border px-2 py-1">{c.name}</td>
                <td className="border px-2 py-1">{c.code}</td>
                <td className="border px-2 py-1">
                  {c.flag_url && (
                    <img src={c.flag_url} alt={c.name} className="w-6 h-4" />
                  )}
                </td>
                <td className="border px-2 py-1">{c.continent}</td>
                <td className="border px-2 py-1">{c.currency}</td>
                <td className="border px-2 py-1">
                  {c.visa_required ? "Yes" : "No"}
                </td>
                <td className="border px-2 py-1">
                  {c.is_active ? "Yes" : "No"}
                </td>
                <td className="border px-2 py-1 flex gap-2">
                  <button
                    onClick={() => openEditModal(c)}
                    className="px-2 py-1 bg-yellow-400 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
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
          <div className="bg-white p-6 rounded w-full max-w-md overflow-y-auto max-h-[90vh]">
            <h2 className="text-lg font-bold mb-4">
              {editingId ? "Edit Country" : "Create Country"}
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
                name="code"
                placeholder="Code"
                value={formData.code}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                name="flag_url"
                placeholder="Flag URL"
                value={formData.flag_url}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                name="continent"
                placeholder="Continent"
                value={formData.continent}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                name="currency"
                placeholder="Currency"
                value={formData.currency}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                name="language"
                placeholder="Language"
                value={formData.language}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="visa_required"
                  checked={formData.visa_required}
                  onChange={handleChange}
                />
                Visa Required
              </label>
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_popular"
                  checked={formData.is_popular}
                  onChange={handleChange}
                />
                Popular
              </label>
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

export default CountryPage;
