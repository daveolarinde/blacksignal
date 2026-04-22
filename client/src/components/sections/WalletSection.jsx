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
    <section className="bg-black py-16 lg:py-24">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Supported Wallets"
          title="We work with the wallets you use"
          description="Whether you've been using crypto for years or just getting started, we can help recover access to your wallet. Here are some common wallets we support."
        />
        <div className="mt-10 grid grid-cols-1 gap-5 sm:gap-6 lg:mt-14 lg:grid-cols-2 lg:gap-7">
          {wallets.map(([title, description], index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              className="panel flex gap-4 p-6 sm:gap-6 sm:p-10"
            >
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white text-primary shadow-glow sm:h-16 sm:w-16 sm:rounded-2xl">
                <span className="text-2xl sm:text-3xl">₿</span>
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">{title}</h3>
                <p className="mt-2 max-w-xl text-base leading-7 text-textSoft sm:mt-4 sm:text-lg sm:leading-8">{description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}