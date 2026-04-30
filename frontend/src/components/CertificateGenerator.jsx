import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Download, Loader2 } from 'lucide-react';

export default function CertificateGenerator({ attendance, volunteerName }) {
  const certificateRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    
    setIsGenerating(true);
    try {
      // Create canvas from the hidden certificate div
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2, // High resolution
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Standard A4 landscape
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Volunteer_Certificate_${attendance.event_details.title.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error("Error generating certificate:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!attendance.check_out || !attendance.event_details) return null;

  const eventTitle = attendance.event_details.title;
  const ngoName = attendance.event_details.ngo_name;
  const description = attendance.event_details.description || "";
  const completionDate = new Date(attendance.check_out).toLocaleDateString();

  return (
    <>
      <button 
        onClick={handleDownload} 
        disabled={isGenerating}
        className="flex items-center justify-center gap-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 w-full py-2.5 rounded-lg text-sm font-bold transition-colors dark:bg-emerald-900/40 dark:text-emerald-400 dark:hover:bg-emerald-900/60 mt-3 border border-emerald-200 dark:border-emerald-800"
      >
        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        {isGenerating ? "Generating PDF..." : "Download Certificate"}
      </button>

      {/* Hidden Certificate Container */}
      <div className="overflow-hidden h-0 w-0 absolute top-[-9999px] left-[-9999px]">
        <div 
          ref={certificateRef}
          className="bg-white p-12 text-center relative border-[12px] border-double border-emerald-600"
          style={{ width: '1123px', height: '794px', boxSizing: 'border-box', backgroundColor: '#fffefa' }}
        >
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-emerald-500"></div>
          <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-emerald-500"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-emerald-500"></div>
          <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-emerald-500"></div>

          <div className="mt-12 mb-8">
            <h1 className="text-6xl font-serif font-bold text-emerald-800 tracking-wider">CERTIFICATE</h1>
            <h2 className="text-3xl font-serif text-emerald-600 tracking-widest mt-3">OF APPRECIATION</h2>
          </div>

          <p className="text-2xl text-gray-600 mt-14 mb-6 font-serif italic">This certificate is proudly presented to</p>
          
          <h3 className="text-5xl font-bold text-gray-900 mb-10 font-serif border-b-2 border-gray-300 inline-block px-16 pb-3">
            {volunteerName}
          </h3>

          {attendance.event_details.custom_appreciation ? (
            <p className="text-2xl text-gray-700 leading-relaxed max-w-4xl mx-auto font-serif italic mb-8">
              "{attendance.event_details.custom_appreciation}"
            </p>
          ) : (
            <p className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto font-serif">
              In deepest appreciation of your outstanding dedication and valuable contribution as a volunteer for the event 
              <br />
              <strong className="text-emerald-700 font-bold text-3xl block my-4">"{eventTitle}"</strong> 
              conducted by <strong className="text-emerald-700 font-bold">{ngoName}</strong>.
            </p>
          )}

          <p className="text-lg text-gray-500 leading-relaxed max-w-3xl mx-auto mt-6 italic font-serif">
            "{description.length > 150 ? description.substring(0, 150) + '...' : description}"
          </p>

          <div className="absolute bottom-24 left-0 right-0 flex justify-around px-24">
            <div className="text-center">
              <div className="w-64 h-px bg-gray-400 mb-3"></div>
              <p className="text-gray-800 font-serif text-xl">{completionDate}</p>
              <p className="text-gray-500 font-serif text-md mt-1 uppercase tracking-widest">Date</p>
            </div>
            
            <div className="text-center relative">
              <div className="w-64 flex justify-center items-center mb-3 h-16 relative">
                 <div className="absolute -top-10 w-24 h-24 rounded-full border-[6px] border-red-500/30 flex items-center justify-center -rotate-12 z-0">
                   <span className="text-red-500/50 font-bold font-serif text-lg tracking-tighter">VERIFIED</span>
                 </div>
              </div>
              <div className="w-64 h-px bg-gray-400 mb-3 relative z-10"></div>
              <p className="text-gray-800 font-serif text-xl truncate px-2">{ngoName}</p>
              <p className="text-gray-500 font-serif text-md mt-1 uppercase tracking-widest">Organization</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
