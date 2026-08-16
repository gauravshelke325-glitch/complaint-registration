"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Tag,
  Calendar,
  Inbox,
} from "lucide-react";

interface ComplaintItem {
  _id: string;
  category: string;
  subject: string;
  description: string;
  status: "Pending" | "In Progress" | "Resolved";
  createdAt: string;
}

export default function ComplaintList() {
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/complaint");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to load complaints.");
      }
      setComplaints(data.complaints || []);
    } catch (err: any) {
      setError(err.message || "Could not load history.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Resolved":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Resolved
          </span>
        );
      case "In Progress":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
            <AlertCircle className="w-3.5 h-3.5 text-indigo-600" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-800">
            My Submitted Complaints
          </h3>
          <p className="text-xs text-slate-500">
            Track real-time resolution updates for your filed grievances.
          </p>
        </div>
        <button
          onClick={fetchComplaints}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-xl transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-500" />
          <p className="text-sm font-medium">Fetching complaint history...</p>
        </div>
      ) : error ? (
        <div className="py-8 text-center text-rose-600 bg-rose-50 rounded-xl border border-rose-200 p-4 text-xs font-medium">
          {error}
        </div>
      ) : complaints.length === 0 ? (
        <div className="py-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
          <Inbox className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-semibold text-slate-600">No complaints registered yet</p>
          <p className="text-xs text-slate-400 mt-1">
            Submit a new complaint using the form to start tracking.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {complaints.map((item) => (
            <div
              key={item._id}
              className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-200 transition-all shadow-2xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-200 text-slate-700">
                    <Tag className="w-3 h-3" />
                    {item.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {getStatusBadge(item.status)}
              </div>

              <h4 className="text-base font-bold text-slate-800 mb-1">
                {item.subject}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
