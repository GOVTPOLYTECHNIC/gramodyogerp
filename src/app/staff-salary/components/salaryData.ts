export type PaymentStatus = 'Paid' | 'Pending' | 'On Hold';
export type College = 'Rajiv Gandhi Polytechnic' | 'Rajiv Gandhi ITI' | 'GSS Diploma College';

export interface SalaryStaff {
  id: string;
  empId: string;
  name: string;
  college: College;
  department: string;
  designation: string;
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
  bankName: string;
}

export interface AttendanceRecord {
  staffId: string;
  month: string;
  year: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  leaveDays: number;
}

export interface PaymentRecord {
  id: string;
  staffId: string;
  staffName: string;
  empId: string;
  college: College;
  month: string;
  year: string;
  grossSalary: number;
  attendanceDeduction: number;
  totalDeductions: number;
  netSalary: number;
  status: PaymentStatus;
  paidDate?: string;
  transactionId?: string;
  remarks?: string;
}

export const salaryStaff: SalaryStaff[] = [
  {
    id: 'ss-001', empId: 'RGP-EMP-001', name: 'Dr. Ramesh Chandra Mishra',
    college: 'Rajiv Gandhi Polytechnic', department: 'Civil Engineering', designation: 'Principal',
    basicSalary: 55000, hra: 13750, ta: 3000, da: 5500, pf: 6600, tds: 4200, otherDeductions: 500,
    joiningDate: '01/04/2015', bankAccount: '1234567890', ifsc: 'SBIN0001234', bankName: 'State Bank of India',
  },
  {
    id: 'ss-002', empId: 'RGP-EMP-002', name: 'Suresh Kumar Verma',
    college: 'Rajiv Gandhi Polytechnic', department: 'Mechanical Engineering', designation: 'HOD',
    basicSalary: 42000, hra: 10500, ta: 2500, da: 4200, pf: 5040, tds: 2800, otherDeductions: 300,
    joiningDate: '15/07/2018', bankAccount: '2345678901', ifsc: 'SBIN0001234', bankName: 'State Bank of India',
  },
  {
    id: 'ss-003', empId: 'RGP-EMP-003', name: 'Priti Singh',
    college: 'Rajiv Gandhi Polytechnic', department: 'Electrical Engineering', designation: 'Lecturer',
    basicSalary: 32000, hra: 8000, ta: 2000, da: 3200, pf: 3840, tds: 1500, otherDeductions: 200,
    joiningDate: '01/08/2020', bankAccount: '3456789012', ifsc: 'SBIN0001234', bankName: 'State Bank of India',
  },
  {
    id: 'ss-004', empId: 'ITI-EMP-001', name: 'Mohan Lal Yadav',
    college: 'Rajiv Gandhi ITI', department: 'Fitter Trade', designation: 'Instructor',
    basicSalary: 28000, hra: 7000, ta: 1800, da: 2800, pf: 3360, tds: 800, otherDeductions: 200,
    joiningDate: '10/06/2019', bankAccount: '4567890123', ifsc: 'PUNB0001234', bankName: 'Punjab National Bank',
  },
  {
    id: 'ss-005', empId: 'ITI-EMP-002', name: 'Geeta Devi Chauhan',
    college: 'Rajiv Gandhi ITI', department: 'Electrician Trade', designation: 'Instructor',
    basicSalary: 28000, hra: 7000, ta: 1800, da: 2800, pf: 3360, tds: 800, otherDeductions: 200,
    joiningDate: '01/01/2021', bankAccount: '5678901234', ifsc: 'PUNB0001234', bankName: 'Punjab National Bank',
  },
  {
    id: 'ss-006', empId: 'ITI-EMP-003', name: 'Rajesh Bind',
    college: 'Rajiv Gandhi ITI', department: 'Workshop', designation: 'Lab Assistant',
    basicSalary: 18000, hra: 4500, ta: 1200, da: 1800, pf: 2160, tds: 0, otherDeductions: 100,
    joiningDate: '05/03/2022', bankAccount: '6789012345', ifsc: 'PUNB0001234', bankName: 'Punjab National Bank',
  },
  {
    id: 'ss-007', empId: 'GSS-EMP-001', name: 'Dr. Anupama Srivastava',
    college: 'GSS Diploma College', department: 'Special Education', designation: 'Principal',
    basicSalary: 50000, hra: 12500, ta: 3000, da: 5000, pf: 6000, tds: 3800, otherDeductions: 500,
    joiningDate: '01/07/2012', bankAccount: '7890123456', ifsc: 'HDFC0001234', bankName: 'HDFC Bank',
  },
  {
    id: 'ss-008', empId: 'GSS-EMP-002', name: 'Kavita Pandey',
    college: 'GSS Diploma College', department: 'Special Education (HI)', designation: 'Lecturer',
    basicSalary: 30000, hra: 7500, ta: 2000, da: 3000, pf: 3600, tds: 1200, otherDeductions: 200,
    joiningDate: '15/09/2019', bankAccount: '8901234567', ifsc: 'HDFC0001234', bankName: 'HDFC Bank',
  },
  {
    id: 'ss-009', empId: 'RGP-EMP-004', name: 'Dinesh Prasad Gupta',
    college: 'Rajiv Gandhi Polytechnic', department: 'Administration', designation: 'Clerk',
    basicSalary: 20000, hra: 5000, ta: 1500, da: 2000, pf: 2400, tds: 0, otherDeductions: 100,
    joiningDate: '20/11/2017', bankAccount: '9012345678', ifsc: 'SBIN0001234', bankName: 'State Bank of India',
  },
];

