import SectionHeading from '../ui/SectionHeading';

const cards = [
  ['Secure Process', 'We use verifiable, audited steps to protect your identity and assets.'],
  ['Expert Team', 'Blockchain investigators, security engineers, and support specialists.'],
  ['Proven Track', 'A serious workflow for intake, review, and secure case handling.'],
  
];

export default function AboutSection() {
  return (
    <section id="about" className="bg-black py-16 lg:py-24">
      <div className="section-shell grid gap-10 lg:gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
        <div>
          <SectionHeading
            title="About Blacksignal"
            description="We are a specialist crypto recovery team combining forensic blockchain analysis with secure engineering. Our mission is to help verified users regain access to funds lost to scams, forgotten credentials, or compromised wallets."
          />
          <div className="mt-8 flex flex-wrap gap-4 lg:mt-10">
            <a href="#faq" className="btn-primary">Learn More</a>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {cards.map(([title, text]) => (
            <article key={title} className="rounded-[20px] bg-[#dedede] p-6 text-slate-800 shadow-soft sm:rounded-[26px] sm:p-8">
              <div className="mb-4 h-9 w-9 rounded-xl border-2 border-[#d4a114] sm:mb-6 sm:h-10 sm:w-10" />
              <h3 className="text-xl font-bold sm:text-2xl">{title}</h3>
              <p className="mt-2 text-base leading-7 text-slate-600 sm:mt-3 sm:text-lg sm:leading-8">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}