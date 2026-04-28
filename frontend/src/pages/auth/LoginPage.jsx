import { useState } from 'react'
import { AuthFieldIcon } from '../../components/auth/AuthFieldIcon'
import './AuthForm.css'

const initialValues = {
  phone: '',
  password: '',
  remember: true,
}

export function LoginPage() {
  const [values, setValues] = useState(initialValues)
  const [showPassword, setShowPassword] = useState(false)
  const [formMessage, setFormMessage] = useState('')

  function handleChange(event) {
    const { name, value, type, checked } = event.target

    setValues((currentValues) => ({
      ...currentValues,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setFormMessage('Sẵn sàng kết nối API đăng nhập ở bước tích hợp.')
  }

  return (
    <section className="auth-card" aria-label="Form đăng nhập">
      <div className="auth-card__brand">
        <img src="/logo.png" alt="" aria-hidden="true" />
        <div>
          <strong>Carento</strong>
          <span>Đặt xe tự lái</span>
        </div>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-form__group">
          <label className="auth-form__label" htmlFor="login-phone">
            Số điện thoại <span aria-hidden="true">*</span>
          </label>
          <div className="auth-form__field">
            <AuthFieldIcon type="contact" />
            <input
              className="auth-form__input auth-form__input--with-icon"
              id="login-phone"
              name="phone"
              type="text"
              placeholder="Nhập số điện thoại"
              value={values.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="auth-form__group">
          <div className="auth-form__label-row">
            <label className="auth-form__label" htmlFor="login-password">
              Mật khẩu <span aria-hidden="true">*</span>
            </label>
            <a className="auth-form__text-link" href="/forgot-password">
              Quên mật khẩu?
            </a>
          </div>

          <div className="auth-form__password">
            <AuthFieldIcon type="lock" />
            <input
              className="auth-form__input auth-form__input--with-icon auth-form__input--with-action"
              id="login-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Nhập mật khẩu"
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

        <label className="auth-form__check">
          <input
            name="remember"
            type="checkbox"
            checked={values.remember}
            onChange={handleChange}
          />
          <span>Ghi nhớ đăng nhập</span>
        </label>

        <button className="auth-form__submit" type="submit">
          Đăng nhập
        </button>

        {formMessage ? (
          <p className="auth-form__message" role="status">
            {formMessage}
          </p>
        ) : null}

        <p className="auth-form__switch">
          Chưa có tài khoản? <a href="/register">Tạo tài khoản</a>
        </p>
      </form>
    </section>
  )
}
