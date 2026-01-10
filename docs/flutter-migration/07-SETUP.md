# 🛠️ Setup Guide - Environment & Initial Setup

## Mục Tiêu

Hướng dẫn thiết lập môi trường để bắt đầu Flutter migration từ đầu.

---

## 📋 Yêu cầu trước

### Hardware Requirements

- RAM: Minimum 8GB (recommended 16GB)
- Disk: 30GB free space minimum
- CPU: Multi-core processor

### Kinh nghiệm cần thiết

- ✅ Dart cơ bản (hoặc có thể học nhanh từ JavaScript/Kotlin)
- ✅ Flutter cơ bản (hoặc sẵn sàng học)
- ✅ Clean Architecture concepts
- ✅ BLoC pattern (có thể là mới nhưng cần hiểu)

---

## 1️⃣ Flutter SDK Setup

### Windows

#### Option A: Using Flutter SDK directly

```bash
# 1. Download Flutter from https://flutter.dev/docs/get-started/install/windows
# Latest stable version recommended

# 2. Extract to a folder (e.g., C:\flutter)

# 3. Add Flutter to PATH
# Environment Variables → System Properties → Add C:\flutter\bin to PATH

# 4. Verify installation
flutter --version
flutter doctor

# 5. Accept licenses
flutter doctor --android-licenses
flutter doctor --ios-licenses (if developing for iOS)
```

#### Option B: Using Chocolatey (recommended)

```bash
# Install Chocolatey first if not installed
# https://chocolatey.org/install

# Install Flutter
choco install flutter

# Verify
flutter doctor

# Accept licenses
flutter doctor --android-licenses
```

### macOS / Linux

```bash
# Download from https://flutter.dev/docs/get-started/install/macos
# or
brew install flutter

# Verify
flutter doctor

# Accept licenses
flutter doctor --android-licenses
```

### Post-Installation Checklist

```bash
# Should show all green checkmarks
flutter doctor

# Output should show:
# ✓ Flutter (Channel stable)
# ✓ Android toolchain
# ✓ Xcode (macOS only)
# ✓ Android Studio
# ✓ Connected devices
```

If any issues:

```bash
# Download missing components
flutter pub get

# Fix issues
flutter doctor --verbose
```

---

## 2️⃣ IDE Setup

### Option A: Android Studio (Recommended)

```bash
# 1. Download Android Studio
# https://developer.android.com/studio

# 2. Install Flutter plugin
# Android Studio → Settings → Plugins
# Search "Flutter" and install

# 3. Install Dart plugin
# (Usually installed with Flutter plugin)

# 4. Configure Android SDK
# Android Studio → Settings → SDK Manager
# Install:
#   - Android SDK Platform 34+
#   - Android SDK Command-line Tools
#   - Android Emulator

# 5. Create Android Virtual Device
# Android Studio → Tools → Device Manager
# Create device with:
#   - API Level 31+
#   - RAM: 4GB minimum
```

### Option B: VS Code

```bash
# 1. Install VS Code
# https://code.visualstudio.com

# 2. Install extensions:
#   - Flutter (Dart Code)
#   - Dart (Dart Code)
#   - BLoC (Felix Angelov)

# 3. Verify extensions
# Press Ctrl+Shift+X (or Cmd+Shift+X on Mac)
# Type "Flutter" and install
```

---

## 3️⃣ Development Environment

### Node.js (Optional, for Web)

```bash
# Download from https://nodejs.org/
# Select LTS version

# Verify
node --version
npm --version

# Install Dart Sass (optional, for styling)
npm install -g sass
```

### Git Setup

```bash
# Download from https://git-scm.com

# Verify
git --version

# Configure
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## 4️⃣ Project Setup

### Step 1: Create Flutter Project

```bash
# Create new project
flutter create movie_finder --platforms=android,ios,web

# Navigate to project
cd movie_finder

# Get initial dependencies
flutter pub get
```

### Step 2: Create Folder Structure

```bash
# From project root, create folders:
mkdir -p lib/core/constants
mkdir -p lib/core/error
mkdir -p lib/core/network
mkdir -p lib/core/theme
mkdir -p lib/core/widgets
mkdir -p lib/core/utils
mkdir -p lib/features
mkdir -p lib/routes
mkdir -p test

# Create test directories
mkdir -p test/features/movie/domain
mkdir -p test/features/movie/data
mkdir -p test/features/movie/presentation
mkdir -p test/helpers
```

### Step 3: Initialize pubspec.yaml

Replace content of `pubspec.yaml`:

```yaml
name: movie_finder
description: Movie streaming app built with Flutter

publish_to: "none"

version: 1.0.0+1

environment:
  sdk: ">=3.0.0 <4.0.0"

