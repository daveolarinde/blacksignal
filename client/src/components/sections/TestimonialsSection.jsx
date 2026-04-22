import SectionHeading from '../ui/SectionHeading';

const testimonials = [
  ['Sophia Patel', 'Entrepreneur', 'Funds were swept minutes after incoming transfers. The team designed a safe extraction plan and moved assets to a new wallet. Brilliant work!', '4.8/5'],
  ['James Carter', 'Developer', 'I lost my seed backup and could not access tokens. They helped rebuild from partial data and recovered everything.', '5.0/5'],
  ['Elena Rossi', 'Designer', 'Clear communication, no upfront fees and fast analysis. I recovered my ETH and NFTs within days.', '4.5/5'],
  ['Marcus Lee', 'Founder', 'The portal felt private and the process stayed organized. It never felt like one of those shady recovery services.', '4.9/5'],
  ['Hannah Nguyen', 'Investor', 'The discreet chat support made it easy to ask questions without exposing details publicly.', '4.7/5'],
  ['Daniel Morales', 'Trader', 'They pushed me to provide proof, which was annoying at first, but honestly that made the workflow feel real.', '4.8/5']
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-cream py-16 text-slate-900 lg:py-24">
      <div className="section-shell">
        <SectionHeading
          centered
          title="Testimonials"
          description="Real stories from real clients we have helped recover crypto assets."
        />
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:mt-14 lg:gap-8 xl:grid-cols-3">
          {testimonials.map(([name, role, quote, rating]) => (
            <article key={name} className="rounded-[22px] bg-white p-6 shadow-soft sm:rounded-[28px] sm:p-8">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary/20 text-base font-bold text-primary sm:h-14 sm:w-14 sm:text-lg">
                  {name[0]}
                </div>
                <div>
                  <p className="text-xl font-semibold sm:text-2xl">{name}</p>
                  <p className="text-base text-slate-500 sm:text-lg">{role}</p>
                </div>
              </div>
              <div className="mt-4 text-lg text-[#d4a114] sm:mt-6 sm:text-xl">
                ★★★★★ <span className="ml-2 text-sm text-slate-500 sm:text-base">{rating}</span>
              </div>
              <p className="mt-4 text-base leading-7 text-slate-600 sm:mt-5 sm:text-lg sm:leading-8">{quote}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}