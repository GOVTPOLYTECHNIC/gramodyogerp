export type StaffRole = 'Principal' | 'HOD' | 'Lecturer' | 'Instructor' | 'Lab Assistant' | 'Clerk' | 'Peon';
export type PayrollStatus = 'Paid' | 'Pending' | 'On Hold';
export type College = 'Rajiv Gandhi Polytechnic' | 'Rajiv Gandhi ITI' | 'GSS Diploma College';

export interface StaffMember {
  id: string;
  empId: string;
  name: string;
  college: College;
  department: string;
  role: StaffRole;
  basicSalary: number;
  hra: number;
  ta: number;
  da: number;
  pf: number;
  tds: number;
  otherDeductions: number;
  joiningDate: string;
  bankAccount: string;
  ifsc: string;
}

export interface PayrollRecord {
  id: string;
  staffId: string;
  month: string;
  year: string;
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  status: PayrollStatus;
  paidDate?: string;
}

export const mockStaff: StaffMember[] = [
  {
    id: 'staff-001',
    empId: 'RGP-EMP-001',
    name: 'Dr. Ramesh Chandra Mishra',
    college: 'Rajiv Gandhi Polytechnic',
    department: 'Civil Engineering',
    role: 'Principal',
    basicSalary: 55000,
    hra: 13750,
    ta: 3000,
    da: 5500,
    pf: 6600,
    tds: 4200,
    otherDeductions: 500,
    joiningDate: '01/04/2015',
    bankAccount: '1234567890',
    ifsc: 'SBIN0001234',
  },
  {
    id: 'staff-002',
    empId: 'RGP-EMP-002',
    name: 'Suresh Kumar Verma',
    college: 'Rajiv Gandhi Polytechnic',
    department: 'Mechanical Engineering',
    role: 'HOD',
    basicSalary: 42000,
    hra: 10500,
    ta: 2500,
    da: 4200,
    pf: 5040,
    tds: 2800,
    otherDeductions: 300,
    joiningDate: '15/07/2018',
    bankAccount: '2345678901',
    ifsc: 'SBIN0001234',
  },
  {
    id: 'staff-003',
    empId: 'RGP-EMP-003',
    name: 'Priti Singh',
    college: 'Rajiv Gandhi Polytechnic',
    department: 'Electrical Engineering',
    role: 'Lecturer',
    basicSalary: 32000,
    hra: 8000,
    ta: 2000,
    da: 3200,
    pf: 3840,
    tds: 1500,
    otherDeductions: 200,
    joiningDate: '01/08/2020',
    bankAccount: '3456789012',
    ifsc: 'SBIN0001234',
  },
  {
    id: 'staff-004',
    empId: 'ITI-EMP-001',
    name: 'Mohan Lal Yadav',
    college: 'Rajiv Gandhi ITI',
    department: 'Fitter Trade',
    role: 'Instructor',
    basicSalary: 28000,
    hra: 7000,
    ta: 1800,
    da: 2800,
    pf: 3360,
    tds: 800,
    otherDeductions: 200,
    joiningDate: '10/06/2019',
    bankAccount: '4567890123',
    ifsc: 'PUNB0001234',
  },
  {
    id: 'staff-005',
    empId: 'ITI-EMP-002',
    name: 'Geeta Devi Chauhan',
    college: 'Rajiv Gandhi ITI',
    department: 'Electrician Trade',
    role: 'Instructor',
    basicSalary: 28000,
    hra: 7000,
    ta: 1800,
    da: 2800,
    pf: 3360,
    tds: 800,
    otherDeductions: 200,
    joiningDate: '01/01/2021',
    bankAccount: '5678901234',
    ifsc: 'PUNB0001234',
  },
  {
    id: 'staff-006',
    empId: 'ITI-EMP-003',
    name: 'Rajesh Bind',
    college: 'Rajiv Gandhi ITI',
    department: 'Workshop',
    role: 'Lab Assistant',
    basicSalary: 18000,
    hra: 4500,
    ta: 1200,
    da: 1800,
    pf: 2160,
    tds: 0,
    otherDeductions: 100,
    joiningDate: '05/03/2022',
    bankAccount: '6789012345',
    ifsc: 'PUNB0001234',
  },
  {
    id: 'staff-007',
    empId: 'GSS-EMP-001',
    name: 'Dr. Anupama Srivastava',
    college: 'GSS Diploma College',
    department: 'Special Education',
    role: 'Principal',
    basicSalary: 50000,
    hra: 12500,
    ta: 3000,
    da: 5000,
    pf: 6000,
    tds: 3800,
    otherDeductions: 500,
    joiningDate: '01/07/2012',
    bankAccount: '7890123456',
    ifsc: 'HDFC0001234',
  },
  {
    id: 'staff-008',
    empId: 'GSS-EMP-002',
    name: 'Kavita Pandey',
    college: 'GSS Diploma College',
    department: 'Special Education (HI)',
    role: 'Lecturer',
    basicSalary: 30000,
    hra: 7500,
    ta: 2000,
    da: 3000,
    pf: 3600,
    tds: 1200,
    otherDeductions: 200,
    joiningDate: '15/09/2019',
    bankAccount: '8901234567',
    ifsc: 'HDFC0001234',
  },
  {
    id: 'staff-009',
    empId: 'RGP-EMP-004',
    name: 'Dinesh Prasad Gupta',
    college: 'Rajiv Gandhi Polytechnic',
    department: 'Administration',
    role: 'Clerk',
    basicSalary: 20000,
    hra: 5000,
    ta: 1500,
    da: 2000,
    pf: 2400,
    tds: 0,
    otherDeductions: 100,
    joiningDate: '20/11/2017',
    bankAccount: '9012345678',
    ifsc: 'SBIN0001234',
  },
];

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function computePayroll(staff: StaffMember): {
  gross: number;
  deductions: number;
  net: number;
} {
  const gross = staff.basicSalary + staff.hra + staff.ta + staff.da;
  const deductions = staff.pf + staff.tds + staff.otherDeductions;
  return { gross, deductions, net: gross - deductions };
}
