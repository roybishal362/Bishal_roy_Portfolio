// export_brand.mjs — turns design/brand-assets.html into the PNGs the site uses.
//   node design/export_brand.mjs
// It opens the page in headless Edge and screenshots each element by its id:
//   #i32, #i192     -> src/app/icon1.png, icon2.png   (browser tab; Next.js reads these file names)
//   #apple180       -> src/app/apple-icon.png          (phone home screen)
//   #og             -> src/app/opengraph-image.png and twitter-image.png (the picture shown when the link is shared)
//   #i512           -> design/br-mark-512.png          (the mark on its own, for LinkedIn and anywhere else)
// The tab and mark PNGs keep transparent corners. Needs Node 22+ (built-in WebSocket) and Microsoft Edge.
import { spawn } from "node:child_process";
import { writeFileSync, existsSync, copyFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { tmpdir } from "node:os";

const HERE = dirname(fileURLToPath(import.meta.url));
const APP = resolve(HERE, "..", "src", "app");
const PAGE = pathToFileURL(join(HERE, "brand-assets.html")).href;
const EDGE = ["C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "C:/Program Files/Microsoft/Edge/Application/msedge.exe"].find(existsSync);
const PORT = 9361;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const edge = spawn(EDGE, ["--headless=new", `--remote-debugging-port=${PORT}`, "--no-first-run", "--hide-scrollbars", "--allow-file-access-from-files",
  `--user-data-dir=${join(tmpdir(), "_edge_brand_export")}`, "about:blank"], { stdio: "ignore" });
let ws, id = 0; const pending = new Map();
const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });

try {
  let target;
  for (let i = 0; i < 40 && !target; i++) { await sleep(400); try { target = (await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()).find((t) => t.type === "page"); } catch {} }
  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { const p = pending.get(d.id); pending.delete(d.id); d.error ? p.rej(new Error(d.error.message)) : p.res(d.result); } };
  await send("Page.enable"); await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1500, height: 1500, deviceScaleFactor: 1, mobile: false });
  await send("Emulation.setDefaultBackgroundColorOverride", { color: { r: 0, g: 0, b: 0, a: 0 } });   // transparent page, so icon corners stay transparent
  await send("Page.navigate", { url: PAGE });
  await sleep(1500);
  await send("Runtime.evaluate", { expression: "document.fonts.ready.then(() => true)", awaitPromise: true });
  await sleep(1200);

  const grab = async (sel, out) => {
    const r = (await send("Runtime.evaluate", { expression: `JSON.stringify(document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect())`, returnByValue: true })).result.value;
    const b = JSON.parse(r);
    const shot = await send("Page.captureScreenshot", { format: "png", clip: { x: b.x, y: b.y, width: b.width, height: b.height, scale: 1 } });
    writeFileSync(out, Buffer.from(shot.data, "base64"));
    console.log("wrote", out.replace(resolve(HERE, ".."), "").replace(/\\/g, "/"), `${Math.round(b.width)}x${Math.round(b.height)}`);
  };

  await grab("#i32", join(APP, "icon1.png"));
  await grab("#i192", join(APP, "icon2.png"));
  await grab("#apple180", join(APP, "apple-icon.png"));
  await grab("#og", join(APP, "opengraph-image.png"));
  copyFileSync(join(APP, "opengraph-image.png"), join(APP, "twitter-image.png"));
  console.log("wrote /src/app/twitter-image.png (copy)");
  await grab("#i512", join(HERE, "br-mark-512.png"));
  await grab("#i16", join(HERE, "br-mark-16.png"));
} catch (e) {
  console.log("ERROR", e.message);
  process.exitCode = 1;
} finally {
  try { ws?.close(); } catch {}
  edge.kill();
}
