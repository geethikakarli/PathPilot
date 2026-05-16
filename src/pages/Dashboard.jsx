import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, BookOpen, GraduationCap, LayoutDashboard, MessageSquare, TrendingUp, CheckCircle2, Search, ArrowRight, ExternalLink, Compass, Map, Info, Star } from 'lucide-react';

export default function Dashboard() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Student';

  // Shared state for all tabs
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  
  // Handlers for Overview modals (backward compatibility for overview buttons)
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);
  const [showOtherMatchesModal, setShowOtherMatchesModal] = useState(false);
  const [selectedScholarshipModal, setSelectedScholarshipModal] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await fetch('/api/ai/insights', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setInsights(data);
          setChatMessages([{ sender: 'ai', text: data.aiMessage }]);
        } else {
          if(res.status === 400 || res.status === 401) navigate('/profile-setup');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, [navigate]);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMessage = chatInput;
    const newMessages = [...chatMessages, { sender: 'user', text: userMessage }];
    setChatMessages(newMessages);
    setChatInput('');
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: userMessage })
      });
      
      if (res.ok) {
        const data = await res.json();
        setChatMessages([...newMessages, { sender: 'ai', text: data.reply }]);
      } else {
        setChatMessages([...newMessages, { sender: 'ai', text: "Sorry, I couldn't reach the server. Please try again later." }]);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setChatMessages([...newMessages, { sender: 'ai', text: "Sorry, I'm offline right now." }]);
    }
  };

  const updateDesiredCareer = async (newCareer) => {
    try {
      const token = localStorage.getItem('token');
      // Update local state immediately for responsiveness
      setInsights(prev => ({ ...prev, desiredCareer: newCareer, careerMatch: newCareer }));
      
      // Success feedback
      alert(`Success! Your career path has been updated to ${newCareer}.`);
      
      // Update backend
      await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          ...insights, 
          desiredCareer: newCareer 
        })
      });
    } catch (err) {
      console.error("Failed to update career:", err);
    }
  };

  const handleEnroll = () => {
    alert("Congratulations! You've enrolled in the foundation course. Check your email for access details.");
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <BrainCircuit className="w-12 h-12 text-brand-500 mb-4 animate-bounce" />
          <p className="text-slate-600 font-medium">Analyzing your profile...</p>
        </div>
      </div>
    );
  }

  if (!insights) return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex">
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col h-[calc(100vh-4rem)] sticky top-16">
        <div className="p-6 overflow-y-auto flex-1">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Menu</h2>
          <nav className="mt-4 space-y-1">
            <NavItem icon={<LayoutDashboard />} label="Overview" active={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} />
            <NavItem icon={<Compass />} label="Career Path" active={activeTab === 'Career Path'} onClick={() => setActiveTab('Career Path')} />
            <NavItem icon={<BrainCircuit />} label="AI Recommendations" active={activeTab === 'AI Recommendations'} onClick={() => setActiveTab('AI Recommendations')} />
            <NavItem icon={<TrendingUp />} label="Skill Gap Analysis" active={activeTab === 'Skill Gap Analysis'} onClick={() => setActiveTab('Skill Gap Analysis')} />
            <NavItem icon={<BookOpen />} label="Learning Roadmap" active={activeTab === 'Learning Roadmap'} onClick={() => setActiveTab('Learning Roadmap')} />
            <NavItem icon={<GraduationCap />} label="Scholarships" active={activeTab === 'Scholarships'} onClick={() => setActiveTab('Scholarships')} />
            <NavItem icon={<MessageSquare />} label="AI Mentor" active={activeTab === 'AI Mentor'} onClick={() => setActiveTab('AI Mentor')} />
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto h-[calc(100vh-4rem)]">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">{activeTab === 'Overview' ? `Welcome back, ${userName}!` : activeTab}</h1>
          <p className="text-slate-600 mt-2">
            {activeTab === 'Overview' && 'Here are your personalized career insights based on your profile.'}
            {activeTab === 'Career Path' && 'Step-by-step roadmap for your specific dream career.'}
            {activeTab === 'AI Recommendations' && 'Deep dive into your top career matches and market trends.'}
            {activeTab === 'Skill Gap Analysis' && 'Identify missing skills and discover resources to acquire them.'}
            {activeTab === 'Learning Roadmap' && 'Your step-by-step timeline to achieving your career goals.'}
            {activeTab === 'Scholarships' && 'Financial aid opportunities tailored to your background.'}
            {activeTab === 'AI Mentor' && 'Chat directly with your personalized AI career counselor.'}
          </p>
        </header>

        {activeTab === 'Overview' && (
          <OverviewView 
            insights={insights} 
            setShowRoadmapModal={setShowRoadmapModal} 
            setShowOtherMatchesModal={setShowOtherMatchesModal}
            setSelectedScholarshipModal={setSelectedScholarshipModal}
            chatMessages={chatMessages}
            chatInput={chatInput}
            setChatInput={setChatInput}
            handleChatSubmit={handleChatSubmit}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === 'Career Path' && <CareerPathView profile={insights} handleEnroll={handleEnroll} />}
        {activeTab === 'AI Recommendations' && <AIRecommendationsView insights={insights} onSelect={updateDesiredCareer} setActiveTab={setActiveTab} />}
        {activeTab === 'Skill Gap Analysis' && <SkillGapView insights={insights} />}
        {activeTab === 'Learning Roadmap' && <LearningRoadmapView insights={insights} />}
        {activeTab === 'Scholarships' && <ScholarshipsView insights={insights} />}
        {activeTab === 'AI Mentor' && (
          <AIMentorView 
            chatMessages={chatMessages} 
            chatInput={chatInput} 
            setChatInput={setChatInput} 
            handleChatSubmit={handleChatSubmit} 
          />
        )}

        {/* Overview Modals (Kept for backward compatibility with Overview buttons) */}
        {showRoadmapModal && <RoadmapModal insights={insights} onClose={() => setShowRoadmapModal(false)} />}
        {showOtherMatchesModal && <OtherMatchesModal insights={insights} setInsights={setInsights} onClose={() => setShowOtherMatchesModal(false)} />}
        {selectedScholarshipModal && <ScholarshipModal scholarship={selectedScholarshipModal} onClose={() => setSelectedScholarshipModal(null)} />}
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function NavItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full text-left flex items-center px-4 py-3 rounded-xl transition-colors ${active ? 'bg-brand-50 text-brand-600 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
      <span className={`mr-3 ${active ? 'text-brand-600' : 'text-slate-400'}`}>{icon}</span>
      {label}
    </button>
  );
}

