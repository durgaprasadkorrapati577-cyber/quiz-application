
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { LeaderboardEntry } from '../types';

const Leaderboard: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await api.getLeaderboard();
        setEntries(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <div className="flex justify-center py-20">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Global Leaderboard</h1>
        <p className="text-gray-500 text-lg">Top performers across all categories and contests.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Rank</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">User</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-widest">Score</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="flex items-center">
                      {entry.rank <= 3 ? (
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          entry.rank === 1 ? 'bg-yellow-100 text-yellow-700' : 
                          entry.rank === 2 ? 'bg-gray-200 text-gray-700' : 
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {entry.rank}
                        </div>
                      ) : (
                        <span className="text-sm font-bold text-gray-500 ml-3">{entry.rank}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold mr-3">
                        {entry.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-sm font-bold text-gray-900">{entry.username}</div>
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap text-right text-sm font-black text-indigo-600">
                    {entry.score.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
