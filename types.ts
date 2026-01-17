
export type Jenjang = 'TK' | 'SD' | 'SMP';

export interface FormData {
  // Section 1: Data Calon Siswa
  jenjang: Jenjang;
  kelas: string; // New field for specific grade/class level
  namaLengkap: string;
  nik: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  tempatLahir: string;
  tanggalLahir: string;
  agama: string;
  alamatDomisili: string;
  nisn?: string;

  // Section 2: Data Asal Sekolah
  asalSekolah: string;
  alamatSekolahAsal: string;

  // Section 3: Data Orang Tua
  namaAyah: string;
  pekerjaanAyah: string;
  waAyah: string;
  namaIbu: string;
  pekerjaanIbu: string;
  waIbu: string;

  // Section 4: Data Tambahan
  tinggiBadan?: string;
  beratBadan?: string;
  riwayatPenyakit?: string;
  hobi?: string;
}

export interface Submission extends FormData {
  id: string;
  timestamp: string;
}
