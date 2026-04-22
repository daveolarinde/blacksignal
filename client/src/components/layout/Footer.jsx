export default function Footer() {
  return (
    <footer className="border-t border-borderSoft bg-black py-10">
      <div className="section-shell flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-semibold">Blacksignal</p>
          <p className="mt-2 max-w-xl text-sm text-textSoft">
            Built with a private client portal, protected admin workflow, and a discreet support inbox.
          </p>
        </div>
        <p className="text-sm text-textSoft">© 2026 Blacksigna.</p>
      </div>
    </footer>
  );
}
