
import "./index.css"
import ExpenseTracker from './Expenses/Admin/ExpenseTracker'
import FinanceTracker from "./Expenses/Admin/FinanceTracker";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from './Expenses/Admin/AdminLogin'
import { AuthProvider } from './Expenses/Routings/Authentic'
import ProtectedRoute from './Expenses/Routings/ProtectedRoute'
import AccessDenied from './Expenses/Routings/AccessDenied'
import FLog from './Expenses/Admin/FLog'
function App() {



  return (
    <>
   <AuthProvider>
<BrowserRouter>
    <Routes>
    <Route path="/" element={<Admin/>}/>  
    <Route path="/F" element={<FLog/>}/>  
  
    <Route path="/expad" element={
      
      <ProtectedRoute>
      
      <ExpenseTracker />
      </ProtectedRoute>
      } />           
    <Route path="/Flog" element={
      
      <ProtectedRoute>
      
      <FinanceTracker />
      </ProtectedRoute>
      } />           


  <Route path = '/access-denied' element={<AccessDenied/>}/>



  </Routes>



  
    </BrowserRouter>

    
   </AuthProvider>
   
   




    </>
  )
}

export default App
