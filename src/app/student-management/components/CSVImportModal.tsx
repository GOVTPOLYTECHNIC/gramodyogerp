'use client';
import React, { useState, useRef, useCallback } from 'react';
import Modal from '@/components/ui/Modal';
import { Upload, AlertCircle, CheckCircle, Download, FileText } from 'lucide-react';
import { SCHOOL_COURSES, SCHOOL_FEE, School, Student } from './studentData';

interface CSVImportModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (students: Student[]) => void;
  existingCount: number;
}

interface ParsedRow {
  rowIndex: number;
  raw: Record<string, string>;
  mapped: Partial<Student>;
  errors: string[];
  valid: boolean;
}

const REQUIRED_FIELDS = ['name', 'rollNo', 'school', 'course', 'semester'];
const VALID_SCHOOLS = ['Rajiv Gandhi Polytechnic', 'Rajiv Gandhi ITI', 'GSS Diploma College'] as School[];
const VALID_GENDERS = ['Male', 'Female', 'Other'];
const VALID_CATEGORIES = ['General', 'OBC', 'SC', 'ST'];

// Auto-mapping: maps common CSV header variations to internal field names
const HEADER_MAP: Record<string, string> = {
  name: 'name', 'full name': 'name', 'student name': 'name', 'student_name': 'name', 'fullname': 'name',
  rollno: 'rollNo', 'roll no': 'rollNo', 'roll number': 'rollNo', 'roll_no': 'rollNo', 'rollnumber': 'rollNo',
  school: 'school', institution: 'school', college: 'school',
  course: 'course', program: 'course', programme: 'course',
  semester: 'semester', sem: 'semester',
  admissionyear: 'admissionYear', 'admission year': 'admissionYear', 'admission_year': 'admissionYear', year: 'admissionYear',
  dob: 'dob', 'date of birth': 'dob', 'dateofbirth': 'dob', 'birth date': 'dob',
  gender: 'gender', sex: 'gender',
  guardianname: 'guardianName', 'guardian name': 'guardianName', 'guardian_name': 'guardianName', guardian: 'guardianName', father: 'guardianName',
  phone: 'phone', mobile: 'phone', 'mobile number': 'phone', contact: 'phone',
  address: 'address',
  category: 'category', caste: 'category',
  aadhar: 'aadhar', aadhaar: 'aadhar', 'aadhar number': 'aadhar', 'aadhaar number': 'aadhar',
};

function parseCSV(text: string): string[][] {
  const lines = text.trim().split(/\r?\n/);
  return lines.map((line) => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  });
}

function validateAndMapRow(raw: Record<string, string>, rowIndex: number, existingCount: number, importIndex: number): ParsedRow {
  const errors: string[] = [];
  const mapped: Partial<Student> = {};

  // Name
  const name = raw['name']?.trim();
  if (!name) errors.push('Name is required');
  else mapped.name = name;

  // Roll No
  const rollNo = raw['rollNo']?.trim();
  if (!rollNo) errors.push('Roll No is required');
  else mapped.rollNo = rollNo;

  // School
  const school = raw['school']?.trim() as School;
  if (!school) {
    errors.push('School/Institution is required');
  } else if (!VALID_SCHOOLS.includes(school)) {
    errors.push(`Invalid school. Must be one of: ${VALID_SCHOOLS.join(', ')}`);
  } else {
    mapped.school = school;
  }

  // Course
  const course = raw['course']?.trim();
  if (!course) {
    errors.push('Course is required');
  } else if (mapped.school && !SCHOOL_COURSES[mapped.school]?.includes(course)) {
    errors.push(`Invalid course "${course}" for ${mapped.school}`);
  } else {
    mapped.course = course;
  }

  // Semester
  const semStr = raw['semester']?.trim();
  const sem = parseInt(semStr, 10);
  if (!semStr) errors.push('Semester is required');
  else if (isNaN(sem) || sem < 1 || sem > 6) errors.push('Semester must be 1–6');
  else mapped.semester = sem;

  // Admission Year (optional, default current year)
  const admYear = raw['admissionYear']?.trim() || '2026';
  mapped.admissionYear = admYear;

  // DOB (optional)
  mapped.dob = raw['dob']?.trim() || '';

  // Gender (optional, default Male)
  const gender = raw['gender']?.trim();
  if (gender && !VALID_GENDERS.includes(gender)) {
    errors.push(`Invalid gender. Must be Male, Female, or Other`);
  } else {
    mapped.gender = (gender as 'Male' | 'Female' | 'Other') || 'Male';
  }

  // Guardian Name (optional)
  mapped.guardianName = raw['guardianName']?.trim() || '';

  // Phone (optional)
  const phone = raw['phone']?.trim() || '';
  if (phone && !/^[6-9]\d{9}$/.test(phone)) {
    errors.push('Phone must be a valid 10-digit mobile number');
  } else {
    mapped.phone = phone;
  }

  // Address (optional)
  mapped.address = raw['address']?.trim() || '';

  // Category (optional, default General)
  const category = raw['category']?.trim();
  if (category && !VALID_CATEGORIES.includes(category)) {
    errors.push(`Invalid category. Must be General, OBC, SC, or ST`);
  } else {
    mapped.category = (category as 'General' | 'OBC' | 'SC' | 'ST') || 'General';
  }

  // Aadhar (optional)
  mapped.aadhar = raw['aadhar']?.trim() || '';

  // Lateral Entry (optional)
  const lateral = raw['lateralEntry']?.trim().toLowerCase();
  mapped.lateralEntry = lateral === 'true' || lateral === 'yes' || lateral === '1';

  // Fee calculation
  if (mapped.school) {
    const fees = SCHOOL_FEE[mapped.school];
    mapped.totalFees = mapped.lateralEntry ? fees.lateral : fees.regular;
    mapped.paidFees = 0;
    mapped.feeStatus = 'Pending';
  }

  // Generate ID
  mapped.id = `std-csv-${Date.now()}-${importIndex}`;

  return {
    rowIndex,
    raw,
    mapped,
    errors,
    valid: errors.length === 0,
  };
}

