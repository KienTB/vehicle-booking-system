import { useEffect, useMemo, useState } from 'react'
import './CarDetailPage.css'

const fallbackCar = {
  id: 1,
  name: 'Toyota Vios 2023',
  brand: 'Toyota',
  location: 'Quận 1, TP. Hồ Chí Minh',
  seats: 5,
  transmission: 'AUTOMATIC',
  fuelType: 'GASOLINE',
  pricePerDay: 720000,
  status: 'AVAILABLE',
  description:
    'Mẫu sedan gọn gàng, tiết kiệm nhiên liệu và dễ điều khiển trong đô thị. Phù hợp cho công tác ngắn ngày, du lịch gia đình nhỏ hoặc các chuyến đi cần sự linh hoạt.',
  ownerName: 'Đối tác Carento đã xác minh',
  deliveryLocation: 'Giao nhận tại Quận 1 hoặc hỗ trợ giao xe trong nội thành.',
  images: ['/background.png', '/background.png', '/background.png'],
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

const detailNotes = [
  {
    title: 'Chủ xe đã xác minh',
    description: 'Thông tin xe và đối tác cho thuê được kiểm tra trước khi hiển thị.',
  },
  {
    title: 'Hỗ trợ trong chuyến đi',
    description: 'Đội ngũ hỗ trợ sẵn sàng đồng hành khi bạn cần thay đổi lịch trình.',
  },
  {
    title: 'Chính sách hủy rõ ràng',
    description: 'Thông tin phí và điều kiện hủy được trình bày trước khi thanh toán.',
  },
]

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN').format(Number(value || 0))
}

function normalizeCar(payload, id) {
  const data = payload?.data ?? payload

  if (!data || typeof data !== 'object') {
    return fallbackCar
  }

  const imageList = Array.isArray(data.images)
    ? data.images.map((image) => image.url || image.imageUrl || image).filter(Boolean)
    : []

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
    status: data.status || fallbackCar.status,
    description: data.description || fallbackCar.description,
    ownerName: data.ownerName || fallbackCar.ownerName,
    deliveryLocation: data.deliveryLocation || data.location || fallbackCar.deliveryLocation,
    images:
      imageList.length > 0
        ? imageList
        : [
            data.primaryImageUrl,
            data.imageUrl,
            data.thumbnailUrl,
            fallbackCar.images[0],
          ].filter(Boolean),
  }
}

