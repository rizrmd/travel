# 🚀 Development Script Guide

Panduan penggunaan `dev.sh` - script otomatis untuk menjalankan Travel Umroh frontend development server.

## 📋 Overview

`dev.sh` adalah bash script yang:
- ✅ Mengecek Node.js & npm installation
- ✅ Membersihkan port yang sedang digunakan
- ✅ Auto-install dependencies jika diperlukan
- ✅ Menjalankan Next.js dev server
- ✅ Menampilkan informasi lengkap (URLs, pages, commands)
- ✅ Auto-cleanup saat Ctrl+C
- ✅ Colored output untuk mudah dibaca
- ✅ Log ke file `nextjs.log`

## 🎯 Quick Start

### Cara Tercepat:

```bash
# Dari folder frontend
./dev.sh
```

**That's it!** Script akan handle semuanya otomatis.

### First Time Setup:

```bash
# 1. Clone/navigate ke project
cd "/home/yopi/Projects/Travel Umroh/frontend"

# 2. Make script executable (sudah dilakukan)
chmod +x dev.sh

# 3. Run!
./dev.sh
```

## 🔍 What It Does

### 1. Pre-flight Checks (Auto)
```
✓ Check if in correct directory (package.json, app/)
✓ Verify Node.js installed (v18+)
✓ Verify npm installed
✓ Clean up any running Next.js processes
✓ Free up port 3000 if occupied
```

### 2. Dependency Management (Auto)
```
✓ Check if node_modules exists
✓ Run npm install if needed
✓ Update dependencies if package.json changed
```

### 3. Environment Setup (Optional)
```
✓ Check for .env.local (optional)
✓ Suggest copying from .env.example if needed
```

### 4. Server Startup
```
✓ Start Next.js dev server on port 3000
✓ Save PID to .nextjs.pid
✓ Redirect output to nextjs.log
✓ Wait for server to be ready (max 60s)
✓ Verify port is listening
```

### 5. Display Info
```
✓ Show Local & Network URLs
✓ List all available pages/routes
✓ Show tech stack info
✓ Display useful commands
✓ Quick testing guide
```

### 6. Log Monitoring
```
✓ Auto-follow nextjs.log
✓ Real-time updates in terminal
```

## 📊 Output Example

Saat menjalankan `./dev.sh`, Anda akan melihat:

```
🕌 Travel Umroh Frontend Development Environment
==================================================

[SUCCESS] Node.js v20.0.0 detected
[SUCCESS] npm 10.0.0 detected
[INFO] Cleaning up ports...
[SUCCESS] All ports cleaned up
[SUCCESS] node_modules already exists
[SUCCESS] TypeScript config found
[INFO] Starting Next.js development server on port 3000...
[SUCCESS] Next.js started (PID: 12345)
[INFO] Waiting for Next.js to be ready...
[SUCCESS] Next.js compilation complete

==================================================================
🕌 Travel Umroh Frontend Development Environment Ready!
==================================================================

🌐 Application URLs:
   Local:    http://localhost:3000
   Network:  http://192.168.1.100:3000

📄 Available Pages:
   Homepage:              /
   Test Density:          /test-density
   Analytics:             /owner/analytics
   Landing Builder:       /agent/landing-builder
   ... (dan lainnya)

🎨 Key Features:
   ✓ 11 Epics Implemented
   ✓ Responsive Layout
   ✓ Adaptive Density
   ... (dan lainnya)

🛠️  Commands:
   Stop:         Press Ctrl+C
   Restart:      Stop and run ./dev.sh again
   View logs:    tail -f nextjs.log
   ... (dan lainnya)

==================================================================
[SUCCESS] Development environment is running!
[INFO] Press Ctrl+C to stop all services

 ✓ Ready in 2.1s
 ○ Compiling / ...
 ✓ Compiled / in 1.2s
```

## 🎨 Color Coding

Output menggunakan warna untuk mudah dibaca:

- 🔵 **BLUE** `[INFO]` - Informasi umum
- 🟢 **GREEN** `[SUCCESS]` - Operasi berhasil
- 🟡 **YELLOW** `[WARNING]` - Peringatan (non-critical)
- 🔴 **RED** `[ERROR]` - Error (critical, script akan exit)
- 🔷 **CYAN** - Highlight penting (URLs, page names)
- 🔮 **MAGENTA** - Features checklist

## 🛑 Stopping the Server

### Normal Stop:
```bash
# Press Ctrl+C in terminal
# Script akan otomatis cleanup:
# - Kill Next.js process
# - Remove .nextjs.pid file
# - Exit gracefully
```

### Force Stop (jika stuck):
```bash
# Kill by PID file
kill $(cat .nextjs.pid)

# Or kill all Next.js
pkill -f "next dev"

# Or kill port 3000
lsof -ti:3000 | xargs kill -9
```

## 📝 Log Files

### nextjs.log
Semua output dari Next.js dev server:
```bash
# View entire log
cat nextjs.log

# Follow live (auto-done by script)
tail -f nextjs.log

# Last 50 lines
tail -50 nextjs.log

# Search for errors
grep -i error nextjs.log
```

