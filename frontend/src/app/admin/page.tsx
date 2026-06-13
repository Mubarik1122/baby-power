'use client';

import { useEffect, useState } from 'react';
import { Package, FolderOpen, Users, MessageSquare, Mail } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getDashboardStats } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { DashboardStats } from '@/lib/types';
import { formatDate, formatStatus } from '@/lib/utils';

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    getDashboardStats(token)
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="animate-pulse space-y-6">
      <div className="h-8 bg-gray-200 rounded w-48" />
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-28 bg-gray-200 rounded-2xl" />
        ))}
      </div>
    </div>;
  }

  const stats = data?.stats;
  const cards = [
    { label: 'Total Products', value: stats?.totalProducts || 0, icon: Package, color: 'bg-primary' },
    { label: 'Categories', value: stats?.totalCategories || 0, icon: FolderOpen, color: 'bg-primary-dark' },
    { label: 'Total Leads', value: stats?.totalLeads || 0, icon: Users, color: 'bg-gold' },
    { label: 'New Quotations', value: stats?.newQuotations || 0, icon: MessageSquare, color: 'bg-blush-dark' },
    { label: 'Contact Requests', value: stats?.contactRequests || 0, icon: Mail, color: 'bg-secondary' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-secondary mb-8 font-display">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-5 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-secondary">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {data?.monthlyLeads && (
        <div className="bg-white rounded-2xl p-6 border border-border shadow-sm mb-8">
          <h2 className="text-lg font-semibold text-secondary mb-4">Monthly Leads</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.monthlyLeads}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="contact" fill="#56C4C4" name="Contact" radius={[4, 4, 0, 0]} />
              <Bar dataKey="quotation" fill="#3A3A3A" name="Quotation" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
          <h2 className="text-lg font-semibold text-secondary mb-4">Recent Leads</h2>
          <div className="space-y-3">
            {(data?.recentLeads || []).map((lead) => (
              <div key={lead._id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="font-medium text-sm text-secondary">{lead.name}</p>
                  <p className="text-xs text-gray-500">{lead.email} · {formatDate(lead.createdAt)}</p>
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-primary/10 text-primary">
                  {formatStatus(lead.status)}
                </span>
              </div>
            ))}
            {(!data?.recentLeads || data.recentLeads.length === 0) && (
              <p className="text-gray-500 text-sm">No leads yet</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
          <h2 className="text-lg font-semibold text-secondary mb-4">Recent Quotations</h2>
          <div className="space-y-3">
            {(data?.recentQuotations || []).map((lead) => (
              <div key={lead._id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="font-medium text-sm text-secondary">{lead.productName || lead.name}</p>
                  <p className="text-xs text-gray-500">Qty: {lead.quantity} · {formatDate(lead.createdAt)}</p>
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-orange-100 text-orange-700">
                  {formatStatus(lead.status)}
                </span>
              </div>
            ))}
            {(!data?.recentQuotations || data.recentQuotations.length === 0) && (
              <p className="text-gray-500 text-sm">No quotations yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
