"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  complaintSchema,
  ComplaintFormData,
  CATEGORIES,
} from "@/lib/validations/complaint";
import {
  Lock,
  User as UserIcon,
  Mail,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Clock,
  TrendingUp,
  ChevronDown,
} from "lucide-react";
import { SessionUser } from "./Header";

interface ComplaintFormProps {
  user: SessionUser;
  onComplaintSubmitted?: () => void;
}

export default function ComplaintForm({
  user,
  onComplaintSubmitted,
}: ComplaintFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
    notifications?: { email: string; whatsapp: string };
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ComplaintFormData>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      userName: user.name || "",
      userEmail: user.email || "",
      category: "Infrastructure",
      subject: "",
      description: "",
    },
  });

  const onSubmit = async (data: ComplaintFormData) => {
    setIsSubmitting(true);
    setToast(null);

    try {
      const response = await fetch("/api/complaint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || "Failed to submit complaint.");
      }

      setToast({
        type: "success",
        message: "Your complaint has been submitted successfully!",
        notifications: resData.notifications,
      });

      reset({
        userName: user.name || "",
        userEmail: user.email || "",
        category: "Infrastructure",
        subject: "",
        description: "",
      });

      if (onComplaintSubmitted) {
        onComplaintSubmitted();
      }
    } catch (error: any) {
      setToast({
        type: "error",
        message: error.message || "An error occurred while submitting.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Toast Alert Banner */}
      {toast && (
        <div
          className={`lg:col-span-12 p-4 rounded-xl border flex items-start justify-between gap-3 shadow-md ${
            toast.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-rose-50 border-rose-200 text-rose-900"
          }`}
        >
          <div className="flex items-start gap-3">
            {toast.type === "success" ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold text-sm">{toast.message}</p>
              {toast.notifications && (
                <div className="text-xs mt-1 text-emerald-700 flex gap-4">
                  <span>
                    Email Alert: <strong>{toast.notifications.email}</strong>
                  </span>
                  <span>
                    WhatsApp Alert: <strong>{toast.notifications.whatsapp}</strong>
                  </span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-xs font-bold opacity-60 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Form Box */}
      <div className="lg:col-span-7 bg-white rounded-2xl p-7 border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              Register a New Complaint
            </h3>
            <p className="text-xs text-slate-500">
              Fill in the details below to submit your grievance.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Full Name (Auto-filled) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                {...register("userName")}
                disabled
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-700 font-medium cursor-not-allowed"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Email Address (Auto-filled) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                {...register("userEmail")}
                disabled
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-700 font-medium cursor-not-allowed"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Complaint Category <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                {...register("category")}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none transition-all cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {errors.category && (
              <p className="text-xs text-rose-500 mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Subject <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Brief title of your complaint"
              {...register("subject")}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
            {errors.subject && (
              <p className="text-xs text-rose-500 mt-1">
                {errors.subject.message}
              </p>
            )}
          </div>

          {/* Detailed Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Detailed Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Provide complete details including location, dates, or specific issue background..."
              {...register("description")}
              className="w-full bg-white border border-slate-300 rounded-xl p-4 text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
            />
            {errors.description && (
              <p className="text-xs text-rose-500 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Submitting Complaint...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Complaint</span>
              </>
            )}
          </button>

          <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5 pt-1">
            <Lock className="w-3.5 h-3.5" />
            Your complaint will be kept strictly confidential and logged securely.
          </p>
        </form>
      </div>

      {/* Right Side Trust & Information Card */}
      <div className="lg:col-span-5 space-y-6">
        {/* Banner Graphic Card */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-6 text-slate-800 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-4 shadow-md shadow-indigo-600/30">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">
              Your Voice Matters
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              We are committed to addressing your concerns promptly and
              effectively. Please provide as much detail as possible to help us
              resolve the issue.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-white border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-800">
                    Secure & Confidential
                  </h5>
                  <p className="text-xs text-slate-500">
                    Your data is encrypted and logged safely in MongoDB.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-white border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-800">
                    Quick Response
                  </h5>
                  <p className="text-xs text-slate-500">
                    Admin alerts are sent instantly via Email & WhatsApp.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-white border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-800">
                    Track Progress
                  </h5>
                  <p className="text-xs text-slate-500">
                    Monitor real-time resolution status from your dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
