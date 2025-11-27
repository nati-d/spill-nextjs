"use client";

import { useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";

const API_URL = "https://spill-golang.onrender.com"; // ← CHANGE TO YOUR DEPLOYED GO BACKEND

export default function Onboarding() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [picked, setPicked] = useState(false);

  useEffect(() => {
    const initData = WebApp.initData;

    // Step 1: Login + get nickname suggestions
    fetch(`${API_URL}/auth/telegram`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ init_data: initData }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.nickname_suggestions) {
          setSuggestions(data.nickname_suggestions);
        } else {
          // User already has nickname → skip onboarding
          WebApp.close();
        }
        setLoading(false);
      });
  }, []);

  const pickNickname = async (nick: string) => {
    setPicked(true);
    WebApp.HapticFeedback.impactOccurred("heavy");

    await fetch(`${API_URL}/nickname/reserve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Telegram-InitData": WebApp.initData,
      },
      body: JSON.stringify({ nickname: nick }),
    });

    // Success animation
    WebApp.HapticFeedback.notificationOccurred("success");
    setTimeout(() => {
      WebApp.close(); // or redirect to feed later
    }, 800);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
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
            className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl text-lg font-semibold hover:scale-105 transition-all disabled:opacity-50"
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