'use client';

import { useEffect, useState } from 'react';
import { Mail, MessageCircle, Save } from 'lucide-react';
import { getAdminSettings, updateSettings } from '@/lib/api';
import { getToken } from '@/lib/auth';
import Button from '@/components/ui/Button';

const defaultForm = {
  whatsappNumber: '',
  whatsappMessage: '',
  smtpHost: '',
  smtpPort: '587',
  smtpUser: '',
  smtpPass: '',
  smtpFrom: '',
  smtpNotifyEmail: '',
};

export default function AdminSettingsPage() {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    getAdminSettings(token)
      .then((res) => {
        setForm({
          whatsappNumber: res.data.whatsappNumber || '',
          whatsappMessage: res.data.whatsappMessage || '',
          smtpHost: res.data.smtpHost || '',
          smtpPort: String(res.data.smtpPort || 587),
          smtpUser: res.data.smtpUser || '',
          smtpPass: res.data.smtpPass || '',
          smtpFrom: res.data.smtpFrom || '',
          smtpNotifyEmail: res.data.smtpNotifyEmail || '',
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    const token = getToken();
    if (!token) return;

    setSaving(true);
    setMessage('');
    try {
      await updateSettings(token, form);
      setMessage('Settings saved successfully.');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-secondary font-display mb-8">Site Settings</h1>

      {loading ? (
        <div className="animate-pulse h-48 bg-gray-200 rounded-2xl" />
      ) : (
        <div className="space-y-6 max-w-xl">
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <div className="p-2 rounded-xl bg-[#25D366]/10">
                <MessageCircle className="w-5 h-5 text-[#25D366]" />
              </div>
              <div>
                <h2 className="font-semibold text-secondary">WhatsApp Button</h2>
              <p className="text-sm text-gray-500">
                Shown in the bottom-right corner on the public website. Leave blank to hide.
              </p>
              <p className="text-xs text-amber-700 mt-1">
                Saved to the database — persists across restarts when using MongoDB (not in-memory dev mode).
              </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">WhatsApp Number</label>
              <input
                type="text"
                value={form.whatsappNumber}
                onChange={(e) => updateField('whatsappNumber', e.target.value)}
                placeholder="+44 7123 456789"
                className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">Default Message</label>
              <textarea
                value={form.whatsappMessage}
                onChange={(e) => updateField('whatsappMessage', e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <div className="p-2 rounded-xl bg-primary/10">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-secondary">Email Notifications</h2>
                <p className="text-sm text-gray-500">
                  Optional. Contact and quotation forms always save to Leads. Email is sent only when SMTP is configured below. All values are stored in the database.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-secondary mb-1.5">Notify Email</label>
                <input
                  type="email"
                  value={form.smtpNotifyEmail}
                  onChange={(e) => updateField('smtpNotifyEmail', e.target.value)}
                  placeholder="you@yourcompany.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">SMTP Host</label>
                <input
                  type="text"
                  value={form.smtpHost}
                  onChange={(e) => updateField('smtpHost', e.target.value)}
                  placeholder="smtp.gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">SMTP Port</label>
                <input
                  type="number"
                  value={form.smtpPort}
                  onChange={(e) => updateField('smtpPort', e.target.value)}
                  placeholder="587"
                  className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">SMTP Username</label>
                <input
                  type="text"
                  value={form.smtpUser}
                  onChange={(e) => updateField('smtpUser', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">SMTP Password</label>
                <input
                  type="password"
                  value={form.smtpPass}
                  onChange={(e) => updateField('smtpPass', e.target.value)}
                  placeholder="Leave unchanged if already set"
                  className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-secondary mb-1.5">From Email</label>
                <input
                  type="email"
                  value={form.smtpFrom}
                  onChange={(e) => updateField('smtpFrom', e.target.value)}
                  placeholder="noreply@yourcompany.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
          </div>

          {message && (
            <p className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}

          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      )}
    </div>
  );
}
