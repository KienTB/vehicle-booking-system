import './App.css'
import { AuthLayout } from './components/auth/AuthLayout'
import { ChangePasswordPage } from './pages/auth/ChangePasswordPage'
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage'
import { LoginPage } from './pages/auth/LoginPage'
import { OtpPage } from './pages/auth/OtpPage'
import { RegisterPage } from './pages/auth/RegisterPage'
import { UserProfilePage } from './pages/account/UserProfilePage'
import { BookingPage } from './pages/bookings/BookingPage'
import { MyBookingsPage } from './pages/bookings/MyBookingsPage'
import { CarDetailPage } from './pages/cars/CarDetailPage'
import { CarListingPage } from './pages/cars/CarListingPage'
import { HomePage } from './pages/home/HomePage'
import { MyInvoicesPage } from './pages/payments/MyInvoicesPage'

const authPages = {
  '/login': {
    title: 'Chào mừng quay lại',
    description:
      'Đăng nhập để tiếp tục đặt xe, theo dõi lịch thuê và quản lý chuyến đi của bạn.',
    component: <LoginPage />,
  },
  '/verify-otp': {
    title: 'Nhập mã xác thực',
    description:
      'Nhập mã OTP vừa được gửi đến email hoặc số điện thoại của bạn để tiếp tục đặt lại mật khẩu.',
    component: <OtpPage />,
  },
  '/forgot-password': {
    title: 'Khôi phục mật khẩu',
    description:
      'Nhập số điện thoại hoặc email đã đăng ký để nhận hướng dẫn đặt lại mật khẩu cho tài khoản của bạn.',
    component: <ForgotPasswordPage />,
  },
  '/change-password': {
    title: 'Đổi mật khẩu',
    description:
      'Tạo mật khẩu mới để bảo vệ tài khoản và tiếp tục quản lý chuyến xe an toàn hơn.',
    component: <ChangePasswordPage />,
  },
  '/register': {
    title: 'Tạo tài khoản',
    description:
      'Lưu thông tin đặt xe, theo dõi lịch thuê và nhận hỗ trợ nhanh hơn trong mỗi chuyến đi.',
    component: <RegisterPage />,
  },
}

function App() {
  const pathname = window.location.pathname
  const currentAuthPage = authPages[pathname]

  if (currentAuthPage) {
    return (
      <AuthLayout
        title={currentAuthPage.title}
        description={currentAuthPage.description}
      >
        {currentAuthPage.component}
      </AuthLayout>
    )
  }

  if (pathname === '/cars') {
    return <CarListingPage />
  }

  if (pathname === '/booking') {
    return <BookingPage />
  }

  if (pathname === '/my-bookings') {
    return <MyBookingsPage />
  }

  if (pathname === '/invoices') {
    return <MyInvoicesPage />
  }

  if (pathname === '/profile') {
    return <UserProfilePage />
  }

  if (pathname.startsWith('/cars/')) {
    const carId = pathname.split('/')[2]
    return <CarDetailPage carId={carId} />
  }

  return <HomePage />
}

export default App
