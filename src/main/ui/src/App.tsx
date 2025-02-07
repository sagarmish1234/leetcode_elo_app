import './App.css'
import data from "../data.json" with { type: "json" };
import { columns } from "./components/Columns.tsx"
import { DataTable } from './components/DataTable.tsx';
function App() {


  return (
    <>
      <DataTable columns={columns} data={data} />
    </>
  )
}

export default App
