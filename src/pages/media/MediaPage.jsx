import React, { useState } from "react";
import { useGet, usePost, usePatch, useDelete } from "../../../hooks/useGetFetch";

const ENTITY_TYPES = ["tour", "destination", "hotel", "category", "package"];
const MEDIA_TYPES = ["image", "video", "document"];

const MediaPage = () => {
  // ================= QUERIES =================
  const {
    data: mediaList = [],
    isLoading,
    error,
  } = useGet("media", "media");

  // ================= MUTATIONS =================
  const createMedia = usePost("media", "media");
  const updateMedia = usePatch("media", "media");
  const deleteMedia = useDelete("media", "media");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const initialState = {
    entity_type: "",
    entity_id: 0,
    media_type: "image",
    url: "",
    thumbnail: "",
    title: "",
    sort_order: 0,
    is_cover: false,
  };

  const [formData, setFormData] = useState(initialState);

  // ================= HANDLERS =================
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

  const openCreateModal = () => {
    setEditingId(null);
    setFormData(initialState);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormData({ ...item });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateMedia.mutate(
        { id: editingId, body: formData },
        { onSuccess: () => setModalOpen(false) }
      );
    } else {
      createMedia.mutate(formData, { onSuccess: () => setModalOpen(false) });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this media?")) {
      deleteMedia.mutate(id);
    }
  };

  // ================= UI =================
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Media Management
        </h1>
        <button
          onClick={openCreateModal}
          className="px-5 py-2 bg-black text-white rounded-xl hover:opacity-80 transition"
        >
          + New Media
        </button>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error.message}</p>}


      {/* ===== TABLE VIEW ===== */}
      <div className="bg-white shadow-md rounded-2xl overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Preview</th>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Created</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Entity Type</th>
              <th className="px-4 py-3 text-left">Entity ID</th>
              <th className="px-4 py-3 text-left">Media Type</th>
              <th className="px-4 py-3 text-left">URL</th>
              <th className="px-4 py-3 text-left">Sort</th>
              <th className="px-4 py-3 text-left">Cover</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mediaList.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-2">
                  {item.thumbnail || item.url ? (
                    <img
                      src={item.thumbnail || item.url}
                      alt=""
                      className="w-12 h-12 object-cover rounded-lg cursor-pointer"
                      onClick={() => setPreviewUrl(item.url)}
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300 text-xl">
                      🖼
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-gray-400">{item.id}</td>
                <td className="px-4 py-3 text-xs text-gray-400">
                  {item.created_at === "now"
                    ? "now"
                    : new Date(item.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 font-medium">{item.title || "—"}</td>
                <td className="px-4 py-3 capitalize">{item.entity_type}</td>
                <td className="px-4 py-3">{item.entity_id}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-600 capitalize">
                    {item.media_type}
                  </span>
                </td>
                <td className="px-4 py-3 max-w-[200px] truncate text-xs text-blue-500">
                  <a href={item.url} target="_blank" rel="noreferrer">
                    {item.url}
                  </a>
                </td>
                <td className="px-4 py-3">{item.sort_order}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${item.is_cover
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-gray-100 text-gray-400"
                      }`}
                  >
                    {item.is_cover ? "Cover" : "No"}
                  </span>
                </td>
                <td className="px-4 py-3 flex justify-end gap-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:opacity-80 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:opacity-80 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== IMAGE PREVIEW MODAL ===== */}
      {previewUrl && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setPreviewUrl(null)}
        >
          <img
            src={previewUrl}
            alt="preview"
            className="max-w-3xl max-h-[85vh] rounded-2xl shadow-2xl object-contain"
          />
          <button
            className="absolute top-6 right-8 text-white text-3xl hover:opacity-70"
            onClick={() => setPreviewUrl(null)}
          >
            ×
          </button>
        </div>
      )}

      {/* ===== CREATE / EDIT MODAL ===== */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-5">
              {editingId ? "Edit Media" : "Add Media"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">

              {/* Entity Type */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Entity Type</label>
                <select
                  name="entity_type"
                  value={formData.entity_type}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-black outline-none bg-white"
                  required
                >
                  <option value="">Select Entity Type</option>
                  {ENTITY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Entity ID */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Entity ID</label>
                <input
                  type="number"
                  name="entity_id"
                  value={formData.entity_id}
                  onChange={handleChange}
                  min={0}
                  className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
                />
              </div>

              {/* Media Type */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Media Type</label>
                <select
                  name="media_type"
                  value={formData.media_type}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-black outline-none bg-white"
                >
                  {MEDIA_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* URL */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">URL</label>
                <input
                  type="text"
                  name="url"
                  placeholder="https://..."
                  value={formData.url}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
                  required
                />
                {formData.url && (
                  <img
                    src={formData.url}
                    alt="preview"
                    className="mt-2 w-full h-40 object-cover rounded-xl border"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                )}
              </div>

              {/* Thumbnail */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Thumbnail URL</label>
                <input
                  type="text"
                  name="thumbnail"
                  placeholder="https://..."
                  value={formData.thumbnail}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
                />
              </div>

              {/* Title */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Media title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
                />
              </div>

              {/* Sort Order */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Sort Order</label>
                <input
                  type="number"
                  name="sort_order"
                  value={formData.sort_order}
                  onChange={handleChange}
                  min={0}
                  className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-black outline-none"
                />
              </div>

              {/* is_cover */}
              <label className="flex items-center gap-3 text-sm mt-2">
                <input
                  type="checkbox"
                  name="is_cover"
                  checked={formData.is_cover}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                Is Cover
              </label>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMedia.isPending || updateMedia.isPending}
                  className="px-4 py-2 rounded-xl bg-black text-white hover:opacity-80 transition"
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

export default MediaPage;
