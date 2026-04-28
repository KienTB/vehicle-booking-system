import { useState } from 'react'
import { AuthFieldIcon } from '../../components/auth/AuthFieldIcon'
import './AuthForm.css'

const initialValues = {
  fullName: '',
  contact: '',
  password: '',
  confirmPassword: '',
}

export function RegisterPage() {
  const [values, setValues] = useState(initialValues)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formMessage, setFormMessage] = useState('')
  const [isError, setIsError] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (values.password !== values.confirmPassword) {
      setIsError(true)
      setFormMessage('Mật khẩu xác nhận chưa trùng khớp.')
      return
    }

    setIsError(false)
    setFormMessage('Sẵn sàng kết nối API đăng ký ở bước tích hợp.')
  }

  return (
    <section className="auth-card" aria-label="Form đăng ký">
      <div className="auth-card__brand">
        <img src="/logo.png" alt="" aria-hidden="true" />
        <div>
          <strong>Carento</strong>
          <span>Đặt xe tự lái</span>
        </div>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-form__group">
          <label className="auth-form__label" htmlFor="register-full-name">
            Họ và tên <span aria-hidden="true">*</span>
          </label>
          <div className="auth-form__field">
            <AuthFieldIcon type="user" />
            <input
              className="auth-form__input auth-form__input--with-icon"
              id="register-full-name"
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder="Nhập họ và tên"
              value={values.fullName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="auth-form__group">
          <label className="auth-form__label" htmlFor="register-contact">
            Số điện thoại <span aria-hidden="true">*</span>
          </label>
          <div className="auth-form__field">
            <AuthFieldIcon type="contact" />
            <input
              className="auth-form__input auth-form__input--with-icon"
              id="register-contact"
              name="contact"
              type="text"
              placeholder="Nhập số điện thoại"
              value={values.contact}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="auth-form__group">
          <label className="auth-form__label" htmlFor="register-password">
            Mật khẩu <span aria-hidden="true">*</span>
          </label>
          <div className="auth-form__password">
            <AuthFieldIcon type="lock" />
            <input
              className="auth-form__input auth-form__input--with-icon auth-form__input--with-action"
              id="register-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Tạo mật khẩu"
              value={values.password}
              onChange={handleChange}
              required
            />
            <button
              className="auth-form__field-action"
              type="button"
              onClick={() => setShowPassword((currentValue) => !currentValue)}
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword ? 'Ẩn' : 'Hiện'}
            </button>
          </div>
        </div>

        <div className="auth-form__group">
          <label
            className="auth-form__label"
            htmlFor="register-confirm-password"
          >
            Xác nhận mật khẩu <span aria-hidden="true">*</span>
          </label>
          <div className="auth-form__password">
            <AuthFieldIcon type="confirm" />
            <input
              className="auth-form__input auth-form__input--with-icon auth-form__input--with-action"
              id="register-confirm-password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Nhập lại mật khẩu"
              value={values.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              className="auth-form__field-action"
              type="button"
              onClick={() =>
                setShowConfirmPassword((currentValue) => !currentValue)
              }
              aria-label={
                showConfirmPassword ? 'Ẩn mật khẩu xác nhận' : 'Hiện mật khẩu xác nhận'
              }
            >
              {showConfirmPassword ? 'Ẩn' : 'Hiện'}
            </button>
          </div>
        </div>

        <button className="auth-form__submit" type="submit">
          Tạo tài khoản
        </button>

        {formMessage ? (
          <p
            className={`auth-form__message${isError ? ' auth-form__message--error' : ''}`}
            role="status"
          >
            {formMessage}
          </p>
        ) : null}

        <p className="auth-form__switch">
          Đã có tài khoản? <a href="/login">Đăng nhập</a>
        </p>
      </form>
    </section>
  )
}
