import { BadgeDollarSign, Clock3, ShieldCheck, MessageCircleMore } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';

const features = [
  ['No Upfront Fees', 'Only pay after a successful recovery.', BadgeDollarSign],
  ['Rapid Investigation', 'Fast triage and chain analysis to trace funds.', Clock3],
  ['Secure Protocols', 'Encrypted handling of sensitive data and wallet access.', ShieldCheck],
  ['24/7 Support', 'Real people available around the clock to help.', MessageCircleMore],
  ['Private Client Portal', 'Authenticated users can track their recovery case updates.', ShieldCheck],
  ['Admin Command Desk', 'Superadmins can review leads, upload notes, and respond via chat.', Clock3],
  ['Document Uploads', 'Users can securely upload supporting proof during intake.', BadgeDollarSign],
  ['Discreet Chatbox', 'Only logged-in users and admins can see the live support inbox.', MessageCircleMore]
];

export default function FeatureGridSection() {
  return (
    <section id="press" className="bg-cream py-16 text-slate-900 lg:py-24">
      <div className="section-shell">
        <SectionHeading
          centered
          title="Features & Capabilities"
          description="Powerful tooling and proven processes to recover your crypto safely and efficiently."
        />
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:mt-14 lg:gap-8 xl:grid-cols-4">
          {features.map(([title, description, Icon]) => (
            <article key={title} className="rounded-[22px] bg-white p-7 shadow-soft sm:rounded-[28px] sm:p-10">
              <div className="grid h-13 w-13 place-items-center rounded-xl bg-[#f6edc5] text-[#d4a114] sm:h-16 sm:w-16 sm:rounded-2xl">
                <Icon size={28} className="sm:hidden" />
                <Icon size={34} className="hidden sm:block" />
              </div>
              <h3 className="mt-6 text-xl font-bold sm:mt-8 sm:text-2xl">{title}</h3>
              <p className="mt-3 text-base leading-7 text-slate-600 sm:mt-4 sm:text-lg sm:leading-8">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}