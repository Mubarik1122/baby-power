'use client';

import { useEffect, useState } from 'react';
import { Trash2, Eye } from 'lucide-react';
import { getLeads, updateLeadStatus, deleteLead } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { Lead } from '@/lib/types';
import { formatDate, formatStatus } from '@/lib/utils';

const statuses = ['new', 'contacted', 'in_progress', 'closed'];

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState<Lead | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const token = getToken();
    if (!token) return;
    try {
      const params: Record<string, string> = {};
      if (filter) params.type = filter;
      const res = await getLeads(token, params);
      setLeads(res.data);
    } catch {
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [filter]);

  const handleStatusChange = async (id: string, status: string) => {
    const token = getToken();
    if (!token) return;
    await updateLeadStatus(token, id, status);
    fetchData();
    if (selected?._id === id) {
      setSelected((prev) => prev ? { ...prev, status: status as Lead['status'] } : null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this lead?')) return;
    const token = getToken();
    if (!token) return;
    await deleteLead(token, id);
    setSelected(null);
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-secondary font-display">Leads</h1>
        <div className="flex gap-2">
          {['', 'contact', 'quotation'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === f ? 'bg-primary text-secondary' : 'bg-white border border-border text-gray-600 hover:bg-muted'
              }`}
            >
              {f === '' ? 'All' : f === 'contact' ? 'Contact' : 'Quotation'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {loading ? (
            <div className="animate-pulse space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium">ID</th>
                    <th className="text-left px-4 py-3 font-medium">Name</th>
                    <th className="text-left px-4 py-3 font-medium">Type</th>
                    <th className="text-left px-4 py-3 font-medium">Date</th>
                    <th className="text-left px-4 py-3 font-medium">Status</th>
                    <th className="text-right px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead._id} className={`border-t border-border hover:bg-muted/50 cursor-pointer ${selected?._id === lead._id ? 'bg-primary/5' : ''}`} onClick={() => setSelected(lead)}>
                      <td className="px-4 py-3 font-mono text-xs">{lead.leadId}</td>
                      <td className="px-4 py-3 font-medium">{lead.name}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-lg ${lead.type === 'quotation' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                          {lead.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{formatDate(lead.createdAt)}</td>
                      <td className="px-4 py-3">
                        <select
                          value={lead.status}
                          onChange={(e) => { e.stopPropagation(); handleStatusChange(lead._id, e.target.value); }}
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs border rounded-lg px-2 py-1"
                        >
                          {statuses.map((s) => <option key={s} value={s}>{formatStatus(s)}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={(e) => { e.stopPropagation(); setSelected(lead); }} className="p-2 hover:bg-muted rounded-lg">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleDelete(lead._id); }} className="p-2 hover:bg-red-50 text-red-500 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm h-fit sticky top-8">
          <h2 className="text-lg font-semibold text-secondary mb-4">Lead Details</h2>
          {selected ? (
            <div className="space-y-3 text-sm">
              <div><span className="text-gray-500">ID:</span> <span className="font-mono">{selected.leadId}</span></div>
              <div><span className="text-gray-500">Name:</span> {selected.name}</div>
              <div><span className="text-gray-500">Email:</span> {selected.email}</div>
              <div><span className="text-gray-500">Phone:</span> {selected.phone || '-'}</div>
              <div><span className="text-gray-500">Company:</span> {selected.company || '-'}</div>
              {selected.type === 'quotation' && (
                <>
                  <div><span className="text-gray-500">Product:</span> {selected.productName || '-'}</div>
                  <div><span className="text-gray-500">SKU:</span> {selected.productSku || '-'}</div>
                  {selected.selectedSize && (
                    <div><span className="text-gray-500">Size:</span> {selected.selectedSize}</div>
                  )}
                  {selected.selectedColor && (
                    <div><span className="text-gray-500">Colour:</span> {selected.selectedColor}</div>
                  )}
                  <div><span className="text-gray-500">Quantity:</span> {selected.quantity}</div>
                  <div><span className="text-gray-500">Country:</span> {selected.country || '-'}</div>
                  <div><span className="text-gray-500">City:</span> {selected.city || '-'}</div>
                  <div><span className="text-gray-500">Address:</span> {selected.address || '-'}</div>
                  <div><span className="text-gray-500">Notes:</span> {selected.notes || '-'}</div>
                </>
              )}
              {selected.type === 'contact' && (
                <div><span className="text-gray-500">Message:</span> {selected.message}</div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Select a lead to view details</p>
          )}
        </div>
      </div>
    </div>
  );
}
