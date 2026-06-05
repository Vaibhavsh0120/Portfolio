"use client"

import { CheckCircle2, Mail, ShieldCheck, Loader2 } from "lucide-react"

import ThemeToggle from "@/components/theme-toggle"
import type { AdminCmsController } from "@/components/admin/admin-types"
import { StatusBanner, TextField, itemClassName, panelClassName } from "@/components/admin/admin-ui"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { adminEmails } from "@/lib/firebase/client"

export function AdminLoginScreen({ cms }: { cms: AdminCmsController }) {
  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-10 dark:bg-neutral-950">
      <ThemeToggle />
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <Card className={panelClassName}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <ShieldCheck className="h-6 w-6" />
              Admin CMS
            </CardTitle>
            <CardDescription>Secure access for portfolio content, media uploads, and resume versions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-neutral-600 dark:text-neutral-400">
            <div className={itemClassName}>
              <p className="font-medium text-neutral-900 dark:text-neutral-100">Configured Admin</p>
              <p className="mt-1">{adminEmails[0] ?? "No admin email configured"}</p>
            </div>
            <p>
              Use Firebase password login or request a one-time code. Both methods still pass through the admin email
              allowlist.
            </p>
          </CardContent>
        </Card>

        <Card className={panelClassName}>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Choose the auth path that fits your current Firebase setup.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <StatusBanner status={cms.status} />

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Email and Password</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-500">For existing Firebase Auth users.</p>
                </div>
                <TextField label="Email" value={cms.loginEmail} onChange={cms.setLoginEmail} type="email" placeholder="admin@example.com" />
                <TextField
                  label="Password"
                  value={cms.loginPassword}
                  onChange={cms.setLoginPassword}
                  type="password"
                  placeholder="Minimum 6 characters"
                />
                <Button onClick={cms.handleEmailSignIn} className="w-full">
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="font-medium">One-Time Code</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-500">Sent to the primary admin email.</p>
                </div>
                <TextField
                  label="Verification Code"
                  value={cms.otpCode}
                  onChange={(value) => cms.setOtpCode(value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="6-digit code"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button onClick={cms.handleRequestOtp} variant="outline" disabled={cms.requestingOtp}>
                    {cms.requestingOtp ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                    {cms.otpRequested ? "Resend" : "Send"}
                  </Button>
                  <Button onClick={cms.handleVerifyOtp} disabled={cms.verifyingOtp || cms.otpCode.length !== 6}>
                    {cms.verifyingOtp ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                    Verify
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
