'use client';
import React, { useState, useMemo } from 'react';
import { Plus, Download } from 'lucide-react';
import { mockFeeRecords, FeeRecord } from './feeData';
import FeeKPICards from './FeeKPICards';
import FeeFilters from './FeeFilters';
import FeeTable from './FeeTable';
import RecordPaymentModal from './RecordPaymentModal';
import FeeReceiptModal from './FeeReceiptModal';
import { toast } from 'sonner';

export default function FeeManagementContent() {
  const [records, setRecords] = useState<FeeRecord[]>(mockFeeRecords);
  const [search, setSearch] = useState('');
  const [filterSchool, setFilterSchool] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterMode, setFilterMode] = useState('');
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [receiptRecord, setReceiptRecord] = useState<FeeRecord | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = useMemo(() => {
    return records.filter((r) => {
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
  }, [records, search, filterSchool, filterStatus, filterMode]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handleRecordPayment = (newRecord: FeeRecord) => {
    // Backend integration point: POST /api/fee-payments
    setRecords((prev) => [newRecord, ...prev]);
    setPaymentOpen(false);
    toast.success(`Payment recorded. Receipt ${newRecord.receiptNo} generated.`);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Fee Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Academic Year 2025–26 · {records.length} records
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

      {/* KPI Cards */}
      <FeeKPICards records={records} />

      {/* Filters */}
      <FeeFilters
        search={search}
        onSearch={(v) => { setSearch(v); setPage(1); }}
        filterSchool={filterSchool}
        onFilterSchool={(v) => { setFilterSchool(v); setPage(1); }}
        filterStatus={filterStatus}
        onFilterStatus={(v) => { setFilterStatus(v); setPage(1); }}
        filterMode={filterMode}
        onFilterMode={(v) => { setFilterMode(v); setPage(1); }}
      />

      {/* Table */}
      <FeeTable
        records={paginated}
        onViewReceipt={setReceiptRecord}
        page={page}
        perPage={perPage}
        total={filtered.length}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* Modals */}
      <RecordPaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        onRecord={handleRecordPayment}
        existingCount={records.length}
      />
      {receiptRecord && (
        <FeeReceiptModal
          open={!!receiptRecord}
          onClose={() => setReceiptRecord(null)}
          record={receiptRecord}
        />
      )}
    </div>
  );
}