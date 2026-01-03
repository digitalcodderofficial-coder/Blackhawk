
import React, { useState, useEffect } from 'react';
import { Employee, CompanyProfile } from '../types';

interface PrintableProps {
  type: 'Payslip' | 'IDCard' | 'Experience' | 'Letter' | 'JobLeaving';
  employees: Employee[];
  company: CompanyProfile;
  onBack: () => void;
}

const PrintableDocs: React.FC<PrintableProps> = ({ type, employees, company, onBack }) => {
  const [searchId, setSearchId] = useState('');
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  
  const [liveOrgName, setLiveOrgName] = useState(company.name);
  const [liveOrgAddress, setLiveOrgAddress] = useState(company.address);
  const [liveOrgContact, setLiveOrgContact] = useState(company.contact);
  const [liveOrgSession, setLiveOrgSession] = useState(company.session || '2025-26');
  const [liveOrgLocation, setLiveOrgLocation] = useState(company.locationHeader || "SECURITY OPS CENTER");

  useEffect(() => {
    if (employees.length > 0 && !selectedEmp) {
      setSelectedEmp(employees[0]);
    }
  }, [employees]);

  const handleSearch = () => {
    const found = employees.find(e => e.id.toLowerCase() === searchId.toLowerCase());
    if (found) {
      setSelectedEmp(found);
    } else {
      alert("Personnel ID not found in Command Registry.");
    }
  };

  const DocHeader = () => (
    <div className="text-center border-b-[8px] border-slate-900 pb-8 mb-12 flex flex-col items-center">
       {company.logo && <img src={company.logo} className="h-24 w-auto object-contain mb-4" alt="Org Logo" />}
       <h1 className="text-5xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">{liveOrgName}</h1>
       <p className="text-[12px] font-black uppercase mt-2 tracking-[0.5em] text-blue-600">{liveOrgLocation}</p>
       <p className="text-[12px] font-bold uppercase mt-4 text-slate-500 max-w-2xl">{liveOrgAddress}</p>
       <div className="flex justify-center gap-10 mt-6 text-xs font-black uppercase border-t-2 border-slate-100 pt-4 w-full">
          <span>Official Mail: {company.email}</span>
          <span>Security Hotline: {liveOrgContact}</span>
       </div>
    </div>
  );

  const renderDoc = () => {
    if (!selectedEmp) return <div className="p-20 text-center font-black opacity-20 uppercase tracking-[2em]">ENTER PERSONNEL ID FOR PREVIEW</div>;

    switch (type) {
      case 'IDCard':
        return (
          <div className="flex flex-col xl:flex-row gap-12 items-start justify-center p-4">
             <div className="no-print bg-slate-900 p-8 border-4 border-slate-800 rounded-3xl w-full xl:w-[350px] shadow-2xl text-white">
                <h4 className="text-xs font-black uppercase text-blue-400 mb-6 border-b-2 border-blue-900 pb-2">COMMAND CARD EDITOR</h4>
                <div className="space-y-4">
                   <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Agency Name</label>
                      <input className="w-full p-3 bg-slate-800 border-2 border-slate-700 rounded-xl font-black text-xs text-white" value={liveOrgName} onChange={e => setLiveOrgName(e.target.value)} />
                   </div>
                   <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase block mb-1">Ops Location</label>
                      <input className="w-full p-3 bg-slate-800 border-2 border-slate-700 rounded-xl font-black text-xs text-white" value={liveOrgLocation} onChange={e => setLiveOrgLocation(e.target.value)} />
                   </div>
                </div>
             </div>

             <div className="w-[400px] h-[660px] border-[12px] border-slate-900 p-0 bg-white shadow-2xl relative overflow-hidden flex flex-col items-center rounded-[2.5rem] print:rounded-none">
                <div className="w-full bg-[#020617] text-white p-6 text-center border-b-[6px] border-blue-600 flex flex-col items-center">
                   {company.logo && <img src={company.logo} className="h-12 w-auto object-contain mb-2 brightness-0 invert" alt="Logo" />}
                   <h3 className="text-[18px] font-black uppercase leading-none text-white tracking-tighter">{liveOrgName}</h3>
                   <p className="text-[8px] font-bold mt-2 opacity-80 uppercase leading-tight">{liveOrgLocation}</p>
                </div>
                <div className="w-full bg-blue-600 py-2 text-center text-[11px] font-black uppercase text-white tracking-[0.2em] shadow-inner italic">FORCE IDENTITY CARD</div>
                
                <div className="mt-6 w-40 h-48 border-[6px] border-slate-900 bg-slate-50 flex items-center justify-center overflow-hidden shadow-2xl rounded-xl">
                   {selectedEmp.photo ? (
                      <img src={selectedEmp.photo} className="w-full h-full object-cover" alt="Profile" />
                   ) : (
                      <svg className="w-20 h-20 text-slate-200" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/></svg>
                   )}
                </div>

                <div className="mt-4 text-center px-4 w-full">
                   <h2 className="text-2xl font-black text-slate-900 uppercase leading-none border-b-4 border-slate-100 pb-2">{selectedEmp.name}</h2>
                   <div className="inline-block bg-slate-100 px-6 py-1 rounded-full mt-2 text-[12px] font-black text-blue-700 uppercase tracking-widest italic">{selectedEmp.designation}</div>
                </div>

                <div className="mt-4 w-full text-[11px] font-black space-y-1 px-8 text-slate-900 uppercase">
                   <div className="flex justify-between border-b border-slate-100 py-0.5"><span>FORCE ID</span> <span>: {selectedEmp.id}</span></div>
                   <div className="flex justify-between border-b border-slate-100 py-0.5"><span>PRIMARY MOB</span> <span>: {selectedEmp.contact || "N/A"}</span></div>
                   <div className="flex justify-between border-b border-slate-100 py-0.5"><span>ALT/EMERG MOB</span> <span>: {selectedEmp.alternateContact || "N/A"}</span></div>
                   <div className="flex justify-between border-b border-slate-100 py-0.5 text-red-600"><span>BLOOD GROUP</span> <span>: {selectedEmp.bloodGroup || "N/A"}</span></div>
                   <div className="flex flex-col py-1">
                      <span className="text-[8px] text-slate-400">RESIDENTIAL ADDRESS</span>
                      <span className="text-[9px] normal-case line-clamp-2 italic">{selectedEmp.address || "N/A"}</span>
                   </div>
                </div>

                <div className="absolute bottom-0 w-full bg-blue-600 text-white py-4 text-center">
                   <div className="text-[12px] font-black uppercase tracking-[0.3em]">SECURE SERVICE</div>
                   <div className="text-[8px] font-bold opacity-80">EMERGENCY NO: {liveOrgContact}</div>
                </div>
             </div>
          </div>
        );
      case 'Experience':
        return (
          <div className="flex flex-col xl:flex-row gap-12 items-start justify-center p-4">
             <div className="no-print bg-slate-900 p-8 border-4 border-slate-800 rounded-3xl w-full xl:w-[350px] shadow-2xl text-white">
                <h4 className="text-xs font-black uppercase text-blue-400 mb-6 border-b-2 border-blue-900 pb-2">CERTIFICATE EDITOR</h4>
                <div className="space-y-4">
                   <input className="w-full p-3 bg-slate-800 border-2 border-slate-700 rounded-xl font-black text-xs text-white" value={liveOrgName} onChange={e => setLiveOrgName(e.target.value)} />
                   <textarea className="w-full p-3 bg-slate-800 border-2 border-slate-700 rounded-xl font-black text-xs text-white h-20 resize-none" value={liveOrgAddress} onChange={e => setLiveOrgAddress(e.target.value)} />
                </div>
             </div>

             <div className="max-w-4xl bg-white p-20 border-[2px] border-slate-300 shadow-2xl font-sans text-slate-900 min-h-[1100px] print:border-none print:shadow-none print:p-10">
                <DocHeader />
                <h2 className="text-4xl font-black text-center uppercase tracking-[0.3em] underline decoration-[8px] underline-offset-[16px] mb-20 text-slate-800 italic">Certificate of Service</h2>
                <div className="space-y-12 text-2xl leading-[2] text-justify text-slate-900">
                   <p>Ref Date: <span className="font-bold">{new Date().toLocaleDateString('en-GB')}</span></p>
                   <p>This document verifies that <span className="font-black italic text-slate-950 uppercase border-b-4 border-slate-200 px-2">{selectedEmp.name}</span>, s/o Mr. <span className="font-bold">{selectedEmp.fatherName}</span>, has served as a dedicated member of <span className="font-black italic">{liveOrgName}</span> from <span className="font-black">{selectedEmp.joiningDate}</span>.</p>
                   <p>During their tenure as a <span className="font-black uppercase text-blue-800">{selectedEmp.designation}</span>, they performed their security duties with extreme vigil, discipline, and professional integrity.</p>
                   {selectedEmp.gunLicenseNo && <p>They were authorized to carry arms under license <span className="font-black">#{selectedEmp.gunLicenseNo}</span> with a clean operational record.</p>}
                </div>
                <div className="mt-64 flex justify-between items-end">
                   <div className="text-center w-64 border-t-4 border-slate-900 pt-4"><p className="font-black uppercase text-sm tracking-widest">AGENCY SEAL</p></div>
                   <div className="text-center w-64 border-t-4 border-slate-900 pt-4"><p className="font-black uppercase text-sm tracking-widest">CHIEF OPS OFFICER</p></div>
                </div>
             </div>
          </div>
        );
      case 'Payslip':
        return (
          <div className="flex flex-col xl:flex-row gap-12 items-start justify-center p-4">
             <div className="no-print bg-slate-900 p-8 border-4 border-slate-800 rounded-3xl w-full xl:w-[350px] shadow-2xl text-white">
                <h4 className="text-xs font-black uppercase text-blue-400 mb-6 border-b-2 border-blue-900 pb-2">VOUCHER EDITOR</h4>
                <input className="w-full p-3 bg-slate-800 border-2 border-slate-700 rounded-xl font-black text-xs text-white" value={liveOrgName} onChange={e => setLiveOrgName(e.target.value)} />
             </div>
             <div className="max-w-3xl bg-white p-12 border-8 border-slate-900 shadow-2xl font-mono text-black print:p-5">
                <div className="flex justify-between items-center border-b-4 border-black pb-6 mb-8">
                   {company.logo && <img src={company.logo} className="h-16 w-auto object-contain" alt="Logo" />}
                   <div className="text-right">
                      <h2 className="text-3xl font-black uppercase leading-none tracking-tighter">{liveOrgName}</h2>
                      <p className="text-[10px] font-black uppercase mt-1 italic">Security Disbursement Voucher</p>
                   </div>
                </div>
                <div className="text-center mb-10">
                   <h3 className="text-2xl font-black uppercase underline italic bg-slate-100 py-2">Service Remuneration - {new Date().toLocaleString('en-US', {month: 'long', year: 'numeric'})}</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-[13px] font-black border-b-2 border-black pb-4 mb-8 uppercase">
                   <div>Force ID: {selectedEmp.id}</div>
                   <div>Name: {selectedEmp.name}</div>
                   <div>Designation: {selectedEmp.designation}</div>
                   <div>Duty Site: {selectedEmp.workLocation}</div>
                </div>
                <div className="grid grid-cols-2 gap-x-10 border-b-2 border-black pb-10 mb-10">
                   <div className="space-y-2">
                      <div className="font-black border-b border-black mb-4 uppercase text-green-700">Earnings (+)</div>
                      <div className="flex justify-between"><span>Base Pay</span> <span>₹{selectedEmp.basicSalary}</span></div>
                      {selectedEmp.designation === 'Gunman' && <div className="flex justify-between"><span>Armory Allowance</span> <span>₹500.00</span></div>}
                      <div className="flex justify-between font-black border-t border-black mt-4 pt-2"><span>Gross Total</span> <span>₹{selectedEmp.basicSalary + (selectedEmp.designation === 'Gunman' ? 500 : 0)}</span></div>
                   </div>
                   <div className="space-y-2">
                      <div className="font-black border-b border-black mb-4 uppercase text-red-700">Deductions (-)</div>
                      <div className="flex justify-between"><span>Unifom Levy</span> <span>₹0.00</span></div>
                      <div className="flex justify-between font-black border-t border-black mt-4 pt-2"><span>Net Deduct</span> <span>₹0.00</span></div>
                   </div>
                </div>
                <div className="bg-slate-950 text-white p-6 flex justify-between items-center border-[6px] border-blue-600 shadow-xl">
                   <span className="text-xl font-black uppercase italic">NET DISBURSED:</span>
                   <span className="text-4xl font-black">₹{(selectedEmp.basicSalary + (selectedEmp.designation === 'Gunman' ? 500 : 0)).toLocaleString()}</span>
                </div>
                <p className="mt-10 text-[10px] font-black opacity-30 uppercase text-center tracking-[1em]">OFFICIAL FORCE COMMAND RECORD</p>
             </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto pb-20">
      <div className="bg-[#020617] p-6 mb-10 border-b-8 border-blue-600 flex flex-wrap justify-between items-center no-print shadow-2xl rounded-xl">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="bg-white text-slate-900 p-3 rounded-full hover:scale-110 active:scale-95 transition-all">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          </button>
          <input type="text" className="border-2 border-slate-700 bg-slate-800 text-white p-3 text-xs font-black uppercase w-64 shadow-inner" placeholder="Enter Force ID..." value={searchId} onChange={(e) => setSearchId(e.target.value)} />
          <button onClick={handleSearch} className="bg-blue-600 text-white px-8 py-3 rounded font-black uppercase text-[10px] shadow-lg hover:bg-blue-700 transition-all">Preview {type}</button>
        </div>
        <div className="flex gap-2">
           <button onClick={() => window.print()} className="bg-green-600 text-white px-8 py-3 rounded font-black text-[10px] uppercase shadow-md hover:bg-green-700 border-b-4 border-green-900 transition-all">Export Official Copy</button>
        </div>
      </div>
      <div className="flex justify-center bg-slate-200 p-10 border-4 border-slate-300 rounded-sm print:bg-white print:p-0 print:border-none">
         <div className="bg-white p-1 shadow-2xl inline-block print:shadow-none print:p-0">
            {renderDoc()}
         </div>
      </div>
    </div>
  );
};

export default PrintableDocs;
