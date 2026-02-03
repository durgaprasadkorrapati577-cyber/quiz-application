
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { User, UserStats } from '../types';

interface ProfileProps {
  user: User;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getUserStats(user.id);
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center">
            <div className="h-24 w-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-3xl font-black mx-auto mb-6">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-1">{user.username}</h2>
            <p className="text-gray-500 text-sm mb-8">{user.email}</p>
            
            <div className="pt-8 border-t border-gray-50 grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                <span className="px-2 py-1 rounded-md bg-green-50 text-green-700 text-xs font-bold">Active</span>
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Level</p>
                <span className="text-sm font-bold text-indigo-600">Intermediate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats and History */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-sm font-bold text-gray-500 uppercase mb-2">Total Quizzes</p>
              <p className="text-3xl font-black text-indigo-600">{stats?.totalQuizzes}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-sm font-bold text-gray-500 uppercase mb-2">Avg. Score</p>
              <p className="text-3xl font-black text-indigo-600">{stats?.averageScore.toFixed(1)}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-sm font-bold text-gray-500 uppercase mb-2">Highest Score</p>
              <p className="text-3xl font-black text-indigo-600">{stats?.highestScore}</p>
            </div>
          </div>

          {/* History Table */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50">
              <h3 className="text-lg font-extrabold text-gray-900">Recent Quiz Activity</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Quiz Title</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-widest">Score</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {stats?.quizzesTaken.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.quizTitle}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-black text-indigo-600">{item.score}/10</td>
                    </tr>
                  ))}
                  {(!stats || stats.quizzesTaken.length === 0) && (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-gray-500 italic">No quizzes taken yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
