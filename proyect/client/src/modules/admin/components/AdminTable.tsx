/* eslint-disable @typescript-eslint/no-explicit-any */
type AdminTableProps = {
  list: object[];
  headers?: string[];
};

export default function AdminTable({
  list,
  headers = Object.keys(list[0]),
}: AdminTableProps) {
  if (!list || list.length === 0) {
    return <p className="text-gray-500 py-4">No hay datos para mostrar.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-secondary shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-primary">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                scope="col"
                className="px-6 py-3 text-left text-xs uppercase"
              >
                {header}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-secondary">
          {list.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {headers.map((header) => (
                <td key={header} className="px-6 py-4 text-sm">
                  {(item as any)[header] !== undefined
                    ? header.toLowerCase().includes("contraseña")
                      ? String((item as any)[header]).substring(0, 10) + ".." // Acorta contraseñas
                      : String((item as any)[header])
                    : ""}
                </td>
              ))}
              <td className="px-6 py-4 flex flex-row gap-2 items-center">
                <button>
                  <span className="material-icons">delete</span>
                </button>
                <button>
                  <span className="material-icons">edit_square</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
