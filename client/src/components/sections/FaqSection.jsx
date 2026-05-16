import SectionHeading from '../ui/SectionHeading';

const faqs = [
  
  ['Can users chat privately with support?', 'Yes. The chatbox is only visible inside the authenticated portal and admin dashboard.'],
];

export default function FaqSection() {
  return (
    <section id="faq" className="bg-black py-16 lg:py-24">
      <div className="section-shell">
        <SectionHeading
          centered
          eyebrow="FAQ"
          title="A few things you should not get wrong"
          description="This niche is trust-sensitive. So the app includes clear boundaries around secrets, role-based access, and private support."
        />
        <div className="mx-auto mt-10 grid max-w-4xl gap-4 lg:mt-14 lg:gap-5">
          {faqs.map(([question, answer]) => (
            <article key={question} className="panel p-6 sm:p-8">
              <h3 className="text-xl font-semibold sm:text-2xl">{question}</h3>
              <p className="mt-3 text-base leading-7 text-textSoft sm:mt-4 sm:text-lg sm:leading-8">{answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}