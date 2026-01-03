
import React, { useState } from 'react';
import { Employee, CompanyProfile, AttendanceRecord, SalaryRecord, Transaction } from '../types';

interface Props {
  employees: Employee[];
  company: CompanyProfile;
  attendance: AttendanceRecord[];
  salaries: SalaryRecord[];
  transactions: Transaction[];
  onBack: () => void;
}

const EmployeeSummary: React.FC<Props> = ({ employees, company, attendance, salaries, transactions, onBack }) => {
  const [searchId, setSearchId] = useState('');
  const [emp, setEmp] = useState<Employee | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [printConfig, setPrintConfig] = useState({
    personal: true,
    attendance: true,
    financial: true,
    photo: true,
    statusHistory: true
  });

  const handleSearch = () => {
    setHasSearched(true);
    const found = employees.find(e => e.id.toLowerCase() === searchId.toLowerCase());
    if (found) {
      setEmp(found);
    } else {
      alert("Employee ID Not Found in registry.");
      setEmp(null);
    }
  };

  const getAttendanceSummary = () => {
    if (!emp) return [];
    return attendance.filter(a => a.employeeId === emp.id).sort((a,b) => b.year !== a.year ? b.year - a.year : b.month.localeCompare(a.month));
  };

  const getPaymentHistory = () => {
    if (!emp) return [];
    return transactions.filter(t => t.employeeId === emp.id).sort((a,b) => b.date.localeCompare(a.date));
  };

  return (
    <div className="bg-[#f1f5f9] p-2 md:p-8 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto no-print animate-in slide-in-from-top duration-500">
         <div className="bg-[#0f172a] text-white p-8 rounded-3xl shadow-2xl mb-8 flex flex-col md:flex-row justify-between items-center gap-6 border-b-[10px] border-blue-600">
            <div>
               <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none">Comprehensive Profile Auditor</h2>
               <p className="text-[11px] font-black text-blue-400 uppercase tracking-[0.4em] mt-2">Verified Personnel Data & Financial Summary</p>
            </div>
            <button onClick={onBack} className="bg-white text-slate-900 px-10 py-3 rounded-full font-black uppercase text-xs shadow-xl hover:bg-blue-50 transition-all active:scale-95 border-b-4 border-slate-200">Back to Dashboard</button>
         </div>

         <div className="bg-white p-10 rounded-[3rem] border-4 border-slate-200 shadow-2xl space-y-10 mb-12">
            <div className="flex flex-col md:flex-row gap-8 items-end bg-slate-50 p-8 rounded-2xl border-2 border-slate-100">
               <div className="flex-1">
                  <label className="block text-[11px] font-black text-slate-500 uppercase mb-3 tracking-widest">Search Employee Profile (ID Required)</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      className="w-full p-5 bg-white border-4 border-slate-200 rounded-2xl font-black text-xl text-slate-900 outline-none focus:border-blue-600 shadow-inner uppercase pl-14"
                      placeholder="ENTER STAFF ID..."
                      value={searchId}
                      onChange={(e) => setSearchId(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
                  </div>
               </div>
               <button onClick={handleSearch} className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black uppercase text-sm shadow-xl hover:bg-blue-700 transition-all active:translate-y-1 border-b-8 border-blue-900">Fetch Audit Data</button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
               {Object.keys(printConfig).map((key) => (
                 <label key={key} className={`flex items-center justify-between p-5 rounded-2xl border-4 cursor-pointer transition-all ${(printConfig as any)[key] ? 'bg-blue-600 border-blue-800 text-white shadow-lg scale-105' : 'bg-white border-slate-100 text-slate-400 opacity-60 hover:border-blue-200'}`}>
                    <span className="text-[10px] font-black uppercase tracking-widest">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={(printConfig as any)[key]} 
                      onChange={() => setPrintConfig({...printConfig, [key]: !(printConfig as any)[key]})}
                    />
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${(printConfig as any)[key] ? 'bg-white text-blue-600' : 'bg-slate-100 text-slate-100'}`}>✓</div>
                 </label>
               ))}
            </div>

            <button 
              onClick={() => window.print()} 
              disabled={!emp}
              className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black uppercase text-xl shadow-2xl hover:bg-black disabled:opacity-30 border-b-8 border-blue-600 active:translate-y-2 transition-all flex items-center justify-center gap-4"
            >
              <span>🖨️</span> GENERATE AUDIT REPORT FOR {emp?.name || '...'}
            </button>
         </div>
      </div>

      {!emp && hasSearched && (
         <div className="max-w-4xl mx-auto p-20 text-center no-print animate-bounce">
            <h3 className="text-4xl font-black text-slate-200 uppercase">Registry Entry Not Found</h3>
         </div>
      )}

      {emp && (
        <div id="printable-area" className="max-w-[1000px] mx-auto bg-white p-16 border-[12px] border-slate-900 shadow-2xl print:border-black print:p-10 animate-in zoom-in duration-300">
           {/* Header */}
           <div className="flex justify-between items-start border-b-[8px] border-slate-900 pb-10 mb-12 relative">
              <div className="flex-1">
                 <div className="flex items-center gap-6 mb-4">
                    {company.logo && <img src={company.logo} className="w-24 h-24 object-contain" alt="Org Logo" />}
                    <div>
                       <h1 className="text-6xl font-black uppercase italic tracking-tighter text-slate-950 leading-none">{company.name}</h1>
                       <p className="text-[13px] font-black uppercase tracking-[0.6em] text-blue-600 mt-2 italic">Official Personnel Audit Report</p>
                    </div>
                 </div>
                 <p className="text-[12px] font-bold uppercase text-slate-500 max-w-xl">{company.address}</p>
                 <div className="flex gap-10 mt-6 text-[11px] font-black text-slate-900 uppercase bg-slate-50 p-2 inline-block rounded border border-slate-200">
                    <span>REGISTRY: EMS-CORE-v4.2</span>
                    <span className="text-slate-300">|</span>
                    <span>CONTACT: {company.contact}</span>
                    <span className="text-slate-300">|</span>
                    <span>SESSION: {new Date().getFullYear()}</span>
                 </div>
              </div>
              {printConfig.photo && emp.photo && (
                 <div className="w-40 h-52 border-[6px] border-slate-900 p-1 bg-white shadow-[15px_15px_0px_#f1f5f9] relative z-10 rotate-2">
                    <img src={emp.photo} className="w-full h-full object-cover" alt="Profile" />
                    <div className="absolute -bottom-4 -left-4 bg-slate-900 text-white px-4 py-1 font-black text-[10px] uppercase shadow-lg">ID: {emp.id}</div>
                 </div>
              )}
           </div>

           <div className="bg-slate-950 text-white text-center py-4 mb-16 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[size:10px_10px]"></div>
              <h3 className="text-3xl font-black uppercase tracking-[0.5em] relative z-10">Consolidated Audit Summary</h3>
           </div>

           {printConfig.personal && (
             <div className="mb-16">
                <div className="bg-slate-100 p-3 font-black uppercase text-sm mb-6 border-l-[20px] border-slate-950 flex justify-between items-center">
                   <span>I. Professional Credentials Ledger</span>
                   <span className="text-[10px] opacity-40">AUTO-GEN V4.2</span>
                </div>
                <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-sm font-black uppercase">
                   <div className="flex justify-between border-b-2 border-slate-100 pb-2">
                      <span className="text-slate-400">Full Legal Name:</span> 
                      <span className="text-slate-900 italic underline decoration-blue-200 decoration-4 underline-offset-4">{emp.name}</span>
                   </div>
                   <div className="flex justify-between border-b-2 border-slate-100 pb-2">
                      <span className="text-slate-400">System Employee ID:</span> 
                      <span className="text-blue-700 tracking-widest">{emp.id}</span>
                   </div>
                   <div className="flex justify-between border-b-2 border-slate-100 pb-2">
                      <span className="text-slate-400">Current Designation:</span> 
                      <span className="text-slate-900">{emp.designation}</span>
                   </div>
                   <div className="flex justify-between border-b-2 border-slate-100 pb-2">
                      <span className="text-slate-400">Official Joining:</span> 
                      <span className="text-slate-900">{emp.joiningDate}</span>
                   </div>
                   <div className="flex justify-between border-b-2 border-slate-100 pb-2">
                      <span className="text-slate-400">Govt ID (Aadhaar):</span> 
                      <span className="text-slate-900 tracking-tighter">xxxx-xxxx-{emp.aadhaar.slice(-4)}</span>
                   </div>
                   <div className="flex justify-between border-b-2 border-slate-100 pb-2">
                      <span className="text-slate-400">Base Compensation:</span> 
                      <span className="text-green-700">₹{emp.basicSalary.toLocaleString()}</span>
                   </div>
                </div>
             </div>
           )}

           {printConfig.statusHistory && (
             <div className="mb-16">
                <div className="bg-slate-100 p-3 font-black uppercase text-sm mb-6 border-l-[20px] border-slate-950">II. Life Cycle & Status Audit</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className={`p-6 rounded-2xl border-4 flex flex-col items-center justify-center ${emp.status === 'Active' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                      <span className="text-[10px] font-black uppercase text-slate-400 mb-2">Current Service Status</span>
                      <span className={`text-4xl font-black uppercase italic ${emp.status === 'Active' ? 'text-green-700' : 'text-red-700'}`}>{emp.status}</span>
                   </div>
                   <div className="p-6 rounded-2xl bg-slate-50 border-4 border-slate-100 flex flex-col items-center justify-center">
                      <span className="text-[10px] font-black uppercase text-slate-400 mb-2">Last Status Update On</span>
                      <span className="text-2xl font-black text-slate-800">{emp.statusChangeDate || emp.joiningDate}</span>
                   </div>
                </div>
                {emp.status === 'Inactive' && (
                  <div className="mt-6 p-6 bg-red-50 border-2 border-red-100 rounded-xl">
                     <p className="text-[10px] font-black text-red-400 uppercase mb-2">Resignation / Termination Context</p>
                     <p className="text-sm font-bold text-red-900 uppercase italic">REASON: {emp.leavingReason || "NO OFFICIAL REASON RECORDED"}</p>
                     <p className="text-xs font-black text-red-700 mt-2">EXIT DATE: {emp.leavingDate || "N/A"}</p>
                  </div>
                )}
             </div>
           )}

           {printConfig.attendance && (
             <div className="mb-16">
                <div className="bg-slate-100 p-3 font-black uppercase text-sm mb-6 border-l-[20px] border-slate-950">III. Attendance Analytics Ledger</div>
                <table className="w-full border-collapse border-[4px] border-slate-950 text-[11px] font-black uppercase table-fixed">
                   <thead className="bg-slate-900 text-white">
                      <tr>
                         <th className="border-2 border-white/20 p-4">Billing Period</th>
                         <th className="border-2 border-white/20 p-4 text-green-400">Present (P)</th>
                         <th className="border-2 border-white/20 p-4 text-red-400">Absent (A)</th>
                         <th className="border-2 border-white/20 p-4 text-blue-400">Holidays (H)</th>
                         <th className="border-2 border-white/20 p-4 bg-slate-800">Net Factor</th>
                      </tr>
                   </thead>
                   <tbody>
                      {getAttendanceSummary().map((a, i) => {
                         let p=0, ab=0, h=0, hd=0;
                         Object.values(a.days).forEach(v => { if(v==='P')p++; if(v==='A')ab++; if(v==='H'||v==='OFF')h++; if(v==='HD')hd++; });
                         const net = p + (hd * 0.5) + h;
                         return (
                           <tr key={i} className="text-center font-bold h-12 hover:bg-slate-50 border-b border-slate-200">
                              <td className="border border-slate-300 p-2 font-black">{a.month.slice(0,3)} {a.year}</td>
                              <td className="border border-slate-300 p-2 text-green-700">{p}</td>
                              <td className="border border-slate-300 p-2 text-red-700">{ab}</td>
                              <td className="border border-slate-300 p-2 text-blue-700">{h}</td>
                              <td className="border border-slate-300 p-2 font-black bg-slate-50 text-slate-950">{net.toFixed(1)}</td>
                           </tr>
                         );
                      })}
                      {getAttendanceSummary().length === 0 && (
                        <tr><td colSpan={5} className="p-16 text-center opacity-20 italic font-black text-2xl">NO ATTENDANCE LOG FOUND</td></tr>
                      )}
                   </tbody>
                </table>
             </div>
           )}

           {printConfig.financial && (
             <div className="mb-16">
                <div className="bg-slate-100 p-3 font-black uppercase text-sm mb-6 border-l-[20px] border-slate-950">IV. Disbursement & Financial audit</div>
                <table className="w-full border-collapse border-[4px] border-slate-950 text-[11px] font-black uppercase table-fixed">
                   <thead className="bg-slate-900 text-white">
                      <tr>
                         <th className="border-2 border-white/20 p-4 w-[15%]">Txn Date</th>
                         <th className="border-2 border-white/20 p-4 w-[20%]">Voucher #</th>
                         <th className="border-2 border-white/20 p-4">Mode</th>
                         <th className="border-2 border-white/20 p-4">Type</th>
                         <th className="border-2 border-white/20 p-4 text-right">Amount (₹)</th>
                      </tr>
                   </thead>
                   <tbody>
                      {getPaymentHistory().map((t, i) => (
                        <tr key={i} className="h-12 border-b border-slate-200">
                           <td className="border border-slate-300 p-2 text-center text-[10px]">{t.date}</td>
                           <td className="border border-slate-300 p-2 text-center text-blue-700 font-black tracking-tighter">{t.voucherNo}</td>
                           <td className="border border-slate-300 p-2 text-center">{t.mode}</td>
                           <td className="border border-slate-300 p-2 text-center text-slate-500">{t.type}</td>
                           <td className="border border-slate-300 p-2 text-right font-black text-slate-950">₹{t.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                      {getPaymentHistory().length === 0 && (
                        <tr><td colSpan={5} className="p-16 text-center opacity-20 italic font-black text-2xl">NO DISBURSEMENT RECORDS</td></tr>
                      )}
                   </tbody>
                   <tfoot className="bg-slate-100 font-black">
                      <tr>
                         <td colSpan={4} className="p-4 text-right border-4 border-slate-950">Total Disbursed to Date</td>
                         <td className="p-4 text-right text-lg border-4 border-slate-950 text-blue-900">₹{getPaymentHistory().reduce((s,t)=>s+t.amount,0).toLocaleString()}</td>
                      </tr>
                   </tfoot>
                </table>
             </div>
           )}

           <div className="mt-32 flex justify-between items-end border-t-8 border-slate-950 pt-10">
              <div className="text-center w-72">
                 <div className="h-0.5 bg-slate-900 mb-3"></div>
                 <p className="text-[12px] font-black uppercase tracking-widest text-slate-900">Registered Employee Sign</p>
                 <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase italic">(I Accept Audit Veracity)</p>
              </div>
              <div className="w-48 h-48 border-4 border-dashed border-slate-200 rounded-full flex items-center justify-center opacity-30 rotate-12">
                 <span className="text-[10px] font-black text-slate-400 uppercase text-center leading-none">OFFICIAL<br/>SEAL<br/>STAMP</span>
              </div>
              <div className="text-center w-72">
                 <div className="h-0.5 bg-slate-900 mb-3"></div>
                 <p className="text-[12px] font-black uppercase tracking-widest text-slate-900">HR Unit / Management Sign</p>
                 <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase italic">FOR {company.name}</p>
              </div>
           </div>
           
           <div className="mt-40 text-center opacity-10">
              <p className="text-[10px] font-black uppercase tracking-[3em] text-black">MASTER CORE ENGINE v4.2 PRO</p>
              <p className="text-[8px] font-bold mt-2">ADITYA KUMAR RAI ARCHITECTURE</p>
           </div>
        </div>
      )}
      
      <style>{`
        @media print {
           .no-print { display: none !important; }
           body { background: white !important; margin: 0 !important; }
           #printable-area { 
             border: 4px solid black !important; 
             box-shadow: none !important; 
             margin: 0 !important; 
             width: 100% !important; 
             padding: 40px !important;
           }
           * { -webkit-print-color-adjust: exact !important; }
        }
      `}</style>
    </div>
  );
};

export default EmployeeSummary;
