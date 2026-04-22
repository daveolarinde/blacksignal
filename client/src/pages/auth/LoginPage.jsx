import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await login(form);
      toast.success('Logged in successfully');

      // Coming from the wizard — send them back to finish submitting
      if (location.state?.from === '/recover') {
        navigate('/recover', { state: { resumeStep: location.state.resumeStep } });
      } else {
        navigate(data.user.role === 'admin' ? '/admin' : '/portal');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,rgba(139,94,52,0.16),transparent_25%),#050505] px-6">
      <div className="panel w-full max-w-md p-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold">Welcome back</p>
            <p className="text-sm text-textSoft">Sign in to continue to your secure portal.</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
        </form>
        <p className="mt-6 text-sm text-textSoft">No account yet? <Link className="text-primaryLight" to="/register">Create one</Link></p>
      </div>
    </div>
  );
}