import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon } from 'lucide-react';
import { Button } from './ui/button';

interface RepositoryInsightsProps {
  repositoryData: {
    name: string;
    owner: string;
    stats: {
      stars: number;
      forks: number;
      watchers: number;
      issues: number;
    };
    languages: { name: string; percentage: number }[];
    activityData: { date: string; commits: number }[];
  };
}

const COLORS = [
  '#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', 
  '#a4de6c', '#d0ed57', '#ffc658', '#ff8042',
  '#ff6b6b', '#c44dff', '#5e60ce', '#64dfdf'
];

const RepositoryInsights: React.FC<RepositoryInsightsProps> = ({ repositoryData }) => {
  const [activeChart, setActiveChart] = React.useState<'stats' | 'languages' | 'activity'>('stats');

  const statsData = [
    { name: 'Stars', value: repositoryData.stats.stars },
    { name: 'Forks', value: repositoryData.stats.forks },
    { name: 'Watchers', value: repositoryData.stats.watchers },
    { name: 'Issues', value: repositoryData.stats.issues },
  ];

  const languagesData = repositoryData.languages;
  const activityData = repositoryData.activityData;

  return (
    <div className="glass-card p-6 rounded-xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Repository Insights: {repositoryData.owner}/{repositoryData.name}
        </h2>
        <div className="flex space-x-2">
          <Button
            variant={activeChart === 'stats' ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setActiveChart('stats')}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Stats
          </Button>
          <Button
            variant={activeChart === 'languages' ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setActiveChart('languages')}
          >
            <PieChartIcon className="w-4 h-4 mr-2" />
            Languages
          </Button>
          <Button
            variant={activeChart === 'activity' ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setActiveChart('activity')}
          >
            <LineChartIcon className="w-4 h-4 mr-2" />
            Activity
          </Button>
        </div>
      </div>

      <div className="h-80">
        {activeChart === 'stats' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={statsData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(30, 30, 40, 0.9)',
                  borderColor: 'rgba(99, 102, 241, 0.5)',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" name="Count" radius={[4, 4, 0, 0]}>
                {statsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeChart === 'languages' && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={languagesData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="percentage"
                nameKey="name"
              >
                {languagesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(30, 30, 40, 0.9)',
                  borderColor: 'rgba(99, 102, 241, 0.5)',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                formatter={(value: number) => [`${value.toFixed(2)}%`, 'Percentage']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}

        {activeChart === 'activity' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={activityData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="date" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(30, 30, 40, 0.9)',
                  borderColor: 'rgba(99, 102, 241, 0.5)',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="commits"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {statsData.map((stat, index) => (
          <div key={stat.name} className="glass-card p-3 rounded-lg">
            <div className="text-sm text-gray-400">{stat.name}</div>
            <div 
              className="text-xl font-bold" 
              style={{ color: COLORS[index % COLORS.length] }}
            >
              {stat.value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RepositoryInsights;