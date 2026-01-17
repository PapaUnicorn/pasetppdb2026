
import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="text-center space-y-4 mb-12">
      <div className="inline-block px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-2 border border-blue-100 shadow-sm">
        Official Enrollment System
      </div>
      <h1 className="font-black text-slate-900 tracking-tight leading-none" style={{ fontSize: '38px' }}>
        PASET <span className="text-blue-600">2026</span>
      </h1>
      <div className="space-y-1">
        <h2 className="text-slate-500 font-bold uppercase tracking-widest text-xs">
          Formulir Pendaftaran Peserta Didik Baru
        </h2>
        <p className="text-slate-400 font-medium text-sm">
          Perguruan Advent II Setiabudi Bandung (TK - SD - SMP)
        </p>
      </div>
      <div className="flex justify-center pt-4">
        <div className="flex gap-1">
          <div className="h-1.5 w-12 bg-blue-600 rounded-full"></div>
          <div className="h-1.5 w-4 bg-blue-200 rounded-full"></div>
          <div className="h-1.5 w-2 bg-blue-100 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Header;
