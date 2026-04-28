import { useEffect, useMemo, useState } from 'react'
import './MyBookingsPage.css'

const fallbackBookings = [
  {
    id: 1001,
    status: 'PENDING',
    pickupDate: '2026-05-02',
    returnDate: '2026-05-05',
    totalPrice: 2484000,
    car: {
      id: 1,
      name: 'Toyota Vios 2023',
      brand: 'Toyota',
      location: 'Quận 1, TP. Hồ Chí Minh',
      imageUrl: '/background.png',
    },
  },
  {
    id: 1002,
    status: 'COMPLETED',
    pickupDate: '2026-04-10',
    returnDate: '2026-04-12',
    totalPrice: 2300000,
    car: {
      id: 2,
      name: 'Mazda CX-5 Premium',
      brand: 'Mazda',
      location: 'Cầu Giấy, Hà Nội',
      imageUrl: '/background.png',
    },
  },
  {
    id: 1003,
    status: 'CANCELLED',
    pickupDate: '2026-03-18',
    returnDate: '2026-03-20',
    totalPrice: 3360000,
    car: {
      id: 3,
      name: 'Kia Carnival Luxury',
      brand: 'Kia',
      location: 'Hải Châu, Đà Nẵng',
      imageUrl: '/background.png',
    },
  },
]

const statusLabels = {
  PENDING: 'Chờ thanh toán',
  COMPLETED: 'Hoàn tất',
  CANCELLED: 'Đã hủy',
}

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN').format(Number(value || 0))
}

function formatDate(value) {
  if (!value) return 'Đang cập nhật'

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value))
}

function normalizeBookings(payload) {
  const data = payload?.data ?? payload
  const list = data?.content ?? data?.items ?? data

  if (!Array.isArray(list)) {
    return []
  }

  return list.map((booking) => {
    const car = booking.car || booking.vehicle || {}

    return {
      id: booking.id,
      status: booking.status || 'PENDING',
      pickupDate: booking.pickupDate || booking.startDate || booking.fromDate,
      returnDate: booking.returnDate || booking.endDate || booking.toDate,
      totalPrice: booking.totalPrice || booking.totalAmount || booking.price,
      car: {
        id: car.id || booking.carId,
        name: car.name || `${car.brand || 'Xe'} ${car.model || ''}`.trim(),
        brand: car.brand || 'Đang cập nhật',
        location: car.location || booking.pickupLocation || 'Đang cập nhật địa điểm',
        imageUrl:
          car.primaryImageUrl ||
          car.imageUrl ||
          car.thumbnailUrl ||
          car.images?.find((image) => image.primary)?.url ||
          car.images?.[0]?.url ||
          '/background.png',
      },
    }
  })
}

