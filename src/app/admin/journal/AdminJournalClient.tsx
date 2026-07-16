"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  CheckCircle,
  Clock,
  RefreshCw,
  Edit3,
  History,
  Send,
  AlertCircle,
  Lock,
} from "lucide-react";

interface JournalEntry {
  id?: string;
  title: string;
  content: string;
  created_at?: string;
  status?: string;
}

export default function AdminJournalClient({ initialHistory }: { initialHistory: JournalEntry[] }) {
  // Password Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState(false);

  // Live Journal state
  const [liveJournal, setLiveJournal] = useState<JournalEntry | null>(null);
  const [loadingLive, setLoadingLive] = useState(true);

  // Draft & Edit Workspace state
  const [draftTitle, setDraftTitle] = useState("");
  const [draftContent, setDraftContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // History state
  const [history, setHistory] = useState<JournalEntry[]>(initialHistory);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Feedback notifications
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Check existing session auth on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAuth = sessionStorage.getItem("kaaktaal_admin_auth");
      if (savedAuth === "true") {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === "kaaktaal") {
      setIsAuthenticated(true);
      setAuthError(false);
      sessionStorage.setItem("kaaktaal_admin_auth", "true");
    } else {
      setAuthError(true);
    }
  };

  // Fetch current live journal
  const fetchLiveJournal = useCallback(async () => {
    setLoadingLive(true);
    try {
      const res = await fetch("/api/generate-journal");
      if (!res.ok) throw new Error("Failed to load live journal");
      const data = await res.json();
      setLiveJournal(data);
    } catch (err) {
      console.error("Error loading live journal:", err);
    } finally {
      setLoadingLive(false);
    }
  }, []);

  // Fetch journal history
  const fetchHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch("/api/admin/journal/history");
      if (!res.ok) throw new Error("Failed to fetch history");
      const data = await res.json();
      if (data.success && Array.isArray(data.journals)) {
        setHistory(data.journals);
      }
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchLiveJournal();
      fetchHistory();
    }
  }, [isAuthenticated, fetchLiveJournal, fetchHistory]);

  // Generate draft via Gemini
  const handleGenerateDraft = async () => {
    setIsGenerating(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/journal/generate", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.detail || data.error || "Failed to generate draft");
      }
      setDraftTitle(data.draft.title);
      setDraftContent(data.draft.content);
      setMessage({
        type: "success",
        text: "Fresh AI draft generated! Review or edit below before publishing.",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setMessage({ type: "error", text: `Generation failed: ${msg}` });
    } finally {
      setIsGenerating(false);
    }
  };

  // Publish draft
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftTitle.trim() || !draftContent.trim()) {
      setMessage({ type: "error", text: "Both title and content are required to publish." });
      return;
    }

    setIsPublishing(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/journal/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: draftTitle, content: draftContent }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.detail || data.error || "Failed to publish journal");
      }

      setMessage({
        type: "success",
        text: "Journal entry approved & published live successfully!",
      });

      // Clear draft workspace and update lists
      setDraftTitle("");
      setDraftContent("");
      fetchLiveJournal();
      fetchHistory();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setMessage({ type: "error", text: `Publishing failed: ${msg}` });
    } finally {
      setIsPublishing(false);
    }
  };

  // Populate editor with a past entry for quick re-editing
  const handleLoadIntoEditor = (entry: JournalEntry) => {
    setDraftTitle(entry.title);
    setDraftContent(entry.content);
    setMessage({
      type: "success",
      text: `Loaded entry "${entry.title}" into workspace editor.`,
    });
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  // Password Lock Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] text-[#111113] flex items-center justify-center p-4 selection:bg-[#111113]/20">
        <form
          onSubmit={handlePasswordSubmit}
          className="bg-white border border-[#111113]/15 p-8 max-w-sm w-full space-y-6 shadow-xs"
        >
          <div className="space-y-1">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#111113]/60 font-semibold flex items-center gap-1.5">
              <Lock className="w-3 h-3" />
              Kaaktaal Archive Admin
            </div>
            <h1 className="font-plakatbau text-3xl uppercase font-extrabold text-[#111113]">
              Authentication
            </h1>
          </div>

          <div className="space-y-2">
            <label className="font-mono text-[10px] uppercase tracking-widest text-[#111113]/70 font-bold">
              Access Password
            </label>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setAuthError(false);
              }}
              placeholder="Enter password"
              className="w-full font-mono text-sm px-4 py-2.5 border border-[#111113]/20 focus:border-[#111113] focus:outline-none bg-[#F8F7F4]/50 transition-colors"
              autoFocus
            />
            {authError && (
              <p className="font-mono text-[11px] text-[#111113] font-semibold">
                Invalid access password. Try again.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full font-mono text-xs uppercase tracking-widest px-4 py-3 bg-[#111113] text-gray-300 hover:text-white transition-colors rounded-xs font-bold cursor-pointer"
          >
            Authenticate
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#111113] font-sans p-4 sm:p-8 md:p-12 selection:bg-[#111113]/20">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Top Header */}
        <header className="border-b border-[#111113]/15 pb-6 flex justify-between items-center">
          <h1 className="font-plakatbau text-3xl sm:text-4xl md:text-5xl uppercase font-extrabold text-[#111113] tracking-wide leading-none">
            admin
          </h1>
          <button
            onClick={() => {
              sessionStorage.removeItem("kaaktaal_admin_auth");
              setIsAuthenticated(false);
            }}
            className="font-mono text-[10px] uppercase tracking-widest text-[#111113]/50 hover:text-[#111113]"
          >
            Lock Panel
          </button>
        </header>

        {/* System Alert Banner */}
        {message && (
          <div className="p-4 rounded-xs border border-[#111113]/20 bg-[#111113]/5 text-[#111113] flex items-start gap-3 text-sm font-mono transition-all duration-200">
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5 shrink-0 text-[#111113] mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 text-[#111113] mt-0.5" />
            )}
            <div className="flex-1">{message.text}</div>
          </div>
        )}

        {/* Grid Layout: Live Journal vs Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Live Active Journal Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={fetchLiveJournal}
                disabled={loadingLive}
                className="p-1.5 text-[#111113]/50 hover:text-[#111113] transition-colors"
                title="Refresh Live Entry"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingLive ? "animate-spin" : ""}`} />
              </button>
            </div>

            <div className="bg-white border border-[#111113]/15 p-6 space-y-4 shadow-xs relative">
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#111113] font-semibold">
                Current Entry
              </div>

              {loadingLive ? (
                <div className="space-y-3 animate-pulse">
                  <div className="h-6 bg-[#111113]/10 rounded-xs w-3/4" />
                  <div className="h-4 bg-[#111113]/10 rounded-xs w-full" />
                  <div className="h-4 bg-[#111113]/10 rounded-xs w-5/6" />
                </div>
              ) : liveJournal ? (
                <>
                  <h3 className="font-plakatbau text-2xl uppercase font-bold text-[#111113] leading-tight">
                    {liveJournal.title}
                  </h3>
                  <p className="font-garamond text-base text-[#111113]/85 leading-relaxed whitespace-pre-wrap">
                    {liveJournal.content}
                  </p>
                  <div className="pt-4 border-t border-[#111113]/10 flex justify-between items-center font-mono text-[10px] text-[#111113]/50">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {liveJournal.created_at
                        ? new Date(liveJournal.created_at).toLocaleString()
                        : "Unknown date"}
                    </span>
                  </div>
                </>
              ) : (
                <p className="font-mono text-xs text-[#111113]/50 italic">No live journal found.</p>
              )}
            </div>

          </div>

          {/* Right Column: Draft & Approval Form */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={handleGenerateDraft}
                disabled={isGenerating || isPublishing}
                className="font-mono text-xs uppercase tracking-wider px-4 py-2 bg-[#111113] text-gray-400 transition-colors rounded-xs font-bold shadow-xs disabled:opacity-50 cursor-pointer hover:text-white"
              >
                {isGenerating ? "Generating..." : "Generate"}
              </button>
            </div>

            <form onSubmit={handlePublish} className="bg-white border border-[#111113]/15 p-6 space-y-6 shadow-xs">
              
              {/* Title Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-[#111113]/70 font-bold">
                    Title
                  </label>
                  <span className="font-mono text-[10px] text-[#111113]/40">
                    {draftTitle.trim() ? `${draftTitle.split(/\s+/).filter(Boolean).length} words` : "3-7 words recommended"}
                  </span>
                </div>
                <input
                  type="text"
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  placeholder="e.g., The Weight of Quiet Verandahs"
                  className="w-full font-plakatbau text-xl sm:text-2xl uppercase px-4 py-2.5 border border-[#111113]/20 focus:border-[#111113] focus:outline-none bg-[#F8F7F4]/50 transition-colors"
                />
              </div>

              {/* Content Textarea */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-[#111113]/70 font-bold">
                    Content
                  </label>
                  <span className="font-mono text-[10px] text-[#111113]/40">
                    {draftContent.trim() ? `${draftContent.split(/\s+/).filter(Boolean).length} words` : "70-100 words"}
                  </span>
                </div>
                <textarea
                  rows={5}
                  value={draftContent}
                  onChange={(e) => setDraftContent(e.target.value)}
                  placeholder="We have been thinking about..."
                  className="w-full font-garamond text-base sm:text-lg px-4 py-3 border border-[#111113]/20 focus:border-[#111113] focus:outline-none bg-[#F8F7F4]/50 transition-colors leading-relaxed"
                />
              </div>

              {/* Submit / Approve Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#111113]/10">
                <button
                  type="submit"
                  disabled={isPublishing || !draftTitle.trim() || !draftContent.trim()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-widest px-6 py-3 bg-[#111113] hover:bg-[#333333] text-white transition-colors rounded-xs font-bold disabled:opacity-40 cursor-pointer"
                >
                  <Send className={`w-4 h-4 ${isPublishing ? "animate-bounce" : ""}`} />
                  {isPublishing ? "Publishing to Live..." : "Approve & Publish Live"}
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Bottom Section: Journal History */}
        <section className="space-y-4 pt-6 border-t border-[#111113]/15">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-xs uppercase tracking-widest text-[#111113]/70 font-bold flex items-center gap-2">
              <History className="w-4 h-4 text-[#111113]" />
              Journal History Log ({history.length})
            </h2>
            <button
              onClick={fetchHistory}
              className="font-mono text-[10px] uppercase tracking-wider text-[#111113]/50 hover:text-[#111113]"
            >
              Refresh Log
            </button>
          </div>

          {loadingHistory ? (
            <div className="p-8 text-center font-mono text-xs text-[#111113]/40 animate-pulse">
              Loading archival history logs...
            </div>
          ) : history.length === 0 ? (
            <div className="p-8 border border-dashed border-[#111113]/20 bg-white text-center font-mono text-xs text-[#111113]/50">
              No previous journal records found in Supabase database.
            </div>
          ) : (
            <div className="bg-white border border-[#111113]/15 divide-y divide-[#111113]/10 overflow-hidden">
              {history.map((entry) => (
                <div
                  key={entry.id || entry.created_at}
                  className="p-4 hover:bg-[#F8F7F4]/70 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group"
                >
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="font-plakatbau text-base uppercase font-bold text-[#111113]">
                        {entry.title}
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-widest bg-[#111113]/5 px-1.5 py-0.5 text-[#111113]/60 rounded-xs">
                        {entry.status || "published"}
                      </span>
                    </div>
                    <p className="font-garamond text-sm text-[#111113]/75 line-clamp-2">
                      {entry.content}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 font-mono text-[10px] text-[#111113]/50">
                    <span>
                      {entry.created_at ? new Date(entry.created_at).toLocaleString() : ""}
                    </span>
                    <button
                      onClick={() => handleLoadIntoEditor(entry)}
                      className="px-2.5 py-1 border border-[#111113]/20 hover:border-[#111113] hover:text-[#111113] transition-colors rounded-xs bg-white text-[#111113]/70 font-mono"
                    >
                      Load into Editor
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
