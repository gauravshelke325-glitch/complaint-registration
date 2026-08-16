"use client";

import React from "react";
import {
  LayoutDashboard,
  FilePlus,
  ClipboardList,
  User,
  LogOut,
  ShieldCheck,
  Headphones,
} from "lucide-react";
import { signOut } from "next-auth/react";

interface SidebarProps {
  activeTab: "new" | "history";
  setActiveTab: (tab: "new" | "history") => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="w-64 bg-[#1e2761] text-white flex flex-col justify-between p-6 shrink-0 min-h-screen border-r border-indigo-900/40">
      {/* Brand Header */}
      <div>
        <div className="flex flex-col items-center text-center pb-8 border-b border-indigo-800/50">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-3 ring-2 ring-indigo-400/30">
            <ShieldCheck className="w-9 h-9 text-indigo-300" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Complaint Portal
          </h1>
          <p className="text-xs text-indigo-200/70 mt-0.5">Your Voice, Our Action</p>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-8 space-y-2">
          <button
            onClick={() => setActiveTab("new")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === "new"
                ? "bg-indigo-600/90 text-white shadow-lg shadow-indigo-600/30 font-semibold"
                : "text-indigo-200/80 hover:bg-indigo-950/40 hover:text-white"
            }`}
          >
            <FilePlus className="w-5 h-5" />
            <span>New Complaint</span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === "history"
                ? "bg-indigo-600/90 text-white shadow-lg shadow-indigo-600/30 font-semibold"
                : "text-indigo-200/80 hover:bg-indigo-950/40 hover:text-white"
            }`}
          >
            <ClipboardList className="w-5 h-5" />
            <span>My Complaints</span>
          </button>

          <div className="pt-4 border-t border-indigo-800/40 my-2"></div>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </nav>
      </div>

      {/* Support Card */}
      <div className="bg-indigo-950/60 border border-indigo-700/30 rounded-2xl p-4 mt-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300">
            <Headphones className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-semibold text-white">Need Help?</h4>
        </div>
        <p className="text-xs text-indigo-200/70 mb-3 leading-relaxed">
          If you face any issues, please contact our support team.
        </p>
        <button
          onClick={() =>
            alert("Support Desk: support@complaintportal.com | HotLine: +1-800-COMPLAINT")
          }
          className="w-full bg-white text-indigo-900 hover:bg-indigo-50 py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          Contact Support
        </button>
      </div>
    </aside>
  );
}
