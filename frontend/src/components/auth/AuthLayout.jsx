import './AuthLayout.css'

export function AuthLayout({
  eyebrow = 'Đặt xe cùng Carento',
  title,
  description,
  hideIntro = false,
  children,
}) {
  return (
    <main className="auth-shell">
      <div className="auth-shell__visual" aria-hidden="true">
        <img src="/background2.png" alt="" />
      </div>

      <section className="auth-shell__content" aria-labelledby="auth-title">
        <header className="auth-shell__topbar">
          <a className="auth-shell__logo" href="/" aria-label="Carento">
            <img src="/logo.png" alt="" aria-hidden="true" />
            <span>Carento</span>
          </a>
          <a className="auth-shell__home-link" href="/">
            Về trang chủ
          </a>
        </header>

        <div className="auth-shell__body">
          <div className="auth-shell__statement">
            <p>{eyebrow}</p>
            <h1>Sẵn sàng cho hành trình của bạn.</h1>
          </div>

          <div className="auth-shell__panel">
            {!hideIntro && (title || description) && (
              <div className="auth-shell__intro">
                <h2 id="auth-title">{title}</h2>
                <p>{description}</p>
              </div>
            )}
            {children}
          </div>
        </div>
      </section>
    </main>
  )
}
