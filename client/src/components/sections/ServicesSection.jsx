import { motion } from 'framer-motion';
import { KeyRound, Wallet, Database, ShieldAlert } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';

const services = [
  ['Forgotten Wallet Passwords & Seeds', 'If you\'ve forgotten or lost your password, passphrase, or seed phrase, we can help you recover access without asking for secrets.', KeyRound],
  ['Old Wallet Versions', 'If you\'re having issues with old wallets that no longer work or are trying to sync, we can help you regain access.', Wallet],
  ['Deleted Data', 'If you accidentally deleted your wallet or local recovery data, we can often recover it using specialized techniques.', Database],
  ['Sweeper Bots', 'If your wallet address has a sweeper bot attached to it, we can help design a safer migration strategy.', ShieldAlert]
];

export default function ServicesSection() {
  return (
    <section id="pricing" className="bg-black py-16 lg:py-24">
      <div className="section-shell">
        <SectionHeading
          centered
          title="Recovery Services"
          description="We work closely with you to find the best solution to getting your crypto back."
        />
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:mt-14 lg:gap-8 xl:grid-cols-4">
          {services.map(([title, description, Icon], index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              className="panel flex min-h-[auto] flex-col justify-between p-7 sm:min-h-[360px] sm:p-10"
            >
              <div className="grid h-14 w-14 place-items-center rounded-[20px] bg-primary/10 text-primaryLight sm:h-20 sm:w-20 sm:rounded-[28px]">
                <Icon size={28} className="sm:hidden" />
                <Icon size={40} className="hidden sm:block" />
              </div>
              <div className="mt-6 sm:mt-10">
                <h3 className="text-xl font-bold leading-tight sm:text-2xl">{title}</h3>
                <p className="mt-3 text-base leading-7 text-textSoft sm:mt-5 sm:text-lg sm:leading-8">{description}</p>
              </div>
              <div className="mt-5 text-right text-2xl text-primaryLight sm:mt-8 sm:text-3xl">→</div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}