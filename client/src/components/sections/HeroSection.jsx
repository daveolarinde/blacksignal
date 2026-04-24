import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, LockKeyhole, ShieldCheck, BadgeCheck } from 'lucide-react';

const stats = ['Est. 2017', '100+ Publications', '55% Success Rate', 'Offline Recovery'];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-hero">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(139,94,52,0.35),transparent_30%),linear-gradient(180deg,rgba(0,0,0,0.2),rgba(0,0,0,0.85))]" />
      <div className="section-shell relative grid min-h-[85vh] items-center gap-8 py-16 lg:gap-12 lg:py-20 lg:grid-cols-[1.03fr_0.97fr]">
        <div>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
            <div className="mb-6 flex flex-wrap gap-3 text-sm text-textSoft sm:gap-6 sm:mb-8">
              {stats.map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-primaryLight" />
                  {item}
                </span>
              ))}
            </div>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl lg:leading-[0.95]">
              Were you involved in a crypto scam?
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-textSoft sm:text-lg sm:leading-8 md:text-xl md:leading-9 lg:mt-7">
              If a platform disappeared with your funds, blocked your withdrawals, or manipulated your trades — you have options. We help victims document their case, report fraudulent platforms to the right authorities, and pursue every available recovery channel.
            </p>

            {/* Wallet recovery sub-section */}
            <div className="mt-10 border-l-2 border-primaryLight/40 pl-5 lg:mt-12">
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                We&apos;ll help you get back into your crypto wallet
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-textSoft sm:text-base sm:leading-7">
                Forgot your password? Lost your recovery phrase? You&apos;re not alone. We guide verified users through a secure,
                isolated recovery workflow without exposing private credentials.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4 lg:mt-10">
              <Link to="/recover" className="btn-primary gap-2">
                Recover Wallet
                <ChevronRight size={16} />
              </Link>
              <a href="#about" className="btn-secondary">How it works</a>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 lg:mt-12">
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
          className="panel relative hidden overflow-hidden p-4 lg:block"
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