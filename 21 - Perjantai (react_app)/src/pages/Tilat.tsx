import CustomButton from "../components/CustomButton";
import DataTable from "../components/DataTable";
import DialogForm from "../components/DialogForm";
import useTableData from "../hooks/useTableData";

const Tilat = () => {
  
  const resource = "Tilat";
  const { data, error, loading, deleteRow, createRow } = useTableData(resource);

  return (
    <div className="flex flex-col items-center gap-6">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <DataTable header={resource} data={data} deleteRow={deleteRow} />
      )}
      <div className="flex gap-6">
        <CustomButton type="Return" />
        <DialogForm text="Uusi Tila" resource={resource} createRow={createRow}/>
      </div>
    </div>
  );
};

export default Tilat;
