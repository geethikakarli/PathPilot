import { ArrowRight, BrainCircuit, Compass, Target, BookOpen, GraduationCap, LineChart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full relative overflow-hidden bg-white pt-24 pb-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-brand-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-accent-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
            Navigate your career with <br className="hidden md:block" />
            <span className="gradient-text">Intelligent Guidance</span>
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-slate-600 mx-auto mb-10">
            PathPilot AI analyzes your skills, passions, and background to map out your perfect career journey. Stop guessing, start preparing.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register" className="flex items-center bg-brand-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-brand-700 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
              Start Your Journey <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link to="/about" className="flex items-center bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-full font-semibold text-lg hover:bg-slate-50 transition-all shadow-sm">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Why choose PathPilot AI?</h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">We use advanced machine learning to provide holistic, data-driven career planning.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<BrainCircuit className="w-8 h-8 text-brand-600" />}
              title="AI Recommendations"
              description="Get personalized career suggestions based on deep analysis of your skills, interests, and academic performance."
            />
            <FeatureCard 
              icon={<Target className="w-8 h-8 text-brand-600" />}
              title="Skill Gap Analysis"
              description="Identify exactly what skills you're missing for your dream job and discover the best resources to acquire them."
            />
            <FeatureCard 
              icon={<Compass className="w-8 h-8 text-brand-600" />}
              title="Custom Roadmaps"
              description="Generate step-by-step learning plans, course recommendations, and career preparation milestones."
            />
            <FeatureCard 
              icon={<GraduationCap className="w-8 h-8 text-brand-600" />}
              title="Financial Guidance"
              description="Find budget-friendly colleges, scholarships, and financial aid opportunities tailored to your profile."
            />
            <FeatureCard 
              icon={<BookOpen className="w-8 h-8 text-brand-600" />}
              title="AI Mentor Chatbot"
              description="Get 24/7 answers to your career questions, interview tips, and mentorship support from our intelligent chatbot."
            />
            <FeatureCard 
              icon={<LineChart className="w-8 h-8 text-brand-600" />}
              title="Real-Time Trends"
              description="Stay ahead of the curve with real-time job trend analysis, future demand predictions, and industry growth insights."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="glass-panel p-8 hover:-translate-y-2 transition-transform duration-300">
      <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
