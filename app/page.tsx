"use client";

import { useEffect, useState } from "react";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

export default function Onboarding() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [picked, setPicked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    import("@twa-dev/sdk")
      .then(({ default: WebApp }) => {
        // Ensure WebApp is ready
        WebApp.ready();

        // Expand main button and enable closing
        WebApp.expand();

        const tgUser = WebApp.initDataUnsafe.user;
        
        if (!tgUser) {
          console.error("No user data available. Are you opening this in Telegram?");
          setLoading(false);
          return;
        }

        setUser(tgUser as TelegramUser);

        // Generate fun nickname suggestions based on user's name/username
        const base = tgUser.username
          ? tgUser.username.replace(/^@/, "")
          : tgUser.first_name.toLowerCase().replace(/\s+/g, "");

        const prefixes = ["ghost", "shadow", "ninja", "phantom", "mystery", "void", "echo", "cipher", "nova", "zen"];
        const suffixes = ["spill", "whisper", "confess", "soul", "vibe", "wave", "drift", "hush", "fox", "raven"];

        const generated = [
          base + Math.floor(Math.random() * 999),
          prefixes[Math.floor(Math.random() * prefixes.length)] + base,
          base + suffixes[Math.floor(Math.random() * suffixes.length)],
          "anonymous" + tgUser.id.toString().slice(-4),
          tgUser.first_name + "TheSilent",
          "Secret" + (tgUser.last_name || tgUser.first_name),
        ];

        // Dedupe and shuffle
        const unique = Array.from(new Set(generated)).slice(0, 5);
        setSuggestions(unique);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading WebApp SDK:", error);
        setLoading(false);
      });
  }, []);

  const pickNickname = async (nick: string) => {
    if (typeof window === "undefined") return;

    const { default: WebApp } = await import("@twa-dev/sdk");
    setPicked(true);
    WebApp.HapticFeedback.impactOccurred("heavy");

    // Simulate success (you could save to localStorage if needed)
    setTimeout(() => {
      WebApp.HapticFeedback.notificationOccurred("success");
      alert(`Welcome, ${nick}! 🎭\n(You can now close this or redirect)`);

      // Optional: save choice locally
      localStorage.setItem("spill_nickname", nick);
      localStorage.setItem("spill_user", JSON.stringify(user));

      // Close after delay
      setTimeout(() => WebApp.close(), 1000);
    }, 600);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center text-gray-400">
        <p>This app only works inside Telegram</p>
        <p className="mt-4">Open it from your Telegram bot or mini app</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gray-900 text-white">
      {/* User Avatar + Name */}
      <div className="mb-8 text-center">
        {user.photo_url ? (
          <img
            src={user.photo_url}
            alt={user.first_name}
            className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-purple-600"
          />
        ) : (
          <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-3xl font-bold">
            {user.first_name[0].toUpperCase()}
          </div>
        )}
        <h2 className="text-2xl font-bold">
          Hey, {user.first_name} {user.last_name || ""}!
        </h2>
        {user.username && <p className="text-gray-400">@{user.username}</p>}
      </div>

      <h1 className="text-5xl font-bold mb-4 animate-fade-in">Spill</h1>
      <p className="text-gray-400 text-center mb-12 max-w-xs">
        Real confessions. Zero judgment. Pure anonymity.
      </p>

      <div className="w-full max-w-sm space-y-4">
        <p className="text-center text-xl mb-6">Choose your secret identity</p>
        {suggestions.map((nick) => (
          <button
            key={nick}
            onClick={() => pickNickname(nick)}
            disabled={picked}
            className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl text-lg font-semibold hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {nick}
          </button>
        ))}
      </div>

      <p className="text-gray-600 text-xs mt-12">
        This cannot be changed later
      </p>
    </div>
  );
}