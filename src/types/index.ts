export type EquipmentCategory = 
  | 'Semua' 
  | 'Glassware' 
  | 'Kualitas Air & Limbah' 
  | 'Udara, Kebisingan & K3' 
  | 'Vektor & Mikrobiologi' 
  | 'Alat Ukur Sanitasi';

export interface Equipment {
  id: string;
  name: string;
  slug: string;
  category: string;
  capacity_spec?: string;
  material?: string;
  brand_model?: string;         // Merk & Model Alat
  measurement_range?: string;   // Rentang Pengukuran / Kapasitas Kerja
  accuracy_resolution?: string; // Ketelitian / Resolusi / Batas Toleransi
  standard_method?: string;     // Standar Rujukan (SNI / Permenkes / APHA)
  power_calibration?: string;   // Catu Daya & Persyaratan Kalibrasi
  function_desc: string;
  sop_notes?: string;
  location?: string;
  total_stock: number;
  available_stock: number;
  status: 'Tersedia' | 'Terbatas' | 'Maintenance';
  image_url: string;
  created_at?: string;
}

export interface CartItem {
  equipment: Equipment;
  quantity: number;
}

export interface BorrowFormData {
  borrower_name: string;
  borrower_nim: string;
  borrower_major: string;
  supervisor_name: string;
  purpose: string;
  borrow_date: string;
  borrow_time: string;
  return_date: string;
  return_time: string;
  notes: string;
}

export interface BorrowRequestRecord extends BorrowFormData {
  id?: string;
  items: {
    equipment_id: string;
    name: string;
    capacity_spec?: string;
    quantity: number;
  }[];
  status: string;
  created_at?: string;
}

export interface LabSettings {
  id: number;
  lab_name: string;
  campus_name: string;
  department_name: string;
  whatsapp_number: string;
  admin_name: string;
  operating_hours: string;
  logo_url: string;
}

export interface LabAssistant {
  id: string;
  name: string;
  role: string;
  sub_lab: string;
  nim_nip: string;
  shift_schedule: string;
  phone: string;
  avatar_url: string;
  specialization: string;
}
