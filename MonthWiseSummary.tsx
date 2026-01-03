
import React, { useState } from 'react';
import { Employee, AttendanceRecord, SalaryRecord, Transaction, CompanyProfile } from '../types';

interface Props {
  employees: Employee[];
  attendance: AttendanceRecord[];
  salaries: SalaryRecord[];
  transactions: Transaction[];
  company: CompanyProfile;
  onBack: () => void;
}

const MONTHS = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'];

const MonthWiseSummary: React.FC<Props> = ({ employees, attendance, salaries, transactions, company, onBack }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const getMonthlyData = (month: string) => {
    // 1. Workforce Strength
    const activeStaff = employees.filter(e => e.status === 'Active').length;
    
    // 2. Attendance Aggregates
    const monthAttendance = attendance.filter(a => a.month === month && a.year === selectedYear);
    let totalP = 0, totalA = 0, totalHD = 0;
    monthAttendance.forEach(rec => {
      Object.values(rec.days).forEach(s => {
        if (s === 'P') totalP++;
        if (s === 'A') totalA++;
        if (s === 'HD') totalHD++;
      });
    });

    // 3. Financial Aggregates
    const monthSalaries = salaries.filter(s => s.month === month && s.year === selectedYear);
    const totalGross = monthSalaries.reduce((sum, s) => sum + (s.paidAmount || 0), 0);
    
    const monthTransactions = transactions.filter(t => t.month === month && t.year === selectedYear);
    const totalPaid = monthTransactions.reduce((sum, t) => sum + t.amount, 0);

    return {
      activeStaff,
      totalP,
      totalA,
      totalHD,
      totalGross,
      totalPaid,
      balance: totalGross - totalPaid
    };
  };

  const totals = MONTHS.reduce((acc, m) => {
    const data = getMonthlyData(m);
    acc.p += data.totalP;
    acc.a += data.totalA;
    acc.gross += data.totalGross;
    acc.paid += data.totalPaid;
    acc.bal += data.balance;
    return acc;
  }, { p: 0, a: 0, gross: 0, paid: 0, bal: 0 });

  return (
    <div className="bg-white p-2 md:p-8 min-h-screen font-sans animate-in fade-in duration-500">
      {/* Control Bar */}
      <div className="max-w-7xl mx-auto no-print mb-8">
        <div className="bg-[#0f172a] text-white p-6 rounded-3xl shadow-2xl flex justify-between items-center border-b-8 border-blue-600">
           <div className="flex items-center gap-4">
              <button onClick={onBack} className="bg-white text-slate-900 w-12 h-12 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-90">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
              </button>
              <div>
                 <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none">Command Summary Ledger</h2>
                 <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.5em] mt-1">Month-Wise Performance Metrics</p>
              </div>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="bg-slate-800 p-1.5 rounded-2xl flex border border-slate-700 shadow-inner">
                 <button onClick={() => setSelectedYear(selectedYear - 1)} className="px-4 text-slate-400 hover:text-white font-black">«</button>
                 <span className="px-6 py-1.5 bg-blue-600 text-white rounded-xl font-black text-sm shadow-md">{selectedYear}</span>
                 <button onClick={() => setSelectedYear(selectedYear + 1)} className="px-4 text-slate-400 hover:text-white font-black">»</button>
              </div>
              <button onClick={() => window.print()} className="bg-green-600 text-white px-10 py-3.5 rounded-2xl font-black uppercase text-xs shadow-xl hover:bg-green-700 transition-all border-b-4 border-green-900">Print Summary</button>
           </div>
        </div>

        {/* Executive Dashboard Widgets */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
           {[
             { label: "Annual Personnel Presence", value: `${totals.p} Days`, color: "blue", icon: "👤" },
             { label: "Annual Gross Liability", value: `₹${totals.gross.toLocaleString()}`, color: "slate", icon: "💰" },
             { label: "Annual Disbursed Funds", value: `₹${totals.paid.toLocaleString()}`, color: "green", icon: "✓" },
             { label: "Net Outstanding Deficit", value: `₹${totals.bal.toLocaleString()}`, color: "red", icon: "⚠️" }
           ].map((widget, i) => (
             <div key={i} className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-xl flex items-center gap-5 hover:scale-105 transition-transform">
                <div className={`w-14 h-14 rounded-2xl bg-${widget.color}-50 flex items-center justify-center text-2xl shadow-inner border border-${widget.color}-100`}>
                   {widget.icon}
                </div>
                <div>
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">{widget.label}</span>
                   <div className={`text-xl font-black text-${widget.color}-600 leading-none`}>{widget.value}</div>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Main Ledger Area */}
      <div id="printable-area" className="max-w-7xl mx-auto bg-white p-12 border-[10px] border-slate-900 shadow-2xl print:border-black print:p-5 print:shadow-none print:m-0 print:w-full">
         
         <div className="flex justify-between items-start border-b-[6px] border-slate-900 pb-8 mb-10">
            <div className="flex-1">
               <div className="flex items-center gap-6 mb-4">
                  {company.logo && <img src={company.logo} className="w-20 h-20 object-contain" alt="Logo" />}
                  <div>
                     <h1 className="text-5xl font-black uppercase italic tracking-tighter text-slate-950 leading-none">{company.name}</h1>
                     <p className="text-[11px] font-black uppercase tracking-[0.5em] text-blue-600 mt-2 italic">Executive Month-Wise Summary Report</p>
                  </div>
               </div>
               <p className="text-[12px] font-bold uppercase text-slate-500 max-w-xl">{company.address}</p>
            </div>
            <div className="text-right flex flex-col items-end">
               <div className="bg-slate-900 text-white px-6 py-3 font-black uppercase text-base mb-2 tracking-[0.2em] shadow-lg print:bg-black">
                  AUDIT SESSION: {selectedYear}
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Report Gen: {new Date().toLocaleDateString('en-GB')}</p>
            </div>
         </div>

         <div className="overflow-x-auto print:overflow-visible">
            <table className="w-full border-collapse border-4 border-slate-900 text-[10px] font-black uppercase table-fixed min-w-[1000px] print:min-w-0 print:w-full">
               <thead>
                  <tr className="bg-slate-900 text-white print:bg-black">
                     <th className="border-2 border-slate-800 p-4 w-[50px] text-center">SL</th>
                     <th className="border-2 border-slate-800 p-4 w-[120px] text-left">MONTH PERIOD</th>
                     <th className="border-2 border-slate-800 p-4 w-[100px] text-center bg-slate-800">FORCE STRENGTH</th>
                     <th className="border-2 border-slate-800 p-4 w-[100px] text-center text-green-400">PRESENTS (P)</th>
                     <th className="border-2 border-slate-800 p-4 w-[100px] text-center text-red-400">ABSENTS (A)</th>
                     <th className="border-2 border-slate-800 p-4 w-[130px] text-right">GROSS PAYABLE</th>
                     <th className="border-2 border-slate-800 p-4 w-[130px] text-right text-green-400">PAID AMOUNT</th>
                     <th className="border-2 border-slate-800 p-4 w-[130px] text-right bg-blue-900 text-white">OUTSTANDING</th>
                  </tr>
               </thead>
               <tbody>
                  {MONTHS.map((m, idx) => {
                     const data = getMonthlyData(m);
                     const isFuture = (new Date().getFullYear() === selectedYear && MONTHS.indexOf(m) > (new Date().getMonth() + 8) % 12);
                     
                     return (
                        <tr key={m} className={`h-14 hover:bg-slate-50 border-b border-slate-200 transition-colors ${isFuture ? 'opacity-30' : ''}`}>
                           <td className="border border-slate-300 p-4 text-center text-slate-400">{idx + 1}</td>
                           <td className="border border-slate-300 p-4 text-left font-black text-slate-950 italic underline decoration-blue-100 decoration-4 underline-offset-4">{m} {selectedYear}</td>
                           <td className="border border-slate-300 p-4 text-center font-black bg-slate-50">{data.activeStaff} UNIT</td>
                           <td className="border border-slate-300 p-4 text-center text-green-700">{data.totalP}</td>
                           <td className="border border-slate-300 p-4 text-center text-red-700">{data.totalA}</td>
                           <td className="border border-slate-300 p-4 text-right">₹{data.totalGross.toLocaleString()}</td>
                           <td className="border border-slate-300 p-4 text-right text-green-700">₹{data.totalPaid.toLocaleString()}</td>
                           <td className={`border border-slate-300 p-4 text-right font-black ${data.balance > 0 ? 'text-red-600 bg-red-50' : 'text-slate-900 bg-slate-50'}`}>
                              ₹{data.balance.toLocaleString()}
                           </td>
                        </tr>
                     );
                  })}
               </tbody>
               <tfoot className="bg-slate-900 text-white font-black text-[12px] print:bg-black">
                  <tr className="h-16">
                     <td colSpan={3} className="p-4 text-right border-2 border-slate-900 tracking-widest uppercase italic">Consolidated Annual Audit Totals</td>
                     <td className="p-4 text-center border-2 border-slate-900 text-green-400">{totals.p}</td>
                     <td className="p-4 text-center border-2 border-slate-900 text-red-400">{totals.a}</td>
                     <td className="p-4 text-right border-2 border-slate-900">₹{totals.gross.toLocaleString()}</td>
                     <td className="p-4 text-right border-2 border-slate-900 text-green-400">₹{totals.paid.toLocaleString()}</td>
                     <td className="p-4 text-right border-2 border-slate-900 bg-blue-900">₹{totals.bal.toLocaleString()}</td>
                  </tr>
               </tfoot>
            </table>
         </div>

         <div className="mt-32 flex justify-between items-end border-t-8 border-slate-950 pt-10">
            <div className="text-center w-72">
               <div className="h-0.5 bg-slate-900 mb-4 shadow-sm"></div>
               <p className="text-[12px] font-black uppercase tracking-widest text-slate-900">Accountant / Internal Auditor</p>
               <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase italic">(Verified Transactional Integrity)</p>
            </div>
            
            <div className="w-40 h-40 border-4 border-dashed border-slate-200 rounded-full flex flex-col items-center justify-center opacity-20 rotate-12 print:opacity-40">
               <span className="text-[10px] font-black text-slate-400 uppercase leading-none text-center">OFFICIAL<br/>EMS<br/>AUDIT SEAL</span>
            </div>

            <div className="text-center w-72">
               <div className="h-0.5 bg-slate-900 mb-4 shadow-sm"></div>
               <p className="text-[12px] font-black uppercase tracking-widest text-slate-900 tracking-tighter">Managing Director Signatory</p>
               <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase italic">FOR {company.name}</p>
            </div>
         </div>

         <div className="mt-40 text-center opacity-10 flex flex-col items-center no-print-black-white">
            <p className="text-[11px] font-black uppercase tracking-[3em] text-black">MASTER SUMMARY ENGINE v5.2 PRO</p>
            <p className="text-[8px] font-bold mt-2 text-black uppercase tracking-widest italic border-t pt-4">Engineering & Architecture by Aditya Kumar Rai</p>
         </div>
      </div>

      <style>{`
        @media print {
           .no-print { display: none !important; }
           body { background: white !important; padding: 0 !important; margin: 0 !important; }
           #printable-area { 
             border: 6px solid black !important; 
             box-shadow: none !important; 
             margin: 0 !important; 
             width: 100% !important; 
             padding: 20px !important;
             transform: scale(0.92);
             transform-origin: top center;
           }
           * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
           table { border-collapse: collapse !important; border: 3px solid black !important; }
           th, td { border: 1px solid black !important; color: black !important; }
           tr { page-break-inside: avoid !important; }
        }
      `}</style>
    </div>
  );
};

export default MonthWiseSummary;
