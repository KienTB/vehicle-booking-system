import { useMemo, useState } from 'react'
import './AuthForm.css'

const otpLength = 6

export function OtpPage() {
  const [otp, setOtp] = useState(Array.from({ length: otpLength }, () => ''))
  const [formMessage, setFormMessage] = useState('')

  const otpValue = useMemo(() => otp.join(''), [otp])

  function handleOtpChange(index, event) {
    const nextValue = event.target.value.replace(/\D/g, '').slice(-1)

    setOtp((currentOtp) => {
      const nextOtp = [...currentOtp]
      nextOtp[index] = nextValue
      return nextOtp
    })

    if (nextValue && index < otpLength - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  function handleOtpKeyDown(index, event) {
    if (event.key !== 'Backspace' || otp[index]) {
      return
    }

    const previousInput = document.getElementById(`otp-${index - 1}`)
    previousInput?.focus()
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (otpValue.length < otpLength) {
      setFormMessage('Vui lòng nhập đầy đủ mã OTP gồm 6 chữ số.')
      return
    }

    window.location.href = '/change-password'
  }

  return (
    <section className="auth-card" aria-label="Form nhập mã OTP">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-form__group">
          <label className="auth-form__label" htmlFor="otp-0">
            Mã OTP
          </label>
          <div className="auth-form__otp" aria-label="Nhập mã OTP 6 chữ số">
            {otp.map((value, index) => (
              <input
                className="auth-form__otp-input"
                id={`otp-${index}`}
                key={index}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                aria-label={`Chữ số OTP thứ ${index + 1}`}
                maxLength={1}
                value={value}
                onChange={(event) => handleOtpChange(index, event)}
                onKeyDown={(event) => handleOtpKeyDown(index, event)}
                required
              />
            ))}
          </div>
        </div>

        <p className="auth-form__helper">
          Mã xác thực có hiệu lực trong vài phút. Nếu chưa nhận được mã, bạn có
          thể gửi lại sau ít phút.
        </p>

        <button className="auth-form__submit" type="submit">
          Xác nhận mã OTP
        </button>

        {formMessage ? (
          <p className="auth-form__message auth-form__message--error" role="status">
            {formMessage}
          </p>
        ) : null}

        <p className="auth-form__switch">
          Chưa nhận được mã? <a href="/forgot-password">Gửi lại mã</a>
        </p>
      </form>
    </section>
  )
}
