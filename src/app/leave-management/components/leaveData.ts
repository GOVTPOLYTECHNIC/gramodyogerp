export type LeaveType = 'Casual Leave' | 'Sick Leave' | 'Earned Leave' | 'Maternity Leave' | 'Unpaid Leave';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveApplication {
  id: string;
  staffId: string;
  staffName: string;
  empId: string;
  college: string;
  department: string;
  role: string;
  leaveType: LeaveType;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
  approvedBy?: string;
  approvedOn?: string;
  remarks?: string;
}

export const mockLeaveApplications: LeaveApplication[] = [
  {
    id: 'leave-001',
    staffId: 'staff-003',
    staffName: 'Priti Singh',
    empId: 'RGP-EMP-003',
    college: 'Rajiv Gandhi Polytechnic',
    department: 'Electrical Engineering',
    role: 'Lecturer',
    leaveType: 'Sick Leave',
    fromDate: '14/07/2026',
    toDate: '16/07/2026',
    days: 3,
    reason: 'Fever and viral infection, doctor advised rest for 3 days.',
    status: 'Pending',
    appliedOn: '13/07/2026',
  },
  {
    id: 'leave-002',
    staffId: 'staff-004',
    staffName: 'Mohan Lal Yadav',
    empId: 'ITI-EMP-001',
    college: 'Rajiv Gandhi ITI',
    department: 'Fitter Trade',
    role: 'Instructor',
    leaveType: 'Casual Leave',
    fromDate: '18/07/2026',
    toDate: '19/07/2026',
    days: 2,
    reason: 'Family function — daughter\'s school admission ceremony.',
    status: 'Approved',
    appliedOn: '10/07/2026',
    approvedBy: 'Dr. Ramesh Chandra Mishra',
    approvedOn: '11/07/2026',
    remarks: 'Approved. Ensure class arrangements are made.',
  },
  {
    id: 'leave-003',
    staffId: 'staff-008',
    staffName: 'Kavita Pandey',
    empId: 'GSS-EMP-002',
    college: 'GSS Diploma College',
    department: 'Special Education (HI)',
    role: 'Lecturer',
    leaveType: 'Earned Leave',
    fromDate: '21/07/2026',
    toDate: '25/07/2026',
    days: 5,
    reason: 'Annual family vacation — planned trip to Uttarakhand.',
    status: 'Pending',
    appliedOn: '08/07/2026',
  },
  {
    id: 'leave-004',
    staffId: 'staff-006',
    staffName: 'Rajesh Bind',
    empId: 'ITI-EMP-003',
    college: 'Rajiv Gandhi ITI',
    department: 'Workshop',
    role: 'Lab Assistant',
    leaveType: 'Casual Leave',
    fromDate: '05/07/2026',
    toDate: '05/07/2026',
    days: 1,
    reason: 'Personal work — bank related documentation.',
    status: 'Rejected',
    appliedOn: '04/07/2026',
    approvedBy: 'Dr. Ramesh Chandra Mishra',
    approvedOn: '04/07/2026',
    remarks: 'Rejected — critical lab session scheduled. Please reschedule.',
  },
  {
    id: 'leave-005',
    staffId: 'staff-002',
    staffName: 'Suresh Kumar Verma',
    empId: 'RGP-EMP-002',
    college: 'Rajiv Gandhi Polytechnic',
    department: 'Mechanical Engineering',
    role: 'HOD',
    leaveType: 'Sick Leave',
    fromDate: '01/07/2026',
    toDate: '03/07/2026',
    days: 3,
    reason: 'Hospitalization for minor surgery. Medical certificate attached.',
    status: 'Approved',
    appliedOn: '30/06/2026',
    approvedBy: 'Dr. Ramesh Chandra Mishra',
    approvedOn: '30/06/2026',
    remarks: 'Approved. Get well soon.',
  },
  {
    id: 'leave-006',
    staffId: 'staff-009',
    staffName: 'Dinesh Prasad Gupta',
    empId: 'RGP-EMP-004',
    college: 'Rajiv Gandhi Polytechnic',
    department: 'Administration',
    role: 'Clerk',
    leaveType: 'Casual Leave',
    fromDate: '22/07/2026',
    toDate: '22/07/2026',
    days: 1,
    reason: 'Attending son\'s school sports day event.',
    status: 'Pending',
    appliedOn: '17/07/2026',
  },
  {
    id: 'leave-007',
    staffId: 'staff-005',
    staffName: 'Geeta Devi Chauhan',
    empId: 'ITI-EMP-002',
    college: 'Rajiv Gandhi ITI',
    department: 'Electrician Trade',
    role: 'Instructor',
    leaveType: 'Maternity Leave',
    fromDate: '01/08/2026',
    toDate: '31/10/2026',
    days: 91,
    reason: 'Maternity leave as per government norms.',
    status: 'Approved',
    appliedOn: '15/07/2026',
    approvedBy: 'Dr. Ramesh Chandra Mishra',
    approvedOn: '16/07/2026',
    remarks: 'Approved as per Maternity Benefit Act.',
  },
];

export const LEAVE_TYPE_COLORS: Record<string, string> = {
  'Casual Leave': 'bg-blue-100 text-blue-700',
  'Sick Leave': 'bg-red-100 text-red-700',
  'Earned Leave': 'bg-violet-100 text-violet-700',
  'Maternity Leave': 'bg-pink-100 text-pink-700',
  'Unpaid Leave': 'bg-gray-100 text-gray-600',
};

export const STATUS_COLORS: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Approved: 'bg-emerald-100 text-emerald-700',
  Rejected: 'bg-red-100 text-red-700',
};
