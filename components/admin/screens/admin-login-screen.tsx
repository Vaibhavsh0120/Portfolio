"use client";

import { type ComponentType, type InputHTMLAttributes, type SVGProps, useState, useRef } from "react";

import type { AdminCmsController, StatusState } from "@/components/admin/admin-types";
import ThemeToggle from "@/components/theme-toggle";
import { adminEmails } from "@/lib/firebase/client";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300;1,9..40,400&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .alc-root {
    font-family: 'DM Sans', sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: #f4f4f5;
    background-image:
      radial-gradient(circle at 20% 20%, rgba(15,15,15,0.06) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(15,15,15,0.04) 0%, transparent 50%);
    padding: 0;
  }

  /* ─── Main Container ─── */
  .alc-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    background: #fff;
    border-radius: 0;
    box-shadow: none;
    overflow: hidden;
  }

  /* ─── Form Boxes ─── */
  .alc-form-box {
    position: absolute;
    top: 0;
    right: 0;
    width: 50%;
    height: 100%;
    background: #fff;
    display: flex;
    align-items: center;
    color: #1a1a1a;
    padding: 44px 40px;
    z-index: 1;
    transition: right 0.6s ease-in-out 1.2s, visibility 0s 1s;
  }

  .alc-container.active .alc-form-box {
    right: 50%;
  }

  .alc-form-box.otp {
    visibility: hidden;
  }

  .alc-container.active .alc-form-box.otp {
    visibility: visible;
  }

  .alc-container.active .alc-form-box.password {
    visibility: hidden;
  }

  .alc-form-inner {
    width: 100%;
    max-width: 380px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
  }

  /* ─── Form Typography ─── */
  .alc-eyebrow {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #999;
    margin-bottom: 12px;
    text-align: center;
  }

  .alc-form-box h2 {
    font-size: 36px;
    font-weight: 700;
    color: #0f0f0f;
    line-height: 1.2;
    margin-bottom: 8px;
    letter-spacing: -0.02em;
    text-align: center;
  }

  .alc-form-box .alc-subtitle {
    font-size: 16px;
    color: #888;
    margin-bottom: 32px;
    line-height: 1.5;
    text-align: center;
  }

  /* ─── Input ─── */
  .alc-field {
    margin-bottom: 16px;
    text-align: left;
  }

  .alc-field label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #555;
    margin-bottom: 8px;
    letter-spacing: 0.02em;
  }

  .alc-input-wrap {
    position: relative;
  }

  .alc-input-wrap input {
    width: 100%;
    height: 52px;
    padding: 0 44px 0 16px;
    background: #f5f5f5;
    border: 1.5px solid #ebebeb;
    border-radius: 12px;
    font-size: 16px;
    font-family: 'DM Sans', sans-serif;
    color: #0f0f0f;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }

  .alc-input-wrap input::placeholder {
    color: #bbb;
    font-weight: 400;
  }

  .alc-input-wrap input:focus {
    border-color: #0f0f0f;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(15,15,15,0.07);
  }

  .alc-input-icon {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    color: #bbb;
    pointer-events: none;
  }

  /* ─── OTP code input ─── */
  .alc-otp-boxes {
    display: flex;
    gap: 8px;
    justify-content: center;
    margin-bottom: 24px;
  }

  .alc-otp-box {
    width: 52px;
    height: 64px;
    text-align: center;
    font-family: 'DM Mono', monospace;
    font-size: 28px;
    font-weight: 500;
    background: #f5f5f5;
    border: 1.5px solid #ebebeb;
    border-radius: 12px;
    color: #0f0f0f;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s, transform 0.1s;
  }

  .alc-otp-box::placeholder {
    color: #bbb;
  }

  .alc-otp-box:focus {
    border-color: #0f0f0f;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(15,15,15,0.07);
    transform: translateY(-2px);
  }

  /* ─── OTP panel label ─── */
  .alc-form-box.otp .alc-field label {
    color: #555;
  }

  /* ─── Buttons ─── */
  .alc-btn {
    width: 100%;
    height: 52px;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
    letter-spacing: 0.01em;
  }

  .alc-btn:active {
    transform: scale(0.98);
  }

  /* Primary dark button (password panel) */
  .alc-btn-primary {
    background: #0f0f0f;
    color: #fff;
    margin-top: 8px;
    box-shadow: 0 4px 14px rgba(0,0,0,0.15);
  }

  .alc-btn-primary:hover:not(:disabled) {
    background: #2a2a2a;
    box-shadow: 0 6px 20px rgba(0,0,0,0.2);
  }

  .alc-btn-primary:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  /* Ghost button (OTP panel — send code) */
  .alc-btn-ghost {
    background: #f5f5f5;
    color: #0f0f0f;
    border: 1.5px solid #ebebeb;
  }

  .alc-btn-ghost:hover:not(:disabled) {
    background: #ebebeb;
  }

  /* Dark verify button (OTP panel) */
  .alc-btn-white {
    background: #0f0f0f;
    color: #fff;
    box-shadow: 0 4px 14px rgba(0,0,0,0.15);
  }

  .alc-btn-white:hover:not(:disabled) {
    background: #2a2a2a;
  }

  .alc-btn-white:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .alc-btn-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-top: 8px;
  }

  /* ─── Toggle (Sliding Panel) ─── */
  .alc-toggle-box {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .alc-toggle-box::before {
    content: '';
    position: absolute;
    left: -250%;
    width: 300%;
    height: 100%;
    background: #0f0f0f;
    border-radius: 150px;
    z-index: 2;
    transition: left 1.8s ease-in-out;
    pointer-events: none;
  }

  .alc-container.active .alc-toggle-box::before {
    left: 50%;
  }

  .alc-toggle-panel {
    position: absolute;
    width: 50%;
    height: 100%;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    z-index: 3;
    padding: 40px;
    transition: 0.6s ease-in-out;
    pointer-events: auto;
  }

  .alc-toggle-panel.left {
    left: 0;
    transition-delay: 1.2s;
  }

  .alc-container.active .alc-toggle-panel.left {
    left: -50%;
    transition-delay: 0.6s;
  }

  .alc-toggle-panel.right {
    right: -50%;
    transition-delay: 0.6s;
  }

  .alc-container.active .alc-toggle-panel.right {
    right: 0;
    transition-delay: 1.2s;
  }

  .alc-toggle-panel h3 {
    font-size: 36px;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin-bottom: 12px;
  }

  .alc-toggle-panel p {
    font-size: 16px;
    color: rgba(255,255,255,0.65);
    margin-bottom: 36px;
    line-height: 1.6;
    max-width: 300px;
  }

  .alc-toggle-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 52px;
    padding: 0 36px;
    background: transparent;
    border: 1.5px solid rgba(255,255,255,0.25);
    border-radius: 100px;
    color: #fff;
    font-size: 16px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    cursor: pointer;
    letter-spacing: 0.02em;
    transition: all 0.3s ease;
  }

  .alc-toggle-btn:hover {
    background: #fff;
    color: #0f0f0f;
    border-color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  }

  .alc-toggle-btn:active {
    transform: translateY(0);
  }

  /* ─── Badge ─── */
  .alc-badge-wrap {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .alc-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 100px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.04em;
    margin-bottom: 24px;
  }

  .alc-badge-dark {
    background: #f5f5f5;
    border: 1px solid #e8e8e8;
    color: #666;
  }

  .alc-badge-light {
    background: #f5f5f5;
    border: 1px solid #e8e8e8;
    color: #666;
  }

  /* ─── Status Banner ─── */
  .alc-status {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 12px 40px;
    font-size: 12.5px;
    font-weight: 500;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 8px;
    border-top: 1px solid rgba(0,0,0,0.07);
    transition: background 0.3s;
  }

  .alc-status.idle {
    background: #fafafa;
    color: #999;
  }

  .alc-status.error {
    background: #fff5f5;
    color: #c0392b;
    border-top-color: #ffd5d5;
  }

  .alc-status.success {
    background: #f0fff4;
    color: #27ae60;
    border-top-color: #c3f0cc;
  }

  .alc-status.info {
    background: #eff6ff;
    color: #2563eb;
    border-top-color: #bfdbfe;
  }

  .alc-status.loading {
    background: #fafafa;
    color: #888;
  }

  /* ─── Forgot Password ─── */
  .alc-forgot {
    text-align: right;
    margin: -8px 0 16px;
  }

  .alc-forgot a {
    font-size: 12px;
    color: #aaa;
    text-decoration: none;
    transition: color 0.2s;
  }

  .alc-forgot a:hover {
    color: #0f0f0f;
  }

  /* ─── OTP panel: light theme base ─── */
  .alc-form-box.otp {
    background: #fff;
    color: #1a1a1a;
  }

  .alc-form-box.otp .alc-eyebrow {
    color: #999;
  }

  .alc-form-box.otp h2 {
    color: #0f0f0f;
  }

  .alc-form-box.otp .alc-subtitle {
    color: #888;
  }

  /* ─── Dark mode ─── */
  .dark .alc-root {
    background: #050505;
    background-image:
      radial-gradient(circle at 20% 20%, rgba(255,255,255,0.035) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(255,255,255,0.025) 0%, transparent 50%);
  }

  .dark .alc-container {
    background: #0f0f0f;
    box-shadow: none;
  }

  .dark .alc-form-box,
  .dark .alc-form-box.otp {
    background: #0f0f0f;
    color: #f5f5f5;
  }

  .dark .alc-form-box h2,
  .dark .alc-form-box.otp h2 {
    color: #f5f5f5;
  }

  .dark .alc-form-box .alc-subtitle,
  .dark .alc-form-box.otp .alc-subtitle {
    color: rgba(245,245,245,0.58);
  }

  .dark .alc-eyebrow,
  .dark .alc-form-box.otp .alc-eyebrow {
    color: rgba(245,245,245,0.42);
  }

  .dark .alc-field label,
  .dark .alc-form-box.otp .alc-field label {
    color: rgba(245,245,245,0.66);
  }

  .dark .alc-input-wrap input {
    background: #171717;
    border-color: #2f2f2f;
    color: #f5f5f5;
  }

  .dark .alc-input-wrap input::placeholder {
    color: rgba(245,245,245,0.34);
  }

  .dark .alc-input-wrap input:focus {
    background: #111;
    border-color: #737373;
    box-shadow: 0 0 0 3px rgba(255,255,255,0.06);
  }

  .dark .alc-otp-box {
    background: #171717;
    border-color: #2f2f2f;
    color: #f5f5f5;
  }

  .dark .alc-otp-box::placeholder {
    color: rgba(245,245,245,0.34);
  }

  .dark .alc-otp-box:focus {
    background: #111;
    border-color: #737373;
    box-shadow: 0 0 0 3px rgba(255,255,255,0.06);
  }

  .dark .alc-input-icon {
    color: rgba(245,245,245,0.4);
  }

  .dark .alc-badge-light,
  .dark .alc-badge-dark {
    background: #171717;
    border-color: #2f2f2f;
    color: rgba(245,245,245,0.72);
  }

  .dark .alc-btn-primary,
  .dark .alc-btn-white {
    background: #f5f5f5;
    border: 1.5px solid #e8e8e8;
    color: #0f0f0f;
    box-shadow: none;
  }

  .dark .alc-btn-primary:hover:not(:disabled),
  .dark .alc-btn-white:hover:not(:disabled) {
    background: #e0e0e0;
  }

  .dark .alc-btn-ghost {
    background: #171717;
    border: 1.5px solid #2f2f2f;
    color: #f5f5f5;
    box-shadow: none;
  }

  .dark .alc-btn-ghost:hover:not(:disabled) {
    background: #242424;
  }

  .dark .alc-toggle-box::before {
    background: #050505;
  }

  .dark .alc-toggle-panel {
    color: #f5f5f5;
  }

  .dark .alc-toggle-panel p {
    color: rgba(245,245,245,0.58);
  }

  .dark .alc-toggle-btn {
    border-color: rgba(245,245,245,0.26);
    color: #f5f5f5;
  }

  .dark .alc-status.idle,
  .dark .alc-status.loading {
    background: #111;
    color: rgba(245,245,245,0.58);
    border-top-color: #262626;
  }

  .dark .alc-status.error {
    background: #210909;
    color: #fca5a5;
    border-top-color: #451a1a;
  }

  .dark .alc-status.success {
    background: #052e16;
    color: #86efac;
    border-top-color: #14532d;
  }

  .dark .alc-status.info {
    background: #082f49;
    color: #7dd3fc;
    border-top-color: #075985;
  }

  /* ─── Loader spinner ─── */
  @keyframes alc-spin {
    to { transform: rotate(360deg); }
  }

  .alc-spinner {
    width: 15px;
    height: 15px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: alc-spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  /* ─── Responsive ─── */
  @media (max-width: 680px) {
    .alc-container {
      height: 100dvh;
      width: 100%;
      border-radius: 0;
    }

    .alc-form-box {
      bottom: 0;
      top: auto;
      right: 0;
      width: 100%;
      height: 70%;
      transition: bottom 0.6s ease-in-out 1.2s, visibility 0s 1s;
    }

    .alc-container.active .alc-form-box {
      right: 0;
      bottom: 30%;
    }

    .alc-form-box.otp {
      transition: bottom 0.6s ease-in-out 1.2s, visibility 0s 1s;
    }

    .alc-container.active .alc-form-box.otp {
      bottom: 30%;
    }

    .alc-container.active .alc-form-box.password {
      visibility: hidden;
    }

    .alc-toggle-box::before {
      left: 0;
      top: -270%;
      width: 100%;
      height: 300%;
      border-radius: 20vw;
      transition: top 1.8s ease-in-out;
    }

    .alc-container.active .alc-toggle-box::before {
      left: 0;
      top: 70%;
    }

    .alc-toggle-panel {
      width: 100%;
      height: 30%;
    }

    .alc-toggle-panel.left {
      top: 0;
      left: 0;
      transition-delay: 1.2s;
    }

    .alc-container.active .alc-toggle-panel.left {
      left: 0;
      top: -30%;
      transition-delay: 0.6s;
    }

    .alc-toggle-panel.right {
      right: 0;
      bottom: -30%;
      top: auto;
      left: auto;
      transition: bottom 0.6s ease-in-out;
      transition-delay: 0.6s;
    }

    .alc-container.active .alc-toggle-panel.right {
      bottom: 0;
      transition-delay: 1.2s;
    }

    .alc-status {
      padding: 10px 20px;
    }
  }
`;

type IconProps = SVGProps<SVGSVGElement>;
type LoginStatus = StatusState | { type: "loading"; message: string };
type InputMode = InputHTMLAttributes<HTMLInputElement>["inputMode"];

type InputFieldProps = {
  label?: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  icon?: ComponentType<IconProps>;
  autoComplete?: string;
  inputMode?: InputMode;
  maxLength?: number;
  className?: string;
};

type AdminLoginFormProps = {
  otpCode?: string;
  onOtpChange?: (value: string) => void;
  onSendCode?: () => void;
  onVerifyOtp?: () => void;
  otpRequested?: boolean;
  requestingOtp?: boolean;
  verifyingOtp?: boolean;
  adminEmail?: string;
  loginEmail?: string;
  onEmailChange?: (value: string) => void;
  loginPassword?: string;
  onPasswordChange?: (value: string) => void;
  onPasswordSignIn?: () => void;
  signingIn?: boolean;
  status?: LoginStatus;
  onForgotPassword?: () => void;
};

// ─── SVG Icons (inline, no external dependency) ─────────────────────────────

function IconMail({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

export function AdminLoginScreen({ cms }: { cms: AdminCmsController }) {
  return (
    <AdminLoginForm
      adminEmail={adminEmails[0] ?? "No admin email configured"}
      loginEmail={cms.loginEmail}
      onEmailChange={cms.setLoginEmail}
      loginPassword={cms.loginPassword}
      onPasswordChange={cms.setLoginPassword}
      onPasswordSignIn={() => {
        void cms.handleEmailSignIn();
      }}
      otpCode={cms.otpCode}
      onOtpChange={(value) => cms.setOtpCode(value.replace(/\D/g, "").slice(0, 6))}
      onSendCode={() => {
        void cms.handleRequestOtp();
      }}
      onVerifyOtp={() => {
        if (cms.otpCode.length === 6) {
          void cms.handleVerifyOtp();
        }
      }}
      otpRequested={cms.otpRequested}
      requestingOtp={cms.requestingOtp}
      verifyingOtp={cms.verifyingOtp}
      status={cms.status}
    />
  );
}

function IconKey({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4" />
      <path d="m21 2-9.6 9.6" />
      <circle cx="7.5" cy="15.5" r="5.5" />
    </svg>
  );
}

function IconShield({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function IconHash({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" x2="20" y1="9" y2="9" />
      <line x1="4" x2="20" y1="15" y2="15" />
      <line x1="10" x2="8" y1="3" y2="21" />
      <line x1="16" x2="14" y1="3" y2="21" />
    </svg>
  );
}

function IconCheck({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function IconArrow({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon: Icon,
  autoComplete,
  inputMode,
  maxLength,
  className = "",
}: InputFieldProps) {
  return (
    <div className={`alc-field ${className}`}>
      {label && <label>{label}</label>}
      <div className="alc-input-wrap">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
        />
        {Icon && <Icon className="alc-input-icon" />}
      </div>
    </div>
  );
}

function OtpCodeInput({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value;
    if (/[^0-9]/.test(val) && val !== "") return;

    // Detect if the user pasted a long string
    if (val.length > 1) {
      // If the value length increased by more than 1, it's a paste
      if (val.length - (chars[index] !== " " ? 1 : 0) > 1) {
        const pasted = val.replace(/\D/g, "").slice(0, 6);
        onChange(pasted);
        if (pasted.length === 6) {
          inputs.current[5]?.focus();
          setTimeout(() => document.getElementById("verify-otp-btn")?.click(), 100);
        } else {
          inputs.current[pasted.length]?.focus();
        }
        return;
      }
    }

    const singleChar = val.slice(-1);
    const newValue = value.padEnd(6, " ").split("");
    newValue[index] = singleChar === "" ? " " : singleChar;
    
    const nextVal = newValue.join("").trimEnd();
    onChange(nextVal);

    if (singleChar && index < 5) {
      inputs.current[index + 1]?.focus();
    }
    
    if (nextVal.length === 6 && singleChar) {
      setTimeout(() => document.getElementById("verify-otp-btn")?.click(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!value[index] && index > 0) {
        inputs.current[index - 1]?.focus();
        const newValue = value.split("");
        newValue[index - 1] = "";
        onChange(newValue.join(""));
      } else if (value[index]) {
        const newValue = value.split("");
        newValue[index] = "";
        onChange(newValue.join(""));
      }
    }
  };

  const chars = value.padEnd(6, " ").split("");

  return (
    <div className="alc-otp-boxes">
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <input
          key={index}
          ref={(el) => { inputs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={chars[index] !== " " ? chars[index] : ""}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="alc-otp-box"
          placeholder="-"
        />
      ))}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function AdminLoginForm({
  // OTP props
  otpCode = "",
  onOtpChange,
  onSendCode,
  onVerifyOtp,
  otpRequested = false,
  requestingOtp = false,
  verifyingOtp = false,
  adminEmail = "admin@example.com",

  // Password props
  loginEmail = "",
  onEmailChange,
  loginPassword = "",
  onPasswordChange,
  onPasswordSignIn,
  signingIn = false,

  // Status
  status = { type: "idle", message: "" },

  // Forgot password
  onForgotPassword,
}: AdminLoginFormProps) {
  const [active, setActive] = useState(false);
  const canPasswordSubmit = loginEmail.trim().length > 0 && loginPassword.length >= 6;

  return (
    <>
      <style>{styles}</style>
      <ThemeToggle />
      <div className="alc-root">
        <div className={`alc-container${active ? " active" : ""}`}>

          {/* ── OTP Form (left, hidden by default) ─────────────────── */}
          <div className="alc-form-box otp">
            <div className="alc-form-inner">
              <div className="alc-badge-wrap">
                <div className="alc-badge alc-badge-dark">
                  <IconHash style={{ width: 11, height: 11 }} />
                  One-Time Code
                </div>
              </div>
              <p className="alc-eyebrow">Passwordless</p>
              <h2>Verify with a code.</h2>
              <p className="alc-subtitle">
                A 6-digit code will be sent to<br />
                <span style={{ color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{adminEmail}</span>
              </p>

              <div className="alc-field" style={{ textAlign: "center" }}>
                <label>Verification Code</label>
                <OtpCodeInput 
                  value={otpCode}
                  onChange={onOtpChange || (() => {})}
                />
              </div>

              <div className="alc-btn-row">
                <button
                  className="alc-btn alc-btn-ghost"
                  type="button"
                  onClick={onSendCode}
                  disabled={requestingOtp}
                >
                  {requestingOtp
                    ? <span className="alc-spinner" />
                    : <IconMail style={{ width: 14, height: 14 }} />}
                  {otpRequested ? "Resend" : "Send Code"}
                </button>
                <button
                  id="verify-otp-btn"
                  className="alc-btn alc-btn-white"
                  type="button"
                  onClick={onVerifyOtp}
                  disabled={verifyingOtp || otpCode.length !== 6}
                >
                  {verifyingOtp
                    ? <span className="alc-spinner" style={{ borderColor: "#0f0f0f", borderTopColor: "transparent" }} />
                    : <IconCheck style={{ width: 14, height: 14 }} />}
                  Verify
                </button>
              </div>
            </div>
          </div>

          {/* ── Password Form (right, shown by default) ─────────────── */}
          <div className="alc-form-box password">
            <div className="alc-form-inner">
              <div className="alc-badge-wrap">
                <div className="alc-badge alc-badge-light">
                  <IconShield style={{ width: 11, height: 11 }} />
                  Admin Access
                </div>
              </div>
              <p className="alc-eyebrow">Secure Login</p>
              <h2>Sign in with your password.</h2>
              <p className="alc-subtitle">
                Access the admin dashboard using your registered email and password.
              </p>

              <InputField
                label="Email"
                type="email"
                placeholder="admin@example.com"
                value={loginEmail}
                onChange={onEmailChange || (() => {})}
                icon={IconMail}
                autoComplete="email"
                inputMode="email"
              />
              <InputField
                label="Password"
                type="password"
                placeholder="Min. 6 characters"
                value={loginPassword}
                onChange={onPasswordChange || (() => {})}
                icon={IconKey}
                autoComplete="current-password"
              />

              {onForgotPassword && (
                <div className="alc-forgot">
                  <a href="#" onClick={(e) => { e.preventDefault(); onForgotPassword?.(); }}>
                    Forgot password?
                  </a>
                </div>
              )}

              <button
                className="alc-btn alc-btn-primary"
                type="button"
                onClick={onPasswordSignIn}
                disabled={!canPasswordSubmit || signingIn}
              >
                {signingIn
                  ? <span className="alc-spinner" />
                  : <IconShield style={{ width: 14, height: 14 }} />}
                Sign In
                {!signingIn && <IconArrow style={{ width: 14, height: 14 }} />}
              </button>
            </div>
          </div>

          {/* ── Toggle Panels (sliding overlay) ──────────────────────── */}
          <div className="alc-toggle-box">
            {/* Left panel — shown when password form is active (default) */}
            <div className="alc-toggle-panel left">
              <p className="alc-eyebrow" style={{ color: "rgba(255,255,255,0.4)" }}>Fast & Secure</p>
              <h3>No password?</h3>
              <p>Use a one-time code sent directly to your configured admin email.</p>
              <button className="alc-toggle-btn" type="button" onClick={() => setActive(true)}>
                Use OTP instead
              </button>
            </div>

            {/* Right panel — shown when OTP form is active */}
            <div className="alc-toggle-panel right">
              <p className="alc-eyebrow" style={{ color: "rgba(255,255,255,0.4)" }}>Standard Login</p>
              <h3>Have a password?</h3>
              <p>Sign in directly with your admin email and registered password.</p>
              <button className="alc-toggle-btn" type="button" onClick={() => setActive(false)}>
                Use Password
              </button>
            </div>
          </div>

          {/* ── Status Bar ───────────────────────────────────────────── */}
          {status.message && (
            <div className={`alc-status ${status.type || "idle"}`}>
              {status.message}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
