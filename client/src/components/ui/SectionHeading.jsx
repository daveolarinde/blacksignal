import { motion } from 'framer-motion';

export default function SectionHeading({ eyebrow, title, description, centered = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55 }}
      className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}
    >
      {eyebrow ? <p className="mb-4 text-sm uppercase tracking-[0.28em] text-primaryLight">{eyebrow}</p> : null}
      <h2 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">{title}</h2>
      {description ? <p className="mt-5 text-lg leading-8 text-textSoft">{description}</p> : null}
    </motion.div>
  );
}
