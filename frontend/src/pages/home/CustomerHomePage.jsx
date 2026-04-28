import { clearAuthStorage, getAuthUser } from '../../auth/authStorage'
import './CustomerHomePage.css'

const suggestedCars = [
  {
    id: 1,
    name: 'Toyota Vios 2023',
    brand: 'Toyota',
    location: 'Quận 1, TP. Hồ Chí Minh',
    price: '720.000đ',
    specs: ['5 chỗ', 'Tự động', 'Xăng'],
  },
  {
    id: 2,
    name: 'Mazda CX-5 Premium',
    brand: 'Mazda',
    location: 'Cầu Giấy, Hà Nội',
    price: '1.150.000đ',
    specs: ['5 chỗ', 'Tự động', 'Xăng'],
  },
  {
    id: 3,
    name: 'Kia Carnival Luxury',
    brand: 'Kia',
    location: 'Hải Châu, Đà Nẵng',
    price: '1.680.000đ',
    specs: ['7 chỗ', 'Tự động', 'Dầu'],
  },
]

export function CustomerHomePage() {
  const user = getAuthUser()
  const userName = user?.name?.trim() || user?.phone || 'bạn'

  function handleLogout(event) {
    event.preventDefault()
    clearAuthStorage()
    window.location.href = '/home'
  }

  return (
    <main className="home-page customer-home">
      <section className="home-hero customer-home__hero" aria-labelledby="customer-home-title">
        <div className="home-hero__backdrop" aria-hidden="true" />
        <div className="home-hero__overlay" aria-hidden="true" />

        <header className="home-nav">
          <a className="home-nav__brand" href="/" aria-label="Carento">
            <img src="/logo.png" alt="" aria-hidden="true" />
            <span>Carento</span>
          </a>

          <nav className="home-nav__links" aria-label="Điều hướng chính">
            <a href="/dashboard" aria-current="page">
              Trang của tôi
            </a>
            <a href="/cars">Danh sách xe</a>
            <a href="/my-bookings">Đặt xe của tôi</a>
            <a href="/invoices">Hóa đơn</a>
          </nav>

          <div className="home-nav__actions customer-home__actions">
            <a className="home-button home-button--secondary" href="/my-bookings">
              Đặt xe của tôi
            </a>
            <a className="home-button home-button--secondary" href="/profile">
              Hồ sơ
            </a>
            <a className="home-button home-button--primary" href="/home" onClick={handleLogout}>
              Đăng xuất
            </a>
          </div>
        </header>

        <div className="home-hero__content customer-home__content">
          <p className="home-eyebrow">Xin chào, {userName}</p>
          <h1 id="customer-home-title">Tiếp tục chọn xe cho lịch trình tiếp theo của bạn.</h1>
          <p className="home-hero__summary">
            Tìm xe nhanh theo điểm nhận, thời gian và nhu cầu sử dụng. Bạn có thể theo dõi
            booking, hóa đơn và hồ sơ ngay trong cùng một không gian.
          </p>

          <form className="home-search customer-home__search" aria-label="Tìm xe nhanh">
            <label>
              <span>Địa điểm nhận xe</span>
              <input type="text" placeholder="Thành phố hoặc quận" />
            </label>

            <label>
              <span>Ngày nhận xe</span>
              <input type="date" />
            </label>

            <label>
              <span>Ngày trả xe</span>
              <input type="date" />
            </label>

            <label>
              <span>Loại xe / số chỗ</span>
              <select defaultValue="">
                <option value="" disabled>
                  Chọn loại xe
                </option>
                <option value="4">Sedan 4-5 chỗ</option>
                <option value="7">SUV/MPV 7 chỗ</option>
                <option value="16">Minibus 16 chỗ</option>
              </select>
            </label>

            <label>
              <span>Hộp số</span>
              <select defaultValue="">
                <option value="" disabled>
                  Tất cả
                </option>
                <option value="AUTOMATIC">Tự động</option>
                <option value="MANUAL">Số sàn</option>
              </select>
            </label>

            <label>
              <span>Loại nhiên liệu</span>
              <select defaultValue="">
                <option value="" disabled>
                  Tất cả
                </option>
                <option value="GASOLINE">Xăng</option>
                <option value="DIESEL">Dầu</option>
                <option value="ELECTRIC">Điện</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </label>

            <label>
              <span>Khoảng giá</span>
              <select defaultValue="">
                <option value="" disabled>
                  Chọn mức giá
                </option>
                <option value="0-800000">Dưới 800.000đ/ngày</option>
                <option value="800000-1300000">800.000đ - 1.300.000đ/ngày</option>
                <option value="1300000-2000000">1.300.000đ - 2.000.000đ/ngày</option>
              </select>
            </label>

            <a className="home-search__submit" href="/cars">
              Tiếp tục tìm xe
            </a>
          </form>
        </div>
      </section>

      <section className="home-flow customer-home__main">
        <div className="home-flow__intro customer-home__intro">
          <div>
            <p className="home-eyebrow">Gợi ý cho bạn</p>
            <h2>Xe phù hợp để bạn đặt nhanh trong hôm nay.</h2>
          </div>
          <a href="/my-bookings">Xem tất cả đơn đặt xe</a>
        </div>

        <div className="home-cars customer-home__cars">
          {suggestedCars.map((car) => (
            <article className="home-car" key={car.id}>
              <a className="home-car__media" href={`/cars/${car.id}`}>
                <img src="/background.png" alt={`Hình ảnh ${car.name}`} />
              </a>
              <div className="home-car__content">
                <p>{car.brand}</p>
                <h3>{car.name}</h3>
                <span>{car.location}</span>
                <div className="home-car__specs">
                  {car.specs.map((spec) => (
                    <small key={spec}>{spec}</small>
                  ))}
                </div>
                <div className="home-car__footer">
                  <strong>{car.price}</strong>
                  <span>/ ngày</span>
                  <a href={`/cars/${car.id}`}>Xem chi tiết</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
