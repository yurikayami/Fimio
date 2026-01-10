// Script to deploy updates for OTA (Over-The-Air) updates
// This script zips the dist folder and uploads it to your update server

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const VERSION = process.env.npm_package_version || "1.0.0";
const DIST_DIR = "dist";
const OUTPUT_DIR = "releases";
const BUNDLE_NAME = `fimio-${VERSION}.zip`;

async function deployUpdate() {
  console.log(`\n📦 Deploying Fimio v${VERSION}...\n`);

  // 1. Check if dist folder exists
  if (!fs.existsSync(DIST_DIR)) {
    console.error(
      "❌ Thư mục dist không tồn tại. Hãy chạy 'npm run build' trước."
    );
    process.exit(1);
  }

  // 2. Create releases folder if not exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // 3. Create zip file from dist folder
  const outputPath = path.join(OUTPUT_DIR, BUNDLE_NAME);

  try {
    // Using PowerShell for Windows or tar for Unix
    if (process.platform === "win32") {
      execSync(
        `powershell Compress-Archive -Path "${DIST_DIR}/*" -DestinationPath "${outputPath}" -Force`,
        { stdio: "inherit" }
      );
    } else {
      execSync(`cd ${DIST_DIR} && zip -r ../${outputPath} .`, {
        stdio: "inherit",
      });
    }
    console.log(`✅ Bundle created: ${outputPath}`);
  } catch (error) {
    console.error("❌ Không thể tạo bundle zip:", error.message);
    process.exit(1);
  }

  // 4. Create update manifest
  const manifest = {
    version: VERSION,
    bundleUrl: `https://your-cdn.com/updates/${BUNDLE_NAME}`,
    releaseNotes: `Fimio v${VERSION} - Cập nhật mới nhất`,
    releaseDate: new Date().toISOString(),
    minAppVersion: "1.0.0",
    platforms: ["android"],
  };

  const manifestPath = path.join(OUTPUT_DIR, "manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`✅ Manifest created: ${manifestPath}`);

  // 5. Instructions for uploading
  console.log(`
📤 Để deploy update:

1. Upload file ${outputPath} lên CDN hoặc server của bạn
2. Upload file ${manifestPath} lên API server
3. Đảm bảo URL trong manifest.json trỏ đúng đến bundle

Hoặc sử dụng Capgo Cloud (khuyến nghị):
  - Đăng ký tại https://capgo.app
  - Cài CLI: npm install -g @capgo/cli
  - Login: npx @capgo/cli login
  - Upload: npx @capgo/cli bundle upload

`);
}

deployUpdate().catch(console.error);
