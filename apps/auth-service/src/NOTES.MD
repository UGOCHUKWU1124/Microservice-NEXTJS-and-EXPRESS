/* ===========================================================
   🔑 JWT AUTH CHEAT SHEET — ACCESS & REFRESH TOKENS
   ===========================================================

   1) WHY TWO TOKENS?
      - ACCESS TOKEN (short-lived, e.g. 15m–1h):
        ✅ Proves user identity when calling APIs.
        ✅ Contains userId + claims.
        ✅ Short lifespan = safer if stolen.
        ✅ Sent in HTTP header: Authorization: Bearer <token>

      - REFRESH TOKEN (long-lived, e.g. 7–30 days):
        ✅ Used ONLY to get new access tokens.
        ✅ Keeps user logged in without re-typing password.
        ✅ Must be stored securely (HttpOnly + Secure cookie / DB).
        ✅ Rotate (replace) every refresh → prevents theft/replay.

   2) TOKEN STORAGE
      - Access Token → keep in memory (or short-term storage).
      - Refresh Token → HttpOnly + Secure cookie (invisible to JS).
      - Server → store hashed refresh tokens in DB for revocation.

   3) TOKEN CREATION
      - Access Token → JWT signed with HS256/RS256.
      - Refresh Token → random string (safer) OR JWT.
      - Always use strong secrets + rotate keys in production.

   4) AUTH FLOW
      - Login:
          ✔ Check credentials
          ✔ Issue Access + Refresh tokens
      - Access Protected Route:
          ✔ Verify access token (signature + expiry)
      - Token Expired:
          ✔ Client calls /refresh with Refresh Token
          ✔ Server validates → issues new Access Token
          ✔ Optionally: issue new Refresh Token (rotation)
      - Logout:
          ✔ Delete refresh token in DB
          ✔ Clear cookie from client

   5) SECURITY TIPS
      🔒 Access tokens → short expiry (minutes).
      🔒 Refresh tokens → longer expiry (days), always rotate.
      🔒 Never store tokens in localStorage (XSS risk).
      🔒 Always use HTTPS (stop token sniffing).
      🔒 Add rate-limit on /refresh endpoint.
      🔒 If stolen refresh token is reused → revoke all sessions.

   6) COMMON MISTAKES
      ❌ Using only long-lived access tokens → insecure if stolen.
      ❌ Storing tokens in localStorage → vulnerable to XSS.
      ❌ Not rotating refresh tokens → replay attacks possible.
      ❌ Storing secrets in JWT payload → JWT is encoded, not encrypted.
*/

/* ===========================================================
   🛠️ QUICK REMINDERS (async/await, next, Redis, Cookies)
   ===========================================================

   - next()       → “I’m done, move to the next middleware.”
   - next(err)    → “Something went wrong 🚨 → skip to error handler.”
   - await        → Pause code until Promise resolves/rejects.
   - Promise      → Object for async results (success OR failure).

   - redis.set(key, value, 'EX', seconds)
        → Store data in Redis with an expiry time (in seconds).
        → Example: redis.set("user:123:refresh", token, "EX", 604800)
                   (store refresh token for 7 days)

   - HttpOnly Cookie (for refresh tokens)
        ✅ Cannot be accessed by JS (blocks XSS attacks).
        ✅ Set with { httpOnly: true, secure: true, sameSite: "strict" }.
        ✅ Browser automatically sends it with requests → safer storage.

   ===========================================================
*/

/* ===========================================================
   🌐 EXPRESS HTTP METHODS & APP METHODS CHEAT SHEET
   ===========================================================

   🔹 HTTP METHODS (what the client asks the server to do):
      - GET     → fetch data (read-only)
      - POST    → create new data
      - PUT     → update/replace entire resource
      - PATCH   → update/modify part of a resource
      - DELETE  → remove data
      - OPTIONS → check allowed methods for a resource
      - HEAD    → fetch headers only (no body, faster than GET)
      - CONNECT → create a tunnel to the server (rare, proxies)
      - TRACE   → echo back the request (testing/debugging)

   🔹 EXPRESS APP METHODS (how the server handles requests):
      - app.use(middleware) → runs for ALL requests 
        (unless path specified, e.g., app.use("/api", middleware))
      - app.get(path, handler)    → handle GET requests
      - app.post(path, handler)   → handle POST requests
      - app.put(path, handler)    → handle PUT requests
      - app.patch(path, handler)  → handle PATCH requests
      - app.delete(path, handler) → handle DELETE requests

   📝 TIPS:
      - app.use() is great for global middleware (logging, auth, body parsing).
      - Always use correct method to match REST conventions.
      - HEAD and OPTIONS are often auto-handled but can be customized.
      - PATCH is safer than PUT when you only want partial updates.
*/
