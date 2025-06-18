import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../utils/AuthProvider";

export const useTableData = (resource: "Tilat" | "Varaajat" | "Varaukset") => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { accessToken } = useAuth();

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

      const resJson = await response.json();

      if (resJson.length !== 0) {
        setData(resJson);
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
    const url = `${baseUrl}/${resource.toLocaleLowerCase()}/${targetId}/`;
    console.log(url);
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("response", {
        message: `${resource} with id: ${targetId} was deleted successfully`,
      });
      fetchTable();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const createRow = async (postData: {}) => {
    const url = `${baseUrl}/${resource.toLocaleLowerCase()}/`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(postData),
      });
      const resJson = await response.json();
      console.log("resJson", resJson);
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
