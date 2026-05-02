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
    title: 'Hỗ trợ nhanh trong chuyến đi',
    description: 'Đội ngũ hỗ trợ sẵn sàng đồng hành khi bạn cần thay đổi lịch trình.',
  },
  {
    title: 'Chính sách hủy rõ ràng',
    description: 'Thông tin phí và điều kiện hủy được hiển thị trước khi thanh toán.',
  },
]

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN').format(Number(value || 0))
}

function normalizeCar(payload, id) {
  const data = payload?.data ?? payload

  if (!data || typeof data !== 'object') {
    return { ...fallbackCar, id: id || fallbackCar.id }
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
        : [data.primaryImageUrl, data.imageUrl, data.thumbnailUrl, fallbackCar.images[0]].filter(Boolean),
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
    <main className="car-detail-page">
      <section className="car-detail-hero" aria-labelledby="car-detail-title">
        <div className="car-detail-hero__backdrop" aria-hidden="true" />
        <div className="car-detail-hero__overlay" aria-hidden="true" />

        <header className="cars-nav">
          <a className="cars-nav__brand" href="/" aria-label="Carento">
            <img src="/logo.png" alt="" aria-hidden="true" />
            <span>Carento</span>
          </a>

          <nav className="cars-nav__links" aria-label="Điều hướng chính">
            <a href="/">Trang chủ</a>
            <a href="/cars" aria-current="page">
              Danh sách xe
            </a>
            <a href="/my-bookings">Đặt xe của tôi</a>
          </nav>

          <div className="cars-nav__actions">
            <a className="cars-button cars-button--secondary" href="/login">
              Đăng nhập
            </a>
            <a className="cars-button cars-button--primary" href="/register">
              Tạo tài khoản
            </a>
          </div>
        </header>

        <div className="car-detail-hero__content">
          <p className="cars-eyebrow">Showroom chi tiết xe</p>
          <h1 id="car-detail-title">{car.name}</h1>
          <p>
            {car.brand} tại {car.location}. Kiểm tra ảnh xe thực tế, thông số nhanh và lịch
            nhận xe trước khi xác nhận đặt.
          </p>
          {notice ? (
            <span className="car-detail-hero__notice" role="status">
              {notice}
            </span>
          ) : null}
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

          <section className="car-detail-section">
            <div className="car-detail-section__heading">
              <p className="cars-eyebrow">Thông tin xe</p>
              <h2>{car.brand} phù hợp cho hành trình linh hoạt</h2>
            </div>
            <p className="car-detail-section__description">{car.description}</p>
            <div className="car-spec-grid">
              {specs.map((spec) => (
                <article className="car-spec" key={spec.label}>
                  <span>{spec.label}</span>
                  <strong>{spec.value}</strong>
                </article>
              ))}
            </div>
          </section>

          <section className="car-detail-section car-detail-section--split">
            <div>
              <p className="cars-eyebrow">Giao nhận xe</p>
              <h2>Điểm nhận xe thuận tiện, thông tin rõ ràng trước chuyến đi</h2>
              <p className="car-detail-section__description">{car.deliveryLocation}</p>
            </div>
            <div className="car-owner-note">
              <span>Chủ xe</span>
              <strong>{car.ownerName}</strong>
              <p>{car.location}</p>
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
                required
              />
            </label>
            <label>
              <span>Ngày trả xe</span>
              <input
                type="date"
                value={returnDate}
                onChange={(event) => setReturnDate(event.target.value)}
                required
              />
            </label>
            <button type="submit">Đặt xe ngay</button>
          </form>

          <div className="booking-summary__note">
            <strong>Giữ xe trong thời gian chờ thanh toán</strong>
            <p>
              Sau khi xác nhận, đơn đặt xe sẽ ở trạng thái chờ thanh toán và được giữ theo
              thời gian hệ thống quy định.
            </p>
          </div>
        </aside>
      </section>
    </main>
  )
}
