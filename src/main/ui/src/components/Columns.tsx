
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "./ui/checkbox";
import { ArrowUpDown } from "lucide-react"
import { Button } from "./ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type Problem = {
  Rating: number;
  ID: number;
  Title: string;
  TitleZH: string;
  TitleSlug: string;
  ContestSlug: string;
  ProblemIndex: string;
  ContestID_en: string;
  ContestID_zh: string;
}
export const columns: ColumnDef<Problem>[] = [
  {
    accessorKey: "ID",
    header: "ID",
    size: 50,
  },
  {
    accessorKey: 'Title',
    cell: ({ row }) => {
      return <div className="text-left"><strong> <a href={`https://leetcode.com/problems/${row.original.TitleSlug}`}> {row.original.Title} </a></strong></div >
    },
    size: 270,
    header: "Title",
  },
  {
    id: "Rating",
    cell: ({ row }) => {
      return <div className="text-center">{Math.round(row.original.Rating).toString()}</div>
    },
    accessorKey: "Rating",
    size: 50,
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            onClick={() => {
              column.toggleSorting(column.getIsSorted() === "asc")
            }}
          >
            Rating
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    filterFn: (row, _id, value: [string, string]) => {
      const rating = Math.round(row.original.Rating);
      const [start, end] = value;
      if (start != '' && rating < parseInt(start))
        return false;
      if (end != '' && rating > parseInt(end))
        return false;
      return true;
    },

  },
  {
    id: "select",
    header: ({ column }) => {
      return (
        <div className="flex justify-center">

          <Select onValueChange={(value) => {
            column.setFilterValue(value)
          }}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="true">completed</SelectItem>
              <SelectItem value="false">pending</SelectItem>
            </SelectContent>
          </Select>
          {/* <Button */}
          {/*   variant="ghost" */}
          {/*   onClick={() => { */}
          {/*     column.setFilterValue() */}
          {/*   }} */}
          {/* > */}
          {/*   Rating */}
          {/*   <Filter className="ml-2 h-4 w-4" /> */}
          {/* </Button> */}
        </div>
      )
    },
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    filterFn: (row, _id, value: string) => {
      if (value == "all")
        return true;
      const isSelected = row.getIsSelected();
      const result = value === 'true'
      return result == isSelected;
    },
    size: 50,
    enableSorting: false,
    enableHiding: false,
  },
]
