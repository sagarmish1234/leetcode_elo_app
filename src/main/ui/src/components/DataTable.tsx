
"use client"
import React, { useEffect } from "react"

import {
  ColumnDef,
  flexRender,
  ColumnFiltersState,
  SortingState,
  getFilteredRowModel,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "./ui/input"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )


  const table = useReactTable({
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 15
      }
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })
  const [pageIndex, setPagination] = React.useState<string>("1");


  useEffect(() => {
    setPagination((table.getState().pagination.pageIndex + 1).toString())
  }, [table.getState().pagination.pageIndex])

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4 ">
        <div className="flex items-center gap-2">
          <div className="flex gap-3 items-center">

            <Input onChange={e => {
              setPagination(e.target.value)
              if (e.currentTarget.value != "")
                table.setPageIndex(parseInt(e.currentTarget.value) - 1)
            }} type="text" className="w-20" value={pageIndex} />
            page of
            <Input type="text" className="w-20" value={table.getPageCount()} disabled={true} />

          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
        <div>
          <div className="flex items-center py-4 gap-2">
            <Input
              placeholder="start"
              value={(table.getColumn("Rating")?.getFilterValue() as [string, string])?.[0] ?? ''}
              onChange={(event) =>
                table.getColumn("Rating")?.setFilterValue((old: [string, string]) => [event.target.value, old?.[1]])
              }
              className="max-w-20"
            />
            -
            <Input
              placeholder="end"
              value={(table.getColumn("Rating")?.getFilterValue() as [string, string])?.[1] ?? ''}
              onChange={(event) =>
                table.getColumn("Rating")?.setFilterValue((old: [string, string]) => [old?.[0], event.target.value])
              }
              className="max-w-20"
            />

          </div>
        </div>
      </div>
    </div>
  )
}
