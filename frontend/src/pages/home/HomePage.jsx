import { useEffect, useRef } from 'react'
import './HomePage.css'

const platformBenefits = [
  'Xe được kiểm duyệt trước khi mở lịch thuê',
  'Giá thuê minh bạch theo từng ngày',
  'Quy trình đặt xe tối ưu, xác nhận nhanh',
  'Hỗ trợ toàn hành trình khi cần thay đổi',
]

const hostBenefits = [
  'Tăng thu nhập từ xe nhàn rỗi với quy trình rõ ràng',
  'Chủ động lịch cho thuê, thời gian bàn giao và mức giá',
  'Được hỗ trợ vận hành và chăm sóc khách thuê xuyên suốt',
]

const memberOffers = [
  'Ưu đãi giảm giá theo hạng thành viên',
  'Voucher định kỳ cho các chuyến đi cuối tuần',
  'Quyền lợi đặt xe sớm với các dòng xe nổi bật',
]

const BRAND_LOGOS = [
  { src: '/audi-logo.png', alt: 'Audi' },
  { src: '/bentley-logo.png', alt: 'Bentley' },
  { src: '/bmw-logo.png', alt: 'BMW' },
  { src: '/cadillac-logo.png', alt: 'Cadillac' },
  { src: '/ferrari-logo.png', alt: 'Ferrari' },
  { src: '/ford-logo.png', alt: 'Ford' },
  { src: '/honda-logo.png', alt: 'Honda' },
  { src: '/hyundai-logo.png', alt: 'Hyundai' },
  { src: '/Land-Rover-logo.png', alt: 'Land Rover' },
  { src: '/Lexus-logo.png', alt: 'Lexus' },
  { src: '/Maybach-logo.png', alt: 'Maybach' },
  { src: '/nissan-logo.png', alt: 'Nissan' },
  { src: '/porsche-logo.png', alt: 'Porsche' },
  { src: '/tesla-logo.png', alt: 'Tesla' },
  { src: '/toyota-logo.png', alt: 'Toyota' },
  { src: '/vinfast-logo.png', alt: 'Vinfast' },
]

function spawnPuff(container, count = 1) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const p = document.createElement('div')
      p.className = 'car-cta__puff'
      const size = 8 + Math.random() * 7
      p.style.cssText = [
        `width:${size}px`,
        `height:${size}px`,
        `top:${-4 + Math.random() * 8}px`,
        `left:${Math.random() * 4}px`,
        `animation-delay:${Math.random() * 0.1}s`,
      ].join(';')
      container.appendChild(p)
      setTimeout(() => p.remove(), 800)
    }, i * 65)
  }
}

function CarButton({ emoji, label, href, delay }) {
  const carRef  = useRef(null)
  const puffRef = useRef(null)
  const revRef  = useRef(null)
  const doneRef = useRef(false)

  useEffect(() => {
    const car = carRef.current
    if (!car) return
    const onEnd = (e) => {
      if (e.animationName === 'car-drive-in') {
        car.classList.remove('is-entering')
        car.classList.add('is-idle')
      }
    }
    car.addEventListener('animationend', onEnd)
    return () => car.removeEventListener('animationend', onEnd)
  }, [])

  const handleEnter = () => {
    if (doneRef.current) return
    carRef.current?.classList.add('is-revving')
    revRef.current = setInterval(() => spawnPuff(puffRef.current, 1), 190)
  }

  const handleLeave = () => {
    carRef.current?.classList.remove('is-revving')
    clearInterval(revRef.current)
  }

  const handleClick = (e) => {
    e.preventDefault()
    if (doneRef.current) return
    doneRef.current = true
    clearInterval(revRef.current)
    carRef.current?.classList.remove('is-revving')
    spawnPuff(puffRef.current, 6)
    setTimeout(() => {
      carRef.current?.classList.remove('is-idle')
      carRef.current?.classList.add('is-vroom')
      setTimeout(() => { window.location.href = href }, 480)
    }, 80)
  }

  return (
    <button
      className="car-cta__btn"
      title={label}
      aria-label={label}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      style={{ '--car-delay': `${delay}ms` }}
    >
      <div className="car-cta__track">
        <span
          ref={carRef}
          className="car-cta__emoji is-entering"
          aria-hidden="true"
        >
          {emoji}
        </span>
        <div ref={puffRef} className="car-cta__puff-wrap" aria-hidden="true" />
      </div>
      <span className="car-cta__label">{label}</span>
    </button>
  )
}