export function MyBookingsPage() {
  const [bookings, setBookings] = useState(fallbackBookings)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    const token = localStorage.getItem('accessToken')

    async function loadBookings() {
      try {
        const response = await fetch('/api/bookings/my-bookings', {
          signal: controller.signal,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })

        if (!response.ok) {
          throw new Error('Không thể tải lịch sử đặt xe')
        }

        const payload = await response.json()
        const nextBookings = normalizeBookings(payload)
        setBookings(nextBookings)
        setNotice(nextBookings.length === 0 ? 'Bạn chưa có đơn đặt xe nào.' : '')
      } catch (error) {
        if (error.name !== 'AbortError') {
          setBookings(fallbackBookings)
          setNotice('Đang hiển thị dữ liệu mẫu vì chưa kết nối được lịch sử đặt xe từ hệ thống.')
        }
      }
    }

    loadBookings()

    return () => controller.abort()
  }, [])

  const summary = useMemo(
    () => ({
      total: bookings.length,
      pending: bookings.filter((booking) => booking.status === 'PENDING').length,
      completed: bookings.filter((booking) => booking.status === 'COMPLETED').length,
      cancelled: bookings.filter((booking) => booking.status === 'CANCELLED').length,
    }),
    [bookings]
  )

  return (
    <main className="site-page my-bookings-page">
      <header className="site-nav">
        <a className="site-nav__brand" href="/" aria-label="Carento">
          <img src="/logo.png" alt="" aria-hidden="true" />
          <span>Carento</span>
        </a>

        <nav className="site-nav__links" aria-label="Điều hướng chính">
          <a href="/">Trang chủ</a>
          <a href="/cars">Danh sách xe</a>
          <a href="/my-bookings" aria-current="page">
            Đặt xe của tôi
          </a>
        </nav>

        <div className="site-nav__actions">
          <a className="site-button site-button--ghost" href="/invoices">
            Hóa đơn
          </a>
          <a className="site-button site-button--primary" href="/profile">
            Tài khoản
          </a>
        </div>
      </header>

      <section className="my-bookings-hero">
        <div>
          <p className="site-eyebrow">Lịch sử đặt xe</p>
          <h1>Theo dõi toàn bộ chuyến xe của bạn ở một nơi.</h1>
          <p>
            Kiểm tra trạng thái đơn, thời gian thuê, chi phí và thao tác nhanh với các
            booking đang chờ thanh toán.
          </p>
        </div>

        <div className="booking-summary-strip" aria-label="Tổng quan đặt xe">
          <article>
            <span>Tất cả</span>
            <strong>{summary.total}</strong>
          </article>
          <article>
            <span>Chờ thanh toán</span>
            <strong>{summary.pending}</strong>
          </article>
          <article>
            <span>Hoàn tất</span>
            <strong>{summary.completed}</strong>
          </article>
          <article>
            <span>Đã hủy</span>
            <strong>{summary.cancelled}</strong>
          </article>
        </div>
      </section>

      <section className="my-bookings-list" aria-live="polite">
        <div className="my-bookings-list__heading">
          <div>
            <p className="site-eyebrow">Đơn đặt xe</p>
            <h2>{bookings.length} booking gần đây</h2>
          </div>
          {notice ? <span>{notice}</span> : <span>Trạng thái được cập nhật theo hệ thống.</span>}
        </div>

        {bookings.length > 0 ? (
          <div className="booking-timeline">
            {bookings.map((booking) => (
              <article className="booking-history-card" key={booking.id}>
                <a className="booking-history-card__media" href={`/cars/${booking.car.id}`}>
                  <img src={booking.car.imageUrl} alt={`Hình ảnh ${booking.car.name}`} />
                  <span className={`booking-status booking-status--${booking.status.toLowerCase()}`}>
                    {statusLabels[booking.status] || 'Đang cập nhật'}
                  </span>
                </a>

                <div className="booking-history-card__body">
                  <div className="booking-history-card__title">
                    <span>{booking.car.brand}</span>
                    <h3>{booking.car.name}</h3>
                    <p>{booking.car.location}</p>
                  </div>

                  <div className="booking-history-card__meta">
                    <div>
                      <span>Ngày thuê</span>
                      <strong>
                        {formatDate(booking.pickupDate)} - {formatDate(booking.returnDate)}
                      </strong>
                    </div>
                    <div>
                      <span>Tổng tiền</span>
                      <strong>{formatCurrency(booking.totalPrice)}đ</strong>
                    </div>
                    <div>
                      <span>Mã booking</span>
                      <strong>#{booking.id}</strong>
                    </div>
                  </div>

                  <div className="booking-history-card__actions">
                    <a href={`/booking-detail?id=${booking.id}`}>Xem chi tiết</a>
                    {booking.status === 'PENDING' ? (
                      <button type="button">Hủy đặt xe</button>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="my-bookings-empty">
            <h3>Bạn chưa có chuyến xe nào</h3>
            <p>Khám phá danh sách xe phù hợp và tạo booking đầu tiên cho lịch trình sắp tới.</p>
            <a className="site-button site-button--primary" href="/cars">
              Tìm xe ngay
            </a>
          </div>
        )}
      </section>
    </main>
  )
}
