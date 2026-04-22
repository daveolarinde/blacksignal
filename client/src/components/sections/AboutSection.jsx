import SectionHeading from '../ui/SectionHeading';

const cards = [
  ['Secure Process', 'We use verifiable, audited steps to protect your identity and assets.'],
  ['Expert Team', 'Blockchain investigators, security engineers, and support specialists.'],
  ['Proven Track', 'A serious workflow for intake, review, and secure case handling.'],
  ['Transparent Fees', 'No upfront payment. Pay only after successful recovery.']
];

export default function AboutSection() {
  return (
    <section id="about" className="bg-black py-24">
      <div className="section-shell grid gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
        <div>
          <SectionHeading
            title="About Vault Tech Recovery"
            description="We are a specialist crypto recovery team combining forensic blockchain analysis with secure engineering. Our mission is to help verified users regain access to funds lost to scams, forgotten credentials, or compromised wallets."
          />
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#faq" className="btn-primary">Learn More</a>
            <a href="#testimonials" className="rounded-2xl border border-primary bg-white px-6 py-3 font-semibold text-primary">Contact Us</a>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {cards.map(([title, text]) => (
            <article key={title} className="rounded-[26px] bg-[#dedede] p-8 text-slate-800 shadow-soft">
              <div className="mb-6 h-10 w-10 rounded-xl border-2 border-[#d4a114]" />
              <h3 className="text-2xl font-bold">{title}</h3>
              <p className="mt-3 text-lg leading-8 text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
