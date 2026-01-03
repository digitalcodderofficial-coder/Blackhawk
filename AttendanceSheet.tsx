import React, { useState, useEffect } from 'react';
import { Employee, AttendanceRecord, AttendanceStatus, Holiday, CompanyProfile } from '../types';

interface AttendanceSheetProps {
  employees: Employee[];
  attendance: AttendanceRecord[];
  onUpdate: (empId: string, month: string, day: number, status: AttendanceStatus) => void;
  onUpdateTime: (empId: string, month: string, day: number, field: 'in' | 'out', value: string) => void;
  year: number;
  setYear: (y: number) => void;
  holidays: Holiday[];
  company: CompanyProfile;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const STATUS_OPTIONS: AttendanceStatus[] = ['P', 'A', 'L', 'HD', 'OFF', 'H', ''];

const AttendanceSheet: React.FC<AttendanceSheetProps> = ({ employees, attendance, onUpdate, onUpdateTime, year, setYear, holidays, company }) => {
  const [month, setMonth] = useState('April');
  const [searchId, setSearchId] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(employees);
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  // Fix: Removed company.workLocation as it does not exist on CompanyProfile type
  const [customHeader, setCustomHeader] = useState({
    name: company.name,
    location: company.locationHeader || "MAIN BRANCH"
  });

  useEffect(() => {
    if (searchId.trim() === '') {
      setFilteredEmployees(employees);
    } else {
      setFilteredEmployees(employees.filter(e => e.id.toLowerCase().includes(searchId.toLowerCase()) || e.name.toLowerCase().includes(searchId.toLowerCase())));
    }
  }, [searchId, employees]);

  const getDaysInMonth = (monthName: string, yr: number) => {
    const idx = MONTHS.indexOf(monthName);
    return new Date(yr, idx + 1, 0).getDate();
  };

  const currentDays = getDaysInMonth(month, year);

  const getDayDetails = (day: number) => {
    const dateStr = `${year}-${(MONTHS.indexOf(month) + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const dateObj = new Date(year, MONTHS.indexOf(month), day);
    const isSunday = dateObj.getDay() === 0;
    const holiday = holidays.find(h => h.date.startsWith(dateStr));
    return { isSunday, holiday };
  };

  const getDayData = (id: string, day: number) => {
    const rec = attendance.find(a => a.employeeId === id && a.month === month && a.year === year);
    return {
      status: rec?.days[day] || '',
    };
  };

  const calculateEmployeeSummary = (id: string) => {
    const rec = attendance.find(a => a.employeeId === id && a.month === month && a.year === year);
    let p = 0, a = 0, hd = 0, l = 0, h = 0, off = 0;
    if (rec) {
      Object.values(rec.days).forEach(s => {
        if (s === 'P') p++;
        if (s === 'A') a++;
        if (s === 'HD') hd++;
        if (s === 'L') l++;
        if (s === 'H') h++;
        if (s === 'OFF') off++;
      });
    }
    const totalWorking = p + (hd * 0.5) + l + h + off;
    return { p, a, hd, l, h, off, totalWorking };
  };

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case 'P': return 'text-green-700 font-black';
      case 'A': return 'text-red-700 font-black';
      case 'L': return 'text-orange-700 font-black';
      case 'HD': return 'text-blue-700 font-black';
      case 'OFF': return 'text-slate-500';
      case 'H': return 'text-purple-700 font-black';
      default: return 'text-slate-300';
    }
  };

  return (
    <div className="bg-white border-4 border-slate-300 p-2 md:p-6 shadow-2xl rounded-2xl animate-in zoom-in duration-300 print:shadow-none print:border-none print:p-0 print:w-full">
      
      {/* PROFESSIONAL HD PRINT HEADER */}
      <div className="hidden print:block mb-4 border-b-4 border-black pb-2 w-full">
         <div className="flex justify-between items-center mb-2">
            {company.logo && <img src={company.logo} className="h-12 w-auto object-contain" alt="Logo" />}
            <div className="text-center flex-grow px-4">
               <h1 className="text-2xl font-black uppercase text-black leading-none">{customHeader.name}</h1>
               <p className="text-[10px] font-bold text-black mt-1 uppercase tracking-tighter">{customHeader.location}</p>
            </div>
            <div className="text-right whitespace-nowrap">
               <p className="text-[10px] font-black text-black uppercase">ATTENDANCE LEDGER</p>
               <p className="text-[8px] font-bold text-black">{month.toUpperCase()} {year}</p>
            </div>
         </div>
      </div>

      <div className="bg-slate-900 text-white p-4 md:p-6 flex flex-col space-y-6 mb-8 rounded-2xl shadow-2xl no-print border-b-8 border-blue-600">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {MONTHS.map(m => (
              <button
                key={m}
                onClick={() => setMonth(m)}
                className={`px-3 py-2 text-[10px] md:text-[11px] font-black border-2 uppercase transition-all rounded-xl shadow-md ${month === m ? 'bg-blue-600 border-white text-white scale-110' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'}`}
              >
                {m.substring(0, 3)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
             <div className="flex items-center bg-slate-800 rounded-xl border-2 border-slate-700 overflow-hidden shadow-lg">
               <button onClick={() => setYear(year - 1)} className="p-3 text-white hover:bg-slate-700 transition-colors font-black text-lg">&larr;</button>
               <div className="px-6 py-3 font-black text-lg text-blue-400 border-x-2 border-slate-700">{year}</div>
               <button onClick={() => setYear(year + 1)} className="p-3 text-white hover:bg-slate-700 transition-colors font-black text-lg">&rarr;</button>
             </div>
             <button onClick={() => window.print()} className="bg-green-600 text-white px-8 py-4 rounded-xl text-xs font-black shadow-2xl hover:bg-green-700 uppercase tracking-widest border-b-4 border-green-900 ml-2">PRINT LEDGER</button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700 items-center">
            <div className="relative flex-grow w-full">
                <input 
                  type="text" 
                  placeholder="SEARCH STAFF BY ID OR NAME..." 
                  className="w-full bg-slate-900 border-2 border-slate-700 p-3 rounded-xl text-blue-400 font-black text-xs uppercase outline-none focus:border-blue-500 shadow-inner"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                />
            </div>
            <button 
                onClick={() => setIsEditingHeader(!isEditingHeader)} 
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${isEditingHeader ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
            >
              Edit Print Header
            </button>
        </div>
      </div>

      <div className="overflow-x-auto border-2 border-slate-200 p-1 bg-white rounded-xl shadow-inner custom-scrollbar print:overflow-visible print:border-none print:p-0">
        <table className="w-full text-[10px] border-collapse excel-table min-w-[2200px] print:min-w-0 print:w-full print:table-fixed">
          <thead>
            <tr className="bg-slate-900 text-white font-black text-center print:bg-white print:text-black">
              <th className="p-2 border-2 border-slate-700 min-w-[180px] print:border-black print:text-[7px] print:w-28">
                STAFF IDENTITY
              </th>
              <th className="p-2 border-2 border-slate-700 min-w-[120px] print:border-black print:text-[7px] print:w-20">
                WORKPLACE
              </th>
              <th className="p-2 border-2 border-slate-700 min-w-[100px] print:border-black print:text-[7px] print:w-16">
                SHIFT
              </th>
              {Array.from({ length: currentDays }, (_, i) => i + 1).map(d => {
                const { isSunday, holiday } = getDayDetails(d);
                return (
                  <th key={d} className={`p-1 border-2 border-slate-700 print:border-black ${isSunday ? 'bg-red-800 text-white print:bg-slate-100 print:text-black' : holiday ? 'bg-blue-800 text-white print:bg-slate-100 print:text-black' : ''}`}>
                    <div className="text-[12px] print:text-[7px] font-black">{d}</div>
                  </th>
                );
              })}
              <th className="p-1 border-2 border-slate-700 bg-slate-900 text-white print:border-black print:bg-white print:text-black print:text-[7px] print:w-12">TOT</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp, idx) => {
              const summary = calculateEmployeeSummary(emp.id);
              return (
                <tr key={emp.id} className={`h-12 border-b border-slate-200 print:border-black ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50 print:bg-white'}`}>
                  <td className="p-2 border border-slate-200 font-bold text-slate-900 print:border-black print:text-[7px]">
                    <div className="truncate uppercase">{emp.name}</div>
                    <div className="text-[8px] text-blue-600 print:text-black">ID: {emp.id}</div>
                  </td>
                  <td className="p-2 border border-slate-200 text-center uppercase print:border-black print:text-[7px] text-slate-600">
                    {emp.workLocation}
                  </td>
                  <td className="p-2 border border-slate-200 text-center uppercase print:border-black print:text-[7px] text-slate-600">
                    <span className={emp.shift === 'Night' ? 'text-indigo-600 font-black' : 'text-orange-600 font-black'}>
                      {emp.shift}
                    </span>
                  </td>
                  {Array.from({ length: currentDays }, (_, i) => i + 1).map(d => {
                    const { status } = getDayData(emp.id, d);
                    const { isSunday } = getDayDetails(d);
                    const colorClass = getStatusColor(status as AttendanceStatus);
                    return (
                      <td 
                        key={d} 
                        className={`p-0 border border-slate-200 text-center print:border-black ${isSunday ? 'bg-red-50' : ''}`}
                      >
                        <select
                          className={`w-full h-full bg-transparent text-center font-black text-[12px] print:hidden outline-none appearance-none ${colorClass}`}
                          value={status}
                          onChange={(e) => onUpdate(emp.id, month, d, e.target.value as AttendanceStatus)}
                        >
                          {STATUS_OPTIONS.map(opt => (
                            <option key={opt} value={opt}>{opt || '-'}</option>
                          ))}
                        </select>
                        <div className={`hidden print:block font-black text-[7px] text-black ${colorClass}`}>
                           {status || '-'}
                        </div>
                      </td>
                    );
                  })}
                  <td className="p-1 border-2 border-slate-200 text-center font-black bg-blue-50 print:border-black print:bg-white print:text-[7px]">
                    {summary.totalWorking.toFixed(1)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <style>{`
        @media print {
          @page { size: landscape; margin: 5mm; }
          .no-print { display: none !important; }
          body { background: white !important; padding: 0 !important; margin: 0 !important; }
          .excel-table { 
            width: 100% !important; 
            border: 1px solid black !important; 
            table-layout: fixed !important;
          }
          .excel-table th { background: #f8fafc !important; color: black !important; border: 1px solid black !important; -webkit-print-color-adjust: exact; }
          .excel-table td { background: white !important; color: black !important; border: 1px solid black !important; -webkit-print-color-adjust: exact; }
          * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
          tr { page-break-inside: avoid !important; }
        }
      `}</style>
    </div>
  );
};

export default AttendanceSheet;