'use client';

import { createClient } from '@/lib/supabase/client';

// ---- Type helpers ----
function isSchemaError(error: any): boolean {
  if (!error) return false;
  if (error.code && typeof error.code === 'string') {
    const cls = error.code.substring(0, 2);
    if (cls === '42' || cls === '08') return true;
    if (cls === '23') return false;
  }
  if (error.message) {
    const patterns = [
      /relation.*does not exist/i,
      /column.*does not exist/i,
      /function.*does not exist/i,
      /syntax error/i,
      /type.*does not exist/i,
    ];
    return patterns.some((p) => p.test(error.message));
  }
  return false;
}

// ============================================================
// STUDENTS
// ============================================================
export const studentService = {
  async getAll() {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        if (isSchemaError(error)) throw error;
        return [];
      }
      return (data || []).map(mapStudent);
    } catch (e: any) {
      throw e;
    }
  },

  async create(student: any) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('students')
      .insert(toDbStudent(student))
      .select()
      .single();
    if (error) {
      if (isSchemaError(error)) throw error;
      return null;
    }
    return mapStudent(data);
  },

  async update(id: string, student: any) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('students')
      .update(toDbStudent(student))
      .eq('id', id)
      .select()
      .single();
    if (error) {
      if (isSchemaError(error)) throw error;
      return null;
    }
    return mapStudent(data);
  },

  async delete(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from('students').delete().eq('id', id);
    if (error && isSchemaError(error)) throw error;
  },

  async getByRollNo(rollNo: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('roll_no', rollNo)
      .maybeSingle();
    if (error) {
      if (isSchemaError(error)) throw error;
      return null;
    }
    return data ? mapStudent(data) : null;
  },
};

function mapStudent(row: any) {
  return {
    id: row.id,
    rollNo: row.roll_no,
    name: row.name,
    school: row.school,
    course: row.course,
    semester: row.semester,
    lateralEntry: row.lateral_entry,
    admissionYear: row.admission_year,
    dob: row.dob,
    gender: row.gender,
    guardianName: row.guardian_name,
    phone: row.phone,
    address: row.address,
    feeStatus: row.fee_status,
    totalFees: Number(row.total_fees),
    paidFees: Number(row.paid_fees),
    category: row.category,
    aadhar: row.aadhar,
  };
}

function toDbStudent(s: any) {
  return {
    roll_no: s.rollNo,
    name: s.name,
    school: s.school,
    course: s.course,
    semester: s.semester,
    lateral_entry: s.lateralEntry,
    admission_year: s.admissionYear,
    dob: s.dob,
    gender: s.gender,
    guardian_name: s.guardianName,
    phone: s.phone,
    address: s.address,
    fee_status: s.feeStatus,
    total_fees: s.totalFees,
    paid_fees: s.paidFees,
    category: s.category,
    aadhar: s.aadhar,
  };
}

// ============================================================
// FEES
// ============================================================
export const feeService = {
  async getAll() {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('fees')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        if (isSchemaError(error)) throw error;
        return [];
      }
      return (data || []).map(mapFee);
    } catch (e: any) {
      throw e;
    }
  },

  async getByStudentRollNo(rollNo: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('fees')
      .select('*')
      .eq('roll_no', rollNo)
      .order('created_at', { ascending: false });
    if (error) {
      if (isSchemaError(error)) throw error;
      return [];
    }
    return (data || []).map(mapFee);
  },

  async create(fee: any) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('fees')
      .insert(toDbFee(fee))
      .select()
      .single();
    if (error) {
      if (isSchemaError(error)) throw error;
      return null;
    }
    return mapFee(data);
  },

  async update(id: string, fee: any) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('fees')
      .update(toDbFee(fee))
      .eq('id', id)
      .select()
      .single();
    if (error) {
      if (isSchemaError(error)) throw error;
      return null;
    }
    return mapFee(data);
  },

  async delete(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from('fees').delete().eq('id', id);
    if (error && isSchemaError(error)) throw error;
  },
};

function mapFee(row: any) {
  return {
    id: row.id,
    receiptNo: row.receipt_no,
    studentId: row.student_id,
    rollNo: row.roll_no,
    studentName: row.student_name,
    school: row.school,
    course: row.course,
    semester: row.semester,
    annualFee: Number(row.annual_fee),
    discount: Number(row.discount),
    paidAmount: Number(row.paid_amount),
    paymentDate: row.payment_date,
    paymentMode: row.payment_mode,
    remarks: row.remarks,
    status: row.status,
    academicYear: row.academic_year,
  };
}

