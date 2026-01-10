# Fimio Android App - Hướng dẫn Build & Deploy

## 📱 Giới thiệu

Fimio Android app được xây dựng bằng CapacitorJS, cho phép wrap website React thành native Android app với hỗ trợ OTA (Over-The-Air) updates.

## 🛠️ Yêu cầu

- Node.js 18+
- Android Studio (với SDK 33+)
- Java JDK 17+

## 🚀 Các lệnh build

### Development

```bash
# Chạy dev server
npm run dev

# Build và sync với Android
npm run cap:build:android

# Mở Android Studio
npm run cap:open:android
```

### Production

```bash
# Build APK debug
npm run android:build

# Build APK release (cần signing key)
npm run android:release
```

## 📦 Cấu trúc

```
├── capacitor.config.ts    # Cấu hình Capacitor
├── android/               # Native Android project
├── src/
│   ├── services/
│   │   └── updater.js     # Service xử lý OTA updates
│   └── components/
│       └── common/
│           └── UpdateDialog.jsx  # UI dialog update
└── scripts/
    └── deploy-update.js   # Script deploy OTA updates
```

## 🔄 OTA Updates (Capgo)

### Cách hoạt động

1. App khởi động và kiểm tra updates
2. Nếu có update mới → hiển thị dialog
3. User chọn "Cập nhật ngay" → download bundle mới
4. App restart với phiên bản mới

### Thiết lập Capgo Cloud (Khuyến nghị)

```bash
# 1. Cài đặt Capgo CLI
npm install -g @capgo/cli

# 2. Đăng nhập
npx @capgo/cli login

# 3. Khởi tạo app
npx @capgo/cli app init

# 4. Upload bundle mới
npm run build
npx @capgo/cli bundle upload --channel production
```

### Tự host updates (Advanced)

1. Build website: `npm run build`
2. Tạo bundle: `npm run update:deploy`
3. Upload `releases/fimio-x.x.x.zip` lên CDN
4. Cập nhật API endpoint trong `capacitor.config.ts`

## 🎨 Tùy chỉnh App

### App Icon

Thay đổi các file trong:

- `android/app/src/main/res/mipmap-*/ic_launcher.png`
- `android/app/src/main/res/mipmap-*/ic_launcher_round.png`

Sử dụng Android Studio: **Right-click res → New → Image Asset**

### Splash Screen

Thay đổi trong `android/app/src/main/res/drawable*/splash.png`

### App Name

Chỉnh sửa `android/app/src/main/res/values/strings.xml`:

```xml
<string name="app_name">Fimio</string>
```

## 🔒 Signing cho Production

### Tạo Keystore

```bash
keytool -genkey -v -keystore fimio-release.keystore -alias fimio -keyalg RSA -keysize 2048 -validity 10000
```

### Cấu hình signing

Thêm vào `android/app/build.gradle`:

```gradle
android {
    signingConfigs {
        release {
            storeFile file("fimio-release.keystore")
            storePassword "your_password"
            keyAlias "fimio"
            keyPassword "your_key_password"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

## 📱 Testing

### Trên Emulator

1. Mở Android Studio
2. Tạo Virtual Device (AVD)
3. Run: `npm run cap:run:android`

### Trên thiết bị thật

1. Bật USB Debugging trên điện thoại
2. Kết nối USB
3. Run: `npm run cap:run:android`

## 🐛 Troubleshooting

### App trắng / không load

- Kiểm tra `capacitor.config.ts` có đúng URL không
- Đảm bảo `android:usesCleartextTraffic="true"` trong AndroidManifest.xml

### Updates không hoạt động

- Kiểm tra internet permission
- Xem logs: `adb logcat | grep Capacitor`

### Build lỗi

```bash
# Clean và rebuild
cd android && ./gradlew clean
npm run cap:sync
```

## 📋 Checklist Release

- [ ] Đổi version trong `package.json`
- [ ] Test trên nhiều devices
- [ ] Kiểm tra OTA update hoạt động
- [ ] Sign APK với production keystore
- [ ] Tạo screenshots cho Play Store
- [ ] Upload lên Google Play Console
