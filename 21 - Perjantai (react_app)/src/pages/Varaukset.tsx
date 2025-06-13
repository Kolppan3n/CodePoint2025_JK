import CustomButton from "../components/CustomButton";
import DataTable from "../components/DataTable";
import DialogForm from "../components/DialogForm";
import { useState, useEffect } from "react";
import type { resJson } from "../utils/Types";

const Varaukset = () => {
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = "http://localhost:8000/api";
  const resource = "Varaukset";

  useEffect(() => {
    fetchData();
    fetchRooms();
    fetchUsers();
  }, []);

  const fetchRooms = async () => {
    const url = `${baseUrl}/tilat`;
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
        setRooms(resJson.result)
      } else {
        throw new Error("The Database was empty");
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const fetchUsers = async () => {
    const url = `${baseUrl}/varaajat`;
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
        setUsers(resJson.result)
      } else {
        throw new Error("The Database was empty");
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const fetchData = async () => {
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
        setLoading(false);
      } else {
        throw new Error("The Database was empty");
      }
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  const deleteRow = async (id: number) => {
    const token = localStorage.getItem("authToken");
    const url = `${baseUrl}/${resource.toLocaleLowerCase()}/${id}`;
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
      fetchData();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const createRow = async (postData: object) => {
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
      fetchData();
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : data.length == 0 ? (
        <p>Data was empty</p>
      ) : (
        <DataTable data={data} deleteRow={deleteRow} header={resource} />
      )}
      <div className="flex gap-6">
        <CustomButton type="Return" />
        <DialogForm resource={resource} text="Luo Varaus" createRow={createRow} tilat={rooms} varaajat={users} />
      </div>
    </div>
  );
};

export default Varaukset;
