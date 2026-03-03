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
