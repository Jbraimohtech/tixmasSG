import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-12 bg-black text-white">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link href="/" className="mb-8 inline-block text-2xl font-bold tracking-tight">
          Event <span className="font-light">Tickets</span>
        </Link>

        <div className="mb-6">
          <p className="mb-3 text-sm text-gray-300">Let&apos;s Connect</p>
          <div className="flex gap-4 text-xl" aria-label="Social links">
            <span aria-label="Facebook">f</span>
            <span aria-label="X">𝕏</span>
            <span aria-label="Instagram">◎</span>
          </div>
        </div>

        <p className="mb-8 text-sm text-gray-400">
          By continuing past this page, you agree to our{" "}
          <a href="#" className="underline">
            terms of use
          </a>
          .
        </p>

        <div className="space-y-0 border-t border-gray-800">
          {["Categories", "Customer Care", "Be Part Of It", "About Us"].map(
            (item) => (
              <div
                key={item}
                className="border-b border-gray-800 py-4 text-sm"
              >
                {item}
              </div>
            ),
          )}
        </div>

        <div className="mt-8 space-y-3 text-center text-xs text-gray-500">
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
            <a href="#" className="hover:text-gray-300">
              Purchase Policy
            </a>
            <span>|</span>
            <a href="#" className="hover:text-gray-300">
              Privacy Policy
            </a>
            <span>|</span>
            <a href="#" className="hover:text-gray-300">
              Cookies
            </a>
          </div>
          <p className="italic">© 2026 Ticketmaster. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
