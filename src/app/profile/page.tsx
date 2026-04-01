"use client";

import React, { useState, useEffect } from "react";
import { DashboardNav } from "@/components/DashboardNav";
import { Save, AlertTriangle, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { updateProfile, updatePassword, deleteUser, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.displayName || "");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
     if (user?.displayName) setName(user.displayName);
  }, [user]);

  const isGoogleUser = user?.providerData.some(p => p.providerId === "google.com");

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setMsg({ type: "", text: "" });

    try {
      await updateProfile(user, { displayName: name });
      setMsg({ type: "success", text: "Name updated successfully!" });
    } catch (error: any) {
      setMsg({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || isGoogleUser) return;
    setLoading(true);
    setMsg({ type: "", text: "" });

    try {
      await updatePassword(user, newPassword);
      setMsg({ type: "success", text: "Password updated successfully!" });
      setNewPassword("");
    } catch (error: any) {
      setMsg({ type: "error", text: error.message + " You might need to log in again to change password." });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await deleteUser(user);
      window.location.href = "/";
    } catch (error: any) {
      setMsg({ type: "error", text: "Please log out and log in again before deleting your account for security." });
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] font-inter selection:bg-rose-100 selection:text-rose-900">
      <DashboardNav />

      <main className="max-w-3xl mx-auto px-6 py-12 pb-24">
        <header className="mb-10 block">
          <h1 className="text-3xl font-black text-gray-900 font-[var(--font-outfit)] tracking-tight mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-500 font-medium">Manage your personal information and security.</p>
        </header>

        {msg.text && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className={`mb-8 p-4 rounded-2xl text-sm font-bold border flex items-center gap-3 ${
              msg.type === "success" ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-red-50 border-red-100 text-red-700"
            }`}
          >
            {msg.text}
          </motion.div>
        )}

        <div className="space-y-8">
          
          {/* General Info */}
          <section className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 font-[var(--font-outfit)] border-b border-gray-100 pb-4">General Information</h2>
            
            <form className="space-y-5" onSubmit={handleUpdateName}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-rose-100 focus:border-rose-400 outline-none transition-all font-medium text-gray-900"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    value={user?.email || ""}
                    disabled
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100/50 outline-none font-medium text-gray-400 cursor-not-allowed"
                  />
                  <p className="text-[11px] font-semibold text-gray-400 ml-1 uppercase tracking-wider">Syncing via {isGoogleUser ? "Google" : "Email"}</p>
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-gray-900 text-white rounded-full text-sm font-bold shadow-md hover:bg-gray-800 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Save Changes
                </button>
              </div>
            </form>
          </section>

          {/* Security */}
          <section className={`bg-white border border-gray-100 rounded-3xl p-8 shadow-sm relative overflow-hidden ${isGoogleUser ? "opacity-60" : ""}`}>
            {isGoogleUser && (
               <div className="absolute inset-x-0 bottom-0 top-[60px] bg-white/40 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-8 text-center">
                  <div className="bg-rose-600 text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-600/20">Google Protected</div>
                  <p className="text-gray-900 font-bold mt-4 text-sm max-w-[240px]">You are logged in via Google. Manage your password in your Google Account.</p>
               </div>
            )}
            
            <h2 className="text-xl font-bold text-gray-900 mb-6 font-[var(--font-outfit)] border-b border-gray-100 pb-4">Security</h2>
            
            <form className="space-y-5 max-w-md" onSubmit={handleUpdatePassword}>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 ml-1">New Password</label>
                <input 
                  required
                  type="password" 
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isGoogleUser}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-rose-100 focus:border-rose-400 outline-none transition-all font-medium text-gray-900 disabled:cursor-not-allowed"
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  disabled={loading || isGoogleUser}
                  className="px-6 py-2.5 bg-gray-900 text-white rounded-full text-sm font-bold shadow-md hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50"
                >
                  Update Password
                </button>
              </div>
            </form>
          </section>

          {/* Danger Zone */}
          <section className="border border-red-100 bg-red-50/30 rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-red-600 mb-2 font-[var(--font-outfit)] flex items-center gap-2">
              <AlertTriangle size={20} />
              Danger Zone
            </h2>
            <p className="text-sm font-medium text-gray-600 mb-6">
              Permanently delete your account and all associated projects. This action is irreversible.
            </p>
            
            {showDeleteConfirm ? (
              <div className="flex items-center gap-3">
                 <button 
                   onClick={handleDeleteAccount}
                   className="px-6 py-2.5 bg-red-600 text-white rounded-full text-sm font-bold shadow-md hover:bg-red-700 transition-all active:scale-95"
                 >
                    Confirm Delete
                 </button>
                 <button 
                   onClick={() => setShowDeleteConfirm(false)}
                   className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-bold hover:bg-gray-50 transition-all"
                 >
                    Cancel
                 </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="px-6 py-2.5 bg-white border border-red-200 text-red-600 rounded-full text-sm font-bold shadow-sm hover:bg-red-50 hover:border-red-300 transition-all active:scale-95"
              >
                Delete Account
              </button>
            )}
          </section>

        </div>
      </main>
    </div>
  );
}