export function CarDetailPage({ carId }) {
  const [car, setCar] = useState(fallbackCar)
  const [selectedImage, setSelectedImage] = useState(fallbackCar.images[0])
  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadCar() {
      try {
        const response = await fetch(`/api/cars/${carId}`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Không thể tải thông tin xe')
        }

        const payload = await response.json()
        const nextCar = normalizeCar(payload, carId)
        setCar(nextCar)
        setSelectedImage(nextCar.images[0])
        setNotice('')
      } catch (error) {
        if (error.name !== 'AbortError') {
          const nextCar = { ...fallbackCar, id: carId || fallbackCar.id }
          setCar(nextCar)
          setSelectedImage(nextCar.images[0])
          setNotice('Đang hiển thị dữ liệu mẫu vì chưa kết nối được chi tiết xe từ hệ thống.')
        }
      }
    }

    loadCar()

    return () => controller.abort()
  }, [carId])

  const specs = useMemo(
    () => [
      { label: 'Số chỗ', value: `${car.seats || '-'} chỗ` },
      { label: 'Hộp số', value: transmissionLabels[car.transmission] || 'Đang cập nhật' },
      { label: 'Nhiên liệu', value: fuelTypeLabels[car.fuelType] || 'Đang cập nhật' },
      { label: 'Trạng thái', value: car.status === 'AVAILABLE' ? 'Sẵn sàng' : 'Đang cập nhật' },
    ],
    [car]
  )

  function handleBookingSubmit(event) {
    event.preventDefault()
    const params = new URLSearchParams()
    params.set('carId', car.id || carId || fallbackCar.id)
    if (pickupDate) params.set('pickupDate', pickupDate)
    if (returnDate) params.set('returnDate', returnDate)
    window.location.href = `/booking?${params.toString()}`
  }

  return (
    <main className="site-page car-detail-page">
      <header className="site-nav">
        <a className="site-nav__brand" href="/" aria-label="Carento">
          <img src="/logo.png" alt="" aria-hidden="true" />
          <span>Carento</span>
        </a>

        <nav className="site-nav__links" aria-label="Điều hướng chính">
          <a href="/">Trang chủ</a>
          <a href="/cars" aria-current="page">
            Danh sách xe
          </a>
          <a href="/my-bookings">Đặt xe của tôi</a>
        </nav>

        <div className="site-nav__actions">
          <a className="site-button site-button--ghost" href="/login">
            Đăng nhập
          </a>
          <a className="site-button site-button--primary" href="/register">
            Tạo tài khoản
          </a>
        </div>
      </header>

      <section className="car-detail-hero">
        <div className="car-detail-hero__intro">
          <p className="site-eyebrow">Chi tiết xe thuê</p>
          <h1>{car.name}</h1>
          <p>
            {car.brand} tại {car.location}. Kiểm tra thông tin xe, giá thuê và lịch nhận xe
            trước khi gửi yêu cầu đặt.
          </p>
          {notice ? <span>{notice}</span> : null}
        </div>
      </section>

      <section className="car-detail-layout">
        <div className="car-detail-main">
          <section className="car-gallery" aria-label="Thư viện ảnh xe">
            <div className="car-gallery__stage">
              <img src={selectedImage} alt={`Hình ảnh ${car.name}`} />
              <span>{car.status === 'AVAILABLE' ? 'Sẵn sàng cho thuê' : 'Đang cập nhật'}</span>
            </div>
            <div className="car-gallery__thumbs">
              {car.images.map((image, index) => (
                <button
                  className={image === selectedImage ? 'is-active' : ''}
                  type="button"
                  key={`${image}-${index}`}
                  onClick={() => setSelectedImage(image)}
                >
                  <img src={image} alt={`Ảnh xe ${index + 1}`} />
                </button>
              ))}
            </div>
          </section>

          <section className="car-detail-card">
            <div className="car-detail-card__heading">
              <p className="site-eyebrow">Thông tin xe</p>
              <h2>{car.brand} dành cho lịch trình linh hoạt</h2>
            </div>
            <p>{car.description}</p>
            <div className="car-spec-grid">
              {specs.map((spec) => (
                <div className="car-spec" key={spec.label}>
                  <span>{spec.label}</span>
                  <strong>{spec.value}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="car-detail-card">
            <div className="car-detail-card__heading">
              <p className="site-eyebrow">Giao nhận xe</p>
              <h2>Địa điểm rõ ràng, thuận tiện trước chuyến đi</h2>
            </div>
            <div className="car-location-box">
              <strong>{car.location}</strong>
              <p>{car.deliveryLocation}</p>
            </div>
          </section>

          <section className="car-trust">
            {detailNotes.map((note) => (
              <article key={note.title}>
                <span aria-hidden="true">✓</span>
                <div>
                  <h3>{note.title}</h3>
                  <p>{note.description}</p>
                </div>
              </article>
            ))}
          </section>
        </div>

        <aside className="booking-summary" aria-label="Tóm tắt đặt xe">
          <div className="booking-summary__price">
            <span>Giá thuê từ</span>
            <div>
              <strong>{formatCurrency(car.pricePerDay)}đ</strong>
              <small>/ ngày</small>
            </div>
          </div>

          <form className="booking-summary__form" onSubmit={handleBookingSubmit}>
            <label>
              <span>Ngày nhận xe</span>
              <input
                type="date"
                value={pickupDate}
                onChange={(event) => setPickupDate(event.target.value)}
              />
            </label>
            <label>
              <span>Ngày trả xe</span>
              <input
                type="date"
                value={returnDate}
                onChange={(event) => setReturnDate(event.target.value)}
              />
            </label>
            <button type="submit">Đặt xe ngay</button>
          </form>

          <div className="booking-summary__note">
            <strong>Chưa cần thanh toán ngay</strong>
            <p>Bạn có thể gửi yêu cầu đặt xe trước, hệ thống sẽ giữ xe trong thời gian chờ xác nhận.</p>
          </div>
        </aside>
      </section>
    </main>
  )
}
