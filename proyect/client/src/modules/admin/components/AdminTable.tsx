/* eslint-disable @typescript-eslint/no-explicit-any */
type AdminTableProps = {
  list: object[];
  headers?: string[];
  onClick: (id: string) => Promise<void>;
};

export default function AdminTable({
  list,
  headers = Object.keys(list[0]),
  onClick,
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
          {list.map((item, index) => {
            const firstKey = Object.keys(item)[0];
            const id = (item as any)[firstKey];

            return (
              <tr key={index} className="hover:bg-gray-50">
                {headers.map((header) => (
                  <td key={header} className="px-6 py-4 text-sm">
                    {(item as any)[header] !== undefined
                      ? String((item as any)[header])
                      : ""}
                  </td>
                ))}
                <td className="px-6 py-4">
                  <button onClick={() => onClick(String(id))}>
                    <span className="material-icons">edit_square</span>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
