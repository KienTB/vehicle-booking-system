import { useEffect, useMemo, useState } from 'react'
import './CarListingPage.css'

const defaultFilters = {
  location: '',
  pickupDate: '',
  returnDate: '',
  seats: '',
  minPrice: '',
  maxPrice: '',
  brand: '',
  fuelType: '',
  transmission: '',
}

const fallbackCars = [
  {
    id: 1,
    name: 'Toyota Vios 2023',
    brand: 'Toyota',
    location: 'Quận 1, TP. Hồ Chí Minh',
    seats: 5,
    transmission: 'AUTOMATIC',
    fuelType: 'GASOLINE',
    pricePerDay: 720000,
    status: 'AVAILABLE',
    imageUrl: '/background.png',
  },
  {
    id: 2,
    name: 'Mazda CX-5 Premium',
    brand: 'Mazda',
    location: 'Cầu Giấy, Hà Nội',
    seats: 5,
    transmission: 'AUTOMATIC',
    fuelType: 'GASOLINE',
    pricePerDay: 1150000,
    status: 'AVAILABLE',
    imageUrl: '/background.png',
  },
  {
    id: 3,
    name: 'Kia Carnival Luxury',
    brand: 'Kia',
    location: 'Hải Châu, Đà Nẵng',
    seats: 7,
    transmission: 'AUTOMATIC',
    fuelType: 'DIESEL',
    pricePerDay: 1680000,
    status: 'AVAILABLE',
    imageUrl: '/background.png',
  },
  {
    id: 4,
    name: 'VinFast VF 8 Eco',
    brand: 'VinFast',
    location: 'Thủ Đức, TP. Hồ Chí Minh',
    seats: 5,
    transmission: 'AUTOMATIC',
    fuelType: 'ELECTRIC',
    pricePerDay: 1320000,
    status: 'AVAILABLE',
    imageUrl: '/background.png',
  },
  {
    id: 5,
    name: 'Ford Everest Titanium',
    brand: 'Ford',
    location: 'Nam Từ Liêm, Hà Nội',
    seats: 7,
    transmission: 'AUTOMATIC',
    fuelType: 'DIESEL',
    pricePerDay: 1450000,
    status: 'AVAILABLE',
    imageUrl: '/background.png',
  },
  {
    id: 6,
    name: 'Hyundai Accent 2022',
    brand: 'Hyundai',
    location: 'Nha Trang, Khánh Hòa',
    seats: 5,
    transmission: 'MANUAL',
    fuelType: 'GASOLINE',
    pricePerDay: 650000,
    status: 'AVAILABLE',
    imageUrl: '/background.png',
  },
]

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

function normalizeCars(payload) {
  const data = payload?.data ?? payload
  const list = data?.content ?? data?.items ?? data

  if (!Array.isArray(list)) {
    return []
  }

  return list.map((car) => ({
    id: car.id,
    name: car.name || `${car.brand || 'Xe'} ${car.model || ''}`.trim(),
    brand: car.brand || 'Đang cập nhật',
    location: car.location || 'Đang cập nhật địa điểm',
    seats: car.seats,
    transmission: car.transmission,
    fuelType: car.fuelType,
    pricePerDay: car.pricePerDay ?? car.dailyPrice ?? car.price,
    status: car.status,
    imageUrl:
      car.primaryImageUrl ||
      car.imageUrl ||
      car.thumbnailUrl ||
      car.images?.find((image) => image.primary)?.url ||
      car.images?.[0]?.url ||
      '/background.png',
  }))
}

function buildQuery(filters) {
  const params = new URLSearchParams()
  params.set('onlyAvailable', 'true')

  if (filters.location) params.set('location', filters.location)
  if (filters.seats) params.append('seats', filters.seats)
  if (filters.brand) params.set('brand', filters.brand)
  if (filters.fuelType) params.set('fuelType', filters.fuelType)
  if (filters.transmission) params.set('transmission', filters.transmission)
  if (filters.minPrice) params.set('minPrice', filters.minPrice)
  if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)

  return params.toString()
}

