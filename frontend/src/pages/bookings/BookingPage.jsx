import { useEffect, useMemo, useState } from 'react'
import './BookingPage.css'

const fallbackCar = {
  id: 1,
  name: 'Toyota Vios 2023',
  brand: 'Toyota',
  location: 'Quận 1, TP. Hồ Chí Minh',
  seats: 5,
  transmission: 'AUTOMATIC',
  fuelType: 'GASOLINE',
  pricePerDay: 720000,
  imageUrl: '/background.png',
}

const fuelTypeLabels = {
  GASOLINE: 'Xăng',
  DIESEL: 'Dầu',
  ELECTRIC: 'Điện',
  HYBRID: 'Hybrid',
}

const transmissionLabels = {
  AUTOMATIC: 'Tự động',
  MANUAL: 'Số sàn',
}

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN').format(Number(value || 0))
}

function normalizeCar(payload, id) {
  const data = payload?.data ?? payload

  if (!data || typeof data !== 'object') {
    return { ...fallbackCar, id: id || fallbackCar.id }
  }

  return {
    ...fallbackCar,
    id: data.id ?? id,
    name: data.name || `${data.brand || 'Xe'} ${data.model || ''}`.trim(),
    brand: data.brand || fallbackCar.brand,
    location: data.location || fallbackCar.location,
    seats: data.seats || fallbackCar.seats,
    transmission: data.transmission || fallbackCar.transmission,
    fuelType: data.fuelType || fallbackCar.fuelType,
    pricePerDay: data.pricePerDay ?? data.dailyPrice ?? data.price ?? fallbackCar.pricePerDay,
    imageUrl:
      data.primaryImageUrl ||
      data.imageUrl ||
      data.thumbnailUrl ||
      data.images?.find((image) => image.primary)?.url ||
      data.images?.[0]?.url ||
      fallbackCar.imageUrl,
  }
}

function getRentalDays(pickupDate, returnDate) {
  if (!pickupDate || !returnDate) {
    return 1
  }

  const start = new Date(pickupDate)
  const end = new Date(returnDate)
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24))

  return Math.max(diff, 1)
}

