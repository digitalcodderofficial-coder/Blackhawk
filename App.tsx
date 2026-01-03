
import React, { useState, useEffect } from 'react';
import { ViewType, Employee, AttendanceRecord, SalaryRecord, AttendanceStatus, CompanyProfile, Holiday, Transaction, Post } from './types';
import Dashboard from './components/Dashboard';
import AttendanceSheet from './components/AttendanceSheet';
import SalaryCalculation from './components/SalaryCalculation';
import DatabaseView from './components/DatabaseView';
import EmployeeForm from './components/EmployeeForm';
import ProfileSetting from './components/ProfileSetting';
import PrintableDocs from './components/PrintableDocs';
import ApplicationFormEditor from './components/ApplicationFormEditor';
import GstCalculator from './components/GstCalculator';
import HolidayManager from './components/HolidayManager';
import Instructions from './components/Instructions';
import PaymentLedger from './components/PaymentLedger';
import EmployeePaymentStatus from './components/EmployeePaymentStatus';
import EmployeeBalanceSummary from './components/EmployeeBalanceSummary';
import JobLeavingForm from './components/JobLeavingForm';
import EmployeeSummary from './components/EmployeeSummary';
import QuotationForm from './components/QuotationForm';
import MonthWiseSummary from './components/MonthWiseSummary';

