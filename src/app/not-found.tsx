import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-950 px-4 text-center text-slate-100">
      <div>
        <p className="mb-2 text-sm uppercase tracking-[0.2em] text-cyan-200/80">404</p>
        <h2 className="mb-3 text-3xl font-semibold">Fant ikke siden</h2>
        <Link href="/" className="text-cyan-200 hover:text-white">
          Tilbake til dashboard
        </Link>
      </div>
    </div>
  );
}
