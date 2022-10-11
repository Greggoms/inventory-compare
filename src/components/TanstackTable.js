import React, { useMemo, useState } from "react";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

function ReactTableV8(props) {
  const [sorting, setSorting] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});

  const data = useMemo(
    () =>
      props.itemData.map((item, index) => {
        return {
          index: index + 1,
          id: item.systemSku,
          description: item.description,
          toQty: props.toShopData.find((info) => info.itemID === item.itemID)
            .qoh,
          fromQty: props.fromShopData.find(
            (info) => info.itemID === item.itemID
          ).qoh,
        };
      }),
    // eslint-disable-next-line
    [props.itemData]
  );
  const columns = useMemo(
    () => [
      {
        header: `# / ${props.itemData.length}`,
        accessorKey: "index",
      },
      {
        header: "System ID",
        accessorKey: "id",
      },
      {
        header: "Description",
        accessorKey: "description",
      },
      {
        header: "You Have",
        accessorKey: "toQty",
      },
      {
        header: `They Have`,
        accessorKey: "fromQty",
      },
    ],
    [props.itemData.length]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <div
                      role="button"
                      tabIndex={0}
                      aria-label="Sort Column"
                      // This doesn't work for some reason, but the aria warning is gone.
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          console.log(
                            `You tried to sort a column using the keyboard!`
                          );
                          header.column.getToggleSortingHandler();
                        }
                      }}
                      {...{
                        className: header.column.getCanSort()
                          ? "cursor-pointer select-none"
                          : "",
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted()] ?? null}
                    </div>
                  )}
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => {
          return (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => {
                return (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default ReactTableV8;
