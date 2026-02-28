import React, { useState } from "react";
import {
  useGet,
  usePost,
  usePatch,
  useDelete,
} from "../../../hooks/useGetFetch";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// MAP PICKER COMPONENT
const LocationPicker = ({ lat, lng, setLat, setLng }) => {
  useMapEvents({
    click(e) {
      setLat(e.latlng.lat);
      setLng(e.latlng.lng);
    },
  });
  return <Marker position={[lat, lng]} />;
};

const TourPage = () => {
  // ================= DATA =================
  const {
    data: tourData = [],
    isLoading,
    error,
    get,
  } = useGet("tours", "tour");
  const { data: destinationData = [] } = useGet("destinations", "destination");
  const { data: categoryData = [] } = useGet("categories", "category");

  const createTour = usePost("tour", "tours");
  const updateTour = usePatch("tour", "tours");
  const deleteTour = useDelete("tour", "tours");

  // ================= STATE =================
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialState = {
    destination_id: "",
    category_id: "",
    title: "",
    title_uz: "",
    title_ru: "",
    slug: "",
    description: "",
    highlights: [],
    includes: [],
    excludes: [],
    itinerary: "",
    duration_days: 0,
    duration_nights: 0,
    min_people: 1,
    max_people: 10,
    difficulty: "",
    base_price: 0,
    currency: "USD",
    discount_pct: 0,
    cover_image: "",
    meeting_point: "",
    meeting_lat: 0,
    meeting_lng: 0,
    is_featured: false,
    is_active: true,
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

  const handleArrayChange = (e, field) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value.split(",") }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateTour.mutate(
        { id: editingId, body: formData },
        { onSuccess: () => get("tours") },
      );
    } else {
      createTour.mutate(formData, { onSuccess: () => get("tours") });
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this tour?")) {
      deleteTour.mutate(id, { onSuccess: () => get("tours") });
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Tour Management</h1>
        <button
          onClick={openCreateModal}
          className="px-5 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition"
        >
          + New Tour
        </button>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error.message}</p>}

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow p-4 overflow-auto max-h-[70vh]">
        <div className="overflow-x-auto">
          <table className="min-w-[1800px] w-full border-collapse text-sm">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                {[
                  "Cover",
                  "Title",
                  "Slug",
                  "Description",
                  "Highlights",
                  "Includes",
                  "Excludes",
                  "Itinerary",
                  "Days/Nights",
                  "People",
                  "Difficulty",
                  "Price",
                  "Discount %",
                  "Meeting Point",
                  "Lat/Lng",
                  "Destination",
                  "Category",
                  "Featured",
                  "Active",
                  "Actions",
                ].map((th) => (
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
              {tourData.map((tour, i) => (
                <tr
                  key={tour.id}
                  className={`${i % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}
                >
                  {/* Cover Image */}
                  <td className="border-b border-gray-200 px-3 py-2 max-w-[80px] h-[60px] flex justify-center items-center">
                    {tour.cover_image ? (
                      <img
                        className="h-[50px] w-[50px] object-cover rounded"
                        src={tour.cover_image}
                        alt=""
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">No Image</span>
                    )}
                  </td>

                  {/* Other fields */}
                  {[
                    tour.title,
                    tour.slug,
                    tour.description,
                    tour.highlights.join(", "),
                    tour.includes.join(", "),
                    tour.excludes.join(", "),
                    tour.itinerary,
                    `${tour.duration_days}/${tour.duration_nights}`,
                    `${tour.min_people}-${tour.max_people}`,
                    tour.difficulty,
                    `${tour.base_price} ${tour.currency}`,
                    `${tour.discount_pct}%`,
                    tour.meeting_point,
                    `${tour.meeting_lat}, ${tour.meeting_lng}`,
                    destinationData.find((d) => d.id === tour.destination_id)
                      ?.name || "-",
                    categoryData.find((c) => c.id === tour.category_id)?.name ||
                      "-",
                    tour.is_featured ? "Yes" : "No",
                    tour.is_active ? "Yes" : "No",
                  ].map((cell, idx) => (
                    <td
                      key={idx}
                      className="border-b border-gray-200 whitespace-nowrap px-3 py-2 max-w-[200px] overflow-x-auto"
                    >
                      {cell}
                    </td>
                  ))}

                  {/* Actions */}
                  <td className="border-b border-gray-200 px-3 py-2 flex gap-2">
                    <button
                      onClick={() => openEditModal(tour)}
                      className="px-2 py-1 bg-yellow-400 text-white rounded text-xs hover:bg-yellow-500 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tour.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {tourData.length === 0 && !isLoading && (
                <tr>
                  <td colSpan="20" className="text-center py-6 text-gray-400">
                    No tours found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-5xl p-6 rounded-2xl shadow-xl overflow-y-auto max-h-[90vh] space-y-4">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Tour" : "Create Tour"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Fields */}
              {[
                {
                  label: "Destination",
                  name: "destination_id",
                  type: "select",
                  options: destinationData,
                },
                {
                  label: "Category",
                  name: "category_id",
                  type: "select",
                  options: categoryData,
                },
                { label: "Title", name: "title" },
                { label: "Slug", name: "slug" },
                { label: "Title (Uz)", name: "title_uz" },
                { label: "Title (Ru)", name: "title_ru" },
                { label: "Description", name: "description", type: "textarea" },
                { label: "Itinerary", name: "itinerary", type: "textarea" },
                { label: "Highlights", name: "highlights" },
                { label: "Includes", name: "includes" },
                { label: "Excludes", name: "excludes" },
                { label: "Difficulty", name: "difficulty" },
                {
                  label: "Duration Days",
                  name: "duration_days",
                  type: "number",
                },
                {
                  label: "Duration Nights",
                  name: "duration_nights",
                  type: "number",
                },
                { label: "Min People", name: "min_people", type: "number" },
                { label: "Max People", name: "max_people", type: "number" },
                { label: "Base Price", name: "base_price", type: "number" },
                { label: "Currency", name: "currency" },
                { label: "Discount %", name: "discount_pct", type: "number" },
                { label: "Cover Image", name: "cover_image" },
                { label: "Meeting Point", name: "meeting_point" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block mb-1 font-medium">
                    {field.label}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full border p-3 rounded-xl"
                    />
                  ) : field.type === "number" ? (
                    <input
                      type="number"
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full border p-3 rounded-xl"
                    />
                  ) : field.type === "select" ? (
                    <select
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full border p-3 rounded-xl"
                      required
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      name={field.name}
                      value={
                        ["highlights", "includes", "excludes"].includes(
                          field.name,
                        )
                          ? formData[field.name].join(",")
                          : formData[field.name]
                      }
                      onChange={
                        ["highlights", "includes", "excludes"].includes(
                          field.name,
                        )
                          ? (e) => handleArrayChange(e, field.name)
                          : handleChange
                      }
                      className="w-full border p-3 rounded-xl"
                    />
                  )}
                </div>
              ))}

              {/* Map */}
              <div>
                <label className="block mb-1 font-medium">
                  Meeting Location (Map Click)
                </label>
                <div className="w-full h-64">
                  <MapContainer
                    center={[
                      formData.meeting_lat || 41.2995,
                      formData.meeting_lng || 69.2401,
                    ]}
                    zoom={6}
                    className="h-full w-full rounded-xl"
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationPicker
                      lat={formData.meeting_lat}
                      lng={formData.meeting_lng}
                      setLat={(lat) =>
                        setFormData((prev) => ({ ...prev, meeting_lat: lat }))
                      }
                      setLng={(lng) =>
                        setFormData((prev) => ({ ...prev, meeting_lng: lng }))
                      }
                    />
                  </MapContainer>
                  <p className="text-sm text-gray-500 mt-1">
                    Lat: {formData.meeting_lat}, Lng: {formData.meeting_lng}
                  </p>
                </div>
              </div>

              {/* Flags */}
              <div className="flex gap-3 items-center mt-2">
                <label className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                  />
                  Featured
                </label>
                <label className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                  />
                  Active
                </label>
              </div>

              {/* Submit */}
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
                  disabled={createTour.isPending || updateTour.isPending}
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

export default TourPage;
