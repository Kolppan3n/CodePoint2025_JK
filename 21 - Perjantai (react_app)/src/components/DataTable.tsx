type TableProps = {
  header: string;
  data: object[];
  deleteRow: (id: number) => void;
  className?: string;
};

const DataTable = ({ header, data, deleteRow, className }: TableProps) => {
  return (
    <div className={className}>
      <div
        id="table-wrapper"
        className="flex flex-col bg-foreground rounded-2xl shadow-md overflow-hidden"
      >
        <h2
          id="table-header"
          className="text-center text-2xl p-4 font-medium bg-primary"
        >
          {header.toUpperCase()}
        </h2>
        <table>
          <thead>
            <tr className="bg-tr-dark">
              {Object.keys(data[0]).map((key: string) => {
                return (
                  <th key={key} className="min-w-40 text-left py-2 px-4">
                    {key.toUpperCase()}
                  </th>
                );
              })}
              <th className="text-center py-2 px-4">POISTA</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row: any, id) => (
              <tr
                key={id}
                className={id % 2 === 0 ? "bg-tr-light" : "bg-tr-dark"}
              >
                {Object.keys(row).map((key: string) => (
                  <td
                    key={`${row.id}-${key}`}
                    className="min-w-40 text-left py-2 px-4"
                  >
                    {row[key]}
                  </td>
                ))}
                <td className="text-center min-w-40 py-2 px-4">
                  <button
                    value={row.id}
                    className="text-error text-xl inline-block w-auto font-bold cursor-pointer"
                    onClick={() => deleteRow(row.id)}
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
