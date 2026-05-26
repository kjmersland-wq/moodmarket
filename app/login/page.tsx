"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        setError(data.message ?? "Kunne ikke logge inn");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Noe gikk galt. Prov igjen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070a12] px-4 text-zinc-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(6,182,212,0.18),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(56,189,248,0.12),transparent_35%)]" />

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_90px_rgba(4,20,38,0.55)] backdrop-blur-xl"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-cyan-400/15 p-2 text-cyan-200">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">MoodMarket</p>
            <h1 className="text-2xl font-semibold text-zinc-50">Logg inn</h1>
          </div>
        </div>

        <form className="space-y-3" onSubmit={onSubmit}>
          <div className="space-y-1">
            <label className="text-sm text-zinc-300" htmlFor="email">
              Epost
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="deg@epost.no"
              autoComplete="email"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-zinc-300" htmlFor="password">
              Passord
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minst 8 tegn"
              autoComplete="current-password"
              required
              disabled={loading}
            />
          </div>

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Behandler..." : "Logg inn"}
          </Button>

          <p className="text-xs text-zinc-400">Bruk samme epost og passord for videre innlogging.</p>
        </form>
      </motion.section>
    </main>
  );
}
