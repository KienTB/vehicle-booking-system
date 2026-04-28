import './HomePage.css'

const trustMetrics = [
  { value: '1.200+', label: 'xe sẵn sàng cho thuê' },
  { value: '24/7', label: 'hỗ trợ trong suốt chuyến đi' },
  { value: '98%', label: 'khách hàng hài lòng' },
]

const featuredCars = [
  {
    id: 1,
    name: 'Toyota Vios 2023',
    brand: 'Toyota',
    type: 'Sedan tiết kiệm',
    location: 'Quận 1, TP. Hồ Chí Minh',
    price: '720.000đ',
    specs: ['5 chỗ', 'Tự động', 'Xăng'],
  },
  {
    id: 2,
    name: 'Mazda CX-5 Premium',
    brand: 'Mazda',
    type: 'SUV gia đình',
    location: 'Cầu Giấy, Hà Nội',
    price: '1.150.000đ',
    specs: ['5 chỗ', 'Tự động', 'Xăng'],
  },
  {
    id: 3,
    name: 'Kia Carnival Luxury',
    brand: 'Kia',
    type: 'MPV cao cấp',
    location: 'Hải Châu, Đà Nẵng',
    price: '1.680.000đ',
    specs: ['7 chỗ', 'Tự động', 'Dầu'],
  },
]

const benefits = [
  'Xe được kiểm định trước mỗi chuyến',
  'Giá thuê minh bạch, không phí ẩn',
  'Đặt xe nhanh, xác nhận rõ ràng',
]

const steps = [
  'Chọn địa điểm và thời gian thuê',
  'So sánh xe phù hợp với nhu cầu',
  'Xác nhận đặt xe và bắt đầu hành trình',
]

export function HomePage() {
  return (
    <main className="site-page home-page">
      <header className="site-nav">
        <a className="site-nav__brand" href="/" aria-label="Carento">
          <img src="/logo.png" alt="" aria-hidden="true" />
          <span>Carento</span>
        </a>

        <nav className="site-nav__links" aria-label="Điều hướng chính">
          <a href="/" aria-current="page">
            Trang chủ
          </a>
          <a href="/cars">Danh sách xe</a>
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

      <section className="site-hero home-hero">
        <div className="site-hero__content">
          <p className="site-eyebrow">Thuê xe tự lái dễ dàng</p>
          <h1>Đặt chiếc xe phù hợp cho mọi hành trình của bạn.</h1>
          <p>
            Tìm xe nhanh, xem giá rõ ràng và chủ động lịch trình với những mẫu
            xe đã được kiểm định trên Carento.
          </p>

          <form className="site-search home-search" aria-label="Tìm kiếm xe thuê">
            <label>
              <span>Địa điểm nhận xe</span>
              <input type="text" placeholder="Nhập thành phố hoặc quận" />
            </label>
            <label>
              <span>Ngày nhận xe</span>
              <input type="date" />
            </label>
            <label>
              <span>Ngày trả xe</span>
              <input type="date" />
            </label>
            <a className="site-search__button" href="/cars">
              Tìm xe phù hợp
            </a>
          </form>

          <div className="home-hero__metrics" aria-label="Chỉ số tin cậy">
            {trustMetrics.map((item) => (
              <div key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="site-hero__visual" aria-label="Hình ảnh xe nổi bật">
          <img
            src="/background.png"
            alt="Xe hiện đại trên nền cảnh thành phố, phù hợp cho dịch vụ đặt xe tự lái"
          />
          <div className="site-hero__note">
            <strong>Đặt xe trong vài phút</strong>
            <span>Xác nhận nhanh, hỗ trợ tận nơi khi bạn cần.</span>
          </div>
        </div>
      </section>

      <section className="site-section home-section" id="benefits">
        <div className="site-section__heading">
          <p className="site-eyebrow">Vì sao chọn Carento</p>
          <h2>An tâm hơn trong từng chuyến đi</h2>
        </div>
        <div className="home-benefits">
          {benefits.map((benefit) => (
            <article className="home-benefit-card" key={benefit}>
              <span aria-hidden="true">✓</span>
              <p>{benefit}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="site-section home-section" id="featured-cars">
        <div className="site-section__heading">
          <p className="site-eyebrow">Xe được quan tâm</p>
          <h2>Lựa chọn nổi bật cho hôm nay</h2>
        </div>

        <div className="vehicle-grid">
          {featuredCars.map((car) => (
            <article className="vehicle-card" key={car.name}>
              <a className="vehicle-card__media" href={`/cars/${car.id}`}>
                <img src="/background.png" alt={`Hình ảnh ${car.name}`} />
                <span>{car.type}</span>
              </a>
              <div className="vehicle-card__body">
                <div className="vehicle-card__title">
                  <span>{car.brand}</span>
                  <h3>{car.name}</h3>
                  <p>{car.location}</p>
                </div>
                <div className="vehicle-card__specs">
                  {car.specs.map((spec) => (
                    <small key={spec}>{spec}</small>
                  ))}
                </div>
                <div className="vehicle-card__footer">
                  <div>
                    <strong>{car.price}</strong>
                    <span>/ ngày</span>
                  </div>
                  <a href={`/cars/${car.id}`}>Xem chi tiết</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="site-section home-process" id="steps">
        <div className="site-section__heading">
          <p className="site-eyebrow">Quy trình đơn giản</p>
          <h2>Ba bước để bắt đầu chuyến đi</h2>
        </div>
        <div className="home-process__grid">
          {steps.map((step, index) => (
            <article className="home-process__card" key={step}>
              <span>{index + 1}</span>
              <p>{step}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="site-cta">
        <div>
          <p className="site-eyebrow">Sẵn sàng lên đường</p>
          <h2>Tìm xe phù hợp và đặt lịch ngay hôm nay.</h2>
        </div>
        <a className="site-button site-button--primary" href="/cars">
          Khám phá xe phù hợp
        </a>
      </section>
    </main>
  )
}
