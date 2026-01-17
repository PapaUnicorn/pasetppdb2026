
import React, { useState, useEffect } from 'react';
import { Submission, FormData, Jenjang } from '../types';

const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzGsVdnxnpW_dYwRKnwq90a2AvywvaIYu72zRMqrpmN5X6nTqdNsJ3njgDSXjflgnTP/exec';

const AdminDashboard: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalData, setModalData] = useState<Partial<FormData>>({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(WEB_APP_URL);
      const data = await response.json();
      // Even if the spreadsheet only has headers, doGet returns an empty array now
      setSubmissions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal mengambil data cloud database.");
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (action: 'create' | 'update' | 'delete', id?: string, data?: any) => {
    setLoading(true);
    try {
      await fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, id, data })
      });
      // Delay allows Google Script to complete write before re-fetching
      setTimeout(fetchData, 2000);
    } catch (err) {
      alert("Operasi cloud gagal. Periksa koneksi internet.");
      setLoading(false);
    }
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      handleAction('update', editingId, modalData);
    } else {
      const newId = Math.random().toString(36).substr(2, 9);
      handleAction('create', undefined, { ...modalData, id: newId, timestamp: new Date().toLocaleString('id-ID') });
    }
    setShowModal(false);
  };

  const handleExportCSV = () => {
    if (submissions.length === 0) {
      alert("Tidak ada data untuk diunduh.");
      return;
    }
    const headers = [
      "ID", "Timestamp", "Jenjang", "Kelas", "Nama Lengkap", "NIK", "Jenis Kelamin", 
      "Tempat Lahir", "Tanggal Lahir", "Agama", "Alamat Domisili", "NISN", "Asal Sekolah", 
      "Alamat Sekolah", "Nama Ayah", "Pekerjaan Ayah", "WA Ayah", "Nama Ibu", 
      "Pekerjaan Ibu", "WA Ibu", "Tinggi", "Berat", "Penyakit", "Hobi"
    ];
    
    const keys = ["id", "timestamp", "jenjang", "kelas", "namaLengkap", "nik", "jenisKelamin", "tempatLahir", "tanggalLahir", "agama", "alamatDomisili", "nisn", "asalSekolah", "alamatSekolahAsal", "namaAyah", "pekerjaanAyah", "waAyah", "namaIbu", "pekerjaanIbu", "waIbu", "tinggiBadan", "beratBadan", "riwayatPenyakit", "hobi"];

    const rows = submissions.map(s => keys.map(k => `"${(s[k as keyof Submission] || '').toString().replace(/"/g, '""')}"`).join(","));
    const csvContent = "\ufeff" + [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `PPDB_Advent_Cloud_${new Date().toLocaleDateString('id-ID').replace(/\//g, '-')}.csv`;
    link.click();
  };

  const filteredData = submissions.filter(s => 
    s.namaLengkap?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.nik?.includes(searchTerm) ||
    s.jenjang?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Static keys for table consistency
  const tableKeys = ["id", "timestamp", "namaLengkap", "jenjang", "kelas", "nik", "jenisKelamin", "tempatLahir", "tanggalLahir", "agama", "alamatDomisili", "nisn", "asalSekolah", "alamatSekolahAsal", "namaAyah", "waAyah", "namaIbu", "waIbu", "tinggiBadan", "beratBadan", "riwayatPenyakit", "hobi"];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex-wrap gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Pusat Data Cloud PPDB</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <p className="text-xs text-slate-500 font-mono">Synced to Spreadsheet (SaaS Enabled)</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchData} className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition border border-slate-200" title="Refresh Data">
            <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
          <button onClick={handleExportCSV} className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition flex items-center gap-2 shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Export .CSV
          </button>
          <button onClick={() => { setEditingId(null); setModalData({ jenjang: 'TK', kelas: 'TK A', agama: 'Kristen Advent' }); setShowModal(true); }} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition shadow-md">
            + Tambah Manual
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50/50">
          <div className="relative">
            <input type="text" placeholder="Cari Nama Lengkap, NIK, atau Jenjang..." className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            <svg className="w-5 h-5 absolute left-3 top-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[3000px]">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-widest border-b border-slate-200">
                <th className="px-6 py-5 sticky left-0 bg-slate-50 z-20 shadow-md">Aksi</th>
                {tableKeys.map(h => (
                  <th key={h} className="px-6 py-5">{h.replace(/([A-Z])/g, ' $1')}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && submissions.length === 0 ? (
                <tr><td colSpan={30} className="p-20 text-center text-slate-400 animate-pulse font-medium">Mengkoneksikan ke Cloud Database (Google Sheets)...</td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan={30} className="p-20 text-center text-slate-400">Database kosong atau data tidak ditemukan.</td></tr>
              ) : filteredData.map((s) => (
                <tr key={s.id} className="hover:bg-blue-50/40 transition-colors text-[11px] text-slate-700 group">
                  <td className="px-6 py-4 sticky left-0 bg-white z-10 shadow-md group-hover:bg-blue-50/40 transition-colors">
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingId(s.id); setModalData(s); setShowModal(true); }} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition" title="Edit Data">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => { if(confirm("Hapus data pendaftar ini secara permanen dari Cloud?")) handleAction('delete', s.id); }} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition" title="Hapus Data">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                  {tableKeys.map(key => (
                    <td key={key} className="px-6 py-4 whitespace-nowrap">
                      {key === 'jenjang' ? (
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${s[key] === 'TK' ? 'bg-green-100 text-green-700' : s[key] === 'SD' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                          {s[key]}
                        </span>
                      ) : key === 'namaLengkap' ? (
                        <span className="font-bold text-slate-900">{s[key as keyof Submission]}</span>
                      ) : (
                        s[key as keyof Submission] || '-'
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-500 flex justify-between items-center">
          <div className="flex gap-4">
            <span>Total: <b>{filteredData.length}</b> Pendaftar</span>
            <span className="text-slate-300">|</span>
            <span>Cloud ID: <span className="font-mono">...r0p8</span></span>
          </div>
          <span className="italic">Geser tabel ke kanan untuk melihat rincian lengkap &raquo;</span>
        </div>
      </div>

      {/* MODAL EDIT/ADD */}
      {showModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-0 my-8 overflow-hidden animate-in zoom-in duration-200">
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-slate-800">{editingId ? 'Edit Data Pendaftar Cloud' : 'Registrasi Manual ke Cloud'}</h3>
                <p className="text-xs text-slate-500 mt-1">Data akan langsung terupdate di Google Spreadsheet.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleModalSubmit} className="p-8 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {/* Siswa */}
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800 border-b pb-2 flex items-center gap-2">Identitas Calon Siswa</h4>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Lengkap</label>
                    <input className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={modalData.namaLengkap || ''} onChange={e => setModalData({...modalData, namaLengkap: e.target.value})} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Jenjang</label>
                      <select className="w-full p-2.5 border border-slate-200 rounded-xl text-sm outline-none" value={modalData.jenjang} onChange={e => setModalData({...modalData, jenjang: e.target.value as Jenjang})}>
                        <option value="TK">TK</option><option value="SD">SD</option><option value="SMP">SMP</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">NIK</label>
                      <input className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={modalData.nik || ''} onChange={e => setModalData({...modalData, nik: e.target.value})} required />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Alamat Domisili</label>
                    <textarea className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={modalData.alamatDomisili || ''} onChange={e => setModalData({...modalData, alamatDomisili: e.target.value})} rows={3} />
                  </div>
                </div>
                {/* Orang Tua */}
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800 border-b pb-2 flex items-center gap-2">Data Kontak & Orang Tua</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Ayah Kandung</label>
                      <input className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={modalData.namaAyah || ''} onChange={e => setModalData({...modalData, namaAyah: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">WA Ayah</label>
                      <input className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono" value={modalData.waAyah || ''} onChange={e => setModalData({...modalData, waAyah: e.target.value})} />
                    </div>
                    <div className="space-y-1 mt-4">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Ibu Kandung</label>
                      <input className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={modalData.namaIbu || ''} onChange={e => setModalData({...modalData, namaIbu: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">WA Ibu</label>
                      <input className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono" value={modalData.waIbu || ''} onChange={e => setModalData({...modalData, waIbu: e.target.value})} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-12 flex justify-end gap-3 pt-8 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 font-semibold text-slate-600 hover:bg-slate-100 rounded-2xl transition">Batal</button>
                <button type="submit" className="px-10 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                  {editingId ? 'Simpan Perubahan ke Cloud' : 'Daftarkan Manual ke Cloud'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
