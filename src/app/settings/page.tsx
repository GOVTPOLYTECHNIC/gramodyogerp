'use client';
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Settings, School, Bell, Shield, Palette, Save } from 'lucide-react';

export default function SettingsPage() {
  const [institutionName, setInstitutionName] = useState('Gramodyog Sewa Sansthan');
  const [address, setAddress] = useState('Uttar Pradesh, India');
  const [email, setEmail] = useState('admin@gramodyog.in');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [emailNotif, setEmailNotif] = useState(true);
  const [feeReminder, setFeeReminder] = useState(true);
  const [attendanceAlert, setAttendanceAlert] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppLayout title="Settings">
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage institution preferences and configurations</p>
        </div>

        {/* Institution Info */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <School size={18} className="text-primary" />
            <h2 className="font-semibold text-foreground">Institution Information</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Institution Name</label>
              <input
                type="text"
                value={institutionName}
                onChange={(e) => setInstitutionName(e?.target?.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e?.target?.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e?.target?.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e?.target?.value)}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Bell size={18} className="text-primary" />
            <h2 className="font-semibold text-foreground">Notifications</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Email Notifications', desc: 'Receive system alerts via email', value: emailNotif, setter: setEmailNotif },
              { label: 'Fee Reminders', desc: 'Auto-send fee due reminders to students', value: feeReminder, setter: setFeeReminder },
              { label: 'Attendance Alerts', desc: 'Alert when staff attendance falls below 75%', value: attendanceAlert, setter: setAttendanceAlert },
            ]?.map((item) => (
              <div key={item?.label} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-foreground">{item?.label}</p>
                  <p className="text-xs text-muted-foreground">{item?.desc}</p>
                </div>
                <button
                  onClick={() => item?.setter(!item?.value)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${item?.value ? 'bg-primary' : 'bg-border'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${item?.value ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Shield size={18} className="text-primary" />
            <h2 className="font-semibold text-foreground">Security</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
              <p className="text-xs text-muted-foreground">Add an extra layer of security to admin login</p>
            </div>
            <button className="btn-outline text-xs px-3 py-1.5">Enable 2FA</button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Session Timeout</p>
              <p className="text-xs text-muted-foreground">Auto logout after 30 minutes of inactivity</p>
            </div>
            <select className="input-field w-auto text-xs py-1.5">
              <option>30 minutes</option>
              <option>1 hour</option>
              <option>2 hours</option>
            </select>
          </div>
        </div>

        {/* Appearance */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Palette size={18} className="text-primary" />
            <h2 className="font-semibold text-foreground">Appearance</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Theme</p>
              <p className="text-xs text-muted-foreground">Choose your preferred color theme</p>
            </div>
            <select className="input-field w-auto text-xs py-1.5">
              <option>Light</option>
              <option>Dark</option>
              <option>System</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="btn-primary flex items-center gap-2 px-6"
          >
            <Save size={15} />
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
