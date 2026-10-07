"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function PushNotificationManager() {
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

    setSupported(true);
    setPermission(Notification.permission);

    // Enregistrer le Service Worker
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => {
        // Vérifier si déjà abonné
        navigator.serviceWorker.ready.then((reg) => {
          reg.pushManager.getSubscription().then((sub) => {
            setSubscribed(!!sub);
          });
        });
      })
      .catch((e) => console.error("SW error:", e));
  }, []);

  const subscribe = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Connectez-vous pour activer les notifications");
        window.location.href = "/auth";
        return;
      }

      // Demander la permission
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== "granted") {
        alert("Permission refusée. Activez les notifications dans les paramètres du navigateur.");
        setLoading(false);
        return;
      }

      // Enregistrer le SW
      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      // S'abonner
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        alert("Erreur : clé VAPID manquante");
        setLoading(false);
        return;
      }

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      const subJSON = sub.toJSON();

      // Sauvegarder dans Supabase
      const { error } = await supabase.from("push_subscriptions").upsert({
        user_id: user.id,
        endpoint: subJSON.endpoint!,
        p256dh: subJSON.keys!.p256dh!,
        auth: subJSON.keys!.auth!,
        user_agent: navigator.userAgent,
        platform: "web",
      }, { onConflict: "endpoint" });

      if (error) {
        alert("Erreur : " + error.message);
        setLoading(false);
        return;
      }

      setSubscribed(true);
      setLoading(false);
    } catch (e: any) {
      console.error(e);
      alert("Erreur : " + e.message);
      setLoading(false);
    }
  };

  const unsubscribe = async () => {
    if (!confirm("Désactiver les notifications ?")) return;
    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await sub.unsubscribe();
        await supabase.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
      }
      setSubscribed(false);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  if (!supported) return null;
  if (permission === "denied") {
    return (
      <div className="bg-terracotta/10 rounded-2xl p-4 border border-terracotta/20">
        <p className="text-xs text-terracotta">
          🔕 Les notifications sont bloquées dans votre navigateur.
          Activez-les dans les paramètres pour les recevoir.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-emerald/5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-2xl bg-gold/15 flex items-center justify-center text-gold">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
        </div>
        <div className="flex-1">
          <div className="font-bold text-emerald-dark text-sm">
            Notifications
          </div>
          <div className="text-xs text-gray-500">
            Soyez informé des nouveaux contenus
          </div>
        </div>
      </div>

      <button
        onClick={subscribed ? unsubscribe : subscribe}
        disabled={loading}
        className={`w-full py-3 rounded-2xl font-semibold text-sm transition
          ${subscribed
            ? "bg-white text-terracotta border-2 border-terracotta/20 hover:bg-terracotta/5"
            : "bg-emerald text-white hover:bg-emerald-dark"}`}>
        {loading ? "..." : subscribed ? "Désactiver les notifications" : "Activer les notifications"}
      </button>

      {subscribed && (
        <p className="text-xs text-emerald text-center mt-3">
          ✅ Notifications activées
        </p>
      )}
    </div>
  );
}
