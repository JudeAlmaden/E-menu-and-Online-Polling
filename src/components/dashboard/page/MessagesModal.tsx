import { useState, useEffect } from "react";
import { supabase } from "../../../lib/client";
import { ChevronLeft, ChevronRight, Mail, MailOpen, User, Clock, X } from "lucide-react";
import { createPortal } from "react-dom";

export type Message = {
  id: number;
  message: string;
  from: string | null;
  contact: string | null;
  created_at: string;
};

type Props = {
  onClose: () => void;
  pTotalUnread: number;
  msgs: Message[];
  onPageChange: (page: number) => void;
};

export default function MessagesModal({ onClose, msgs, pTotalUnread, onPageChange }: Props) {
  const [messages, setMessages] = useState<Message[]>(msgs);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(false);
  const [markingRead, setMarkingRead] = useState(false);
  const [totalUnread, setTotalUnread] = useState(pTotalUnread);
  const [page, setPage] = useState(1);
  const perPage = 10;

  // --- Utility: Format timestamps ---
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / 36e5;
    if (diffHours < 24) return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    if (diffHours < 48) return "Yesterday";
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };


  // --- Mark message as read ---
  const handleMarkRead = async (id: number) => {
    setMarkingRead(true);
    try {
      const { data: sessionData, error } = await supabase.auth.getSession();
      if (error || !sessionData.session) throw new Error("No session found");

      const token = sessionData.session.access_token;
      const res = await fetch(
        `https://bnvlaiftxamrudncnygx.supabase.co/functions/v1/set-read`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }
      );
      if (!res.ok) throw new Error("Failed to mark read");

      setSelectedMessage(null);
      setLoading(true);
      onPageChange(page);
    } catch (err) {
      console.error("Mark read failed:", err);
    } finally {
      setMarkingRead(false);
    }
  };

  // --- Handle pagination ---
  const changePage = (newPage: number) => {
    setLoading(true)
    setPage(newPage);
    onPageChange(newPage);
  };

  // --- Sync props when parent updates ---
  useEffect(() => {
    setMessages(msgs);
    setTotalUnread(pTotalUnread);
    setLoading(false);
  }, [msgs, pTotalUnread]);

  const totalPages = Math.ceil(totalUnread / perPage);

  // --- Main Modal ---
  const modal = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b bg-gradient-to-r from-rose-50 to-orange-50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-rose-500 to-orange-500 rounded-2xl">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Inbox</h3>
              <p className="text-sm text-gray-600">
                {totalUnread} {totalUnread === 1 ? "unread message" : "unread messages"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Message list */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mb-4" />
              <p className="text-gray-500">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 bg-gradient-to-br from-rose-100 to-orange-100 rounded-full flex items-center justify-center mb-4">
                <MailOpen className="w-10 h-10 text-rose-600" />
              </div>
              <p className="text-xl font-semibold text-gray-900">All caught up!</p>
              <p className="text-gray-500">No unread messages</p>
            </div>
          ) : (
            <div className="space-y-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className="group relative border-2 border-gray-200 hover:border-rose-300 rounded-2xl p-5 cursor-pointer hover:shadow-lg transition"
                >
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-rose-500 rounded-full" />
                  <div className="flex items-start gap-4 ml-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-orange-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-rose-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-4 mb-1">
                        <h4 className="font-bold text-gray-900">{msg.from || "Anonymous"}</h4>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(msg.created_at)}</span>
                        </div>
                      </div>
                      {msg.contact && <p className="text-sm text-gray-500">{msg.contact}</p>}
                      <p className="text-gray-700 line-clamp-2">{msg.message}</p>
                      <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-sm font-semibold text-rose-600">Click to read →</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalUnread > perPage && (
          <div className="flex justify-between items-center px-8 py-4 border-t bg-gray-50">
            <button
              onClick={() => changePage(Math.max(page - 1, 1))}
              disabled={page === 1}
              className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-xl disabled:text-gray-400 hover:border-rose-400"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <span className="font-semibold text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => changePage(Math.min(page + 1, totalPages))}
              disabled={page === totalPages}
              className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-xl disabled:text-gray-400 hover:border-rose-400"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Message Detail */}
      {selectedMessage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
            {/* Header */}
            <div className="px-8 py-6 border-b bg-gradient-to-r from-rose-50 to-orange-50 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-orange-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{selectedMessage.from || "Anonymous"}</h3>
                    {selectedMessage.contact && <p className="text-sm text-gray-600">{selectedMessage.contact}</p>}
                  </div>
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> {new Date(selectedMessage.created_at).toLocaleString()}
                </div>
              </div>
              <button onClick={() => setSelectedMessage(null)} className="p-2 hover:bg-gray-100 rounded-xl">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Body */}
            <div className="px-8 py-6 max-h-[60vh] overflow-y-auto">
              <div className="bg-gray-50 rounded-2xl p-6 border">
                <p className="text-gray-800 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setSelectedMessage(null)}
                className="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => handleMarkRead(selectedMessage.id)}
                disabled={markingRead}
                className="px-6 py-3 bg-gradient-to-r from-rose-600 to-orange-600 text-white rounded-xl font-semibold flex items-center gap-2 disabled:opacity-50"
              >
                {markingRead ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                    Marking...
                  </>
                ) : (
                  <>
                    <MailOpen className="w-5 h-5" /> Mark as Read
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return createPortal(modal, document.body);
}
