import { motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';

const wallets = [
  ['Blockchain.com', 'One of the most popular online wallets. We can help if you\'ve forgotten your password or lost access to your account.'],
  ['Bitcoin Core', 'The original Bitcoin wallet software. We specialize in recovering older desktop wallet versions with forgotten passwords.'],
  ['MetaMask', 'Popular browser extension for Ethereum and NFTs. We can assist with password issues and local profile recovery.'],
  ['Trust Wallet', 'Mobile wallet for multiple cryptocurrencies. We can assist with device migration and password recovery workflows.']
];

export default function WalletSection() {
  return (
    <section className="bg-black py-24">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Supported Wallets"
          title="We work with the wallets you use"
          description="Whether you\'ve been using crypto for years or just getting started, we can help recover access to your wallet. Here are some common wallets we support."
        />
        <div className="mt-14 grid gap-7 lg:grid-cols-2">
          {wallets.map(([title, description], index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              className="panel flex gap-6 p-10"
            >
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white text-primary shadow-glow">
                <span className="text-3xl">₿</span>
              </div>
              <div>
                <h3 className="text-3xl font-bold tracking-tight">{title}</h3>
                <p className="mt-4 max-w-xl text-lg leading-8 text-textSoft">{description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
