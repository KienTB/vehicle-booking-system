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
import { CustomerHomePage } from './pages/home/CustomerHomePage'
import { HomePage } from './pages/home/HomePage'
import { MyInvoicesPage } from './pages/payments/MyInvoicesPage'
import { isAuthenticated } from './auth/authStorage'

const authPages = {
  '/login': {
    title: 'Chào mừng quay lại',
    description:
      'Đăng nhập để tiếp tục đặt xe, theo dõi lịch thuê và quản lý chuyến đi của bạn.',
    component: <LoginPage />,
  },
  '/verify-otp': {
    hideIntro: true,
    component: <OtpPage />,
  },
  '/forgot-password': {
    hideIntro: true,
    component: <ForgotPasswordPage />,
  },
  '/change-password': {
    hideIntro: true,
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
  const rawPathname = window.location.pathname
  const pathname =
    rawPathname.length > 1 && rawPathname.endsWith('/')
      ? rawPathname.slice(0, -1)
      : rawPathname
  const isAuthed = isAuthenticated()
  const currentAuthPage = authPages[pathname]

  if (currentAuthPage) {
    return (
      <AuthLayout
        title={currentAuthPage.title}
        description={currentAuthPage.description}
        hideIntro={currentAuthPage.hideIntro}
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

  if (pathname === '/dashboard') {
    return isAuthed ? <CustomerHomePage /> : <HomePage />
  }

  if (pathname === '/') {
    return isAuthed ? <CustomerHomePage /> : <HomePage />
  }

  if (pathname === '/home') {
    return <HomePage />
  }

  return <HomePage />
}

export default App