dependencies:
  flutter:
    sdk: flutter
  flutter_localizations:
    sdk: flutter

  # State Management
  flutter_bloc: ^9.0.0
  bloc: ^9.0.0

  # Routing
  go_router: ^13.0.0

  # Service Locator
  get_it: ^7.6.0

  # API & Networking
  dio: ^5.3.0
  retrofit: ^4.1.0

  # Database & Backend
  supabase_flutter: ^2.0.0
  supabase: ^2.0.0

  # Functional Programming
  dartz: ^0.10.1

  # Image Caching
  cached_network_image: ^3.3.0
  flutter_cache_manager: ^3.3.0

  # Video Player
  video_player: ^2.8.0
  chewie: ^1.8.0
  hls_parser: ^0.5.0

  # UI
  shimmer: ^3.0.0
  lucide_icons: ^0.309.0

  # Icons
  font_awesome_flutter: ^10.7.0

  # Utils
  intl: ^0.19.0
  timeago: ^3.6.0
  connectivity_plus: ^5.0.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^4.0.0

  # Testing
  mocktail: ^1.0.0
  bloc_test: ^9.1.0

  # Code Generation
  build_runner: ^2.4.0
  retrofit_generator: ^8.1.0
  freezed: ^2.4.0
  freezed_annotation: ^2.4.0

  # Analysis
  custom_lint: ^0.6.0
  riverpod_generator: ^2.3.0

flutter:
  uses-material-design: true

  assets:
    - assets/images/
    - assets/icons/
    - assets/animations/

  fonts:
    - family: Roboto
      fonts:
        - asset: assets/fonts/Roboto-Regular.ttf
        - asset: assets/fonts/Roboto-Bold.ttf
          weight: 700
        - asset: assets/fonts/Roboto-Italic.ttf
          style: italic
```

### Step 4: Get Dependencies

```bash
# From project root
flutter pub get

# If any issues
flutter clean
flutter pub get

# Verify no errors
flutter analyze
```

---

## 5️⃣ API Keys & Environment Setup

### Step 1: Create .env File

```bash
# Create file: .env
# In project root

SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
API_BASE_URL=https://phimapi.com
ENVIRONMENT=development
```

### Step 2: Setup flutter_dotenv (Optional)

Add to pubspec.yaml:

```yaml
dependencies:
  flutter_dotenv: ^5.1.0
```

Then use in main.dart:

```dart
import 'package:flutter_dotenv/flutter_dotenv.dart';

Future<void> main() async {
  await dotenv.load(fileName: ".env");
  runApp(const MyApp());
}
```

### Step 3: Supabase Project Setup

```bash
# 1. Go to https://supabase.com
# 2. Create new project or use existing
# 3. Go to Project Settings → API
# 4. Copy:
#    - Project URL → SUPABASE_URL
#    - anon public key → SUPABASE_ANON_KEY
# 5. Add to .env file
```

---

## 6️⃣ First Run

### Create main.dart

```dart
// lib/main.dart
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Movie Finder',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
      ),
      home: const Scaffold(
        body: Center(
          child: Text('Welcome to Flutter!'),
        ),
      ),
    );
  }
}
```

### Run Project

```bash
# List available devices
flutter devices

# Run on default device
flutter run

# Run on specific device
flutter run -d emulator-5554
flutter run -d "iPhone 15"
flutter run -d chrome  # web

# Run in profile mode (for performance testing)
flutter run --profile

# Run in release mode
flutter run --release
```

### Expected Output

```
Running "flutter pub get"...
Building for...
✓ Built build/app/outputs/flutter-apk/app-debug.apk
Installing and launching...
app: launching...
🔥  To hot reload changes while running, press "r" or "R".
To hot restart (and rebuild state), press "R".
d (detach), c (clear), q (quit).
```

---

## 7️⃣ Emulator / Simulator Setup (if needed)

### Android Emulator (Windows/Mac/Linux)

```bash
# List available emulators
flutter emulators

# Create new emulator
flutter emulators --create --name pixel_5

# Launch emulator
flutter emulators --launch pixel_5

# Then run
flutter run
```

### iOS Simulator (macOS only)

```bash
# Open Simulator
open -a Simulator

# Run on simulator
flutter run -d all  # all connected devices
flutter run -d "iPhone 15"
```

---

## 8️⃣ IDE Configuration

### Android Studio

```bash
# 1. Open project in Android Studio
# File → Open → Select movie_finder folder

# 2. Configure Flutter SDK
# File → Settings → Languages & Frameworks → Flutter
# Set Flutter SDK path (e.g., C:\flutter)

# 3. Run from IDE
# Tools → Flutter → New Flutter Project
# Or Run → Run 'main.dart'

# 4. Hot Reload
# Click reload button (Ctrl+\) or press 'r' in terminal
```

### VS Code

```bash
# 1. Open folder
# Code → File → Open Folder → movie_finder

