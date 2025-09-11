# TODO: Fix 401 Unauthorized Error

## Problem Analysis
- Frontend axios requests are failing with 401 status
- Backend auth middleware expects token in Authorization header or cookie
- Error occurs on /api/auth/me and /api/notifications endpoints
- Token may be expired, invalid, or not being sent properly

## Steps to Fix

### 1. Verify Cookie/Token Handling
- [x] Check if token cookie is being set properly on login/register
- [x] Verify cookie options (secure, sameSite, domain) work in current environment
- [x] Confirm frontend sends cookies with requests (withCredentials: true)
- [x] Add Authorization header fallback in axios
- [x] Store token in localStorage as backup
- [x] Update logout to clear localStorage token

### 2. Add Authorization Header Fallback
- [x] Modify axios.js to include Authorization header with Bearer token
- [x] Store token in localStorage/sessionStorage as backup
- [x] Update auth middleware to handle both cookie and header authentication

### 3. Review Backend Cookie Options
- [x] Check cookie settings in authController.js for production/development
- [x] Ensure sameSite and secure options work with frontend domain
- [x] Test cookie persistence across page reloads
- [x] Enhanced cookie settings for better cross-domain compatibility
- [x] Updated logout to use same cookie options for clearing

### 4. Add Token Refresh Mechanism
- [x] Implement token refresh endpoint in backend
- [x] Add automatic token refresh in frontend on 401 errors
- [x] Handle token expiration gracefully
- [x] Added axios response interceptor to automatically refresh token on 401
- [x] Clear invalid tokens and redirect to login on refresh failure

### 5. Add Enhanced Logging
- [ ] Add more detailed logging in auth middleware
- [ ] Log token presence, expiration, and validation errors
- [ ] Track request headers and cookies in failing requests

### 6. Test Authentication Flow
- [ ] Test complete login -> /auth/me -> notifications flow
- [ ] Verify token persistence across browser sessions
- [ ] Test in both development and production environments
