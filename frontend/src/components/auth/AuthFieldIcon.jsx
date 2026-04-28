const icons = {
  user: (
    <>
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  contact: (
    <>
      <path d="M22 16.92v2a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 3.2 2 2 0 0 1 4.11 1h2a2 2 0 0 1 2 1.72c.13.96.35 1.9.66 2.81a2 2 0 0 1-.45 2.11L7.1 8.86a16 16 0 0 0 6 6l1.22-1.22a2 2 0 0 1 2.11-.45c.91.31 1.85.53 2.81.66A2 2 0 0 1 22 15.85z" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ),
  confirm: (
    <>
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 7.7-1.53" />
      <path d="m15 7 1.7 1.7L21 4.4" />
    </>
  ),
}

export function AuthFieldIcon({ type = 'contact' }) {
  return (
    <span className="auth-form__icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        {icons[type] ?? icons.contact}
      </svg>
    </span>
  )
}
