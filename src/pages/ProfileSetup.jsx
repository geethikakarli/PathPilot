import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Briefcase, GraduationCap, DollarSign, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

export default function ProfileSetup() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState({
    academics: '',
    skills: '',
    interests: '',
    financial: '',
    desiredCareer: ''
  });

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      
      if (res.ok) {
        navigate('/dashboard');
      } else {
        alert('Failed to save profile.');
      }
    } catch (err) {
      console.error(err);
      alert('Server error. Please make sure backend is running.');
    }
  };

  const steps = [
    { id: 1, title: "Academics", icon: <GraduationCap className="w-6 h-6" /> },
    { id: 2, title: "Skills", icon: <Briefcase className="w-6 h-6" /> },
    { id: 3, title: "Interests", icon: <BookOpen className="w-6 h-6" /> },
    { id: 4, title: "Financial", icon: <DollarSign className="w-6 h-6" /> },
    { id: 5, title: "Dream Career", icon: <CheckCircle className="w-6 h-6" /> }
  ];

  const popularCareers = [
    "IAS Officer", "Chartered Accountant (CA)", "Doctor (MBBS)", "Software Engineer", 
    "Data Scientist", "Lawyer", "Civil Engineer", "Pilot", "MBA Graduate", "Teacher"
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 z-0 rounded-full"></div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-500 z-0 rounded-full transition-all duration-300" style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}></div>
            
            {steps.map((s) => (
              <div key={s.id} className={`relative z-10 flex flex-col items-center ${step >= s.id ? 'text-brand-600' : 'text-slate-400'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${step >= s.id ? 'bg-brand-100 border-2 border-brand-500' : 'bg-white border-2 border-slate-200'} shadow-sm`}>
                  {step > s.id ? <CheckCircle className="w-6 h-6 text-brand-500" /> : s.icon}
                </div>
                <span className="mt-2 text-sm font-medium absolute -bottom-6 w-max">{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-8 md:p-12 mt-16">
          <form onSubmit={step === 5 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
            {step === 1 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Tell us about your academic background</h2>
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-slate-700">Current Education Level</label>
                  <select 
                    className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-slate-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-xl"
                    value={profileData.academics}
                    onChange={(e) => setProfileData({...profileData, academics: e.target.value})}
                    required
                  >
                    <option value="">Select your level</option>
                    <option>High School</option>
                    <option>Undergraduate</option>
                    <option>Postgraduate</option>
                  </select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">What are your current skills?</h2>
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-slate-700">List your skills (comma separated)</label>
                  <textarea 
                    className="mt-1 block w-full px-3 py-3 border border-slate-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-xl"
                    rows="4"
                    placeholder="e.g., Python, Communication, Graphic Design"
                    value={profileData.skills}
                    onChange={(e) => setProfileData({...profileData, skills: e.target.value})}
                    required
                  ></textarea>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">What are your career interests?</h2>
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-slate-700">Industries or roles you're curious about</label>
                  <textarea 
                    className="mt-1 block w-full px-3 py-3 border border-slate-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-xl"
                    rows="4"
                    placeholder="e.g., Artificial Intelligence, Marketing, Healthcare"
                    value={profileData.interests}
                    onChange={(e) => setProfileData({...profileData, interests: e.target.value})}
                    required
                  ></textarea>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Financial Background</h2>
                <p className="text-sm text-slate-500 mb-4">This helps us recommend affordable colleges and scholarships.</p>
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-slate-700">Annual Family Income</label>
                  <select 
                    className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-slate-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-xl"
                    value={profileData.financial}
                    onChange={(e) => setProfileData({...profileData, financial: e.target.value})}
                    required
                  >
                    <option value="">Select range</option>
                    <option>Under ₹3,00,000</option>
                    <option>₹3,00,000 - ₹6,00,000</option>
                    <option>₹6,00,000 - ₹10,00,000</option>
                    <option>Over ₹10,00,000</option>
                  </select>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Do you already have a dream career?</h2>
                <p className="text-sm text-slate-500 mb-6">If you know what you want to be, we can show you the exact path to get there.</p>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">Select from popular paths</label>
                    <div className="grid grid-cols-2 gap-3">
                      {popularCareers.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setProfileData({...profileData, desiredCareer: c})}
                          className={`text-sm px-4 py-2 rounded-xl border transition-all ${profileData.desiredCareer === c ? 'bg-brand-500 text-white border-brand-500 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300'}`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-slate-200"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-2 bg-white text-sm text-slate-500 uppercase tracking-wider">Or type your own</span>
                    </div>
                  </div>

                  <div>
                    <input 
                      type="text"
                      className="mt-1 block w-full px-4 py-3 border border-slate-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-xl"
                      placeholder="e.g., Space Scientist, UI/UX Designer, etc."
                      value={profileData.desiredCareer}
                      onChange={(e) => setProfileData({...profileData, desiredCareer: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-10 flex justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex items-center px-6 py-3 border border-slate-300 shadow-sm text-base font-medium rounded-xl text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" /> Back
                </button>
              ) : <div></div>}
              
              <button
                type="submit"
                className="flex items-center px-6 py-3 border border-transparent shadow-md text-base font-medium rounded-xl text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
              >
                {step === 5 ? 'Complete Profile' : 'Next'} {step !== 5 && <ArrowRight className="ml-2 h-5 w-5" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
