import { useEffect, useMemo, useState } from 'react'
import './MyInvoicesPage.css'

const fallbackInvoices = [
  {
    id: 5001,
    status: 'UNPAID',
    amount: 2484000,
    dueText: 'Còn thời gian giữ xe',
    booking: {
      id: 1001,
      carName: 'Toyota Vios 2023',
      dateRange: '02/05/2026 - 05/05/2026',
    },
  },
  {
    id: 5002,
    status: 'PAID',
    amount: 2300000,
    dueText: 'Đã xác nhận thanh toán',
    booking: {
      id: 1002,
      carName: 'Mazda CX-5 Premium',
      dateRange: '10/04/2026 - 12/04/2026',
    },
  },
  {
    id: 5003,
    status: 'FAILED',
    amount: 3360000,
    dueText: 'Đơn đã hết hạn hoặc thanh toán thất bại',
    booking: {
      id: 1003,
      carName: 'Kia Carnival Luxury',
      dateRange: '18/03/2026 - 20/03/2026',
    },
  },
]

const statusLabels = {
  UNPAID: 'Chưa thanh toán',
  PAID: 'Đã thanh toán',
  FAILED: 'Thanh toán thất bại',
}

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN').format(Number(value || 0))
}

function formatDate(value) {
  if (!value) return ''

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value))
}

function normalizeInvoices(payload) {
  const data = payload?.data ?? payload
  const list = data?.content ?? data?.items ?? data

  if (!Array.isArray(list)) {
    return []
  }

  return list.map((invoice) => {
    const booking = invoice.booking || {}
    const car = booking.car || invoice.car || {}
    const pickupDate = booking.pickupDate || booking.startDate || booking.fromDate
    const returnDate = booking.returnDate || booking.endDate || booking.toDate

    return {
      id: invoice.id,
      status: invoice.status || 'UNPAID',
      amount: invoice.amount || invoice.totalAmount || invoice.totalPrice || invoice.price,
      dueText:
        invoice.status === 'PAID'
          ? 'Đã xác nhận thanh toán'
          : invoice.status === 'FAILED'
            ? 'Đơn đã hết hạn hoặc thanh toán thất bại'
            : 'Vui lòng thanh toán trong thời gian giữ xe',
      booking: {
        id: booking.id || invoice.bookingId,
        carName: car.name || booking.carName || 'Xe đã chọn',
        dateRange:
          pickupDate && returnDate
            ? `${formatDate(pickupDate)} - ${formatDate(returnDate)}`
            : 'Đang cập nhật lịch thuê',
      },
    }
  })
}

