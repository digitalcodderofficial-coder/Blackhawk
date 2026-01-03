import React, { useState, useEffect } from 'react';
import { Employee, Transaction, SalaryRecord, CompanyProfile } from '../types';

interface Props {
  employees: Employee[];
  transactions: Transaction[];
  salaries: SalaryRecord[];
  company: CompanyProfile;
  onAddTransaction: (tx: Transaction) => void;
  onUpdateEmployee: (emp: Employee) => void;
  onBack: () => void;
}

const MONTHS = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'];
// Fix: Use TitleCase values that match the Transaction mode type
const PAYMENT_MODES = ['Cash', 'Bank', 'Cheque', 'PhonePe', 'GPay', 'Paytm', 'UPI'];
// Fix: Use TitleCase values that match the Transaction type type
const PAYMENT_TYPES = ['Salary', 'Advance', 'Dues', 'PF'];

const EmployeePaymentStatus: React.FC<Props> = ({ employees, transactions, salaries, company, onAddTransaction, onUpdateEmployee, onBack }) => {
  const [searchId, setSearchId] = useState('');
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  // Fix: Corrected initial state to use proper enum cases
  const [form, setForm] = useState<Partial<Transaction>>({
    date: new Date().toISOString().split('T')[0],
    year: new Date().getFullYear(),
    month: 'April',
    type: 'Salary',
    mode: 'Cash',
    amount: 0,
    voucherNo: '',
    referenceId: ''
  });

  const handleSearch = () => {
    const found = employees.find(e => e.id.toLowerCase() === searchId.toLowerCase());
    if (found) {
      setSelectedEmp(found);
    } else {
      alert("Employee ID not found in registry.");
    }
  };

  const handleReset = () => {
    setSearchId('');
    setSelectedEmp(null);
    // Fix: Corrected reset state to use proper enum cases
    setForm({
      date: new Date().toISOString().split('T')[0],
      year: new Date().getFullYear(),
      month: 'April',
      type: 'Salary',
      mode: 'Cash',
      amount: 0,
      voucherNo: '',
      referenceId: ''
    });
  };

  const handlePayment = () => {
    if (!selectedEmp) {
      alert("Please search and load an employee first.");
      return;
    }
    if (!form.amount || !form.voucherNo) {
      alert("Voucher Number and Amount are required.");
      return;
    }
    const newTx: Transaction = {
      id: Date.now().toString(),
      employeeId: selectedEmp.id,
      date: form.date || '',
      voucherNo: form.voucherNo || '',
      type: form.type as any,
      mode: form.mode as any,
      amount: Number(form.amount) || 0,
      month: form.month || 'April',
      year: form.year || 2025,
      referenceId: form.referenceId
    };
    onAddTransaction(newTx);
    alert("Record Saved Successfully!");
  };

  const getMonthlyStats = (month: string) => {
    if (!selectedEmp) return { total: 0, paid: 0, balance: 0 };
    const salRec = salaries.find(s => s.employeeId === selectedEmp.id && s.month === month);
    const txs = transactions.filter(t => t.employeeId === selectedEmp.id && t.month === month);
    const base = salRec?.paidAmount || selectedEmp.basicSalary || 0;
    const paid = txs.reduce((sum, t) => sum + t.amount, 0);
    return { total: base, paid, balance: base - paid };
  };

  // Fixed: default PF to 0 if no employee selected
  const currentPF = selectedEmp ? salaries.filter(s => s.employeeId === selectedEmp.id).reduce((s, rec) => s + (rec.pf || 0), 0) : 0.00;

  const totalRow = MONTHS.reduce((acc, m) => {
    const stats = getMonthlyStats(m);
    acc.total += stats.total;
    acc.paid += stats.paid;
    acc.balance += stats.balance;
    return acc;
  }, { total: 0, paid: 0, balance: 0 });

  return (
    <div className="bg-[#a0a0a0] p-2 md:p-8 min-h-screen font-sans print:bg-white print:p-0">
      <div className="max-w-[1250px] mx-auto bg-[#e5e7eb] border-[8px] border-[#c0c0c0] p-6 shadow-[inset_0_0_60px_rgba(0,0,0,0.1),0_30px_60px_rgba(0,0,0,0.3)] relative print:border-none print:shadow-none print:w-full">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 no-print gap-4">
          <div className="flex items-center gap-2 border-2 border-slate-600 p-1.5 bg-slate-200 shadow-md">
            <label className="text-[10px] font-black uppercase px-2 text-slate-800">SEARCH EMPLOYEE ID</label>
            <input 
              type="text" 
              className="border border-slate-400 bg-white text-black px-3 py-1.5 text-sm font-black w-40 uppercase outline-none focus:ring-2 focus:ring-blue-500"
              value={searchId}
              onChange={e => setSearchId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleReset} className="bg-slate-300 border border-slate-500 px-4 py-1.5 text-[10px] font-bold uppercase hover:bg-slate-400 text-slate-800 shadow-sm transition-colors">RESET</button>
            <button onClick={handleSearch} className="bg-slate-400 border border-slate-500 px-5 py-1.5 text-[10px] font-black uppercase hover:bg-slate-500 text-white shadow-sm transition-colors">SEARCH</button>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-black italic text-slate-800 drop-shadow-[1px_1px_1px_rgba(255,255,255,0.8)] uppercase tracking-tight">Employee Payment Status</h2>
          
          {/* Home Button Fixed Visibility */}
          <button 
            onClick={onBack} 
            className="w-12 h-12 border-[3px] border-slate-700 rounded-full flex items-center justify-center bg-white hover:bg-slate-100 shadow-lg text-slate-800 transition-all active:scale-90 z-20"
            title="Go to Home"
          >
             <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
               <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
             </svg>
          </button>
        </div>

        {/* Print Only Header */}
        <div className="hidden print:block text-center border-b-2 border-black pb-4 mb-8">
           <h1 className="text-3xl font-black uppercase">{company.name}</h1>
           <p className="text-xs font-bold">{company.address} | Contact: {company.contact}</p>
           <h2 className="text-xl font-black uppercase mt-4 underline">Annual Salary Payment Ledger</h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-8">
           {/* Left Sidebar Profile */}
           <div className="w-full lg:w-[280px] bg-[#fdfdfd] border-2 border-slate-300 shadow-xl p-4 flex flex-col items-center">
              <div className="w-44 h-48 bg-white border-2 border-slate-200 p-1 shadow-inner mb-4 flex items-center justify-center overflow-hidden">
                 {selectedEmp?.photo ? (
                   <img src={selectedEmp.photo} className="w-full h-full object-cover" alt="Staff" />
                 ) : (
                   <div className="text-slate-200 flex flex-col items-center">
                      <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/></svg>
                   </div>
                 )}
              </div>
              <div className="w-full bg-[#6b7280] py-2.5 text-center text-white font-black text-sm uppercase mb-1 shadow-md">
                 {selectedEmp?.name || "EMPLOYEE NAME"}
              </div>
              <p className="text-[11px] font-black text-slate-500 uppercase mb-8 border-b border-slate-200 pb-1">{selectedEmp?.designation || "DESIGNATION"}</p>

              <div className="w-full space-y-4 px-2 text-[10px] font-bold uppercase text-slate-700">
                 <div className="flex items-center gap-3 bg-white p-2.5 border border-slate-200 shadow-sm">
                    <div className="bg-slate-700 text-white p-1.5 rounded-md"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg></div>
                    <span className="text-black">{selectedEmp?.contact || "0000000000"}</span>
                 </div>
                 <div className="flex items-center gap-3 bg-white p-2.5 border border-slate-200 shadow-sm">
                    <div className="bg-slate-700 text-white p-1.5 rounded-md"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg></div>
                    <span className="text-black lowercase truncate">{selectedEmp?.email || "email@gmail.com"}</span>
                 </div>
                 <div className="flex items-start gap-3 bg-white p-2.5 border border-slate-200 shadow-sm min-h-[60px]">
                    <div className="bg-slate-700 text-white p-1.5 rounded-md mt-0.5"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"/></svg></div>
                    <span className="text-black leading-tight text-[9px] uppercase">{selectedEmp?.address || "DEMO COLONY, CITY, STATE"}</span>
                 </div>
              </div>
           </div>

           {/* Form Section */}
           <div className="flex-grow bg-[#f8fafc] border-2 border-slate-300 shadow-xl p-8 rounded-sm">
              <h3 className="text-2xl font-black text-center text-slate-800 uppercase mb-8 tracking-tighter border-b-2 border-slate-200 pb-3 italic">Salary Payment Form</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5 px-4 mb-8">
                 {[
                   { label: "Payment Date", key: "date", type: "date" },
                   { label: "Payment Year", key: "year", type: "number" },
                   { label: "Voucher Number", key: "voucherNo", type: "text" },
                   { label: "Payment Mode", key: "mode", type: "select", options: PAYMENT_MODES },
                   { label: "Payment Type", key: "type", type: "select", options: PAYMENT_TYPES },
                   { label: "Cheque/Tra. ID", key: "referenceId", type: "text" },
                   { label: "Payment Month", key: "month", type: "select", options: MONTHS },
                   { label: "Amount", key: "amount", type: "number" },
                 ].map(f => (
                   <div key={f.label} className="flex items-center gap-3">
                      <span className="text-[11px] font-black text-slate-700 min-w-[120px] uppercase tracking-tighter">• {f.label}</span>
                      {f.type === 'select' ? (
                        <select className="flex-1 bg-white border-2 border-slate-200 p-2 text-xs font-black outline-none uppercase text-black focus:border-blue-500 shadow-sm" value={(form as any)[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})}>
                           {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input 
                           type={f.type} 
                           className="flex-1 bg-white border-2 border-slate-200 p-2 text-xs font-black outline-none uppercase text-black focus:border-blue-500 shadow-sm" 
                           value={(form as any)[f.key]} 
                           onChange={e => setForm({...form, [f.key]: f.type === 'number' ? e.target.value : e.target.value})} 
                        />
                      )}
                   </div>
                 ))}
              </div>

              {/* Action Buttons Section */}
              <div className="flex flex-wrap justify-center gap-1.5 no-print bg-slate-100 p-4 border border-slate-200 mb-6">
                 <button onClick={handlePayment} className="bg-slate-300 border-2 border-slate-400 px-6 py-2.5 text-[11px] font-black uppercase hover:bg-slate-400 active:bg-slate-500 shadow-sm transition-colors text-slate-800">Payment</button>
                 <button onClick={handleReset} className="bg-slate-300 border-2 border-slate-400 px-6 py-2.5 text-[11px] font-black uppercase hover:bg-slate-400 shadow-sm transition-colors text-slate-800">Reset</button>
                 <button onClick={handleSearch} className="bg-slate-300 border-2 border-slate-400 px-6 py-2.5 text-[11px] font-black uppercase hover:bg-slate-400 shadow-sm transition-colors text-slate-800">Search</button>
                 <button className="bg-slate-200 border-2 border-slate-300 px-6 py-2.5 text-[11px] font-black uppercase hover:bg-slate-300 shadow-sm transition-colors text-slate-500 cursor-not-allowed">Update</button>
                 <button className="bg-slate-200 border-2 border-slate-300 px-6 py-2.5 text-[11px] font-black uppercase hover:bg-slate-300 shadow-sm transition-colors text-slate-500 cursor-not-allowed">Delete</button>
                 <button className="bg-slate-300 border-2 border-slate-400 px-6 py-2.5 text-[11px] font-black uppercase hover:bg-slate-400 shadow-sm transition-colors text-slate-800">Record</button>
                 <button onClick={() => window.print()} className="bg-slate-400 border-2 border-slate-500 px-6 py-2.5 text-[11px] font-black uppercase hover:bg-slate-500 text-white shadow-md transition-all">Statement</button>
              </div>

              <p className="mb-6 text-[10px] font-black text-slate-500 italic text-center no-print">Payment Check करने के लिए Voucher Number दर्ज कर Search Button पर क्लिक करें</p>

              <div className="bg-[#eef2f6] border-2 border-slate-300 p-4 flex items-center justify-between shadow-inner rounded-md">
                 <span className="text-xs font-black text-slate-600 uppercase tracking-widest">PF Amount History -</span>
                 <span className="text-lg font-black text-blue-800">Rs. {currentPF.toFixed(2)}</span>
              </div>
           </div>
        </div>

        {/* Salary Status Table */}
        <div className="bg-white border-2 border-slate-300 p-6 shadow-xl overflow-x-auto print:overflow-visible print:border-none print:shadow-none mb-10">
           <h4 className="text-[14px] font-black italic text-slate-900 uppercase mb-5 tracking-tighter border-l-8 border-slate-800 pl-4">SALARY STATUS :</h4>
           <table className="w-full border-collapse border border-slate-500 text-[10px] font-black uppercase table-fixed min-w-[900px] print:min-w-0 print:w-full print:table-fixed">
              <thead>
                 <tr className="bg-[#4b5563] text-white">
                    <th className="border border-slate-500 p-3 w-32">MONTH</th>
                    {MONTHS.map(m => <th key={m} className="border border-slate-500 p-2">{m.slice(0,3)}</th>)}
                    <th className="border border-slate-500 p-3 w-28">TOTAL</th>
                 </tr>
              </thead>
              <tbody className="text-slate-900 text-center">
                 <tr className="bg-[#f9fafb]">
                    <td className="border border-slate-500 p-3 text-left bg-slate-100 font-black">TARGET SALARY</td>
                    {MONTHS.map(m => <td key={m} className="border border-slate-500 p-2">₹{getMonthlyStats(m).total.toLocaleString()}</td>)}
                    <td className="border border-slate-500 p-3 bg-slate-100 font-black">₹{totalRow.total.toLocaleString()}</td>
                 </tr>
                 <tr className="bg-white">
                    <td className="border border-slate-500 p-3 text-left bg-slate-100 font-black">PAID</td>
                    {MONTHS.map(m => <td key={m} className="border border-slate-500 p-2 text-green-700">₹{getMonthlyStats(m).paid.toLocaleString()}</td>)}
                    <td className="border border-slate-500 p-3 bg-slate-100 text-green-700 font-black">₹{totalRow.paid.toLocaleString()}</td>
                 </tr>
                 <tr className="bg-[#f9fafb]">
                    <td className="border border-slate-500 p-3 text-left bg-slate-100 font-black">OUTSTANDING</td>
                    {MONTHS.map(m => {
                      const bal = getMonthlyStats(m).balance;
                      return (
                        <td key={m} className={`border border-slate-500 p-2 font-black ${bal > 0 ? 'text-red-600' : 'text-slate-900'}`}>
                           ₹{bal.toLocaleString()}
                        </td>
                      );
                    })}
                    <td className="border border-slate-500 p-3 bg-slate-100 text-red-600 font-black text-sm">₹{totalRow.balance.toLocaleString()}</td>
                 </tr>
              </tbody>
           </table>
        </div>

        {/* Organisation Signature and Stamp Area */}
        <div className="flex justify-between items-end mt-24 px-12 mb-10 print:mt-32">
           <div className="text-center w-72">
              <div className="h-[2px] bg-black mb-4 w-full"></div>
              <p className="text-[12px] font-black uppercase tracking-widest text-black">Employee Signature</p>
           </div>
           
           <div className="w-48 h-48 border-4 border-dashed border-slate-400 rounded-full flex flex-col items-center justify-center opacity-40 rotate-12 print:opacity-60">
              <span className="text-[11px] font-black text-center leading-none text-slate-800">OFFICIAL<br/>EMS<br/>STAMP</span>
           </div>
           
           <div className="text-center w-72">
              <div className="h-[2px] bg-black mb-4 w-full"></div>
              <p className="text-[12px] font-black uppercase tracking-widest text-black">Authorized Signatory</p>
              <p className="text-[9px] font-bold mt-1 uppercase italic text-slate-500">FOR {company.name}</p>
           </div>
        </div>

        <div className="mt-8 text-center text-[10px] font-black text-slate-400 uppercase tracking-[1.5em] italic no-print border-t border-slate-300 pt-6">
          ENGINEERED BY ADITYA KUMAR RAI | EMS CORE v4.2 PRO
        </div>
      </div>

      <style>{`
        @media print {
          @page { 
            size: landscape; 
            margin: 5mm; 
          }
          .no-print { display: none !important; }
          body { 
            background: white !important; 
            margin: 0 !important; 
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .max-w-[1250px] { 
            width: 100% !important; 
            max-width: none !important; 
            border: 2px solid black !important; 
            box-shadow: none !important; 
            padding: 10px !important;
            transform: scale(0.85);
            transform-origin: top center;
          }
          table { 
            width: 100% !important; 
            border: 1px solid black !important; 
            table-layout: fixed !important; 
            font-size: 8px !important; 
          }
          th { 
            background: #f0f0f0 !important; 
            color: black !important; 
            border: 1px solid black !important; 
          }
          td { 
            border: 1px solid black !important; 
            color: black !important; 
            background: white !important;
          }
          tr { page-break-inside: avoid !important; }
          h1, h2, h3, h4, p, span { color: black !important; }
        }
      `}</style>
    </div>
  );
};

export default EmployeePaymentStatus;