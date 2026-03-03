## ขั้นตอนต่อไป (Next steps)

1. **Push โค้ดขึ้น GitHub**  
   สร้าง repo แล้ว push โปรเจกต์นี้ขึ้นไป (ถ้ายังไม่ได้ทำ)

2. **Deploy เว็บ (Netlify)**  
   - ไปที่ [Netlify](https://app.netlify.com) → Add new site → Import from Git → เลือก repo นี้  
   - หรือใช้ CD ใน GitHub Actions: เพิ่ม secrets **NETLIFY_AUTH_TOKEN** และ **NETLIFY_SITE_ID** ใน repo แล้ว push ขึ้น `main`/`master` ระบบจะ build + deploy ให้

3. **ให้ extension เปิด URL เว็บที่ถูก**  
   ถ้าเว็บ deploy แล้วอยู่ที่ URL อื่น (เช่น `https://colorspaced.netlify.app`) แก้ค่า `COLOR_CONVERTER_URL` ใน `extension/src/extension.ts` ให้ตรงกับ URL จริง แล้ว commit

4. **Publish VS Code Extension**  
   - สร้าง [publisher](https://marketplace.visualstudio.com/manage) (ชื่อให้ตรงกับ `publisher` ใน `extension/package.json`)  
   - สร้าง [Azure DevOps PAT](https://dev.azure.com) ที่มี scope **Marketplace (Publish)**  
   - ใน repo: Settings → Secrets → Actions → เพิ่ม **VSCE_PAT** = token ข้างบน  
   - สร้าง Release พร้อม tag เช่น `v0.1.0` (หรือรัน workflow "Release VS Code Extension" แบบ manual แล้วใส่ version) → extension จะถูก build และ publish ขึ้น Marketplace

5. **ทดสอบ extension ในเครื่อง**  
   ```sh
   cd extension && npm install && npm run compile
   ```  
   จากนั้นใน VS Code กด F5 เพื่อเปิด Extension Development Host แล้วลองใช้คำสั่ง "Color Converter: Open"

---

## Development

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

## Checkout Website
``https://colorspaced.netlify.app/``

## VS Code Extension

The repo includes a VS Code extension in `extension/` that opens the Color Converter web app.

### Local development
```sh
cd extension && npm install && npm run compile
```
Then press F5 in VS Code to launch the Extension Development Host.

### อัปโหลดแบบ Manual (สร้างไฟล์ VSIX แล้วลากขึ้น Marketplace)

ถ้าเห็นหน้า "Drag and Drop a file here or click to upload" บน Marketplace ให้ทำแบบนี้:

1. **แพ็ก extension เป็นไฟล์ .vsix**
   ```sh
   cd extension
   npm install
   npm run package
   ```
   จะได้ไฟล์ชื่อประมาณ `color-converter-0.1.0.vsix` ในโฟลเดอร์ `extension/` (ใช้ลากไปอัปโหลดได้เลย)

2. **อัปโหลดไฟล์**
   - ไปที่ [marketplace.visualstudio.com/manage](https://marketplace.visualstudio.com/manage) → เลือก publisher ของคุณ
   - กด **New extension** → **Visual Studio Code**
   - ลากไฟล์ **.vsix** ไปวางในช่อง "Drag and Drop a file here" (หรือกดคลิกเพื่อเลือกไฟล์)

3. **อัปเดตเวอร์ชันรอบถัดไป**
   - แก้ `version` ใน `extension/package.json` (เช่น เป็น `0.1.1`)
   - รัน `npm run package` ในโฟลเดอร์ `extension` อีกครั้ง แล้วอัปโหลดไฟล์ .vsix ใหม่ที่หน้า manage ของ extension เดิม

### Publish (CD)
1. Create a [publisher](https://marketplace.visualstudio.com/manage) on VS Code Marketplace (e.g. `colorcollector`).
2. Create an [Azure DevOps Personal Access Token](https://dev.azure.com) with **Marketplace (Publish)** scope.
3. Add repo secret: **VSCE_PAT** = that token.
4. Create a **Release** with tag `v0.1.0` (or run workflow manually with version). The workflow will build and publish the extension.