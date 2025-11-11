import { useState, useEffect } from "react";
import { PlusCircle, Trophy, Calendar, TrendingUp, BarChart3, Sparkles } from "lucide-react";
import ManageDishModal from "../../components/dashboard/ManageDishModal";
import CreatePollModal from "../../components/dashboard/CreatePollModal";
import ManageActivePollModal from "../../components/dashboard/ManageActivePollModal";
import PollDetailsModal from "../../components/dashboard/PollDetailsModal";
import { supabase } from "../../lib/client";

export type MenuItem = {
  id: number | undefined;
  name: string;
  description: string;
  price: number;
  hasStock: boolean;
  availableDays: string[];
  imageUrl: string;
  alwaysAvailable: boolean;
  votes?: number;
  availabilityRange?: { start: string; end: string } | null;
  
};

export type Poll = {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  candidates: MenuItem[];
  userHasVoted: boolean | null;
  isActive: boolean;
};

export default function PollManagement({ menu, onMenuUpdate  }: { menu: MenuItem[],   onMenuUpdate?: (updatedMenu: MenuItem[]) => void; }) {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [activePoll, setActivePoll] = useState<Poll | null>(null);
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPollDetails, setShowPollDetails] = useState<Poll | null>(null);
  const [showManagePollModal, setShowManagePollModal] = useState(false);

  // Local menu state for edits/deletes
  const [localMenu, setLocalMenu] = useState<MenuItem[]>(menu);

  useEffect(() => {
    setLocalMenu(menu); // sync if prop changes
  }, [menu]);


  const handleCreatePoll = (poll: Poll) => {
    getPolls();
    setActivePoll(poll);
    setShowCreateModal(false);
  };

  const getPolls = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      const token = data.session?.access_token;
      if (!token) throw new Error("No active session found");

      const res = await fetch(
        "https://bnvlaiftxamrudncnygx.supabase.co/functions/v1/get_polls",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch polls: ${res.status} ${text}`);
      }

      const json = await res.json();
      setPolls(json.polls || []);
      const active = (json.polls || []).find((p: Poll) => p.isActive);
      if (active) setActivePoll(active);
    } catch (err: any) {
      console.error("Error fetching polls:", err);
    }
  };

  const addNewDish = (dish: MenuItem) => {
    setLocalMenu((prev) => [...prev, dish]); // add the new dish
    if (onMenuUpdate) {
      onMenuUpdate([...localMenu, dish]); // notify parent
    }
  };


  useEffect(() => {
    getPolls();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-2">
              Poll Management
            </h1>
            <p className="text-gray-600 text-lg">Create and manage customer voting polls</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            disabled={!!activePoll}
            className={`inline-flex items-center gap-2 rounded-2xl px-6 py-4 font-bold text-white shadow-lg transition-all duration-200 ${
              activePoll
                ? "bg-gray-400 cursor-not-allowed opacity-60"
                : "bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 hover:shadow-xl hover:scale-105"
            }`}
          >
            <PlusCircle className="w-6 h-6" />
            Create New Poll
          </button>
        </header>

        {/* Active Poll Card */}
        {activePoll && (
          <div className="bg-gradient-to-br from-rose-600 via-pink-600 to-orange-600 rounded-3xl p-8 shadow-2xl text-white relative overflow-hidden group cursor-pointer hover:shadow-3xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-white/90 text-sm font-semibold uppercase tracking-wide">Currently Active</p>
                  <h2 className="text-3xl font-bold">{activePoll.title}</h2>
                </div>
              </div>

              <p className="text-white/90 text-lg mb-6">{activePoll.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-5 h-5 text-white/80" />
                    <span className="text-white/80 text-sm font-medium">Candidates</span>
                  </div>
                  <p className="text-3xl font-bold">{activePoll.candidates?.length || 0}</p>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-white/80" />
                    <span className="text-white/80 text-sm font-medium">Duration</span>
                  </div>
                  <p className="text-sm font-semibold">{activePoll.startDate} to {activePoll.endDate}</p>
                </div>
              </div>

              <button
                onClick={() => setShowManagePollModal(true)}
                className="w-full sm:w-auto px-8 py-3 bg-white text-rose-600 rounded-xl font-bold hover:bg-white/90 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Manage Poll →
              </button>
            </div>
          </div>
        )}

        {/* Empty State for Active Poll */}
        {!activePoll && (
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-3xl p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-10 h-10 text-rose-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Active Poll</h3>
              <p className="text-gray-600 mb-6">Create a new poll to start gathering customer votes</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold hover:from-rose-700 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <PlusCircle className="w-5 h-5" />
                Create Your First Poll
              </button>
            </div>
          </div>
        )}

        {/* Previous Polls */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl">
              <BarChart3 className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Poll History</h2>
              <p className="text-gray-600">View results from previous polls</p>
            </div>
          </div>

          {polls.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-200">
              <p className="text-gray-500">No previous polls found</p>
            </div>
          ) : (
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {polls.map((poll, index) => {
                const winner =
                  poll.candidates && poll.candidates.length > 0
                    ? poll.candidates.reduce((a, b) => (a.votes ?? 0) > (b.votes ?? 0) ? a : b)
                    : null;

                return (
                  <li
                    key={poll.id}
                    onClick={() => setShowPollDetails(poll)}
                    className="group cursor-pointer rounded-3xl border-2 border-gray-200 p-6 shadow-md hover:shadow-2xl hover:border-rose-300 transition-all duration-300 bg-white hover:bg-gradient-to-br hover:from-white hover:to-rose-50 relative overflow-hidden"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-600/0 to-pink-600/0 group-hover:from-rose-600/5 group-hover:to-pink-600/5 transition-all duration-300 rounded-3xl"></div>
                    <div className="relative z-10 space-y-4">
                      <div>
                        <h3 className="font-bold text-gray-900 text-xl mb-2 group-hover:text-rose-700 transition-colors">{poll.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{poll.description}</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{poll.startDate} – {poll.endDate}</span>
                      </div>
                      {winner && (
                        <div className="pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-2 text-rose-600 font-semibold text-sm">
                            <div className="p-1.5 bg-rose-100 rounded-lg"><Trophy className="w-4 h-4" /></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-500 mb-0.5">Winner</p>
                              <p className="truncate">{winner.name}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      {!winner && poll.candidates && poll.candidates.length > 0 && (
                        <div className="pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <BarChart3 className="w-4 h-4" />
                            <span>{poll.candidates.length} candidates</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>


        {showCreateModal && (
          <CreatePollModal
            menu={localMenu}  // use localMenu
            onClose={() => setShowCreateModal(false)}
            onSave={handleCreatePoll}
            onDishAdded={addNewDish}
          />
        )}

        {showPollDetails && !selectedDish && (
          <PollDetailsModal
            poll={showPollDetails}
            onClose={() => setShowPollDetails(null)}
            onDishClick={(dish) => setSelectedDish(dish)}
            show={!selectedDish}
            onEndPoll={() => {
              setActivePoll(null);
              setShowManagePollModal(false);
              getPolls();
            }}
          />
        )}

        {activePoll && showManagePollModal && (
          <ManageActivePollModal
            poll={activePoll}
            onClose={() => setShowManagePollModal(false)}
            onEndPoll={() => {
              setActivePoll(null);
              setShowManagePollModal(false);
              getPolls();
            }}
          />
        )}
      </div>
    </div>
  );
}
