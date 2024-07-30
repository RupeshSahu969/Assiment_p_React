import logo from "./logo.svg";
import "./App.css";
import AddForm from "./Component/AddForm";
import { Route, Routes } from "react-router-dom";
import GetData from "./Component/GetData";
import EditForm from "./Component/EditForm";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<AddForm/>}/>
        <Route path="/getdata" element={<GetData/>}/>
        <Route path="/edit/:id" element={<EditForm/>}/>
      </Routes>
    </div>
  );
}

export default App;