export const attendanceRecords: AttendanceRecord[] = [
  { staffId: 'ss-001', month: 'July', year: '2026', totalDays: 26, presentDays: 26, absentDays: 0, lateDays: 0, leaveDays: 0 },
  { staffId: 'ss-002', month: 'July', year: '2026', totalDays: 26, presentDays: 24, absentDays: 1, lateDays: 1, leaveDays: 0 },
  { staffId: 'ss-003', month: 'July', year: '2026', totalDays: 26, presentDays: 22, absentDays: 2, lateDays: 2, leaveDays: 0 },
  { staffId: 'ss-004', month: 'July', year: '2026', totalDays: 26, presentDays: 25, absentDays: 1, lateDays: 0, leaveDays: 0 },
  { staffId: 'ss-005', month: 'July', year: '2026', totalDays: 26, presentDays: 26, absentDays: 0, lateDays: 0, leaveDays: 0 },
  { staffId: 'ss-006', month: 'July', year: '2026', totalDays: 26, presentDays: 20, absentDays: 4, lateDays: 2, leaveDays: 0 },
  { staffId: 'ss-007', month: 'July', year: '2026', totalDays: 26, presentDays: 26, absentDays: 0, lateDays: 0, leaveDays: 0 },
  { staffId: 'ss-008', month: 'July', year: '2026', totalDays: 26, presentDays: 23, absentDays: 1, lateDays: 2, leaveDays: 0 },
  { staffId: 'ss-009', month: 'July', year: '2026', totalDays: 26, presentDays: 24, absentDays: 2, lateDays: 0, leaveDays: 0 },
  // June 2026
  { staffId: 'ss-001', month: 'June', year: '2026', totalDays: 25, presentDays: 25, absentDays: 0, lateDays: 0, leaveDays: 0 },
  { staffId: 'ss-002', month: 'June', year: '2026', totalDays: 25, presentDays: 23, absentDays: 2, lateDays: 0, leaveDays: 0 },
  { staffId: 'ss-003', month: 'June', year: '2026', totalDays: 25, presentDays: 25, absentDays: 0, lateDays: 0, leaveDays: 0 },
  { staffId: 'ss-004', month: 'June', year: '2026', totalDays: 25, presentDays: 24, absentDays: 1, lateDays: 0, leaveDays: 0 },
  { staffId: 'ss-005', month: 'June', year: '2026', totalDays: 25, presentDays: 25, absentDays: 0, lateDays: 0, leaveDays: 0 },
  { staffId: 'ss-006', month: 'June', year: '2026', totalDays: 25, presentDays: 22, absentDays: 3, lateDays: 0, leaveDays: 0 },
  { staffId: 'ss-007', month: 'June', year: '2026', totalDays: 25, presentDays: 25, absentDays: 0, lateDays: 0, leaveDays: 0 },
  { staffId: 'ss-008', month: 'June', year: '2026', totalDays: 25, presentDays: 24, absentDays: 1, lateDays: 0, leaveDays: 0 },
  { staffId: 'ss-009', month: 'June', year: '2026', totalDays: 25, presentDays: 25, absentDays: 0, lateDays: 0, leaveDays: 0 },
];