export function BookingPage() {
  const params = new URLSearchParams(window.location.search)
  const carId = params.get('carId') || fallbackCar.id
  const [car, setCar] = useState({ ...fallbackCar, id: carId })
  const [formValues, setFormValues] = useState({
    pickupDate: params.get('pickupDate') || '',
    returnDate: params.get('returnDate') || '',
    fullName: '',
    phone: '',
    email: '',
    pickupLocation: fallbackCar.location,
    note: '',
  })
  const [notice, setNotice] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadCar() {
      try {
        const response = await fetch(`/api/cars/${carId}`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Không thể tải xe đã chọn')
        }

        const payload = await response.json()
        const nextCar = normalizeCar(payload, carId)
        setCar(nextCar)
        setFormValues((currentValues) => ({
          ...currentValues,
          pickupLocation: currentValues.pickupLocation || nextCar.location,
        }))
      } catch (error) {
        if (error.name !== 'AbortError') {
          setCar({ ...fallbackCar, id: carId })
          setNotice('Đang hiển thị dữ liệu mẫu vì chưa kết nối được xe đã chọn từ hệ thống.')
        }
      }
    }

    loadCar()

    return () => controller.abort()
  }, [carId])

  const rentalDays = useMemo(
    () => getRentalDays(formValues.pickupDate, formValues.returnDate),
    [formValues.pickupDate, formValues.returnDate]
  )
  const subtotal = rentalDays * Number(car.pricePerDay || 0)
  const serviceFee = Math.round(subtotal * 0.08)
  const total = subtotal + serviceFee

  function handleChange(event) {
    const { name, value } = event.target

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setNotice('Thông tin đặt xe đã sẵn sàng để gửi đến API tạo booking ở bước tích hợp.')
  }

  return (
    <main className="site-page booking-page">
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
          <a className="site-button site-button--ghost" href="/cars">
            Xem xe khác
          </a>
          <a className="site-button site-button--primary" href="/login">
            Đăng nhập
          </a>
        </div>
      </header>

      <section className="booking-hero">
        <div>
          <p className="site-eyebrow">Tạo đơn đặt xe</p>
          <h1>Hoàn tất thông tin để giữ xe cho chuyến đi của bạn.</h1>
          <p>
            Kiểm tra lịch thuê, thông tin liên hệ và chi phí dự kiến trước khi xác nhận.
            Đơn đặt xe mới sẽ ở trạng thái chờ thanh toán.
          </p>
        </div>

        <ol className="booking-steps" aria-label="Tiến trình đặt xe">
          <li className="is-active">Chọn xe</li>
          <li className="is-active">Thông tin thuê</li>
          <li>Xác nhận</li>
        </ol>
      </section>

      <form className="booking-layout" onSubmit={handleSubmit}>
        <div className="booking-flow">
          <section className="booking-card booking-car">
            <img src={car.imageUrl} alt={`Hình ảnh ${car.name}`} />
            <div>
              <span>{car.brand}</span>
              <h2>{car.name}</h2>
              <p>{car.location}</p>
              <div className="booking-car__specs">
                <small>{car.seats} chỗ</small>
                <small>{transmissionLabels[car.transmission] || 'Hộp số'}</small>
                <small>{fuelTypeLabels[car.fuelType] || 'Nhiên liệu'}</small>
              </div>
            </div>
          </section>

          <section className="booking-card">
            <div className="booking-card__heading">
              <p className="site-eyebrow">Lịch thuê</p>
              <h2>Chọn thời gian nhận và trả xe</h2>
            </div>
            <div className="booking-field-grid booking-field-grid--two">
              <label className="booking-field">
                <span>Ngày nhận xe</span>
                <input
                  name="pickupDate"
                  type="date"
                  value={formValues.pickupDate}
                  onChange={handleChange}
                  required
                />
              </label>
              <label className="booking-field">
                <span>Ngày trả xe</span>
                <input
                  name="returnDate"
                  type="date"
                  value={formValues.returnDate}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
          </section>

          <section className="booking-card">
            <div className="booking-card__heading">
              <p className="site-eyebrow">Người thuê</p>
              <h2>Thông tin liên hệ nhận xe</h2>
            </div>
            <div className="booking-field-grid">
              <label className="booking-field">
                <span>Họ và tên</span>
                <input
                  name="fullName"
                  type="text"
                  placeholder="Nhập họ tên của bạn"
                  value={formValues.fullName}
                  onChange={handleChange}
                  required
                />
              </label>
              <label className="booking-field">
                <span>Số điện thoại</span>
                <input
                  name="phone"
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  value={formValues.phone}
                  onChange={handleChange}
                  required
                />
              </label>
              <label className="booking-field booking-field--wide">
                <span>Email nhận thông tin</span>
                <input
                  name="email"
                  type="email"
                  placeholder="Nhập email của bạn"
                  value={formValues.email}
                  onChange={handleChange}
                />
              </label>
            </div>
          </section>

          <section className="booking-card">
            <div className="booking-card__heading">
              <p className="site-eyebrow">Ghi chú</p>
              <h2>Yêu cầu thêm cho chuyến đi</h2>
            </div>
            <div className="booking-field-grid booking-field-grid--one">
              <label className="booking-field">
                <span>Địa điểm nhận xe mong muốn</span>
                <input
                  name="pickupLocation"
                  type="text"
                  placeholder="Nhập địa điểm nhận xe"
                  value={formValues.pickupLocation}
                  onChange={handleChange}
                />
              </label>
              <label className="booking-field">
                <span>Ghi chú cho chủ xe</span>
                <textarea
                  name="note"
                  placeholder="Ví dụ: Tôi muốn nhận xe lúc 8 giờ sáng"
                  value={formValues.note}
                  onChange={handleChange}
                  rows="4"
                />
              </label>
            </div>
          </section>
        </div>

        <aside className="booking-page__summary" aria-label="Tóm tắt chi phí">
          <div className="booking-page__summary-heading">
            <span>Tóm tắt chi phí</span>
            <strong>{formatCurrency(total)}đ</strong>
          </div>

          <div className="booking-price-list">
            <div>
              <span>{formatCurrency(car.pricePerDay)}đ x {rentalDays} ngày</span>
              <strong>{formatCurrency(subtotal)}đ</strong>
            </div>
            <div>
              <span>Phí dịch vụ dự kiến</span>
              <strong>{formatCurrency(serviceFee)}đ</strong>
            </div>
            <div>
              <span>Tổng cộng</span>
              <strong>{formatCurrency(total)}đ</strong>
            </div>
          </div>

          <div className="booking-safe-note">
            <strong>Giữ xe trong thời gian chờ thanh toán</strong>
            <p>
              Sau khi xác nhận, đơn đặt xe sẽ ở trạng thái chờ thanh toán và được giữ theo
              thời gian hệ thống quy định.
            </p>
          </div>

          {notice ? (
            <p className="booking-page__notice" role="status">
              {notice}
            </p>
          ) : null}

          <button className="booking-confirm" type="submit">
            Xác nhận đặt xe
          </button>
        </aside>
      </form>
    </main>
  )
}
