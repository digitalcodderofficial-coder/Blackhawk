
import React, { useState, useEffect } from 'react';
import { Employee } from '../types';

interface EmployeeFormProps {
  editId: string | null;
  employees: Employee[];
  onSave: (emp: Employee) => void;
  onCancel: () => void;
}

const SECURITY_POSTS = [
  "Security Guard", "Gunman", "Bouncer", "PSO (Personal Security Officer)", 
  "PPO (Personal Protection Officer)", "Industrial Guard", "Sweeper", 
  "Supervisor", "Field Officer", "Branch Manager"
];

const EmployeeForm: React.FC<EmployeeFormProps> = ({ editId, employees, onSave, onCancel }) => {
  const [searchId, setSearchId] = useState('');
  const [emp, setEmp] = useState<Employee>({
    id: "",
    name: "",
    designation: "Security Guard",
    gender: "Male",
    basicSalary: 0,
    joiningDate: new Date().toISOString().split('T')[0],
    contact: "",
    alternateContact: "",
    email: "",
    fatherName: "",
    motherName: "",
    address: "",
    aadhaar: "",
    bankName: "",
    accountNo: "",
    ifsc: "",
    bloodGroup: "B+",
    religion: "Hindu",
    category: "General",
    maritalStatus: "Single",
    qualification: "",
    experience: "",
    samagraId: "",
    photo: "",
    shift: "Day",
    workLocation: "Main Site",
    status: 'Active',
    statusChangeDate: new Date().toLocaleDateString('en-GB'),
    height: "",
    weight: "",
    chest: "",
    gunLicenseNo: "",
    licenseExpiry: "",
    policeVerification: "Pending",
    trainingCertNo: ""
  });

  useEffect(() => {
    if (editId) {
      const existing = employees.find(e => e.id === editId);
      if (existing) setEmp(existing);
    }
  }, [editId, employees]);

  const handleSearch = () => {
    const found = employees.find(e => e.id.toLowerCase() === searchId.toLowerCase());
    if (found) {
      setEmp(found);
    } else {
      alert("Employee ID not found in database.");
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEmp({ ...emp, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (name: keyof Employee, value: string | number) => {
    setEmp(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-[#1e293b] p-4 border-[4px] border-blue-600 shadow-2xl rounded-sm max-w-6xl mx-auto">
      <div className="bg-slate-800 p-4 border-2 border-slate-700 flex flex-wrap justify-between items-center gap-4 mb-6 shadow-md">
        <div className="flex items-center gap-4">
           <span className="text-xs font-black uppercase text-blue-400">Force Registry Search:</span>
           <input 
             type="text" 
             className="border-2 border-slate-600 p-2 text-xs font-black uppercase w-48 bg-slate-900 text-white shadow-inner"
             placeholder="ENTER FORCE ID..." 
             value={searchId}
             onChange={(e) => setSearchId(e.target.value)}
           />
           <button 
             type="button" 
             onClick={handleSearch}
             className="bg-blue-600 text-white px-8 py-2 text-[10px] font-black uppercase hover:bg-blue-700 border-b-4 border-blue-900 active:translate-y-0.5"
           >
             AUTOFILL DATA
           </button>
        </div>
        <div className="text-[10px] font-black text-slate-500 italic uppercase">Security Force Command v5.0 PRO</div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onSave(emp); }} className="bg-white border-2 border-slate-400 p-8 space-y-10">
        <div className="border-b-4 border-slate-900 pb-2 flex justify-between items-end">
           <h2 className="text-4xl font-black italic uppercase tracking-tighter text-slate-800">Recruitment Form <span className="text-blue-600 text-xs font-bold tracking-normal italic">(Security Personnel)</span></h2>
           <div className="text-[9px] font-black uppercase text-red-500 font-mono">* FIELD VERIFICATION MANDATORY</div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
           <div className="w-full lg:w-1/4 flex flex-col items-center">
              <div className="w-48 h-56 border-4 border-slate-900 bg-slate-50 flex items-center justify-center relative overflow-hidden group shadow-2xl">
                 {emp.photo ? (
                   <img src={emp.photo} className="w-full h-full object-cover" alt="Staff" />
                 ) : (
                   <div className="text-center p-4">
                      <svg className="w-16 h-16 mx-auto text-slate-300 mb-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/></svg>
                      <span className="text-[9px] font-black text-slate-400 uppercase">Passport Photo</span>
                   </div>
                 )}
                 <input 
                   type="file" 
                   accept="image/*" 
                   onChange={handlePhotoUpload} 
                   className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                 />
                 <div className="absolute inset-0 bg-blue-600/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span className="text-white text-[10px] font-black uppercase">Click to Change</span>
                 </div>
              </div>
              <div className="mt-4 bg-slate-900 text-white px-4 py-1 text-[10px] font-black uppercase rounded shadow-lg">Official Identity</div>
           </div>

           <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-slate-500 uppercase">Personnel ID Code</label>
                <input type="text" className="border-2 border-slate-300 p-2 text-xs font-black bg-blue-50 focus:border-blue-600 outline-none" value={emp.id} onChange={(e)=>handleChange('id', e.target.value)} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-slate-500 uppercase">Full Legal Name</label>
                <input type="text" className="border-2 border-slate-300 p-2 text-xs font-black focus:border-blue-600 outline-none" value={emp.name} onChange={(e)=>handleChange('name', e.target.value)} />
              </div>
              <div className="flex flex-col gap-1">
                 <label className="text-[10px] font-black text-slate-500 uppercase">Security Designation</label>
                 <select className="border-2 border-slate-300 p-2 text-xs font-black bg-slate-50 outline-none" value={emp.designation} onChange={(e)=>handleChange('designation', e.target.value)}>
                    {SECURITY_POSTS.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
                 </select>
              </div>

              {[
                { label: "Father's Name", name: "fatherName", type: "text" },
                { label: "Deployment Site", name: "workLocation", type: "text" },
                { label: "Basic Pay (₹)", name: "basicSalary", type: "number" },
                { label: "Date of Enlistment", name: "joiningDate", type: "date" },
                { label: "Blood Group", name: "bloodGroup", type: "text" },
                { label: "Primary Mobile", name: "contact", type: "text" },
                { label: "Alternate/Emergency Mobile", name: "alternateContact", type: "text" },
                { label: "Aadhaar Card No.", name: "aadhaar", type: "text" },
                { label: "Bank Account No.", name: "accountNo", type: "text" },
              ].map((f) => (
                <div key={f.name} className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase">{f.label}</label>
                  <input
                    type={f.type}
                    className="border-2 border-slate-300 p-2 text-xs font-black outline-none focus:border-blue-600 bg-white"
                    value={(emp as any)[f.name] || ""}
                    onChange={(e) => handleChange(f.name as keyof Employee, f.type === 'number' ? Number(e.target.value) : e.target.value)}
                  />
                </div>
              ))}
           </div>
        </div>

        {/* Physical Standards Section */}
        <div className="bg-slate-50 p-6 border-2 border-slate-200 rounded shadow-inner">
           <h3 className="text-sm font-black uppercase text-slate-900 mb-6 border-b-2 border-slate-900 pb-1 italic">Physical Standards (Mandatory for Field Staff)</h3>
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex flex-col gap-1">
                 <label className="text-[10px] font-black text-slate-500 uppercase">Height (cms)</label>
                 <input type="text" placeholder="e.g. 175" className="border-2 border-slate-300 p-2 text-xs font-black bg-white" value={emp.height || ""} onChange={(e)=>handleChange('height', e.target.value)} />
              </div>
              <div className="flex flex-col gap-1">
                 <label className="text-[10px] font-black text-slate-500 uppercase">Weight (kgs)</label>
                 <input type="text" placeholder="e.g. 80" className="border-2 border-slate-300 p-2 text-xs font-black bg-white" value={emp.weight || ""} onChange={(e)=>handleChange('weight', e.target.value)} />
              </div>
              <div className="flex flex-col gap-1">
                 <label className="text-[10px] font-black text-slate-500 uppercase">Chest (inches)</label>
                 <input type="text" placeholder="Normal-Expanded" className="border-2 border-slate-300 p-2 text-xs font-black bg-white" value={emp.chest || ""} onChange={(e)=>handleChange('chest', e.target.value)} />
              </div>
              <div className="flex flex-col gap-1">
                 <label className="text-[10px] font-black text-slate-500 uppercase">Police Verification</label>
                 <select className="border-2 border-slate-300 p-2 text-xs font-black bg-white" value={emp.policeVerification} onChange={(e)=>handleChange('policeVerification', e.target.value as any)}>
                    <option value="Not Done">NOT DONE</option>
                    <option value="Pending">PENDING</option>
                    <option value="Verified">VERIFIED</option>
                 </select>
              </div>
           </div>
        </div>

        {/* Gunman Specific Fields */}
        {emp.designation === "Gunman" && (
           <div className="bg-orange-50 p-6 border-2 border-orange-200 rounded shadow-inner animate-in slide-in-from-left duration-300">
              <h3 className="text-sm font-black uppercase text-orange-900 mb-6 border-b-2 border-orange-900 pb-1 italic">Armory & License Certification</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-orange-700 uppercase">Weapon License No.</label>
                    <input type="text" className="border-2 border-orange-300 p-2 text-xs font-black bg-white" value={emp.gunLicenseNo || ""} onChange={(e)=>handleChange('gunLicenseNo', e.target.value)} />
                 </div>
                 <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-orange-700 uppercase">License Expiry Date</label>
                    <input type="date" className="border-2 border-orange-300 p-2 text-xs font-black bg-white" value={emp.licenseExpiry || ""} onChange={(e)=>handleChange('licenseExpiry', e.target.value)} />
                 </div>
                 <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-orange-700 uppercase">Training Certificate #</label>
                    <input type="text" className="border-2 border-orange-300 p-2 text-xs font-black bg-white" value={emp.trainingCertNo || ""} onChange={(e)=>handleChange('trainingCertNo', e.target.value)} />
                 </div>
              </div>
           </div>
        )}

        <div className="flex flex-col gap-1">
           <label className="text-[10px] font-black text-slate-500 uppercase">Residential Address (For Verification)</label>
           <textarea 
             className="w-full border-2 border-slate-300 p-3 text-xs font-black outline-none focus:border-blue-600 bg-white h-24 resize-none shadow-sm"
             placeholder="Permanent Address of Resident..."
             value={emp.address}
             onChange={(e) => handleChange('address', e.target.value)}
           />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-10 border-t-2 border-slate-100 no-print">
           <button type="button" onClick={onCancel} className="bg-slate-100 border-2 border-slate-400 px-12 py-3 text-[10px] font-black uppercase text-slate-500 hover:bg-slate-200 transition-all">Cancel</button>
           <button type="submit" className="bg-blue-600 border-2 border-blue-900 px-20 py-3 text-[11px] font-black uppercase text-white shadow-2xl hover:bg-blue-700 active:translate-y-1 transition-all border-b-4">Confirm Recruitment</button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
