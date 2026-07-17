'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Download } from 'lucide-react';
import { Student } from './studentData';
import { getStudents, saveStudents, deleteStudentAndFees, getFeeRecords } from '@/lib/studentStore';
import StudentFilters from './StudentFilters';
import StudentTable from './StudentTable';
import AddStudentModal from './AddStudentModal';
import EditStudentModal from './EditStudentModal';
import GatePassModal from './GatePassModal';
import IDCardModal from './IDCardModal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { toast } from 'sonner';

export default function StudentManagementContent() {
  const [students, setStudents] = useState<Student[]>([]);
  const [feeRecords, setFeeRecords] = useState<import('@/app/fee-management/components/feeData').FeeRecord[]>([]);
  const [search, setSearch] = useState('');
  const [filterSchool, setFilterSchool] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSemester, setFilterSemester] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [deleteStudent, setDeleteStudent] = useState<Student | null>(null);
  const [gatePassStudent, setGatePassStudent] = useState<Student | null>(null);
  const [idCardStudent, setIdCardStudent] = useState<Student | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Load from shared store on mount
  useEffect(() => {
    setStudents(getStudents());
    setFeeRecords(getFeeRecords());
  }, []);

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

  const handleDelete = () => {
    if (!deleteStudent) return;
    setDeleteLoading(true);
    setTimeout(() => {
      // Delete student AND their fee records from shared store
      deleteStudentAndFees(deleteStudent.id);
      setStudents((prev) => prev.filter((s) => s.id !== deleteStudent.id));
      setDeleteLoading(false);
      setDeleteStudent(null);
      toast.success(`Student ${deleteStudent.name} deleted successfully (fees records also removed)`);
    }, 800);
  };

  const handleSaveEdit = (updated: Student) => {
    const newStudents = students.map((s) => (s.id === updated.id ? updated : s));
    setStudents(newStudents);
    saveStudents(newStudents);
    setEditStudent(null);
    toast.success('Student record updated successfully');
  };

  const handleAddStudent = (student: Student) => {
    const newStudents = [student, ...students];
    setStudents(newStudents);
    saveStudents(newStudents);
    setAddOpen(false);
    toast.success(`${student.name} admitted successfully`);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Student Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {students.length} students enrolled · {filtered.length} shown
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary flex items-center gap-2 text-xs h-9">
            <Download size={14} />
            Export
          </button>
          <button
            onClick={() => setAddOpen(true)}
            className="btn-primary flex items-center gap-2 h-9"
          >
            <Plus size={16} />
            Admit New Student
          </button>
        </div>
      </div>

      {/* Filters */}
      <StudentFilters
        search={search}
        onSearch={(v) => { setSearch(v); setPage(1); }}
        filterSchool={filterSchool}
        onFilterSchool={(v) => { setFilterSchool(v); setFilterCourse(''); setPage(1); }}
        filterCourse={filterCourse}
        onFilterCourse={(v) => { setFilterCourse(v); setPage(1); }}
        filterStatus={filterStatus}
        onFilterStatus={(v) => { setFilterStatus(v); setPage(1); }}
        filterSemester={filterSemester}
        onFilterSemester={(v) => { setFilterSemester(v); setPage(1); }}
      />

      {/* Table */}
      <StudentTable
        students={paginated}
        feeRecords={feeRecords}
        onEdit={setEditStudent}
        onDelete={setDeleteStudent}
        onGatePass={setGatePassStudent}
        onIDCard={setIdCardStudent}
        page={page}
        perPage={perPage}
        total={filtered.length}
        totalPages={totalPages}
        onPageChange={setPage}
        onPerPageChange={(v) => { setPerPage(v); setPage(1); }}
      />

      {/* Modals */}
      <AddStudentModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={handleAddStudent}
        existingCount={students.length}
      />
      {editStudent && (
        <EditStudentModal
          open={!!editStudent}
          onClose={() => setEditStudent(null)}
          student={editStudent}
          onSave={handleSaveEdit}
        />
      )}
      {gatePassStudent && (
        <GatePassModal
          open={!!gatePassStudent}
          onClose={() => setGatePassStudent(null)}
          student={gatePassStudent}
        />
      )}
      {idCardStudent && (
        <IDCardModal
          open={!!idCardStudent}
          onClose={() => setIdCardStudent(null)}
          student={idCardStudent}
        />
      )}
      <ConfirmModal
        open={!!deleteStudent}
        onClose={() => setDeleteStudent(null)}
        onConfirm={handleDelete}
        title="Delete Student Record"
        description={`Are you sure you want to permanently delete ${deleteStudent?.name}'s record? Their fee records will also be removed. This action cannot be undone.`}
        confirmLabel="Delete Student"
        loading={deleteLoading}
      />
    </div>
  );
}