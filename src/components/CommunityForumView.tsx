import React, { useState } from "react";
import { ForumPost, LanguageCode } from "../types";
import { INITIAL_FORUM_POSTS } from "../data/mockData";
import { Users, ThumbsUp, MessageSquare, Send, Sparkles, Plus, CheckCircle2, WifiOff } from "lucide-react";

interface CommunityForumViewProps {
  currentLang: LanguageCode;
  isOnline: boolean;
  onAddUnsyncedItem: (item: any) => void;
}

export const CommunityForumView: React.FC<CommunityForumViewProps> = ({
  currentLang,
  isOnline,
  onAddUnsyncedItem
}) => {
  const [posts, setPosts] = useState<ForumPost[]>(INITIAL_FORUM_POSTS);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCrop, setNewCrop] = useState("Wheat");
  const [authorName, setAuthorName] = useState("Kisan Friend");
  const [location, setLocation] = useState("Punjab");

  // AI Advisory Question state
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiReply, setAiReply] = useState<string | null>(null);
  const [isAiAsking, setIsAiAsking] = useState(false);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost: ForumPost = {
      id: "fp-" + Date.now(),
      authorName: authorName || "Farmer Friend",
      location: location || "India",
      cropCategory: newCrop,
      title: newTitle,
      content: newContent,
      upvotes: 1,
      repliesCount: 0,
      timestamp: "Just now",
      isSynced: isOnline,
      tags: [newCrop, "Community Tip"]
    };

    setPosts([newPost, ...posts]);

    if (!isOnline) {
      onAddUnsyncedItem({
        id: newPost.id,
        type: "FORUM_POST",
        data: newPost,
        createdAt: new Date().toISOString(),
        synced: false
      });
    }

    setNewTitle("");
    setNewContent("");
    setShowNewPostModal(false);
  };

  const handleUpvote = (id: string) => {
    setPosts(
      posts.map((p) => (p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p))
    );
  };

  const askAiAdvisor = async () => {
    if (!aiQuestion.trim()) return;
    setIsAiAsking(true);
    setAiReply(null);

    try {
      const res = await fetch("/api/gemini/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: aiQuestion,
          language: "Hindi",
          cropContext: newCrop
        })
      });
      const data = await res.json();
      if (data.success) {
        setAiReply(data.reply);
      }
    } catch (err) {
      console.error("AI Advisor error:", err);
    } finally {
      setIsAiAsking(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-900 font-bold text-lg sm:text-xl">
            <Users className="w-5 h-5 text-teal-600" />
            <span>Kisan Chaupal - Farmers Community & Peer Forum</span>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Share field observations, pest alerts, organic recipes, and local Mandi updates across India.
          </p>
        </div>

        <button
          onClick={() => setShowNewPostModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-800 text-white rounded-xl text-xs font-bold hover:bg-teal-700 transition-all shadow-sm shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Ask Question / Post Tip</span>
        </button>
      </div>

      {/* AI Farmer Assistant Inline Widget */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-teal-950 text-white rounded-2xl p-5 shadow-md space-y-3">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
          <Sparkles className="w-4 h-4" />
          <span>Instant Gemini AI Agriculture Assistant (Ask in Any Indian Language)</span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. 30 दिन के गेहूं में जिंक सल्फेट का प्रयोग कैसे करें? (Ask anything)..."
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            className="flex-1 bg-white/10 text-white placeholder-teal-200/60 border border-white/20 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
          <button
            onClick={askAiAdvisor}
            disabled={isAiAsking}
            className="px-4 py-2 bg-amber-400 text-amber-950 rounded-xl font-bold text-xs hover:bg-amber-300 shrink-0"
          >
            {isAiAsking ? "Thinking..." : "Ask AI"}
          </button>
        </div>

        {aiReply && (
          <div className="bg-white/10 p-4 rounded-xl border border-white/20 text-xs text-teal-50 space-y-2 animate-in fade-in">
            <span className="font-bold text-amber-300 block">AI Krishi Advisor Answer:</span>
            <p className="whitespace-pre-line leading-relaxed font-medium">{aiReply}</p>
          </div>
        )}
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-black text-stone-900">{p.authorName}</span>
                <span className="text-stone-400">•</span>
                <span className="text-stone-500 font-medium">{p.location}</span>
                <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {p.cropCategory}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {!p.isSynced && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                    <WifiOff className="w-3 h-3" /> Queued Offline
                  </span>
                )}
                <span className="text-stone-400 text-[11px]">{p.timestamp}</span>
              </div>
            </div>

            <h3 className="font-extrabold text-stone-900 text-base">{p.title}</h3>
            <p className="text-xs sm:text-sm text-stone-700 font-medium leading-relaxed">{p.content}</p>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <button
                onClick={() => handleUpvote(p.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-50 text-stone-700 hover:bg-teal-50 hover:text-teal-900 font-bold border border-stone-200"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-teal-700" />
                <span>Helpful ({p.upvotes})</span>
              </button>

              <div className="flex items-center gap-1 text-stone-500 font-bold">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{p.repliesCount} Replies</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-xl border border-stone-200">
            <h3 className="font-black text-stone-900 text-lg">Post Question to Kisan Chaupal</h3>

            <form onSubmit={handleCreatePost} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Your Name & Location</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Name"
                    className="bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="District, State"
                    className="bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Crop</label>
                <select
                  value={newCrop}
                  onChange={(e) => setNewCrop(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold"
                >
                  <option value="Wheat">Wheat</option>
                  <option value="Paddy">Paddy Rice</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Sugarcane">Sugarcane</option>
                  <option value="Vegetables">Vegetables</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Question / Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Remedy for yellow rust in Ludhiana area..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Description</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={4}
                  placeholder="Describe soil type, watering schedule, or symptoms observed..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-800 text-white rounded-xl text-xs font-bold hover:bg-teal-700"
                >
                  Publish Post {!isOnline && "(Queued Offline)"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
