import React, { useState } from 'react';
import { CompanyProfile } from '../types';

interface InvoiceItem {
  id: string;
  slNo: string;
  particulars: string;
  qty: number;
  rate: number;
}

// Fix: Defined props interface to include company
interface GstCalculatorProps {
  onBack: () => void;
  company: CompanyProfile;
}

const GstCalculator: React.FC<GstCalculatorProps> = ({ onBack, company }) => {
  const [billConfig, setBillConfig] = useState({
    // Header Labels & Values
    gstNoLabel: "GST No:",
    companyGstNo: "27ABCDE1234F1Z5",
    invoiceTitle: "Tax Invoice Bill",
    dateLabel: "Date:",
    date: new Date().toISOString().split('T')[0],
    
    // Company Details - Fix: Use dynamic company data from props
    companyName: company.name,
    companyAddress: company.address,
    companyPhoneLabel: "PH NO:",
    companyPhone: company.contact,
    companyEmailLabel: "EMAIL:",
    companyEmail: company.email,
    
    // Customer Section Labels & Values
    customerNameLabel: "NAME:",
    customerName: "",
    customerAddressLabel: "ADDRESS:",
    customerAddress: "",
    invoiceNoLabel: "INVOICE NO:",
    invoiceNo: `INV-${Math.floor(Math.random() * 9000 + 1000)}`,
    mobileLabel: "MOBILE:",
    mobile: "",
    emailLabel: "EMAIL:",
    email: "",
    
    // Table Headings
    slNoHeading: "SL. NO.",
    particularsHeading: "PARTICULARS / ITEM DESCRIPTION",
    qtyHeading: "QTY",
    rateHeading: "RATE (₹)",
    amountHeading: "AMOUNT (₹)",
    
    // Footer Labels
    inWordsLabel: "AMOUNT IN WORDS:",
    thankYouLabel: "THANK YOU AND VISIT AGAIN.",
    signatureLabel: "AUTHORIZED SIGNATURE",
    subTotalLabel: "SUB TOTAL",
    taxLabel: "GST",
    totalLabel: "GRAND TOTAL",
    
    // Logic Settings
    gstRate: 18,
    isGstInclusive: false,
    manualAmountInWords: ""
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', slNo: '1', particulars: 'SERVICE / PRODUCT ITEM', qty: 1, rate: 0 }
  ]);

  const addItem = () => {
    const nextSl = (items.length + 1).toString();
    setItems([...items, { id: Date.now().toString(), slNo: nextSl, particulars: '', qty: 1, rate: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const calculateTotals = () => {
    const rawSubTotal = items.reduce((acc, item) => acc + (item.qty * (item.rate || 0)), 0);
    let subTotal, taxAmount, totalAmount;

    if (billConfig.isGstInclusive) {
      totalAmount = rawSubTotal;
      subTotal = totalAmount / (1 + (billConfig.gstRate / 100));
      taxAmount = totalAmount - subTotal;
    } else {
      subTotal = rawSubTotal;
      taxAmount = (subTotal * billConfig.gstRate) / 100;
      totalAmount = subTotal + taxAmount;
    }

    return { subTotal, taxAmount, totalAmount };
  };

  const { subTotal, taxAmount, totalAmount } = calculateTotals();

  const numberToWords = (num: number) => {
    const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
    const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    const numStr = Math.round(num).toString();
    if (numStr.length > 9) return 'AMOUNT TOO LARGE';
    let n: any = ('000000000' + numStr).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return ''; 
    let str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
    return str.toUpperCase();
  };

  const handleConfigChange = (field: string, value: string | number | boolean) => {
    setBillConfig(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-full mx-auto animate-in fade-in duration-500 pb-20 overflow-x-hidden">
      {/* PROFESSIONAL CONTROL BAR */}
      <div className="bg-[#121826] p-6 mb-10 flex flex-col lg:flex-row justify-between items-center gap-8 no-print border-b-8 border-blue-600 rounded-3xl shadow-2xl mx-2">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-white text-4xl shadow-2xl border-2 border-white">B</div>
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white italic uppercase tracking-tighter leading-none">Bill Creator PRO</h2>
            <p className="text-blue-400 text-[11px] font-black uppercase tracking-widest mt-2 border-l-2 border-blue-500 pl-4">Architecture by Aditya Kumar Rai</p>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center items-end gap-6">
          <div className="flex flex-col gap-2">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">GST Method</label>
             <div className="bg-slate-800 p-1.5 rounded-xl flex border-2 border-slate-700 shadow-inner">
                <button onClick={() => handleConfigChange('isGstInclusive', false)} className={`px-6 py-2.5 text-[11px] font-black uppercase rounded-lg transition-all ${!billConfig.isGstInclusive ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-400 hover:text-white'}`}>Exclusive</button>
                <button onClick={() => handleConfigChange('isGstInclusive', true)} className={`px-6 py-2.5 text-[11px] font-black uppercase rounded-lg transition-all ${billConfig.isGstInclusive ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-400 hover:text-white'}`}>Inclusive</button>
             </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1">Tax Rate (%)</label>
            <select 
              className="bg-white text-slate-900 border-2 border-slate-400 px-6 py-3 rounded-xl font-black text-sm outline-none shadow-xl min-w-[150px] cursor-pointer hover:bg-slate-50 transition-colors"
              value={billConfig.gstRate}
              onChange={(e) => handleConfigChange('gstRate', Number(e.target.value))}
            >
              {[0, 5, 12, 18, 28].map(r => <option key={r} value={r}>TAX: {r}%</option>)}
            </select>
          </div>

          <button onClick={onBack} className="bg-slate-800 text-white px-8 py-3.5 rounded-xl font-black uppercase text-xs border-2 border-slate-600 hover:bg-black transition-all">Go Back</button>
          <button onClick={() => window.print()} className="bg-green-600 text-white px-12 py-4 rounded-xl font-black uppercase text-sm shadow-2xl hover:bg-green-700 border-b-4 border-green-900 active:translate-y-1 transition-all tracking-widest">Generate Bill</button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-10 px-4">
        {/* SIDEBAR EDITOR */}
        <div className="xl:w-[450px] space-y-8 no-print overflow-y-auto max-h-[1100px] custom-scrollbar pr-3 pb-20 flex-shrink-0">
          <div className="bg-white p-8 rounded-[40px] border-4 border-slate-100 shadow-2xl space-y-6">
            <h3 className="text-sm font-black text-blue-600 uppercase tracking-[0.3em] border-b-4 border-blue-50 pb-3">1. Business Setup</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Company Name" className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl font-black text-slate-900 focus:border-blue-500 shadow-sm" value={billConfig.companyName} onChange={e => handleConfigChange('companyName', e.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                 <input type="text" placeholder="GST Label" className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl font-black text-xs" value={billConfig.gstNoLabel} onChange={e => handleConfigChange('gstNoLabel', e.target.value)} />
                 <input type="text" placeholder="GST Reg #" className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl font-black text-xs" value={billConfig.companyGstNo} onChange={e => handleConfigChange('companyGstNo', e.target.value)} />
              </div>
              <textarea placeholder="Official Address" className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl font-black text-slate-900 h-24 resize-none outline-none focus:border-blue-500 shadow-sm" value={billConfig.companyAddress} onChange={e => handleConfigChange('companyAddress', e.target.value)} />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] border-4 border-slate-100 shadow-2xl space-y-6">
            <h3 className="text-sm font-black text-green-600 uppercase tracking-[0.3em] border-b-4 border-green-50 pb-3">2. Client Setup</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Client Name" className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl font-black text-slate-900 outline-none focus:border-green-500 shadow-sm" value={billConfig.customerName} onChange={e => handleConfigChange('customerName', e.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                 <input type="text" placeholder="Invoice Number" className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl font-black text-xs" value={billConfig.invoiceNo} onChange={e => handleConfigChange('invoiceNo', e.target.value)} />
                 <input type="date" className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl font-black text-xs" value={billConfig.date} onChange={e => handleConfigChange('date', e.target.value)} />
              </div>
              <textarea placeholder="Client Address" className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl font-black text-slate-900 h-20 resize-none outline-none focus:border-green-500 shadow-sm" value={billConfig.customerAddress} onChange={e => handleConfigChange('customerAddress', e.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                 <input type="text" placeholder="Mobile" className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl font-black text-xs" value={billConfig.mobile} onChange={e => handleConfigChange('mobile', e.target.value)} />
                 <input type="text" placeholder="Email" className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl font-black text-xs" value={billConfig.email} onChange={e => handleConfigChange('email', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] border-4 border-slate-100 shadow-2xl space-y-6">
            <h3 className="text-sm font-black text-orange-600 uppercase tracking-[0.3em] border-b-4 border-orange-50 pb-3">3. Product Details</h3>
            <div className="space-y-5">
               {items.map((item, idx) => (
                 <div key={item.id} className="p-5 bg-slate-50 rounded-3xl border-2 border-slate-100 space-y-3 relative group shadow-sm transition-all hover:border-orange-200">
                   <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <label className="text-[10px] font-black text-slate-400">SL. NO.</label>
                        <input type="text" className="w-12 bg-white border border-slate-300 rounded p-0.5 text-center font-black text-[11px] shadow-sm" value={item.slNo} onChange={e => updateItem(item.id, 'slNo', e.target.value)} />
                      </div>
                      {items.length > 1 && (
                        <button onClick={() => removeItem(item.id)} className="text-red-500 font-black p-1 hover:bg-red-50 rounded-lg">✕</button>
                      )}
                   </div>
                   <input type="text" placeholder="Description" className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-black text-xs outline-none" value={item.particulars} onChange={(e) => updateItem(item.id, 'particulars', e.target.value)} />
                   <div className="grid grid-cols-2 gap-3">
                     <div className="relative">
                        <label className="text-[9px] font-black text-slate-500 block mb-1 uppercase tracking-widest">Qty</label>
                        <input type="number" className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-black text-xs text-center" value={item.qty} onChange={(e) => updateItem(item.id, 'qty', Number(e.target.value))} />
                     </div>
                     <div className="relative">
                        <label className="text-[9px] font-black text-slate-500 block mb-1 uppercase tracking-widest">Rate (₹)</label>
                        <input type="number" className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-black text-xs text-center" value={item.rate} onChange={(e) => updateItem(item.id, 'rate', Number(e.target.value))} />
                     </div>
                   </div>
                 </div>
               ))}
               <button onClick={addItem} className="w-full p-4 bg-blue-50 text-blue-600 rounded-2xl font-black uppercase text-xs border-2 border-dashed border-blue-200 hover:bg-blue-100 transition-all">+ ADD NEW ITEM ROW</button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] border-4 border-slate-100 shadow-2xl space-y-6">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] border-b-4 border-slate-50 pb-3">4. Final Customizer</h3>
            <div className="space-y-4">
               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Manual Amount in Words</label>
                  <input type="text" placeholder="Leave empty for auto-generated" className="w-full p-3 bg-slate-50 border-2 border-slate-200 rounded-xl font-black text-xs text-blue-700 italic outline-none focus:border-blue-400" value={billConfig.manualAmountInWords} onChange={e => handleConfigChange('manualAmountInWords', e.target.value)} />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  {[
                    { k: 'invoiceTitle', l: 'Main Title' },
                    { k: 'slNoHeading', l: 'SL NO Heading' },
                    { k: 'particularsHeading', l: 'Description Heading' },
                    { k: 'qtyHeading', l: 'Qty Heading' },
                    { k: 'rateHeading', l: 'Rate Heading' },
                    { k: 'amountHeading', l: 'Amount Heading' },
                    { k: 'thankYouLabel', l: 'Greeting' },
                    { k: 'signatureLabel', l: 'Signature Text' },
                  ].map(cfg => (
                    <div key={cfg.k}>
                        <label className="text-[8px] font-black text-slate-400 uppercase mb-1 block">{cfg.l}</label>
                        <input type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-black text-[10px] outline-none focus:border-blue-400" value={(billConfig as any)[cfg.k]} onChange={e => handleConfigChange(cfg.k, e.target.value)} />
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>

        {/* PROFESSIONAL BILL PREVIEW SHEET */}
        <div className="flex-1 overflow-x-auto custom-scrollbar no-print-scroll bg-slate-400/20 p-8 md:p-14 rounded-[50px] border-4 border-slate-300 shadow-inner">
          <div id="printable-area" className="bg-white p-14 md:p-20 border-[8px] border-black min-h-[1200px] w-full min-w-[950px] flex flex-col text-black font-sans shadow-2xl print:p-0 print:border-none print:shadow-none print:m-0 print:w-full box-border relative">
            
            {/* Header Identity */}
            <div className="flex justify-between items-end border-b-[5px] border-black pb-10 mb-14">
               <div className="flex flex-col gap-2 w-[250px]">
                  <span className="text-[14px] font-black uppercase text-gray-400 tracking-wider mb-1">{billConfig.gstNoLabel}</span>
                  <span className="text-[20px] font-black uppercase border-b-2 border-black/10 pb-1 min-h-[30px] inline-block">{billConfig.companyGstNo}</span>
               </div>
               <div className="text-center flex-1 mx-8">
                  <h1 className="text-5xl font-black uppercase italic tracking-tighter border-[6px] border-black px-16 py-5 bg-white shadow-[12px_12px_0px_#000] inline-block">
                    {billConfig.invoiceTitle}
                  </h1>
               </div>
               <div className="flex flex-col gap-2 text-right w-[250px]">
                  <span className="text-[14px] font-black uppercase text-gray-400 tracking-wider mb-1">{billConfig.dateLabel}</span>
                  <span className="text-[20px] font-black border-b-2 border-black/10 pb-1 inline-block min-h-[30px]">{new Date(billConfig.date).toLocaleDateString('en-GB')}</span>
               </div>
            </div>

            {/* Corporate Logo / Name Area */}
            <div className="text-center mb-20 px-10">
               <h2 className="text-7xl md:text-[85px] font-black uppercase tracking-tighter leading-none mb-6 drop-shadow-md text-black">{billConfig.companyName}</h2>
               <div className="max-w-4xl mx-auto space-y-4 border-t-4 border-black/10 pt-8">
                 <p className="text-[19px] font-black uppercase tracking-[0.25em] leading-relaxed text-gray-800">{billConfig.companyAddress}</p>
                 <div className="flex justify-center items-center gap-12 text-[15px] font-black uppercase mt-8 text-black">
                    <div className="flex gap-3"><span>{billConfig.companyPhoneLabel}</span> <span className="underline decoration-blue-600 decoration-[4px] underline-offset-4 font-black">{billConfig.companyPhone}</span></div>
                    <div className="w-4 h-4 bg-black rounded-full"></div>
                    <div className="flex gap-3"><span>{billConfig.companyEmailLabel}</span> <span className="underline decoration-blue-600 decoration-[4px] underline-offset-4 font-black lowercase">{billConfig.companyEmail}</span></div>
                 </div>
               </div>
            </div>

            {/* Customer Section */}
            <div className="border-y-[6px] border-black py-16 mb-14 text-black">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12 font-black text-[20px] uppercase text-black">
                 <div className="flex gap-6 items-center">
                    <span className="whitespace-nowrap min-w-[150px] text-gray-400">{billConfig.customerNameLabel}</span> 
                    <span className="flex-1 border-b-[4px] border-black h-12 leading-[48px] italic font-black text-black px-2">{billConfig.customerName}</span>
                 </div>
                 <div className="flex gap-6 items-center">
                    <span className="whitespace-nowrap min-w-[150px] text-gray-400">{billConfig.invoiceNoLabel}</span> 
                    <span className="flex-1 border-b-[4px] border-black h-12 leading-[48px] font-black text-black tracking-[0.2em] px-2">{billConfig.invoiceNo}</span>
                 </div>
                 <div className="flex gap-6 items-start col-span-1 md:col-span-2">
                    <span className="whitespace-nowrap min-w-[150px] text-gray-400">{billConfig.customerAddressLabel}</span> 
                    <span className="flex-1 border-b-[4px] border-black min-h-[48px] leading-[48px] italic font-black text-black px-2">{billConfig.customerAddress}</span>
                 </div>
                 <div className="flex gap-6 items-center">
                    <span className="whitespace-nowrap min-w-[150px] text-gray-400">{billConfig.mobileLabel}</span> 
                    <span className="flex-1 border-b-[4px] border-black h-12 leading-[48px] italic font-black text-black px-2">{billConfig.mobile}</span>
                 </div>
                 <div className="flex gap-6 items-center">
                    <span className="whitespace-nowrap min-w-[150px] text-gray-400">{billConfig.emailLabel}</span> 
                    <span className="flex-1 border-b-[4px] border-black h-12 leading-[48px] font-black text-black italic lowercase px-2">{billConfig.email}</span>
                 </div>
              </div>
            </div>

            {/* Billing Table */}
            <div className="flex-grow border-[6px] border-black rounded-sm overflow-hidden bg-white mb-10 shadow-md">
              <table className="w-full h-full border-collapse text-[18px] font-black uppercase table-fixed">
                 <thead>
                    <tr className="border-b-[6px] border-black bg-[#121826] text-white">
                       <th className="border-r-[4px] border-white/20 p-6 w-[10%] text-center tracking-widest">{billConfig.slNoHeading}</th>
                       <th className="border-r-[4px] border-white/20 p-6 text-left w-[45%] tracking-widest">{billConfig.particularsHeading}</th>
                       <th className="border-r-[4px] border-white/20 p-6 w-[12%] text-center tracking-widest">{billConfig.qtyHeading}</th>
                       <th className="border-r-[4px] border-white/20 p-6 w-[15%] text-center tracking-widest">{billConfig.rateHeading}</th>
                       <th className="p-6 w-[18%] text-right tracking-widest">{billConfig.amountHeading}</th>
                    </tr>
                 </thead>
                 <tbody className="align-top">
                    {items.map((item) => (
                       <tr key={item.id} className="min-h-[75px] border-b-[4px] border-black/20 last:border-b-0">
                          <td className="border-r-[4px] border-black p-6 text-center font-black text-black text-[22px] bg-white">{item.slNo}</td>
                          <td className="border-r-[4px] border-black p-6 text-left font-black tracking-tight text-black text-[20px]">{item.particulars}</td>
                          <td className="border-r-[4px] border-black p-6 text-center font-black text-black text-[20px]">{item.qty || ''}</td>
                          <td className="border-r-[4px] border-black p-6 text-center font-black text-black text-[20px]">{item.rate ? item.rate.toLocaleString('en-IN') : ''}</td>
                          <td className="p-6 text-right font-black text-black text-[20px]">₹{(item.qty * (item.rate || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                       </tr>
                    ))}
                    {Array.from({ length: Math.max(0, 10 - items.length) }).map((_, i) => (
                       <tr key={`empty-${i}`} className="min-h-[75px] border-b-[2px] border-black/5 last:border-b-0">
                          <td className="border-r-[4px] border-black p-6">&nbsp;</td>
                          <td className="border-r-[4px] border-black p-6">&nbsp;</td>
                          <td className="border-r-[4px] border-black p-6">&nbsp;</td>
                          <td className="border-r-[4px] border-black p-6">&nbsp;</td>
                          <td className="p-6">&nbsp;</td>
                       </tr>
                    ))}
                 </tbody>
                 <tfoot className="border-t-[6px] border-black">
                    <tr className="bg-[#fcfcfc]">
                       <td colSpan={3} rowSpan={3} className="border-r-[6px] border-black p-14 align-top">
                          <div className="flex flex-col h-full justify-between min-h-[350px]">
                             <div>
                                <span className="text-[16px] block mb-6 underline font-black uppercase text-gray-400 tracking-[0.4em]">{billConfig.inWordsLabel}</span>
                                <span className="text-[26px] leading-snug text-blue-900 font-black italic underline decoration-blue-200 decoration-4 underline-offset-[16px]">
                                   {billConfig.manualAmountInWords || numberToWords(totalAmount)}
                                </span>
                             </div>
                             <div className="mt-auto italic text-[24px] font-black uppercase tracking-[0.6em] border-l-[20px] border-black pl-10 text-black leading-[1.4]">
                                {billConfig.thankYouLabel}
                             </div>
                          </div>
                       </td>
                       <td className="border-r-[4px] border-black p-8 text-right font-black text-[22px] uppercase text-gray-500">{billConfig.subTotalLabel}</td>
                       <td className="p-8 text-right font-black text-[26px] text-black">₹{subTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                    <tr className="border-t-2 border-black/10 bg-[#fcfcfc]">
                       <td className="border-r-[4px] border-black p-8 text-right font-black text-[22px] uppercase text-gray-500">{billConfig.taxLabel} ({billConfig.gstRate}%)</td>
                       <td className="p-8 text-right font-black text-[26px] text-black">₹{taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                    {/* FIXED GRAND TOTAL SECTION - ZERO OVERLAP PATTERN */}
                    <tr className="border-t-[6px] border-black bg-black text-white shadow-2xl">
                       <td colSpan={2} className="p-0 border-none">
                          <div className="flex justify-between items-center w-full px-12 py-12">
                             <div className="font-black text-[32px] uppercase italic tracking-tighter leading-none">
                                {billConfig.totalLabel}
                             </div>
                             <div className="font-black text-[56px] tracking-tighter leading-none whitespace-nowrap">
                                ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                             </div>
                          </div>
                       </td>
                    </tr>
                 </tfoot>
              </table>
            </div>

            {/* Bottom Signature Area */}
            <div className="mt-40 flex justify-between items-end px-16 text-black">
               <div className="text-[13px] font-black opacity-30 italic font-mono tracking-widest uppercase">
                  VERIFIED-TXN-ID: {Date.now().toString().slice(-14)}
               </div>
               <div className="text-center w-[450px]">
                  <div className="h-[6px] bg-black mb-12 shadow-sm"></div>
                  <p className="font-black uppercase text-[22px] tracking-[0.6em] leading-none">{billConfig.signatureLabel}</p>
                  <p className="text-[16px] font-black opacity-70 uppercase mt-5 italic tracking-[0.3em]">FOR {billConfig.companyName}</p>
               </div>
            </div>

            {/* Developer Seal */}
            <div className="mt-auto pt-36 border-t-[4px] border-gray-100 flex justify-center items-center opacity-10 text-[13px] font-black uppercase tracking-[2.5em] font-mono text-black text-center w-full">
               <span>MASTER ENGINE ENGINEERED BY ADITYA KUMAR RAI</span>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @media print {
          .no-print { display: none !important; }
          #printable-area { 
            border: none !important; 
            width: 100% !important; 
            height: auto !important; 
            padding: 0 !important; 
            margin: 0 !important; 
            background: white !important;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          body { background: white !important; padding: 0 !important; margin: 0 !important; }
          * { -webkit-print-color-adjust: exact !important; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 10px; height: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #121826; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #3b82f6; border-radius: 12px; }
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
        .no-print-scroll { overflow-y: visible !important; }
        td, th { vertical-align: middle; box-sizing: border-box; }
        table { border-collapse: collapse; }
      `}</style>
    </div>
  );
};

export default GstCalculator;