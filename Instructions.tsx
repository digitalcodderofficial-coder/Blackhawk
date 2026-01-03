
import React from 'react';

const Instructions: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const features = [
    { title: "Read Instructions", eng: "Guide for all modules.", hin: "सभी मॉड्यूल के लिए गाइड।" },
    { title: "School Profile", eng: "Update organization details.", hin: "संस्था का विवरण अपडेट करें।" },
    { title: "Upload Logo", eng: "Manage brand identity.", hin: "ब्रांड पहचान प्रबंधित करें।" },
    { title: "Add/Blank Form", eng: "New staff registration system.", hin: "नई स्टाफ पंजीकरण प्रणाली।" },
    { title: "Database", eng: "View all staff records in a table.", hin: "सभी रिकॉर्ड तालिका में देखें।" },
    { title: "Salary Calc", eng: "Automatic payroll engine with DA/TA/PF.", hin: "DA/TA/PF के साथ ऑटो पेरोल इंजन।" },
    { title: "Attendance Tracker", eng: "Monthly attendance monitoring.", hin: "मासिक उपस्थिति निगरानी।" },
    { title: "ID Card / Letters", eng: "Auto-generate official documents.", hin: "आधिकारिक दस्तावेज ऑटो-जेनरेट करें।" },
    { title: "Payment Record", eng: "Cash/Bank transaction ledger.", hin: "नकद/बैंक लेनदेन लेजर।" },
    { title: "Search Autofill", eng: "Enter ID to auto-populate any form.", hin: "फॉर्म भरने के लिए ID डालें, विवरण अपने आप आ जाएगा।" },
  ];

  return (
    <div className="bg-white p-6 border-4 border-slate-300 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8 border-b-4 border-slate-900 pb-4">
        <h2 className="text-3xl font-black italic uppercase">System Guide / निर्देशिका</h2>
        <button onClick={onBack} className="bg-slate-900 text-white px-8 py-2 text-xs font-black uppercase">Back</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((f, i) => (
          <div key={i} className="p-4 bg-slate-50 border-l-8 border-blue-600 shadow-sm">
            <h4 className="font-black text-slate-900 uppercase mb-1">{f.title}</h4>
            <p className="text-xs text-slate-600 font-bold mb-1">Eng: {f.eng}</p>
            <p className="text-xs text-blue-700 font-bold">Hindi: {f.hin}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-12 bg-slate-900 text-white p-6 rounded">
        <h3 className="text-xl font-black mb-4 underline">Pro Tip / विशेष सुझाव</h3>
        <p className="text-sm font-bold leading-relaxed italic opacity-80">
          Search Autofill Feature: Whenever you need to fill a form for an existing employee, just enter their ID at the top. The system will pull all data from the database automatically.
          <br/><br/>
          सर्च ऑटोफिल फीचर: जब भी आपको किसी मौजूदा कर्मचारी के लिए फॉर्म भरना हो, बस ऊपर उनकी आईडी दर्ज करें। सिस्टम डेटाबेस से सारा डेटा अपने आप निकाल लेगा।
        </p>
      </div>
    </div>
  );
};

export default Instructions;
