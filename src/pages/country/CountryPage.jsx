import React, { useState } from "react";
import {
  useGet,
  usePost,
  usePatch,
  useDelete,
} from "../../../hooks/useGetFetch";

const CountryPage = () => {
  const {
    data: countries = [],
    isLoading,
    error,
  } = useGet("countries", "country");
  const createCountry = usePost("country", "countries");
  const updateCountry = usePatch("country", "countries");
  const deleteCountry = useDelete("country", "countries");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialState = {
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
  };
  const [formData, setFormData] = useState(initialState);

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

  const openEditModal = (country) => {
    setEditingId(country.id);
    setFormData({ ...country });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateCountry.mutate(
        { id: editingId, body: formData },
        { onSuccess: () => setModalOpen(false) },
      );
    } else {
      createCountry.mutate(formData, { onSuccess: () => setModalOpen(false) });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this country?")) {
      deleteCountry.mutate(id);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Countries</h1>
        <button
          onClick={openCreateModal}
          className="px-5 py-2 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition backdrop-blur-sm shadow-lg"
        >
          + New Country
        </button>
      </div>

      {isLoading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error.message}</p>}

      {/* ================= Modern Table ================= */}
      <div className="overflow-auto rounded-2xl shadow-lg backdrop-blur-sm bg-white/50 border border-gray-200">
        <table className="min-w-[1200px] w-full border-collapse text-sm">
          <thead className="bg-white/60 backdrop-blur-md sticky top-0 z-10 shadow-sm">
            <tr>
              {[
                "ID",
                "Flag",
                "Name",
                "Code",
                "Continent",
                "Currency",
                "Visa",
                "Popular",
                "Active",
                "Actions",
              ].map((th) => (
                <th
                  key={th}
                  className="border-b border-gray-200 px-4 py-3 text-gray-700 font-medium text-left"
                >
                  {th}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(countries) && countries.map((c, i) => (
              <tr
                key={c.id}
                className={`${i % 2 === 0 ? "bg-white/40" : "bg-white/20"
                  } hover:bg-blue-50 transition`}
              >
                <td className="border-b border-gray-200 px-3 py-2">{c.id}</td>
                <td className="border-b border-gray-200 px-3 py-2 flex items-center justify-center">
                  {c.flag_url ? (
                    <img
                      src={c.flag_url}
                      alt={c.name}
                      className="w-8 h-5 object-cover rounded shadow"
                    />
                  ) : (
                    <span className="text-gray-400 text-xs">No Flag</span>
                  )}
                </td>
                <td className="border-b border-gray-200 px-3 py-2 max-w-[150px] overflow-x-auto">
                  {c.name}
                </td>
                <td className="border-b border-gray-200 px-3 py-2">{c.code}</td>
                <td className="border-b border-gray-200 px-3 py-2">{c.continent}</td>
                <td className="border-b border-gray-200 px-3 py-2">{c.currency}</td>
                <td className="border-b border-gray-200 px-3 py-2">
                  {c.visa_required ? "Yes" : "No"}
                </td>
                <td className="border-b border-gray-200 px-3 py-2">
                  {c.is_popular ? "Yes" : "No"}
                </td>
                <td className="border-b border-gray-200 px-3 py-2">
                  {c.is_active ? "Yes" : "No"}
                </td>
                <td className="border-b border-gray-200 px-3 py-2 flex gap-2">
                  <button
                    onClick={() => openEditModal(c)}
                    className="px-2 py-1 bg-yellow-400 text-white rounded text-xs hover:bg-yellow-500 transition backdrop-blur-sm shadow-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition backdrop-blur-sm shadow-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= Modern Modal ================= */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl w-full max-w-md shadow-xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {editingId ? "Edit Country" : "Create Country"}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="text"
                name="name_uz"
                placeholder="Name Uz"
                value={formData.name_uz}
                onChange={handleChange}
                className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                name="name_ru"
                placeholder="Name Ru"
                value={formData.name_ru}
                onChange={handleChange}
                className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                name="code"
                placeholder="Code"
                value={formData.code}
                onChange={handleChange}
                className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                name="flag_url"
                placeholder="Flag URL"
                value={formData.flag_url}
                onChange={handleChange}
                className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                name="continent"
                placeholder="Continent"
                value={formData.continent}
                onChange={handleChange}
                className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                name="currency"
                placeholder="Currency"
                value={formData.currency}
                onChange={handleChange}
                className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                name="language"
                placeholder="Language"
                value={formData.language}
                onChange={handleChange}
                className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-400"
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
                className="border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-400"
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

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-xl hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
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