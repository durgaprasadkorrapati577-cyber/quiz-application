
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import { Question, QuizResponse } from '../types';

interface QuizRoomProps {
  onComplete: (score: number) => void;
  onExit: () => void;
}

const QuizRoom: React.FC<QuizRoomProps> = ({ onComplete, onExit }) => {
  const { quizId: quizIdParam } = useParams<{ quizId: string }>();
  const quizId = parseInt(quizIdParam || '0');
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<QuizResponse[]>([]);
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());
  const [visited, setVisited] = useState<Set<number>>(new Set([0]));
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await api.getQuizQuestions(quizId);
        setQuestions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (quizId) fetchQuestions();
  }, [quizId]);

  useEffect(() => {
    if (loading || questions.length === 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [loading, questions]);

  const handleSelect = (option: string) => {
    const newResponses = [...responses];
    const existing = newResponses.findIndex(r => r.id === questions[currentIndex].id);
    if (existing !== -1) {
      newResponses[existing] = { id: questions[currentIndex].id, response: option };
    } else {
      newResponses.push({ id: questions[currentIndex].id, response: option });
    }
    setResponses(newResponses);
  };

  const clearResponse = () => {
    setResponses(responses.filter(r => r.id !== questions[currentIndex].id));
  };

  const toggleMarkForReview = () => {
    const newMarked = new Set(markedForReview);
    if (newMarked.has(currentIndex)) newMarked.delete(currentIndex);
    else newMarked.add(currentIndex);
    setMarkedForReview(newMarked);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setVisited(new Set(visited).add(nextIdx));
      setCurrentIndex(nextIdx);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const jumpToQuestion = (index: number) => {
    setVisited(new Set(visited).add(index));
    setCurrentIndex(index);
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
        const res = await api.submitQuiz(quizId, responses);
        onComplete(res.score);
    } catch (err) {
        console.error("Submission error", err);
        onComplete(0); 
    } finally {
        setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950">
      <div className="h-12 w-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
      <p className="text-indigo-400 font-black text-[10px] tracking-widest uppercase animate-pulse">Establishing Session...</p>
    </div>
  );

  const currentQuestion = questions[currentIndex];
  const selectedOption = responses.find(r => r.id === currentQuestion.id)?.response;

  // JEE Style Status Helper
  const getStatus = (idx: number) => {
    const isAnswered = responses.some(r => r.id === questions[idx].id);
    const isMarked = markedForReview.has(idx);
    const isVisited = visited.has(idx);

    if (isAnswered && isMarked) return 'answered-marked';
    if (isMarked) return 'marked';
    if (isAnswered) return 'answered';
    if (isVisited) return 'not-answered';
    return 'not-visited';
  };

  const statusColors: Record<string, string> = {
    'answered': 'bg-green-500 border-green-600 text-white',
    'not-answered': 'bg-rose-500 border-rose-600 text-white',
    'marked': 'bg-indigo-500 border-indigo-600 text-white rounded-full',
    'answered-marked': 'bg-indigo-500 border-indigo-600 text-white rounded-full ring-2 ring-green-400 ring-offset-2 ring-offset-slate-900',
    'not-visited': 'bg-slate-800 border-slate-700 text-slate-400',
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col md:flex-row overflow-hidden font-sans">
      {/* BACKGROUND DECOR */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-600/20 blur-[150px]"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-fuchsia-600/10 blur-[150px]"></div>
        <div className="absolute inset-0 opacity-[0.02]" style={{backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
      </div>

      {/* LEFT SIDEBAR: QUESTION PALETTE */}
      <aside className="w-full md:w-72 bg-slate-900/40 backdrop-blur-xl border-r border-white/5 flex flex-col z-20">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
           <div>
              <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Question Palette</h2>
              <div className="text-xs font-bold text-white">Quiz ID: #{quizId}</div>
           </div>
           <div className="h-8 w-8 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400 border border-indigo-500/20">
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
           <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mb-8">
              {questions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => jumpToQuestion(idx)}
                  className={`h-9 w-9 text-[10px] font-black border transition-all flex items-center justify-center rounded-md ${currentIndex === idx ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110 z-10' : ''} ${statusColors[getStatus(idx)]}`}
                >
                  {idx + 1}
                </button>
              ))}
           </div>

           {/* LEGEND */}
           <div className="space-y-3 pt-6 border-t border-white/5">
              <h3 className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">Legend</h3>
              <div className="grid grid-cols-1 gap-2">
                 {[
                   { label: 'Answered', status: 'answered' },
                   { label: 'Not Answered', status: 'not-answered' },
                   { label: 'Not Visited', status: 'not-visited' },
                   { label: 'Marked for Review', status: 'marked' },
                   { label: 'Ans & Marked', status: 'answered-marked' },
                 ].map((item) => (
                   <div key={item.label} className="flex items-center space-x-3">
                      <div className={`h-4 w-4 border rounded-sm ${statusColors[item.status]}`}></div>
                      <span className="text-[10px] font-bold text-slate-400">{item.label}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="p-4 bg-black/20 border-t border-white/5">
           <button 
             onClick={handleSubmit}
             disabled={submitting}
             className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
           >
             Submit Session
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col relative z-10">
        {/* HEADER */}
        <header className="px-6 py-4 border-b border-white/5 bg-slate-900/20 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center space-x-4">
               <button onClick={onExit} className="text-slate-500 hover:text-rose-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
               <div className="h-4 w-[1px] bg-white/5"></div>
               <span className="text-xs font-black text-white tracking-tight">Question {currentIndex + 1} of {questions.length}</span>
            </div>

            <div className={`flex items-center space-x-4 px-4 py-1.5 rounded-full border border-white/5 ${timeLeft < 300 ? 'bg-rose-500/10 text-rose-400 animate-pulse border-rose-500/20' : 'bg-white/5'}`}>
               <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               <span className="text-sm font-black font-mono tracking-tighter">
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
               </span>
            </div>
        </header>

        {/* QUESTION DISPLAY */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar">
          <div className="max-w-3xl mx-auto space-y-10">
             <div className="space-y-4">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Scientific Logic Module</span>
                <h1 className="text-xl md:text-2xl font-black text-white leading-tight">
                  {currentQuestion.question_title || currentQuestion.questionTitle || "Untitled Question"}
                </h1>
             </div>

             <div className="grid grid-cols-1 gap-3">
                {[currentQuestion.option1, currentQuestion.option2, currentQuestion.option3, currentQuestion.option4].map((opt, idx) => {
                  const isSelected = selectedOption === opt;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(opt)}
                      className={`group flex items-center p-4 rounded-xl border-2 text-left transition-all ${
                        isSelected 
                        ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/5' 
                        : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                      }`}
                    >
                      <div className={`h-8 w-8 flex-shrink-0 rounded-lg flex items-center justify-center text-xs font-black mr-4 transition-all ${
                         isSelected ? 'bg-white text-indigo-600' : 'bg-white/5 text-slate-500 group-hover:text-slate-300'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                        {opt}
                      </span>
                      {isSelected && (
                         <div className="ml-auto text-indigo-400">
                           <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                         </div>
                      )}
                    </button>
                  );
                })}
             </div>
          </div>
        </div>

        {/* ACTION FOOTER */}
        <footer className="p-4 md:p-6 border-t border-white/5 bg-slate-900/40 backdrop-blur-md">
           <div className="max-w-4xl mx-auto flex flex-wrap gap-3 items-center justify-between">
              <div className="flex gap-2">
                 <button 
                   onClick={handlePrev}
                   disabled={currentIndex === 0}
                   className="px-5 py-2.5 rounded-lg border border-white/10 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/5 disabled:opacity-20 transition-all flex items-center space-x-2"
                 >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                    <span>Previous</span>
                 </button>
                 <button 
                   onClick={handleNext}
                   disabled={currentIndex === questions.length - 1}
                   className="px-5 py-2.5 rounded-lg border border-white/10 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/5 disabled:opacity-20 transition-all flex items-center space-x-2"
                 >
                    <span>Next</span>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                 </button>
              </div>

              <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                 <button 
                   onClick={clearResponse}
                   className="flex-1 md:flex-none px-5 py-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 font-black text-[10px] uppercase tracking-widest hover:bg-rose-500/20 transition-all"
                 >
                   Clear Response
                 </button>
                 <button 
                   onClick={toggleMarkForReview}
                   className={`flex-1 md:flex-none px-5 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all border ${
                      markedForReview.has(currentIndex) 
                      ? 'bg-amber-500 text-white border-amber-600' 
                      : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20'
                   }`}
                 >
                   {markedForReview.has(currentIndex) ? 'Unmark Review' : 'Mark for Review'}
                 </button>
              </div>
           </div>
        </footer>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
      `}</style>
    </div>
  );
};

export default QuizRoom;
