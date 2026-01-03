import React, { useState } from 'react';
import { Employee, CompanyProfile } from '../types';

interface QuotationFormProps {
  employees: Employee[];
  company: CompanyProfile;
  onBack: () => void;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const QuotationForm: React.FC<QuotationFormProps> = ({ employees, company, onBack }) => {
  const [searchId, setSearchId] = useState('');
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  
  // Local editable state for quotation
  const [quoteData, setQuoteData] = useState({
    orgName: company.name,
    orgAddress: company.address,
    empSalary: 0,
    empName: '',
    empRole: '',
    quotationNo: `QT-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split('T')[0],
    selectedMonth: MONTHS[new Date().getMonth()]
  });

  const handleSearch = () => {
    const found = employees.find(e => e.id.toLowerCase() === searchId.toLowerCase());
    if (found) {
      setSelectedEmp(found);
      setQuoteData(prev => ({
        ...prev,
        empSalary: found.basicSalary,
        empName: found.name,
        empRole: found.designation
      }));
    } else {
      alert("Employee ID not found. Please verify the ID.");
    }
  };

  // Professional Quotation Logic
  const baseSalary = quoteData.empSalary;
  const esi = Number((baseSalary * 0.0325).toFixed(2));
  const pf = Number((baseSalary * 0.13).toFixed(2)); // PF at 13%
  const relieverCharge = Number((baseSalary * (1/6)).toFixed(2)); // Reliever/Off-day factor (1/6th)
  
  const subtotal = Number((baseSalary + esi + pf + relieverCharge).toFixed(2));
  const gst = Number((subtotal * 0.18).toFixed(2));
  const grandTotal = Number((subtotal + gst).toFixed(2));

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);
  };

  return (
    <div className="bg-[#f3f4f6] min-h-screen p-4 md:p-8 animate-in fade-in duration-500">
      {/* Control Panel - HIDDEN DURING PRINT */}
      <div className="max-w-6xl mx-auto mb-8 no-print">
        <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 border-b-[10px] border-blue-600">
          <div className="flex items-center gap-6">
            <button onClick={onBack} className="bg-white text-slate-900 w-14 h-14 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95 group">
               <svg className="w-8 h-8 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            </button>
            <div>
               <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white leading-none">Quotation Hub</h2>
               <p className="text-[11px] font-black text-blue-400 uppercase tracking-[0.5em] mt-1">Enterprise Billing Engine v5.2 PRO</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="bg-slate-800 p-2 rounded-2xl flex border-2 border-slate-700 shadow-inner">
              <input 
                type="text" 
                placeholder="SEARCH STAFF ID..." 
                className="bg-transparent text-white px-5 py-2 text-sm font-black uppercase outline-none w-48 placeholder:text-slate-600"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button onClick={handleSearch} className="bg-blue-600 text-white px-8 py-2 rounded-xl text-[11px] font-black uppercase shadow-lg hover:bg-blue-700 transition-all active:translate-y-0.5">LOAD DATA</button>
            </div>
            <button onClick={() => window.print()} className="bg-green-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs shadow-2xl hover:bg-green-700 transition-all border-b-4 border-green-900 flex items-center gap-2">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
               Generate Invoice
            </button>
          </div>
        </div>

        {/* Editor Settings - HIDDEN DURING PRINT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
           <div className="bg-white p-8 rounded-[2.5rem] border-4 border-slate-200 shadow-2xl space-y-6">
              <div className="flex items-center gap-3 border-b pb-4">
                 <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                 <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Pricing Configuration</h3>
              </div>
              <div className="space-y-5">
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase block mb-1.5 ml-1">Organization Branding</label>
                    <input 
                      type="text" 
                      className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl font-black text-base text-slate-900 outline-none focus:border-blue-500 shadow-inner uppercase" 
                      value={quoteData.orgName} 
                      onChange={e => setQuoteData({...quoteData, orgName: e.target.value})}
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase block mb-1.5 ml-1">Base Salary (Monthly)</label>
                      <input 
                        type="number" 
                        className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl font-black text-2xl text-blue-600 outline-none focus:border-blue-500 shadow-inner" 
                        value={quoteData.empSalary} 
                        onChange={e => setQuoteData({...quoteData, empSalary: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase block mb-1.5 ml-1">Quotation Period</label>
                      <select 
                        className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl font-black text-sm text-slate-900 outline-none focus:border-blue-500 appearance-none"
                        value={quoteData.selectedMonth}
                        onChange={e => setQuoteData({...quoteData, selectedMonth: e.target.value})}
                      >
                        {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                 </div>
                 <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 space-y-2">
                    <p className="text-[11px] font-black text-blue-800 uppercase tracking-tighter leading-none italic">• Standard 26 Working Days + 4 Weekly Offs</p>
                    <p className="text-[11px] font-black text-blue-800 uppercase tracking-tighter leading-none italic">• PF Component: 13.00% (Employer Contribution)</p>
                    <p className="text-[11px] font-black text-blue-800 uppercase tracking-tighter leading-none italic">• Reliever Factor: 1/6th Charge Applied</p>
                 </div>
              </div>
           </div>
           
           <div className="bg-slate-900 p-10 rounded-[2.5rem] border-4 border-slate-800 shadow-2xl flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16"></div>
              <div className="flex justify-between items-center text-white mb-6 border-b-2 border-slate-800 pb-4">
                 <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Calculation Console</span>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] text-green-400 font-black uppercase tracking-widest">System Online</span>
                 </div>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between text-slate-300 text-sm font-bold uppercase">
                    <span>Base Salary (26D):</span>
                    <span>{formatCurrency(baseSalary)}</span>
                 </div>
                 <div className="flex justify-between text-slate-300 text-sm font-bold uppercase">
                    <span>Reliever/Weekly Off (1/6):</span>
                    <span>{formatCurrency(relieverCharge)}</span>
                 </div>
                 <div className="flex justify-between text-slate-300 text-sm font-bold uppercase">
                    <span>ESI (3.25%):</span>
                    <span>{formatCurrency(esi)}</span>
                 </div>
                 <div className="flex justify-between text-orange-400 text-lg font-black uppercase border-y border-slate-800 py-3">
                    <span>PF Contribution (13.00%):</span>
                    <span className="text-2xl">{formatCurrency(pf)}</span>
                 </div>
                 <div className="flex justify-between text-slate-300 text-sm font-bold uppercase">
                    <span>GST (18.00%):</span>
                    <span className="text-blue-400 font-black">{formatCurrency(gst)}</span>
                 </div>
                 <div className="flex justify-between text-white text-4xl font-black uppercase border-t-[4px] border-blue-600 pt-6 mt-4">
                    <span className="italic tracking-tighter">Grand Total:</span>
                    <span className="text-blue-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">{formatCurrency(grandTotal)}</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* DOCUMENT PREVIEW - PRINTABLE AREA */}
      <div id="printable-area" className="max-w-[1000px] mx-auto bg-white p-14 md:p-20 border-[20px] border-slate-950 shadow-2xl print:border-black print:p-10 print:shadow-none min-h-[1400px] flex flex-col relative overflow-hidden">
         
         {/* Background Watermark */}
         <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center rotate-45 select-none z-0">
            <h1 className="text-[140px] font-black">{quoteData.orgName}</h1>
         </div>

         {/* Document Header */}
         <div className="flex justify-between items-start border-b-[12px] border-slate-900 pb-12 mb-14 relative z-10">
            <div className="flex-1">
               <div className="flex items-center gap-10 mb-8">
                  {company.logo ? (
                     <img src={company.logo} className="w-36 h-36 object-contain shadow-lg border-2 border-slate-50 p-2" alt="Org Logo" />
                  ) : (
                     <div className="w-36 h-36 bg-slate-900 text-white flex items-center justify-center font-black text-6xl rounded-sm">Q</div>
                  )}
                  <div>
                     <h1 className="text-7xl font-black uppercase italic tracking-tighter text-slate-950 leading-none">{quoteData.orgName}</h1>
                     <p className="text-[16px] font-black uppercase tracking-[0.6em] text-blue-700 mt-4 italic border-l-[12px] border-blue-600 pl-6">MASTER SERVICE QUOTATION</p>
                  </div>
               </div>
               <p className="text-[14px] font-bold uppercase text-slate-700 max-w-2xl leading-relaxed italic">{quoteData.orgAddress}</p>
            </div>
            <div className="text-right flex flex-col items-end">
               <div className="bg-slate-950 text-white px-10 py-5 font-black uppercase text-xl mb-6 tracking-[0.2em] shadow-2xl print:bg-black">
                  INVOICE # {quoteData.quotationNo}
               </div>
               <p className="text-[13px] font-black text-slate-400 uppercase tracking-widest">Document Issued: <span className="text-black ml-2 font-black">{new Date(quoteData.date).toLocaleDateString('en-GB')}</span></p>
               <p className="text-[13px] font-black text-blue-700 uppercase mt-2 tracking-[0.2em]">Billing Cycle: {quoteData.selectedMonth} {new Date().getFullYear()}</p>
            </div>
         </div>

         {/* Client Info Block */}
         <div className="bg-slate-50 border-y-[8px] border-slate-950 p-10 mb-20 flex justify-between items-center italic relative z-10 shadow-inner">
            <div>
               <span className="text-[12px] font-black text-slate-400 uppercase block mb-3 tracking-[0.3em] border-b pb-1">Attention To (Representative):</span>
               <h3 className="text-4xl font-black uppercase text-slate-950 underline decoration-8 decoration-blue-100 underline-offset-12">{quoteData.empName || "SELECT RECIPIENT"}</h3>
               <p className="text-base font-black text-slate-600 uppercase mt-6 tracking-[0.4em]">{quoteData.empRole || "CONSULTANCY SERVICE"}</p>
            </div>
            <div className="text-right border-l-[6px] border-slate-200 pl-12">
               <span className="text-[12px] font-black text-slate-400 uppercase block mb-2 tracking-[0.3em]">Identity Reference</span>
               <h4 className="text-4xl font-black text-blue-950 tracking-[0.1em]">{selectedEmp?.id || "REG-0000"}</h4>
            </div>
         </div>

         <div className="flex-grow relative z-10">
            <div className="flex items-center gap-6 mb-12 border-b-[8px] border-slate-950 pb-4">
                <div className="w-12 h-12 bg-slate-950 text-white flex items-center justify-center font-black text-xl italic">A</div>
                <h2 className="text-3xl font-black uppercase tracking-[0.4em] italic text-slate-900">Commercial Service Ledger</h2>
            </div>
            
            <table className="w-full border-collapse border-[8px] border-slate-950 text-[16px] font-black uppercase shadow-[20px_20px_0px_#f1f5f9]">
               <thead>
                  <tr className="bg-slate-950 text-white print:bg-black">
                     <th className="border-[4px] border-white/20 p-8 text-left w-[55%] tracking-[0.2em]">Detailed Service Particulars</th>
                     <th className="border-[4px] border-white/20 p-8 text-right tracking-[0.2em]">Unit Multiplier</th>
                     <th className="border-[4px] border-white/20 p-8 text-right bg-slate-800 print:bg-slate-700 tracking-[0.2em]">Amount (₹)</th>
                  </tr>
               </thead>
               <tbody>
                  <tr className="border-b-[4px] border-slate-200 h-28 hover:bg-slate-50 transition-colors">
                     <td className="p-8 border-r-[4px] border-slate-100">
                        Personnel Professional Remuneration
                        <p className="text-[11px] text-slate-400 mt-3 font-black italic italic leading-none opacity-80">(Standard Duty: 26 Working Days Cycle)</p>
                     </td>
                     <td className="p-8 text-right border-r-[4px] border-slate-100 font-black italic text-slate-400 opacity-60">1 Unit (26D)</td>
                     <td className="p-8 text-right font-black text-slate-950 text-3xl">₹{baseSalary.toLocaleString()}</td>
                  </tr>
                  <tr className="border-b-[4px] border-slate-200 h-28 bg-slate-50/30 hover:bg-slate-50">
                     <td className="p-8 border-r-[4px] border-slate-100">
                        Weekly Off Component / Reliever Charge
                        <p className="text-[11px] text-blue-600 mt-3 font-black leading-none opacity-80">(Mandatory 4 Weekly Offs Coverage Factor)</p>
                     </td>
                     <td className="p-8 text-right border-r-[4px] border-slate-100 font-black italic text-slate-400 opacity-60">1/6 Factor</td>
                     <td className="p-8 text-right font-black text-slate-950 text-3xl">₹{relieverCharge.toLocaleString()}</td>
                  </tr>
                  <tr className="border-b-[4px] border-slate-200 h-28 hover:bg-slate-50">
                     <td className="p-8 border-r-[4px] border-slate-100">
                        Employee State Insurance (ESI Contribution)
                        <p className="text-[11px] text-slate-400 mt-3 font-black leading-none opacity-80">(Statutory Medical Levy @ 3.25%)</p>
                     </td>
                     <td className="p-8 text-right border-r-[4px] border-slate-100 font-black italic text-slate-400 opacity-60">3.25% Unit</td>
                     <td className="p-8 text-right font-black text-slate-950 text-3xl">₹{esi.toLocaleString()}</td>
                  </tr>
                  <tr className="border-b-[10px] border-slate-950 h-32 bg-orange-50/20 hover:bg-orange-50 transition-colors">
                     <td className="p-8 border-r-[4px] border-slate-100">
                        <span className="text-orange-950">Provident Fund (Employer Contribution)</span>
                        <p className="text-[12px] text-orange-600 mt-3 font-black leading-none italic underline decoration-2 decoration-orange-200 underline-offset-4">(Mandatory PF Settlement @ 13.00%)</p>
                     </td>
                     <td className="p-8 text-right border-r-[4px] border-slate-100 font-black italic text-orange-900 opacity-60 text-xl">13.00% MAX</td>
                     <td className="p-8 text-right font-black text-orange-700 text-5xl drop-shadow-sm">₹{pf.toLocaleString()}</td>
                  </tr>
                  <tr className="bg-slate-50">
                     <td className="p-8 border-r-[4px] border-slate-100">&nbsp;</td>
                     <td className="p-8 text-right border-r-[4px] border-slate-100 font-black text-slate-400 text-xl tracking-[0.2em]">Net Subtotal:</td>
                     <td className="p-8 text-right font-black text-slate-950 text-4xl border-t-[6px] border-slate-950">₹{subtotal.toLocaleString()}</td>
                  </tr>
                  <tr className="bg-slate-50/60 border-b-[6px] border-slate-950/20 h-28">
                     <td className="p-8 border-r-[4px] border-slate-100">
                        Goods & Services Tax (GST Levy)
                        <p className="text-[11px] text-blue-600 mt-3 font-black leading-none opacity-80">(Applicable Indirect Tax Regulation @ 18.00%)</p>
                     </td>
                     <td className="p-8 text-right border-r-[4px] border-slate-100 font-black italic text-slate-400 opacity-60">18.00% RATE</td>
                     <td className="p-8 text-right font-black text-slate-950 text-3xl">₹{gst.toLocaleString()}</td>
                  </tr>
               </tbody>
               <tfoot className="bg-slate-950 text-white print:bg-black">
                  <tr>
                     <td colSpan={2} className="p-10 text-right text-4xl font-black tracking-[0.6em] uppercase italic border-r-[4px] border-white/20 underline decoration-white/20 underline-offset-8">Final Quoted Total</td>
                     <td className="p-10 text-right text-7xl font-black bg-blue-600 print:text-white shadow-[inset_0_0_50px_rgba(0,0,0,0.3)] tracking-tighter">₹{grandTotal.toLocaleString()}</td>
                  </tr>
               </tfoot>
            </table>

            <div className="mt-20 space-y-8 bg-slate-50 p-8 border-l-[15px] border-blue-600 shadow-md">
               <h4 className="text-[14px] font-black uppercase text-slate-950 tracking-[0.6em] border-b-[4px] border-slate-950 pb-3 inline-block italic">Terms of Engagement & Compliance</h4>
               <ul className="text-[15px] font-bold text-slate-700 uppercase list-disc ml-8 space-y-3 leading-relaxed">
                  <li>This invoice covers <span className="text-slate-950 font-black">26 Standard Duty Days</span> plus <span className="text-slate-950 font-black">4 Paid Weekly Offs</span> for the month of {quoteData.selectedMonth}.</li>
                  <li>A RELIEVER FACTOR of <span className="text-blue-700 font-black underline decoration-4 underline-offset-4">1/6th of Base Salary</span> is applied to ensure 100% operation continuity during off-days.</li>
                  <li>Mandatory PF Contribution is calculated precisely at 13.00% as per current HR policy.</li>
                  <li>Payment must be disbursed within <span className="text-red-700 font-black">7 Working Days</span> of receiving this commercial instrument.</li>
                  <li>This document is system-generated and verified for arithmetic accuracy. Official stamp required.</li>
               </ul>
            </div>
         </div>

         {/* Bottom Area */}
         <div className="mt-48 flex justify-between items-end border-t-[12px] border-slate-950 pt-16 relative z-10">
            <div className="text-center w-96">
               <div className="h-1.5 bg-slate-950 mb-6 shadow-md"></div>
               <p className="text-[16px] font-black uppercase tracking-[0.4em] text-slate-950">Authorized Client Approval</p>
               <p className="text-[11px] font-black text-slate-400 mt-3 uppercase italic tracking-widest">(Official Signature & Identity Stamp)</p>
            </div>
            
            <div className="relative group">
               <div className="w-60 h-60 border-[10px] border-dashed border-slate-300 rounded-full flex flex-col items-center justify-center opacity-30 rotate-12 transition-all hover:scale-110 hover:opacity-60 print:opacity-50">
                  <span className="text-[14px] font-black text-center leading-tight text-slate-800 tracking-[0.4em] uppercase">VERIFIED<br/>CORPORATE<br/>COMMERCIAL<br/>SEAL</span>
                  <div className="w-14 h-14 border-4 border-slate-400 mt-6 rounded-full flex items-center justify-center text-[12px] font-black">PRO</div>
               </div>
            </div>

            <div className="text-center w-96">
               <div className="h-1.5 bg-slate-950 mb-6 shadow-md"></div>
               <p className="text-[16px] font-black uppercase tracking-[0.4em] text-slate-950 tracking-tighter">Managing Director / signatory</p>
               <p className="text-[11px] font-black text-blue-600 mt-3 uppercase italic tracking-[0.4em]">ADMINISTRATION UNIT - {quoteData.orgName}</p>
            </div>
         </div>
         
         <div className="mt-40 text-center opacity-10 flex flex-col items-center">
            <p className="text-[14px] font-black uppercase tracking-[4em] text-black">MASTER CORE QUOTATION ENGINE v5.2 PRO</p>
            <div className="flex gap-10 mt-6 font-bold text-xs uppercase tracking-widest italic border-t pt-4">
                <span>Architecture by Aditya Rai</span>
                <span>•</span>
                <span>Security Level: Enterprise Grade</span>
            </div>
         </div>
      </div>

      <style>{`
        @media print {
           .no-print { display: none !important; }
           body { background: white !important; margin: 0 !important; }
           #printable-area { 
             border: 10px solid black !important; 
             box-shadow: none !important; 
             margin: 0 !important; 
             width: 100% !important; 
             padding: 40px !important;
             transform: scale(0.88);
             transform-origin: top center;
           }
           * { -webkit-print-color-adjust: exact !important; }
           .absolute { position: absolute !important; }
        }
        .animate-spin-slow {
           animation: spin 25s linear infinite;
        }
        @keyframes spin {
           from { transform: translate(-50%, -50%) rotate(0deg); }
           to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default QuotationForm;