export function CarListingPage() {
  const [filters, setFilters] = useState(defaultFilters)
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters)
  const [cars, setCars] = useState(fallbackCars)
  const [isLoading, setIsLoading] = useState(false)
  const [notice, setNotice] = useState('')

  const resultLabel = useMemo(() => {
    if (isLoading) return 'Đang tìm xe phù hợp'
    return `${cars.length} xe phù hợp`
  }, [cars.length, isLoading])

  useEffect(() => {
    const controller = new AbortController()

    async function loadCars() {
      setIsLoading(true)
      setNotice('')

      try {
        const query = buildQuery(appliedFilters)
        const response = await fetch(`/api/cars?${query}`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Không thể tải danh sách xe')
        }

        const payload = await response.json()
        const nextCars = normalizeCars(payload)
        setCars(nextCars)

        if (nextCars.length === 0) {
          setNotice('Chưa tìm thấy xe phù hợp với bộ lọc hiện tại.')
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          setCars(fallbackCars)
          setNotice('Đang hiển thị dữ liệu mẫu vì chưa kết nối được danh sách xe từ hệ thống.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadCars()

    return () => controller.abort()
  }, [appliedFilters])

  function handleChange(event) {
    const { name, value } = event.target

    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setAppliedFilters(filters)
  }

  function handleReset() {
    setFilters(defaultFilters)
    setAppliedFilters(defaultFilters)
  }

  return (
    <main className="cars-page">
      <section className="cars-hero" aria-labelledby="cars-title">
        <div className="cars-hero__backdrop" aria-hidden="true" />
        <div className="cars-hero__overlay" aria-hidden="true" />

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

        <div className="cars-hero__content">
          <p className="cars-eyebrow">Danh sách xe thuê</p>
          <h1 id="cars-title">Khám phá mẫu xe phù hợp cho lịch trình của bạn.</h1>
          <p>
            Chọn theo địa điểm, thời gian, ngân sách và nhu cầu sử dụng. Mỗi lựa chọn đều ưu
            tiên rõ ràng về giá và thông tin vận hành.
          </p>

          <form className="cars-filter" onSubmit={handleSubmit} aria-label="Bộ lọc xe thuê">
            <div className="cars-filter__main">
              <label>
                <span>Địa điểm nhận xe</span>
                <input
                  name="location"
                  type="text"
                  placeholder="Thành phố hoặc quận"
                  value={filters.location}
                  onChange={handleChange}
                />
              </label>

              <label>
                <span>Ngày nhận xe</span>
                <input
                  name="pickupDate"
                  type="date"
                  value={filters.pickupDate}
                  onChange={handleChange}
                />
              </label>

              <label>
                <span>Ngày trả xe</span>
                <input
                  name="returnDate"
                  type="date"
                  value={filters.returnDate}
                  onChange={handleChange}
                />
              </label>

              <button className="cars-filter__submit" type="submit">
                Tìm xe
              </button>
            </div>

            <div className="cars-filter__advanced">
              <label>
                <span>Số chỗ</span>
                <select name="seats" value={filters.seats} onChange={handleChange}>
                  <option value="">Tất cả</option>
                  <option value="4">4 chỗ</option>
                  <option value="5">5 chỗ</option>
                  <option value="7">7 chỗ</option>
                  <option value="8">8 chỗ</option>
                  <option value="9">9 chỗ</option>
                </select>
              </label>

              <label>
                <span>Giá từ</span>
                <input
                  name="minPrice"
                  type="number"
                  min="0"
                  placeholder="Tối thiểu"
                  value={filters.minPrice}
                  onChange={handleChange}
                />
              </label>

              <label>
                <span>Giá đến</span>
                <input
                  name="maxPrice"
                  type="number"
                  min="0"
                  placeholder="Tối đa"
                  value={filters.maxPrice}
                  onChange={handleChange}
                />
              </label>

              <label>
                <span>Hãng xe</span>
                <input
                  name="brand"
                  type="text"
                  placeholder="Toyota, Mazda, VinFast..."
                  value={filters.brand}
                  onChange={handleChange}
                />
              </label>

              <label>
                <span>Nhiên liệu</span>
                <select name="fuelType" value={filters.fuelType} onChange={handleChange}>
                  <option value="">Tất cả</option>
                  <option value="GASOLINE">Xăng</option>
                  <option value="DIESEL">Dầu</option>
                  <option value="ELECTRIC">Điện</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </label>

              <label>
                <span>Hộp số</span>
                <select
                  name="transmission"
                  value={filters.transmission}
                  onChange={handleChange}
                >
                  <option value="">Tất cả</option>
                  <option value="AUTOMATIC">Tự động</option>
                  <option value="MANUAL">Số sàn</option>
                </select>
              </label>

              <button className="cars-filter__reset" type="button" onClick={handleReset}>
                Xóa lọc
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="cars-results" aria-live="polite">
        <div className="cars-results__header">
          <div>
            <p className="cars-eyebrow">Xe sẵn sàng</p>
            <h2>{resultLabel}</h2>
          </div>
          <span>{notice || 'Giá hiển thị theo ngày thuê, chưa bao gồm chi phí phát sinh.'}</span>
        </div>

        {isLoading ? (
          <div className="vehicle-grid" aria-label="Đang tải danh sách xe">
            {Array.from({ length: 6 }).map((_, index) => (
              <article className="vehicle-card vehicle-card--loading" key={index}>
                <div className="vehicle-card__media"></div>
                <div className="vehicle-card__body">
                  <span></span>
                  <strong></strong>
                  <p></p>
                </div>
              </article>
            ))}
          </div>
        ) : cars.length > 0 ? (
          <div className="vehicle-grid">
            {cars.map((car) => (
              <article className="vehicle-card" key={car.id || car.name}>
                <a className="vehicle-card__media" href={`/cars/${car.id}`}>
                  <img src={car.imageUrl} alt={`Hình ảnh ${car.name}`} />
                  <span>{car.status === 'AVAILABLE' ? 'Sẵn sàng' : 'Đang cập nhật'}</span>
                </a>

                <div className="vehicle-card__body">
                  <div className="vehicle-card__title">
                    <span>{car.brand}</span>
                    <h3>{car.name}</h3>
                    <p>{car.location}</p>
                  </div>

                  <div className="vehicle-card__specs">
                    <small>{car.seats || '-'} chỗ</small>
                    <small>{transmissionLabels[car.transmission] || 'Hộp số'}</small>
                    <small>{fuelTypeLabels[car.fuelType] || 'Nhiên liệu'}</small>
                  </div>

                  <div className="vehicle-card__footer">
                    <div>
                      <strong>{formatCurrency(car.pricePerDay)}đ</strong>
                      <span>/ ngày</span>
                    </div>
                    <a href={`/cars/${car.id}`}>Xem chi tiết</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="cars-empty">
            <h3>Chưa tìm thấy xe phù hợp</h3>
            <p>Thử đổi địa điểm, số chỗ hoặc khoảng giá để xem thêm lựa chọn.</p>
            <button type="button" onClick={handleReset}>
              Đặt lại bộ lọc
            </button>
          </div>
        )}
      </section>
    </main>
  )
}
