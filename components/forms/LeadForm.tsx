"use client";

import { useState } from "react";
import { type LeadInput } from "@/lib/validations";
import { PhoneInput } from "@/components/ui/PhoneInput";

interface LeadFormProps {
  carId?: string;
  calcData?: { term: number; down: number; payment: number };
  source?: LeadInput["source"];
}

export function LeadForm({
  carId,
  calcData,
  source = "WEBSITE",
}: LeadFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [phone, setPhone] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data: LeadInput = {
      name: formData.get("name") as string,
      phone,
      email: (formData.get("email") as string) || undefined,
      company: (formData.get("company") as string) || undefined,
      message: (formData.get("message") as string) || undefined,
      source,
      carId: carId || undefined,
      calcTerm: calcData?.term,
      calcDown: calcData?.down,
      calcPayment: calcData?.payment,
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        if (body.details) {
          const errs: Record<string, string> = {};
          for (const d of body.details) errs[d.field] = d.message;
          setFieldErrors(errs);
        }
        throw new Error(body.error || "Ошибка отправки");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="glass p-8 text-center">
        <div className="mb-3 text-4xl">&#10003;</div>
        <h3 className="text-xl font-semibold">Заявка принята!</h3>
        <p className="mt-2 text-sm text-text-secondary">
          Мы свяжемся с вами в ближайшее время
        </p>
      </div>
    );
  }

  return (
    <section id="lead-form" className="py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <h2 className="mb-2 text-center text-3xl font-bold tracking-tight lg:text-4xl">
          Оставить <span className="text-amber">заявку</span>
        </h2>
        <p className="mb-12 text-center text-text-secondary">
          Оставьте контакты — перезвоним в течение 30 минут
        </p>

        <form
          onSubmit={onSubmit}
          className="glass mx-auto max-w-lg p-8"
        >
          {/* Name */}
          <div className="mb-4">
            <input
              name="name"
              placeholder="Ваше имя *"
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-text-tertiary focus:border-amber/50 focus:outline-none focus:ring-1 focus:ring-amber/30"
            />
            {fieldErrors.name && (
              <p className="mt-1 text-xs text-rose">{fieldErrors.name}</p>
            )}
          </div>

          {/* Phone */}
          <div className="mb-4">
            <PhoneInput
              placeholder="+7 (___) ___-__-__"
              required
              value={phone}
              onChange={setPhone}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-text-tertiary focus:border-amber/50 focus:outline-none focus:ring-1 focus:ring-amber/30"
            />
            {fieldErrors.phone && (
              <p className="mt-1 text-xs text-rose">{fieldErrors.phone}</p>
            )}
          </div>

          {/* Company */}
          <div className="mb-4">
            <input
              name="company"
              placeholder="Компания"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-text-tertiary focus:border-amber/50 focus:outline-none focus:ring-1 focus:ring-amber/30"
            />
          </div>

          {/* Message */}
          <div className="mb-6">
            <textarea
              name="message"
              placeholder="Комментарий"
              rows={3}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-text-tertiary focus:border-amber/50 focus:outline-none focus:ring-1 focus:ring-amber/30"
            />
          </div>

          {error && (
            <p className="mb-4 text-center text-sm text-rose">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-amber px-8 py-3.5 text-sm font-semibold text-zinc-900 shadow-lg shadow-amber/20 transition-all hover:bg-amber-light hover:shadow-amber/30 active:scale-[0.98] disabled:opacity-50"
          >
            {submitting ? "Отправка..." : "Отправить заявку"}
          </button>
        </form>
      </div>
    </section>
  );
}
