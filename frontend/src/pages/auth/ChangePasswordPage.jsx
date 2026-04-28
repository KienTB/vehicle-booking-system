import { useState } from 'react'
import { AuthFieldIcon } from '../../components/auth/AuthFieldIcon'
import './AuthForm.css'

const initialValues = {
  newPassword: '',
  confirmPassword: '',
}

export function ChangePasswordPage() {
  const [values, setValues] = useState(initialValues)
  const [visibleFields, setVisibleFields] = useState({
    newPassword: false,
    confirmPassword: false,
  })
  const [formMessage, setFormMessage] = useState('')
  const [messageType, setMessageType] = useState('success')

  function handleChange(event) {
    const { name, value } = event.target

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }))
  }

  function toggleVisibility(fieldName) {
    setVisibleFields((currentFields) => ({
      ...currentFields,
      [fieldName]: !currentFields[fieldName],
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (values.newPassword !== values.confirmPassword) {
      setMessageType('error')
      setFormMessage('Mật khẩu xác nhận chưa trùng khớp.')
      return
    }

    setMessageType('success')
    setFormMessage('Sẵn sàng kết nối API cập nhật mật khẩu ở bước tích hợp.')
  }

  return (
    <section className="auth-card" aria-label="Form đổi mật khẩu">
      <div className="auth-card__brand">
        <img src="/logo.png" alt="" aria-hidden="true" />
        <div>
          <strong>Carento</strong>
          <span>Đặt xe tự lái</span>
        </div>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-form__group">
          <label className="auth-form__label" htmlFor="change-new-password">
            Mật khẩu mới <span aria-hidden="true">*</span>
          </label>
          <div className="auth-form__password">
            <AuthFieldIcon type="lock" />
            <input
              className="auth-form__input auth-form__input--with-icon auth-form__input--with-action"
              id="change-new-password"
              name="newPassword"
              type={visibleFields.newPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Tạo mật khẩu mới"
              value={values.newPassword}
              onChange={handleChange}
              required
            />
            <button
              className="auth-form__field-action"
              type="button"
              onClick={() => toggleVisibility('newPassword')}
              aria-label={
                visibleFields.newPassword ? 'Ẩn mật khẩu mới' : 'Hiện mật khẩu mới'
              }
            >
              {visibleFields.newPassword ? 'Ẩn' : 'Hiện'}
            </button>
          </div>
        </div>

        <div className="auth-form__group">
          <label
            className="auth-form__label"
            htmlFor="change-confirm-password"
          >
            Xác nhận mật khẩu mới <span aria-hidden="true">*</span>
          </label>
          <div className="auth-form__password">
            <AuthFieldIcon type="confirm" />
            <input
              className="auth-form__input auth-form__input--with-icon auth-form__input--with-action"
              id="change-confirm-password"
              name="confirmPassword"
              type={visibleFields.confirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Nhập lại mật khẩu mới"
              value={values.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              className="auth-form__field-action"
              type="button"
              onClick={() => toggleVisibility('confirmPassword')}
              aria-label={
                visibleFields.confirmPassword
                  ? 'Ẩn mật khẩu xác nhận'
                  : 'Hiện mật khẩu xác nhận'
              }
            >
              {visibleFields.confirmPassword ? 'Ẩn' : 'Hiện'}
            </button>
          </div>
        </div>

        <button className="auth-form__submit" type="submit">
          Cập nhật mật khẩu
        </button>

        {formMessage ? (
          <p
            className={`auth-form__message${
              messageType === 'error' ? ' auth-form__message--error' : ''
            }`}
            role="status"
          >
            {formMessage}
          </p>
        ) : null}

        <p className="auth-form__switch">
          Muốn quay lại? <a href="/login">Đăng nhập</a>
        </p>
      </form>
    </section>
  )
}
