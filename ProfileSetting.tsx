
import React, { useState } from 'react';
import { CompanyProfile } from '../types';

interface ProfileProps {
  profile: CompanyProfile;
  onSave: (p: CompanyProfile) => void;
  onCancel: () => void;
}

const ProfileSetting: React.FC<ProfileProps> = ({ profile, onSave, onCancel }) => {
  const [data, setData] = useState(profile);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData({ ...data, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white p-6 md:p-10 border-4 border-slate-300 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] max-w-4xl mx-auto animate-in zoom-in-95 duration-300">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 underline decoration-blue-600 decoration-8 underline-offset-8 uppercase italic tracking-tighter">
          Master Identity Setup
        </h2>
        <p className="text-slate-400 font-bold mt-4 uppercase text-xs tracking-[0.3em]">Configure Organization Environment & Branding</p>
      </div>

      <div className="space-y-8">
         {/* Logo Section */}
         <div className="flex flex-col items-center justify-center p-6 border-4 border-dashed border-slate-100 rounded-3xl bg-slate-50 mb-8">
            <div className="w-40 h-40 bg-white border-4 border-slate-200 rounded-full flex items-center justify-center overflow-hidden shadow-xl mb-4 relative group">
               {data.logo ? (
                 <img src={data.logo} className="w-full h-full object-contain" alt="Org Logo" />
               ) : (
                 <div className="text-center p-4">
                    <svg className="w-12 h-12 mx-auto text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span className="text-[10px] font-black text-slate-400 uppercase">Upload Logo</span>
                 </div>
               )}
               <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Company Logo will appear on all Reports & Forms</p>
            {data.logo && <button onClick={() => setData({...data, logo: ''})} className="mt-2 text-red-500 text-[10px] font-black uppercase">Remove Logo</button>}
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative">
               <label className="block text-[11px] font-black text-blue-600 uppercase mb-2 tracking-widest ml-1">Organization Name</label>
               <input 
                 className="w-full bg-white border-2 border-slate-200 p-4 rounded-xl font-black text-slate-900 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none transition-all shadow-sm uppercase" 
                 value={data.name} 
                 onChange={(e)=>setData({...data, name: e.target.value})} 
               />
            </div>
            <div className="relative">
               <label className="block text-[11px] font-black text-blue-600 uppercase mb-2 tracking-widest ml-1">Location / Branch</label>
               <input 
                 className="w-full bg-white border-2 border-slate-200 p-4 rounded-xl font-black text-slate-900 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none transition-all shadow-sm uppercase" 
                 value={data.locationHeader || ""} 
                 onChange={(e)=>setData({...data, locationHeader: e.target.value})} 
                 placeholder="e.g. MAIN BRANCH, DELHI"
               />
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative">
               <label className="block text-[11px] font-black text-blue-600 uppercase mb-2 tracking-widest ml-1">Contact Phone</label>
               <input 
                 className="w-full bg-white border-2 border-slate-200 p-4 rounded-xl font-black text-slate-900 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none shadow-sm" 
                 value={data.contact} 
                 onChange={(e)=>setData({...data, contact: e.target.value})} 
               />
            </div>
            <div className="relative">
               <label className="block text-[11px] font-black text-blue-600 uppercase mb-2 tracking-widest ml-1">Official Email</label>
               <input 
                 className="w-full bg-white border-2 border-slate-200 p-4 rounded-xl font-black text-slate-900 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none shadow-sm" 
                 value={data.email} 
                 onChange={(e)=>setData({...data, email: e.target.value})} 
               />
            </div>
         </div>

         <div className="relative">
            <label className="block text-[11px] font-black text-blue-600 uppercase mb-2 tracking-widest ml-1">Registered Address</label>
            <textarea 
              className="w-full bg-white border-2 border-slate-200 p-4 rounded-xl font-black text-slate-900 focus:border-blue-600 h-[100px] resize-none" 
              value={data.address} 
              onChange={(e)=>setData({...data, address: e.target.value})} 
            />
         </div>

         <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-6 pt-10 border-t-4 border-slate-50">
           <button onClick={onCancel} className="bg-slate-100 text-slate-600 px-12 py-4 rounded-xl font-black uppercase transition-all border-b-4 border-slate-300">Cancel</button>
           <button onClick={() => onSave(data)} className="bg-blue-600 text-white px-16 py-4 rounded-xl font-black uppercase shadow-2xl hover:bg-blue-700 transition-all border-b-4 border-blue-900">Save Environment</button>
        </div>
      </div>
      <p className="text-center text-[10px] font-black text-slate-300 uppercase mt-8 italic">System Architecture By Aditya Kumar Rai</p>
    </div>
  );
};

export default ProfileSetting;
