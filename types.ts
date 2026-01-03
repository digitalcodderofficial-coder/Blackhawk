
export type AttendanceStatus = 'P' | 'A' | 'H' | 'OFF' | 'HD' | 'L' | '';

export interface CompanyProfile {
  name: string;
  type: string;
  address: string;
  contact: string;
  logo: string;
  email: string;
  diseCode?: string;
  session?: string;
  locationHeader?: string;
}

export interface Holiday {
  date: string;
  reason: string;
  type: 'Company' | 'National' | 'Festival';
}

export interface Post {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
}

export interface Employee {
  id: string;
  name: string;
  designation: string;
  gender: 'Male' | 'Female';
  basicSalary: number;
  joiningDate: string;
  contact: string;
  alternateContact?: string;
  email: string;
  fatherName: string;
  motherName: string;
  address: string;
  aadhaar: string;
  bankName: string;
  accountNo: string;
  ifsc: string;
  bloodGroup: string;
  religion: string;
  category: string;
  maritalStatus: string;
  qualification: string;
  experience: string;
  samagraId?: string;
  teacherCode?: string;
  subject?: string;
  branch?: string;
  photo?: string;
  shift: 'Day' | 'Night';
  workLocation: string;
  status: 'Active' | 'Inactive';
  statusChangeDate: string;
  leavingDate?: string;
  leavingReason?: string;
  // Security Force Specific Fields
  height?: string;
  weight?: string;
  chest?: string;
  gunLicenseNo?: string;
  licenseExpiry?: string;
  policeVerification?: 'Verified' | 'Pending' | 'Not Done';
  trainingCertNo?: string;
}

export interface SalaryRecord {
  employeeId: string;
  month: string;
  year: number;
  da: number;
  ta: number;
  hra: number;
  ma: number;
  bonus: number;
  otherAllowance: number;
  pf: number;
  uniformCharge: number;
  lateComingCharge: number;
  otherCharge: number;
  advancePaid: number;
  previousBalance: number;
  paidAmount: number;
  allowedLeave: number;
  holiday: number;
  daysLate: number;
}

export interface AttendanceRecord {
  employeeId: string;
  month: string;
  year: number;
  days: { [key: number]: AttendanceStatus };
  times?: { [key: number]: { in: string; out: string } };
}

export interface Transaction {
  id: string;
  employeeId: string;
  date: string;
  voucherNo: string;
  type: 'Salary' | 'Advance' | 'PF' | 'Dues' | 'Allowance';
  mode: 'Cash' | 'Bank' | 'PhonePe' | 'GPay' | 'UPI' | 'Cheque' | 'Debit Card' | 'Credit Card' | 'Bhim UPI' | 'Paytm';
  amount: number;
  month: string;
  year: number;
  referenceId?: string;
}

export type ViewType = 
  | 'Dashboard' | 'ReadInstructions' | 'SchoolProfile' | 'UploadLogo' | 'BlankForm' | 'AddEmployee' 
  | 'Database' | 'ApplicationForm' | 'AppointmentLetter' | 'IDCard' | 'EmployeeBalance' 
  | 'DailyAttendance' | 'SalaryCalculation' | 'AttendanceTracker' | 'SalaryTracker' 
  | 'PFCalculation' | 'AttendanceSheet' | 'SalarySheetBank' | 'EmployeeSummary' 
  | 'Payment' | 'PaymentRecord' | 'SearchMultiple' | 'SalaryStatement' | 'MonthlyPayslip' 
  | 'AnnualPayslip' | 'MonthWiseSummary' | 'JobLeavingDetails' | 'ExperienceCertificate' 
  | 'MasterSetting' | 'GstCalculator' | 'Holidays' | 'EmployeePaymentStatus' | 'QuotationForm';
