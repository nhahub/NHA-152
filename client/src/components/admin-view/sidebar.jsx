import {
  LayoutDashboard,
  ShoppingBasket,
  Store,
  Heart,
} from "lucide-react";
import { Fragment } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket className="w-5 h-5" />,
  },
  {
    id: "vendors",
    label: "Vendors",
    path: "/admin/vendors",
    icon: <Store className="w-5 h-5" />,
  },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="mt-10 flex flex-col gap-2">
      {adminSidebarMenuItems.map((menuItem) => {
        const isActive = location.pathname.startsWith(menuItem.path);
        return (
          <button
            key={menuItem.id}
            onClick={() => {
              navigate(menuItem.path);
              setOpen ? setOpen(false) : null;
            }}
            className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              isActive
                ? "bg-white text-[#1E0F75] shadow-md"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            <span
              className={`inline-flex rounded-lg p-2 ${
                isActive ? "bg-[#1E0F75]/10 text-[#1E0F75]" : "bg-white/10 text-white"
              }`}
            >
              {menuItem.icon}
            </span>
            <span>{menuItem.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function GradientAside({ children }) {
  return (
    <aside className="hidden w-72 flex-col bg-gradient-to-br from-[#1E0F75] via-[#2f3fbd] to-[#3785D8] text-white p-6 lg:flex relative overflow-hidden shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E0F75]/95 via-[#2f3fbd]/95 to-[#3785D8]/95"></div>
      <div className="relative z-10 flex flex-col h-full">
        {children}
      </div>
    </aside>
  );
}

function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="w-72 border-none bg-gradient-to-br from-[#1E0F75] via-[#2f3fbd] to-[#3785D8] text-white"
        >
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b border-white/20 pb-4 mb-4">
              <SheetTitle className="flex gap-3 items-center">
                <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center shadow-lg">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/70">
                    Admin
                  </p>
                  <h1 className="text-xl font-bold">Dashboard</h1>
                </div>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>
      <GradientAside>
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex cursor-pointer items-center gap-3 mb-6 pb-4 border-b border-white/20"
        >
          <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center shadow-lg">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-white/70">
              Admin
            </p>
            <h1 className="text-lg font-bold">Dashboard</h1>
          </div>
        </div>
        <MenuItems />
      </GradientAside>
    </Fragment>
  );
}

export default AdminSideBar;
