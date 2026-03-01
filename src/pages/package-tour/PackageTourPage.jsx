import React, { useState } from "react";
import {
  useGet,
  usePost,
  usePatch,
  useDelete,
} from "../../../hooks/useGetFetch";

const PackageTourPage = () => {
  // ================= DATA =================
  const {
    data: packageTours = [],
    isLoading,
    error,
    get,
  } = useGet("package_tours", "package_tour");
  const { data: packages = [] } = useGet("packages", "package");
  const { data: tours = [] } = useGet("tours", "tour");

  const createPackageTour = usePost("package_tour", "package_tours");
  const updatePackageTour = usePatch("package_tour", "package_tours");
  const deletePackageTour = useDelete("package_tour", "package_tours");

  // ================= STATE =================
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialState = {
    package_id: "",
    tour_id: "",
    day_number: 0,
    sort_order: 0,
  };
  const [formData, setFormData] = useState(initialState);

  // ================= HANDLERS =================
  const openCreateModal = () => {
    setEditingId(null);
    setFormData(initialState);
    setModalOpen(true);
  };

  const openEditModal = (pt) => {
    setEditingId(pt.id);
    setFormData({ ...pt });
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
      updatePackageTour.mutate(
        { id: editingId, body: formData },
        { onSuccess: () => get("package_tours") },
      );
    } else {
      createPackageTour.mutate(formData, {
        onSuccess: () => get("package_tours"),
      });
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      deletePackageTour.mutate(id, { onSuccess: () => get("package_tours") });
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Package Tours Management</h1>
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
          <table className="min-w-[700px] w-full border-collapse text-sm">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                {["Package", "Tour", "Day Number", "Sort Order", "Actions"].map(
                  (th) => (
                    <th
                      key={th}
                      className="border-b border-gray-200 px-3 py-2 font-medium text-gray-700 text-left"
                    >
                      {th}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {packageTours.map((pt, i) => (
                <tr
                  key={pt.id}
                  className={`${i % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}
                >
                  <td className="border-b border-gray-200 px-3 py-2">
                    {packages.find((p) => p.id === pt.package_id)?.title || "-"}
                  </td>
                  <td className="border-b border-gray-200 px-3 py-2">
                    {tours.find((t) => t.id === pt.tour_id)?.title || "-"}
                  </td>
                  <td className="border-b border-gray-200 px-3 py-2">
                    {pt.day_number}
                  </td>
                  <td className="border-b border-gray-200 px-3 py-2">
                    {pt.sort_order}
                  </td>
                  <td className="border-b border-gray-200 px-3 py-2 flex gap-2">
                    <button
                      onClick={() => openEditModal(pt)}
                      className="px-2 py-1 bg-yellow-400 text-white rounded text-xs hover:bg-yellow-500 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(pt.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {packageTours.length === 0 && !isLoading && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-400">
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
          <div className="bg-white w-full max-w-2xl p-6 rounded-2xl shadow-xl overflow-y-auto max-h-[90vh] space-y-4">
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

              {/* Tour select */}
              <div>
                <label className="block mb-1 font-medium">Tour</label>
                <select
                  name="tour_id"
                  value={formData.tour_id}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-xl"
                  required
                >
                  <option value="">Select Tour</option>
                  {tours.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Day Number */}
              <div>
                <label className="block mb-1 font-medium">Day Number</label>
                <input
                  type="number"
                  name="day_number"
                  value={formData.day_number}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-xl"
                  min={0}
                  required
                />
              </div>

              {/* Sort Order */}
              <div>
                <label className="block mb-1 font-medium">Sort Order</label>
                <input
                  type="number"
                  name="sort_order"
                  value={formData.sort_order}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-xl"
                  min={0}
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
                    createPackageTour.isPending || updatePackageTour.isPending
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

export default PackageTourPage;
