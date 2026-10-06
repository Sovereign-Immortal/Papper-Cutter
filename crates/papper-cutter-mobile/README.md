<p align="center">
  <img src="../../assets/web_assets/papper_cutter_logo_horizontal.png" alt="Papper Cutter Banner" width="440" />
</p>

# Papper Cutter — Native Rust Mobile Client (Dioxus 0.6)

[![Rust Version](https://img.shields.io/badge/Rust-2021%20Edition-DEA584?style=flat-square&logo=rust)](https://www.rust-lang.org)
[![Dioxus](https://img.shields.io/badge/UI%20Framework-Dioxus%200.6-E07A5F?style=flat-square)](https://dioxuslabs.com)
[![Android NDK](https://img.shields.io/badge/Android-NDK%20Native%20APK-3DDC84?style=flat-square&logo=android)](#-how-to-build-android-apk)
[![Domain Engine](https://img.shields.io/badge/Shared%20Engine-papper--cutter--domain-1A6B4B?style=flat-square)](../papper-cutter-domain/)

This crate contains the **100% native Rust mobile application** for Papper Cutter, built with **Dioxus 0.6**. It links directly against the high-precision `papper-cutter-domain` Rust engine with zero foreign-function interface (FFI) overhead and zero JavaScript runtime latency.

---

## 📱 Mobile Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                 Dioxus Native Android Activity                  │
│   StatusBar • DeviceShell • Home • Groups • Settle • AddExpense │
├─────────────────────────────────────────────────────────────────┤
│                     In-Memory Reactive State                    │
│      AppState (Trips, Ledger, Active Tabs, Selected Squads)     │
├─────────────────────────────────────────────────────────────────┤
│                   papper-cutter-domain Engine                   │
│     Money(i64) • Remainder Splits • Min-Flow Settlement Math    │
├─────────────────────────────────────────────────────────────────┤
│                   Android NDK & Native System                   │
│         Linux ARM64 / JNI Intent / OpenGL / WGPU Surface        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Running Locally (Desktop Mobile Shell)

You can run the Dioxus mobile client on your local computer in a simulated mobile device frame:

```bash
# From repository root:
cargo run -p papper-cutter-mobile
```

Or using the Dioxus CLI:
```bash
# Install Dioxus CLI (if not installed)
cargo install dioxus-cli --locked

# Run with hot-reloading:
dx serve --platform desktop
```

---

## 📦 How to Build Native Android APK

### Prerequisites
1. **Rust Android Targets**:
   ```bash
   rustup target add aarch64-linux-android armv7-linux-androideabi x86_64-linux-android
   ```
2. **Android NDK**: Version `r25c` or newer installed via Android Studio or command-line tools. Set environment variable:
   ```powershell
   $env:ANDROID_NDK_HOME = "C:\Users\<User>\AppData\Local\Android\Sdk\ndk\<version>"
   ```
3. **Java JDK**: JDK 17+ installed.

### Option 1: Build via Dioxus CLI (`dx`)

```bash
# Navigate to mobile crate directory:
cd crates/papper-cutter-mobile

# Build native release APK:
dx build --platform android --release

# Run and install directly on a connected Android phone:
dx run --platform android
```

### Option 2: Build via `cargo-apk`

```bash
# Install cargo-apk tool
cargo install cargo-apk

# Build headless release APK from workspace root
cargo apk build --package papper-cutter-mobile --release
```

Output APK will be generated at:
```text
target/release/apk/papper_cutter_mobile.apk
```

### Installing on Device via ADB
```bash
adb install -r target/release/apk/papper_cutter_mobile.apk
```

---

## 🎨 Visual Design

The UI utilizes the **Warm Pastel Harmony** CSS design tokens embedded directly into the binary at compile time via `include_str!("../assets/style.css")`:
- **Canvas**: Cozy Warm Paper `#FAF7F2`
- **Primary / Brand**: Soft Terracotta `#91462E`
- **Settlement Highlight**: Gentle Lavender `#8B7BE8`
- **Creditor Balance**: Sage Matcha `#1A6B4B`

---

<p align="center">
  <img src="../../assets/primary_transparent.png" width="90" alt="Papper Cutter Logo Icon" />
  <br />
  <sub>Papper Cutter — Native Rust Mobile Client</sub>
</p>
