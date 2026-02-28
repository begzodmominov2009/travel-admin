import React, { useState } from "react";
import {
  useGet,
  usePost,
  usePatch,
  useDelete,
} from "../../../hooks/useGetFetch";

const PackageTagPage = () => {
  // ================= DATA =================
  const {
    data: packageTags = [],
    isLoading,
    error,
    get,
  } = useGet("package_tags", "package_tag");
  const { data: packages = [] } = useGet("packages", "package");
  const { data: tags = [] } = useGet("tags", "tag");

  const createPackageTag = usePost("package_tag", "package_tags");
  const updatePackageTag = usePatch("package_tag", "package_tags");
  const deletePackageTag = useDelete("package_tag", "package_tags");

  // ================= STATE =================
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialState = {
    package_id: "",
    tag_id: "",
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
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updatePackageTag.mutate(
        { id: editingId, body: formData },
        { onSuccess: () => get("package_tags") },
      );
    } else {
      createPackageTag.mutate(formData, {
        onSuccess: () => get("package_tags"),
      });
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      deletePackageTag.mutate(id, { onSuccess: () => get("package_tags") });
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Package Tags Management</h1>
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
          <table className="min-w-[600px] w-full border-collapse text-sm">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                {["Package", "Tag", "Actions"].map((th) => (
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
              {packageTags.map((pt, i) => (
                <tr
                  key={pt.id}
                  className={`${i % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}
                >
                  <td className="border-b border-gray-200 px-3 py-2">
                    {packages.find((p) => p.id === pt.package_id)?.title || "-"}
                  </td>
                  <td className="border-b border-gray-200 px-3 py-2">
                    {tags.find((t) => t.id === pt.tag_id)?.name || "-"}
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
              {packageTags.length === 0 && !isLoading && (
                <tr>
                  <td colSpan="3" className="text-center py-6 text-gray-400">
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

              {/* Tag select */}
              <div>
                <label className="block mb-1 font-medium">Tag</label>
                <select
                  name="tag_id"
                  value={formData.tag_id}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-xl"
                  required
                >
                  <option value="">Select Tag</option>
                  {tags.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
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
                    createPackageTag.isPending || updatePackageTag.isPending
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

export default PackageTagPage;
