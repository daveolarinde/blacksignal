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
    <section id="press" className="bg-cream py-24 text-slate-900">
      <div className="section-shell">
        <SectionHeading centered title="Features & Capabilities" description="Powerful tooling and proven processes to recover your crypto safely and efficiently." />
        <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {features.map(([title, description, Icon]) => (
            <article key={title} className="rounded-[28px] bg-white p-10 shadow-soft">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#f6edc5] text-[#d4a114]">
                <Icon size={34} />
              </div>
              <h3 className="mt-8 text-2xl font-bold">{title}</h3>
              <p className="mt-4 text-lg leading-8 text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
