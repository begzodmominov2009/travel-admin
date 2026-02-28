import React, { useState } from "react";
import {
  useGet,
  usePost,
  usePatch,
  useDelete,
} from "../../../hooks/useGetFetch";

const FaqPage = () => {
  // ================= DATA =================
  const { data: faqs = [], isLoading, error, get } = useGet("faq", "faq");
  const { data: packages = [] } = useGet("packages", "package");
  const { data: tours = [] } = useGet("tours", "tour");
  const { data: tags = [] } = useGet("tags", "tag");

  const createFaq = usePost("faq", "faq");
  const updateFaq = usePatch("faq", "faq");
  const deleteFaq = useDelete("faq", "faq");

  // ================= STATE =================
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialState = {
    entity_type: "",
    entity_id: "",
    question: "",
    question_uz: "",
    answer: "",
    answer_uz: "",
    sort_order: 0,
    is_active: false,
  };
  const [formData, setFormData] = useState(initialState);

  // ================= HANDLERS =================
  const openCreateModal = () => {
    setEditingId(null);
    setFormData(initialState);
    setModalOpen(true);
  };

  const openEditModal = (faq) => {
    setEditingId(faq.id);
    setFormData({ ...faq });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateFaq.mutate(
        { id: editingId, body: formData },
        { onSuccess: () => get("faq") }
      );
    } else {
      createFaq.mutate(formData, { onSuccess: () => get("faq") });
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this FAQ?")) {
      deleteFaq.mutate(id, { onSuccess: () => get("faq") });
    }
  };

  const getEntityOptions = () => {
    switch (formData.entity_type) {
      case "package":
        return Array.isArray(packages) ? packages : [];
      case "tour":
        return Array.isArray(tours) ? tours : [];
      case "tag":
        return Array.isArray(tags) ? tags : [];
      default:
        return [];
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">FAQ Management</h1>
        <button
          onClick={openCreateModal}
          className="px-5 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition"
        >
          + New FAQ
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
                  "Entity Type",
                  "Entity",
                  "Question",
                  "Question Uz",
                  "Answer",
                  "Answer Uz",
                  "Sort Order",
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
              {Array.isArray(faqs) && faqs.length > 0 ? (
                faqs.map((faq, i) => (
                  <tr
                    key={faq.id}
                    className={`${i % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-gray-100`}
                  >
                    <td className="border-b border-gray-200 px-3 py-2">
                      {faq.entity_type}
                    </td>
                    <td className="border-b border-gray-200 px-3 py-2">
                      {faq.entity_type === "package"
                        ? packages.find((p) => p.id === faq.entity_id)?.title ||
                        "-"
                        : faq.entity_type === "tour"
                          ? tours.find((t) => t.id === faq.entity_id)?.title || "-"
                          : faq.entity_type === "tag"
                            ? tags.find((t) => t.id === faq.entity_id)?.name || "-"
                            : "-"}
                    </td>
                    <td className="border-b border-gray-200 px-3 py-2">
                      {faq.question}
                    </td>
                    <td className="border-b border-gray-200 px-3 py-2">
                      {faq.question_uz}
                    </td>
                    <td className="border-b border-gray-200 px-3 py-2">
                      {faq.answer}
                    </td>
                    <td className="border-b border-gray-200 px-3 py-2">
                      {faq.answer_uz}
                    </td>
                    <td className="border-b border-gray-200 px-3 py-2">
                      {faq.sort_order}
                    </td>
                    <td className="border-b border-gray-200 px-3 py-2">
                      {faq.is_active ? "Yes" : "No"}
                    </td>
                    <td className="border-b border-gray-200 px-3 py-2 flex gap-2">
                      <button
                        onClick={() => openEditModal(faq)}
                        className="px-2 py-1 bg-yellow-400 text-white rounded text-xs hover:bg-yellow-500 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(faq.id)}
                        className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                !isLoading && (
                  <tr>
                    <td colSpan="9" className="text-center py-6 text-gray-400">
                      No records found
                    </td>
                  </tr>
                )
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
              {editingId ? "Edit FAQ" : "Create FAQ"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Entity Type */}
              <div>
                <label className="block mb-1 font-medium">Entity Type</label>
                <select
                  name="entity_type"
                  value={formData.entity_type}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-xl"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="package">Package</option>
                  <option value="tour">Tour</option>
                  <option value="tag">Tag</option>
                </select>
              </div>

              {/* Entity ID */}
              <div>
                <label className="block mb-1 font-medium">Entity</label>
                <select
                  name="entity_id"
                  value={formData.entity_id}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-xl"
                  required
                  disabled={!formData.entity_type}
                >
                  <option value="">Select Entity</option>
                  {getEntityOptions().map((e) => (
                    <option key={e.id} value={e.id}>
                      {formData.entity_type === "tag" ? e.name : e.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Question / Answer */}
              <input
                type="text"
                name="question"
                value={formData.question}
                onChange={handleChange}
                placeholder="Question"
                className="w-full border p-3 rounded-xl"
                required
              />
              <input
                type="text"
                name="question_uz"
                value={formData.question_uz}
                onChange={handleChange}
                placeholder="Question Uz"
                className="w-full border p-3 rounded-xl"
              />
              <textarea
                name="answer"
                value={formData.answer}
                onChange={handleChange}
                placeholder="Answer"
                className="w-full border p-3 rounded-xl"
              />
              <textarea
                name="answer_uz"
                value={formData.answer_uz}
                onChange={handleChange}
                placeholder="Answer Uz"
                className="w-full border p-3 rounded-xl"
              />

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

              {/* Active */}
              <label className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                />
                Active
              </label>

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
                  disabled={createFaq.isPending || updateFaq.isPending}
                  className="px-4 py-2 bg-black text-white rounded-xl"
                >
                  {editingId ? "Update FAQ" : "Create FAQ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaqPage;