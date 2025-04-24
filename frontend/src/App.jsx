import { Route, Routes } from "react-router-dom";
import Login from "./Log/Login"
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Register from "./register/Register";
import Home from "./home/Home";
import { VerifyUser } from "./utils/VerifyUser";

function App() {
  

  return (
    <>
    <div className="p-2 w-screen h-screen flex items-center justify-center">
      <Routes>
       
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route element={<VerifyUser/>}>
        <Route path="/" element={<Home/>}></Route>
        </Route>
      </Routes>

      
      <ToastContainer/>

    </div>

        
        
       
       
    </>
  )
}

export default App
