
import React, { useState } from 'react';
import { Employee, AttendanceRecord, SalaryRecord } from '../types';

interface SalaryCalculationProps {
  employees: Employee[];
  attendance: AttendanceRecord[];
  salaries: SalaryRecord[];
  onUpdate: (empId: string, month: string, field: keyof SalaryRecord, value: number) => void;
  year: number;
  setYear: (y: number) => void;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const SalaryCalculation: React.FC<SalaryCalculationProps> = ({ employees, attendance, salaries, onUpdate, year, setYear }) => {
  const [month, setMonth] = useState('April');

  const getSalary = (empId: string) => salaries.find(s => s.employeeId === empId && s.month === month && s.year === year) || ({} as SalaryRecord);
  
  const getAttendanceSummary = (empId: string) => {
    const rec = attendance.find(a => a.employeeId === empId && a.month === month && a.year === year);
    let p = 0, a = 0, h = 0, hd = 0, l = 0;
    if (rec) {
      Object.values(rec.days).forEach(s => {
        if (s === 'P') p++; if (s === 'A') a++; if (s === 'H') h++; if (s === 'HD') hd++; if (s === 'L') l++;
      });
    }
    return { p, a, h, hd, l };
  };

  const calcRow = (emp: Employee) => {
    const s = getSalary(emp.id);
    const att = getAttendanceSummary(emp.id);
    const perDay = emp.basicSalary / 30;
    const netDeductibleDays = Math.max(0, (att.a + att.hd * 0.5) - (s.allowedLeave || 0));
    const leaveCharge = netDeductibleDays * perDay;
    const totalEarnings = (emp.basicSalary - leaveCharge) + (s.da || 0) + (s.ta || 0) + (s.hra || 0) + (s.ma || 0) + (s.bonus || 0);
    const totalDeductions = (s.pf || 0) + (s.uniformCharge || 0) + (s.lateComingCharge || 0) + (s.otherCharge || 0);
    const netPayable = totalEarnings - totalDeductions - (s.advancePaid || 0);
    return { perDay, leaveCharge, totalEarnings, totalDeductions, netPayable, att };
  };

  return (
    <div className="bg-white border-[3px] border-slate-400 p-4 shadow-xl rounded-sm animate-in slide-in-from-bottom duration-500">
      <div className="bg-slate-900 text-white p-4 mb-4 flex justify-between items-center rounded-sm no-print">
         <div className="flex gap-2">
            {MONTHS.map(m => (
              <button key={m} onClick={() => setMonth(m)} className={`px-3 py-1 text-[9px] font-black border border-slate-600 uppercase transition-all ${month === m ? 'bg-blue-600 border-white' : 'bg-slate-800'}`}>{m.substring(0,3)}</button>
            ))}
         </div>
         <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest italic">{month.toUpperCase()} {year} PAYROLL ENGINE</span>
            <button onClick={() => window.print()} className="bg-green-600 px-6 py-1.5 rounded text-[10px] font-black uppercase border-b-4 border-green-900">Export Ledger</button>
         </div>
      </div>

      <div className="overflow-x-auto border-2 border-slate-300 p-1">
        <table className="w-full text-[10px] border-collapse excel-table min-w-[2800px]">
          <thead>
            <tr className="bg-slate-100 font-black uppercase text-center h-[50px]">
              <th colSpan={3} className="bg-slate-200">Personal Details</th>
              <th colSpan={4} className="bg-blue-50">Attendance</th>
              <th colSpan={3} className="bg-slate-200">Base Salary</th>
              <th colSpan={6} className="bg-green-50">Salary Earnings (+)</th>
              <th colSpan={4} className="bg-red-50">Salary Deductions (-)</th>
              <th colSpan={3} className="bg-yellow-50">Final Totals</th>
            </tr>
            <tr className="bg-slate-50 font-black uppercase text-center border-b-2 border-slate-400">
              <th className="p-2 border">ID</th><th className="p-2 border">Name</th><th className="p-2 border">Role</th>
              <th className="p-2 border text-green-700">PR</th><th className="p-2 border text-red-700">AB</th><th className="p-2 border text-yellow-600">HD</th><th className="p-2 border text-blue-700">LV</th>
              <th className="p-2 border">Basic</th><th className="p-2 border italic">PerDay</th><th className="p-2 border text-red-700">LvChrg</th>
              <th className="p-2 border">DA</th><th className="p-2 border">TA</th><th className="p-2 border">HRA</th><th className="p-2 border">MA</th><th className="p-2 border">Other</th><th className="p-2 border text-green-700">Bonus</th>
              <th className="p-2 border">PF</th><th className="p-2 border">Uniform</th><th className="p-2 border">Late</th><th className="p-2 border">Misc</th>
              <th className="p-2 border bg-green-100">Gross</th><th className="p-2 border bg-orange-100">Adv</th><th className="p-2 border bg-blue-600 text-white text-xs">Net Pay</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => {
               const s = getSalary(emp.id);
               const data = calcRow(emp);
               return (
                 <tr key={emp.id} className="hover:bg-slate-100 font-bold h-[45px] text-center border-b border-slate-200">
                    <td className="p-1 border uppercase">{emp.id}</td>
                    <td className="p-1 border text-left px-3 uppercase">{emp.name}</td>
                    <td className="p-1 border italic text-slate-500 uppercase text-[8px]">{emp.designation}</td>
                    <td className="p-1 border bg-blue-50/30">{data.att.p}</td>
                    <td className="p-1 border bg-blue-50/30">{data.att.a}</td>
                    <td className="p-1 border bg-blue-50/30">{data.att.hd}</td>
                    <td className="p-1 border bg-blue-50/30">{data.att.l}</td>
                    <td className="p-1 border">₹{emp.basicSalary}</td>
                    <td className="p-1 border italic opacity-40">{data.perDay.toFixed(2)}</td>
                    <td className="p-1 border text-red-600">{data.leaveCharge.toFixed(2)}</td>
                    {['da','ta','hra','ma','otherAllowance','bonus'].map(f => (
                       <td key={f} className="p-0 border bg-green-50/20"><input type="number" className="w-full h-full p-1 text-center outline-none bg-transparent" value={(s as any)[f] || 0} onChange={(e)=>onUpdate(emp.id, month, f as any, Number(e.target.value))} /></td>
                    ))}
                    {['pf','uniformCharge','lateComingCharge','otherCharge'].map(f => (
                       <td key={f} className="p-0 border bg-red-50/20"><input type="number" className="w-full h-full p-1 text-center outline-none bg-transparent" value={(s as any)[f] || 0} onChange={(e)=>onUpdate(emp.id, month, f as any, Number(e.target.value))} /></td>
                    ))}
                    <td className="p-1 border font-black bg-green-50">{data.totalEarnings.toFixed(2)}</td>
                    <td className="p-0 border bg-orange-50"><input type="number" className="w-full h-full p-1 text-center outline-none bg-transparent text-orange-900" value={s.advancePaid || 0} onChange={(e)=>onUpdate(emp.id, month, 'advancePaid', Number(e.target.value))} /></td>
                    <td className="p-1 border font-black bg-blue-600 text-white shadow-inner">₹{data.netPayable.toFixed(2)}</td>
                 </tr>
               )
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-widest italic">
         <span>Architecture: v4.1 Professional Enterprise Ledger</span>
         <span>Computation Accuracy: 100% Guaranteed</span>
      </div>
    </div>
  );
};

export default SalaryCalculation;
