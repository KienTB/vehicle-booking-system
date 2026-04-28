const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const AUTH_USER_KEY = 'authUser'

function getStorage(remember = true) {
  return remember ? window.localStorage : window.sessionStorage
}

function clearAuthStorage() {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY)
  window.localStorage.removeItem(REFRESH_TOKEN_KEY)
  window.localStorage.removeItem(AUTH_USER_KEY)
  window.sessionStorage.removeItem(ACCESS_TOKEN_KEY)
  window.sessionStorage.removeItem(REFRESH_TOKEN_KEY)
  window.sessionStorage.removeItem(AUTH_USER_KEY)
}

function saveAuthSession(authData, remember = true) {
  const storage = getStorage(remember)
  clearAuthStorage()

  if (!authData) {
    return
  }

  if (authData.token) {
    storage.setItem(ACCESS_TOKEN_KEY, authData.token)
  }

  if (authData.refreshToken) {
    storage.setItem(REFRESH_TOKEN_KEY, authData.refreshToken)
  }

  storage.setItem(
    AUTH_USER_KEY,
    JSON.stringify({
      userId: authData.userId ?? null,
      name: authData.name ?? '',
      phone: authData.phone ?? '',
      role: authData.role ?? '',
    })
  )
}

function getAccessToken() {
  return (
    window.localStorage.getItem(ACCESS_TOKEN_KEY) ||
    window.sessionStorage.getItem(ACCESS_TOKEN_KEY)
  )
}

function getAuthUser() {
  const rawUser =
    window.localStorage.getItem(AUTH_USER_KEY) ||
    window.sessionStorage.getItem(AUTH_USER_KEY)

  if (!rawUser) {
    return null
  }

  try {
    return JSON.parse(rawUser)
  } catch {
    return null
  }
}

function isAuthenticated() {
  return Boolean(getAccessToken())
}

export { clearAuthStorage, getAccessToken, getAuthUser, isAuthenticated, saveAuthSession }
