import SectionHeading from '../ui/SectionHeading';

const faqs = [
  ['Will you ask for my seed phrase?', 'No. This product is designed around the opposite. Users should never provide their seed phrase or private key.'],
  ['Can users chat privately with support?', 'Yes. The chatbox is only visible inside the authenticated portal and admin dashboard.'],
  ['Can admins see submitted case details?', 'Yes. The protected admin route shows contact details, uploaded documents, wallet info, and issue notes.'],
  ['Can I run this locally?', 'Yes. The repo ships with a React client, Node/Express server, Socket.io chat, JWT auth, and MongoDB models.']
];

export default function FaqSection() {
    return (
      <section id="faq" className="bg-black py-24">
        <div className="section-shell">
          <SectionHeading centered eyebrow="FAQ" title="A few things you should not get wrong" description="This niche is trust-sensitive. So the app includes clear boundaries around secrets, role-based access, and private support." />
          <div className="mx-auto mt-14 grid max-w-4xl gap-5">
            {faqs.map(([question, answer]) => (
              <article key={question} className="panel p-8">
                <h3 className="text-2xl font-semibold">{question}</h3>
                <p className="mt-4 text-lg leading-8 text-textSoft">{answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
}
