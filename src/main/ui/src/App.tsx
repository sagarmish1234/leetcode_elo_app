import './App.css'
import {Problem} from "./components/Columns.tsx"
import {DataTable} from './components/DataTable.tsx';
import {useEffect, useState} from "react";
import {ColumnDef} from "@tanstack/react-table";
import {Button} from "@/components/ui/button.tsx";
import {ArrowUpDown} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Input} from "@/components/ui/input.tsx";

function App() {
    const [problems, setProblems] = useState<Problem[]>([])
    const getData = async () => {
        const response = await fetch("http://localhost:8081/api/problems")
        setProblems(await response.json())
    }


    const columns: ColumnDef<Problem>[] = [
        {
            accessorKey: "ID",
            header: "ID",
            size: 50,
        },
        {
            accessorKey: 'Title',
            cell: ({row}) => {
                return <div className="text-left"><strong> <a
                    href={`https://leetcode.com/problems/${row.original.TitleSlug}`}> {row.original.Title} </a></strong>
                </div>
            },
            size: 270,
            header: ({column}) => {
                return (
                    <div className="flex justify-center">
                        <Input
                            placeholder="Title"
                            value={(column.getFilterValue() as string) ?? ''}
                            onChange={(event) =>
                                column.setFilterValue(event.target.value)
                            }

                        />
                    </div>
                )
            },
            filterFn: (row, _id, value: string) => {
                console.log(value)
                return row.original.Title.toLowerCase().indexOf(value.toLowerCase())>=0;
            },
        },
        {
            id: "Rating",
            cell: ({row}) => {
                return <div className="text-center">{Math.round(row.original.Rating).toString()}</div>
            },
            accessorKey: "Rating",
            size: 50,
            header: ({column}) => {
                return (
                    <div className="flex justify-center">
                        <Button
                            variant="ghost"
                            onClick={() => {
                                column.toggleSorting(column.getIsSorted() === "asc")
                            }}
                        >
                            Rating
                            <ArrowUpDown className="ml-2 h-4 w-4"/>
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
            header: ({column}) => {
                return (
                    <div className="flex justify-center">

                        <Select onValueChange={(value) => {
                            column.setFilterValue(value)
                        }}>
                            <SelectTrigger className="w-32">
                                <SelectValue placeholder="Status"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="true">completed</SelectItem>
                                <SelectItem value="false">pending</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )
            },
            cell: ({row}) => (
                <div className="flex justify-center">
                    <Checkbox
                        checked={row.original.status == "COMPLETED"}
                        onCheckedChange={async (value) => {
                            await updateProblemStatus(row.original.ID, row.original.status == "COMPLETED" ? "PENDING" : "COMPLETED")
                            row.toggleSelected(!!value)
                            const temp = problems;
                            temp.forEach(problem => {
                                if (problem.ID == row.original.ID) {
                                    problem.status = row.original.status == "COMPLETED" ? "PENDING" : "COMPLETED"
                                }
                            })
                            setProblems(temp)
                        }}
                        aria-label="Select row"
                    />
                </div>
            ),
            filterFn: (row, _id, value: string) => {
                if (value == "all")
                    return true;
                const isSelected = row.original.status == "COMPLETED";
                const result = value === 'true'
                return result == isSelected;
            },
            size: 50,
            enableSorting: false,
            enableHiding: false,
        },
    ]


    const updateProblemStatus = async (id: number, status: string) => {
        await fetch(`http://localhost:8081/api/problems/${id}/status/${status}`, {
            method: "PUT"
        })
        console.log("Status updated for " + id);
    }

    useEffect(() => {
        getData()
    }, []);


    return (
        <>
            <DataTable columns={columns} data={problems}/>
        </>
    )
}

export default App
