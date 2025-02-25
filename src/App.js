import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import IntakeDashboard from "./components/IntakeDashboard";
import AdminDashboard from "./components/AdminDashboard";
import ProductionDashboard from "./components/ProductionDashboard";
import AddIntake from "./components/AddIntake";
import EditIntake from "./components/EditIntake";
import AdminIntake from "./components/AdminIntake";
import EditAdminIntake from "./components/EditAdminIntake";
import AddProduction from "./components/AddProduction";
import DetailProduction from "./components/DetailProduction";
import EditProduction from "./components/EditProduction";
import AdminProductionDashboard from "./components/AdminProduction";
import AdminDetailsProduction from "./components/AdminDetailsProduction";
import EditAdminProduction from "./components/EditAdminProduction";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<><Navbar /><AdminDashboard /></>} />
        <Route path="/admin/intake" element={<><Navbar /><AdminDashboard /><AdminIntake/> </>} />
        <Route path="/admin/intake/edit/:id" element ={<><EditAdminIntake/> </>} />
        <Route path="/admin/production" element={<><Navbar /> <AdminDashboard /> <AdminProductionDashboard /></>} />
        <Route path="/admin/production/details/:id" element={<><AdminDetailsProduction /></>} />
        <Route path="/admin/production/edit/:id" element={<> <EditAdminProduction /></>} />
        <Route path="/intake" element={<><Navbar /><IntakeDashboard /></>} />
        <Route path="/intake/add" element={<> <AddIntake /></>} />
        <Route path="/intake/edit/:id" element={<> <EditIntake /></>} />
        <Route path="/production" element={<><Navbar /> <ProductionDashboard /></>} />
        <Route path="/production/add" element={<><AddProduction/></>} />
        <Route path="/production/edit/:id" element={<> <EditProduction /></>} />
        <Route path="/production/details/:id" element={<> <DetailProduction /></>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
