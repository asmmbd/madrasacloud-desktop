# 🕌 MadrasaCloud Desktop App

মাদরাসা ক্লাউড ডেস্কটপ অ্যাপ — Windows, Mac ও Linux এর জন্য।

---

## 🚀 সরাসরি ডাউনলোড করুন

### Windows (.exe)
[![Download Windows](https://img.shields.io/badge/Download-Windows-0078d7?logo=windows&logoColor=white)](https://github.com/yourusername/madrasacloud-desktop/releases/latest/download/MadrasaCloud-Setup.exe)

### Mac (.dmg)
[![Download Mac](https://img.shields.io/badge/Download-Mac-000000?logo=apple&logoColor=white)](https://github.com/yourusername/madrasacloud-desktop/releases/latest/download/MadrasaCloud.dmg)

### Linux (.AppImage)
[![Download Linux](https://img.shields.io/badge/Download-Linux-FCC624?logo=linux&logoColor=black)](https://github.com/yourusername/madrasacloud-desktop/releases/latest/download/MadrasaCloud.AppImage)

---

## ⚙️ ডেভেলপার সেটআপ

### ধাপ ১ — Node.js ইন্সটল করুন
https://nodejs.org থেকে LTS ভার্সন ডাউনলোড করুন।

### ধাপ ২ — রিপোজিটরি ক্লোন করুন
```bash
git clone https://github.com/yourusername/madrasacloud-desktop.git
cd madrasacloud-desktop
```

### ধাপ ৩ — ডিপেন্ডেন্সি ইন্সটল করুন
```bash
npm install
```

### ধাপ ৪ — অ্যাপ চালান (ডেভেলপমেন্ট)
```bash
npm start
```

---

## 📦 বিল্ড করুন (EXE/DMG/AppImage)

### Windows (.exe)
```bash
npm run build:win
```

### Mac (.dmg)
```bash
npm run build:mac
```

### Linux (.AppImage)
```bash
npm run build:linux
```

### সব প্ল্যাটফর্ম একসাথে
```bash
npm run build:all
```

বিল্ড ফাইল `dist/` ফোল্ডারে পাবেন।

---

## 🎨 Custom CSS

অ্যাপের লুক কাস্টমাইজ করতে `assets/custom.css` ফাইল সম্পাদনা করুন:

```css
/* MadrasaCloud Desktop Custom CSS */

/* উদাহরণ: Header span হাইড করা */
header span {
    display: none !important;
}

/* উদাহরণ: Custom background */
body { 
    background: #f0f0f0 !important; 
}
```

অ্যাপ রিস্টার্ট করলে CSS প্রয়োগ হবে।

---

## 🖼️ আইকন বানান

`assets/` ফোল্ডারে এই ফাইলগুলো রাখুন:

| ফাইল | ব্যবহার | সাইজ |
|---|---|---|
| `icon.png` | Linux + Tray | 512×512 |
| `icon.ico` | Windows | 256×256 |
| `icon.icns` | Mac | 512×512 |

### আইকন বানানোর ফ্রি টুল
- https://www.icoconverter.com (PNG → ICO)
- https://cloudconvert.com/png-to-icns (PNG → ICNS)

---

## 📁 ফাইল স্ট্রাকচার

```
madrasacloud-desktop/
├── src/
│   ├── main.js        ← Electron মেইন প্রসেস
│   ├── preload.js     ← IPC Bridge
│   ├── splash.html    ← স্প্ল্যাশ স্ক্রিন
│   └── offline.html   ← অফলাইন পেজ
├── assets/
│   ├── icon.png
│   ├── icon.ico
│   ├── icon.icns
│   └── custom.css     ← Custom CSS
├── package.json
├── .gitignore
└── README.md
```

---

## 🌐 Next.js অ্যাপে ডেস্কটপ ডিটেক্ট করুন

```javascript
// আপনার Next.js অ্যাপে ব্যবহার করুন
const isDesktopApp = typeof window !== "undefined" && window.electronAPI?.isDesktop;

if (isDesktopApp) {
  // ডেস্কটপ অ্যাপে আলাদা UI দেখান
  console.log("ডেস্কটপ অ্যাপ চলছে!");
}
```

---

## 🚀 GitHub Release Setup

### স্বয়ংক্রিয় Release এর জন্য:

1. **GitHub Actions সেটআপ করুন:**
   - `.github/workflows/release.yml` ফাইল তৈরি করুন
   - GitHub secrets এ `GH_TOKEN` যোগ করুন

2. **Release তৈরি করুন:**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

3. **Direct Download Links:**
   - Windows: `https://github.com/yourusername/madrasacloud-desktop/releases/latest/download/MadrasaCloud-Setup.exe`
   - Mac: `https://github.com/yourusername/madrasacloud-desktop/releases/latest/download/MadrasaCloud.dmg`
   - Linux: `https://github.com/yourusername/madrasacloud-desktop/releases/latest/download/MadrasaCloud.AppImage`

---

## ✨ ফিচারসমূহ

- ✅ **Splash Screen** — সুন্দর লোডিং স্ক্রিন
- ✅ **System Tray** — বন্ধ করলে Tray এ থাকবে
- ✅ **অফলাইন পেজ** — নেট না থাকলে সুন্দর বার্তা
- ✅ **Auto Updater** — নতুন ভার্সন অটো আপডেট
- ✅ **Custom Menu** — বাংলা মেনু বার
- ✅ **Zoom Control** — Ctrl+/- দিয়ে বড়-ছোট করুন
- ✅ **Fullscreen** — F11 দিয়ে ফুলস্ক্রিন
- ✅ **Custom CSS** — অ্যাপের লুক কাস্টমাইজ করুন
- ✅ **JumpList** — Windows টাস্কবার রাইট ক্লিক মেনু
- ✅ **ContextMenu** — System Tray মেনু

---

## 📄 লাইসেন্স

MIT License - [LICENSE](LICENSE) ফাইল দেখুন।

---

## ⭐ সাপোর্ট করুন

যদি প্রজেক্টটি উপকারী মনে হয়, তাহলে একটি ⭐ দিন!
