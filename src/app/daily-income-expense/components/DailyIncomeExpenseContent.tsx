'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, TrendingUp, TrendingDown, IndianRupee, Calendar, Pencil, Trash2, X, Check, Download } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface DailyEntry {
  id: string;
  entry_date: string;
  entry_type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  payment_mode: string;
  reference_no: string | null;
  remarks: string | null;
  created_at: string;
}

const INCOME_CATEGORIES = ['Fee Collection', 'Exam Fee', 'Donation', 'Grant', 'Miscellaneous Income'];
const EXPENSE_CATEGORIES = ['Salary', 'Electricity', 'Water', 'Maintenance', 'Stationery', 'Transport', 'Canteen', 'Miscellaneous Expense'];
const PAYMENT_MODES = ['cash', 'bank_transfer', 'upi', 'cheque', 'dd'];

const paymentModeLabel: Record<string, string> = {
  cash: 'Cash',
  bank_transfer: 'Bank Transfer',
  upi: 'UPI',
  cheque: 'Cheque',
  dd: 'DD',
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount);
}

const emptyForm = {
  entry_date: new Date().toISOString().split('T')[0],
  entry_type: 'income\' as \'income\' | \'expense',
  category: '',
  description: '',
  amount: '',
  payment_mode: 'cash',
  reference_no: '',
  remarks: '',
};

