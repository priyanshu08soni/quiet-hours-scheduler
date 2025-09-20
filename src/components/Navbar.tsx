import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function Navbar() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="text-2xl font-bold text-blue-600">Quiet Hours Scheduler</div>
      <div>
        <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
          <LogOut className="w-4 h-4" /> Logout
        </Button>
      </div>
    </nav>
  );
}
