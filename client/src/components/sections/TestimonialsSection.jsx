import SectionHeading from '../ui/SectionHeading';

const testimonials = [
  {
    name: 'Sophia Patel',
    role: 'Entrepreneur',
    quote: 'Funds were swept minutes after incoming transfers. The team designed a safe extraction plan and moved assets to a new wallet. Brilliant work!',
    rating: '4.8/5',
    image: 'https://randomuser.me/api/portraits/women/65.jpg'
  },
  {
    name: 'James Carter',
    role: 'Developer',
    quote: 'I lost my seed backup and could not access tokens. They helped rebuild from partial data and recovered everything.',
    rating: '5.0/5',
    image: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    name: 'Elena Rossi',
    role: 'Designer',
    quote: 'Clear communication, no upfront fees and fast analysis. I recovered my ETH and NFTs within days.',
    rating: '4.5/5',
    image: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    name: 'Marcus Lee',
    role: 'Founder',
    quote: 'The portal felt private and the process stayed organized. It never felt like one of those shady recovery services.',
    rating: '4.9/5',
    image: 'https://randomuser.me/api/portraits/men/75.jpg'
  },
  {
    name: 'Hannah Nguyen',
    role: 'Investor',
    quote: 'The discreet chat support made it easy to ask questions without exposing details publicly.',
    rating: '4.7/5',
    image: 'https://randomuser.me/api/portraits/women/68.jpg'
  },
  {
    name: 'Daniel Morales',
    role: 'Trader',
    quote: 'They pushed me to provide proof, which was annoying at first, but honestly that made the workflow feel real.',
    rating: '4.8/5',
    image: 'https://randomuser.me/api/portraits/men/41.jpg'
  }
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
          {testimonials.map(({ name, role, quote, rating, image }) => (
            <article key={name} className="rounded-[22px] bg-white p-6 shadow-soft sm:rounded-[28px] sm:p-8">
              <div className="flex items-center gap-3 sm:gap-4">
                <img
                  src={image}
                  alt={name}
                  className="h-12 w-12 shrink-0 rounded-full object-cover sm:h-14 sm:w-14"
                />
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