function CareerPathView({ profile, handleEnroll }) {
  const [career, setCareer] = useState(profile?.desiredCareer || 'IAS Officer');
  const [pathData, setPathData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPath = async (selectedCareer) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/ai/career-path', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ career: selectedCareer })
      });
      if (res.ok) {
        const data = await res.json();
        setPathData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile?.desiredCareer) {
      setCareer(profile.desiredCareer);
      fetchPath(profile.desiredCareer);
    } else {
      fetchPath(career);
    }
  }, [profile?.desiredCareer]);

  const popularCareers = ["IAS Officer", "Chartered Accountant (CA)", "Doctor (MBBS)", "Software Engineer", "Data Scientist", "Lawyer", "Pilot", "MBA Graduate"];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Search & Selector */}
      <div className="glass-panel p-6">
        <div className="flex flex-col md:flex-row md:items-end gap-6">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Explore another path</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search for any career (e.g., Space Scientist, UI/UX Designer)..." 
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                value={career}
                onChange={(e) => setCareer(e.target.value)}
              />
            </div>
          </div>
          <button 
            onClick={() => fetchPath(career)}
            disabled={loading}
            className="bg-brand-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-700 shadow-md transition-all disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Show My Path'}
          </button>
        </div>
        
        <div className="mt-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Popular Careers</p>
          <div className="flex flex-wrap gap-2">
            {popularCareers.map(c => (
              <button 
                key={c} 
                onClick={() => { setCareer(c); fetchPath(c); }}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${career === c ? 'bg-brand-100 text-brand-700 border-brand-200 font-bold' : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Map className="w-12 h-12 text-brand-400 animate-pulse mb-4" />
          <p className="text-slate-500 font-medium">Mapping your future steps...</p>
        </div>
      ) : !pathData ? (
        <div className="flex flex-col items-center justify-center py-20 glass-panel">
          <Compass className="w-12 h-12 text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">No roadmap found for "{career}". Try searching for another career or check your internet connection.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Header Card */}
          <div className="glass-panel p-8 bg-gradient-to-br from-brand-600 to-brand-800 text-white border-none shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Compass className="w-48 h-48 rotate-12" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider">Dream Career Path</span>
                {profile?.desiredCareer === pathData.career && (
                  <span className="flex items-center gap-1 text-yellow-300 text-xs font-bold"><Star className="w-3 h-3 fill-current" /> Matches Your Profile</span>
                )}
              </div>
              <h2 className="text-4xl font-black mb-4">How to become an {pathData.career}</h2>
              <p className="text-brand-100 text-lg max-w-2xl leading-relaxed">{pathData.overview}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-white/20">
                <div>
                  <p className="text-xs font-bold text-brand-200 uppercase tracking-wider mb-1">Eligibility</p>
                  <p className="font-bold">{pathData.eligibility}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-brand-200 uppercase tracking-wider mb-1">Estimated Duration</p>
                  <p className="font-bold">{pathData.duration}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-brand-200 uppercase tracking-wider mb-1">Average Salary Range</p>
                  <p className="font-bold">{pathData.salary}</p>
                </div>
              </div>
            </div>
          </div>

          {pathData.personalizedNote && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl flex gap-4 items-start shadow-sm">
              <Info className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-amber-900 mb-1">Personalized Advice for You</h3>
                <p className="text-amber-800 leading-relaxed">{pathData.personalizedNote}</p>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="relative pl-8 md:pl-0">
            {/* Desktop Center Line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-slate-200 -translate-x-1/2"></div>
            {/* Mobile Left Line */}
            <div className="md:hidden absolute left-0 top-0 bottom-0 w-1 bg-slate-200"></div>

            <div className="space-y-12 relative">
              {pathData.steps.map((step, idx) => (
                <div key={idx} className={`relative flex items-center ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Timeline Dot */}
                  <div className="absolute left-[-2rem] md:left-1/2 w-8 h-8 rounded-full bg-brand-500 border-4 border-white shadow-md z-20 -translate-x-1/2 flex items-center justify-center text-white text-xs font-bold">
                    {idx + 1}
                  </div>
                  
                  {/* Content Card */}
                  <div className={`w-full md:w-[45%] glass-panel p-6 hover:border-brand-400 transition-all group ${idx % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-brand-600 transition-colors">{step.title}</h3>
                      <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded-lg">{step.duration}</span>
                    </div>
                    <p className="text-slate-600 mb-4 leading-relaxed">{step.desc}</p>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 group-hover:bg-brand-50/50 transition-colors">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Star className="w-3 h-3 text-brand-500" /> Pro Tip</p>
                      <p className="text-sm text-slate-700 italic">"{step.tips}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-8 text-center bg-slate-900 text-white border-none shadow-xl">
            <h3 className="text-2xl font-bold mb-3">Ready to start this journey?</h3>
            <p className="text-slate-400 max-w-xl mx-auto">PathPilot can help you find the best resources, books, and mentors for every step of this roadmap.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function OverviewView({ insights, setShowRoadmapModal, setShowOtherMatchesModal, setSelectedScholarshipModal, chatMessages, chatInput, setChatInput, handleChatSubmit, setActiveTab }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Top Recommendation */}
      <div className="lg:col-span-2 glass-panel p-8 bg-gradient-to-br from-brand-50 to-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Top Career Match</h2>
            <h3 className="text-4xl font-extrabold gradient-text mt-2">{insights.careerMatch}</h3>
            <p className="text-slate-600 mt-4 max-w-xl">Based on your strong analytical skills and interests, this role offers a {insights.matchScore}% compatibility score.</p>
          </div>
          <div className="w-20 h-20 rounded-full border-4 border-brand-500 flex items-center justify-center bg-white shadow-lg">
            <span className="text-2xl font-bold text-brand-600">{insights.matchScore}%</span>
          </div>
        </div>
        
        <div className="mt-8 flex space-x-4">
          <button onClick={() => setActiveTab('Career Path')} className="bg-brand-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-brand-700 shadow-md transition-all">View Visual Roadmap</button>
          <button onClick={() => setActiveTab('AI Recommendations')} className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-medium hover:bg-slate-50 transition-all">Explore Other Matches</button>
        </div>
      </div>

      {/* AI Mentor Quick Chat */}
      <div className="glass-panel p-6 flex flex-col h-96">
        <div className="flex items-center space-x-3 mb-6 cursor-pointer hover:opacity-80" onClick={() => setActiveTab('AI Mentor')}>
          <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-accent-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">AI Mentor <span className="text-xs text-brand-500 ml-2 font-normal hover:underline">Open Fullscreen</span></h2>
        </div>
        <div className="flex-1 bg-slate-50 rounded-xl p-4 mb-4 overflow-y-auto space-y-3">
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={`p-3 rounded-lg text-sm ${msg.sender === 'ai' ? 'bg-white border border-slate-200 text-slate-700' : 'bg-brand-600 text-white ml-8'}`}>{msg.text}</div>
          ))}
        </div>
        <form onSubmit={handleChatSubmit} className="flex gap-2">
          <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask your mentor..." className="flex-1 px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-brand-500"/>
          <button type="submit" className="bg-brand-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-brand-700">Send</button>
        </form>
      </div>

      {/* Missing Skills & Scholarships */}
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
        <div className="glass-panel p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center"><TrendingUp className="mr-2 w-5 h-5 text-brand-500"/> Skill Improvements</h2>
            <button onClick={() => setActiveTab('Skill Gap Analysis')} className="text-sm text-brand-600 font-medium hover:underline">View All Details</button>
          </div>
          <ul className="space-y-4">
            {insights.missingSkills.map((skill, idx) => (
              <li key={idx} className="flex flex-col pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-700 font-bold">{skill.name}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${skill.status === 'Missing' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{skill.status}</span>
                </div>
                <p className="text-sm text-slate-500"><span className="font-semibold text-brand-600">How to improve:</span> {skill.suggestion}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-panel p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center"><GraduationCap className="mr-2 w-5 h-5 text-brand-500"/> Scholarship Matches</h2>
            <button onClick={() => setActiveTab('Scholarships')} className="text-sm text-brand-600 font-medium hover:underline">Browse Database</button>
          </div>
          <div className="space-y-4">
            {insights.scholarships.map((schol, idx) => (
              <div key={idx} onClick={() => setSelectedScholarshipModal(schol)} className="p-4 border border-slate-100 rounded-xl hover:shadow-md transition-shadow cursor-pointer hover:border-brand-200">
                <h3 className="font-bold text-brand-600">{schol.name}</h3>
                <p className="text-sm text-slate-500 mt-1">Amount: {schol.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AIRecommendationsView({ insights, onSelect, setActiveTab }) {
  const matches = [
    { name: 'Machine Learning Engineer', score: 89, desc: 'Requires stronger math and algorithm skills.', salary: '₹12,00,000 - ₹25,00,000', growth: '+22%' },
    { name: 'Data Analyst', score: 85, desc: 'Focuses heavily on SQL, Excel, and visualization.', salary: '₹6,00,000 - ₹15,00,000', growth: '+15%' },
    { name: 'Product Manager', score: 72, desc: 'Requires excellent leadership and communication skills.', salary: '₹15,00,000 - ₹35,00,000', growth: '+18%' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-panel p-8 bg-gradient-to-br from-brand-50 to-white">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Current Selection: {insights.careerMatch}</h2>
        <p className="text-slate-600 mb-6">This is your top recommended path based on your {insights.matchScore}% match score.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <p className="text-sm text-slate-500 font-medium">Expected Salary</p>
            <p className="text-xl font-bold text-slate-900 mt-1">₹8,00,000 - ₹20,00,000</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <p className="text-sm text-slate-500 font-medium">Market Growth</p>
            <p className="text-xl font-bold text-green-600 mt-1">+24% (High Demand)</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <p className="text-sm text-slate-500 font-medium">Action</p>
            <button onClick={() => setActiveTab('Learning Roadmap')} className="mt-1 text-brand-600 font-bold hover:underline flex items-center">View Roadmap <ArrowRight className="w-4 h-4 ml-1" /></button>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-900 mt-8 mb-4">Explore Alternative Paths</h3>
      <div className="grid grid-cols-1 gap-4">
        {matches.map((match, idx) => (
          <div key={idx} className="glass-panel p-6 flex flex-col md:flex-row md:items-center justify-between hover:border-brand-300 cursor-pointer transition-all hover:shadow-md">
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h3 className="text-xl font-bold text-slate-900">{match.name}</h3>
                <span className="px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-xs font-bold">{match.score}% Match</span>
              </div>
              <p className="text-slate-600 mt-2">{match.desc}</p>
              <div className="flex space-x-6 mt-4">
                <p className="text-sm text-slate-500"><span className="font-medium text-slate-700">Salary:</span> {match.salary}</p>
                <p className="text-sm text-slate-500"><span className="font-medium text-slate-700">Growth:</span> <span className="text-green-600">{match.growth}</span></p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 md:ml-6">
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onSelect(match.name); 
                  setActiveTab('Career Path');
                }}
                className="bg-white border border-brand-200 text-brand-600 px-4 py-2 rounded-xl font-medium hover:bg-brand-50 w-full md:w-auto"
              >
                Select Path
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillGapView({ insights }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insights.missingSkills.map((skill, idx) => (
          <div key={idx} className="glass-panel p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{skill.name}</h3>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${skill.status === 'Missing' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{skill.status} Level</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                {skill.status === 'Missing' ? '0%' : '30%'}
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 mb-6">
              <div className={`h-2 rounded-full ${skill.status === 'Missing' ? 'bg-red-500 w-[5%]' : 'bg-amber-500 w-[30%]'}`}></div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-600 mb-4"><span className="font-bold text-slate-900">AI Suggestion:</span> {skill.suggestion}</p>
              <div className="bg-brand-50 p-4 rounded-xl border border-brand-100">
                <p className="text-sm font-bold text-brand-800 mb-2 flex items-center"><BookOpen className="w-4 h-4 mr-2"/> Recommended Course</p>
                <a 
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(skill.name + ' full course tutorial')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-brand-600 text-sm hover:underline flex items-center justify-between"
                >
                  {skill.name} Masterclass 2026 <ExternalLink className="w-3 h-3"/>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LearningRoadmapView({ insights }) {
  const [completed, setCompleted] = useState([true, false, false, false]);

  const toggleComplete = (idx) => {
    const newCompleted = [...completed];
    newCompleted[idx] = !newCompleted[idx];
    setCompleted(newCompleted);
  };

  const steps = [
    { title: "Month 1: Foundation", desc: "Focus on core principles. Master the basics of your missing skills through online bootcamps and structured courses." },
    { title: "Month 2-3: Practical Application", desc: "Start building small portfolio projects. Apply what you've learned to solve real-world problems." },
    { title: "Month 4-5: Advanced Concepts", desc: "Dive into complex frameworks. Begin networking on LinkedIn and attend virtual industry events." },
    { title: "Month 6: Job Hunting", desc: "Polish your resume, prepare for technical interviews, and start applying for entry-level positions." }
  ];

  return (
    <div className="glass-panel p-8 animate-fade-in max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-slate-900 mb-2">Path to <span className="text-brand-600">{insights.careerMatch}</span></h2>
      <p className="text-slate-600 mb-10 text-lg">Track your progress through this 6-month personalized timeline.</p>
      
      <div className="space-y-8 relative">
        <div className="absolute left-6 top-10 bottom-10 w-1 bg-slate-200 rounded-full z-0"></div>
        {steps.map((step, idx) => (
          <div key={idx} className="flex relative z-10 group">
            <div className="flex flex-col items-center mr-6 cursor-pointer" onClick={() => toggleComplete(idx)}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-colors ${completed[idx] ? 'bg-green-500 text-white' : 'bg-white border-4 border-slate-200 text-slate-400 group-hover:border-brand-300'}`}>
                {completed[idx] ? <CheckCircle2 className="w-6 h-6" /> : <span className="font-bold">{idx + 1}</span>}
              </div>
            </div>
            <div className={`flex-1 glass-panel p-6 transition-all ${completed[idx] ? 'opacity-70 border-green-200 bg-green-50/30' : 'hover:border-brand-300'}`}>
              <div className="flex justify-between items-start">
                <h3 className={`text-xl font-bold ${completed[idx] ? 'text-slate-500 line-through' : 'text-slate-900'}`}>{step.title}</h3>
                <button onClick={() => toggleComplete(idx)} className={`px-3 py-1 text-xs font-bold rounded-full border transition-colors ${completed[idx] ? 'bg-green-100 text-green-700 border-green-200' : 'bg-white text-slate-500 border-slate-300 hover:bg-slate-50'}`}>
                  {completed[idx] ? 'Completed' : 'Mark Complete'}
                </button>
              </div>
              <p className={`mt-2 ${completed[idx] ? 'text-slate-400' : 'text-slate-600'}`}>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScholarshipsView({ insights }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('default');

  let filteredScholarships = [...insights.scholarships].filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (sortOrder === 'amount-high') {
    filteredScholarships.sort((a, b) => {
      const numA = parseInt(a.amount.replace(/\D/g, '')) || 0;
      const numB = parseInt(b.amount.replace(/\D/g, '')) || 0;
      return numB - numA;
    });
  } else if (sortOrder === 'amount-low') {
    filteredScholarships.sort((a, b) => {
      const numA = parseInt(a.amount.replace(/\D/g, '')) || 0;
      const numB = parseInt(b.amount.replace(/\D/g, '')) || 0;
      return numA - numB;
    });
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
          <input type="text" placeholder="Search scholarships by name or keyword..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"/>
        </div>
        <select 
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="bg-white border border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-medium hover:bg-slate-50 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 cursor-pointer appearance-none"
        >
          <option value="default">Sort by: Recommended</option>
          <option value="amount-high">Amount: High to Low</option>
          <option value="amount-low">Amount: Low to High</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredScholarships.map((schol, idx) => (
          <div key={idx} className="glass-panel p-6 flex flex-col hover:-translate-y-1 transition-transform">
            <h3 className="text-xl font-bold text-brand-600 mb-2">{schol.name}</h3>
            <p className="text-3xl font-extrabold text-slate-900 mb-4">{schol.amount}</p>
            <p className="text-sm text-slate-600 mb-6 flex-1">{schol.description}</p>
            <div className="bg-amber-50 rounded-lg p-3 mb-6 border border-amber-100 flex justify-between items-center">
              <span className="text-sm font-bold text-amber-800">Deadline:</span>
              <span className="text-sm font-bold text-amber-700">{schol.deadline}</span>
            </div>
            <div className="flex space-x-3 mt-auto">
              <button onClick={() => alert("Application started! Redirecting to scholarship portal...")} className="flex-1 bg-brand-600 text-white py-2.5 rounded-xl font-bold hover:bg-brand-700 transition-transform active:scale-95">Apply Now</button>
              <button onClick={() => alert("Scholarship saved to your profile.")} className="flex-1 bg-white border border-slate-300 text-slate-700 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-transform active:scale-95">Save</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AIMentorView({ chatMessages, chatInput, setChatInput, handleChatSubmit }) {
  return (
    <div className="h-[calc(100vh-14rem)] flex flex-col glass-panel animate-fade-in max-w-5xl mx-auto">
      <div className="p-6 border-b border-slate-200 bg-white/50 rounded-t-2xl flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center">
          <MessageSquare className="w-6 h-6 text-brand-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">AI Career Mentor</h2>
          <p className="text-sm text-slate-500">Ask me anything about interviews, skills, or your roadmap.</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
        {chatMessages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-2xl p-4 rounded-2xl ${msg.sender === 'ai' ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm' : 'bg-brand-600 text-white rounded-tr-none shadow-md'}`}>
              <p className="leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 bg-white border-t border-slate-200 rounded-b-2xl">
        <form onSubmit={handleChatSubmit} className="flex gap-4 max-w-4xl mx-auto relative">
          <input 
            type="text" 
            value={chatInput} 
            onChange={(e) => setChatInput(e.target.value)} 
            placeholder="Type your message here..." 
            className="flex-1 px-6 py-4 bg-slate-100 border-none rounded-full focus:ring-2 focus:ring-brand-500 outline-none text-slate-800"
          />
          <button type="submit" className="absolute right-2 top-2 bottom-2 bg-brand-600 text-white px-6 rounded-full font-bold hover:bg-brand-700 shadow-md transition-transform active:scale-95">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

// Modals for backward compatibility on the Overview page
function RoadmapModal({ insights, onClose }) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl p-8 max-w-4xl w-full shadow-2xl relative max-h-[80vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900">✕</button>
        <LearningRoadmapView insights={insights} />
      </div>
    </div>
  );
}

function OtherMatchesModal({ insights, setInsights, onClose }) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl p-8 max-w-4xl w-full shadow-2xl relative max-h-[80vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900">✕</button>
        <AIRecommendationsView insights={insights} setInsights={setInsights} setActiveTab={()=>{}} />
      </div>
    </div>
  );
}

function ScholarshipModal({ scholarship, onClose }) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900">✕</button>
        <h2 className="text-2xl font-bold text-brand-600 mb-2">{scholarship.name}</h2>
        <p className="text-xl font-semibold text-slate-900 mb-4">{scholarship.amount}</p>
        <p className="text-slate-600 mb-6 leading-relaxed">{scholarship.description}</p>
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6">
          <span className="font-bold text-amber-800">Deadline:</span> <span className="text-amber-700">{scholarship.deadline}</span>
        </div>
        <button onClick={() => alert("Application started!")} className="w-full bg-brand-600 text-white py-3 rounded-xl font-bold hover:bg-brand-700">Apply Now</button>
      </div>
    </div>
  );
}
