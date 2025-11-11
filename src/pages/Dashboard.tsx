import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./Layouts/DashboardLayout";
import MenuManagement from "./dashboard/MenuManagement";
import PageManagement from "./dashboard/PageManagement";
import PollManagement from "./dashboard/PollManagement";
import { useEffect, useState } from "react";
import { supabase } from "../lib/client";
import type { MenuItem } from "../components/dashboard/types";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const placeholderImage =
    "https://thvnext.bing.com/th/id/OIP.ZKYGG7ccI7cReRSZOjG2ZgHaE8?w=286&h=191&c=7&r=0&o=7&cb=12&pid=1.7&rm=3";

  // Fetch menu function (can be reused for refresh)
  const fetchMenu = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) return;

      const res = await fetch(
        "https://bnvlaiftxamrudncnygx.supabase.co/functions/v1/dishes",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const json = await res.json();

      const transformedMenu: MenuItem[] = json.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        hasStock: item.hasStock,
        availableDays: item.availableDays || [],
        alwaysAvailable: item.alwaysAvailable || false,
        availabilityRange: item.availabilityRange || null,
        imageUrl: item.image_url || placeholderImage,
      }));

      setMenu(transformedMenu);
    } catch (err) {
      console.error("Failed to fetch menu:", err);
    }
  };

  // Load user and initial menu
  useEffect(() => {
    async function loadUser() {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error("Error getting session:", error);

      if (data?.session?.user) {
        setUser(data.session.user);
        await fetchMenu();
      } else {
        window.location.href = "/login";
      }
    }
    loadUser();
  }, []);

  // Callback to update menu from MenuManagement
  const handleMenuChange = (updatedMenu: MenuItem[]) => {
    console.log(updatedMenu)
    setMenu(updatedMenu);
  };

  console.log(user);
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<div />} />
        <Route path="index" element={<PageManagement menu={menu} />} />
        <Route
          path="menu"
          element={<MenuManagement menu={menu} onMenuChange={handleMenuChange} />}
        />
        <Route
          path="polls"
          element={<PollManagement menu={menu} onMenuUpdate={handleMenuChange}/>}
        />
        <Route path="*" element={<PageManagement menu={menu} />} />
      </Routes>
    </DashboardLayout>
  );
}
