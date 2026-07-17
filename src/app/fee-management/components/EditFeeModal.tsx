'use client';
import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { FeeRecord } from './feeData';
import { toast } from 'sonner';

interface EditFeeModalProps {
  open: boolean;
  onClose: () => void;
  record: FeeRecord;
  onSave: (updated: FeeRecord) => void;
}

export default function EditFeeModal({ open, onClose, record, onSave }: EditFeeModalProps) {
  const [paidAmount, setPaidAmount] = useState(String(record.paidAmount));
  const [discount, setDiscount] = useState(String(record.discount));
  const [paymentMode, setPaymentMode] = useState(record.paymentMode);
  const [paymentDate, setPaymentDate] = useState(record.paymentDate === '—' ? '' : record.paymentDate);
  const [remarks, setRemarks] = useState(record.remarks);

  const netFee = record.annualFee - Number(discount || 0);
  const paid = Number(paidAmount || 0);
  const balance = netFee - paid;

  const getStatus = (): FeeRecord['status'] => {
    if (paid === 0) return 'Pending';
    if (paid >= netFee) return 'Paid';
    return 'Partial';
  };

  const handleSave = () => {
    if (paid < 0 || Number(discount) < 0) {
      toast.error('Amount values cannot be negative');
      return;
    }
    if (paid > record.annualFee) {
      toast.error('Paid amount cannot exceed annual fee');
      return;
    }
    const updated: FeeRecord = {
      ...record,
      paidAmount: paid,
      discount: Number(discount || 0),
      paymentMode,
      paymentDate: paymentDate || '—',
      remarks,
      status: getStatus(),
    };
    onSave(updated);
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Fee Record" subtitle={`${record.studentName} · ${record.rollNo}`} size="md">
      <div className="space-y-4">
        {/* Fee summary */}
        <div className="bg-secondary/50 rounded-xl p-3 grid grid-cols-3 gap-3 text-center text-xs">
          <div>
            <p className="text-muted-foreground">Annual Fee</p>
            <p className="font-bold text-foreground">₹{record.annualFee.toLocaleString('en-IN')}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Balance</p>
            <p className={`font-bold ${balance > 0 ? 'text-danger' : 'text-success'}`}>
              {balance > 0 ? `₹${balance.toLocaleString('en-IN')}` : '✓ Nil'}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Status</p>
            <p className={`font-bold ${getStatus() === 'Paid' ? 'text-success' : getStatus() === 'Partial' ? 'text-warning' : 'text-danger'}`}>
              {getStatus()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Paid Amount (₹) <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              min={0}
              max={record.annualFee}
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Discount (₹)
            </label>
            <input
              type="number"
              min={0}
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Payment Mode</label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value as FeeRecord['paymentMode'])}
              className="input-field"
            >
              <option value="Cash">Cash</option>
              <option value="Online">Online</option>
              <option value="DD">DD</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Payment Date</label>
            <input
              type="text"
              placeholder="DD/MM/YYYY"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">Remarks</label>
          <input
            type="text"
            placeholder="Optional remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="input-field"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleSave} className="btn-primary">Save Changes</button>
        </div>
      </div>
    </Modal>
  );
}
