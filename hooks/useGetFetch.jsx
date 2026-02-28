// hooks/useApi.js
import { useState } from "react";
import axios from "axios";

const BASE_URL = "https://x8ki-letl-twmt.n7.xano.io/api:qNrTfAaz";

export function useApi() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const get = async (endpoint) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE_URL}/${endpoint}`);
      setData(res.data);
    } catch (err) {
      setError(err.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const post = async (endpoint, body) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${BASE_URL}/${endpoint}`, body);
      setData(res.data);
    } catch (err) {
      setError(err.message || "Error posting data");
    } finally {
      setLoading(false);
    }
  };

  const put = async (endpoint, body) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.patch(`${BASE_URL}/${endpoint}`, body);
      setData(res.data);
    } catch (err) {
      setError(err.message || "Error updating data");
    } finally {
      setLoading(false);
    }
  };

  const del = async (endpoint) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.delete(`${BASE_URL}/${endpoint}`);
      setData(res.data);
    } catch (err) {
      setError(err.message || "Error deleting data");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, get, post, put, del };
}
