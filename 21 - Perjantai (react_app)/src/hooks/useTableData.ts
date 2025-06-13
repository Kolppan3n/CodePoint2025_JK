import { useCallback, useEffect, useState } from "react";
import type { resJson } from "../utils/Types";

export const useTableData = (
  resource: "Tilat" | "Varaajat" | "Varaukset",
) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = "http://localhost:8000/api";

  const fetchTable = useCallback(async () => {
    const url = `${baseUrl}/${resource.toLocaleLowerCase()}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "Application/JSON" },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const resJson: resJson = await response.json();

      if (resJson.result.length !== 0) {
        setData(resJson.result);
      } else {
        throw new Error("The Database was empty");
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteRow = async (targetId: number) => {
    const token = localStorage.getItem("authToken");
    const url = `${baseUrl}/${resource.toLocaleLowerCase()}/${targetId}`;
    console.log(url)
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const resJson: resJson = await response.json();
      console.log(resJson);
      fetchTable();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const createRow = async (postData: {}) => {
    const baseUrl = "http://localhost:8000/api";
    const url = `${baseUrl}/${resource.toLocaleLowerCase()}`;
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });
      const resJson: resJson = await response.json();
      console.log(resJson);
      fetchTable();
    } catch (error: any) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchTable();
  }, [fetchTable]);

  return { data, loading, error, createRow, deleteRow };
};

export default useTableData;