function toDbFee(f: any) {
  return {
    receipt_no: f.receiptNo,
    student_id: f.studentId || null,
    roll_no: f.rollNo,
    student_name: f.studentName,
    school: f.school,
    course: f.course,
    semester: f.semester,
    annual_fee: f.annualFee,
    discount: f.discount,
    paid_amount: f.paidAmount,
    payment_date: f.paymentDate,
    payment_mode: f.paymentMode,
    remarks: f.remarks,
    status: f.status,
    academic_year: f.academicYear,
  };
}

// ============================================================
// STAFF
// ============================================================
export const staffService = {
  async getAll() {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        if (isSchemaError(error)) throw error;
        return [];
      }
      return (data || []).map(mapStaff);
    } catch (e: any) {
      throw e;
    }
  },

  async create(staff: any) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('staff')
      .insert(toDbStaff(staff))
      .select()
      .single();
    if (error) {
      if (isSchemaError(error)) throw error;
      return null;
    }
    return mapStaff(data);
  },

  async update(id: string, staff: any) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('staff')
      .update(toDbStaff(staff))
      .eq('id', id)
      .select()
      .single();
    if (error) {
      if (isSchemaError(error)) throw error;
      return null;
    }
    return mapStaff(data);
  },

  async delete(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from('staff').delete().eq('id', id);
    if (error && isSchemaError(error)) throw error;
  },
};

function mapStaff(row: any) {
  return {
    id: row.id,
    empId: row.emp_id,
    name: row.name,
    college: row.college,
    department: row.department,
    role: row.role,
    designation: row.designation,
    basicSalary: Number(row.basic_salary),
    hra: Number(row.hra),
    ta: Number(row.ta),
    da: Number(row.da),
    pf: Number(row.pf),
    tds: Number(row.tds),
    otherDeductions: Number(row.other_deductions),
    joiningDate: row.joining_date,
    bankAccount: row.bank_account,
    ifsc: row.ifsc,
    bankName: row.bank_name,
  };
}

function toDbStaff(s: any) {
  return {
    emp_id: s.empId,
    name: s.name,
    college: s.college,
    department: s.department,
    role: s.role,
    designation: s.designation || s.role,
    basic_salary: s.basicSalary,
    hra: s.hra,
    ta: s.ta,
    da: s.da,
    pf: s.pf,
    tds: s.tds,
    other_deductions: s.otherDeductions,
    joining_date: s.joiningDate,
    bank_account: s.bankAccount,
    ifsc: s.ifsc,
    bank_name: s.bankName || '',
  };
}

// ============================================================
// SALARY PAYMENTS
// ============================================================
export const salaryService = {
  async getAll() {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('salary_payments')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        if (isSchemaError(error)) throw error;
        return [];
      }
      return (data || []).map(mapSalary);
    } catch (e: any) {
      throw e;
    }
  },

  async create(payment: any) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('salary_payments')
      .insert(toDbSalary(payment))
      .select()
      .single();
    if (error) {
      if (isSchemaError(error)) throw error;
      return null;
    }
    return mapSalary(data);
  },

  async update(id: string, payment: any) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('salary_payments')
      .update(toDbSalary(payment))
      .eq('id', id)
      .select()
      .single();
    if (error) {
      if (isSchemaError(error)) throw error;
      return null;
    }
    return mapSalary(data);
  },
};

function mapSalary(row: any) {
  return {
    id: row.id,
    staffId: row.staff_id,
    staffName: row.staff_name,
    empId: row.emp_id,
    college: row.college,
    month: row.month,
    year: row.year,
    grossSalary: Number(row.gross_salary),
    attendanceDeduction: Number(row.attendance_deduction),
    totalDeductions: Number(row.total_deductions),
    netSalary: Number(row.net_salary),
    status: row.status,
    paidDate: row.paid_date,
    transactionId: row.transaction_id,
    remarks: row.remarks,
  };
}

