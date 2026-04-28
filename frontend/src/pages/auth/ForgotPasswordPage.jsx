import { useState } from 'react'
import { AuthFieldIcon } from '../../components/auth/AuthFieldIcon'
import './AuthForm.css'

const initialValues = {
  contact: '',
}

export function ForgotPasswordPage() {
  const [values, setValues] = useState(initialValues)

  function handleChange(event) {
    const { name, value } = event.target

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    window.location.href = '/verify-otp'
  }

  return (
    <section className="auth-card" aria-label="Form khôi phục mật khẩu">
      <form className="auth-form" onSubmit={handleSubmit}>
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
              placeholder="Nhập số điện thoại"
              value={values.contact}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button className="auth-form__submit" type="submit">
          Gửi hướng dẫn khôi phục
        </button>

        <p className="auth-form__switch">
          Bạn đã nhớ mật khẩu? <a href="/login">Đăng nhập</a>
        </p>
      </form>
    </section>
  )
}