export function HomePage() {
  return (
    <main className="home-page">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero__backdrop" aria-hidden="true" />
        <div className="home-hero__overlay" aria-hidden="true" />

        <header className="home-nav">
          <a className="home-nav__brand" href="/" aria-label="Carento">
            <img src="/logo.png" alt="" aria-hidden="true" />
            <span>Carento</span>
          </a>

          <nav className="home-nav__links" aria-label="Điều hướng chính">
            <a href="/" aria-current="page">Trang chủ</a>
            <a href="/cars">Danh sách xe</a>
            <a href="/become-host">Đăng ký cho thuê xe</a>
            <a href="/offers">Ưu đãi & Thành viên</a>
          </nav>

          <div className="home-nav__actions">
            <a className="home-button home-button--primary" href="/login">
              Đăng nhập
            </a>
          </div>
        </header>

        <div className="home-hero__content">
          <p className="home-eyebrow">Nền tảng di chuyển cao cấp</p>
          <h1 id="home-title">
            Carento mang đến trải nghiệm thuê xe tiện lợi, minh bạch và an tâm.
          </h1>
          <p className="home-hero__summary">
            Từ các chuyến đi công việc đến nghỉ dưỡng cuối tuần, Carento giúp bạn lựa chọn xe
            nhanh hơn với chất lượng được kiểm soát và quy trình nhất quán.
          </p>

          <div className="hero-marquee" aria-label="Các hãng xe trên Carento">
            <div className="hero-marquee__label">Có mặt trên nền tảng</div>
            <div className="hero-marquee__track" aria-hidden="true">
              <div className="hero-marquee__inner">
                {[...BRAND_LOGOS, ...BRAND_LOGOS].map((logo, i) => (
                  <img
                    key={i}
                    src={logo.src}
                    alt={logo.alt}
                    className="hero-marquee__logo"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-manifesto" aria-label="Tuyên ngôn Carento">
        <div className="home-manifesto__content">
          <p className="home-eyebrow home-eyebrow--dark">Why Carento</p>
          <h2>Nền tảng thuê xe tập trung vào chất lượng dịch vụ và sự minh bạch.</h2>
          <p>
            Carento kết hợp vận hành công nghệ và trải nghiệm dịch vụ thực tế để mỗi chuyến đi của
            bạn luôn rõ ràng từ lúc chọn xe đến khi hoàn tất hành trình.
          </p>
        </div>
        <figure className="home-manifesto__visual">
          <img src="/image2.jpg" alt="Hành trình lái xe trên cung đường rộng mở" />
        </figure>
      </section>

      <section className="home-benefit-rail" aria-label="Ba lý do chọn Carento">
        {platformBenefits.slice(0, 3).map((item) => (
          <article key={item}>
            <span>0{platformBenefits.indexOf(item) + 1}</span>
            <p>{item}</p>
          </article>
        ))}
      </section>

      <section className="home-campaign" aria-label="Dành cho chủ xe">
        <div className="home-campaign__backdrop" aria-hidden="true">
          <img src="/image3.jpg" alt="" />
        </div>
        <div className="home-campaign__content">
          <p className="home-eyebrow">Dành cho chủ xe</p>
          <h2>Biến xe nhàn rỗi thành nguồn thu ổn định cùng Carento.</h2>
          <p>
            Chúng tôi cung cấp quy trình đăng ký rõ ràng, hỗ trợ vận hành và tiêu chuẩn dịch vụ
            nhất quán để bạn cho thuê xe hiệu quả hơn.
          </p>
          <ul>
            {hostBenefits.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <a className="home-button home-button--primary" href="/become-host">
            Đăng ký cho thuê xe
          </a>
        </div>
      </section>

      <section className="home-member-banner" aria-label="Ưu đãi và thành viên">
        <figure className="home-member-banner__visual" aria-hidden="true">
          <img src="/image4.jpg" alt="" />
        </figure>
        <div className="home-member-banner__content">
          <p className="home-eyebrow">Ưu đãi & thành viên</p>
          <h2>Tích lũy quyền lợi để mỗi chuyến đi trở nên linh hoạt hơn.</h2>
          <ul className="home-member-banner__list">
            {memberOffers.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <a className="home-member-banner__link" href="/offers">
            Xem thêm ưu đãi
          </a>
        </div>
      </section>

      <footer className="home-footer" aria-label="Điều hướng và hỗ trợ cuối trang">
        <div className="home-footer__trust">
          {platformBenefits.slice(0, 3).map((note) => (
            <p key={note}>{note}</p>
          ))}
        </div>

        <div className="home-footer__main">
          <div className="home-footer__brand">
            <a href="/" aria-label="Carento">
              <img src="/logo.png" alt="" aria-hidden="true" />
              <strong>Carento</strong>
            </a>
            <p>Nền tảng kết nối thuê xe cao cấp với quy trình rõ ràng và trải nghiệm đáng tin cậy.</p>
          </div>

          <nav className="home-footer__nav" aria-label="Điều hướng nhanh">
            <h3>Điều hướng nhanh</h3>
            <a href="/">Trang chủ</a>
            <a href="/cars">Danh sách xe</a>
            <a href="/become-host">Đăng ký cho thuê xe</a>
            <a href="/offers">Ưu đãi & Thành viên</a>
          </nav>

          <section className="home-footer__support" aria-label="Hỗ trợ khách hàng">
            <h3>Hỗ trợ khách hàng</h3>
            <a href="tel:19001234">Hotline: 1900 1234</a>
            <a href="mailto:hotro@carento.vn">Email: hotro@carento.vn</a>
            <div className="home-footer__social" aria-label="Kết nối Carento">
              <a href="#" aria-label="Facebook Carento">Fb</a>
              <a href="#" aria-label="Instagram Carento">Ig</a>
              <a href="#" aria-label="Zalo Carento">Zl</a>
            </div>
          </section>
        </div>

        <div className="home-footer__bottom">
          <small>© 2026 Carento. Trải nghiệm di chuyển linh hoạt theo cách của bạn.</small>
        </div>
      </footer>
    </main>
  )
}