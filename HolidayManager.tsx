
import React, { useState } from 'react';
import { Holiday } from '../types';

interface Props {
  holidays: Holiday[];
  setHolidays: React.Dispatch<React.SetStateAction<Holiday[]>>;
  year: number;
  setYear: (y: number) => void;
  onBack: () => void;
}

const HolidayManager: React.FC<Props> = ({ holidays, setHolidays, year, setYear, onBack }) => {
  const [newH, setNewH] = useState({ date: '', reason: '', type: 'Company' as Holiday['type'] });

  const addHoliday = () => {
    if (!newH.date || !newH.reason) return;
    setHolidays([...holidays, newH]);
    setNewH({ date: '', reason: '', type: 'Company' });
  };

  return (
    <div className="bg-white p-6 md:p-12 border-4 border-slate-300 rounded-3xl shadow-2xl max-w-4xl mx-auto animate-in zoom-in-95 duration-500">
      <div className="flex justify-between items-center mb-10 border-b-8 border-blue-600 pb-6">
        <div>
           <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter">Holiday Management</h2>
           <p className="text-[10px] font-black text-slate-400 uppercase mt-2 tracking-widest">Master Engineer: Aditya Kumar Rai</p>
        </div>
        <button onClick={onBack} className="bg-slate-900 text-white px-8 py-2 rounded-xl font-black uppercase">Back</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-slate-50 p-6 rounded-2xl mb-10 border-2 border-slate-100">
         <div>
            <label className="block text-[10px] font-black text-blue-600 uppercase mb-2 tracking-widest">Select Date</label>
            <input type="date" className="w-full p-3 rounded-xl border-2 border-slate-200 font-black" value={newH.date} onChange={(e)=>setNewH({...newH, date: e.target.value})} />
         </div>
         <div className="md:col-span-2">
            <label className="block text-[10px] font-black text-blue-600 uppercase mb-2 tracking-widest">Holiday Occasion</label>
            <input type="text" className="w-full p-3 rounded-xl border-2 border-slate-200 font-black uppercase" placeholder="e.g. Diwali, Independence Day" value={newH.reason} onChange={(e)=>setNewH({...newH, reason: e.target.value})} />
         </div>
         <button onClick={addHoliday} className="bg-blue-600 text-white p-3 rounded-xl font-black uppercase shadow-lg border-b-4 border-blue-900 active:translate-y-1 active:border-b-0">Add Record</button>
      </div>

      <div className="space-y-4">
         {holidays.length === 0 ? (
           <div className="p-20 text-center text-slate-300 font-black text-2xl uppercase border-4 border-dashed rounded-3xl">No Specialized Holidays Set</div>
         ) : holidays.sort((a,b)=>a.date.localeCompare(b.date)).map((h, i) => (
           <div key={i} className="flex justify-between items-center bg-white border-2 border-slate-100 p-4 rounded-xl shadow-sm hover:border-blue-300 transition-all">
              <div className="flex gap-6 items-center">
                 <div className="bg-blue-600 text-white p-3 rounded-lg text-center min-w-[100px]">
                    <div className="text-[10px] font-black uppercase">{new Date(h.date).toLocaleDateString('en-US', {month: 'short'})}</div>
                    <div className="text-xl font-black">{new Date(h.date).getDate()}</div>
                 </div>
                 <div>
                    <h4 className="text-lg font-black text-slate-900 uppercase">{h.reason}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{h.type} Official Day-Off</p>
                 </div>
              </div>
              <button onClick={()=>setHolidays(holidays.filter((_, idx)=>idx !== i))} className="text-red-600 font-black uppercase text-xs p-2 hover:bg-red-50 rounded">Delete</button>
           </div>
         ))}
      </div>
    </div>
  );
};

export default HolidayManager;