export const paymentHistory: PaymentRecord[] = [
  { id: 'pay-001', staffId: 'ss-001', staffName: 'Dr. Ramesh Chandra Mishra', empId: 'RGP-EMP-001', college: 'Rajiv Gandhi Polytechnic', month: 'June', year: '2026', grossSalary: 77250, attendanceDeduction: 0, totalDeductions: 11300, netSalary: 65950, status: 'Paid', paidDate: '30/06/2026', transactionId: 'TXN20260630001' },
  { id: 'pay-002', staffId: 'ss-002', staffName: 'Suresh Kumar Verma', empId: 'RGP-EMP-002', college: 'Rajiv Gandhi Polytechnic', month: 'June', year: '2026', grossSalary: 59200, attendanceDeduction: 4736, totalDeductions: 12876, netSalary: 46324, status: 'Paid', paidDate: '30/06/2026', transactionId: 'TXN20260630002' },
  { id: 'pay-003', staffId: 'ss-003', staffName: 'Priti Singh', empId: 'RGP-EMP-003', college: 'Rajiv Gandhi Polytechnic', month: 'June', year: '2026', grossSalary: 45200, attendanceDeduction: 0, totalDeductions: 5540, netSalary: 39660, status: 'Paid', paidDate: '30/06/2026', transactionId: 'TXN20260630003' },
  { id: 'pay-004', staffId: 'ss-004', staffName: 'Mohan Lal Yadav', empId: 'ITI-EMP-001', college: 'Rajiv Gandhi ITI', month: 'June', year: '2026', grossSalary: 39600, attendanceDeduction: 1584, totalDeductions: 5944, netSalary: 33656, status: 'Paid', paidDate: '30/06/2026', transactionId: 'TXN20260630004' },
  { id: 'pay-005', staffId: 'ss-005', staffName: 'Geeta Devi Chauhan', empId: 'ITI-EMP-002', college: 'Rajiv Gandhi ITI', month: 'June', year: '2026', grossSalary: 39600, attendanceDeduction: 0, totalDeductions: 4360, netSalary: 35240, status: 'Paid', paidDate: '30/06/2026', transactionId: 'TXN20260630005' },
  { id: 'pay-006', staffId: 'ss-006', staffName: 'Rajesh Bind', empId: 'ITI-EMP-003', college: 'Rajiv Gandhi ITI', month: 'June', year: '2026', grossSalary: 25500, attendanceDeduction: 3060, totalDeductions: 5320, netSalary: 20180, status: 'Paid', paidDate: '30/06/2026', transactionId: 'TXN20260630006' },
  { id: 'pay-007', staffId: 'ss-007', staffName: 'Dr. Anupama Srivastava', empId: 'GSS-EMP-001', college: 'GSS Diploma College', month: 'June', year: '2026', grossSalary: 70500, attendanceDeduction: 0, totalDeductions: 10300, netSalary: 60200, status: 'Paid', paidDate: '30/06/2026', transactionId: 'TXN20260630007' },
  { id: 'pay-008', staffId: 'ss-008', staffName: 'Kavita Pandey', empId: 'GSS-EMP-002', college: 'GSS Diploma College', month: 'June', year: '2026', grossSalary: 42500, attendanceDeduction: 1700, totalDeductions: 6700, netSalary: 35800, status: 'Paid', paidDate: '30/06/2026', transactionId: 'TXN20260630008' },
  { id: 'pay-009', staffId: 'ss-009', staffName: 'Dinesh Prasad Gupta', empId: 'RGP-EMP-004', college: 'Rajiv Gandhi Polytechnic', month: 'June', year: '2026', grossSalary: 28500, attendanceDeduction: 0, totalDeductions: 2500, netSalary: 26000, status: 'Paid', paidDate: '30/06/2026', transactionId: 'TXN20260630009' },
  // July 2026 - Pending
  { id: 'pay-010', staffId: 'ss-001', staffName: 'Dr. Ramesh Chandra Mishra', empId: 'RGP-EMP-001', college: 'Rajiv Gandhi Polytechnic', month: 'July', year: '2026', grossSalary: 77250, attendanceDeduction: 0, totalDeductions: 11300, netSalary: 65950, status: 'Pending' },
  { id: 'pay-011', staffId: 'ss-002', staffName: 'Suresh Kumar Verma', empId: 'RGP-EMP-002', college: 'Rajiv Gandhi Polytechnic', month: 'July', year: '2026', grossSalary: 59200, attendanceDeduction: 2277, totalDeductions: 10417, netSalary: 48783, status: 'Pending' },
  { id: 'pay-012', staffId: 'ss-003', staffName: 'Priti Singh', empId: 'RGP-EMP-003', college: 'Rajiv Gandhi Polytechnic', month: 'July', year: '2026', grossSalary: 45200, attendanceDeduction: 3477, totalDeductions: 9017, netSalary: 36183, status: 'Pending' },
  { id: 'pay-013', staffId: 'ss-004', staffName: 'Mohan Lal Yadav', empId: 'ITI-EMP-001', college: 'Rajiv Gandhi ITI', month: 'July', year: '2026', grossSalary: 39600, attendanceDeduction: 1523, totalDeductions: 5883, netSalary: 33717, status: 'Pending' },
  { id: 'pay-014', staffId: 'ss-005', staffName: 'Geeta Devi Chauhan', empId: 'ITI-EMP-002', college: 'Rajiv Gandhi ITI', month: 'July', year: '2026', grossSalary: 39600, attendanceDeduction: 0, totalDeductions: 4360, netSalary: 35240, status: 'Pending' },
  { id: 'pay-015', staffId: 'ss-006', staffName: 'Rajesh Bind', empId: 'ITI-EMP-003', college: 'Rajiv Gandhi ITI', month: 'July', year: '2026', grossSalary: 25500, attendanceDeduction: 3923, totalDeductions: 6183, netSalary: 19317, status: 'On Hold', remarks: 'Pending document verification' },
  { id: 'pay-016', staffId: 'ss-007', staffName: 'Dr. Anupama Srivastava', empId: 'GSS-EMP-001', college: 'GSS Diploma College', month: 'July', year: '2026', grossSalary: 70500, attendanceDeduction: 0, totalDeductions: 10300, netSalary: 60200, status: 'Pending' },
  { id: 'pay-017', staffId: 'ss-008', staffName: 'Kavita Pandey', empId: 'GSS-EMP-002', college: 'GSS Diploma College', month: 'July', year: '2026', grossSalary: 42500, attendanceDeduction: 3269, totalDeductions: 8269, netSalary: 34231, status: 'Pending' },
  { id: 'pay-018', staffId: 'ss-009', staffName: 'Dinesh Prasad Gupta', empId: 'RGP-EMP-004', college: 'Rajiv Gandhi Polytechnic', month: 'July', year: '2026', grossSalary: 28500, attendanceDeduction: 2192, totalDeductions: 4692, netSalary: 23808, status: 'Pending' },
];

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const COLLEGE_SHORT: Record<string, string> = {
  'Rajiv Gandhi Polytechnic': 'RGP',
  'Rajiv Gandhi ITI': 'ITI',
  'GSS Diploma College': 'GSS',
};

export const COLLEGE_COLORS: Record<string, string> = {
  'Rajiv Gandhi Polytechnic': 'bg-blue-100 text-blue-700',
  'Rajiv Gandhi ITI': 'bg-emerald-100 text-emerald-700',
  'GSS Diploma College': 'bg-amber-100 text-amber-700',
};

export function computeAttendancePayroll(staff: SalaryStaff, attendance: AttendanceRecord | undefined) {
  const gross = staff.basicSalary + staff.hra + staff.ta + staff.da;
  const baseDeductions = staff.pf + staff.tds + staff.otherDeductions;

  let attendanceDeduction = 0;
  let attendancePct = 100;

  if (attendance) {
    const perDaySalary = gross / attendance.totalDays;
    attendanceDeduction = Math.round(attendance.absentDays * perDaySalary);
    attendancePct = Math.round((attendance.presentDays / attendance.totalDays) * 100);
  }

  const totalDeductions = baseDeductions + attendanceDeduction;
  const net = gross - totalDeductions;

  return { gross, baseDeductions, attendanceDeduction, totalDeductions, net, attendancePct };
}
