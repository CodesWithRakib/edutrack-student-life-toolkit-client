import Navbar from "@/components/layout/Navbar";
import { Outlet } from "react-router";

function PublicLayout() {
  return (
    <div className="min-h-screen ">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default PublicLayout;
