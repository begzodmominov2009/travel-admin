import React, { useState } from "react";
import {
  useGet,
  usePost,
  useDelete,
  usePatch,
} from "../../../hooks/useGetFetch";

const PackagesPage = () => {
  const { data: packageData = [], isLoading, error, get } = useGet("package", "package");
  const { data: countryData = [] } = useGet("country", "country");
  const { data: destinationData = [] } = useGet("destination", "destination");

  const createPackage = usePost("package", "package");
  const updatePackage = usePatch("package", "package");
  const deletePackage = useDelete("package", "package");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialState = {
    title: "",
    title_uz: "",
    title_ru: "",
    slug: "",
    description: "",
    package_type: "",
    country_id: "",
    destination_id: "",
    duration_days: 0,
    duration_nights: 0,
    total_price: 0,
    original_price: 0,
    currency: "USD",
    discount_pct: 0,
    min_people: 1,
    max_people: 10,
    includes: [""],
    excludes: [""],
    itinerary: "",
    departure_city: "",
    departure_date: "",
    is_flexible: false,
    cover_image: "",
    is_featured: false,
    is_active: true,
  };

  const [formData, setFormData] = useState(initialState);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData(initialState);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormData({
      ...initialState,
      ...item,
      includes: item.includes.length ? item.includes : [""],
      excludes: item.excludes.length ? item.excludes : [""],
    });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? Number(value)
            : value,
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData((prev) => {
      const updated = [...prev[field]];
      updated[index] = value;
      return { ...prev, [field]: updated };
    });
  };

  const addArrayField = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      // PATCH: id URL orqali, formData body
      updatePackage.mutate(
        { id: editingId, body: formData },
        { onSuccess: () => get("package") }
      );
    } else {
      createPackage.mutate(formData, { onSuccess: () => get("package") });
    }
    setModalOpen(false);
  };
  const handleDelete = (id) => {
    if (window.confirm("Delete this package?")) {
      deletePackage.mutate(id, { onSuccess: () => get("package") });
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Package Management</h1>
        <button
          onClick={openCreateModal}
          className="px-5 py-2 bg-black text-white rounded-xl"
        >
          + New Package
        </button>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error.message}</p>}

      <div className="bg-white rounded-xl shadow p-4 overflow-auto">
        <table className="min-w-[1600px] w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              {[
                "Title",
                "Slug",
                "Type",
                "Country",
                "Destination",
                "Price",
                "Discount",
                "Days/Nights",
                "People",
                "Featured",
                "Active",
                "Actions",
              ].map((th) => (
                <th key={th} className="px-3 py-2 text-left">{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {packageData.map((item, i) => (
              <tr key={item.id} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="px-3 py-2">{item.title}</td>
                <td className="px-3 py-2">{item.slug}</td>
                <td className="px-3 py-2">{item.package_type}</td>
                <td className="px-3 py-2">{item.country_id}</td>
                <td className="px-3 py-2">{item.destination_id}</td>
                <td className="px-3 py-2">{item.total_price} {item.currency}</td>
                <td className="px-3 py-2">{item.discount_pct}%</td>
                <td className="px-3 py-2">{item.duration_days}/{item.duration_nights}</td>
                <td className="px-3 py-2">{item.min_people}-{item.max_people}</td>
                <td className="px-3 py-2">{item.is_featured ? "Yes" : "No"}</td>
                <td className="px-3 py-2">{item.is_active ? "Yes" : "No"}</td>
                <td className="px-3 py-2 flex gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="px-2 py-1 bg-yellow-400 text-white rounded text-xs"
                  >Edit</button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                  >Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full max-w-3xl p-6 rounded-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Package" : "Create Package"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* TEXT INPUTS */}
                {[
                  "title", "title_uz", "title_ru", "slug", "package_type", "departure_city", "cover_image", "currency"
                ].map((field) => (
                  <div key={field} className="flex flex-col">
                    <label className="font-medium mb-1">{field}</label>
                    <input
                      type="text"
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="w-full border p-3 rounded-xl"
                    />
                  </div>
                ))}

                {/* NUMBER INPUTS */}
                {[
                  "duration_days", "duration_nights", "total_price", "original_price", "discount_pct", "min_people", "max_people"
                ].map((field) => (
                  <div key={field} className="flex flex-col">
                    <label className="font-medium mb-1">{field}</label>
                    <input
                      type="number"
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="w-full border p-3 rounded-xl"
                    />
                  </div>
                ))}

                {/* COUNTRY SELECT */}
                <div className="flex flex-col">
                  <label className="font-medium mb-1">Country</label>
                  <select
                    name="country_id"
                    value={formData.country_id}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-xl"
                  >
                    <option value="">Select Country</option>
                    {countryData.map((country) => (
                      <option key={country.id} value={country.id}>{country.name}</option>
                    ))}
                  </select>
                </div>

                {/* DESTINATION SELECT */}
                <div className="flex flex-col">
                  <label className="font-medium mb-1">Destination</label>
                  <select
                    name="destination_id"
                    value={formData.destination_id}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-xl"
                  >
                    <option value="">Select Destination</option>
                    {destinationData.map((destination) => (
                      <option key={destination.id} value={destination.id}>{destination.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* TEXTAREAS */}
              <textarea
                name="description"
                placeholder="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl"
              />
              <textarea
                name="itinerary"
                placeholder="itinerary"
                value={formData.itinerary}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl"
              />

              <input
                type="date"
                name="departure_date"
                value={formData.departure_date}
                onChange={handleChange}
                className="w-full border p-3 rounded-xl"
              />

              <label className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  name="is_flexible"
                  checked={formData.is_flexible}
                  onChange={handleChange}
                />
                Flexible Date
              </label>

              {/* DYNAMIC INCLUDES */}
              <div>
                <label className="font-medium">Includes</label>
                {formData.includes.map((item, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange("includes", index, e.target.value)}
                      className="w-full border p-3 rounded-xl"
                      placeholder="Include item"
                    />
                    {index === formData.includes.length - 1 && (
                      <button
                        type="button"
                        onClick={() => addArrayField("includes")}
                        className="px-4 bg-black text-white rounded-xl"
                      >
                        Add Include
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* DYNAMIC EXCLUDES */}
              <div>
                <label className="font-medium mt-3 block">Excludes</label>
                {formData.excludes.map((item, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange("excludes", index, e.target.value)}
                      className="w-full border p-3 rounded-xl"
                      placeholder="Exclude item"
                    />
                    {index === formData.excludes.length - 1 && (
                      <button
                        type="button"
                        onClick={() => addArrayField("excludes")}
                        className="px-4 bg-black text-white rounded-xl"
                      >
                        Add Exclude
                      </button>
                    )}
                  </div>
                ))}
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

export default PackagesPage;