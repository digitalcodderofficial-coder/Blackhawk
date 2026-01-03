
import React, { useState } from 'react';
import { Employee, Transaction, SalaryRecord, CompanyProfile } from '../types';

interface Props {
  employees: Employee[];
  transactions: Transaction[];
  salaries: SalaryRecord[];
  company: CompanyProfile;
  onBack: () => void;
}

const EmployeeBalanceSummary: React.FC<Props> = ({ employees, transactions, salaries, company, onBack }) => {
  const [filter, setFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  
  const filtered = employees.filter(e => {
    if (filter === 'All') return true;
    return e.status === filter;
  });

  const getStats = (empId: string) => {
    const empTxs = transactions.filter(t => t.employeeId === empId);
    const empSalaries = salaries.filter(s => s.employeeId === empId);
    
    const totalSalary = empSalaries.reduce((s, rec) => s + (rec.paidAmount || 0), 0);
    const totalPaid = empTxs.reduce((s, t) => s + t.amount, 0);
    const openingBalance = 0; // Placeholder for future logic
    
    return {
      total: totalSalary,
      paid: totalPaid,
      balance: totalSalary - totalPaid + openingBalance
    };
  };

  const totals = filtered.reduce((acc, e) => {
    const stats = getStats(e.id);
    acc.total += stats.total;
    acc.paid += stats.paid;
    acc.balance += stats.balance;
    return acc;
  }, { total: 0, paid: 0, balance: 0 });

  return (
    <div className="bg-[#f8fafc] p-2 md:p-8 min-h-screen font-sans">
      {/* Control Panel (No-Print) */}
      <div className="max-w-[1400px] mx-auto no-print mb-8">
        <div className="bg-[#0f172a] text-white p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 border-b-8 border-blue-600">
           <div className="flex items-center gap-4">
              <button onClick={onBack} className="bg-white text-slate-900 w-12 h-12 rounded-full flex items-center justify-center hover:bg-blue-50 transition-all shadow-xl active:scale-95">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
              </button>
              <div>
                 <h2 className="text-3xl font-black italic uppercase tracking-tighter">Financial Balance Audit</h2>
                 <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mt-1">Personnel Disbursement Registry</p>
              </div>
           </div>
           
           <div className="flex gap-3">
              <div className="bg-slate-800 p-1 rounded-xl flex border border-slate-700 shadow-inner">
                {['All', 'Active', 'Inactive'].map(f => (
                  <button 
                    key={f} 
                    onClick={() => setFilter(f as any)} 
                    className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${filter === f ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <button onClick={() => window.print()} className="bg-green-600 text-white px-10 py-3 rounded-xl font-black uppercase text-xs shadow-2xl hover:bg-green-700 transition-all active:translate-y-1 border-b-4 border-green-900">Generate Master PDF</button>
           </div>
        </div>

        {/* Real-time Dashboard Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
           {[
             { label: "Total Payable", value: `₹${totals.total.toLocaleString()}`, color: "blue" },
             { label: "Total Disbursed", value: `₹${totals.paid.toLocaleString()}`, color: "green" },
             { label: "Outstanding Amt", value: `₹${totals.balance.toLocaleString()}`, color: "red" },
             { label: "Sync Records", value: filtered.length, color: "slate" }
           ].map((stat, i) => (
             <div key={i} className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-xl">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">{stat.label}</span>
                <div className={`text-2xl font-black text-${stat.color}-600`}>{stat.value}</div>
             </div>
           ))}
        </div>
      </div>

      {/* PRINTABLE AREA */}
      <div id="printable-area" className="max-w-[1400px] mx-auto bg-white p-12 border-[10px] border-slate-900 shadow-2xl print:border-black print:p-8 print:m-0 print:w-full">
         <div className="flex justify-between items-start border-b-[6px] border-slate-900 pb-8 mb-10 relative">
            <div className="flex-1">
               <div className="flex items-center gap-6 mb-4">
                  {company.logo && <img src={company.logo} className="w-20 h-20 object-contain no-print-black-white" alt="Org Logo" />}
                  <div>
                     <h1 className="text-5xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">{company.name}</h1>
                     <p className="text-[11px] font-black uppercase tracking-[0.5em] text-blue-600 mt-2 italic no-print-blue">Consolidated Balance Audit Ledger</p>
                  </div>
               </div>
               <p className="text-[12px] font-bold uppercase text-slate-500 max-w-2xl">{company.address}</p>
            </div>
            <div className="text-right flex flex-col items-end">
               <div className="border-4 border-slate-900 p-4 mb-4 text-center min-w-[200px] bg-slate-50">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Report Generated On</p>
                  <p className="text-lg font-black text-slate-900">{new Date().toLocaleDateString('en-GB', {day:'2-digit', month:'long', year:'numeric'})}</p>
               </div>
               <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">MASTER ENGINE v4.2 PRO Edition</p>
            </div>
         </div>

         <div className="bg-slate-900 text-white text-center py-3 mb-10 shadow-lg print:bg-black">
            <h3 className="text-xl font-black uppercase tracking-[0.4em]">Service Personnel Financial Audit : Session 2025-26</h3>
         </div>

         <div className="overflow-x-auto print:overflow-visible">
            <table className="w-full border-collapse border-4 border-slate-900 text-[9.5px] font-black uppercase table-fixed min-w-[1100px] print:min-w-0 print:w-full">
               <thead className="bg-slate-50 print:bg-white">
                  <tr>
                     <th className="border-2 border-slate-900 p-3 w-[40px] text-center">SL</th>
                     <th className="border-2 border-slate-900 p-3 w-[90px] text-center">STAFF ID</th>
                     <th className="border-2 border-slate-900 p-3 w-[180px] text-left">EMPLOYEE NAME</th>
                     <th className="border-2 border-slate-900 p-3 w-[120px] text-left">DESIGNATION</th>
                     <th className="border-2 border-slate-900 p-3 w-[100px] text-center">JOINING</th>
                     <th className="border-2 border-slate-900 p-3 w-[80px] text-center">STATUS</th>
                     <th className="border-2 border-slate-900 p-3 w-[90px] text-right">OPE. BAL</th>
                     <th className="border-2 border-slate-900 p-3 w-[110px] text-right">TOT SALARY</th>
                     <th className="border-2 border-slate-900 p-3 w-[110px] text-right">PAID AMT</th>
                     <th className="border-2 border-slate-900 p-3 w-[110px] text-right bg-slate-100 print:bg-white">OUTSTANDING</th>
                  </tr>
               </thead>
               <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={10} className="p-20 text-center text-slate-200 font-black text-4xl italic uppercase opacity-20 tracking-tighter">Audit Registry Empty</td></tr>
                  ) : filtered.map((e, idx) => {
                     const stats = getStats(e.id);
                     return (
                        <tr key={e.id} className="hover:bg-slate-50 transition-all border-b border-slate-200 h-11 print:border-black">
                           <td className="border border-slate-300 p-2 text-center text-slate-400 print:text-black">{idx + 1}</td>
                           <td className="border border-slate-300 p-2 text-center text-blue-700 font-black print:text-black">{e.id}</td>
                           <td className="border border-slate-300 p-2 text-left font-black text-slate-900 italic underline decoration-blue-100 decoration-4 underline-offset-4 print:no-underline">{e.name}</td>
                           <td className="border border-slate-300 p-2 text-left text-slate-500 print:text-black">{e.designation}</td>
                           <td className="border border-slate-300 p-2 text-center text-slate-400 print:text-black">{e.joiningDate}</td>
                           <td className="border border-slate-300 p-2 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[8px] font-black ${e.status === 'Active' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'} print:text-black print:bg-white print:border print:border-black`}>{e.status}</span>
                           </td>
                           <td className="border border-slate-300 p-2 text-right">₹0.00</td>
                           <td className="border border-slate-300 p-2 text-right">₹{stats.total.toLocaleString()}</td>
                           <td className="border border-slate-300 p-2 text-right text-green-700 print:text-black">₹{stats.paid.toLocaleString()}</td>
                           <td className={`border border-slate-300 p-2 text-right font-black bg-slate-50 print:bg-white ${stats.balance > 0 ? 'text-red-600' : 'text-slate-900'} print:text-black`}>₹{stats.balance.toLocaleString()}</td>
                        </tr>
                     );
                  })}
                  {/* Empty rows for layout stability in print */}
                  {Array.from({ length: Math.max(0, 10 - filtered.length) }).map((_, i) => (
                    <tr key={`fill-${i}`} className="h-11 border-b border-slate-100 print:border-black">
                       <td colSpan={10} className="border border-slate-100 p-2">&nbsp;</td>
                    </tr>
                  ))}
               </tbody>
               <tfoot className="bg-slate-900 text-white font-black text-[12px] print:bg-black">
                  <tr className="h-14">
                     <td colSpan={7} className="p-4 text-right border-2 border-slate-900 print:border-black tracking-widest">GRAND AUDIT TOTALS</td>
                     <td className="p-2 text-right border-2 border-slate-900 print:border-black">₹{totals.total.toLocaleString()}</td>
                     <td className="p-2 text-right border-2 border-slate-900 print:border-black text-green-400 print:text-white">₹{totals.paid.toLocaleString()}</td>
                     <td className="p-2 text-right border-2 border-slate-900 print:border-black text-blue-400 print:text-white bg-slate-800 print:bg-black">₹{totals.balance.toLocaleString()}</td>
                  </tr>
               </tfoot>
            </table>
         </div>

         <div className="mt-32 flex justify-between items-end border-t-8 border-slate-900 pt-10 px-8">
            <div className="text-center w-80">
               <div className="h-0.5 bg-slate-900 mb-4"></div>
               <p className="text-[12px] font-black uppercase tracking-widest text-slate-900">Personnel Audit Signature</p>
               <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase italic">(Verified By Authorized Unit)</p>
            </div>
            <div className="w-44 h-44 border-4 border-dashed border-slate-100 rounded-full flex flex-col items-center justify-center opacity-20 rotate-12 print:opacity-30 print:border-black">
               <span className="text-[10px] font-black text-slate-400 uppercase leading-none text-center">OFFICIAL<br/>EMS<br/>AUDIT SEAL</span>
            </div>
            <div className="text-center w-80">
               <div className="h-0.5 bg-slate-900 mb-4"></div>
               <p className="text-[12px] font-black uppercase tracking-widest text-slate-900">Executive Authority Signature</p>
               <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase italic">FOR {company.name}</p>
            </div>
         </div>

         <div className="mt-32 text-center opacity-10 flex flex-col items-center print:opacity-30">
            <p className="text-[10px] font-black uppercase tracking-[3em] text-black">MASTER BALANCE AUDIT v4.2 PRO</p>
            <p className="text-[8px] font-bold mt-2 text-black">SYSTEM ARCHITECTURE BY ADITYA KUMAR RAI</p>
         </div>
      </div>

      <style>{`
        @media print {
           @page { size: landscape; margin: 5mm; }
           .no-print { display: none !important; }
           body { background: white !important; padding: 0 !important; margin: 0 !important; }
           #printable-area { 
             border: 6px solid black !important; 
             box-shadow: none !important; 
             margin: 0 !important; 
             width: 100% !important; 
             padding: 40px !important;
             transform: scale(0.98);
             transform-origin: top left;
           }
           .no-print-black-white { filter: grayscale(100%) contrast(200%); }
           .no-print-blue { color: black !important; border-bottom: none !important; }
           * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
           table { border-collapse: collapse !important; border: 3px solid black !important; }
           th, td { border: 1px solid black !important; color: black !important; }
           tr { page-break-inside: avoid !important; }
        }
      `}</style>
    </div>
  );
};

export default EmployeeBalanceSummary;
