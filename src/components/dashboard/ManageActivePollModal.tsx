import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import type { Poll, MenuItem } from "./types";
import { supabase } from "../../lib/client";
import { Trophy, XCircle } from "lucide-react";

export default function ManageActivePollModal({
  poll,
  onClose,
  onEndPoll,
}: {
  poll: Poll;
  onClose: () => void;
  onEndPoll: (pollId: number) => void;
}) {
  const [pollData, setPollData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [ending, setEnding] = useState(false);
  // const [deleting, setDeleting] = useState(false);
  const isFetchingRef = useRef(false);
  const placeholderImage =
    "https://thvnext.bing.com/th/id/OIP.ZKYGG7ccI7cReRSZOjG2ZgHaE8?w=286&h=191&c=7&r=0&o=7&cb=12&pid=1.7&rm=3";

  // Fetch poll data
  const refreshPoll = async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);

    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      const res = await fetch(
        `https://bnvlaiftxamrudncnygx.supabase.co/functions/v1/get_poll?id=${poll.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error(`Failed to fetch poll: ${res.status}`);
      const json = await res.json();
      setPollData(json);
      setErrorMsg(null);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  // End poll
  const handleEndPoll = async () => {
    if (!confirm("Are you sure you want to end this poll?")) return;
    setEnding(true);

    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      const res = await fetch(
        `https://bnvlaiftxamrudncnygx.supabase.co/functions/v1/edit-poll`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ poll_id: poll.id, action: "end" }),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to end poll: ${res.status} ${text}`);
      }

      onEndPoll(poll.id);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message);
    } finally {
      setEnding(false);
    }
  };

  // Delete poll
  // const handleDeletePoll = async () => {
  //   if (!confirm("Are you sure you want to delete this poll? This cannot be undone.")) return;
  //   setDeleting(true);

  //   try {
  //     const { data } = await supabase.auth.getSession();
  //     const token = data.session?.access_token;

  //     const res = await fetch(
  //       `https://bnvlaiftxamrudncnygx.supabase.co/functions/v1/edit-poll`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({ poll_id: poll.id, action: "delete" }),
  //       }
  //     );

  //     if (!res.ok) {
  //       const text = await res.text();
  //       throw new Error(`Failed to delete poll: ${res.status} ${text}`);
  //     }

  //     onEndPoll(poll.id);
  //     onClose();
  //   } catch (err: any) {
  //     console.error(err);
  //     setErrorMsg(err.message);
  //   } finally {
  //     setDeleting(false);
  //   }
  // };

  useEffect(() => {
    refreshPoll();
  }, [poll.id]);

  if (!pollData) return null;

  const currentPoll = pollData.poll || poll;
  const candidates: MenuItem[] = currentPoll.candidates || [];
  const getVoteCount = (c: any) => c.votes ?? 0;

  const totalVotes = candidates.reduce((sum, c) => sum + getVoteCount(c), 0);

  const winner = candidates.length > 0
    ? candidates.reduce((a, b) => (getVoteCount(a) > getVoteCount(b) ? a : b))
    : null;

    const modalContent = (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] overflow-y-auto">
        <div className="relative bg-white rounded-3xl w-full max-w-5xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl animate-[slideUp_0.3s_ease-out] max-h-[95vh] overflow-y-auto">
          
          {/* Close button fixed to top-right inside modal */}
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all z-20"
            title="Close"
          >
            <XCircle className="w-6 h-6" />
          </button>
    
          {(loading || ending) && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-3xl z-10">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
                <div className="text-gray-700 text-lg font-semibold">
                  {loading ? "Loading poll..." : ending ? "Ending poll..." : "Deleting poll..."}
                </div>
              </div>
            </div>
          )}
    
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-gray-200">
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{currentPoll.name}</h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{currentPoll.description}</p>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="px-3 py-1 bg-rose-100 text-rose-700 text-xs font-medium rounded-full">
                  {currentPoll.startDate}
                </span>
                <span className="text-gray-400">→</span>
                <span className="px-3 py-1 bg-rose-100 text-rose-700 text-xs font-medium rounded-full">
                  {currentPoll.endDate}
                </span>
              </div>
            </div>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600 font-medium">{errorMsg}</p>
          </div>
        )}

        {/* Candidates */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {candidates.map((c:any, index) => {
            const dish = c.dishes; // Access nested dishes object
            const votes = getVoteCount(c);
            const percent = totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(1) : "0.0";
            const isWinner = winner && winner.id === c.id;

            return (
              <div 
                key={c.id} 
                className={`group p-5 border-2 rounded-2xl transition-all duration-300 hover:shadow-lg ${
                  isWinner 
                    ? "bg-gradient-to-br from-rose-50 to-pink-50 border-rose-300 shadow-md" 
                    : "bg-white border-gray-200 hover:border-rose-200"
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <img 
                      src={dish.image_url || placeholderImage} 
                      alt={dish.name} 
                      className="w-20 h-20 object-cover rounded-xl border-2 border-gray-200 shadow-sm group-hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-bold text-gray-900 text-lg">{dish.name}</p>
                      {isWinner && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-rose-600 text-white text-xs font-semibold rounded-full">
                          <Trophy className="w-3 h-3" />
                          <span>Winner</span>
                        </div>
                      )}
                    </div>

                    {dish.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{dish.description}</p>
                    )}

                    <div className="relative w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden shadow-inner">
                      <div 
                        className={`h-3 rounded-full transition-all duration-700 ease-out ${
                          isWinner ? "bg-gradient-to-r from-rose-500 to-pink-500" : "bg-gradient-to-r from-rose-400 to-rose-500"
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">
                        {votes} {votes === 1 ? 'vote' : 'votes'}
                      </span>
                      <span className={`text-sm font-bold ${isWinner ? 'text-rose-600' : 'text-gray-600'}`}>
                        {percent}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm">Total votes:</span>
            <span className="px-3 py-1 bg-rose-100 text-rose-700 text-base font-bold rounded-full">
              {totalVotes}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={handleEndPoll}
              disabled={ending}
              className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              {ending ? "Ending..." : "End Poll"}
            </button>

            {/* <button
              onClick={handleDeletePoll}
              disabled={deleting}
              className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              {deleting ? "Cancelling..." : "Cancel Poll"}
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
