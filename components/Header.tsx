
import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="text-center space-y-2">
      <h1 className="font-bold text-slate-900 tracking-tight" style={{ fontSize: '20px' }}>
        Formulir Pendaftaran Peserta Didik Baru
      </h1>
      <h2 className="text-slate-600 font-medium" style={{ fontSize: '15px' }}>
        TK-SD-SMP Advent II Setiabudi Bandung
      </h2>
      <div className="flex justify-center mt-4">
        <div className="h-1 w-20 bg-blue-600 rounded-full"></div>
      </div>
    </div>
  );
};

export default Header;