# 2. VS Code should detect Flutter project
# Should show "Flutter" in status bar

# 3. Run from VS Code
# Run → Run Without Debugging
# Or press Ctrl+F5

# 4. Hot Reload
# Press Ctrl+F5 or click reload button
```

---

## 9️⃣ Git Setup & Version Control

### Initialize Repository

```bash
# From project root
git init

# Create .gitignore (Flutter already creates one)
# But verify it includes:
.dart_tool/
.flutter-plugins
.flutter-plugins-dependencies
build/
.packages
.env
*.iml
.idea/
.vscode/
node_modules/

# Stage files
git add .

# First commit
git commit -m "Initial Flutter project setup"

# Add remote (if using GitHub/GitLab)
git remote add origin https://github.com/yourusername/movie-finder.git
git branch -M main
git push -u origin main
```

---

## 🔟 Testing Setup

### Create Test Structure

```bash
# Already created, verify these exist:
test/
├── helpers/
│   └── test_helpers.dart
├── features/
│   └── movie/
│       ├── domain/
│       ├── data/
│       └── presentation/
└── mocks/
    └── mock_classes.dart
```

### Run First Test

```bash
# Create simple test
# test/example_test.dart

void main() {
  test('1 + 1 equals 2', () {
    expect(1 + 1, equals(2));
  });
}

# Run tests
flutter test test/example_test.dart

# Run all tests
flutter test

# Run with coverage
flutter test --coverage
```

---

## 1️⃣1️⃣ Troubleshooting

### Problem: Flutter doctor shows errors

```bash
# Run detailed diagnosis
flutter doctor -v

# Accept Android licenses
flutter doctor --android-licenses

# Accept iOS licenses (macOS)
flutter doctor --ios-licenses

# Update Flutter
flutter upgrade
```

### Problem: Port 8080 already in use

```bash
# Specify different port
flutter run --host localhost --port 8081
```

### Problem: Gradle build fails

```bash
# Clean and rebuild
flutter clean
cd android
./gradlew clean
cd ..
flutter run

# On Windows
flutter clean
cd android
gradlew clean
cd ..
flutter run
```

### Problem: Can't find emulator

```bash
# Restart adb
adb kill-server
adb start-server

# Check connected devices
flutter devices

# Create new emulator
flutter emulators --create --name test_emulator
flutter emulators --launch test_emulator
```

### Problem: Hot reload not working

```bash
# Use Hot Restart instead
# Press 'R' instead of 'r'

# Or restart app
flutter run
```

---

## 1️⃣2️⃣ Verification Checklist

After setup, verify everything:

```
[ ] Flutter installed: flutter --version
[ ] Dart installed: dart --version
[ ] Android SDK: flutter doctor shows ✓
[ ] IDE installed and configured
[ ] Emulator/Device available: flutter devices
[ ] .env file created with credentials
[ ] pubspec.yaml updated and dependencies installed: flutter pub get
[ ] First run successful: flutter run
[ ] No errors in flutter analyze: flutter analyze
[ ] Can hot reload: Press 'r' in terminal
[ ] Tests can run: flutter test
[ ] Git initialized and ready: git status
```

---

## 1️⃣3️⃣ IDE Shortcuts (Android Studio)

```
Ctrl+Shift+A        Search for action
Ctrl+N              Create new file
Ctrl+Alt+Shift+S    Project structure
Ctrl+,              Settings
Alt+Enter           Quick fix
Ctrl+/              Comment/uncomment
Ctrl+Shift+F        Format code
Ctrl+Alt+L          Reformat code
Ctrl+Shift+O        Organize imports
Ctrl+F9             Build project
Shift+F10           Run
Ctrl+\              Hot reload
Shift+Ctrl+\        Hot restart
```

---

## 1️⃣4️⃣ Next Steps

After setup completion:

1. ✅ Verify all checklist items
2. ✅ Read [00-overview.md](./00-overview.md) - Understand architecture
3. ✅ Follow [06-WORKFLOW.md](./06-WORKFLOW.md) - Daily workflow
4. ✅ Start Phase 1 from [01-phase-foundation.md](./01-phase-foundation.md)

---

## 📚 Resources

- [Flutter Official Docs](https://flutter.dev/docs)
- [Dart Language Tour](https://dart.dev/guides/language/language-tour)
- [BLoC Library](https://bloclibrary.dev)
- [Clean Code in Dart](https://dart.dev/guides/language/effective-dart)
- [Flutter Community](https://flutter.dev/community)

---

## ✅ Setup Complete!

When you see:

```
🔥  To hot reload changes while running, press "r" or "R".
```

Your environment is ready! 🎉

You can now start **Phase 1** of the migration.

---

**Time estimate:** 1-2 hours for complete setup
