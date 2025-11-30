import { AlignJustify, LogOut, ShoppingBag } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/store/auth-slice";

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    dispatch(logoutUser());
  }

  function handleReturnToShop() {
    navigate("/shop/home");
  }

  return (
    <header className="flex items-center justify-between px-4 lg:px-8 py-4 bg-gradient-to-r from-[#1E0F75] via-[#2b3ca0] to-[#3785D8] text-white shadow-lg">
      <div className="flex items-center gap-4">
        <Button
          onClick={() => setOpen(true)}
          className="lg:hidden sm:inline-flex bg-white/15 hover:bg-white/25 text-white border-none"
        >
          <AlignJustify className="w-5 h-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <div className="hidden lg:block">
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">
            Admin
          </p>
          <h2 className="text-lg font-semibold">Marketplace Control</h2>
        </div>
      </div>
      <div className="flex flex-1 justify-end gap-3 flex-wrap">
        <Button
          onClick={handleReturnToShop}
          variant="outline"
          className="inline-flex gap-2 items-center rounded-full border-white/40 text-white hover:bg-white/15"
        >
          <ShoppingBag className="w-4 h-4" />
          Return to Shop
        </Button>
        <Button
          onClick={handleLogout}
          className="inline-flex gap-2 items-center rounded-full bg-white text-[#1E0F75] hover:bg-white/90"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;
