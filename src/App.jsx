// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DestinationPage from "./pages/destination/DestinationPage";
import FaqPage from "./pages/faq/FaqPage";
import HotelPage from "./pages/hotel/HotelPage";
import MediaPage from "./pages/media/MediaPage";
import PackageHotelPage from "./pages/package-hotel/PackageHotelPage";
import PackageTagPage from "./pages/package-tag/PackageTagPage";
import PackageTourPage from "./pages/package-tour/PackageTourPage";
import PackagesPage from "./pages/packages/PackagesPage";
import TagsPage from "./pages/tags/TagsPage";
import TourPage from "./pages/tour/TourPage";
import TourSchedualePage from "./pages/tour-scheduale/TourSchedualePage";
import TourTagPage from "./pages/tour-tag/TourTagPage";
import Layout from "./components/Layout";
import CategoryPage from "./pages/category/CategoryPage";
import CountryPage from "./pages/country/CountryPage";
  import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {

  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Barcha sahifalar Layout bilan o‘raladi */}
          <Route element={<Layout />}>
            <Route path="/category" element={<CategoryPage />} />
            <Route path="/country" element={<CountryPage />} />

            <Route path="/destination" element={<DestinationPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/hotel" element={<HotelPage />} />
            <Route path="/media" element={<MediaPage />} />
            <Route path="/package-hotel" element={<PackageHotelPage />} />
            <Route path="/package-tag" element={<PackageTagPage />} />
            <Route path="/package-tour" element={<PackageTourPage />} />
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/tags" element={<TagsPage />} />
            <Route path="/tour" element={<TourPage />} />
            <Route path="/tour-schedule" element={<TourSchedualePage />} />
            <Route path="/tour-tag" element={<TourTagPage />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
