
import React, { useState } from 'react';
import RegistrationForm from './components/RegistrationForm';
import AdminDashboard from './components/AdminDashboard';
import Header from './components/Header';

const App: React.FC = () => {
  const [view, setView] = useState<'form' | 'admin'>('form');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  const handleAdminClick = () => {
    if (isAdminAuthenticated) {
      setView('admin');
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '/@Setiabud1/') {
      setIsAdminAuthenticated(true);
      setShowLoginModal(false);
      setView('admin');
      setLoginError(false);
      setPassword('');
    } else {
      setLoginError(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 px-3 py-1.5 rounded-xl flex items-center justify-center text-white font-black text-sm tracking-tighter">
                PPDB
              </div>
              <span className="font-bold text-slate-800 text-lg tracking-tight hidden sm:block">PASET 2026</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setView('form')}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                  view === 'form' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Formulir
              </button>
              <button
                onClick={handleAdminClick}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                  view === 'admin' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Dashboard Admin
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setShowLoginModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 transform -rotate-3">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h3 className="text-2xl font-black text-slate-900">Akses Admin</h3>
              <p className="text-sm text-slate-500">Silakan masukkan kata sandi otorisasi.</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input 
                  type="password" 
                  autoFocus
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLoginError(false);
                  }}
                  className={`w-full px-5 py-4 border rounded-2xl outline-none transition-all text-center text-lg tracking-widest ${
                    loginError ? 'border-red-500 bg-red-50 ring-2 ring-red-100' : 'border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500'
                  }`}
                />
                {loginError && <p className="text-xs text-red-500 mt-3 font-bold text-center">Password tidak valid!</p>}
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 active:scale-[0.98] transition-all shadow-xl shadow-blue-200"
              >
                BUKA DASHBOARD
              </button>
            </form>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Header />
        
        <div className="mt-12 transition-all duration-500">
          {view === 'form' ? <RegistrationForm /> : <AdminDashboard />}
        </div>
      </main>

      <footer className="py-12 text-center text-slate-400 text-sm border-t border-slate-200 mt-20">
        <p className="font-bold text-slate-500">PASET 2026</p>
        <p className="mt-1">&copy; {new Date().getFullYear()} Advent II Setiabudi Bandung. Semua Hak Dilindungi.</p>
      </footer>
    </div>
  );
};

export default App;