### .nextjs.pid
PID dari running Next.js process:
```bash
# Check PID
cat .nextjs.pid

# Check if process running
kill -0 $(cat .nextjs.pid)
```

**Note:** Kedua file ini ada di `.gitignore` (tidak di-commit).

## 🔧 Troubleshooting

### Port 3000 Already in Use
```bash
# Script akan otomatis kill process di port 3000
# Tapi jika masih ada masalah:
lsof -ti:3000 | xargs kill -9
./dev.sh
```

### Node.js Not Found
```bash
# Install Node.js 18+
# Ubuntu/Debian:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Or use nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

### npm install Fails
```bash
# Clear cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Or use yarn
yarn install
```

### Script Permission Denied
```bash
chmod +x dev.sh
./dev.sh
```

### Server Won't Start (Process Dies)
```bash
# Check logs
cat nextjs.log

# Common issues:
# - TypeScript errors → fix in code
# - Port already used → will auto-cleanup
# - Dependencies missing → run npm install
```

## 🚀 Advanced Usage

### Custom Port
```bash
# Edit dev.sh, change:
NEXTJS_PORT=3000
# To:
NEXTJS_PORT=3001
```

### Disable Auto Browser Open
```bash
# Edit dev.sh, comment out lines:
# if command -v xdg-open &> /dev/null; then
#     ...
# fi
```

### Run in Background (Not Recommended)
```bash
# Use screen or tmux instead
screen -S umroh
./dev.sh
# Press Ctrl+A then D to detach

# Reattach:
screen -r umroh
```

## 📊 Script Structure

```
dev.sh
├── Color definitions (RED, GREEN, etc.)
├── Helper functions (print_status, etc.)
├── Cleanup function (trap on Ctrl+C)
├── Pre-flight checks
│   ├── Directory verification
│   ├── Node.js/npm check
│   └── Port cleanup
├── Dependency management
│   └── npm install (if needed)
├── Server startup
│   ├── npm run dev (background)
│   ├── PID file creation
│   └── Health check (60s timeout)
├── Info display
│   └── URLs, pages, commands, guide
└── Log monitoring
    └── tail -f nextjs.log
```

## 🎯 vs Manual `npm run dev`

### Manual Way:
```bash
npm run dev
```

### With `dev.sh`:
```bash
./dev.sh
```

### Advantages of `dev.sh`:

| Feature | Manual | dev.sh |
|---------|--------|--------|
| Port cleanup | ❌ Manual | ✅ Auto |
| Dependency check | ❌ Manual | ✅ Auto |
| Health check | ❌ None | ✅ 60s timeout |
| Info display | ❌ Minimal | ✅ Comprehensive |
| Logs to file | ❌ No | ✅ nextjs.log |
| Colored output | ❌ No | ✅ Yes |
| Auto cleanup | ❌ Manual | ✅ Ctrl+C trap |
| Network URL | ❌ No | ✅ Auto-detect |
| Quick guide | ❌ No | ✅ Built-in |

## 📚 Related Files

- **dev.sh** - This script
- **.nextjs.pid** - PID file (auto-generated, in .gitignore)
- **nextjs.log** - Server logs (auto-generated, in .gitignore)
- **README.md** - Project documentation
- **TESTING-GUIDE.md** - Testing checklist
- **.env.example** - Environment template

## 🔗 Quick Links

After running `./dev.sh`, these URLs will be available:

- **Homepage**: http://localhost:3000/
- **Test Density**: http://localhost:3000/test-density
- **Analytics**: http://localhost:3000/owner/analytics
- **Landing Builder**: http://localhost:3000/agent/landing-builder

See script output for complete list + network URL.

## ✅ Checklist

Before running `./dev.sh` for first time:

- [ ] In correct directory: `/home/yopi/Projects/Travel Umroh/frontend`
- [ ] Node.js 18+ installed: `node -v`
- [ ] npm installed: `npm -v`
- [ ] Script executable: `chmod +x dev.sh`
- [ ] Port 3000 free (or will auto-cleanup)

After running:

- [ ] Server started successfully
- [ ] No errors in terminal
- [ ] Can access http://localhost:3000
- [ ] Test pages load correctly
- [ ] Hot reload works (edit file, see changes)

## 💡 Tips

1. **Always use `./dev.sh`** instead of `npm run dev` for better DX
2. **Check `nextjs.log`** if something seems wrong
3. **Use Ctrl+C** to stop (don't close terminal abruptly)
4. **Network URL** great for mobile testing on same WiFi
5. **Colors help** quickly identify errors (red) vs success (green)
6. **Script auto-updates** dependencies if package.json changed

## 🎉 Summary

`dev.sh` makes development easier by:
- 🚀 One command to rule them all
- 🔍 Auto-checks everything
- 🧹 Auto-cleanup ports & processes
- 📊 Beautiful, informative output
- 📝 Logs to file for debugging
- 🛑 Graceful shutdown (Ctrl+C)

**Just run `./dev.sh` and start coding!** 🎨

---

Made with ❤️ for Travel Umroh Development Team
