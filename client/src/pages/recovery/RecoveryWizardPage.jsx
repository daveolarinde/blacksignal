import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ChevronRight, Shield, UploadCloud } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import Logo from "../../assets/logo.png";

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
        <div className="section-shell flex h-14 items-center justify-between sm:h-16">
          <Link to="/" className="flex items-center gap-3 font-semibold">
            <img src={Logo} alt="Logo" className="w-28 sm:w-40" />
          </Link>
          <div className="flex items-center gap-3 text-sm text-textSoft sm:gap-5">
            <span className="hidden sm:inline">Need Help?</span>
            <Link to="/" className="rounded-xl bg-white px-3 py-1.5 font-medium text-black sm:px-4 sm:py-2">Back to Home</Link>
          </div>
        </div>
      </header>

      <main className="section-shell py-8 sm:py-10">
        <div className="mx-auto max-w-4xl">
          {/* Progress bar */}
          <div className="mb-8 sm:mb-12">
            <div className="mb-3 flex items-center justify-between text-xs text-textSoft sm:text-sm">
              <span>Step {progress}</span>
              <span className="text-right">{['Select Recovery Type', 'Provide Details', 'Security Verification', 'Review & Submit'][step - 1]}</span>
            </div>
            <div className="h-2 rounded-full bg-white/10">
              <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${step * 25}%` }} />
            </div>
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <section>
              <h1 className="text-center text-2xl font-bold sm:text-3xl md:text-4xl">
                How Can We Help You <span className="text-primaryLight">Recover Your Crypto?</span>
              </h1>
              <p className="mx-auto mt-3 max-w-2xl text-center text-base text-textSoft sm:mt-4 sm:text-lg">
                Select the recovery service that best matches your situation. Our specialized team will guide you through the process.
              </p>
              <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:gap-6 md:grid-cols-2">
                {recoveryTypes.map(([title, text], index) => (
                  <button
                    key={title}
                    onClick={() => { update('recoveryType', title); next(); }}
                    className={`panel p-6 text-left transition hover:border-primaryLight sm:p-8 ${index === 3 ? 'text-primaryLight' : ''}`}
                  >
                    <h3 className="text-xl font-bold sm:text-2xl lg:text-3xl">{title}</h3>
                    <p className="mt-3 text-base leading-7 text-textSoft sm:mt-4 sm:text-lg sm:leading-8">{text}</p>
                    <p className="mt-5 flex items-center gap-2 font-semibold text-primaryLight sm:mt-8">
                      Select this option <ChevronRight size={16} />
                    </p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <section>
              <div className="mx-auto max-w-3xl rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-center text-sm text-primaryLight">Step 2 of 4</div>
              <h2 className="mt-5 text-center text-2xl font-bold sm:mt-6 sm:text-3xl">{form.recoveryType}</h2>
              <p className="mt-2 text-center text-sm text-textSoft sm:mt-3 sm:text-base">
                Please provide as much detail as possible to help us assess your case and determine the best recovery approach.
              </p>
              <div className="panel mx-auto mt-8 max-w-3xl p-6 sm:mt-10 sm:p-8">
                <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
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
                    <textarea className="input min-h-[120px] sm:min-h-[140px]" value={form.issueDescription} onChange={(e) => update('issueDescription', e.target.value)} placeholder="Please provide as much detail as possible about your situation..." />
                  </div>
                  <div className="md:col-span-2">
                    <label className="label">Any Partial Information You Remember</label>
                    <textarea className="input min-h-[100px] sm:min-h-[120px]" value={form.partialInfo} onChange={(e) => update('partialInfo', e.target.value)} placeholder="Parts of password, partial seed phrase, hints you used..." />
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <section>
              <div className="mx-auto max-w-3xl rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-center text-sm text-primaryLight">Step 3 of 4</div>
              <h2 className="mt-5 text-center text-2xl font-bold sm:mt-6 sm:text-3xl">Security Verification</h2>
              <p className="mt-2 text-center text-sm text-textSoft sm:mt-3 sm:text-base">
                To ensure the security of your recovery process, we need to verify your ownership of the assets.
              </p>
              <div className="panel mx-auto mt-8 max-w-3xl p-6 sm:mt-10 sm:p-8">
                <div className="rounded-[20px] border border-dashed border-borderSoft bg-black/40 p-6 text-center sm:rounded-[26px] sm:p-8">
                  <UploadCloud className="mx-auto text-primaryLight" size={30} />
                  <p className="mt-4 text-lg font-semibold sm:text-xl">Upload Supporting Documents</p>
                  <p className="mt-2 text-sm text-textSoft sm:text-base">
                    Upload screenshots of previous transactions, wallet exports, or any other proof of ownership.
                  </p>
                  <input
                    type="file"
                    className="mt-5 block w-full text-sm text-textSoft file:mr-4 file:rounded-xl file:border-0 file:bg-white file:px-4 file:py-2 file:text-black sm:mt-6"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </div>
                <div className="mt-6 rounded-[20px] border border-[#8f6315] bg-[#2a1e07]/50 p-5 sm:mt-8 sm:rounded-[22px] sm:p-6">
                  <p className="font-semibold text-[#f1be52]">Important Security Notice</p>
                  <p className="mt-2 text-sm leading-6 text-[#f7de9c] sm:mt-3 sm:leading-7">
                    Never share your full private keys or seed phrases with anyone, including our team. Our recovery process is designed to work without requiring those secrets.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <section>
              <div className="mx-auto max-w-3xl rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-center text-sm text-primaryLight">Final Step</div>
              <h2 className="mt-5 text-center text-2xl font-bold sm:mt-6 sm:text-3xl">Review & Submit</h2>
              <p className="mt-2 text-center text-sm text-textSoft sm:mt-3 sm:text-base">
                Please review your recovery request details before submission.
              </p>
              <div className="panel mx-auto mt-8 max-w-2xl p-6 sm:mt-10 sm:p-8">
                <div className="space-y-5 sm:space-y-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-textSoft sm:text-sm">Recovery Type</p>
                    <p className="mt-1.5 font-semibold sm:mt-2">{form.recoveryType}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-textSoft sm:text-sm">Wallet Information</p>
                    <p className="mt-1.5 font-semibold sm:mt-2">{form.walletType}</p>
                    <p className="text-sm text-textSoft sm:text-base">{form.cryptoType} • {form.estimatedValue}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-textSoft sm:text-sm">Issue Description</p>
                    <div className="mt-1.5 rounded-2xl border border-borderSoft bg-black/40 p-3 text-sm text-textSoft sm:mt-2 sm:p-4 sm:text-base">
                      {form.issueDescription || 'No issue description provided.'}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-textSoft sm:text-sm">Contact Information</p>
                    <p className="mt-1.5 font-semibold sm:mt-2">{form.fullName}</p>
                    <p className="text-sm text-textSoft sm:text-base">{form.email}</p>
                    <p className="text-sm text-textSoft sm:text-base">{form.phone}</p>
                  </div>
                  <div className="rounded-[18px] border border-primary/30 bg-primary/10 p-4 sm:rounded-[22px] sm:p-5">
                    <p className="font-semibold text-white">What happens next?</p>
                    <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs text-textSoft sm:mt-3 sm:space-y-2 sm:text-sm">
                      <li>Our team will review your case within 24–48 hours.</li>
                      <li>We&apos;ll contact you via email with our initial assessment.</li>
                      <li>If we can help, we&apos;ll provide a detailed recovery plan.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Navigation buttons */}
          <div className="mx-auto mt-8 flex max-w-3xl items-center justify-between sm:mt-10">
            <button onClick={step === 1 ? () => navigate('/') : back} className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black sm:px-5 sm:py-2.5 sm:text-base">
              <span className="inline-flex items-center gap-2">
                <ArrowLeft size={16} /> {step === 1 ? 'Back Home' : 'Back'}
              </span>
            </button>
            {step < 4 ? (
              <button onClick={next} className="btn-primary text-sm sm:text-base">
                Continue <ChevronRight size={16} className="ml-1" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading} className="btn-primary text-sm sm:text-base">
                {loading ? 'Submitting...' : 'Submit Request'} <ChevronRight size={16} className="ml-1" />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}