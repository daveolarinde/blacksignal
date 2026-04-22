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
    <section id="pricing" className="bg-black py-24">
      <div className="section-shell">
        <SectionHeading centered title="Recovery Services" description="We work closely with you to find the best solution to getting your crypto back." />
        <div className="mt-14 grid gap-8 xl:grid-cols-4 md:grid-cols-2">
          {services.map(([title, description, Icon], index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              className="panel flex min-h-[360px] flex-col justify-between p-10"
            >
              <div className="grid h-20 w-20 place-items-center rounded-[28px] bg-primary/10 text-primaryLight">
                <Icon size={40} />
              </div>
              <div className="mt-10">
                <h3 className="text-2xl font-bold leading-tight">{title}</h3>
                <p className="mt-5 text-lg leading-8 text-textSoft">{description}</p>
              </div>
              <div className="mt-8 text-right text-3xl text-primaryLight">→</div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
