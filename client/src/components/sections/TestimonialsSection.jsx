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
    <section id="testimonials" className="bg-cream py-24 text-slate-900">
      <div className="section-shell">
        <SectionHeading centered title="Testimonials" description="Real stories from real clients we have helped recover crypto assets." />
        <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map(([name, role, quote, rating]) => (
            <article key={name} className="rounded-[28px] bg-white p-8 shadow-soft">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/20 text-lg font-bold text-primary">{name[0]}</div>
                <div>
                  <p className="text-2xl font-semibold">{name}</p>
                  <p className="text-lg text-slate-500">{role}</p>
                </div>
              </div>
              <div className="mt-6 text-xl text-[#d4a114]">★★★★★ <span className="ml-2 text-base text-slate-500">{rating}</span></div>
              <p className="mt-5 text-lg leading-8 text-slate-600">{quote}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
