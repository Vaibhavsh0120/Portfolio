"use client"

import { type FormEvent } from "react"
import { ArrowRight, CheckCircle2, KeyRound, Loader2, LockKeyhole, Mail, ShieldCheck } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import ThemeToggle from "@/components/theme-toggle"
import type { AdminCmsController } from "@/components/admin/admin-types"
import { StatusBanner } from "@/components/admin/admin-ui"
import { Button } from "@/components/ui/button"
import { adminEmails } from "@/lib/firebase/client"
import { cn } from "@/lib/utils"

type LoginInputProps = {
  icon: LucideIcon
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  type?: string
  autoComplete?: string
  inputMode?: "email" | "numeric" | "text"
  maxLength?: number
  className?: string
}

function LoginInput({
  icon: Icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
  inputMode,
  maxLength,
  className,
}: LoginInputProps) {
  return (
    <label className={cn("block space-y-2", className)}>
      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</span>
      <span className="relative block">
        <input
          className="h-12 w-full rounded-lg border border-neutral-200 bg-neutral-50/80 px-4 pr-12 text-sm text-neutral-950 outline-none transition focus:border-neutral-500 focus:bg-white focus:ring-2 focus:ring-neutral-200 dark:border-neutral-800 dark:bg-neutral-950/70 dark:text-white dark:focus:border-neutral-500 dark:focus:bg-neutral-950 dark:focus:ring-neutral-800"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
        />
        <Icon className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 dark:text-neutral-500" />
      </span>
    </label>
  )
}

function MethodBadge({ icon: Icon, children }: { icon: LucideIcon; children: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/85 px-3 py-1 text-xs font-medium text-neutral-600 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/75 dark:text-neutral-400">
      <Icon className="h-3.5 w-3.5" />
      {children}
    </span>
  )
}

function DarkBadge({ icon: Icon, children }: { icon: LucideIcon; children: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-neutral-200 backdrop-blur">
      <Icon className="h-3.5 w-3.5" />
      {children}
    </span>
  )
}

export function AdminLoginScreen({ cms }: { cms: AdminCmsController }) {
  const adminEmail = adminEmails[0] ?? "No admin email configured"
  const canPasswordSignIn = cms.loginEmail.trim().length > 0 && cms.loginPassword.length > 0

  function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void cms.handleEmailSignIn()
  }

  function handleOtpSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (cms.otpCode.length === 6) {
      void cms.handleVerifyOtp()
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-100 px-4 py-8 text-neutral-950 dark:bg-neutral-950 dark:text-white sm:px-6 lg:flex lg:items-center lg:py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,23,42,0.10),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(115,115,115,0.16),transparent_34%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_35%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.55)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.55)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35 dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] dark:opacity-100" />
      <ThemeToggle />

      <section className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-lg border border-white/80 bg-white/90 shadow-2xl shadow-neutral-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-neutral-950/90 dark:shadow-black/45">
        <div className="grid min-h-[680px] lg:min-h-[620px] lg:grid-cols-2">
          <div className="relative flex flex-col justify-center overflow-hidden bg-neutral-950 px-6 py-10 text-white dark:bg-neutral-900 sm:px-10 lg:px-14">
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full border border-white/10 bg-white/[0.03]" />
            <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full border border-white/10 bg-white/[0.04]" />

            <div className="relative">
              <div className="mb-8 flex flex-wrap items-center gap-3">
                <DarkBadge icon={Mail}>One-Time OTP</DarkBadge>
                <DarkBadge icon={CheckCircle2}>Allowlist Protected</DarkBadge>
              </div>

              <div className="max-w-md">
                <p className="text-sm font-medium uppercase tracking-[0.28em] text-neutral-400">No password nearby</p>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Use a one-time verification code.
                </h1>
                <p className="mt-4 text-sm leading-6 text-neutral-300">
                  Codes are sent to the primary configured admin email and still create a Firebase admin session.
                </p>
              </div>

              <div className="mt-7 rounded-lg border border-white/10 bg-white/[0.06] p-4 text-sm text-neutral-300">
                <p className="font-medium text-white">Configured admin</p>
                <p className="mt-1 break-words">{adminEmail}</p>
              </div>

              <form className="mt-6 max-w-md space-y-5" onSubmit={handleOtpSubmit}>
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-neutral-200">Verification Code</span>
                  <span className="relative block">
                    <input
                      className="h-12 w-full rounded-lg border border-white/15 bg-white/10 px-4 pr-12 text-center text-lg font-semibold tracking-[0.35em] text-white outline-none transition placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-neutral-500 focus:border-white/40 focus:bg-white/15 focus:ring-2 focus:ring-white/10"
                      value={cms.otpCode}
                      onChange={(event) => cms.setOtpCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="6-digit code"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                    />
                    <KeyRound className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  </span>
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Button
                    type="button"
                    onClick={cms.handleRequestOtp}
                    variant="outline"
                    disabled={cms.requestingOtp}
                    className="h-12 rounded-lg border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
                  >
                    {cms.requestingOtp ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                    {cms.otpRequested ? "Resend Code" : "Send Code"}
                  </Button>
                  <Button
                    type="submit"
                    disabled={cms.verifyingOtp || cms.otpCode.length !== 6}
                    className="h-12 rounded-lg bg-white text-neutral-950 hover:bg-neutral-200"
                  >
                    {cms.verifyingOtp ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                    )}
                    Verify
                  </Button>
                </div>
              </form>
            </div>
          </div>

          <div className="relative flex flex-col justify-center border-t border-neutral-200 px-6 py-10 sm:px-10 lg:border-l lg:border-t-0 lg:px-14">
            <div className="mb-8 flex flex-wrap items-center gap-3">
              <MethodBadge icon={ShieldCheck}>Admin CMS</MethodBadge>
              <MethodBadge icon={LockKeyhole}>Password Login</MethodBadge>
            </div>

            <div className="max-w-md">
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-neutral-500 dark:text-neutral-400">
                Portfolio access
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-950 dark:text-white sm:text-4xl">
                Sign in with your admin password.
              </h2>
              <p className="mt-4 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                Use the Firebase Auth account that is allowed to manage portfolio content, uploads, and resume versions.
              </p>
            </div>

            <form className="mt-8 max-w-md space-y-5" onSubmit={handlePasswordSubmit}>
              <LoginInput
                icon={Mail}
                label="Email"
                value={cms.loginEmail}
                onChange={cms.setLoginEmail}
                type="email"
                placeholder="admin@example.com"
                autoComplete="email"
                inputMode="email"
              />
              <LoginInput
                icon={KeyRound}
                label="Password"
                value={cms.loginPassword}
                onChange={cms.setLoginPassword}
                type="password"
                placeholder="Minimum 6 characters"
                autoComplete="current-password"
              />

              <Button
                type="submit"
                disabled={!canPasswordSignIn}
                className="h-12 w-full rounded-lg bg-neutral-950 text-white shadow-lg shadow-neutral-900/10 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
              >
                <ShieldCheck className="mr-2 h-4 w-4" />
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-neutral-200 bg-white/85 px-6 py-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/85 sm:px-10 lg:px-14">
          <StatusBanner status={cms.status} />
          {cms.status.type === "idle" ? (
            <p className="text-sm text-neutral-500 dark:text-neutral-500">
              Choose one-time OTP or password login. The password form opens on the right by default.
            </p>
          ) : null}
        </div>
      </section>
    </main>
  )
}
