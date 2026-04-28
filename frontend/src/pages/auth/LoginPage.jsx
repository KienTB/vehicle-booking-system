import { useState } from 'react'
import { authApi } from '../../api/authApi'
import { AuthFieldIcon } from '../../components/auth/AuthFieldIcon'
import { saveAuthSession } from '../../auth/authStorage'
import './AuthForm.css'

const initialValues = {
  phone: '',
  password: '',
  remember: true,
}

export function LoginPage() {
  const [values, setValues] = useState(initialValues)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formMessage, setFormMessage] = useState('')
  const [isError, setIsError] = useState(false)

  function handleChange(event) {
    const { name, value, type, checked } = event.target

    setValues((currentValues) => ({
      ...currentValues,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormMessage('')
    setIsError(false)
    setIsLoading(true)

    try {
      const payload = await authApi.login({
        phone: values.phone.trim(),
        password: values.password,
      })

      if (!payload?.success || !payload?.data?.token) {
        throw new Error(payload?.message || 'Đăng nhập thất bại')
      }

      saveAuthSession(payload.data, values.remember)
      setFormMessage('Đăng nhập thành công. Đang chuyển trang...')
      window.location.href = '/dashboard'
    } catch (error) {
      const backendMessage = error?.response?.data?.message
      const statusCode = error?.response?.status
      const networkCode = error?.code
      let message = 'Đăng nhập thất bại. Vui lòng thử lại.'

      if (statusCode === 401 || statusCode === 403) {
        message = 'Sai số điện thoại hoặc mật khẩu.'
      } else if (statusCode === 404) {
        message = 'Không tìm thấy API đăng nhập. Vui lòng kiểm tra backend hoặc cấu hình proxy.'
      } else if (statusCode === 429) {
        message = 'Bạn thao tác quá nhanh. Vui lòng thử lại sau ít phút.'
      } else if (networkCode === 'ERR_NETWORK') {
        message = 'Không thể kết nối backend. Vui lòng bật server backend.'
      } else if (typeof backendMessage === 'string' && backendMessage.trim()) {
        message = backendMessage
      }

      setIsError(true)
      setFormMessage(message)
    } finally {
      setIsLoading(false)
    }
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
              disabled={isLoading}
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
              disabled={isLoading}
              required
            />
            <button
              className="auth-form__field-action"
              type="button"
              onClick={() => setShowPassword((currentValue) => !currentValue)}
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              disabled={isLoading}
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
            disabled={isLoading}
          />
          <span>Ghi nhớ đăng nhập</span>
        </label>

        <button className="auth-form__submit" type="submit" disabled={isLoading}>
          {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>

        {formMessage ? (
          <p
            className={`auth-form__message${isError ? ' auth-form__message--error' : ''}`}
            role="status"
            aria-live="polite"
          >
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
