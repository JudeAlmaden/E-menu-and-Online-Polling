import { useEffect } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

const DEVICE_KEY = "device_id";
const LOGGED_KEY = "visit_logged"; // store when a visit was logged

export default function VisitLogger() {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        // Check if we've already logged a visit today
        const logged = localStorage.getItem(LOGGED_KEY);
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        if (logged === today) return; // already logged today

        // Get or generate deviceId
        let deviceId = localStorage.getItem(DEVICE_KEY);
        if (!deviceId) {
          const fp = await FingerprintJS.load();
          const result = await fp.get();
          deviceId = result.visitorId;
          localStorage.setItem(DEVICE_KEY, deviceId);
        }

        // Send visit
        const res = await fetch("https://bnvlaiftxamrudncnygx.supabase.co/functions/v1/bright-action", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deviceId }),
        });


        if (res.ok) {
          console.log("Visit has been logged")
          localStorage.setItem(LOGGED_KEY, today);
        }
      } catch (err) {
        console.error("Failed to track visit:", err);
      }
    };

    trackVisit();
  }, []); // run only once
  return null;
}
