
import React, { useState } from 'react';
import { Transaction, Employee } from '../types';

interface Props {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  employees: Employee[];
  onBack: () => void;
}

const PaymentLedger: React.FC<Props> = ({ transactions, setTransactions, employees, onBack }) => {
  const [newTx, setNewTx] = useState<Partial<Transaction>>({
    date: new Date().toISOString().split('T')[0],
    voucherNo: `V-${Date.now().toString().slice(-6)}`,
    type: 'Salary',
    mode: 'Cash',
    amount: 0,
    month: 'April',
    year: 2025
  });

  const saveTx = () => {
    if (!newTx.employeeId || !newTx.amount) {
      alert("Please select employee and enter amount.");
      return;
    }
    const tx: Transaction = {
      ...newTx as Transaction,
      id: Date.now().toString()
    };
    setTransactions([tx, ...transactions]);
    alert("Payment Record Stored Successfully!");
    setNewTx({...newTx, amount: 0, voucherNo: `V-${Date.now().toString().slice(-6)}`});
  };

  const totalDisbursed = transactions.reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="bg-[#f1f5f9] p-4 md:p-8 border-4 border-slate-400 rounded shadow-2xl max-w-7xl mx-auto min-h-[900px]">
      <div className="bg-[#0f172a] p-8 rounded-xl mb-10 flex justify-between items-center border-b-8 border-blue-600 shadow-xl">
         <div>
            <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter">Finance & Payment Hub</h2>
            <p className="text-[11px] font-black text-blue-400 uppercase mt-2 tracking-[0.5em]">Consolidated Financial Architecture | Aditya Rai</p>
         </div>
         <button onClick={onBack} className="bg-white text-slate-900 px-12 py-3 rounded-full font-black uppercase text-xs shadow-2xl hover:bg-blue-600 hover:text-white transition-all scale-105 active:scale-95">Main Menu</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
         <div className="bg-white p-6 border-b-8 border-blue-600 shadow-xl rounded-xl">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Total Paid</span>
            <div className="text-3xl font-black text-slate-900">₹{totalDisbursed.toLocaleString()}</div>
         </div>
         <div className="bg-white p-6 border-b-8 border-green-600 shadow-xl rounded-xl">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Transactions</span>
            <div className="text-3xl font-black text-slate-900">{transactions.length}</div>
         </div>
         <div className="bg-white p-6 border-b-8 border-orange-600 shadow-xl rounded-xl">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Cash Flow</span>
            <div className="text-3xl font-black text-slate-900">100% SECURE</div>
         </div>
         <div className="bg-white p-6 border-b-8 border-purple-600 shadow-xl rounded-xl">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Current Month</span>
            <div className="text-3xl font-black text-slate-900">APRIL 2025</div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Entry Form */}
        <div className="lg:col-span-1 bg-white p-8 rounded-3xl border-4 border-slate-100 shadow-2xl space-y-6">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-10 bg-blue-600"></div>
              <h3 className="text-2xl font-black uppercase italic text-slate-900 tracking-tight">Record Voucher</h3>
           </div>
           
           <div className="space-y-4">
              <div>
                 <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Target Employee</label>
                 <select className="w-full p-4 rounded-2xl border-2 border-slate-200 font-black text-slate-900" value={newTx.employeeId} onChange={(e)=>setNewTx({...newTx, employeeId: e.target.value})}>
                    <option value="">-- SELECT STAFF MEMBER --</option>
                    {employees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.id})</option>)}
                 </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Voucher #</label>
                    <input type="text" className="w-full p-4 rounded-2xl border-2 border-slate-200 font-black" value={newTx.voucherNo} readOnly />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Amount (₹)</label>
                    <input type="number" className="w-full p-4 rounded-2xl border-2 border-slate-300 font-black text-blue-600 text-xl shadow-inner focus:border-blue-500 outline-none" value={newTx.amount} onChange={(e)=>setNewTx({...newTx, amount: Number(e.target.value)})} />
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Mode</label>
                    <select className="w-full p-4 rounded-2xl border-2 border-slate-200 font-black" value={newTx.mode} onChange={(e)=>setNewTx({...newTx, mode: e.target.value as any})}>
                       <option value="Cash">Cash</option>
                       <option value="Bank">Transfer</option>
                       <option value="PhonePe">PhonePe</option>
                       <option value="UPI">UPI</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Type</label>
                    <select className="w-full p-4 rounded-2xl border-2 border-slate-200 font-black" value={newTx.type} onChange={(e)=>setNewTx({...newTx, type: e.target.value as any})}>
                       <option value="Salary">Salary</option>
                       <option value="Advance">Advance</option>
                       <option value="Dues">Dues</option>
                    </select>
                 </div>
              </div>
           </div>
           <button onClick={saveTx} className="w-full bg-[#1e293b] text-white p-6 rounded-3xl font-black uppercase text-lg shadow-2xl hover:bg-blue-600 transition-all border-b-[10px] border-slate-900 active:translate-y-2 active:border-b-0">Generate Transaction</button>
        </div>

        {/* Recent Ledger */}
        <div className="lg:col-span-2 bg-white rounded-3xl border-4 border-slate-100 shadow-2xl p-8 overflow-hidden flex flex-col">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black uppercase italic text-slate-900">Transaction History</h3>
              <button onClick={() => window.print()} className="bg-slate-100 px-6 py-2 rounded-full text-[10px] font-black uppercase text-slate-500 hover:bg-slate-200">Export PDF</button>
           </div>
           <div className="overflow-auto flex-grow custom-scrollbar pr-2">
              <table className="w-full text-left border-collapse text-[12px]">
                 <thead>
                    <tr className="bg-slate-50 font-black uppercase tracking-widest text-slate-400 border-b-2 border-slate-100">
                       <th className="p-4">Voucher</th>
                       <th className="p-4">Staff Details</th>
                       <th className="p-4">Mode</th>
                       <th className="p-4 text-right">Credit (₹)</th>
                    </tr>
                 </thead>
                 <tbody>
                    {transactions.length === 0 ? (
                      <tr><td colSpan={4} className="p-20 text-center font-black text-slate-300 uppercase italic">Ledger Empty</td></tr>
                    ) : transactions.map(t => (
                      <tr key={t.id} className="border-b font-black hover:bg-slate-50 transition-all h-[65px]">
                         <td className="p-4 text-blue-600 tracking-tighter">{t.voucherNo}</td>
                         <td className="p-4 uppercase">
                            <div className="text-slate-900">{t.employeeId}</div>
                            <div className="text-[10px] text-slate-400">{t.type}</div>
                         </td>
                         <td className="p-4">
                            <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase">{t.mode}</span>
                         </td>
                         <td className="p-4 text-right font-black text-green-600 text-lg">₹{t.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentLedger;
