"use client";

import React from "react";

export interface SessionUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface HeaderProps {
  user?: SessionUser;
}

export default function Header({ user }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200/80 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-xs">
      <div>
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          Welcome, {user?.name || "User"} <span className="animate-bounce">👋</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Register a new complaint. We&apos;re here to help!
        </p>
      </div>

      <div className="flex items-center gap-3 bg-slate-50 p-2 pr-4 rounded-full border border-slate-200/60">
        {user?.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.image}
            alt={user.name || "User Profile"}
            className="w-10 h-10 rounded-full border-2 border-indigo-500 shadow-xs"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
        )}
        <div className="text-left hidden sm:block">
          <p className="text-sm font-semibold text-slate-800 leading-tight">
            {user?.name || "User"}
          </p>
          <p className="text-xs text-slate-500">{user?.email}</p>
        </div>
      </div>
    </header>
  );
}
