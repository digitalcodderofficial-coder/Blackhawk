
import React, { useState } from 'react';
import { Employee } from '../types';

interface DatabaseViewProps {
  employees: Employee[];
  onDelete: (id: string) => void;
  onEdit: (emp: Employee) => void;
  onAdd: () => void;
  onUpdateStatus: (id: string, status: 'Active' | 'Inactive') => void;
}

const DatabaseView: React.FC<DatabaseViewProps> = ({ employees, onDelete, onEdit, onAdd, onUpdateStatus }) => {
  const [filter, setFilter] = useState<'All' | 'Active' | 'Inactive'>('All');

  const filteredEmployees = employees.filter(e => {
    if (filter === 'All') return true;
    return e.status === filter;
  });

  return (
    <div className="bg-white border-4 border-slate-300 p-4 shadow-2xl rounded">
      <div className="bg-[#0f172a] p-6 rounded-xl flex flex-col md:flex-row justify-between items-center mb-8 shadow-xl border-b-8 border-blue-600 gap-4">
         <div className="flex items-center gap-6">
            <h2 className="text-3xl font-black italic uppercase text-white tracking-tighter">Unified Staff Registry</h2>
            <div className="bg-slate-800 p-1 rounded-lg flex border border-slate-700">
               {['All', 'Active', 'Inactive'].map(f => (
                 <button 
                   key={f} 
                   onClick={() => setFilter(f as any)} 
                   className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${filter === f ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                 >
                   {f}
                 </button>
               ))}
            </div>
         </div>
         <button onClick={onAdd} className="bg-green-600 text-white px-10 py-3 rounded-xl font-black uppercase shadow-lg border-b-4 border-green-900 active:translate-y-1 active:border-b-0 transition-all text-xs tracking-widest">Enlist New Member</button>
      </div>

      <div className="overflow-x-auto border-[6px] border-slate-50 p-2 rounded-xl bg-white shadow-inner">
        <table className="w-full text-[12px] text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] h-12">
              <th className="p-4 border-b-4 border-slate-900">ID CODE</th>
              <th className="p-4 border-b-4 border-slate-900">IDENTITY NAME</th>
              <th className="p-4 border-b-4 border-slate-900">ROLE / DESIGNATION</th>
              <th className="p-4 border-b-4 border-slate-900">STATUS</th>
              <th className="p-4 border-b-4 border-slate-900">LAST SYNC</th>
              <th className="p-4 border-b-4 border-slate-900 text-right">GROSS PAY (₹)</th>
              <th className="p-4 border-b-4 border-slate-900 text-center">ACTION AUDIT</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length === 0 ? (
               <tr><td colSpan={7} className="p-32 text-center text-slate-200 font-black text-5xl uppercase italic tracking-tighter opacity-30">Registry Empty</td></tr>
            ) : filteredEmployees.map(emp => (
              <tr key={emp.id} className="hover:bg-blue-50 border-b border-slate-100 font-bold transition-all h-[75px] group">
                <td className="p-4 font-black text-blue-600 uppercase tracking-widest">{emp.id}</td>
                <td className="p-4">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-slate-200 overflow-hidden shadow-sm">
                         {emp.photo ? <img src={emp.photo} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300">👤</div>}
                      </div>
                      <span className="text-slate-900 font-black uppercase group-hover:text-blue-600 transition-colors">{emp.name}</span>
                   </div>
                </td>
                <td className="p-4 italic text-slate-400 uppercase text-[10px] font-black tracking-widest">{emp.designation}</td>
                <td className="p-4">
                   <button 
                     onClick={() => onUpdateStatus(emp.id, emp.status === 'Active' ? 'Inactive' : 'Active')}
                     className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase shadow-sm border-b-4 transition-all active:translate-y-1 ${emp.status === 'Active' ? 'bg-green-100 text-green-700 border-green-800' : 'bg-red-100 text-red-700 border-red-800'}`}
                   >
                     {emp.status}
                   </button>
                </td>
                <td className="p-4 font-black text-[10px] text-slate-300 uppercase italic">{emp.statusChangeDate || emp.joiningDate}</td>
                <td className="p-4 text-right font-black text-slate-900 text-base">₹{emp.basicSalary.toLocaleString()}</td>
                <td className="p-4 text-center">
                   <div className="flex gap-1 justify-center">
                      <button onClick={() => onEdit(emp)} className="bg-slate-900 text-white px-5 py-2 rounded-lg font-black text-[9px] uppercase hover:bg-blue-600 transition-all shadow-md">Edit</button>
                      <button onClick={() => {if(confirm("Confirm Registry Removal?")) onDelete(emp.id)}} className="bg-slate-50 text-red-400 px-5 py-2 rounded-lg font-black text-[9px] uppercase hover:bg-red-600 hover:text-white transition-all">Del</button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-6 text-center text-[9px] font-black text-slate-300 uppercase tracking-[2em]">Personnel Audit Registry v4.2 Security Protocol: High</p>
    </div>
  );
};

export default DatabaseView;
