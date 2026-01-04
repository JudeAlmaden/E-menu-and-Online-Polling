import { useState, useEffect } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

export default function ActivePoll() {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [choice, setChoice] = useState<number | null>(null);
  const [voteCounts, setVoteCounts] = useState<Record<number, number>>({});
  const [deviceId, setDeviceId] = useState<string>("");

  type Candidate = {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    votes: number;
  };

  type Poll = {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    candidates: Candidate[];
    userVoteId?: number | null;
  };

  const placeholderImage =
    "https://thvnext.bing.com/th/id/OIP.ZKYGG7ccI7cReRSZOjG2ZgHaE8?w=286&h=191&c=7&r=0&o=7&cb=12&pid=1.7&rm=3";

  useEffect(() => {
    // Initialize FingerprintJS
    const initFingerprint = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      setDeviceId(result.visitorId);

      fetchPoll(result.visitorId);
    };

    initFingerprint();

    const fetchPoll = async (deviceId: string) => {
      try {
        const res = await fetch(
          `https://bnvlaiftxamrudncnygx.supabase.co/functions/v1/get-active-poll?device_id=${deviceId}`
        );
        const raw = await res.json();

        if (!raw.poll) {
          setPoll(null); // No active poll
          return;
        }

        const normalizedPoll: Poll = {
          id: Number(raw.poll?.id ?? 0),
          name: raw.poll?.title ?? raw.poll?.name ?? "Unnamed Poll",
          description: raw.poll?.description ?? "",
          startDate: raw.poll?.start_date ?? "",
          endDate: raw.poll?.end_date ?? "",
          userVoteId: raw.userVote?.dish_id ? Number(raw.userVote.dish_id) : null,
          candidates:
            raw.candidates?.map((c: any) => ({
              id: Number(c.dishes?.id ?? c.id ?? 0),
              name: c.dishes?.name ?? "Unnamed Dish",
              price: c.dishes?.price ?? 0,
              imageUrl: c.dishes?.image_url ?? placeholderImage,
              votes: c.votes ?? 0,
            })) ?? [],
        };

        const voteMap: Record<number, number> = {};
        normalizedPoll.candidates.forEach((c) => {
          voteMap[c.id] = c.votes ?? 0;
        });

        console.log(raw)
        setPoll(normalizedPoll);
        setVoteCounts(voteMap);

        if (normalizedPoll.userVoteId) setChoice(normalizedPoll.userVoteId);
      } catch (err) {
        console.error("Failed to fetch poll:", err);
        setPoll(null);
      }
    };
  }, []);

  if (!poll || poll.candidates.length === 0) return null;

  const totalVotes = Object.values(voteCounts).reduce((a, b) => a + b, 0);
  const hasVoted = poll.userVoteId !== null && poll.userVoteId !== undefined;
  const isSameAsPrevious = hasVoted && choice === poll.userVoteId;
  const buttonLabel = isSameAsPrevious
    ? "Vote"
    : hasVoted
      ? "Change Vote"
      : "Submit Vote";

  const submitVote = async () => {
    if (choice === null) return alert("Please select a dish first!");
    if (!deviceId) return alert("Device ID not ready, please reload.");
    if (!poll) return;


    console.log(poll.id + " " + deviceId + " " + choice)

    try {
      const res = await fetch(
        "https://bnvlaiftxamrudncnygx.supabase.co/functions/v1/add-vote",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            poll_id: poll.id,
            dish_id: Number(choice),
            device_id: deviceId,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to submit vote");


      setPoll((prev) => prev && { ...prev, userVoteId: choice });
      setVoteCounts((prev) => {
        const updated = { ...prev };
        if (poll.userVoteId && poll.userVoteId !== choice) {
          updated[poll.userVoteId] = (updated[poll.userVoteId] ?? 1) - 1;
        }
        updated[choice] = (updated[choice] ?? 0) + 1;
        return updated;
      });

      alert("Vote submitted!");
    } catch (err) {
      console.error(err);
      alert("Error submitting vote");
    }
  };

  return (
    <div id="vote" className="mx-auto max-w-6xl px-4 py-10">
      <h2 className="mb-6 text-center text-3xl font-bold text-gray-900">
        {poll.name}
      </h2>
      <p className="mb-4 text-center text-gray-600">{poll.description}</p>

      <div className="mx-auto flex flex-wrap justify-center gap-6">
        {poll.candidates.map((c) => {
          const percent = totalVotes
            ? Math.round(((voteCounts[c.id] ?? 0) / totalVotes) * 100)
            : 0;
          const isUserVote = poll.userVoteId === c.id;

          return (
            <div
              key={c.id}
              className={`w-80 bg-white flex flex-col overflow-hidden rounded-2xl border shadow-md transition hover:shadow-lg ${choice === c.id ? "ring-2 ring-rose-500" : ""
                }`}
            >
              <img
                src={c.imageUrl || placeholderImage}
                alt={c.name}
                className="h-56 w-full object-cover"
              />

              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{c.name}</h3>
                  <span className="mt-2 inline-block rounded-full bg-rose-50 px-3 py-1 text-sm font-medium text-rose-600">
                    ₱{c.price.toFixed(2)}
                  </span>

                  <div className="mt-4">
                    <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-rose-500 to-orange-400 transition-[width] duration-700"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      {(voteCounts[c.id] ?? 0)} votes • {percent}%
                    </div>
                  </div>
                </div>

                <label className="mt-4 flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="menu"
                    value={c.id}
                    checked={choice === c.id}
                    onChange={(e) => setChoice(Number(e.target.value))}
                    className="h-4 w-4 accent-rose-600"
                  />
                  {isUserVote
                    ? "Your current vote"
                    : choice === c.id
                      ? "Selected"
                      : "Choose this menu"}
                </label>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-14 text-center">
        <button
          onClick={submitVote}
          disabled={isSameAsPrevious}
          className={`rounded-xl px-6 py-3 font-semibold shadow-md transition ${isSameAsPrevious
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-rose-500 to-orange-400 text-white hover:opacity-90"
            }`}
        >
          {buttonLabel}
        </button>

        {isSameAsPrevious && (
          <p className="mt-2 text-sm text-gray-500">
            You’ve already voted for this candidate.
          </p>
        )}
      </div>
    </div>
  );
}
