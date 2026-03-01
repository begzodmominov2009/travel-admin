"use client";

import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useDelete, useGet, usePatch, usePost } from "../../../hooks/useGetFetch";

// ================= MAP PICKER =================
const LocationPicker = ({ lat, lng, setLat, setLng }) => {
  useMapEvents({
    click(e) {
      setLat(e.latlng.lat);
      setLng(e.latlng.lng);
    },
  });
  return <Marker position={[lat, lng]} />;
};

const HotelPage = () => {
  // ================= DATA =================
  const { data: hotelData = [], isLoading, error, get } = useGet("hotel", "hotel");
  const { data: destinationData = [] } = useGet("destination", "destination");

  const createHotel = usePost("hotel", "hotel");
  const updateHotel = usePatch("hotel", "hotel");
  const deleteHotel = useDelete("hotel", "hotel");

  // ================= STATE =================
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialState = {
    destination_id: "",
    name: "",
    slug: "",
    description: "",
    address: "",
    latitude: 0,
    longitude: 0,
    stars: 0,
    price_per_night: 0,
    currency: "USD",
    phone: "",
    email: "",
    website: "",
    check_in_time: "",
    check_out_time: "",
    amenities: [],
    cover_image: "",
    is_active: true,
  };
  const [formData, setFormData] = useState(initialState);

  // ================= HANDLERS =================
  const openCreateModal = () => {
    setEditingId(null);
    setFormData(initialState);
    setModalOpen(true);
  };

  const openEditModal = (hotel) => {
    setEditingId(hotel.id);
    setFormData({ ...hotel });
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
      updateHotel.mutate({ id: editingId, body: formData }, { onSuccess: () => get("hotel") });
    } else {
      createHotel.mutate(formData, { onSuccess: () => get("hotel") });
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this hotel?")) {
      deleteHotel.mutate(id, { onSuccess: () => get("hotel") });
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Hotel Management</h1>
        <button
          onClick={openCreateModal}
          className="px-5 py-2 bg-black text-white rounded-xl"
        >
          + New Hotel
        </button>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error.message}</p>}

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl shadow p-4 overflow-auto max-h-[70vh]">
        <div className="overflow-x-auto">
          <table className="min-w-[1400px] w-full border-collapse text-sm">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                {[
                  "Cover",
                  "Name",
                  "Destination",
                  "Slug",
                  "Address",
                  "Stars",
                  "Price/Night",
                  "Currency",
                  "Phone",
                  "Email",
                  "Website",
                  "Check-in/Check-out",
                  "Amenities",
                  "Lat/Lng",
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
              {hotelData.map((hotel, i) => (
                <tr
                  key={hotel.id}
                  className={`${i % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}
                >
                  <td className="border-b border-gray-200 px-3 py-2 flex justify-center items-center">
                    {hotel.cover_image ? (
                      <img
                        className="h-12 w-12 object-cover rounded"
                        src={hotel.cover_image}
                        alt=""
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">No Image</span>
                    )}
                  </td>
                  <td className="border-b border-gray-200 px-3 py-2">{hotel.name}</td>
                  <td className="border-b border-gray-200 px-3 py-2">
                    {destinationData.find((d) => d.id === hotel.destination_id)?.name || "-"}
                  </td>
                  <td className="border-b border-gray-200 px-3 py-2">{hotel.slug}</td>
                  <td className="border-b border-gray-200 px-3 py-2">{hotel.address}</td>
                  <td className="border-b border-gray-200 px-3 py-2">{hotel.stars}</td>
                  <td className="border-b border-gray-200 px-3 py-2">{hotel.price_per_night}</td>
                  <td className="border-b border-gray-200 px-3 py-2">{hotel.currency}</td>
                  <td className="border-b border-gray-200 px-3 py-2">{hotel.phone}</td>
                  <td className="border-b border-gray-200 px-3 py-2">{hotel.email}</td>
                  <td className="border-b border-gray-200 px-3 py-2">{hotel.website}</td>
                  <td className="border-b border-gray-200 px-3 py-2">
                    {hotel.check_in_time} / {hotel.check_out_time}
                  </td>
                  <td className="border-b border-gray-200 px-3 py-2">
                    {hotel.amenities.join(", ")}
                  </td>
                  <td className="border-b border-gray-200 px-3 py-2">
                    {hotel.latitude}, {hotel.longitude}
                  </td>
                  <td className="border-b border-gray-200 px-3 py-2">
                    {hotel.is_active ? "Yes" : "No"}
                  </td>
                  <td className="border-b border-gray-200 px-3 py-2 flex gap-2">
                    <button
                      onClick={() => openEditModal(hotel)}
                      className="px-2 py-1 bg-yellow-400 text-white rounded text-xs hover:bg-yellow-500 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(hotel.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-5xl p-6 rounded-2xl shadow-xl overflow-y-auto max-h-[90vh] space-y-4">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Hotel" : "Create Hotel"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {[
                { label: "Destination", name: "destination_id", type: "select", options: destinationData },
                { label: "Name", name: "name" },
                { label: "Slug", name: "slug" },
                { label: "Description", name: "description", type: "textarea" },
                { label: "Address", name: "address" },
                { label: "Latitude", name: "latitude", type: "number" },
                { label: "Longitude", name: "longitude", type: "number" },
                { label: "Stars", name: "stars", type: "number" },
                { label: "Price/Night", name: "price_per_night", type: "number" },
                { label: "Currency", name: "currency" },
                { label: "Phone", name: "phone" },
                { label: "Email", name: "email" },
                { label: "Website", name: "website" },
                { label: "Check-in Time", name: "check_in_time" },
                { label: "Check-out Time", name: "check_out_time" },
                { label: "Amenities", name: "amenities" },
                { label: "Cover Image", name: "cover_image" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block mb-1 font-medium">{field.label}</label>
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
                    >
                      <option value="">Select {field.label}</option>
                      {field.options?.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.name}
                        </option>
                      ))}
                    </select>
                  ) : field.name === "amenities" ? (
                    <input
                      type="text"
                      name={field.name}
                      value={formData.amenities.join(",")}
                      onChange={(e) => handleArrayChange(e, field.name)}
                      className="w-full border p-3 rounded-xl"
                    />
                  ) : (
                    <input
                      type="text"
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full border p-3 rounded-xl"
                    />
                  )}
                </div>
              ))}

              {/* Map */}
              <div>
                <label className="block mb-1 font-medium">Hotel Location (Click Map)</label>
                <div className="w-full h-64">
                  <MapContainer
                    center={[formData.latitude || 41.2995, formData.longitude || 69.2401]}
                    zoom={6}
                    className="h-full w-full rounded-xl"
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationPicker
                      lat={formData.latitude}
                      lng={formData.longitude}
                      setLat={(lat) => setFormData((prev) => ({ ...prev, latitude: lat }))}
                      setLng={(lng) => setFormData((prev) => ({ ...prev, longitude: lng }))}
                    />
                  </MapContainer>
                  <p className="text-sm text-gray-500 mt-1">
                    Lat: {formData.latitude}, Lng: {formData.longitude}
                  </p>
                </div>
              </div>

              {/* Active Checkbox */}
              <div className="flex gap-3 items-center mt-2">
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
                  className="px-4 py-2 bg-black text-white rounded-xl"
                >
                  {editingId ? "Update Hotel" : "Create Hotel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelPage;