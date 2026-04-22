import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, LockKeyhole, ShieldCheck, BadgeCheck } from 'lucide-react';

const stats = ['Est. 2017', '100+ Publications', '55% Success Rate', 'Offline Recovery'];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-hero">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(139,94,52,0.35),transparent_30%),linear-gradient(180deg,rgba(0,0,0,0.2),rgba(0,0,0,0.85))]" />
      <div className="section-shell relative grid min-h-[85vh] items-center gap-12 py-20 lg:grid-cols-[1.03fr_0.97fr]">
        <div>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
            <div className="mb-8 flex flex-wrap gap-6 text-sm text-textSoft">
              {stats.map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-primaryLight" />
                  {item}
                </span>
              ))}
            </div>
            <h1 className="max-w-3xl text-5xl font-extrabold leading-[0.95] tracking-tight md:text-7xl">
              We&apos;ll help you get back into your crypto wallet
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-9 text-textSoft">
              Forgot your password? Lost your recovery phrase? You&apos;re not alone. We guide verified users through a secure,
              isolated recovery workflow without exposing private credentials.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link to="/recover" className="btn-primary gap-2">
                Recover Wallet
                <ChevronRight size={16} />
              </Link>
              <a href="#about" className="btn-secondary">How it works</a>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {[
                ['No recovery, no fee guarantee', LockKeyhole],
                ['24/7 expert support', BadgeCheck],
                ['Secure, confidential process', ShieldCheck]
              ].map(([label, Icon]) => (
                <div key={label} className="panel p-4">
                  <Icon className="mb-3 text-primaryLight" size={20} />
                  <p className="text-sm font-medium text-white">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="panel relative overflow-hidden p-4"
        >
          <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_center,rgba(180,130,80,0.22),transparent_38%),linear-gradient(135deg,#1a120b,#28190f_35%,#101010)] p-10">
            <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:30px_30px]" />
            <div className="relative mx-auto grid min-h-[480px] place-items-center">
              <div className="absolute h-[68%] w-[78%] rounded-[34px] border border-primaryLight/30 bg-black/40 shadow-[0_0_100px_rgba(180,130,80,0.15)]" />
              <div className="absolute h-[52%] w-[62%] rounded-[32px] border border-primaryLight/30 bg-gradient-to-br from-[#372416] to-[#100b08]" />
              <div className="relative flex h-48 w-48 items-center justify-center rounded-[28px] border border-primaryLight/40 bg-primary/15 shadow-[0_0_80px_rgba(180,130,80,0.25)]">
                <LockKeyhole className="text-primaryLight" size={86} />
              </div>
              <div className="absolute bottom-10 left-10 h-16 w-16 rounded-full border border-white/10 bg-white/5" />
              <div className="absolute right-12 top-10 h-12 w-12 rounded-xl border border-white/10 bg-white/5" />
              <div className="absolute bottom-16 right-20 h-24 w-24 rounded-2xl border border-primaryLight/20 bg-primary/10" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
