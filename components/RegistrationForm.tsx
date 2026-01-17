
import React, { useState } from 'react';
import { FormData, Jenjang } from '../types';

const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzGsVdnxnpW_dYwRKnwq90a2AvywvaIYu72zRMqrpmN5X6nTqdNsJ3njgDSXjflgnTP/exec';

const RegistrationForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<Partial<FormData>>({
    jenjang: 'TK',
    kelas: 'TK A',
    jenisKelamin: 'Laki-laki',
    agama: 'Kristen Advent',
    tinggiBadan: '',
    beratBadan: '',
    riwayatPenyakit: '',
    hobi: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'jenjang') {
      let defaultKelas = value === 'TK' ? 'TK A' : value === 'SD' ? 'Kelas 1' : 'Kelas 7';
      setFormData(prev => ({ ...prev, jenjang: value as Jenjang, kelas: defaultKelas }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        action: 'create',
        data: {
          ...formData,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toLocaleString('id-ID'),
        }
      };

      await fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitted(true);
    } catch (error) {
      alert("Terjadi kesalahan koneksi. Pastikan URL Script sudah benar.");
    } finally {
      setLoading(false);
    }
  };

  const renderKelasOptions = () => {
    const { jenjang } = formData;
    if (jenjang === 'TK') return <><option value="TK A">TK A</option><option value="TK B">TK B</option></>;
    if (jenjang === 'SD') return [1,2,3,4,5,6].map(n => <option key={n} value={`Kelas ${n}`}>Kelas {n}</option>);
    if (jenjang === 'SMP') return [7,8,9].map(n => <option key={n} value={`Kelas ${n}`}>Kelas {n}</option>);
    return null;
  };

  const inputClass = "w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all shadow-sm text-slate-700 placeholder:text-slate-300";
  const labelClass = "text-sm font-bold text-slate-600 mb-1.5 block ml-1";

  if (submitted) {
    return (
      <div className="bg-white p-12 rounded-[40px] shadow-2xl text-center max-w-lg mx-auto border border-blue-50 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 className="text-3xl font-black text-slate-800 mb-4">Pendaftaran Sukses!</h3>
        <p className="text-slate-500 mb-10 text-lg">Data Anda telah diterima dan disimpan secara aman di Cloud PASET 2026.</p>
        <button onClick={() => setSubmitted(false)} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-100">Daftarkan Siswa Lain</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-12 pb-24">
      {/* SECTION 1: DATA CALON SISWA */}
      <section className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 transition-transform hover:scale-[1.01] duration-500">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-6 flex items-center gap-4">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-md text-white rounded-xl flex items-center justify-center font-black">01</div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">Data Calon Siswa (Wajib)</h3>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className={labelClass}>Jenjang yang Dituju</label>
            <select name="jenjang" required className={inputClass} onChange={handleChange} value={formData.jenjang}>
              <option value="TK">TK</option><option value="SD">SD</option><option value="SMP">SMP</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Pilih Kelas</label>
            <select name="kelas" required className={inputClass} onChange={handleChange} value={formData.kelas}>
              {renderKelasOptions()}
            </select>
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className={labelClass}>Nama Lengkap</label>
            <input name="namaLengkap" required placeholder="Contoh: Budi Setiabudi" className={inputClass} onChange={handleChange} />
            <p className="text-[11px] text-blue-500 font-bold ml-2 mt-1 uppercase tracking-tighter">Sesuai Akte Kelahiran</p>
          </div>
          <div className="space-y-1">
            <label className={labelClass}>NIK (Nomor Induk Kependudukan)</label>
            <input name="nik" required maxLength={16} placeholder="16 Digit NIK" className={`${inputClass} font-mono`} onChange={handleChange} />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Jenis Kelamin</label>
            <select name="jenisKelamin" required className={inputClass} onChange={handleChange} value={formData.jenisKelamin}>
              <option value="Laki-laki">Laki-laki</option><option value="Perempuan">Perempuan</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Tempat Lahir</label>
            <input name="tempatLahir" required placeholder="Kota Kelahiran" className={inputClass} onChange={handleChange} />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Tanggal Lahir</label>
            <input name="tanggalLahir" type="date" required className={inputClass} onChange={handleChange} />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Agama</label>
            <input name="agama" required value={formData.agama || ''} className={inputClass} onChange={handleChange} />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>NISN {formData.jenjang === 'TK' && '(Dikosongkan)'}</label>
            <input name="nisn" required={formData.jenjang !== 'TK'} placeholder={formData.jenjang === 'TK' ? '—' : '10 Digit NISN'} disabled={formData.jenjang === 'TK'} className={`${inputClass} font-mono ${formData.jenjang === 'TK' ? 'bg-slate-50 opacity-50' : ''}`} onChange={handleChange} />
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className={labelClass}>Alamat Domisili Lengkap</label>
            <textarea name="alamatDomisili" required rows={3} placeholder="Jalan, No. Rumah, RT/RW, Kelurahan, Kecamatan" className={inputClass} onChange={handleChange} />
          </div>
        </div>
      </section>

      {/* SECTION 2: DATA ASAL SEKOLAH */}
      {(formData.jenjang === 'SD' || formData.jenjang === 'SMP') && (
        <section className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-top-4">
          <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-8 py-6 flex items-center gap-4">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md text-white rounded-xl flex items-center justify-center font-black">02</div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">Data Asal Sekolah</h3>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className={labelClass}>Asal Sekolah Sebelumnya</label>
              <input name="asalSekolah" required placeholder="Nama Sekolah Asal" className={inputClass} onChange={handleChange} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Alamat Sekolah Asal</label>
              <input name="alamatSekolahAsal" required placeholder="Kota / Kabupaten" className={inputClass} onChange={handleChange} />
            </div>
          </div>
        </section>
      )}

      {/* SECTION 3: DATA ORANG TUA */}
      <section className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-8 py-6 flex items-center gap-4">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-md text-white rounded-xl flex items-center justify-center font-black">03</div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">Data Orang Tua / Wali</h3>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* AYAH */}
          <div className="space-y-4 p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <h4 className="font-black text-slate-800 uppercase text-xs tracking-wider">Data Ayah</h4>
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Nama Ayah Kandung</label>
              <input name="namaAyah" required placeholder="Sesuai KK" className={inputClass} onChange={handleChange} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Pekerjaan</label>
              <input name="pekerjaanAyah" required placeholder="Pekerjaan Ayah" className={inputClass} onChange={handleChange} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>WhatsApp</label>
              <input name="waAyah" required placeholder="08..." className={`${inputClass} font-mono`} onChange={handleChange} />
            </div>
          </div>
          {/* IBU */}
          <div className="space-y-4 p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-pink-100 text-pink-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <h4 className="font-black text-slate-800 uppercase text-xs tracking-wider">Data Ibu</h4>
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Nama Ibu Kandung</label>
              <input name="namaIbu" required placeholder="Sesuai KK" className={inputClass} onChange={handleChange} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Pekerjaan</label>
              <input name="pekerjaanIbu" required placeholder="Pekerjaan Ibu" className={inputClass} onChange={handleChange} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>WhatsApp</label>
              <input name="waIbu" required placeholder="08..." className={`${inputClass} font-mono`} onChange={handleChange} />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: DATA TAMBAHAN */}
      <section className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 px-8 py-6 flex items-center gap-4">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-md text-white rounded-xl flex items-center justify-center font-black">04</div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">Informasi Tambahan</h3>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelClass}>Tinggi (cm)</label>
              <input name="tinggiBadan" type="number" placeholder="cm" className={inputClass} onChange={handleChange} value={formData.tinggiBadan} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Berat (kg)</label>
              <input name="beratBadan" type="number" placeholder="kg" className={inputClass} onChange={handleChange} value={formData.beratBadan} />
            </div>
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Riwayat Medis / Alergi</label>
            <input name="riwayatPenyakit" placeholder="Kosongkan jika tidak ada" className={inputClass} onChange={handleChange} value={formData.riwayatPenyakit} />
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className={labelClass}>Hobi / Minat (Ekstrakurikuler)</label>
            <input name="hobi" placeholder="Apa minat siswa?" className={inputClass} onChange={handleChange} value={formData.hobi} />
          </div>
        </div>
      </section>

      <div className="flex justify-center pt-8">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-12 py-5 rounded-[24px] font-black text-2xl shadow-2xl hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-6 disabled:opacity-50 disabled:cursor-not-allowed group shadow-blue-200"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-8 w-8 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              MEMPROSES...
            </>
          ) : (
            <>
              SUBMIT PENDAFTARAN
              <svg className="w-8 h-8 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default RegistrationForm;
