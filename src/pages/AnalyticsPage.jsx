import { useState, useEffect } from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import StatsCard from '../components/analytics/StatsCard';
import {
  getDashboard,
  getMessagesOverTime,
  getTemplateUsage,
} from '../services/analyticsService';
import { getCampaignHistory } from '../services/campaignService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [messagesData, setMessagesData] = useState(null);
  const [templateUsage, setTemplateUsage] = useState(null);
  const [recentCampaigns, setRecentCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [dashRes, messagesRes, usageRes, historyRes] = await Promise.all([
          getDashboard(),
          getMessagesOverTime(14),
          getTemplateUsage(),
          getCampaignHistory({ limit: 5 }),
        ]);

        const dashboard = dashRes?.data || dashRes;
        setStats(dashboard);

        const messages = messagesRes?.data || messagesRes || [];
        const labels = messages.map((m) => m._id || m.date);
        const counts = messages.map((m) => m.count || m.total);
        setMessagesData({ labels, counts });

        const usage = usageRes?.data || usageRes || [];
        setTemplateUsage(usage);

        const history = historyRes?.campaigns || historyRes?.data?.campaigns || [];
        setRecentCampaigns(history);
      } catch (err) {
        console.error('Failed to load analytics', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <i className="fas fa-spinner fa-pulse text-3xl text-gray-400"></i>
      </div>
    );
  }

  // Chart data
  const lineData = {
    labels: messagesData?.labels || [],
    datasets: [
      {
        label: 'Messages Sent',
        data: messagesData?.counts || [],
        borderColor: '#ea580c', // Tailwind orange-600
        backgroundColor: 'rgba(234, 88, 12, 0.1)', // Light orange fill
        fill: true,
        tension: 0.3,
        pointRadius: 0,
      },
    ],
  };

  // For bar chart, use recent campaigns
  const barLabels = recentCampaigns.map((c) => c.name?.substring(0, 15) || '');
  const barSent = recentCampaigns.map((c) =>
    Array.isArray(c.recipients) ? c.recipients.length : c.recipients || 0
  );
  const barDelivered = recentCampaigns.map((c) => c.delivered || 0);

  const barData = {
    labels: barLabels,
    datasets: [
      {
        label: 'Sent',
        data: barSent,
        backgroundColor: '#fdba74', // Tailwind orange-300
        borderRadius: 4,
      },
      {
        label: 'Delivered',
        data: barDelivered,
        backgroundColor: '#10b981', // Emerald for success
        borderRadius: 4,
      },
    ],
  };

  const doughnutLabels = templateUsage?.map((t) => t._id || 'Unknown') || [];
  const doughnutValues = templateUsage?.map((t) => t.count) || [];
  const doughnutData = {
    labels: doughnutLabels,
    datasets: [
      {
        data: doughnutValues,
        // Updated first color to orange-600 instead of blue
        backgroundColor: ['#ea580c', '#f59e0b', '#ec4899', '#8b5cf6', '#10b981'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="flex-1 overflow-y-auto p-5">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
          <i className="fas fa-chart-line text-orange-500"></i> Analytics Overview
        </h1>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            icon="paper-plane"
            color="orange" // Changed from blue
            label="Total Campaigns"
            value={stats?.totalCampaigns ?? 0}
            subtitle={`${stats?.delivered ?? 0} delivered`}
          />
          <StatsCard
            icon="check-circle"
            color="emerald"
            label="Delivered"
            value={stats?.totalDelivered?.toLocaleString() ?? 0}
            subtitle={`${stats?.totalDelivered ? ((stats.totalDelivered / Math.max(1, stats.totalSent)) * 100).toFixed(1) + '%' : '0%'} delivery rate`}
          />
          <StatsCard
            icon="exclamation-circle"
            color="red"
            label="Failed"
            value={stats?.totalFailed ?? 0}
            subtitle={`${stats?.totalFailed ? ((stats.totalFailed / Math.max(1, stats.totalSent)) * 100).toFixed(1) + '%' : '0%'} of total`}
          />
          <StatsCard
            icon="clock"
            color="amber"
            label="Avg. Send Time"
            value={stats?.avgSendTime ? `${stats.avgSendTime}s` : 'N/A'}
            subtitle="per message"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h2 className="font-bold text-gray-700 mb-3">Messages Sent (Last 14 Days)</h2>
            <div className="h-64">
              {messagesData && (
                <Line
                  data={lineData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                  }}
                />
              )}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h2 className="font-bold text-gray-700 mb-3">Campaign Performance (Recent)</h2>
            <div className="h-64">
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom' } },
                }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h2 className="font-bold text-gray-700 mb-3">Template Usage</h2>
            <div className="h-56">
              <Doughnut
                data={doughnutData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'right' } },
                }}
              />
            </div>
          </div>
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h2 className="font-bold text-gray-700 mb-3">Recent Campaigns</h2>
            {recentCampaigns.length === 0 ? (
              <p className="text-gray-400 text-xs text-center py-4">No campaigns yet</p>
            ) : (
              <table className="min-w-full text-xs text-left">
                <thead className="bg-gray-50 text-gray-500 font-semibold">
                  <tr>
                    <th className="px-4 py-2">Campaign</th>
                    <th className="px-4 py-2">Sent</th>
                    <th className="px-4 py-2">Delivered</th>
                    <th className="px-4 py-2">Rate</th>
                    <th className="px-4 py-2">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentCampaigns.map((c) => {
                    const sent = Array.isArray(c.recipients)
                      ? c.recipients.length
                      : c.recipients || 0;
                    const delivered = c.delivered || 0;
                    const rate =
                      sent > 0 ? ((delivered / sent) * 100).toFixed(1) + '%' : '0%';
                    const date = c.createdAt
                      ? new Date(c.createdAt).toLocaleDateString()
                      : '';
                    return (
                      <tr key={c._id}>
                        <td className="px-4 py-2.5 font-medium">{c.name}</td>
                        <td className="px-4 py-2.5">{sent}</td>
                        <td className="px-4 py-2.5 text-emerald-600">{delivered}</td>
                        <td className="px-4 py-2.5">{rate}</td>
                        <td className="px-4 py-2.5 text-gray-500">{date}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}