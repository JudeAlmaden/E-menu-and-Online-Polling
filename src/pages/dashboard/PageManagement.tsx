import { useState, useEffect } from "react";
import type { MenuItem } from "../../components/dashboard/types";
import SetRecommendations from "../../components/dashboard/page/setRecommendation";
import { Star, BarChart3, Users, Eye, ExternalLink, BookOpen, Sparkles, Mail } from "lucide-react";
import { supabase } from "../../lib/client";
import MessagesModal from "../../components/dashboard/page/MessagesModal"; // import your modal

export type Message = {
  id: number;
  message: string;
  from: string | null;
  contact: string | null;
  created_at: string;
};

export default function PageManagement({ menu }: { menu: MenuItem[] }) {
  const [recommendations, setRecommendations] = useState<MenuItem[]>([]);
  const [dishStats, setDishStats] = useState<{ totalDishes: number; activeDishes: number; recommendedDishes: number }>({
    totalDishes: 0,
    activeDishes: 0,
    recommendedDishes: 0,
  });
  const [visitStats, setVisitStats] = useState<{ today: number; week: number; month: number; total: number }>({
    today: 0,
    week: 0,
    month: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showMessages, setShowMessages] = useState(false); // <-- new state
  const [totalUnread, setTotalUnread] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);

  // Fetch dishes summary
  const fetchDishStats = async () => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      const token = sessionData.session?.access_token;
      if (!token) throw new Error("No active session found");

      const res = await fetch(
        "https://bnvlaiftxamrudncnygx.supabase.co/functions/v1/get-dishes-data",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch dish stats: ${text}`);
      }

      const data = await res.json();
      setDishStats({
        totalDishes: data.totalDishes ?? 0,
        activeDishes: data.activeDishes ?? 0,
        recommendedDishes: data.recommendedDishes ?? 0,
      });
    } catch (err) {
      console.error("Failed to fetch dish stats:", err);
    }
  };

  // Fetch visit stats
  const fetchVisitStats = async () => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      const token = sessionData.session?.access_token;
      if (!token) throw new Error("No active session found");

      const res = await fetch(
        "https://bnvlaiftxamrudncnygx.supabase.co/functions/v1/get-visits-data",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch visit stats: ${text}`);
      }

      const data = await res.json();
      setVisitStats({
        today: data.today ?? 0,
        week: data.week ?? 0,
        month: data.month ?? 0,
        total: data.total ?? 0,
      });
    } catch (err) {
      console.error("Failed to fetch visit stats:", err);
    }
  };

  const fetchUnread = async (pageNumber = 1) => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      const token = sessionData.session?.access_token;
      if (!token) throw new Error("No active session found");

      const res = await fetch(
        `https://bnvlaiftxamrudncnygx.supabase.co/functions/v1/get-unread?page=${pageNumber}&perPage=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch unread messages: ${text}`);
      }

      const data = await res.json();
      setTotalUnread(data.totalUnread??0)
      setMessages(data.messages)
    } catch (err) {
      console.error("Failed to fetch unread messages:", err);
    } 
  };

  //Fetching 
  useEffect(() => {
    setLoading(true);
    Promise.all([fetchDishStats(), fetchUnread(), fetchVisitStats()]).finally(() => setLoading(false));
  }, []);

  const handleSaveRecommendations = (selected: MenuItem[]) => {
    setRecommendations(selected);
    setShowRecommendations(false);
  };

  const handleMessagePageChange=(page:number)=>{
    fetchUnread(page)
  }


  // Quick action buttons
  const actionButtons = [
    { id: 1, title: "Set Recommendations", description: "Highlight your best dishes", icon: Star, color: "from-rose-600 to-pink-600", hoverColor: "group-hover:from-rose-700 group-hover:to-pink-700", onClick: () => setShowRecommendations(true) },
    { id: 2, title: "View Messages", description: "Check unread messages", icon: Mail, color: "from-blue-600 to-cyan-600", hoverColor: "group-hover:from-blue-700 group-hover:to-cyan-700", onClick: () => setShowMessages(true) }, // <-- new button
    { id: 3, title: "See Landing Page", description: "View public landing page", icon: ExternalLink, color: "from-orange-600 to-amber-600", hoverColor: "group-hover:from-orange-700 group-hover:to-amber-700", href: "/" },
    { id: 4, title: "Check E-Menu", description: "View the live digital menu", icon: BookOpen, color: "from-red-600 to-rose-600", hoverColor: "group-hover:from-red-700 group-hover:to-rose-700", href: "/Menu" },
  ];

  const statsCards = [
    {
      id: 1,
      title: "Dishes Overview",
      details: [
        { label: "Total", value: dishStats.totalDishes },
        { label: "Active", value: dishStats.activeDishes },
        { label: "Recommended", value: dishStats.recommendedDishes },
      ],
      icon: BookOpen,
      color: "from-rose-500 to-pink-500",
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
    },
    {
      id: 2,
      title: "Visits Summary",
      details: [
        { label: "Today", value: visitStats.today },
        { label: "Week", value: visitStats.week },
        { label: "Month", value: visitStats.month },
        { label: "Total", value: visitStats.total },
      ],
      icon: Eye,
      color: "from-orange-500 to-amber-500",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      id: 3,
      title: "Messages",
      details: [
        { label: "Unread", value: totalUnread },
      ],
      icon: Mail,
      color: "from-blue-500 to-cyan-500",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
  ];

  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500 text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-3">Admin Dashboard</h1>
          <p className="text-gray-600 text-lg">Manage your restaurant's digital presence</p>
        </div>

        {/* Revamped Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statsCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="relative overflow-hidden bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-md hover:shadow-xl border border-gray-100 hover:border-rose-200 transition-all duration-300 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Decorative Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500`}
                ></div>

                {/* Header with Icon */}
                <div className="flex justify-between items-center mb-6 relative z-10">
                  <div className={`p-3 rounded-2xl ${card.iconBg}`}>
                    <Icon className={`w-6 h-6 ${card.iconColor}`} />
                  </div>
                  <BarChart3 className="w-5 h-5 text-gray-300 group-hover:text-gray-400 transition" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-800 mb-4 relative z-10">
                  {card.title}
                </h3>

                {/* Stat Values */}
                <div className="space-y-3 relative z-10">
                  {card.details.map((d, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center text-sm text-gray-600"
                    >
                      <span>{d.label}</span>
                      <span
                        className={`text-lg font-bold bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}
                      >
                        {d.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Subtle hover border accent */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-rose-200 transition-all duration-300 pointer-events-none"></div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl"><Sparkles className="w-6 h-6 text-rose-600" /></div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Quick Actions</h2>
              <p className="text-gray-600">Manage your restaurant pages</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {actionButtons.map((btn, index) => {
              const Icon = btn.icon;
              const isLink = !!btn.href;
              const ButtonContent = (
                <>
                  <div className={`absolute inset-0 bg-gradient-to-br ${btn.color} ${btn.hoverColor} transition-all duration-300`}></div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10 p-6 flex flex-col items-center text-center h-full justify-center space-y-4">
                    <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <Icon className="w-10 h-10 text-white drop-shadow-lg" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 drop-shadow-md">{btn.title}</h3>
                      <p className="text-white/90 font-medium text-sm">{btn.description}</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div className="px-4 py-2 bg-white/30 backdrop-blur-sm rounded-xl text-white font-bold text-xs border border-white/40">
                        {isLink ? "VIEW →" : "OPEN →"}
                      </div>
                    </div>
                  </div>
                </>
              );

              const commonClasses = "group relative overflow-hidden rounded-3xl border-4 border-transparent hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer min-h-[280px]";

              return isLink ? (
                <a key={btn.id} href={btn.href} className={commonClasses} style={{ animationDelay: `${index * 100}ms` }}>{ButtonContent}</a>
              ) : (
                <button key={btn.id} onClick={btn.onClick} className={commonClasses} style={{ animationDelay: `${index * 100}ms` }}>{ButtonContent}</button>
              );
            })}
          </div>
        </div>

        {/* Current Recommendations */}
        {recommendations.length > 0 && (
          <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-rose-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl"><Star className="w-6 h-6 text-rose-600" /></div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Active Recommendations</h2>
                <p className="text-gray-600 text-sm">Featured dishes on your menu</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map((dish) => (
                <div key={dish.id} className="group p-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl border-2 border-rose-200 hover:border-rose-300 transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center gap-3">
                    {dish.imageUrl && <img src={dish.imageUrl} alt={dish.name} className="w-16 h-16 object-cover rounded-xl border-2 border-white shadow-sm group-hover:scale-105 transition-transform duration-300" />}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 truncate">{dish.name}</p>
                      <p className="text-sm text-rose-600 font-semibold">Featured</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recommendations Modal */}
      {showRecommendations && (
        <SetRecommendations menu={menu} onSave={handleSaveRecommendations} onClose={() => setShowRecommendations(false)} />
      )}

      {/* Messages Modal */}
      {showMessages && <MessagesModal onClose={() => setShowMessages(false)} pTotalUnread={totalUnread} msgs={messages} onPageChange={handleMessagePageChange}/>}
    </div>
  );
}
