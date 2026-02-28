// pages/TourPage.js
import React, { useEffect } from "react";

const TourPage = () => {
  const { data, loading, error, get, post, put, del } = useApi();

  useEffect(() => {
    // Sahifa yuklanganda GET request
    get("tour"); // https://x8ki-letl-twmt.n7.xano.io/api:qNrTfAaz/tour
  }, []);

  const createTour = async () => {
    await post("tour", {
      name_uz: "Yangi Tour",
      name_ru: "Новый Тур",
      name_en: "New Tour",
      slug: "new-tour",
      icon: "🎯",
      is_active: true,
    });
  };

  const updateTour = async () => {
    await put("tour/1", { name_en: "Updated Tour" }); // 1-id li tourni update qiladi
  };

  const deleteTour = async () => {
    await del("tour/1"); // 1-id li tourni delete qiladi
  };

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-4">Tour Page</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <pre className="bg-gray-100 p-3 rounded">
        {JSON.stringify(data, null, 2)}
      </pre>

      <div className="mt-4 flex gap-2">
        <button
          onClick={createTour}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Create Tour
        </button>
        <button
          onClick={updateTour}
          className="px-3 py-1 bg-yellow-500 text-white rounded"
        >
          Update Tour
        </button>
        <button
          onClick={deleteTour}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Delete Tour
        </button>
      </div>
    </div>
  );
};

export default TourPage;
