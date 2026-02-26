/**
 * scripts/download-face-models.js
 *
 * Downloads the required face-api.js model files into /public/models/
 * Run once during project setup: node scripts/download-face-models.js
 *
 * These models are used by components/verification/LivenessCheck.jsx
 * for browser-based face detection (no backend needed).
 *
 * Models downloaded (~6MB total):
 *   - TinyFaceDetector  — fast face detection
 *   - FaceLandmark68    — 68-point facial landmarks
 *   - FaceRecognition   — 128-D face embedding descriptor
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

const BASE_URL =
  "https://raw.githubusercontent.com/vladmandic/face-api/master/model";

const OUTPUT_DIR = path.join(__dirname, "..", "public", "models");

const MODEL_FILES = [
  // Tiny Face Detector (fast, works on mobile)
  "tiny_face_detector_model-weights_manifest.json",
  "tiny_face_detector_model-shard1",

  // Face Landmark 68 (required for descriptor extraction)
  "face_landmark_68_model-weights_manifest.json",
  "face_landmark_68_model-shard1",

  // Face Recognition (128-D descriptor for face matching)
  "face_recognition_model-weights_manifest.json",
  "face_recognition_model-shard1",
];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          // Follow redirect
          file.close();
          fs.unlinkSync(dest);
          download(response.headers.location, dest).then(resolve).catch(reject);
          return;
        }
        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode} for ${url}`));
          return;
        }
        response.pipe(file);
        file.on("finish", () => {
          file.close(resolve);
        });
      })
      .on("error", (err) => {
        fs.unlink(dest, () => {}); // Delete partial file
        reject(err);
      });
  });
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

// ─────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────
async function main() {
  console.log("📥 Downloading face-api.js models for InklusiJobs liveness detection\n");

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`✅ Created directory: ${OUTPUT_DIR}\n`);
  } else {
    console.log(`📁 Output directory: ${OUTPUT_DIR}\n`);
  }

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const filename of MODEL_FILES) {
    const dest = path.join(OUTPUT_DIR, filename);
    const url = `${BASE_URL}/${filename}`;

    // Skip if already exists
    if (fs.existsSync(dest)) {
      const size = fs.statSync(dest).size;
      console.log(`⏭️  Skipping ${filename} (already exists, ${formatBytes(size)})`);
      skipped++;
      continue;
    }

    process.stdout.write(`⬇️  Downloading ${filename}… `);

    try {
      await download(url, dest);
      const size = fs.statSync(dest).size;
      console.log(`✅ (${formatBytes(size)})`);
      downloaded++;
    } catch (err) {
      console.log(`❌ FAILED: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n─────────────────────────────────────────`);
  console.log(`Downloaded: ${downloaded} | Skipped: ${skipped} | Failed: ${failed}`);

  if (failed > 0) {
    console.log(`\n⚠️  Some models failed to download. Try running the script again.`);
    console.log(`    If the issue persists, download manually from:`);
    console.log(`    https://github.com/vladmandic/face-api/tree/master/model`);
    process.exit(1);
  } else {
    console.log(`\n✅ All models ready. LivenessCheck component is ready to use.`);
    console.log(`   Models path: /public/models/`);
  }
}

main().catch(console.error);