
import React, { useState } from 'react';
import { Post } from '../types';

interface Props {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  onBack: () => void;
}

const PostManager: React.FC<Props> = ({ posts, setPosts, onBack }) => {
  const [newPost, setNewPost] = useState({ title: '', content: '' });

  const addPost = () => {
    if (!newPost.title || !newPost.content) return;
    const post: Post = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      date: new Date().toLocaleDateString(),
      author: 'Administrator'
    };
    setPosts([post, ...posts]);
    setNewPost({ title: '', content: '' });
  };

  const deletePost = (id: string) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  return (
    <div className="bg-white p-6 md:p-10 border-4 border-slate-300 rounded-3xl shadow-2xl max-w-5xl mx-auto animate-in zoom-in duration-300">
      <div className="flex justify-between items-center mb-10 border-b-8 border-slate-900 pb-6">
        <div>
           <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter">Bulletin Board</h2>
           <p className="text-[10px] font-black text-blue-500 uppercase mt-2 tracking-widest">Organization Announcements & Posts</p>
        </div>
        <button onClick={onBack} className="bg-slate-900 text-white px-10 py-3 rounded-xl font-black uppercase shadow-2xl">Return</button>
      </div>

      <div className="bg-slate-50 p-8 rounded-3xl mb-12 border-2 border-slate-200 shadow-inner">
         <h3 className="text-sm font-black uppercase mb-6 text-slate-400 tracking-widest underline decoration-2 decoration-blue-500 underline-offset-4">Create Official Post</h3>
         <div className="space-y-6">
            <input 
              type="text" 
              placeholder="Post Headline" 
              className="w-full p-4 rounded-xl border-2 border-slate-200 font-black text-lg focus:border-blue-600 outline-none" 
              value={newPost.title} 
              onChange={(e)=>setNewPost({...newPost, title: e.target.value})} 
            />
            <textarea 
              placeholder="Write content here..." 
              className="w-full p-4 rounded-xl border-2 border-slate-200 font-bold h-32 focus:border-blue-600 outline-none resize-none" 
              value={newPost.content} 
              onChange={(e)=>setNewPost({...newPost, content: e.target.value})} 
            />
            <div className="flex justify-end">
              <button onClick={addPost} className="bg-blue-600 text-white px-12 py-4 rounded-xl font-black uppercase shadow-xl hover:bg-blue-700 transition-all border-b-4 border-blue-900">Publish Post</button>
            </div>
         </div>
      </div>

      <div className="space-y-8">
         {posts.length === 0 ? (
           <div className="p-20 text-center text-slate-200 font-black text-4xl uppercase border-4 border-dashed rounded-3xl">No Updates Posted</div>
         ) : posts.map((p) => (
           <div key={p.id} className="bg-white border-4 border-slate-100 p-8 rounded-3xl shadow-xl relative group">
              <button onClick={() => deletePost(p.id)} className="absolute top-6 right-6 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity font-black text-xs uppercase">Delete Post</button>
              <div className="flex items-center gap-4 mb-4">
                 <span className="bg-slate-900 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">OFFICIAL UPDATE</span>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.date}</span>
              </div>
              <h4 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-4">{p.title}</h4>
              <p className="text-slate-600 font-bold leading-relaxed whitespace-pre-wrap text-lg">{p.content}</p>
              <div className="mt-8 pt-6 border-t-2 border-slate-50 flex justify-between items-center">
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Engineered By Aditya Rai</p>
                 <span className="text-slate-900 font-black uppercase text-xs italic tracking-widest">- {p.author}</span>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default PostManager;
