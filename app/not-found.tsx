import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#070a12] px-4 text-zinc-100">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">404</p>
        <h1 className="mt-2 text-3xl font-semibold">Fant ikke trenden</h1>
        <p className="mt-3 text-zinc-300">Siden finnes ikke eller er flyttet.</p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
        >
          Tilbake til dashboard
        </Link>
      </div>
    </main>
  );
}
