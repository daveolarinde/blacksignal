import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ChevronRight, Shield, UploadCloud } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

const initialForm = {
  recoveryType: 'Password or Seed Phrase Recovery',
  fullName: '',
  email: '',
  phone: '',
  walletType: '',
  cryptoType: '',
  estimatedValue: '',
  issueDescription: '',
  partialInfo: ''
};

const recoveryTypes = [
  ['Password or Seed Phrase Recovery', 'Recover access to your wallet if you\'ve forgotten your password or seed phrase.'],
  ['Old or Corrupted Wallet', 'Recover from old wallet versions, corrupted files, or wallets that no longer sync.'],
  ['Deleted or Lost Wallet', 'Recover from accidentally deleted wallets or lost access to your device.'],
  ['Scam or Theft Recovery', 'Help with recovering assets from scams, phishing attacks, or unauthorized transfers.']
];

export default function RecoveryWizardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);

  const progress = useMemo(() => `${step} of 4`, [step]);

  // Restore saved form + jump to step 4 if coming back after login/register
  useEffect(() => {
    if (location.state?.resumeStep) {
      const saved = sessionStorage.getItem('pendingCase');
      if (saved) {
        setForm(JSON.parse(saved));
        setStep(location.state.resumeStep);
      }
    }
  }, [location.state]);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const next = () => setStep((prev) => Math.min(prev + 1, 4));
  const back = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    // Not logged in — save form and redirect to register
    if (!user) {
      sessionStorage.setItem('pendingCase', JSON.stringify(form));
      toast('Create an account to submit your request', { icon: '🔒' });
      navigate('/register', { state: { from: '/recover', resumeStep: 4 } });
      return;
    }

    try {
      setLoading(true);
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value));
      if (file) payload.append('proofDocument', file);

      const { data } = await api.post('/cases', payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      sessionStorage.removeItem('pendingCase');
      toast.success('Recovery request submitted');
      navigate(`/case/${data.case._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to submit request');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-borderSoft">
        <div className="section-shell flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 font-semibold">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-primary">
              <Shield size={14} />
            </div>
            Crypto Asset Recovery
          </Link>
          <div className="flex items-center gap-5 text-sm text-textSoft">
            <span>Need Help?</span>
            <Link to="/" className="rounded-xl bg-white px-4 py-2 font-medium text-black">Back to Home</Link>
          </div>
        </div>
      </header>

      <main className="section-shell py-10">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12">
            <div className="mb-3 flex items-center justify-between text-sm text-textSoft">
              <span>Step {progress}</span>
              <span>{['Select Recovery Type', 'Provide Details', 'Security Verification', 'Review & Submit'][step - 1]}</span>
            </div>
            <div className="h-2 rounded-full bg-white/10">
              <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${step * 25}%` }} />
            </div>
          </div>

          {step === 1 && (
            <section>
              <h1 className="text-center text-4xl font-bold">How Can We Help You <span className="text-primaryLight">Recover Your Crypto?</span></h1>
              <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-textSoft">Select the recovery service that best matches your situation. Our specialized team will guide you through the process.</p>
              <div className="mt-12 grid gap-6 md:grid-cols-2">
                {recoveryTypes.map(([title, text], index) => (
                  <button
                    key={title}
                    onClick={() => {
                      update('recoveryType', title);
                      next();
                    }}
                    className={`panel p-8 text-left transition hover:border-primaryLight ${index === 3 ? 'text-primaryLight' : ''}`}
                  >
                    <h3 className="text-3xl font-bold">{title}</h3>
                    <p className="mt-4 text-lg leading-8 text-textSoft">{text}</p>
                    <p className="mt-8 flex items-center gap-2 font-semibold text-primaryLight">Select this option <ChevronRight size={16} /></p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {step === 2 && (
            <section>
              <div className="mx-auto max-w-3xl rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-center text-sm text-primaryLight">Step 2 of 4</div>
              <h2 className="mt-6 text-center text-3xl font-bold">{form.recoveryType}</h2>
              <p className="mt-3 text-center text-textSoft">Please provide as much detail as possible to help us assess your case and determine the best recovery approach.</p>
              <div className="panel mx-auto mt-10 max-w-3xl p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="label">Full Name *</label>
                    <input className="input" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="label">Email Address *</label>
                    <input className="input" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="your.email@example.com" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="label">Phone Number *</label>
                    <input className="input" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="(+234) 801 234 5678" />
                  </div>
                  <div>
                    <label className="label">Wallet Type / Platform *</label>
                    <input className="input" value={form.walletType} onChange={(e) => update('walletType', e.target.value)} placeholder="MetaMask, Ledger, Trezor..." />
                  </div>
                  <div>
                    <label className="label">Cryptocurrency Type *</label>
                    <input className="input" value={form.cryptoType} onChange={(e) => update('cryptoType', e.target.value)} placeholder="Bitcoin, Ethereum, USDT..." />
                  </div>
                  <div className="md:col-span-2">
                    <label className="label">Approximate Value (USD) *</label>
                    <input className="input" value={form.estimatedValue} onChange={(e) => update('estimatedValue', e.target.value)} placeholder="$10,000" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="label">Detailed Description of the Issue *</label>
                    <textarea className="input min-h-[140px]" value={form.issueDescription} onChange={(e) => update('issueDescription', e.target.value)} placeholder="Please provide as much detail as possible about your situation..." />
                  </div>
                  <div className="md:col-span-2">
                    <label className="label">Any Partial Information You Remember</label>
                    <textarea className="input min-h-[120px]" value={form.partialInfo} onChange={(e) => update('partialInfo', e.target.value)} placeholder="Parts of password, partial seed phrase, hints you used..." />
                  </div>
                </div>
              </div>
            </section>
          )}

          {step === 3 && (
            <section>
              <div className="mx-auto max-w-3xl rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-center text-sm text-primaryLight">Step 3 of 4</div>
              <h2 className="mt-6 text-center text-3xl font-bold">Security Verification</h2>
              <p className="mt-3 text-center text-textSoft">To ensure the security of your recovery process, we need to verify your ownership of the assets.</p>
              <div className="panel mx-auto mt-10 max-w-3xl p-8">
                <div className="rounded-[26px] border border-dashed border-borderSoft bg-black/40 p-8 text-center">
                  <UploadCloud className="mx-auto text-primaryLight" size={34} />
                  <p className="mt-5 text-xl font-semibold">Upload Supporting Documents</p>
                  <p className="mt-2 text-textSoft">Upload screenshots of previous transactions, wallet exports, or any other proof of ownership.</p>
                  <input type="file" className="mt-6 block w-full text-sm text-textSoft file:mr-4 file:rounded-xl file:border-0 file:bg-white file:px-4 file:py-2 file:text-black" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                </div>
                <div className="mt-8 rounded-[22px] border border-[#8f6315] bg-[#2a1e07]/50 p-6">
                  <p className="font-semibold text-[#f1be52]">Important Security Notice</p>
                  <p className="mt-3 text-sm leading-7 text-[#f7de9c]">Never share your full private keys or seed phrases with anyone, including our team. Our recovery process is designed to work without requiring those secrets.</p>
                </div>
              </div>
            </section>
          )}

          {step === 4 && (
            <section>
              <div className="mx-auto max-w-3xl rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-center text-sm text-primaryLight">Final Step</div>
              <h2 className="mt-6 text-center text-3xl font-bold">Review & Submit</h2>
              <p className="mt-3 text-center text-textSoft">Please review your recovery request details before submission.</p>
              <div className="panel mx-auto mt-10 max-w-2xl p-8">
                <div className="space-y-6">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-textSoft">Recovery Type</p>
                    <p className="mt-2 font-semibold">{form.recoveryType}</p>
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-textSoft">Wallet Information</p>
                    <p className="mt-2 font-semibold">{form.walletType}</p>
                    <p className="text-textSoft">{form.cryptoType} • {form.estimatedValue}</p>
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-textSoft">Issue Description</p>
                    <div className="mt-2 rounded-2xl border border-borderSoft bg-black/40 p-4 text-textSoft">{form.issueDescription || 'No issue description provided.'}</div>
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-textSoft">Contact Information</p>
                    <p className="mt-2 font-semibold">{form.fullName}</p>
                    <p className="text-textSoft">{form.email}</p>
                    <p className="text-textSoft">{form.phone}</p>
                  </div>
                  <div className="rounded-[22px] border border-primary/30 bg-primary/10 p-5">
                    <p className="font-semibold text-white">What happens next?</p>
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-textSoft">
                      <li>Our team will review your case within 24–48 hours.</li>
                      <li>We&apos;ll contact you via email with our initial assessment.</li>
                      <li>If we can help, we&apos;ll provide a detailed recovery plan.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          )}

          <div className="mx-auto mt-10 flex max-w-3xl items-center justify-between">
            <button onClick={step === 1 ? () => navigate('/') : back} className="rounded-xl bg-white px-5 py-2.5 text-black">
              <span className="inline-flex items-center gap-2"><ArrowLeft size={16} /> {step === 1 ? 'Back Home' : 'Back'}</span>
            </button>
            {step < 4 ? (
              <button onClick={next} className="btn-primary">Continue <ChevronRight size={16} className="ml-1" /></button>
            ) : (
              <button onClick={handleSubmit} disabled={loading} className="btn-primary">{loading ? 'Submitting...' : 'Submit Request'} <ChevronRight size={16} className="ml-1" /></button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
