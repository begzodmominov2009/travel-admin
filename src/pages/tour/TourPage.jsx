"use client";

import React, { useState } from "react";
import { useDelete, useGet, usePost } from "../../../hooks/useGetFetch";

const TourTagPage = () => {
  // ================= DATA =================
  const { data: tourTags = [], isLoading, error, get } = useGet("tour_tag", "tour_tag");
  const createTourTag = usePost("tour_tag", "tour_tag");
  const deleteTourTag = useDelete("tour_tag", "tour_tag");

  // ================= STATE =================
  const [formData, setFormData] = useState({
    tour_id: "",
    tag_id: "",
  });

  // ================= HANDLERS =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createTourTag.mutate(formData, {
      onSuccess: () => {
        get("tour_tag");
        setFormData({ tour_id: "", tag_id: "" });
      },
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this tour_tag?")) {
      deleteTourTag.mutate(id, { onSuccess: () => get("tour_tag") });
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Tour Tag Management</h1>

      {/* =============== FORM =============== */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4 max-w-md">
        <div>
          <label className="block mb-1 font-medium">Tour ID</label>
          <input
            type="text"
            name="tour_id"
            value={formData.tour_id}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
            placeholder="Enter tour id"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Tag ID</label>
          <input
            type="text"
            name="tag_id"
            value={formData.tag_id}
            onChange={handleChange}
            className="w-full border p-3 rounded-xl"
            placeholder="Enter tag id"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-black text-white rounded-xl"
        >
          Create Tour Tag
        </button>
      </form>

      {/* =============== TABLE =============== */}
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error.message}</p>}

      <div className="bg-white rounded-xl shadow p-4 overflow-auto max-h-[70vh]">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="border-b border-gray-200 px-3 py-2">ID</th>
              <th className="border-b border-gray-200 px-3 py-2">Tour ID</th>
              <th className="border-b border-gray-200 px-3 py-2">Tag ID</th>
              <th className="border-b border-gray-200 px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tourTags.map((tt, i) => (
              <tr
                key={tt.id}
                className={`${i % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}
              >
                <td className="border-b border-gray-200 px-3 py-2">{tt.id}</td>
                <td className="border-b border-gray-200 px-3 py-2">{tt.tour_id}</td>
                <td className="border-b border-gray-200 px-3 py-2">{tt.tag_id}</td>
                <td className="border-b border-gray-200 px-3 py-2">
                  <button
                    onClick={() => handleDelete(tt.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {tourTags.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No tour tags found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TourTagPage;