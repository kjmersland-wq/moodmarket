"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { LockKeyhole, MailCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Mode = "register" | "login" | "email";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mode === "register") {
      await registerWithPassword();
      return;
    }

    if (mode === "login") {
      await loginWithPassword();
      return;
    }

    if (!codeSent) {
      await sendCode();
      return;
    }

    await verifyCode();
  }

  async function registerWithPassword() {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        setError(data.message ?? "Kunne ikke registrere konto");
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

  async function loginWithPassword() {
    setError(null);
    setSuccess(null);
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

  async function sendCode() {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        setError(data.message ?? "Kunne ikke sende kode");
        return;
      }

      setCodeSent(true);
      setSuccess("Kode sendt til epost. Sjekk innboksen din.");
    } catch {
      setError("Noe gikk galt. Prov igjen.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode() {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/email/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        setError(data.message ?? "Kunne ikke verifisere kode");
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

        <div className="mb-4 grid grid-cols-3 gap-2 rounded-xl border border-white/10 bg-black/20 p-1">
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setCodeSent(false);
              setError(null);
              setSuccess(null);
            }}
            className={`rounded-lg px-2 py-1.5 text-xs transition ${
              mode === "register" ? "bg-cyan-400/20 text-cyan-100" : "text-zinc-300 hover:text-zinc-100"
            }`}
          >
            Registrer
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setCodeSent(false);
              setError(null);
              setSuccess(null);
            }}
            className={`rounded-lg px-2 py-1.5 text-xs transition ${
              mode === "login" ? "bg-cyan-400/20 text-cyan-100" : "text-zinc-300 hover:text-zinc-100"
            }`}
          >
            Passord
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("email");
              setError(null);
              setSuccess(null);
            }}
            className={`inline-flex items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-xs transition ${
              mode === "email" ? "bg-cyan-400/20 text-cyan-100" : "text-zinc-300 hover:text-zinc-100"
            }`}
          >
            <MailCheck className="h-3.5 w-3.5" />
            Epostkode
          </button>
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
              disabled={loading || codeSent}
            />
          </div>

          {mode !== "email" ? (
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
                autoComplete={mode === "register" ? "new-password" : "current-password"}
                required
                disabled={loading}
              />
            </div>
          ) : null}

          {mode === "email" && codeSent ? (
            <div className="space-y-1">
              <label className="text-sm text-zinc-300" htmlFor="code">
                Verifiseringskode
              </label>
              <Input
                id="code"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="6-sifret kode"
                inputMode="numeric"
                required
              />
            </div>
          ) : null}

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          {success ? <p className="text-sm text-emerald-300">{success}</p> : null}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? "Behandler..."
              : mode === "register"
                ? "Registrer konto"
                : mode === "login"
                  ? "Logg inn"
                  : codeSent
                    ? "Bekreft og ga videre"
                    : "Send kode"}
          </Button>

          {mode === "email" && codeSent ? (
            <button
              type="button"
              onClick={sendCode}
              className="w-full text-sm text-cyan-200 hover:text-cyan-100"
              disabled={loading}
            >
              Send ny kode
            </button>
          ) : null}

          {mode !== "email" ? (
            <p className="text-xs text-zinc-400">
              Kontoen lagres privat i denne nettleseren og er kun tilgjengelig for tillatt epost.
            </p>
          ) : (
            <p className="text-xs text-zinc-400">Epostkode krever SMTP-oppsett i deploy-miljo.</p>
          )}
        </form>
      </motion.section>
    </main>
  );
}
