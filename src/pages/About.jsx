import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="max-w-3xl text-center mt-12">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-6">About PathPilot AI</h1>
        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
          PathPilot AI was created to solve the massive problem of career confusion among students and fresh graduates. 
          By leveraging the power of Artificial Intelligence, we analyze your unique skills, interests, academic background, 
          and financial situation to provide highly personalized career recommendations and learning roadmaps.
        </p>
        <p className="text-lg text-slate-600 mb-12 leading-relaxed">
          Our mission is to democratize access to high-quality career counseling, ensuring that every student has a clear, 
          actionable, and affordable path to their dream job.
        </p>
        <Link to="/register" className="inline-flex items-center bg-brand-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-brand-700 transition-all shadow-xl hover:shadow-2xl">
          Join Us Today <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
