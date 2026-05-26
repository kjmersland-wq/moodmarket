"use client";

import { FormEvent, useEffect, useState } from "react";
import { UserPlus, Users } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Account = {
  id: number;
  email: string;
  navn: string | null;
  aktiv: boolean;
  opprettet: string;
};

export function KontoClient() {
  const [email, setEmail] = useState("");
  const [navn, setNavn] = useState("");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadAccounts() {
    const response = await fetch("/api/accounts", { cache: "no-store" });
    const payload = (await response.json()) as { data?: Account[]; error?: string };
    if (!response.ok) {
      throw new Error(payload.error ?? "Kunne ikke hente kontoer");
    }
    setAccounts(payload.data ?? []);
  }

  useEffect(() => {
    loadAccounts().catch((err: unknown) => {
      const text = err instanceof Error ? err.message : "Kunne ikke laste kontoer";
      setError(text);
    });
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, navn })
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Kunne ikke lagre konto");
      }

      setEmail("");
      setNavn("");
      setMessage("Konto lagt til/oppdatert");
      await loadAccounts();
    } catch (err: unknown) {
      const text = err instanceof Error ? err.message : "Kunne ikke lagre konto";
      setError(text);
    } finally {
      setLoading(false);
    }
  }

  async function toggleAccount(account: Account) {
    setError(null);
    try {
      const response = await fetch("/api/accounts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: account.id, aktiv: !account.aktiv })
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Kunne ikke oppdatere konto");
      }

      await loadAccounts();
    } catch (err: unknown) {
      const text = err instanceof Error ? err.message : "Kunne ikke oppdatere konto";
      setError(text);
    }
  }

  return (
    <AppShell>
      <div className="mb-8 space-y-2">
        <h2 className="text-3xl font-semibold text-white">Kontoer</h2>
        <p className="text-slate-300">Legg til flere kontoer som skal ha tilgang.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-cyan-200" />
              Legg til konto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={onSubmit}>
              <Input
                type="email"
                required
                placeholder="epost@domene.no"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <Input
                placeholder="Navn (valgfritt)"
                value={navn}
                onChange={(event) => setNavn(event.target.value)}
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-cyan-300/40 bg-cyan-300/10 px-4 text-sm text-cyan-100 transition hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Lagrer..." : "Lagre konto"}
              </button>
            </form>
            {message ? <p className="mt-3 text-sm text-emerald-300">{message}</p> : null}
            {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2">
              <Users className="h-5 w-5 text-cyan-200" />
              Registrerte kontoer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {accounts.map((account) => (
                <li
                  key={account.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{account.navn || account.email}</p>
                    <p className="text-xs text-slate-400">{account.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleAccount(account)}
                    className={`rounded-xl border px-3 py-1.5 text-xs transition ${
                      account.aktiv
                        ? "border-emerald-300/35 bg-emerald-300/10 text-emerald-200"
                        : "border-rose-300/35 bg-rose-300/10 text-rose-200"
                    }`}
                  >
                    {account.aktiv ? "Aktiv" : "Inaktiv"}
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}