import { createPortal } from "react-dom";
import type { MenuItem, Poll } from "./types";
import { useEffect, useState, useRef } from "react";
import { supabase } from "../../lib/client";
import { XCircle, ChevronRight, Trash2 } from "lucide-react";


export default function PollDetailsModal({
  poll,
  onClose,
  onDishClick,
  show,
  onEndPoll,
}: {
  poll: Poll;
  onClose: () => void;
  onDishClick: (dish: MenuItem) => void;
  show: boolean;
  onEndPoll: (pollId: number) => void;
}) {
  const [pollData, setPollData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const isFetchingRef = useRef(false);
  const [deleting, setDeleting] = useState(false);
  const placeholderImage =
    "https://thvnext.bing.com/th/id/OIP.ZKYGG7ccI7cReRSZOjG2ZgHaE8?w=286&h=191&c=7&r=0&o=7&cb=12&pid=1.7&rm=3";

  const handleDeletePoll = async () => {
    if (!confirm("Are you sure you want to delete this poll? This cannot be undone.")) return;
    setDeleting(true);

    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("No user session found");

      const res = await fetch(
        `https://bnvlaiftxamrudncnygx.supabase.co/functions/v1/edit-poll`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ poll_id: poll.id, action: "delete" }),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to delete poll: ${res.status} ${text}`);
      }

      onEndPoll(poll.id);
      onClose();
    } catch (err: any) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const getPollData = async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);

    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) return;

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

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setPollData(json);
    } catch (err) {
      console.error("Failed to fetch poll data:", err);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    if (show && poll?.id) getPollData();
  }, [show, poll?.id]);

  if (!show) return null;

  const currentPoll = pollData?.poll || poll;
  const candidates = pollData?.candidates || poll.candidates || [];

  const modalContent = (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto z-[9999]">
      <div className="bg-white rounded-3xl w-full max-w-5xl p-8 relative shadow-2xl animate-[slideUp_0.3s_ease-out]">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-3xl z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
              <div className="text-gray-700 text-lg font-semibold">
                Loading poll...
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-start gap-4 pb-6 border-b border-gray-200">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {currentPoll.title}
            </h2>
            <p className="text-gray-600 text-base leading-relaxed mb-3">
              {currentPoll.description}
            </p>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-rose-100 text-rose-700 text-xs font-medium rounded-full">
                {currentPoll.start_date || currentPoll.startDate}
              </span>
              <span className="text-gray-400">→</span>
              <span className="px-3 py-1 bg-rose-100 text-rose-700 text-xs font-medium rounded-full">
                {currentPoll.end_date || currentPoll.endDate}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all"
            title="Close"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Candidate list */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-xl text-gray-900">Candidates</h3>
            <span className="text-sm text-gray-500">
              {candidates.length} {candidates.length === 1 ? 'option' : 'options'}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {candidates.map((c: any, index: number) => {
              const dish = c.dishes || c; // Handle nested dishes object if present
              const votes = c.votes ?? 0;
              const imageUrl = dish.image_url || dish.imageUrl || placeholderImage;
              const name = dish.name || "Unknown Dish";
              const description = dish.description || "";

              return (
                <button
                  key={c.id ?? index} // fallback to index if id is undefined
                  onClick={() => onDishClick(dish)}
                  disabled={loading}
                  className="group w-full text-left border-2 border-gray-200 rounded-2xl p-5 hover:border-rose-300 hover:shadow-lg hover:bg-rose-50/30 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <img
                        src={imageUrl}
                        alt={name}
                        className="w-20 h-20 object-cover rounded-xl border-2 border-gray-200 shadow-sm group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold text-gray-900 text-lg">{name}</span>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </div>

                      {description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{description}</p>
                      )}

                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                          {votes} {votes === 1 ? 'vote' : 'votes'}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-8 pt-6 border-t border-gray-200 gap-2">
          <button
            onClick={handleDeletePoll}
            disabled={deleting}
            className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            {deleting ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}