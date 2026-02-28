'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  stats: {
    users: number;
    agents: number;
    properties: number;
    available: number;
    searches: number;
    searches7d: number;
  };
}

export function AdminCharts({ stats }: Props) {
  const data = [
    { name: 'Utilisateurs', value: stats.users, fill: '#2A5C45' },
    { name: 'Agents',       value: stats.agents, fill: '#2A5C45' },
    { name: 'Propriétés',   value: stats.properties, fill: '#8A5A00' },
    { name: 'Disponibles',  value: stats.available, fill: '#2A5C45' },
    { name: 'Recherches 7j', value: stats.searches7d, fill: '#5A5550' },
  ];

  return (
    <div
      className="rounded-2xl p-6"
      style={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}
    >
      <h2
        className="text-sm font-semibold mb-6"
        style={{ color: '#1A1714' }}
      >
        Vue d&apos;ensemble
      </h2>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barSize={36}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0EFEE" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#8A837C' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#8A837C' }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1A1714',
              border: 'none',
              borderRadius: '8px',
              color: '#FFFFFF',
              fontSize: '12px',
            }}
            cursor={{ fill: '#F7F5F2' }}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
