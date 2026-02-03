
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Quiz, WeeklyContest } from '../types';

interface DashboardProps {
  onStartQuiz: (quizId: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onStartQuiz }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [contests, setContests] = useState<WeeklyContest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [customQuizId, setCustomQuizId] = useState('');
  const [isReminded, setIsReminded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizData, contestData] = await Promise.all([
          api.getQuizzes(),
          api.getWeeklyContests()
        ]);
        setQuizzes(quizData);
        setContests(contestData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleJoinById = (e: React.FormEvent) => {
    e.preventDefault();
    const id = parseInt(customQuizId);
    if (!isNaN(id) && id > 0) {
      onStartQuiz(id);
    }
  };

  const handleRemind = () => {
    setIsReminded(true);
    setTimeout(() => setIsReminded(false), 2000);
  };

  const categories = ['All', ...new Set(quizzes.map((q) => q.category))];
  
  const filteredQuizzes = selectedCategory === 'All' 
    ? quizzes 
    : quizzes.filter(q => q.category === selectedCategory);

  const getThemedImage = (id: number, title: string) => {
    const images: Record<string, string> = {
      'Java Fundamentals': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600',
      'Spring Boot Advanced': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600',
      'Python Programming': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600',
      'Web Security': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600',
      'Data Structures': 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=600',
    };
    return images[title] || `https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
      {/* 1. Compact Professional Contest Bar */}
      {contests.length > 0 && (
        <div className="rounded-2xl overflow-hidden quiz-gradient text-white p-5 md:p-6 shadow-lg relative border border-white/10">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <div className="px-2 py-0.5 rounded bg-black/30 backdrop-blur-sm text-[8px] font-black uppercase tracking-wider border border-white/10">
                  Event
                </div>
                <div className="flex items-center text-[9px] font-bold text-yellow-300">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-yellow-400 mr-1.5 animate-pulse"></span>
                  LOCKED
                </div>
              </div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight leading-tight">
                {contests[0].title}
              </h1>
              <p className="text-indigo-100 text-xs mt-1 font-medium opacity-70">
                Register for the upcoming global tournament session.
              </p>
              
              <div className="flex items-center gap-2 mt-4">
                <button 
                  disabled 
                  className="bg-white/10 cursor-not-allowed text-white/40 border border-white/10 px-4 py-2 rounded-lg text-[10px] font-black flex items-center"
                >
                  <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  JOIN
                </button>
                <button 
                  onClick={handleRemind}
                  className={`px-3 py-2 rounded-lg text-[9px] font-black transition-all flex items-center border ${isReminded ? 'bg-green-500 border-green-400 text-white' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                >
                  {isReminded ? 'SUCCESS' : 'SET REMINDER'}
                </button>
              </div>
            </div>

            <div className="flex items-center bg-black/20 backdrop-blur-md rounded-xl p-3 border border-white/10 gap-3">
               <div className="p-2 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-lg shadow shadow-amber-500/10">
                  <svg className="w-6 h-6 text-amber-900" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
               </div>
               <div className="text-right">
                  <p className="text-[8px] font-black text-white/50 uppercase tracking-widest mb-0.5">Top Reward</p>
                  <div className="text-lg font-black text-white leading-none">Vanguard Badge</div>
                  <div className="text-[10px] font-bold text-yellow-300 mt-1">{contests[0].prizePool} Credit</div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Minified Access Bar */}
      <div className="bg-white rounded-xl p-1 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center">
         <div className="flex-grow flex items-center px-4 py-2">
            <div className="h-7 w-7 bg-indigo-50 rounded-md flex items-center justify-center mr-3 text-indigo-600 flex-shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-800 tracking-tight leading-none mb-0.5 uppercase">Direct Lobby Access</h3>
            </div>
         </div>
         <form onSubmit={handleJoinById} className="flex gap-1.5 p-1">
            <input 
              type="number"
              placeholder="Enter Quiz ID..."
              value={customQuizId}
              onChange={(e) => setCustomQuizId(e.target.value)}
              className="bg-slate-50 border border-slate-200 focus:border-indigo-400 rounded-lg px-3 py-2 outline-none font-black text-xs text-slate-900 w-full sm:w-32 transition-all"
              required
            />
            <button 
              type="submit"
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-black text-[10px] hover:bg-indigo-700 transition-all shadow-md active:scale-[0.98] uppercase"
            >
              Start Session
            </button>
         </form>
      </div>

      {/* 3. Refined Grid Directory */}
      <div className="space-y-4">
        <div className="flex items-end justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-black text-slate-800 tracking-tight uppercase">Available Tracks</h2>
            <span className="text-[10px] px-2 py-0.5 bg-slate-100 rounded-full text-slate-500 font-bold">{filteredQuizzes.length} ACTIVE</span>
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white border border-slate-200 rounded-md px-2 py-1 text-[9px] font-black text-slate-500 uppercase tracking-wider outline-none focus:border-indigo-500 shadow-sm"
          >
            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredQuizzes.map((quiz) => (
            <div key={quiz.id} className="group bg-white rounded-xl border border-slate-200 shadow-sm transition-all duration-300 overflow-hidden flex flex-col hover:border-indigo-300 hover:shadow-md">
              <div className="h-32 overflow-hidden relative">
                 <img src={getThemedImage(quiz.id, quiz.title)} alt={quiz.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                 <div className="absolute top-3 left-3">
                   <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[7px] font-black uppercase tracking-wider shadow">
                     {quiz.category}
                   </span>
                 </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-xs font-black text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors leading-tight line-clamp-1">{quiz.title}</h3>
                <div className="flex items-center space-x-3 mb-4 text-[8px] font-black text-slate-400 uppercase tracking-wider">
                  <span className="flex items-center">
                    <svg className="h-2.5 w-2.5 mr-1 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {quiz.numQuestions} Qs
                  </span>
                  <span className="flex items-center">
                    <svg className="h-2.5 w-2.5 mr-1 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    15m
                  </span>
                </div>
                
                <button 
                  disabled
                  className="mt-auto w-full py-2 bg-slate-50 text-slate-400 font-black rounded-lg cursor-not-allowed border border-slate-100 flex items-center justify-center text-[9px] uppercase"
                >
                  <svg className="w-3 h-3 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  ID ENTRY ONLY
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