const SAMPLE_CSV = `name,rollNo,school,course,semester,admissionYear,gender,guardianName,phone,address,category,aadhar
Rahul Kumar,RGP-2027-001,Rajiv Gandhi Polytechnic,Civil Engineering,1,2027,Male,Suresh Kumar,9876543210,"Village Rampur, Varanasi",General,1234 5678 9012 Priya Singh,ITI-2027-001,Rajiv Gandhi ITI,Electrician,1,2027,Female,Ramesh Singh,9765432109,"Mohalla Shivpuri, Mirzapur",OBC,2345 6789 0123`;

export default function CSVImportModal({ open, onClose, onImport, existingCount }: CSVImportModalProps) {
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState('');
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [step, setStep] = useState<'upload' | 'review'>('upload');
  const [importing, setImporting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    if (!file.name.endsWith('.csv')) {
      alert('Please upload a valid .csv file');
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = parseCSV(text);
      if (rows.length < 2) {
        alert('CSV must have a header row and at least one data row');
        return;
      }
      const headers = rows[0].map((h) => h.toLowerCase().trim());
      const dataRows = rows.slice(1).filter((r) => r.some((c) => c.trim() !== ''));

      const parsed: ParsedRow[] = dataRows.map((row, idx) => {
        // Build raw object with auto-mapped keys
        const rawMapped: Record<string, string> = {};
        headers.forEach((h, i) => {
          const mappedKey = HEADER_MAP[h];
          if (mappedKey) rawMapped[mappedKey] = row[i] || '';
        });
        return validateAndMapRow(rawMapped, idx + 2, existingCount, idx);
      });

      setParsedRows(parsed);
      setStep('review');
    };
    reader.readAsText(file);
  }, [existingCount]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const validRows = parsedRows.filter((r) => r.valid);
  const invalidRows = parsedRows.filter((r) => !r.valid);

  const handleImport = () => {
    if (validRows.length === 0) return;
    setImporting(true);
    setTimeout(() => {
      const students: Student[] = validRows.map((r) => r.mapped as Student);
      onImport(students);
      setImporting(false);
      handleClose();
    }, 800);
  };

  const handleClose = () => {
    setStep('upload');
    setParsedRows([]);
    setFileName('');
    if (fileRef.current) fileRef.current.value = '';
    onClose();
  };

  const downloadSample = () => {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_students.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Batch Import Students via CSV"
      subtitle="Upload a CSV file to import multiple student records at once"
      size="2xl"
    >
      {step === 'upload' && (
        <div className="space-y-5">
          {/* Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
              dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-secondary/40'
            }`}
          >
            <Upload size={36} className="mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm font-semibold text-foreground">Drag & drop your CSV file here</p>
            <p className="text-xs text-muted-foreground mt-1">or click to browse — only .csv files accepted</p>
            <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
          </div>

          {/* Field Mapping Info */}
          <div className="bg-secondary/60 rounded-xl p-4">
            <p className="text-xs font-semibold text-foreground mb-2">Auto-Mapped CSV Columns</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs text-muted-foreground">
              {[
                ['name / full name / student name', 'Name ✱'],
                ['rollNo / roll no / roll number', 'Roll No ✱'],
                ['school / institution / college', 'School ✱'],
                ['course / program', 'Course ✱'],
                ['semester / sem', 'Semester ✱'],
                ['admissionYear / admission year', 'Admission Year'],
                ['gender / sex', 'Gender'],
                ['guardianName / guardian', 'Guardian Name'],
                ['phone / mobile', 'Phone'],
                ['address', 'Address'],
                ['category / caste', 'Category'],
                ['aadhar / aadhaar', 'Aadhar'],
              ].map(([csv, field]) => (
                <div key={field} className="flex gap-1">
                  <span className="text-primary font-medium">{field}:</span>
                  <span className="truncate">{csv}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">✱ Required fields</p>
          </div>

          {/* Sample Download */}
          <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-blue-600" />
              <span className="text-xs text-blue-700 dark:text-blue-300 font-medium">Download sample CSV template to get started</span>
            </div>
            <button onClick={downloadSample} className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
              <Download size={13} /> Sample CSV
            </button>
          </div>
        </div>
      )}

      {step === 'review' && (
        <div className="space-y-4">
          {/* Summary Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg px-3 py-1.5">
              <CheckCircle size={14} className="text-green-600" />
              <span className="text-xs font-semibold text-green-700 dark:text-green-300">{validRows.length} Valid</span>
            </div>
            {invalidRows.length > 0 && (
              <div className="flex items-center gap-1.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg px-3 py-1.5">
                <AlertCircle size={14} className="text-red-600" />
                <span className="text-xs font-semibold text-red-700 dark:text-red-300">{invalidRows.length} Errors</span>
              </div>
            )}
            <span className="text-xs text-muted-foreground ml-auto">{fileName}</span>
            <button onClick={() => { setStep('upload'); setParsedRows([]); }} className="text-xs text-primary hover:underline">
              Change file
            </button>
          </div>

          {/* Rows Table */}
          <div className="max-h-80 overflow-y-auto rounded-xl border border-border">
            <table className="w-full text-xs">
              <thead className="bg-secondary sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-muted-foreground w-10">Row</th>
                  <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Name</th>
                  <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Roll No</th>
                  <th className="px-3 py-2 text-left font-semibold text-muted-foreground">School</th>
                  <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Course</th>
                  <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Sem</th>
                  <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {parsedRows.map((row) => (
                  <React.Fragment key={row.rowIndex}>
                    <tr className={row.valid ? 'bg-background' : 'bg-red-50/50 dark:bg-red-950/10'}>
                      <td className="px-3 py-2 text-muted-foreground">{row.rowIndex}</td>
                      <td className="px-3 py-2 font-medium text-foreground">{row.mapped.name || <span className="text-danger italic">missing</span>}</td>
                      <td className="px-3 py-2 text-muted-foreground">{row.mapped.rollNo || <span className="text-danger italic">missing</span>}</td>
                      <td className="px-3 py-2 text-muted-foreground max-w-[120px] truncate">{row.mapped.school || <span className="text-danger italic">missing</span>}</td>
                      <td className="px-3 py-2 text-muted-foreground max-w-[100px] truncate">{row.mapped.course || <span className="text-danger italic">missing</span>}</td>
                      <td className="px-3 py-2 text-muted-foreground">{row.mapped.semester ?? <span className="text-danger italic">—</span>}</td>
                      <td className="px-3 py-2">
                        {row.valid ? (
                          <span className="inline-flex items-center gap-1 text-green-600 font-semibold">
                            <CheckCircle size={12} /> Valid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-600 font-semibold">
                            <AlertCircle size={12} /> Error
                          </span>
                        )}
                      </td>
                    </tr>
                    {!row.valid && (
                      <tr className="bg-red-50/50 dark:bg-red-950/10">
                        <td colSpan={7} className="px-3 pb-2">
                          <ul className="list-disc list-inside space-y-0.5">
                            {row.errors.map((err, i) => (
                              <li key={i} className="text-xs text-red-600">{err}</li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {invalidRows.length > 0 && (
            <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
              ⚠ Rows with errors will be skipped. Only {validRows.length} valid row(s) will be imported.
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
            <button type="button" onClick={handleClose} className="btn-secondary">Cancel</button>
            <button
              onClick={handleImport}
              disabled={validRows.length === 0 || importing}
              className="btn-primary flex items-center gap-2 min-w-[160px] justify-center disabled:opacity-50"
            >
              {importing ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Importing...
                </>
              ) : (
                <>
                  <Upload size={15} />
                  Import {validRows.length} Student{validRows.length !== 1 ? 's' : ''}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
