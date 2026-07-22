'use client';
import React, { useState, useEffect } from 'react';
import { Search, CreditCard } from 'lucide-react';
import { Student } from '@/app/student-management/components/studentData';
import { getStudents } from '@/lib/studentStore';
import IDCardModal from '@/app/student-management/components/IDCardModal';

export default function IDCardsContent() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentRole, setStudentRole] = useState<string | null>(null);
  const [studentRoll, setStudentRoll] = useState<string | null>(null);

  useEffect(() => {
    const role = typeof window !== 'undefined' ? localStorage.getItem('gramodyog_role') : null;
    const roll = typeof window !== 'undefined' ? localStorage.getItem('gramodyog_student_roll') : null;
    setStudentRole(role);
    setStudentRoll(roll);
    setStudents(getStudents());
  }, []);

  const filtered = students.filter((s) => {
    // If student role, only show their own record
    if (studentRole === 'student' && studentRoll) {
      return s.rollNo.toLowerCase() === studentRoll.toLowerCase();
    }
    const q = search.toLowerCase();
    return (
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.rollNo.toLowerCase().includes(q) ||
      s.school.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Student ID Cards</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Search and print ID cards for enrolled students
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name, roll no, or institution..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-9"
        />
      </div>

      {/* Student Grid */}
      {filtered.length === 0 ? (
        <div className="card p-12 flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
            <CreditCard size={24} className="text-muted-foreground" />
          </div>
          <p className="font-semibold text-foreground">No students found</p>
          <p className="text-sm text-muted-foreground">Try a different search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((student) => (
            <div
              key={student.id}
              className="card p-4 flex flex-col gap-3 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedStudent(student)}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  {student.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm truncate">{student.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{student.rollNo}</p>
                </div>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p className="truncate">{student.school.includes('Polytechnic') ? 'RGP' : student.school.includes('ITI') ? 'ITI' : 'GSS'} · {student.course}</p>
                <p>Sem {student.semester} · {student.admissionYear}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedStudent(student); }}
                className="btn-primary text-xs h-8 flex items-center justify-center gap-1.5 w-full"
              >
                <CreditCard size={13} />
                View ID Card
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedStudent && (
        <IDCardModal
          open={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          student={selectedStudent}
        />
      )}
    </div>
  );
}
