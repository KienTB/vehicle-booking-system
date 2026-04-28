import { useEffect, useMemo, useState } from 'react'
import './UserProfilePage.css'

const fallbackUser = {
  fullName: 'Nguyễn Minh Anh',
  email: 'minhanh@example.com',
  phone: '0901234567',
  role: 'USER',
  location: 'TP. Hồ Chí Minh',
  joinedAt: '2026-01-12',
}

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function formatDate(value) {
  if (!value) return 'Đang cập nhật'

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value))
}

function normalizeUser(payload) {
  const data = payload?.data ?? payload

  if (!data || typeof data !== 'object') {
    return fallbackUser
  }

  return {
    fullName: data.fullName || data.name || fallbackUser.fullName,
    email: data.email || fallbackUser.email,
    phone: data.phone || data.phoneNumber || fallbackUser.phone,
    role: data.role || fallbackUser.role,
    location: data.location || data.address || fallbackUser.location,
    joinedAt: data.createdAt || data.joinedAt || fallbackUser.joinedAt,
  }
}

export function UserProfilePage() {
  const [user, setUser] = useState(fallbackUser)
  const [values, setValues] = useState(fallbackUser)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    const token = localStorage.getItem('accessToken')

    async function loadProfile() {
      try {
        const response = await fetch('/api/user/me', {
          signal: controller.signal,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })

        if (!response.ok) {
          throw new Error('Không thể tải hồ sơ cá nhân')
        }

        const payload = await response.json()
        const nextUser = normalizeUser(payload)
        setUser(nextUser)
        setValues(nextUser)
        setNotice('')
      } catch (error) {
        if (error.name !== 'AbortError') {
          setUser(fallbackUser)
          setValues(fallbackUser)
          setNotice('Đang hiển thị dữ liệu mẫu vì chưa kết nối được hồ sơ từ hệ thống.')
        }
      }
    }

    loadProfile()

    return () => controller.abort()
  }, [])

  const accountStats = useMemo(
    () => [
      { label: 'Vai trò', value: user.role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng' },
      { label: 'Ngày tham gia', value: formatDate(user.joinedAt) },
      { label: 'Xác thực', value: 'Sẵn sàng đặt xe' },
    ],
    [user]
  )

  function handleChange(event) {
    const { name, value } = event.target

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setUser(values)
    setNotice('Thông tin hồ sơ đã sẵn sàng để gửi đến API cập nhật tài khoản.')
  }

  return (
    <main className="site-page profile-page">
      <header className="site-nav">
        <a className="site-nav__brand" href="/" aria-label="Carento">
          <img src="/logo.png" alt="" aria-hidden="true" />
          <span>Carento</span>
        </a>

        <nav className="site-nav__links" aria-label="Điều hướng chính">
          <a href="/">Trang chủ</a>
          <a href="/cars">Danh sách xe</a>
          <a href="/my-bookings">Đặt xe của tôi</a>
          <a href="/profile" aria-current="page">
            Hồ sơ
          </a>
        </nav>

        <div className="site-nav__actions">
          <a className="site-button site-button--ghost" href="/invoices">
            Hóa đơn
          </a>
          <a className="site-button site-button--primary" href="/cars">
            Thuê xe
          </a>
        </div>
      </header>

      <section className="profile-hero">
        <div className="profile-identity">
          <div className="profile-avatar" aria-hidden="true">
            {getInitials(user.fullName)}
          </div>
          <div>
            <p className="site-eyebrow">Hồ sơ cá nhân</p>
            <h1>{user.fullName}</h1>
            <p>
              Quản lý thông tin liên hệ, bảo mật tài khoản và các lối tắt hỗ trợ cho
              hành trình đặt xe của bạn.
            </p>
          </div>
        </div>

        <div className="profile-stats" aria-label="Tổng quan tài khoản">
          {accountStats.map((item) => (
            <article key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="profile-layout">
        <form className="profile-card profile-form" onSubmit={handleSubmit}>
          <div className="profile-card__heading">
            <p className="site-eyebrow">Cập nhật hồ sơ</p>
            <h2>Thông tin tài khoản</h2>
            <p>Thông tin này giúp chủ xe và hệ thống hỗ trợ bạn nhanh hơn khi cần xác nhận booking.</p>
          </div>

          <div className="profile-field-grid">
            <label className="profile-field">
              <span>Họ và tên</span>
              <input
                name="fullName"
                type="text"
                placeholder="Nhập họ tên của bạn"
                value={values.fullName}
                onChange={handleChange}
                required
              />
            </label>
            <label className="profile-field">
              <span>Số điện thoại</span>
              <input
                name="phone"
                type="tel"
                placeholder="Nhập số điện thoại"
                value={values.phone}
                onChange={handleChange}
                required
              />
            </label>
            <label className="profile-field">
              <span>Email</span>
              <input
                name="email"
                type="email"
                placeholder="Nhập email của bạn"
                value={values.email}
                onChange={handleChange}
                required
              />
            </label>
            <label className="profile-field">
              <span>Khu vực thường nhận xe</span>
              <input
                name="location"
                type="text"
                placeholder="Nhập khu vực hoặc thành phố"
                value={values.location}
                onChange={handleChange}
              />
            </label>
          </div>

          {notice ? (
            <p className="profile-notice" role="status">
              {notice}
            </p>
          ) : null}

          <button className="profile-submit" type="submit">
            Lưu thay đổi
          </button>
        </form>

        <aside className="profile-sidebar">
          <section className="profile-card account-summary">
            <div className="profile-card__heading">
              <p className="site-eyebrow">Tài khoản</p>
              <h2>Tóm tắt nhanh</h2>
            </div>
            <div className="account-summary__list">
              <div>
                <span>Email</span>
                <strong>{user.email}</strong>
              </div>
              <div>
                <span>Số điện thoại</span>
                <strong>{user.phone}</strong>
              </div>
              <div>
                <span>Khu vực</span>
                <strong>{user.location}</strong>
              </div>
            </div>
          </section>

          <section className="profile-card profile-shortcut">
            <span aria-hidden="true">•••</span>
            <div>
              <h2>Bảo mật tài khoản</h2>
              <p>Đổi mật khẩu định kỳ để bảo vệ thông tin đặt xe và thanh toán của bạn.</p>
            </div>
            <a href="/change-password">Đổi mật khẩu</a>
          </section>

          <section className="profile-card support-card">
            <div className="profile-card__heading">
              <p className="site-eyebrow">Hỗ trợ nhanh</p>
              <h2>Cần hỗ trợ chuyến đi?</h2>
            </div>
            <p>
              Nếu thông tin tài khoản chưa khớp hoặc cần hỗ trợ booking, hãy liên hệ đội ngũ
              Carento để được xử lý nhanh hơn.
            </p>
            <a href="/my-bookings">Xem booking của tôi</a>
          </section>
        </aside>
      </section>
    </main>
  )
}
