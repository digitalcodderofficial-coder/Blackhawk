
import React, { useState } from 'react';
import { Employee } from '../types';

interface Props {
  employees: Employee[];
  onUpdateEmployee: (emp: Employee) => void;
  onBack: () => void;
}

const JobLeavingForm: React.FC<Props> = ({ employees, onUpdateEmployee, onBack }) => {
  const [searchId, setSearchId] = useState('');
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [leaveForm, setLeaveForm] = useState({
    date: new Date().toISOString().split('T')[0],
    reason: '',
    status: 'Inactive' as 'Active' | 'Inactive'
  });

  const handleSearch = () => {
    const found = employees.find(e => e.id === searchId);
    if (found) setSelectedEmp(found);
    else alert("Employee ID Not Found.");
  };

  const handleLeave = () => {
    if (!selectedEmp) return;
    const updated: Employee = {
      ...selectedEmp,
      status: leaveForm.status,
      leavingDate: leaveForm.date,
      leavingReason: leaveForm.reason
    };
    onUpdateEmployee(updated);
    alert("Record Updated Successfully!");
    setSelectedEmp(null);
    setSearchId('');
  };

  return (
    <div className="bg-white p-6 border-[1px] border-black max-w-[1200px] mx-auto min-h-[800px] font-sans">
      <div className="flex justify-between items-center border-b-[3px] border-black pb-4 mb-8">
         <h1 className="text-4xl font-black uppercase tracking-widest text-black">Job Leaving Form</h1>
         <button onClick={onBack} className="w-10 h-10 border-2 border-black rounded-full flex items-center justify-center"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg></button>
      </div>

      <div className="bg-gray-50 border-2 border-black p-6 mb-10">
         <div className="flex flex-wrap items-end gap-6 mb-6">
            <div>
               <label className="block text-[10px] font-bold uppercase mb-1">Employee ID</label>
               <input type="text" className="border border-black p-2 w-48 font-bold uppercase" value={searchId} onChange={e => setSearchId(e.target.value)} />
            </div>
            <button onClick={handleSearch} className="bg-black text-white px-8 py-2 font-bold uppercase text-xs">Search</button>
            <p className="text-[11px] font-bold text-red-600 ml-auto italic">• जिस कर्मचारी ने त्यागपत्र दिया है या किसी कारणवश पद छोड़ दिया है तो उसकी जानकारी दर्ज कर Leave Job Button पर क्लिक करें</p>
         </div>

         <table className="w-full border-collapse border border-black text-[11px] font-bold uppercase mb-8">
            <thead className="bg-gray-100">
               <tr>
                  <th className="border border-black p-2">Employee ID</th>
                  <th className="border border-black p-2">Employee Name</th>
                  <th className="border border-black p-2">Designation</th>
                  <th className="border border-black p-2">Gender</th>
                  <th className="border border-black p-2">Date of Joining</th>
                  <th className="border border-black p-2">Date of Leaving</th>
                  <th className="border border-black p-2">Years of Service</th>
                  <th className="border border-black p-2">Reason of Leaving</th>
                  <th className="border border-black p-2">Status</th>
               </tr>
            </thead>
            <tbody>
               <tr>
                  <td className="border border-black p-2 text-center h-10">{selectedEmp?.id || ''}</td>
                  <td className="border border-black p-2">{selectedEmp?.name || ''}</td>
                  <td className="border border-black p-2">{selectedEmp?.designation || ''}</td>
                  <td className="border border-black p-2 text-center">{selectedEmp?.gender || ''}</td>
                  <td className="border border-black p-2 text-center">{selectedEmp?.joiningDate || ''}</td>
                  <td className="border border-black p-2 text-center">
                     <input type="date" className="w-full border-none bg-transparent" value={leaveForm.date} onChange={e => setLeaveForm({...leaveForm, date: e.target.value})} />
                  </td>
                  <td className="border border-black p-2 text-center">0 Years, 0 Months</td>
                  <td className="border border-black p-2">
                     <input type="text" className="w-full border-none bg-transparent outline-none" placeholder="Enter reason..." value={leaveForm.reason} onChange={e => setLeaveForm({...leaveForm, reason: e.target.value})} />
                  </td>
                  <td className="border border-black p-2">
                     <select className="w-full border-none bg-transparent font-bold outline-none" value={leaveForm.status} onChange={e => setLeaveForm({...leaveForm, status: e.target.value as any})}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                     </select>
                  </td>
               </tr>
            </tbody>
         </table>

         <div className="flex justify-center">
            <button onClick={handleLeave} className="bg-red-700 text-white px-16 py-3 font-bold uppercase text-sm border-b-4 border-red-900 shadow-lg active:translate-y-1 active:border-b-0">Leave Job</button>
         </div>
      </div>

      <div>
         <h3 className="text-xl font-black uppercase mb-4 tracking-tighter border-b-4 border-black inline-block">Job Leaving Employees Details</h3>
         <div className="overflow-auto border-2 border-black">
            <table className="w-full border-collapse text-[10px] font-bold uppercase">
               <thead>
                  <tr className="bg-gray-100">
                     <th className="border border-black p-2">Employee ID</th>
                     <th className="border border-black p-2">Employee Name</th>
                     <th className="border border-black p-2">Designation</th>
                     <th className="border border-black p-2">Gender</th>
                     <th className="border border-black p-2">Date of Joining</th>
                     <th className="border border-black p-2">Date of Leaving</th>
                     <th className="border border-black p-2">Years of Service</th>
                     <th className="border border-black p-2">Reason of Leaving</th>
                     <th className="border border-black p-2">Status</th>
                  </tr>
               </thead>
               <tbody>
                  {employees.filter(e => e.status === 'Inactive').map(e => (
                     <tr key={e.id}>
                        <td className="border border-black p-2 text-center">{e.id}</td>
                        <td className="border border-black p-2">{e.name}</td>
                        <td className="border border-black p-2">{e.designation}</td>
                        <td className="border border-black p-2 text-center">{e.gender}</td>
                        <td className="border border-black p-2 text-center">{e.joiningDate}</td>
                        <td className="border border-black p-2 text-center">{e.leavingDate}</td>
                        <td className="border border-black p-2 text-center">N/A</td>
                        <td className="border border-black p-2">{e.leavingReason}</td>
                        <td className="border border-black p-2 text-center text-red-700">{e.status}</td>
                     </tr>
                  ))}
                  {Array.from({length: 15}).map((_, i) => (
                     <tr key={i}><td colSpan={9} className="border border-black p-2 h-8"></td></tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default JobLeavingForm;
