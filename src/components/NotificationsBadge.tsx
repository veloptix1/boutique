"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function NotificationsBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: notifs } = await supabase.from("notifications").select("id");
      const { data: lues } = await supabase
        .from("notifications_lues").select("notification_id").eq("user_id", user.id);

      const luesIds = new Set((lues || []).map(l => l.notification_id));
      const nonLues = (notifs || []).filter(n => !luesIds.has(n.id));
      setCount(nonLues.length);
    })();

    const channel = supabase
      .channel("notifications")
      .on("postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        () => setCount(c => c + 1))
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  if (count === 0) return null;

  return (
    <span className="absolute -top-1.5 -right-1.5 min-w-[1.1rem] h-[1.1rem]
                     px-1 rounded-full bg-terracotta text-white text-[0.6rem]
                     font-bold flex items-center justify-center border-2 border-white">
      {count > 9 ? "9+" : count}
    </span>
  );
}
