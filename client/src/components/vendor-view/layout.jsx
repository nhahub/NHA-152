import { Outlet } from "react-router-dom";
import VendorSideBar from "./sidebar";
import ShoppingHeader from "../shopping-view/header";
import ShoppingFooter from "../shopping-view/footer";
import { useState } from "react";

function VendorLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Main navbar */}
      <div className="sticky top-0 z-50">
        <ShoppingHeader />
      </div>

      <div className="flex flex-1">
        {/* vendor sidebar */}
        <VendorSideBar open={openSidebar} setOpen={setOpenSidebar} />
        <div className="flex flex-1 flex-col">
          <main className="flex-1 flex-col flex bg-[#EAF2FB] dark:bg-slate-900 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Footer */}
      <ShoppingFooter />
    </div>
  );
}

export default VendorLayout;
