function parseAdminEmails(source: string | undefined) {
  return (source ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

export const adminEmails = Array.from(
  new Set(
    [
      ...parseAdminEmails(process.env.ADMIN_EMAILS),
      ...parseAdminEmails(process.env.NEXT_PUBLIC_ADMIN_EMAILS),
      ...parseAdminEmails(process.env.EMAIL_USER),
    ].filter(Boolean)
  )
)

export function isAuthorizedAdminEmail(email: string | null | undefined) {
  if (!email) {
    return false
  }

  return adminEmails.includes(email.trim().toLowerCase())
}

export function getOtpRecipientEmail(email: string) {
  const normalized = email.trim().toLowerCase()

  if (adminEmails.includes(normalized)) {
    return normalized
  }

  return process.env.EMAIL_USER?.trim().toLowerCase() ?? normalized
}
