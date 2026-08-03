import React, { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AIMentor from "../components/AIMentor";
import { Users, Heart, MessageSquare, Send, Sparkles } from "lucide-react";

export default function Community() {
  const { posts, fetchPosts, createPost, likePost, addComment } = useStore();
  const [newPostContent, setNewPostContent] = useState("");
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [activeCommentPost, setActiveCommentPost] = useState<number | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    await createPost(newPostContent.trim());
    setNewPostContent("");
  };

  const handleLike = async (postId: number) => {
    await likePost(postId);
  };

  const handleAddComment = async (e: React.FormEvent, postId: number) => {
    e.preventDefault();
    const commentText = commentInputs[postId] || "";
    if (!commentText.trim()) return;
    
    await addComment(postId, commentText.trim());
    setCommentInputs({
      ...commentInputs,
      [postId]: ""
    });
  };

  const handleCommentChange = (postId: number, val: string) => {
    setCommentInputs({
      ...commentInputs,
      [postId]: val
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-73px)]">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-2">
              Peer Learning Feed <Users className="h-6 w-6 text-primary-light" />
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Share your project accomplishments, ask questions, and celebrate your roadmap achievements.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Feed Center Column */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Write Post Box */}
              <div className="p-5 rounded-2xl glass-panel border border-slate-700/50 space-y-3">
                <h3 className="font-bold text-xs text-slate-200">Share with the Peer Group</h3>
                <form onSubmit={handleCreatePost} className="space-y-3">
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Ask a technical doubt, or share a certification milestone..."
                    rows={3}
                    required
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 focus:outline-none focus:border-primary resize-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!newPostContent.trim()}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-xs font-bold text-white hover:opacity-90 active:scale-95 shadow-md disabled:opacity-40"
                    >
                      Post Feed
                    </button>
                  </div>
                </form>
              </div>

              {/* Feed List */}
              {posts.length === 0 ? (
                <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 glass-panel">
                  <Users className="h-10 w-10 text-slate-500 mx-auto mb-4" />
                  <p className="text-sm text-slate-400">Be the first to share an update on this workspace feed!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {posts.map((post) => (
                    <div 
                      key={post.id} 
                      className="p-5 rounded-2xl glass-panel border border-slate-750/50 space-y-4"
                    >
                      {/* Author Header */}
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-200 border border-slate-700">
                          {post.author_name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-200">{post.author_name}</h4>
                          <p className="text-[10px] text-slate-500 mt-0.5">{post.author_role} • {new Date(post.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {/* Content */}
                      <p className="text-xs text-slate-350 leading-relaxed whitespace-pre-wrap">
                        {post.content}
                      </p>

                      {/* Action buttons bar */}
                      <div className="flex items-center gap-6 pt-3 border-t border-slate-850 text-xs">
                        <button
                          onClick={() => handleLike(post.id)}
                          className="flex items-center gap-1.5 text-slate-550 hover:text-red-400 transition-colors"
                        >
                          <Heart className="h-4.5 w-4.5 fill-current" />
                          <span>{post.likes_count}</span>
                        </button>

                        <button
                          onClick={() => setActiveCommentPost(activeCommentPost === post.id ? null : post.id)}
                          className="flex items-center gap-1.5 text-slate-550 hover:text-primary-light transition-colors"
                        >
                          <MessageSquare className="h-4.5 w-4.5" />
                          <span>{post.comments ? post.comments.length : 0}</span>
                        </button>
                      </div>

                      {/* Comment Box section */}
                      {activeCommentPost === post.id && (
                        <div className="pt-3 border-t border-slate-850/60 space-y-4">
                          {/* Comments List */}
                          {post.comments && post.comments.length > 0 && (
                            <div className="space-y-3 pl-4 border-l-2 border-slate-800">
                              {post.comments.map((comm) => (
                                <div key={comm.id} className="space-y-0.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] font-bold text-slate-200">{comm.author_name}</span>
                                    <span className="text-[8px] text-slate-500">{new Date(comm.created_at).toLocaleDateString()}</span>
                                  </div>
                                  <p className="text-xs text-slate-400">{comm.content}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Write Comment Form */}
                          <form 
                            onSubmit={(e) => handleAddComment(e, post.id)}
                            className="flex gap-2"
                          >
                            <input
                              type="text"
                              value={commentInputs[post.id] || ""}
                              onChange={(e) => handleCommentChange(post.id, e.target.value)}
                              placeholder="Write a comment..."
                              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-primary"
                            />
                            <button
                              type="submit"
                              disabled={!(commentInputs[post.id] || "").trim()}
                              className="bg-primary hover:bg-primary-dark p-2.5 rounded-xl text-white disabled:opacity-40"
                            >
                              <Send className="h-4.5 w-4.5" />
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar Right Column */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Leaderboard or Tips */}
              <div className="p-5 rounded-2xl glass-panel border border-slate-700/50 space-y-4">
                <h3 className="font-bold text-xs text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="h-4.5 w-4.5 text-primary-light" /> Learning Leaderboard
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">1. Rakesh Kumar (750 XP)</span>
                    <span className="text-amber-500 font-semibold">Gold</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">2. Shruti Deshmukh (600 XP)</span>
                    <span className="text-slate-400 font-semibold">Silver</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">3. Rahul Sen (540 XP)</span>
                    <span className="text-orange-400 font-semibold">Bronze</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>

      <AIMentor />
    </div>
  );
}
