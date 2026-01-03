
import React, { useState } from 'react';
import { ViewType, Employee, SalaryRecord, Transaction } from '../types';
import * as XLSX from 'xlsx';

interface DashboardProps {
  employees: Employee[];
  salaries: SalaryRecord[];
  transactions: Transaction[];
  setView: (view: ViewType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ employees = [], salaries = [], transactions = [], setView }) => {
  const [isExporting, setIsExporting] = useState(false);

  const row1: { label: string; target: ViewType }[] = [
    { label: "Read Instructions", target: "ReadInstructions" },
    { label: "School Profile", target: "SchoolProfile" },
    { label: "Upload Logo", target: "UploadLogo" },
    { label: "Blank Form", target: "BlankForm" },
    { label: "Add Employee", target: "AddEmployee" },
    { label: "Database", target: "Database" },
    { label: "Application Form", target: "ApplicationForm" },
    { label: "Appointment Letter", target: "AppointmentLetter" },
    { label: "ID Card", target: "IDCard" },
  ];

  const row2: { label: string; target: ViewType }[] = [
    { label: "Employee Balance", target: "EmployeeBalance" },
    { label: "Daily Attendance", target: "DailyAttendance" },
    { label: "Salary Calculation", target: "SalaryCalculation" },
    { label: "Attendance Tracker", target: "AttendanceTracker" },
    { label: "Salary Tracker", target: "SalaryTracker" },
    { label: "PF Calculation", target: "PFCalculation" },
    { label: "Attendance Sheet", target: "AttendanceSheet" },
    { label: "Salary Sheet (Bank)", target: "SalarySheetBank" },
    { label: "Employee Summary", target: "EmployeeSummary" },
  ];

  const row3: { label: string; target: ViewType }[] = [
    { label: "Payment Status", target: "EmployeePaymentStatus" },
    { label: "Payment Record", target: "PaymentRecord" },
    { label: "Search Multiple", target: "SearchMultiple" },
    { label: "Salary Statement", target: "SalaryStatement" },
    { label: "Monthly Payslip", target: "MonthlyPayslip" },
    { label: "Annual Payslip", target: "AnnualPayslip" },
    { label: "Month Wise Summary", target: "MonthWiseSummary" },
    { label: "Job Leaving Details", target: "JobLeavingDetails" },
    { label: "Experience Certificate", target: "ExperienceCertificate" },
  ];

  const row4: { label: string; target: ViewType }[] = [
    { label: "Quotation Hub", target: "QuotationForm" },
    { label: "Master Setting", target: "MasterSetting" },
    { label: "Save & Exit", target: "Dashboard" },
  ];

  const totalSalary = salaries.reduce((acc, s) => acc + (s.paidAmount || 0), 0);
  const totalPF = salaries.reduce((acc, s) => acc + (s.pf || 0), 0);
  const totalPaid = transactions.reduce((acc, t) => acc + (t.amount || 0), 0);
  const totalBalance = totalSalary - totalPaid;
  
  const maleCount = employees.filter(e => e.gender === 'Male').length;
  const femaleCount = employees.filter(e => e.gender === 'Female').length;
  const activeCount = employees.filter(e => e.status === 'Active').length;
  const inactiveCount = employees.filter(e => e.status === 'Inactive').length;

  const exportToExcel = () => {
    setIsExporting(true);
    try {
      const wb = XLSX.utils.book_new();

      // 1. Employees Sheet
      const empData = employees.map(({ photo, ...rest }) => rest);
      const wsEmp = XLSX.utils.json_to_sheet(empData);
      XLSX.utils.book_append_sheet(wb, wsEmp, "FORCE_REGISTRY");

      // 2. Attendance Sheet (Flattened)
      const attendanceData = JSON.parse(localStorage.getItem('attendance_data') || '[]');
      const flatAttendance = attendanceData.flatMap((record: any) => {
        return Object.entries(record.days).map(([day, status]) => ({
          EmployeeID: record.employeeId,
          Month: record.month,
          Year: record.year,
          Day: day,
          Status: status
        }));
      });
      const wsAtt = XLSX.utils.json_to_sheet(flatAttendance);
      XLSX.utils.book_append_sheet(wb, wsAtt, "ATTENDANCE_LOG");

      // 3. Salaries Sheet
      const wsSal = XLSX.utils.json_to_sheet(salaries);
      XLSX.utils.book_append_sheet(wb, wsSal, "PAYROLL_LEDGER");

      // 4. Transactions Sheet
      const wsTrans = XLSX.utils.json_to_sheet(transactions);
      XLSX.utils.book_append_sheet(wb, wsTrans, "FINANCIAL_TRANSACTIONS");

      // Generate file
      const fileName = `Force_Management_Data_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
      
      alert(`Success! Data exported to ${fileName}. You can now link this file to your master Excel sheets.`);
    } catch (error) {
      console.error("Export Error:", error);
      alert("Failed to generate Excel file. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const ButtonGroup = ({ items }: { items: any[] }) => (
    <div className="flex flex-wrap gap-1 justify-center bg-[#cbd5e1] p-1 border border-slate-500">
      {items.map((btn) => (
        <button
          key={btn.label}
          onClick={() => setView(btn.target)}
          className="bg-white border border-slate-400 px-3 py-1.5 text-[9px] font-black text-slate-900 hover:bg-slate-100 min-w-[105px] shadow-sm transition-all active:bg-slate-300 uppercase"
        >
          {btn.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* EXCEL MENU GRID */}
      <div className="bg-[#94a3b8] p-3 border-[4px] border-slate-700 rounded-sm space-y-1 shadow-xl">
        <ButtonGroup items={row1} />
        <ButtonGroup items={row2} />
        <ButtonGroup items={row3} />
        <div className="flex flex-wrap gap-1 justify-between bg-[#cbd5e1] p-1 border border-slate-500">
           <div className="flex gap-1">
             {row4.map(btn => (
               <button 
                 key={btn.label} 
                 onClick={() => setView(btn.target)} 
                 className={`bg-white border border-slate-400 px-6 py-1.5 text-[9px] font-black uppercase shadow-sm ${btn.target === 'QuotationForm' ? 'text-blue-600 border-blue-400 font-black' : 'text-slate-900'} hover:bg-slate-100 min-w-[120px]`}
               >
                 {btn.label}
               </button>
             ))}
           </div>
           
           {/* NEW EXCEL EXPORT BUTTON */}
           <button 
             onClick={exportToExcel}
             disabled={isExporting}
             className="bg-green-700 text-white border-2 border-green-900 px-8 py-1.5 text-[10px] font-black uppercase shadow-lg hover:bg-green-800 transition-all active:translate-y-0.5 flex items-center gap-2"
           >
             {isExporting ? (
               <span className="animate-pulse">Exporting...</span>
             ) : (
               <>
                 <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                 Export to Excel (.xlsx)
               </>
             )}
           </button>
        </div>
      </div>

      {/* DASHBOARD STATS PANEL */}
      <div className="bg-[#e2e8f0] border-[4px] border-slate-400 p-6 rounded-sm shadow-inner">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          {/* Status Counters */}
          <div className="flex items-center gap-3 border-r-2 border-slate-400 pr-6">
             <div className="text-center">
                <div className="w-10 h-10 bg-green-600 rounded flex items-center justify-center text-white mb-1 shadow-md">
                   <span className="font-black text-xs">ACT</span>
                </div>
                <div className="bg-white border-2 border-slate-400 w-10 text-xs font-black">{activeCount}</div>
             </div>
             <div className="text-center">
                <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center text-white mb-1 shadow-md">
                   <span className="font-black text-xs">INA</span>
                </div>
                <div className="bg-white border-2 border-slate-400 w-10 text-xs font-black">{inactiveCount}</div>
             </div>
          </div>

          {/* Value Panels */}
          <div className="flex-grow grid grid-cols-2 md:grid-cols-5 gap-1.5">
            {[
              { label: "Total Workforce", val: employees.length },
              { label: "Gross Payroll", val: totalSalary.toFixed(2) },
              { label: "Total PF Pool", val: totalPF.toFixed(2) },
              { label: "Disbursed Amt", val: totalPaid.toFixed(2) },
              { label: "Outstanding", val: totalBalance.toFixed(2) }
            ].map((box, i) => (
              <div key={i} className="bg-white border-2 border-slate-400 p-2 text-center shadow-sm hover:scale-105 transition-transform">
                <div className="text-[8px] font-black text-slate-500 uppercase border-b border-slate-100 mb-1 tracking-tighter leading-none pb-1">{box.label}</div>
                <div className="text-lg font-black text-slate-900">₹{box.val}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
             <div className="w-10 h-10 border-2 border-slate-400 bg-white flex items-center justify-center cursor-pointer hover:bg-slate-100 shadow-md">📊</div>
             <div className="w-10 h-10 border-2 border-slate-400 bg-slate-900 text-white flex items-center justify-center cursor-pointer hover:bg-black shadow-md">⚙️</div>
          </div>
        </div>
      </div>

      {/* CHART ROW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className="bg-white border-[3px] border-slate-300 p-4 h-36 flex flex-col justify-center items-center shadow-md">
            <span className="text-[9px] font-black uppercase text-slate-400 mb-2">Staff Distribution (Gender)</span>
            <div className="flex gap-2 items-end h-16 w-full px-8">
               <div className="bg-blue-800 flex-1 transition-all rounded-t-sm" style={{height: `${(maleCount/(employees.length || 1))*100}%`}}></div>
               <div className="bg-pink-500 flex-1 transition-all rounded-t-sm" style={{height: `${(femaleCount/(employees.length || 1))*100}%`}}></div>
            </div>
         </div>
         <div className="bg-white border-[3px] border-slate-300 p-4 h-36 md:col-span-2 shadow-md">
            <div className="flex justify-between items-end h-full gap-1">
               {Array.from({length: 12}).map((_,i) => (
                 <div key={i} className="bg-slate-200 w-full hover:bg-blue-400 transition-colors" style={{height: `${Math.random()*80 + 10}%`}}></div>
               ))}
            </div>
         </div>
         <div className="bg-white border-[3px] border-slate-300 p-4 h-36 shadow-md flex items-center justify-center">
            <div className="relative w-20 h-20 rounded-full border-[10px] border-slate-100 border-t-blue-600 border-r-orange-500 animate-spin-slow">
               <div className="absolute inset-0 flex items-center justify-center animate-none rotate-0">
                  <span className="text-[8px] font-black">SYNC</span>
               </div>
            </div>
            <div className="ml-4 text-[10px] font-black uppercase text-slate-500">System Integrity: 100%</div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;