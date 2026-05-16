import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b-0 rounded-none border-x-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="PathPilot AI Logo" className="h-10 w-10 object-contain rounded-full shadow-sm" />
              <span className="font-bold text-2xl tracking-tight text-slate-900">
                PathPilot <span className="gradient-text">AI</span>
              </span>
            </Link>
          </div>
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-slate-600 hover:text-brand-600 font-medium transition-colors">Home</Link>
            <Link to="/features" className="text-slate-600 hover:text-brand-600 font-medium transition-colors">Features</Link>
            <Link to="/about" className="text-slate-600 hover:text-brand-600 font-medium transition-colors">About</Link>
          </div>
          <div className="flex space-x-4 items-center">
            {token ? (
              <>
                <Link to="/dashboard" className="text-brand-600 font-medium hover:text-brand-700 transition-colors">Dashboard</Link>
                <button onClick={handleLogout} className="bg-slate-200 text-slate-700 px-5 py-2 rounded-full font-medium hover:bg-slate-300 transition-all shadow-sm">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-brand-600 font-medium hover:text-brand-700 transition-colors">Sign In</Link>
                <Link to="/register" className="bg-brand-600 text-white px-5 py-2 rounded-full font-medium hover:bg-brand-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
