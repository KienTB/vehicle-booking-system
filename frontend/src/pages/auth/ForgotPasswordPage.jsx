import { useState } from 'react'
import { AuthFieldIcon } from '../../components/auth/AuthFieldIcon'
import './AuthForm.css'

const initialValues = {
  contact: '',
}

export function ForgotPasswordPage() {
  const [values, setValues] = useState(initialValues)
  const [isLoading, setIsLoading] = useState(false)
  const [formMessage, setFormMessage] = useState('')

  function handleChange(event) {
    const { name, value } = event.target

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setIsLoading(true)
    setFormMessage('')

    // Replace with real API call
    setTimeout(() => {
      setIsLoading(false)
      window.location.href = '/verify-otp'
    }, 700)
  }

  return (
    <section className="auth-card" aria-label="Form khôi phục mật khẩu">
      <div className="auth-card__brand">
        <img src="/logo.png" alt="" aria-hidden="true" />
        <div>
          <strong>Carento</strong>
          <span>Đặt xe tự lái</span>
        </div>
      </div>

      <div className="auth-otp-intro">
        <p className="auth-otp-intro__eyebrow">Khôi phục tài khoản</p>
        <h2 className="auth-otp-intro__heading">Quên mật khẩu?</h2>
        <p className="auth-otp-intro__sub">
          Nhập số điện thoại đã đăng ký. Chúng tôi sẽ gửi mã xác thực để
          bạn tạo lại mật khẩu mới.
        </p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-form__group">
          <label className="auth-form__label" htmlFor="forgot-contact">
            Số điện thoại <span aria-hidden="true">*</span>
          </label>
          <div className="auth-form__field">
            <AuthFieldIcon type="contact" />
            <input
              className="auth-form__input auth-form__input--with-icon"
              id="forgot-contact"
              name="contact"
              type="text"
              inputMode="tel"
              autoComplete="tel"
              placeholder="Nhập số điện thoại đã đăng ký"
              value={values.contact}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button
          className="auth-form__submit"
          type="submit"
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? 'Đang gửi…' : 'Gửi mã xác thực'}
        </button>

        {formMessage ? (
          <p className="auth-form__message" role="status" aria-live="polite">
            {formMessage}
          </p>
        ) : null}

        <p className="auth-form__switch">
          Nhớ mật khẩu rồi? <a href="/login">Đăng nhập</a>
        </p>
      </form>
    </section>
  )
}