function toDbSalary(p: any) {
  return {
    staff_id: p.staffId || null,
    staff_name: p.staffName,
    emp_id: p.empId,
    college: p.college,
    month: p.month,
    year: p.year,
    gross_salary: p.grossSalary,
    attendance_deduction: p.attendanceDeduction || 0,
    total_deductions: p.totalDeductions,
    net_salary: p.netSalary,
    status: p.status,
    paid_date: p.paidDate || '',
    transaction_id: p.transactionId || '',
    remarks: p.remarks || '',
  };
}

// ============================================================
// ATTENDANCE
// ============================================================
export const attendanceService = {
  async getAll() {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        if (isSchemaError(error)) throw error;
        return [];
      }
      return (data || []).map(mapAttendance);
    } catch (e: any) {
      throw e;
    }
  },

  async upsert(record: any) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('attendance')
      .upsert(toDbAttendance(record), { onConflict: 'id' })
      .select()
      .single();
    if (error) {
      if (isSchemaError(error)) throw error;
      return null;
    }
    return mapAttendance(data);
  },
};

function mapAttendance(row: any) {
  return {
    id: row.id,
    staffId: row.staff_id,
    empId: row.emp_id,
    staffName: row.staff_name,
    attendanceDate: row.attendance_date,
    month: row.month,
    year: row.year,
    totalDays: row.total_days,
    presentDays: row.present_days,
    absentDays: row.absent_days,
    lateDays: row.late_days,
    leaveDays: row.leave_days,
    status: row.status,
  };
}

function toDbAttendance(a: any) {
  return {
    staff_id: a.staffId || null,
    emp_id: a.empId,
    staff_name: a.staffName,
    attendance_date: a.attendanceDate || new Date().toISOString().split('T')[0],
    month: a.month,
    year: a.year,
    total_days: a.totalDays || 26,
    present_days: a.presentDays || 0,
    absent_days: a.absentDays || 0,
    late_days: a.lateDays || 0,
    leave_days: a.leaveDays || 0,
    status: a.status || 'present',
  };
}

// ============================================================
// LEAVE APPLICATIONS
// ============================================================
export const leaveService = {
  async getAll() {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('leave_applications')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        if (isSchemaError(error)) throw error;
        return [];
      }
      return (data || []).map(mapLeave);
    } catch (e: any) {
      throw e;
    }
  },

  async create(leave: any) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('leave_applications')
      .insert(toDbLeave(leave))
      .select()
      .single();
    if (error) {
      if (isSchemaError(error)) throw error;
      return null;
    }
    return mapLeave(data);
  },

  async update(id: string, leave: any) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('leave_applications')
      .update(toDbLeave(leave))
      .eq('id', id)
      .select()
      .single();
    if (error) {
      if (isSchemaError(error)) throw error;
      return null;
    }
    return mapLeave(data);
  },
};

function mapLeave(row: any) {
  return {
    id: row.id,
    staffId: row.staff_id,
    staffName: row.staff_name,
    empId: row.emp_id,
    college: row.college,
    department: row.department,
    role: row.role,
    leaveType: row.leave_type,
    fromDate: row.from_date,
    toDate: row.to_date,
    days: row.days,
    reason: row.reason,
    status: row.status,
    appliedOn: row.applied_on,
    approvedBy: row.approved_by,
    approvedOn: row.approved_on,
    remarks: row.remarks,
  };
}

function toDbLeave(l: any) {
  return {
    staff_id: l.staffId || null,
    staff_name: l.staffName,
    emp_id: l.empId,
    college: l.college,
    department: l.department,
    role: l.role,
    leave_type: l.leaveType,
    from_date: l.fromDate,
    to_date: l.toDate,
    days: l.days,
    reason: l.reason,
    status: l.status,
    applied_on: l.appliedOn,
    approved_by: l.approvedBy || '',
    approved_on: l.approvedOn || '',
    remarks: l.remarks || '',
  };
}

// ============================================================
// RECEIPTS
// ============================================================
export const receiptService = {
  async getAll() {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('receipts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        if (isSchemaError(error)) throw error;
        return [];
      }
      return data || [];
    } catch (e: any) {
      throw e;
    }
  },

  async create(receipt: any) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('receipts')
      .insert(receipt)
      .select()
      .single();
    if (error) {
      if (isSchemaError(error)) throw error;
      return null;
    }
    return data;
  },
};
