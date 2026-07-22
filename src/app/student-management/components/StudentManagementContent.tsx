'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Download, Upload } from 'lucide-react';
import { Student } from './studentData';
import { studentService } from '@/lib/supabase/services';
import StudentFilters from './StudentFilters';
import StudentTable from './StudentTable';
import AddStudentModal from './AddStudentModal';
import EditStudentModal from './EditStudentModal';
import GatePassModal from './GatePassModal';
import IDCardModal from './IDCardModal';
import CSVImportModal from './CSVImportModal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { toast } from 'sonner';

export default function StudentManagementContent() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterSchool, setFilterSchool] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSemester, setFilterSemester] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [csvImportOpen, setCsvImportOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [deleteStudent, setDeleteStudent] = useState<Student | null>(null);
  const [gatePassStudent, setGatePassStudent] = useState<Student | null>(null);
  const [idCardStudent, setIdCardStudent] = useState<Student | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Load from Supabase on mount
  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    setLoading(true);
    try {
      const data = await studentService.getAll();
      setStudents(data as Student[]);
    } catch (e: any) {
      toast.error('Failed to load students: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q) ||
        s.guardianName.toLowerCase().includes(q) ||
        s.phone.includes(q);
      const matchSchool = !filterSchool || s.school === filterSchool;
      const matchCourse = !filterCourse || s.course === filterCourse;
      const matchStatus = !filterStatus || s.feeStatus === filterStatus;
      const matchSem = !filterSemester || String(s.semester) === filterSemester;
      return matchSearch && matchSchool && matchCourse && matchStatus && matchSem;
    });
  }, [students, search, filterSchool, filterCourse, filterStatus, filterSemester]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handleDelete = async () => {
    if (!deleteStudent) return;
    setDeleteLoading(true);
    try {
      await studentService.delete(deleteStudent.id);
      setStudents((prev) => prev.filter((s) => s.id !== deleteStudent.id));
      toast.success(`Student ${deleteStudent.name} deleted successfully`);
    } catch (e: any) {
      toast.error('Delete failed: ' + e.message);
    } finally {
      setDeleteLoading(false);
      setDeleteStudent(null);
    }
  };

  const handleSaveEdit = async (updated: Student) => {
    try {
      const result = await studentService.update(updated.id, updated);
      if (result) {
        setStudents((prev) => prev.map((s) => (s.id === updated.id ? (result as Student) : s)));
        toast.success('Student record updated successfully');
      }
    } catch (e: any) {
      toast.error('Update failed: ' + e.message);
    }
    setEditStudent(null);
  };

  const handleAddStudent = async (student: Student) => {
    try {
      const result = await studentService.create(student);
      if (result) {
        setStudents((prev) => [result as Student, ...prev]);
        toast.success(`${student.name} admitted successfully`);
      }
    } catch (e: any) {
      toast.error('Add failed: ' + e.message);
    }
    setAddOpen(false);
  };

  const handleCSVImport = async (importedStudents: Student[]) => {
    try {
      const results = await Promise.all(importedStudents.map((s) => studentService.create(s)));
      const added = results.filter(Boolean) as Student[];
      setStudents((prev) => [...added, ...prev]);
      toast.success(`${added.length} student(s) imported successfully via CSV`);
    } catch (e: any) {
      toast.error('CSV import failed: ' + e.message);
    }
    setCsvImportOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Student Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {loading ? 'Loading...' : `${students.length} students enrolled`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCsvImportOpen(true)}
            className="btn-secondary flex items-center gap-2 text-xs h-9"
          >
            <Upload size={14} />
            Import CSV
          </button>
          <button className="btn-secondary flex items-center gap-2 text-xs h-9">
            <Download size={14} />
            Export
          </button>
          <button
            onClick={() => setAddOpen(true)}
            className="btn-primary flex items-center gap-2 h-9"
          >
            <Plus size={16} />
            Add Student
          </button>
        </div>
      </div>

      <StudentFilters
        search={search}
        setSearch={setSearch}
        filterSchool={filterSchool}
        setFilterSchool={setFilterSchool}
        filterCourse={filterCourse}
        setFilterCourse={setFilterCourse}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterSemester={filterSemester}
        setFilterSemester={setFilterSemester}
      />

      {loading ? (
        <div className="card p-8 text-center text-muted-foreground">Loading students from database...</div>
      ) : (
        <StudentTable
          students={paginated}
          page={page}
          perPage={perPage}
          totalPages={totalPages}
          totalCount={filtered.length}
          onPageChange={setPage}
          onPerPageChange={(n) => { setPerPage(n); setPage(1); }}
          onEdit={setEditStudent}
          onDelete={setDeleteStudent}
          onGatePass={setGatePassStudent}
          onIDCard={setIdCardStudent}
        />
      )}

      {addOpen && (
        <AddStudentModal
          onClose={() => setAddOpen(false)}
          onAdd={handleAddStudent}
        />
      )}
      {editStudent && (
        <EditStudentModal
          student={editStudent}
          onClose={() => setEditStudent(null)}
          onSave={handleSaveEdit}
        />
      )}
      {deleteStudent && (
        <ConfirmModal
          title="Delete Student"
          message={`Are you sure you want to delete ${deleteStudent.name}? This will also remove their fee records.`}
          confirmLabel="Delete"
          loading={deleteLoading}
          onConfirm={handleDelete}
          onCancel={() => setDeleteStudent(null)}
        />
      )}
      {gatePassStudent && (
        <GatePassModal
          student={gatePassStudent}
          onClose={() => setGatePassStudent(null)}
        />
      )}
      {idCardStudent && (
        <IDCardModal
          student={idCardStudent}
          onClose={() => setIdCardStudent(null)}
        />
      )}
      {csvImportOpen && (
        <CSVImportModal
          onClose={() => setCsvImportOpen(false)}
          onImport={handleCSVImport}
        />
      )}
    </div>
  );
}