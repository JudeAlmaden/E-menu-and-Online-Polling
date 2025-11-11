import { useState, useEffect } from "react";

export default function Message() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [from, setFrom] = useState("");
  const [contact, setContact] = useState("");
  const [showIntro, setShowIntro] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return alert("Please type a message.");

    const device_id = localStorage.getItem("device_id") || crypto.randomUUID();
    localStorage.setItem("device_id", device_id);

    setLoading(true);
    try {
      const res = await fetch(
        "https://bnvlaiftxamrudncnygx.supabase.co/functions/v1/post-message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message, from, contact, device_id }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to send message.");
      } else {
        alert("Message sent successfully!");
        setMessage("");
        setFrom("");
        setContact("");
        setOpen(false);
      }
    } catch (err: any) {
      console.error(err);
      alert("An error occurred while sending the message.");
    } finally {
      setLoading(false);
    }
  };

  // Auto hide intro text after 10s
  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Floating Button with Intro Text on the left */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 max-w-full">
        {/* Intro Text with fade */}
        <div
          className={`bg-white border border-gray-200 shadow-md rounded-2xl px-4 py-2 max-w-xs text-gray-800 text-sm font-medium flex items-center gap-2 transition-opacity duration-500 ease-in-out
          ${open || !showIntro ? "opacity-0 invisible" : "opacity-100 visible"}`}
        >
          Have any suggestions? Send a message anonymously
        </div>

        {/* Floating Button */}
        <button
          onClick={() => setOpen(!open)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-transform transform hover:scale-110"
          title="Send Message"
        >
          💬
        </button>
      </div>

      {/* Message Form with Fade */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-72 sm:w-80 md:w-96 lg:w-[28rem] bg-white border border-gray-200 rounded-2xl shadow-xl p-6 flex flex-col space-y-3 transition-opacity duration-300 ease-in-out
        ${open ? "opacity-100 visible" : "opacity-0 invisible"}`}
      >
        <h4 className="font-bold text-gray-800 text-lg text-center">
          Send a Message
        </h4>

        {/* Optional "Contact" */}
        <input
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="Optional: Your contact number"
          className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Optional "From" */}
        <input
          type="text"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder="Optional: Sender"
          className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y h-32 sm:h-36 md:h-40"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 text-sm rounded-xl bg-gray-100 hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={loading}
            className={`px-4 py-2 text-sm rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </>
  );
}
