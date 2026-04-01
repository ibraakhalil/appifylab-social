"use client";

import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
  UserPlus,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

type AuthPageProps = {
  mode: "login" | "registration";
};

type FormState = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  repeatPassword: string;
};

const authContent = {
  login: {
    title: "Login to your account",
    submitLabel: "Login now",
    switchCopy: "Don't have an account?",
    switchLabel: "Create New Account",
    switchHref: "/registration",
    heroImage: "/images/login.png",
    heroAlt: "Login illustration",
  },
  registration: {
    title: "Create your account",
    submitLabel: "Create account",
    switchCopy: "Already have an account?",
    switchLabel: "Login now",
    switchHref: "/login",
    heroImage: "/images/registration.png",
    heroAlt: "Registration illustration",
  },
} as const;

const initialFormState: FormState = {
  email: "",
  firstName: "",
  lastName: "",
  password: "",
  repeatPassword: "",
};

function AuthInput({
  icon: Icon,
  label,
  name,
  onChange,
  placeholder,
  type,
  value,
}: {
  icon: typeof Mail;
  label: string;
  name: keyof FormState;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type: string;
  value: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-ink">{label}</span>
      <span className="relative block">
        <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
        <input
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          type={type}
          value={value}
          className="h-12 w-full rounded-2xl border border-line bg-white pl-11 pr-4 text-sm text-ink outline-none transition focus:border-accent/50 focus:ring-4 focus:ring-accent/10"
        />
      </span>
    </label>
  );
}

export default function AuthPage({ mode }: AuthPageProps) {
  const content = authContent[mode];
  const isRegistration = mode === "registration";
  const router = useRouter();
  const { isAuthenticated, isReady, login, register } = useAuth();
  const [form, setForm] = useState<FormState>(initialFormState);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isReady && isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isReady, router]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (isRegistration) {
      if (!form.firstName.trim() || !form.lastName.trim()) {
        setError("First name and last name are required.");
        return;
      }

      if (form.password !== form.repeatPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (isRegistration) {
        await register({
          email: form.email.trim(),
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          password: form.password,
        });
      } else {
        await login({
          email: form.email.trim(),
          password: form.password,
        });
      }

      setForm(initialFormState);
      router.replace("/");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to complete the request.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-page">
      <div className="pointer-events-none absolute left-0 top-0 hidden lg:block">
        <Image src="/images/shape1.svg" width={174} height={220} alt="" className="h-auto w-[150px] xl:w-[174px]" />
      </div>
      <div className="pointer-events-none absolute right-0 top-0 hidden lg:block">
        <Image src="/images/shape2.svg" width={480} height={420} alt="" className="h-auto w-[360px] xl:w-[480px]" />
      </div>
      <div className="pointer-events-none absolute bottom-0 right-[8%] hidden xl:block">
        <Image src="/images/shape3.svg" width={420} height={320} alt="" className="h-auto w-[360px]" />
      </div>

      <div className="relative mx-auto grid min-h-screen max-w-[1440px] items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_28rem] lg:px-8 lg:py-16">
        <section className="relative hidden lg:block">
          <div className="relative mx-auto max-w-[760px] ">
            <div className="relative mt-10">
              <Image
                src={content.heroImage}
                width={820}
                height={620}
                alt={content.heroAlt}
                className="h-auto w-full"
                priority
              />
              {isRegistration ? (
                <div className="absolute -bottom-2 right-8 w-[180px] rounded-lg bg-white p-4 shadow-[0_18px_45px_rgba(17,32,50,0.14)]">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                      <UserPlus className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink">Account setup</p>
                      <p className="text-xs text-muted">Ready in a few steps</p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[448px]">
          <div className="rounded-[32px] border border-white/70 bg-white p-6 shadow-[0_24px_60px_rgba(17,32,50,0.12)] sm:p-8">

            <div className="text-center">
              <h2 className="mt-2 text-[28px] font-semibold leading-tight text-ink">{content.title}</h2>
            </div>

            <button
              type="button"
              disabled
              className="mt-8 flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-line bg-surface-muted text-sm font-medium text-ink opacity-70"
            >
              <Sparkles className="h-4 w-4 text-accent" />
              {isRegistration ? "Register with Google" : "Sign in with Google"} (Soon)
            </button>

            <div className="my-8 flex items-center gap-4">
              <span className="h-px flex-1 bg-line" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-subtle">Or</span>
              <span className="h-px flex-1 bg-line" />
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {isRegistration ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <AuthInput
                    label="First Name"
                    type="text"
                    placeholder="John"
                    icon={User}
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                  />
                  <AuthInput
                    label="Last Name"
                    type="text"
                    placeholder="Doe"
                    icon={User}
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                  />
                </div>
              ) : null}

              <AuthInput
                label="Email"
                type="email"
                placeholder="you@example.com"
                icon={Mail}
                name="email"
                value={form.email}
                onChange={handleChange}
              />
              <AuthInput
                label="Password"
                type="password"
                placeholder="Enter your password"
                icon={LockKeyhole}
                name="password"
                value={form.password}
                onChange={handleChange}
              />
              {isRegistration ? (
                <AuthInput
                  label="Repeat Password"
                  type="password"
                  placeholder="Repeat your password"
                  icon={ShieldCheck}
                  name="repeatPassword"
                  value={form.repeatPassword}
                  onChange={handleChange}
                />
              ) : null}

              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <div className={`flex gap-3 text-sm ${isRegistration ? "items-start" : "items-center justify-between"}`}>
                <label className="flex cursor-pointer items-center gap-3 text-muted">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded border-line text-accent focus:ring-accent/20"
                  />
                  <span>{isRegistration ? "I agree to terms & conditions" : "Remember me"}</span>
                </label>
                {!isRegistration ? (
                  <span className="font-medium text-subtle">JWT session enabled</span>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !isReady}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-accent text-sm font-semibold text-white transition hover:bg-accent-strong disabled:cursor-not-allowed disabled:bg-accent/60"
              >
                {isSubmitting ? "Please wait..." : content.submitLabel}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-muted">
              {content.switchCopy}{" "}
              <Link href={content.switchHref} className="font-semibold text-accent transition hover:text-accent-strong">
                {content.switchLabel}
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
