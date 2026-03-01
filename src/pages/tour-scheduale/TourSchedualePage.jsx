import React, { useState } from "react";
import {
  useGet,
  usePost,
  usePatch,
  useDelete,
} from "../../../hooks/useGetFetch";

const TourSchedulePage = () => {
  // ================= DATA =================
  const {
    data: schedules = [],
    isLoading,
    error,
    get,
  } = useGet("tour_schedules", "tour_schedule");
  const { data: tours = [] } = useGet("tours", "tour");

  const createSchedule = usePost("tour_schedule", "tour_schedules");
  const updateSchedule = usePatch("tour_schedule", "tour_schedules");
  const deleteSchedule = useDelete("tour_schedule", "tour_schedules");

  // ================= STATE =================
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialState = {
    tour_id: "",
    start_date: "",
    end_date: "",
    available_seats: 0,
    booked_seats: 0,
    price_override: 0,
    status: "active",
  };
  const [formData, setFormData] = useState(initialState);

  // ================= HANDLERS =================
  const openCreateModal = () => {
    setEditingId(null);
    setFormData(initialState);
    setModalOpen(true);
  };

  const openEditModal = (schedule) => {
    setEditingId(schedule.id);
    setFormData({ ...schedule });
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
      updateSchedule.mutate(
        { id: editingId, body: formData },
        { onSuccess: () => get("tour_schedules") },
      );
    } else {
      createSchedule.mutate(formData, {
        onSuccess: () => get("tour_schedules"),
      });
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      deleteSchedule.mutate(id, { onSuccess: () => get("tour_schedules") });
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Tour Schedule Management</h1>
        <button
          onClick={openCreateModal}
          className="px-5 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition"
        >
          + New Schedule
        </button>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error.message}</p>}

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow p-4 overflow-auto max-h-[70vh]">
        <div className="overflow-x-auto">
          <table className="min-w-[1000px] w-full border-collapse text-sm">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                {[
                  "Tour",
                  "Start Date",
                  "End Date",
                  "Available Seats",
                  "Booked Seats",
                  "Price Override",
                  "Status",
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
              {schedules.map((sch, i) => (
                <tr
                  key={sch.id}
                  className={`${i % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}
                >
                  <td className="border-b border-gray-200 px-3 py-2">
                    {tours.find((t) => t.id === sch.tour_id)?.title || "-"}
                  </td>
                  <td className="border-b border-gray-200 px-3 py-2">
                    {sch.start_date}
                  </td>
                  <td className="border-b border-gray-200 px-3 py-2">
                    {sch.end_date}
                  </td>
                  <td className="border-b border-gray-200 px-3 py-2">
                    {sch.available_seats}
                  </td>
                  <td className="border-b border-gray-200 px-3 py-2">
                    {sch.booked_seats}
                  </td>
                  <td className="border-b border-gray-200 px-3 py-2">
                    {sch.price_override}
                  </td>
                  <td className="border-b border-gray-200 px-3 py-2">
                    {sch.status}
                  </td>
                  <td className="border-b border-gray-200 px-3 py-2 flex gap-2">
                    <button
                      onClick={() => openEditModal(sch)}
                      className="px-2 py-1 bg-yellow-400 text-white rounded text-xs hover:bg-yellow-500 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(sch.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {schedules.length === 0 && !isLoading && (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-400">
                    No schedules found
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
              {editingId ? "Edit Schedule" : "Create Schedule"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
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

              {/* Dates */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block mb-1 font-medium">Start Date</label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-xl"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-1 font-medium">End Date</label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-xl"
                    required
                  />
                </div>
              </div>

              {/* Numbers */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block mb-1 font-medium">
                    Available Seats
                  </label>
                  <input
                    type="number"
                    name="available_seats"
                    value={formData.available_seats}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-xl"
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-1 font-medium">Booked Seats</label>
                  <input
                    type="number"
                    name="booked_seats"
                    value={formData.booked_seats}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-xl"
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-1 font-medium">
                    Price Override
                  </label>
                  <input
                    type="number"
                    name="price_override"
                    value={formData.price_override}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-xl"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block mb-1 font-medium">Status</label>
                <input
                  type="text"
                  name="status"
                  value={formData.status}
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
                    createSchedule.isPending || updateSchedule.isPending
                  }
                  className="px-4 py-2 bg-black text-white rounded-xl"
                >
                  {editingId ? "Update Schedule" : "Create Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourSchedulePage;
