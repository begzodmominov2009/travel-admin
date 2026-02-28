import React, { useState } from "react";
import {
  useGet,
  usePost,
  usePatch,
  useDelete,
} from "../../../hooks/useGetFetch";

const PackageHotelPage = () => {
  // ================= DATA =================
  const {
    data: packageHotels = [],
    isLoading,
    error,
    get,
  } = useGet("package_hotels", "package_hotel");
  const { data: packages = [] } = useGet("packages", "package");
  const { data: hotels = [] } = useGet("hotels", "hotel");

  const createPackageHotel = usePost("package_hotel", "package_hotels");
  const updatePackageHotel = usePatch("package_hotel", "package_hotels");
  const deletePackageHotel = useDelete("package_hotel", "package_hotels");

  // ================= STATE =================
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialState = {
    package_id: "",
    hotel_id: "",
    night_from: 0,
    night_to: 0,
    room_type: "",
    sort_order: 0,
  };
  const [formData, setFormData] = useState(initialState);

  // ================= HANDLERS =================
  const openCreateModal = () => {
    setEditingId(null);
    setFormData(initialState);
    setModalOpen(true);
  };

  const openEditModal = (ph) => {
    setEditingId(ph.id);
    setFormData({ ...ph });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updatePackageHotel.mutate(
        { id: editingId, body: formData },
        { onSuccess: () => get("package_hotels") },
      );
    } else {
      createPackageHotel.mutate(formData, {
        onSuccess: () => get("package_hotels"),
      });
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      deletePackageHotel.mutate(id, { onSuccess: () => get("package_hotels") });
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Package Hotels Management</h1>
        <button
          onClick={openCreateModal}
          className="px-5 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition"
        >
          + New Record
        </button>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error.message}</p>}

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow p-4 overflow-auto max-h-[70vh]">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full border-collapse text-sm">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                {[
                  "Package",
                  "Hotel",
                  "Night From",
                  "Night To",
                  "Room Type",
                  "Sort Order",
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
              {packageHotels.map((ph, i) => (
                <tr
                  key={ph.id}
                  className={`${i % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}
                >
                  <td className="border-b border-gray-200 px-3 py-2">
                    {packages.find((p) => p.id === ph.package_id)?.title || "-"}
                  </td>
                  <td className="border-b border-gray-200 px-3 py-2">
                    {hotels.find((h) => h.id === ph.hotel_id)?.name || "-"}
                  </td>
                  <td className="border-b border-gray-200 px-3 py-2">
                    {ph.night_from}
                  </td>
                  <td className="border-b border-gray-200 px-3 py-2">
                    {ph.night_to}
                  </td>
                  <td className="border-b border-gray-200 px-3 py-2">
                    {ph.room_type}
                  </td>
                  <td className="border-b border-gray-200 px-3 py-2">
                    {ph.sort_order}
                  </td>
                  <td className="border-b border-gray-200 px-3 py-2 flex gap-2">
                    <button
                      onClick={() => openEditModal(ph)}
                      className="px-2 py-1 bg-yellow-400 text-white rounded text-xs hover:bg-yellow-500 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ph.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {packageHotels.length === 0 && !isLoading && (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-400">
                    No records found
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
          <div className="bg-white w-full max-w-3xl p-6 rounded-2xl shadow-xl overflow-y-auto max-h-[90vh] space-y-4">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Record" : "Create Record"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Package select */}
              <div>
                <label className="block mb-1 font-medium">Package</label>
                <select
                  name="package_id"
                  value={formData.package_id}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-xl"
                  required
                >
                  <option value="">Select Package</option>
                  {packages.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Hotel select */}
              <div>
                <label className="block mb-1 font-medium">Hotel</label>
                <select
                  name="hotel_id"
                  value={formData.hotel_id}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-xl"
                  required
                >
                  <option value="">Select Hotel</option>
                  {hotels.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Numbers */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block mb-1 font-medium">Night From</label>
                  <input
                    type="number"
                    name="night_from"
                    value={formData.night_from}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-xl"
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-1 font-medium">Night To</label>
                  <input
                    type="number"
                    name="night_to"
                    value={formData.night_to}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-xl"
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-1 font-medium">Sort Order</label>
                  <input
                    type="number"
                    name="sort_order"
                    value={formData.sort_order}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-xl"
                  />
                </div>
              </div>

              {/* Room type */}
              <div>
                <label className="block mb-1 font-medium">Room Type</label>
                <input
                  type="text"
                  name="room_type"
                  value={formData.room_type}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-xl"
                />
              </div>

              {/* Buttons */}
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
                  disabled={
                    createPackageHotel.isPending || updatePackageHotel.isPending
                  }
                  className="px-4 py-2 bg-black text-white rounded-xl"
                >
                  {editingId ? "Update Record" : "Create Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageHotelPage;