export function MyInvoicesPage() {
  const [invoices, setInvoices] = useState(fallbackInvoices)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    const token = localStorage.getItem('accessToken')

    async function loadInvoices() {
      try {
        const response = await fetch('/api/invoices/my-invoices', {
          signal: controller.signal,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })

        if (!response.ok) {
          throw new Error('Không thể tải danh sách hóa đơn')
        }

        const payload = await response.json()
        const nextInvoices = normalizeInvoices(payload)
        setInvoices(nextInvoices)
        setNotice(nextInvoices.length === 0 ? 'Bạn chưa có hóa đơn thanh toán nào.' : '')
      } catch (error) {
        if (error.name !== 'AbortError') {
          setInvoices(fallbackInvoices)
          setNotice('Đang hiển thị dữ liệu mẫu vì chưa kết nối được hóa đơn từ hệ thống.')
        }
      }
    }

    loadInvoices()

    return () => controller.abort()
  }, [])

  const summary = useMemo(
    () => ({
      total: invoices.length,
      unpaid: invoices.filter((invoice) => invoice.status === 'UNPAID').length,
      paid: invoices.filter((invoice) => invoice.status === 'PAID').length,
      failed: invoices.filter((invoice) => invoice.status === 'FAILED').length,
    }),
    [invoices]
  )

  return (
    <main className="site-page invoices-page">
      <header className="site-nav">
        <a className="site-nav__brand" href="/" aria-label="Carento">
          <img src="/logo.png" alt="" aria-hidden="true" />
          <span>Carento</span>
        </a>

        <nav className="site-nav__links" aria-label="Điều hướng chính">
          <a href="/">Trang chủ</a>
          <a href="/cars">Danh sách xe</a>
          <a href="/my-bookings">Đặt xe của tôi</a>
          <a href="/invoices" aria-current="page">
            Hóa đơn
          </a>
        </nav>

        <div className="site-nav__actions">
          <a className="site-button site-button--ghost" href="/my-bookings">
            Xem booking
          </a>
          <a className="site-button site-button--primary" href="/profile">
            Tài khoản
          </a>
        </div>
      </header>

      <section className="invoices-hero">
        <div>
          <p className="site-eyebrow">Hóa đơn & thanh toán</p>
          <h1>Quản lý thanh toán cho các chuyến xe của bạn.</h1>
          <p>
            Theo dõi hóa đơn, trạng thái thanh toán và thông tin chuyển khoản một cách rõ ràng,
            dễ kiểm tra trước mỗi chuyến đi.
          </p>
        </div>

        <div className="invoice-summary-strip" aria-label="Tổng quan hóa đơn">
          <article>
            <span>Tất cả</span>
            <strong>{summary.total}</strong>
          </article>
          <article>
            <span>Chưa thanh toán</span>
            <strong>{summary.unpaid}</strong>
          </article>
          <article>
            <span>Đã thanh toán</span>
            <strong>{summary.paid}</strong>
          </article>
          <article>
            <span>Thất bại</span>
            <strong>{summary.failed}</strong>
          </article>
        </div>
      </section>

      <section className="invoices-layout">
        <div className="invoice-list">
          <div className="invoice-list__heading">
            <div>
              <p className="site-eyebrow">Danh sách hóa đơn</p>
              <h2>{invoices.length} hóa đơn gần đây</h2>
            </div>
            {notice ? <span>{notice}</span> : <span>Thông tin thanh toán được đối soát theo hệ thống.</span>}
          </div>

          {invoices.length > 0 ? (
            <div className="invoice-card-list">
              {invoices.map((invoice) => (
                <article className="invoice-card" key={invoice.id}>
                  <div className="invoice-card__header">
                    <div>
                      <span>Mã hóa đơn</span>
                      <strong>#{invoice.id}</strong>
                    </div>
                    <span className={`invoice-status invoice-status--${invoice.status.toLowerCase()}`}>
                      {statusLabels[invoice.status] || 'Đang cập nhật'}
                    </span>
                  </div>

                  <div className="invoice-card__body">
                    <div>
                      <span>Booking liên quan</span>
                      <strong>#{invoice.booking.id} · {invoice.booking.carName}</strong>
                      <p>{invoice.booking.dateRange}</p>
                    </div>
                    <div>
                      <span>Số tiền</span>
                      <strong>{formatCurrency(invoice.amount)}đ</strong>
                      <p>{invoice.dueText}</p>
                    </div>
                  </div>

                  <div className="invoice-card__actions">
                    <a href={`/booking-detail?id=${invoice.booking.id}`}>Xem booking</a>
                    {invoice.status === 'UNPAID' ? (
                      <a className="invoice-card__pay" href="#payment-instruction">
                        Xem hướng dẫn thanh toán
                      </a>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="invoices-empty">
              <h3>Bạn chưa có hóa đơn nào</h3>
              <p>Khi tạo booking, hóa đơn thanh toán sẽ xuất hiện tại đây để bạn theo dõi.</p>
              <a className="site-button site-button--primary" href="/cars">
                Tìm xe ngay
              </a>
            </div>
          )}
        </div>

        <aside className="payment-instruction" id="payment-instruction" aria-label="Hướng dẫn thanh toán">
          <div className="payment-instruction__heading">
            <p className="site-eyebrow">Chuyển khoản</p>
            <h2>Thông tin thanh toán</h2>
            <p>Vui lòng ghi đúng nội dung chuyển khoản để hệ thống đối soát nhanh hơn.</p>
          </div>

          <div className="bank-card">
            <div>
              <span>Ngân hàng</span>
              <strong>VCB - Vietcombank</strong>
            </div>
            <div>
              <span>Số tài khoản</span>
              <strong>0123 456 789</strong>
            </div>
            <div>
              <span>Chủ tài khoản</span>
              <strong>CONG TY CARENTO</strong>
            </div>
            <div>
              <span>Nội dung</span>
              <strong>HD + mã hóa đơn</strong>
            </div>
          </div>

          <div className="payment-note">
            <strong>Lưu ý đối soát</strong>
            <p>
              Sau khi chuyển khoản, trạng thái hóa đơn sẽ được cập nhật khi thanh toán được
              xác nhận. Nếu cần hỗ trợ, hãy chuẩn bị mã hóa đơn và mã booking liên quan.
            </p>
          </div>
        </aside>
      </section>
    </main>
  )
}
