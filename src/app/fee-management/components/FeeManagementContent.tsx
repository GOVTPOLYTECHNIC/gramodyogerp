'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Download } from 'lucide-react';
import { FeeRecord } from './feeData';
import FeeKPICards from './FeeKPICards';
import FeeFilters from './FeeFilters';
import FeeTable from './FeeTable';
import RecordPaymentModal from './RecordPaymentModal';
import FeeReceiptModal from './FeeReceiptModal';
import EditFeeModal from './EditFeeModal';
import { feeService } from '@/lib/supabase/services';
import { toast } from 'sonner';

export default function FeeManagementContent() {
  const [records, setRecords] = useState<FeeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterSchool, setFilterSchool] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterMode, setFilterMode] = useState('');
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [receiptRecord, setReceiptRecord] = useState<FeeRecord | null>(null);
  const [editRecord, setEditRecord] = useState<FeeRecord | null>(null);
  const [page, setPage] = useState(1);
  const [studentRole, setStudentRole] = useState<string | null>(null);
  const [studentRoll, setStudentRoll] = useState<string | null>(null);
  const perPage = 10;

  useEffect(() => {
    const role = typeof window !== 'undefined' ? localStorage.getItem('gramodyog_role') : null;
    const roll = typeof window !== 'undefined' ? localStorage.getItem('gramodyog_student_roll') : null;
    setStudentRole(role);
    setStudentRoll(roll);
    loadRecords();
  }, []);

  async function loadRecords() {
    setLoading(true);
    try {
      const data = await feeService.getAll();
      setRecords(data as FeeRecord[]);
    } catch (e: any) {
      toast.error('Failed to load fee records: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    let base = records;
    if (studentRole === 'student' && studentRoll) {
      base = base.filter((r) => r.rollNo.toLowerCase() === studentRoll.toLowerCase());
    }
    return base.filter((r) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        r.studentName.toLowerCase().includes(q) ||
        r.rollNo.toLowerCase().includes(q) ||
        r.receiptNo.toLowerCase().includes(q);
      const matchSchool = !filterSchool || r.school === filterSchool;
      const matchStatus = !filterStatus || r.status === filterStatus;
      const matchMode = !filterMode || r.paymentMode === filterMode;
      return matchSearch && matchSchool && matchStatus && matchMode;
    });
  }, [records, search, filterSchool, filterStatus, filterMode, studentRole, studentRoll]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handleRecordPayment = async (newRecord: FeeRecord) => {
    try {
      const result = await feeService.create(newRecord);
      if (result) {
        setRecords((prev) => [result as FeeRecord, ...prev]);
        toast.success(`Payment recorded. Receipt ${newRecord.receiptNo} generated.`);
      }
    } catch (e: any) {
      toast.error('Failed to record payment: ' + e.message);
    }
    setPaymentOpen(false);
  };

  const handleSaveEdit = async (updated: FeeRecord) => {
    try {
      const result = await feeService.update(updated.id, updated);
      if (result) {
        setRecords((prev) => prev.map((r) => (r.id === updated.id ? (result as FeeRecord) : r)));
        toast.success('Fee record updated successfully');
      }
    } catch (e: any) {
      toast.error('Update failed: ' + e.message);
    }
    setEditRecord(null);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Fee Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Academic Year 2025–26 · {loading ? 'Loading...' : `${records.length} records`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary flex items-center gap-2 text-xs h-9">
            <Download size={14} />
            Export Ledger
          </button>
          <button
            onClick={() => setPaymentOpen(true)}
            className="btn-primary flex items-center gap-2 h-9"
          >
            <Plus size={16} />
            Record Payment
          </button>
        </div>
      </div>

      <FeeKPICards records={records} />

      <FeeFilters
        search={search}
        setSearch={setSearch}
        filterSchool={filterSchool}
        setFilterSchool={setFilterSchool}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterMode={filterMode}
        setFilterMode={setFilterMode}
      />

      {loading ? (
        <div className="card p-8 text-center text-muted-foreground">Loading fee records from database...</div>
      ) : (
        <FeeTable
          records={paginated}
          allRecords={records}
          page={page}
          perPage={perPage}
          total={filtered.length}
          totalPages={totalPages}
          onPageChange={setPage}
          onViewReceipt={setReceiptRecord}
          onEdit={setEditRecord}
        />
      )}

      {paymentOpen && (
        <RecordPaymentModal
          open={paymentOpen}
          onClose={() => setPaymentOpen(false)}
          onRecord={handleRecordPayment}
          existingRecords={records}
        />
      )}
      {receiptRecord && (
        <FeeReceiptModal
          open={!!receiptRecord}
          record={receiptRecord}
          allRecords={records}
          onClose={() => setReceiptRecord(null)}
        />
      )}
      {editRecord && (
        <EditFeeModal
          open={!!editRecord}
          record={editRecord}
          onClose={() => setEditRecord(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}