export default function DailyIncomeExpenseContent() {
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editEntry, setEditEntry] = useState<DailyEntry | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterType, setFilterType] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    loadEntries();
  }, []);

  async function loadEntries() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('daily_income_expense')
        .select('*')
        .order('entry_date', { ascending: false })
        .order('created_at', { ascending: false });
      if (error) throw error;
      setEntries(data || []);
    } catch (e: any) {
      setError('Failed to load entries: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      const matchDate = !filterDate || e.entry_date === filterDate;
      const matchType = !filterType || e.entry_type === filterType;
      return matchDate && matchType;
    });
  }, [entries, filterDate, filterType]);

  // Group by date
  const grouped = useMemo(() => {
    const map: Record<string, DailyEntry[]> = {};
    filtered.forEach((e) => {
      if (!map[e.entry_date]) map[e.entry_date] = [];
      map[e.entry_date].push(e);
    });
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  // Summary stats
  const totalIncome = useMemo(() => filtered.filter((e) => e.entry_type === 'income').reduce((s, e) => s + e.amount, 0), [filtered]);
  const totalExpense = useMemo(() => filtered.filter((e) => e.entry_type === 'expense').reduce((s, e) => s + e.amount, 0), [filtered]);
  const netBalance = totalIncome - totalExpense;

  function handleDownload() {
    if (filtered.length === 0) return;
    const headers = ['Date', 'Type', 'Category', 'Description', 'Payment Mode', 'Reference No', 'Amount (INR)', 'Remarks'];
    const rows = filtered.map((e) => [
      e.entry_date,
      e.entry_type === 'income' ? 'Income' : 'Expense',
      e.category,
      `"${e.description.replace(/"/g, '""')}"`,
      paymentModeLabel[e.payment_mode] || e.payment_mode,
      e.reference_no || '',
      e.amount.toFixed(2),
      e.remarks ? `"${e.remarks.replace(/"/g, '""')}"` : '',
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const today = new Date().toISOString().split('T')[0];
    link.download = `daily-income-expense-${today}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function openAdd() {
    setEditEntry(null);
    setForm({ ...emptyForm });
    setError('');
    setShowModal(true);
  }

  function openEdit(entry: DailyEntry) {
    setEditEntry(entry);
    setForm({
      entry_date: entry.entry_date,
      entry_type: entry.entry_type,
      category: entry.category,
      description: entry.description,
      amount: String(entry.amount),
      payment_mode: entry.payment_mode,
      reference_no: entry.reference_no || '',
      remarks: entry.remarks || '',
    });
    setError('');
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.entry_date || !form.category || !form.description || !form.amount) {
      setError('Please fill all required fields.');
      return;
    }
    const amt = parseFloat(form.amount);
    if (isNaN(amt) || amt <= 0) {
      setError('Amount must be a positive number.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        entry_date: form.entry_date,
        entry_type: form.entry_type,
        category: form.category,
        description: form.description,
        amount: amt,
        payment_mode: form.payment_mode,
        reference_no: form.reference_no || null,
        remarks: form.remarks || null,
      };
      if (editEntry) {
        const { error } = await supabase.from('daily_income_expense').update(payload).eq('id', editEntry.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('daily_income_expense').insert(payload);
        if (error) throw error;
      }
      setShowModal(false);
      await loadEntries();
    } catch (e: any) {
      setError('Save failed: ' + e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const { error } = await supabase.from('daily_income_expense').delete().eq('id', id);
      if (error) throw error;
      setDeleteId(null);
      await loadEntries();
    } catch (e: any) {
      setError('Delete failed: ' + e.message);
    }
  }

  const categories = form.entry_type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Daily Income &amp; Expense</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Track daily financial transactions</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            disabled={filtered.length === 0}
            className="flex items-center gap-2 bg-card border border-border text-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={16} />
            Download CSV
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} />
            Add Entry
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <TrendingUp size={20} className="text-green-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Income</p>
            <p className="text-lg font-bold text-green-600">{formatAmount(totalIncome)}</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
            <TrendingDown size={20} className="text-red-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Expense</p>
            <p className="text-lg font-bold text-red-500">{formatAmount(totalExpense)}</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${netBalance >= 0 ? 'bg-blue-100' : 'bg-orange-100'}`}>
            <IndianRupee size={20} className={netBalance >= 0 ? 'text-blue-600' : 'text-orange-500'} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Net Balance</p>
            <p className={`text-lg font-bold ${netBalance >= 0 ? 'text-blue-600' : 'text-orange-500'}`}>{formatAmount(netBalance)}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
          <Calendar size={15} className="text-muted-foreground" />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="bg-transparent text-sm text-foreground outline-none"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none"
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        {(filterDate || filterType) && (
          <button
            onClick={() => { setFilterDate(''); setFilterType(''); }}
            className="text-xs text-muted-foreground hover:text-foreground underline"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Error */}
      {error && !showModal && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>
      )}

      {/* Entries grouped by date */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : grouped.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <IndianRupee size={40} className="mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No entries found. Add your first entry.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {grouped.map(([date, dayEntries]) => {
            const dayIncome = dayEntries.filter((e) => e.entry_type === 'income').reduce((s, e) => s + e.amount, 0);
            const dayExpense = dayEntries.filter((e) => e.entry_type === 'expense').reduce((s, e) => s + e.amount, 0);
            return (
              <div key={date} className="bg-card border border-border rounded-xl overflow-hidden">
                {/* Day Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-muted/40 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Calendar size={15} className="text-muted-foreground" />
                    <span className="font-semibold text-sm text-foreground">{formatDate(date)}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-green-600 font-medium">+{formatAmount(dayIncome)}</span>
                    <span className="text-red-500 font-medium">-{formatAmount(dayExpense)}</span>
                    <span className={`font-bold ${dayIncome - dayExpense >= 0 ? 'text-blue-600' : 'text-orange-500'}`}>
                      Net: {formatAmount(dayIncome - dayExpense)}
                    </span>
                  </div>
                </div>
                {/* Entries Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-xs text-muted-foreground">
                        <th className="text-left px-4 py-2 font-medium">Type</th>
                        <th className="text-left px-4 py-2 font-medium">Category</th>
                        <th className="text-left px-4 py-2 font-medium">Description</th>
                        <th className="text-left px-4 py-2 font-medium">Mode</th>
                        <th className="text-left px-4 py-2 font-medium">Ref No.</th>
                        <th className="text-right px-4 py-2 font-medium">Amount</th>
                        <th className="text-center px-4 py-2 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dayEntries.map((entry) => (
                        <tr key={entry.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-2.5">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                              entry.entry_type === 'income' ?'bg-green-100 text-green-700' :'bg-red-100 text-red-600'
                            }`}>
                              {entry.entry_type === 'income' ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                              {entry.entry_type === 'income' ? 'Income' : 'Expense'}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-foreground">{entry.category}</td>
                          <td className="px-4 py-2.5 text-foreground max-w-[200px] truncate" title={entry.description}>{entry.description}</td>
                          <td className="px-4 py-2.5 text-muted-foreground">{paymentModeLabel[entry.payment_mode] || entry.payment_mode}</td>
                          <td className="px-4 py-2.5 text-muted-foreground">{entry.reference_no || '—'}</td>
                          <td className={`px-4 py-2.5 text-right font-semibold ${entry.entry_type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                            {entry.entry_type === 'income' ? '+' : '-'}{formatAmount(entry.amount)}
                          </td>
                          <td className="px-4 py-2.5">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => openEdit(entry)}
                                className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                                title="Edit"
                              >
                                <Pencil size={14} />
                              </button>
                              {deleteId === entry.id ? (
                                <div className="flex items-center gap-1">
                                  <button onClick={() => handleDelete(entry.id)} className="p-1.5 rounded bg-red-100 hover:bg-red-200 text-red-600 transition-colors" title="Confirm Delete">
                                    <Check size={14} />
                                  </button>
                                  <button onClick={() => setDeleteId(null)} className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground" title="Cancel">
                                    <X size={14} />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setDeleteId(entry.id)}
                                  className="p-1.5 rounded hover:bg-red-50 transition-colors text-muted-foreground hover:text-red-500"
                                  title="Delete"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-semibold text-foreground">{editEntry ? 'Edit Entry' : 'Add New Entry'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {/* Type Toggle */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Entry Type *</label>
                <div className="flex gap-2">
                  {(['income', 'expense'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setForm((f) => ({ ...f, entry_type: t, category: '' }))}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        form.entry_type === t
                          ? t === 'income' ?'bg-green-600 text-white border-green-600' :'bg-red-500 text-white border-red-500' :'bg-transparent text-muted-foreground border-border hover:bg-muted'
                      }`}
                    >
                      {t === 'income' ? 'Income' : 'Expense'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Date *</label>
                  <input
                    type="date"
                    value={form.entry_date}
                    onChange={(e) => setForm((f) => ({ ...f, entry_date: e.target.value }))}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Description *</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Enter description"
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.amount}
                    onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                    placeholder="0.00"
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Payment Mode</label>
                  <select
                    value={form.payment_mode}
                    onChange={(e) => setForm((f) => ({ ...f, payment_mode: e.target.value }))}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {PAYMENT_MODES.map((m) => <option key={m} value={m}>{paymentModeLabel[m]}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Reference No.</label>
                  <input
                    type="text"
                    value={form.reference_no}
                    onChange={(e) => setForm((f) => ({ ...f, reference_no: e.target.value }))}
                    placeholder="Optional"
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Remarks</label>
                  <input
                    type="text"
                    value={form.remarks}
                    onChange={(e) => setForm((f) => ({ ...f, remarks: e.target.value }))}
                    placeholder="Optional"
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-xs">{error}</p>}
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {saving ? 'Saving...' : editEntry ? 'Update Entry' : 'Add Entry'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
