
import React, { useState } from 'react';
import { Employee, CompanyProfile } from '../types';

interface Props {
  company: CompanyProfile;
  employees: Employee[];
  onBack: () => void;
}

const ApplicationFormEditor: React.FC<Props> = ({ company, employees, onBack }) => {
  const [searchId, setSearchId] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    setHasSearched(true);
    const found = employees.find(e => e.id.toLowerCase() === searchId.toLowerCase());
    if (found) {
      setSelectedEmployee(found);
    } else {
      alert("Employee ID not found. Please verify the ID in the database.");
      setSelectedEmployee(null);
    }
  };

  const CharacterGrid = ({ length, value = "" }: { length: number; value?: string }) => (
    <div className="flex gap-0 border-l border-slate-400">
      {/* Corrected the map function syntax to properly return the JSX element and utilize the index 'i' */}
      {Array.from({ length }).map((_, i) => (
        <div key={i} className="w-6 h-6 border-r border-y border-slate-400 flex items-center justify-center text-[11px] font-black uppercase bg-white">
          {value[i] || ""}
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white p-4 animate-in fade-in duration-500 min-h-screen">
      <div className="mb-6 bg-slate-900 p-6 border-b-4 border-blue-600 rounded-xl flex flex-wrap justify-between items-center no-print gap-4 shadow-2xl">
         <div className="flex items-center gap-6">
            <button onClick={onBack} className="bg-white text-slate-900 px-8 py-3 rounded-full font-black text-xs uppercase shadow-lg hover:bg-blue-50 transition-all active:scale-95">Back to Control Hub</button>
            <div className="h-10 w-1 bg-slate-700"></div>
            <div className="flex flex-col">
               <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-1">Verify Candidate Identity</span>
               <div className="flex gap-2">
                  <input 
                    type="text" 
                    className="border-2 border-slate-700 p-3 text-sm font-black uppercase w-64 bg-slate-800 text-white outline-none focus:border-blue-500 rounded-lg shadow-inner"
                    placeholder="ENTER STAFF ID (e.g. ABC-01)"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <button onClick={handleSearch} className="bg-blue-600 text-white px-10 py-3 rounded-lg font-black text-xs uppercase shadow-md hover:bg-blue-700 transition-all active:translate-y-0.5">Load Application</button>
               </div>
            </div>
         </div>
         <button onClick={() => window.print()} disabled={!selectedEmployee} className="bg-green-600 text-white px-12 py-3 rounded-lg font-black text-xs uppercase shadow-lg hover:bg-green-700 disabled:opacity-30 disabled:cursor-not-allowed">Export Official Form</button>
      </div>

      {!selectedEmployee && hasSearched && (
         <div className="max-w-[1000px] mx-auto p-20 text-center bg-red-50 border-4 border-dashed border-red-200 rounded-3xl animate-pulse">
            <h3 className="text-2xl font-black text-red-400 uppercase italic">Verification Failed: ID "{searchId}" not in registry.</h3>
            <p className="text-slate-400 mt-2 font-bold">Please add the employee to the database first or check the ID again.</p>
         </div>
      )}

      {selectedEmployee ? (
        <div id="printable-area" className="max-w-[1000px] mx-auto border-4 border-slate-800 p-8 bg-white text-slate-900 font-sans shadow-2xl print:shadow-none print:border-black">
          {/* Form Header */}
          <div className="flex justify-between items-start border-b-4 border-slate-900 pb-6 mb-8">
             <div className="w-28 h-28 bg-slate-50 border-4 border-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
                {company.logo ? (
                   <img src={company.logo} className="w-full h-full object-contain" alt="Logo" />
                ) : (
                   <span className="text-[10px] font-black uppercase text-slate-400 text-center px-2">Official Logo Required</span>
                )}
             </div>
             <div className="text-center flex-grow">
                <h1 className="text-5xl font-black uppercase tracking-tighter leading-none mb-2 text-slate-900">{company.name}</h1>
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-500">{company.address}</p>
                <div className="flex justify-center gap-10 text-[10px] font-black mt-4 text-slate-400 border-t border-slate-100 pt-2">
                   <span>DISE CODE: {company.diseCode || "N/A"}</span>
                   <span>CONTACT: {company.contact}</span>
                   <span>STATUS: <span className="text-green-600">{selectedEmployee.status.toUpperCase()}</span></span>
                </div>
             </div>
             <div className="flex flex-col gap-2">
                <div className="bg-slate-900 text-white px-4 py-1 text-[10px] font-black uppercase rounded shadow-md">OFFICIAL COPY</div>
                <div className="bg-slate-200 border border-slate-400 px-4 py-1 text-[8px] font-black uppercase text-center">PAGE 01</div>
             </div>
          </div>

          <h2 className="text-2xl font-black text-center uppercase tracking-[0.4em] border-y-4 border-slate-900 py-3 mb-10 bg-slate-50 shadow-inner">Employee Application Data (Registry Ver. 4.2)</h2>

          {/* Form Body */}
          <div className="space-y-8">
             <div className="bg-slate-900 text-white p-3 border-l-[15px] border-blue-600 mb-6 font-black uppercase text-sm italic tracking-widest">A. Core Profile Ledger</div>
             
             <div className="grid grid-cols-12 gap-y-6 text-[12px] font-black uppercase items-center px-4">
                <div className="col-span-3 text-slate-400 italic">Candidate Name</div>
                <div className="col-span-9"><CharacterGrid length={25} value={selectedEmployee.name} /></div>

                <div className="col-span-3 text-slate-400 italic">Father / Husband</div>
                <div className="col-span-9"><CharacterGrid length={25} value={selectedEmployee.fatherName} /></div>

                <div className="col-span-3 text-slate-400 italic">Mother's Full Name</div>
                <div className="col-span-9"><CharacterGrid length={25} value={selectedEmployee.motherName} /></div>

                <div className="col-span-3 text-slate-400 italic">Birth Record (DD/MM/YYYY)</div>
                <div className="col-span-9">
                   <div className="flex gap-6">
                      <div className="flex items-center gap-2">D<CharacterGrid length={2} /></div>
                      <div className="flex items-center gap-2">M<CharacterGrid length={2} /></div>
                      <div className="flex items-center gap-2">Y<CharacterGrid length={4} /></div>
                   </div>
                </div>

                <div className="col-span-3 text-slate-400 italic">Gender Bias</div>
                <div className="col-span-9 flex gap-16">
                   <div className="flex items-center gap-3 font-black">MALE <div className={`w-6 h-6 border-2 border-slate-900 flex items-center justify-center ${selectedEmployee.gender === 'Male' ? 'bg-slate-900 text-white shadow-xl' : ''}`}>{selectedEmployee.gender === 'Male' && '✓'}</div></div>
                   <div className="flex items-center gap-3 font-black">FEMALE <div className={`w-6 h-6 border-2 border-slate-900 flex items-center justify-center ${selectedEmployee.gender === 'Female' ? 'bg-slate-900 text-white shadow-xl' : ''}`}>{selectedEmployee.gender === 'Female' && '✓'}</div></div>
                </div>

                <div className="col-span-3 text-slate-400 italic">Social Category</div>
                <div className="col-span-9 flex gap-10">
                   {["SC", "ST", "OBC", "General"].map(cat => (
                     <div key={cat} className="flex items-center gap-3">
                        <span className="font-black">{cat}</span> 
                        <div className={`w-6 h-6 border-2 border-slate-900 flex items-center justify-center ${selectedEmployee.category === cat ? 'bg-slate-900 text-white shadow-md' : ''}`}>{selectedEmployee.category === cat && '✓'}</div>
                     </div>
                   ))}
                </div>

                <div className="col-span-3 text-slate-400 italic">Identity (Aadhaar)</div>
                <div className="col-span-9"><CharacterGrid length={12} value={selectedEmployee.aadhaar} /></div>
             </div>

             <div className="bg-slate-900 text-white p-3 border-l-[15px] border-blue-600 mb-6 font-black uppercase text-sm mt-14 italic tracking-widest">B. Banking & Disbursement Registry</div>
             <div className="grid grid-cols-2 gap-x-16 gap-y-6 text-[12px] font-black uppercase px-4">
                <div className="flex items-center gap-6">BANK NAME <div className="flex-grow border-b-2 border-slate-900 h-8 font-black text-slate-900 pt-1">{selectedEmployee.bankName}</div></div>
                <div className="flex items-center gap-6">BRANCH LOC <div className="flex-grow border-b-2 border-slate-900 h-8 font-black text-slate-900 pt-1">{selectedEmployee.branch}</div></div>
                <div className="flex items-center gap-6">ACCOUNT # <div className="flex-grow border-b-2 border-slate-900 h-8 font-black text-slate-900 pt-1">{selectedEmployee.accountNo}</div></div>
                <div className="flex items-center gap-6">IFSC CODE <div className="flex-grow border-b-2 border-slate-900 h-8 font-black text-slate-900 pt-1">{selectedEmployee.ifsc}</div></div>
             </div>

             <div className="bg-slate-900 text-white p-3 border-l-[15px] border-blue-600 mb-6 font-black uppercase text-sm mt-14 italic tracking-widest">C. Biometric Proof & Attestation</div>
             <div className="grid grid-cols-12 gap-10 items-start px-4">
                <div className="col-span-3 border-4 border-slate-900 h-56 flex items-center justify-center overflow-hidden shadow-2xl bg-white relative p-1">
                   {selectedEmployee.photo ? (
                      <img src={selectedEmployee.photo} className="w-full h-full object-cover" alt="Employee" />
                   ) : (
                      <div className="text-center">
                         <svg className="w-12 h-12 mx-auto text-slate-200 mb-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/></svg>
                         <span className="text-[10px] text-slate-300 font-black uppercase">PASTE PHOTO</span>
                      </div>
                   )}
                   <div className="absolute top-0 right-0 bg-slate-900 text-white text-[8px] px-2 font-black">VALID PHOTO</div>
                </div>
                <div className="col-span-9">
                   <div className="border-4 border-slate-100 h-56 p-6 relative bg-slate-50/50 shadow-inner rounded-sm">
                      <p className="text-[10px] font-bold leading-relaxed text-slate-500 italic">I HEREBY DECLARE THAT THE INFORMATION PROVIDED ABOVE IS TRUE AND ACCURATE TO THE BEST OF MY KNOWLEDGE. I ACKNOWLEDGE THAT ANY MISREPRESENTATION MAY LEAD TO IMMEDIATE TERMINATION OF SERVICE AND LEGAL CONSEQUENCES UNDER ORGANIZATION BY-LAWS.</p>
                      <div className="absolute bottom-6 right-8 text-center">
                         <div className="w-56 border-t-2 border-slate-900 pt-2 text-[10px] font-black uppercase tracking-widest">CANDIDATE SIGNATURE</div>
                         <p className="text-[8px] font-bold text-slate-300 mt-1 uppercase italic">(VERIFIED BY HR UNIT)</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <div className="mt-24 text-center text-[9px] font-black text-slate-200 uppercase tracking-[2.5em] italic">SECURE MASTER SYSTEM GENERATED RECORD NO. {selectedEmployee.id}</div>
        </div>
      ) : !hasSearched && (
        <div className="max-w-[1000px] mx-auto p-40 text-center bg-slate-50 border-4 border-dashed border-slate-200 rounded-3xl opacity-50">
           <svg className="w-24 h-24 mx-auto text-slate-200 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/></svg>
           <h3 className="text-3xl font-black text-slate-300 uppercase italic">AWAITING STAFF ID FOR LOAD...</h3>
           <p className="text-slate-400 mt-2 font-bold">The registry will populate automatically once a valid ID is provided above.</p>
        </div>
      )}
      
      <style>{`
        @media print {
           .no-print { display: none !important; }
           body { background: white !important; }
           #printable-area { border: 2px solid black !important; box-shadow: none !important; margin: 0 !important; width: 100% !important; }
           * { -webkit-print-color-adjust: exact !important; }
        }
      `}</style>
    </div>
  );
};

export default ApplicationFormEditor;
