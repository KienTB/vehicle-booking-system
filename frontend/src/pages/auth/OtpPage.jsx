import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './AuthForm.css'

const OTP_LENGTH = 6
const RESEND_COOLDOWN = 60 // seconds

export function OtpPage() {
  const [otp, setOtp] = useState(() => Array.from({ length: OTP_LENGTH }, () => ''))
  const [formMessage, setFormMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef([])
  const timerRef = useRef(null)

  const otpValue = useMemo(() => otp.join(''), [otp])

  // Countdown timer for resend
  useEffect(() => {
    if (cooldown <= 0) {
      setCanResend(true)
      return
    }

    timerRef.current = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(timerRef.current)
  }, [cooldown])

  const focusInput = useCallback((index) => {
    inputRefs.current[index]?.focus()
  }, [])

  function handleOtpChange(index, event) {
    const raw = event.target.value.replace(/\D/g, '')
    // Support paste: distribute across cells
    if (raw.length > 1) {
      const chars = raw.slice(0, OTP_LENGTH - index).split('')
      setOtp((current) => {
        const next = [...current]
        chars.forEach((ch, i) => {
          if (index + i < OTP_LENGTH) next[index + i] = ch
        })
        return next
      })
      const nextFocus = Math.min(index + chars.length, OTP_LENGTH - 1)
      focusInput(nextFocus)
      return
    }

    const digit = raw.slice(-1)
    setOtp((current) => {
      const next = [...current]
      next[index] = digit
      return next
    })

    if (digit && index < OTP_LENGTH - 1) {
      focusInput(index + 1)
    }
  }

  function handleOtpKeyDown(index, event) {
    if (event.key === 'Backspace') {
      if (otp[index]) {
        setOtp((current) => {
          const next = [...current]
          next[index] = ''
          return next
        })
      } else if (index > 0) {
        focusInput(index - 1)
      }
    } else if (event.key === 'ArrowLeft' && index > 0) {
      focusInput(index - 1)
    } else if (event.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      focusInput(index + 1)
    }
  }

  function handleOtpPaste(event) {
    event.preventDefault()
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!pasted) return
    const chars = pasted.split('')
    setOtp((current) => {
      const next = [...current]
      chars.forEach((ch, i) => { next[i] = ch })
      return next
    })
    focusInput(Math.min(chars.length, OTP_LENGTH - 1))
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (otpValue.length < OTP_LENGTH) {
      setIsError(true)
      setFormMessage('Vui lòng nhập đầy đủ mã OTP gồm 6 chữ số.')
      return
    }

    setIsError(false)
    setFormMessage('')
    setIsLoading(true)

    // Simulate API call — replace with real integration
    setTimeout(() => {
      setIsLoading(false)
      window.location.href = '/change-password'
    }, 800)
  }

  function handleResend() {
    if (!canResend) return
    setCanResend(false)
    setCooldown(RESEND_COOLDOWN)
    setOtp(Array.from({ length: OTP_LENGTH }, () => ''))
    setFormMessage('')
    setIsError(false)
    focusInput(0)
    // Replace with real resend API call
  }

  const formattedCooldown = `${Math.floor(cooldown / 60)}:${String(cooldown % 60).padStart(2, '0')}`

  return (
    <section className="auth-card" aria-label="Xác thực mã OTP">
      <div className="auth-card__brand">
        <img src="/logo.png" alt="" aria-hidden="true" />
        <div>
          <strong>Carento</strong>
          <span>Đặt xe tự lái</span>
        </div>
      </div>

      <div className="auth-otp-intro">
        <p className="auth-otp-intro__eyebrow">Xác thực hai bước</p>
        <h2 className="auth-otp-intro__heading">Nhập mã xác nhận</h2>
        <p className="auth-otp-intro__sub">
          Chúng tôi đã gửi mã gồm <strong>6 chữ số</strong> về số điện thoại
          của bạn. Mã có hiệu lực trong <strong>{formattedCooldown}</strong>.
        </p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-form__group">
          <div
            className="auth-form__otp"
            role="group"
            aria-label="Nhập mã OTP 6 chữ số"
            onPaste={handleOtpPaste}
          >
            {otp.map((value, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el }}
                className={`auth-form__otp-input${isError ? ' auth-form__otp-input--error' : ''}`}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? 'one-time-code' : 'off'}
                aria-label={`Chữ số OTP thứ ${index + 1}`}
                maxLength={1}
                value={value}
                onChange={(event) => handleOtpChange(index, event)}
                onKeyDown={(event) => handleOtpKeyDown(index, event)}
                onFocus={(event) => event.target.select()}
                required
              />
            ))}
          </div>
        </div>

        <button
          className="auth-form__submit"
          type="submit"
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? 'Đang xác nhận…' : 'Xác nhận mã OTP'}
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

        <div className="auth-form__resend">
          <span>Chưa nhận được mã?</span>
          {canResend ? (
            <button
              className="auth-form__text-link auth-form__resend-btn"
              type="button"
              onClick={handleResend}
            >
              Gửi lại mã
            </button>
          ) : (
            <span className="auth-form__resend-timer">
              Gửi lại sau {formattedCooldown}
            </span>
          )}
        </div>

        <p className="auth-form__switch">
          Nhớ mật khẩu? <a href="/login">Quay lại đăng nhập</a>
        </p>
      </form>
    </section>
  )
}
