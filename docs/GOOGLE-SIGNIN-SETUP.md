# Cấu hình Google Sign-In cho Android

## Bước 1: Tạo Google Cloud Project

1. Vào [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project có sẵn
3. Vào **APIs & Services** → **Credentials**

## Bước 2: Cấu hình OAuth Consent Screen

1. Vào **OAuth consent screen**
2. Chọn **External** → Create
3. Điền thông tin:
   - App name: `Fimio`
   - User support email: email của bạn
   - Developer contact: email của bạn
4. Scopes: thêm `email` và `profile`
5. Save

## Bước 3: Tạo OAuth 2.0 Client IDs

### A. Web Client (BẮT BUỘC cho Supabase)

1. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
2. Application type: **Web application**
3. Name: `Fimio Web`
4. Authorized redirect URIs: thêm URL callback của Supabase
   - `https://YOUR_SUPABASE_PROJECT.supabase.co/auth/v1/callback`
5. Click **Create**
6. Copy **Client ID** (dạng: `xxx.apps.googleusercontent.com`)

### B. Android Client

1. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
2. Application type: **Android**
3. Name: `Fimio Android`
4. Package name: `com.fimio.app`
5. SHA-1 certificate fingerprint:

   **Lấy SHA-1 cho debug:**

   ```bash
   cd android
   gradlew.bat signingReport
   ```

   Hoặc dùng keytool:

   ```bash
   keytool -list -v -keystore "%USERPROFILE%\.android\debug.keystore" -alias androiddebugkey -storepass android
   ```

6. Click **Create**

## Bước 4: Cấu hình biến môi trường

Thêm vào file `.env`:

```env
VITE_GOOGLE_WEB_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
```

**QUAN TRỌNG:** Sử dụng **Web Client ID**, không phải Android Client ID!

## Bước 5: Cấu hình Supabase

1. Vào [Supabase Dashboard](https://supabase.com/dashboard)
2. Chọn project → **Authentication** → **Providers**
3. Enable **Google**
4. Điền:
   - Client ID: Web Client ID
   - Client Secret: Web Client Secret
5. Save

## Bước 6: Build lại app

```bash
npm run build
npx cap sync android
```

Sau đó build lại APK trong Android Studio.

## Troubleshooting

### Lỗi "DEVELOPER_ERROR"

- Kiểm tra SHA-1 đã thêm đúng chưa
- Đảm bảo package name là `com.fimio.app`

### Lỗi "Sign in cancelled"

- Kiểm tra Web Client ID đã đúng chưa
- Đảm bảo OAuth consent screen đã publish

### Lỗi "Network error"

- Kiểm tra internet permission trong AndroidManifest.xml
- Thử bật VPN nếu Google bị chặn

## Lấy SHA-1 cho Production

Khi build APK release, cần thêm SHA-1 của keystore production:

```bash
keytool -list -v -keystore your-release-key.keystore -alias your-alias
```

Thêm SHA-1 này vào Android OAuth client trong Google Cloud Console.