const DEFAULT_PROFILE: CompanyProfile = {
  name: "EXCEL ENTERPRISE SOLUTIONS",
  type: "Enterprise",
  address: "123 Business Park, India",
  contact: "+91 99999 88888",
  logo: "",
  email: "admin@excelpro.com",
  locationHeader: "MAIN HEAD OFFICE"
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('Dashboard');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [company, setCompany] = useState<CompanyProfile>(() => {
    const saved = localStorage.getItem('company_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('employees_data');
    return saved ? JSON.parse(saved) : [];
  });
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('attendance_data');
    return saved ? JSON.parse(saved) : [];
  });
  const [salaries, setSalaries] = useState<SalaryRecord[]>(() => {
    const saved = localStorage.getItem('salary_data');
    return saved ? JSON.parse(saved) : [];
  });
  const [holidays, setHolidays] = useState<Holiday[]>(() => {
    const saved = localStorage.getItem('holidays_data');
    return saved ? JSON.parse(saved) : [];
  });
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions_data');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('company_profile', JSON.stringify(company));
    localStorage.setItem('employees_data', JSON.stringify(employees));
    localStorage.setItem('attendance_data', JSON.stringify(attendance));
    localStorage.setItem('salary_data', JSON.stringify(salaries));
    localStorage.setItem('transactions_data', JSON.stringify(transactions));
    localStorage.setItem('holidays_data', JSON.stringify(holidays));
  }, [company, employees, attendance, salaries, transactions, holidays]);

  const handleUpdateSalary = (empId: string, month: string, field: keyof SalaryRecord, value: number) => {
    setSalaries(prev => {
      const idx = prev.findIndex(s => s.employeeId === empId && s.month === month && s.year === selectedYear);
      const updated = [...prev];
      if (idx >= 0) {
        updated[idx] = { ...updated[idx], [field]: value };
      } else {
        const newRec: any = { 
          employeeId: empId, month, year: selectedYear,
          da: 0, ta: 0, hra: 0, ma: 0, bonus: 0, pf: 0, allowedLeave: 1, holiday: 4
        };
        newRec[field] = value;
        updated.push(newRec);
      }
      return updated;
    });
  };

  const handleStatusUpdate = (id: string, status: 'Active' | 'Inactive') => {
    setEmployees(prev => prev.map(e => e.id === id ? { 
      ...e, 
      status, 
      statusChangeDate: new Date().toLocaleDateString('en-GB'),
      leavingDate: status === 'Inactive' ? new Date().toLocaleDateString('en-GB') : undefined 
    } : e));
  };

  const renderView = () => {
    switch (currentView) {
      case 'Dashboard':
        return <Dashboard employees={employees} salaries={salaries} transactions={transactions} setView={setCurrentView} />;
      case 'ReadInstructions':
        return <Instructions onBack={() => setCurrentView('Dashboard')} />;
      case 'AddEmployee':
      case 'BlankForm':
        return <EmployeeForm editId={selectedEmpId} employees={employees} onSave={(emp) => {
          setEmployees(prev => {
             const idx = prev.findIndex(e => e.id === emp.id);
             const now = new Date().toLocaleDateString('en-GB');
             if(idx >= 0) {
               const updated = [...prev];
               updated[idx] = { ...emp, status: emp.status || 'Active', statusChangeDate: emp.statusChangeDate || now };
               return updated;
             }
             return [...prev, { ...emp, status: 'Active', statusChangeDate: now }];
          });
          setSelectedEmpId(null);
          setCurrentView('Database');
        }} onCancel={() => setCurrentView('Dashboard')} />;
      case 'Database':
        return <DatabaseView 
          employees={employees} 
          onDelete={id => setEmployees(employees.filter(e => e.id !== id))} 
          onEdit={emp => { setSelectedEmpId(emp.id); setCurrentView('AddEmployee'); }} 
          onAdd={() => { setSelectedEmpId(null); setCurrentView('AddEmployee'); }}
          onUpdateStatus={handleStatusUpdate}
        />;
      case 'AttendanceSheet':
      case 'DailyAttendance':
      case 'AttendanceTracker':
        return <AttendanceSheet employees={employees} attendance={attendance} onUpdate={(id, m, d, s) => {
          setAttendance(prev => {
            const idx = prev.findIndex(a => a.employeeId === id && a.month === m && a.year === selectedYear);
            const updated = [...prev];
            if(idx >= 0) updated[idx].days[d] = s;
            else updated.push({employeeId: id, month: m, year: selectedYear, days: {[d]: s}});
            return updated;
          })
        }} onUpdateTime={(id, m, d, f, v) => {
           setAttendance(prev => {
             const idx = prev.findIndex(a => a.employeeId === id && a.month === m && a.year === selectedYear);
             const updated = [...prev];
             if(idx >= 0) {
               const times = updated[idx].times || {};
               updated[idx].times = { ...times, [d]: { ...(times[d] || {in:'', out:''}), [f]: v } };
             }
             return updated;
           });
        }} year={selectedYear} setYear={setSelectedYear} holidays={holidays} company={company} />;
      case 'SalaryCalculation':
      case 'SalaryTracker':
      case 'PFCalculation':
      case 'SalarySheetBank':
        return <SalaryCalculation employees={employees} attendance={attendance} salaries={salaries} onUpdate={handleUpdateSalary} year={selectedYear} setYear={setSelectedYear} />;
      case 'IDCard':
        return <PrintableDocs type="IDCard" employees={employees} company={company} onBack={() => setCurrentView('Dashboard')} />;
      case 'AppointmentLetter':
        return <PrintableDocs type="Letter" employees={employees} company={company} onBack={() => setCurrentView('Dashboard')} />;
      case 'ExperienceCertificate':
        return <PrintableDocs type="Experience" employees={employees} company={company} onBack={() => setCurrentView('Dashboard')} />;
      case 'JobLeavingDetails':
        return <JobLeavingForm employees={employees} onUpdateEmployee={(updated) => {
           setEmployees(prev => prev.map(e => e.id === updated.id ? updated : e));
        }} onBack={() => setCurrentView('Dashboard')} />;
      case 'MonthlyPayslip':
      case 'AnnualPayslip':
        return <PrintableDocs type="Payslip" employees={employees} company={company} onBack={() => setCurrentView('Dashboard')} />;
      case 'Payment':
      case 'PaymentRecord':
        return <PaymentLedger transactions={transactions} setTransactions={setTransactions} employees={employees} onBack={() => setCurrentView('Dashboard')} />;
      case 'EmployeePaymentStatus':
        return <EmployeePaymentStatus 
          employees={employees} 
          transactions={transactions} 
          salaries={salaries} 
          company={company}
          onAddTransaction={tx => setTransactions([tx, ...transactions])} 
          onUpdateEmployee={emp => setEmployees(employees.map(e => e.id === emp.id ? emp : e))}
          onBack={() => setCurrentView('Dashboard')} 
        />;
      case 'EmployeeBalance':
        return <EmployeeBalanceSummary 
          employees={employees} 
          transactions={transactions} 
          salaries={salaries} 
          company={company} 
          onBack={() => setCurrentView('Dashboard')} 
        />;
      case 'EmployeeSummary':
        return <EmployeeSummary 
          employees={employees} 
          company={company} 
          attendance={attendance} 
          salaries={salaries} 
          transactions={transactions} 
          onBack={() => setCurrentView('Dashboard')} 
        />;
      case 'QuotationForm':
        return <QuotationForm employees={employees} company={company} onBack={() => setCurrentView('Dashboard')} />;
      case 'MonthWiseSummary':
        return <MonthWiseSummary 
          employees={employees} 
          attendance={attendance} 
          salaries={salaries} 
          transactions={transactions} 
          company={company} 
          onBack={() => setCurrentView('Dashboard')} 
        />;
      case 'MasterSetting':
      case 'SchoolProfile':
      case 'UploadLogo':
        return <ProfileSetting profile={company} onSave={setCompany} onCancel={() => setCurrentView('Dashboard')} />;
      case 'GstCalculator':
        return <GstCalculator onBack={() => setCurrentView('Dashboard')} company={company} />;
      case 'ApplicationForm':
        return <ApplicationFormEditor company={company} employees={employees} onBack={() => setCurrentView('Dashboard')} />;
      case 'Holidays':
        return <HolidayManager holidays={holidays} setHolidays={setHolidays} year={selectedYear} setYear={setSelectedYear} onBack={() => setCurrentView('Dashboard')} />;
      default:
        return (
          <div className="p-24 text-center bg-white border-2 border-slate-300">
             <h2 className="text-4xl font-black text-slate-800 uppercase italic mb-6">{currentView} Module</h2>
             <button onClick={() => setCurrentView('Dashboard')} className="bg-slate-900 text-white px-12 py-3 rounded-sm font-black text-xs uppercase shadow-xl hover:scale-105 transition-all">Back to dashboard</button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] p-2 md:p-6 flex flex-col items-center selection:bg-blue-200">
       <header className="w-full max-w-7xl mb-6 no-print">
          <div className="bg-[#1e293b] p-6 rounded-3xl shadow-2xl border-b-8 border-blue-600 flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-white text-4xl shadow-2xl border-2 border-white animate-pulse">E</div>
                <div>
                   <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">{company.name}</h1>
                   <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mt-1 italic">Enterprise Management System v4.2 PRO</p>
                </div>
             </div>
             <div className="flex flex-col items-end">
                <div className="bg-slate-800 px-6 py-2 rounded-full border border-slate-700 shadow-inner">
                   <span className="text-white font-black text-xs uppercase tracking-widest">{currentTime.toLocaleDateString('en-GB', {day:'2-digit', month:'short', year:'numeric'})} | {currentTime.toLocaleTimeString()}</span>
                </div>
             </div>
          </div>
       </header>

       <main className="w-full max-w-7xl pb-24">
          {renderView()}
       </main>

       <footer className="w-full max-w-7xl mt-auto no-print">
          <div className="text-center py-8 opacity-20 hover:opacity-100 transition-opacity">
             <p className="text-[10px] font-black uppercase tracking-[3em] text-slate-900">MASTER CORE ARCHITECTURE BY ADITYA RAI</p>
          </div>
       </footer>
    </div>
  );
};

export default App;
