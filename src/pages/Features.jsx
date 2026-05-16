export default function Features() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-6">Platform Features</h1>
        <p className="text-lg text-slate-600 mb-12 max-w-2xl mx-auto">
          Everything you need to confidently plan and execute your career journey.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div className="glass-panel p-8 hover:-translate-y-1 transition-transform">
            <h3 className="text-xl font-bold text-brand-600 mb-2">1. AI Career Matching</h3>
            <p className="text-slate-600">Our advanced algorithms process your profile against thousands of real-world job roles to find the perfect match with a compatibility score.</p>
          </div>
          <div className="glass-panel p-8 hover:-translate-y-1 transition-transform">
            <h3 className="text-xl font-bold text-brand-600 mb-2">2. Skill Gap Analysis & Improvements</h3>
            <p className="text-slate-600">We don't just tell you what you're missing; we give you actionable advice and course suggestions on how to acquire those skills.</p>
          </div>
          <div className="glass-panel p-8 hover:-translate-y-1 transition-transform">
            <h3 className="text-xl font-bold text-brand-600 mb-2">3. Financial Awareness</h3>
            <p className="text-slate-600">Get tailored scholarship and college recommendations based on your family's annual income to ensure your path is affordable.</p>
          </div>
          <div className="glass-panel p-8 hover:-translate-y-1 transition-transform">
            <h3 className="text-xl font-bold text-brand-600 mb-2">4. AI Chatbot Mentor</h3>
            <p className="text-slate-600">Stuck on an interview question? Ask your personalized AI mentor anytime for instant guidance and tips.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
