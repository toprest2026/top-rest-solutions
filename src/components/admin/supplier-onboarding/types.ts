
export interface SupplierFormData {
  // Step 1: Legal Entity
  business_type: 'factory' | 'company' | 'cash_van';
  name_ar: string;
  name_en: string;
  has_vat: boolean;
  vat_number: string;
  cr_number: string;

  // Step 2: Authorized Person
  delegates: DelegateData[];

  // Step 3: Financial Routing
  bank_name: string;
  iban: string;

  // Step 4: Documents
  documents: DocumentUpload[];
}

export interface DelegateData {
  full_name: string;
  national_id: string;
  nationality: string;
  phone: string;
  phone_verified: boolean;
  email: string;
  role_title: string;
  is_contract_signee: boolean;
}

export interface DocumentUpload {
  doc_type: string;
  file: File | null;
  file_url: string;
}

export const SAUDI_BANKS = [
  'البنك الأهلي السعودي',
  'بنك الراجحي',
  'بنك الرياض',
  'البنك السعودي الفرنسي',
  'البنك العربي الوطني',
  'بنك ساب',
  'بنك البلاد',
  'بنك الجزيرة',
  'بنك الإنماء',
  'البنك السعودي للاستثمار',
  'بنك الخليج الدولي',
  'بنك الأول',
];

export const DOCUMENT_TYPES = [
  { id: 'cr_image', label: 'صورة السجل التجاري' },
  { id: 'vat_cert', label: 'صورة الشهادة الضريبية' },
  { id: 'national_address', label: 'العنوان الوطني' },
  { id: 'iban_cert', label: 'صورة شهادة الآيبان' },
  { id: 'delegate_docs', label: 'صورة أوراق المفوضين' },
  { id: 'store_image', label: 'صورة المحل (إن وُجد)' },
  { id: 'delegate_photo', label: 'صورة المفوضين' },
];

export const INITIAL_FORM: SupplierFormData = {
  business_type: 'company',
  name_ar: '',
  name_en: '',
  has_vat: false,
  vat_number: '',
  cr_number: '',
  delegates: [{
    full_name: '',
    national_id: '',
    nationality: 'سعودي',
    phone: '',
    phone_verified: false,
    email: '',
    role_title: 'مفوض العقد',
    is_contract_signee: true,
  }],
  bank_name: '',
  iban: '',
  documents: [],
};
