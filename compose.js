// 見出し画像を作る（note の画面の中で実行する）。TITLE・READER・PHOTO を入れて使う
const TITLE = '__TITLE__';
const READER = '__READER__'; // 非エンジニアの実務者 / 中小企業の中間管理職
const PHOTO = '__PHOTO__';   // 例 photos/02_whiteboard_flow.jpg
const BASE = 'https://raw.githubusercontent.com/hiratoru/kawaru-bucho-images/main/';
const W = 1280, H = 670;
const font = new FontFace('KB', `url(${BASE}fonts/NotoSansJP-wght.ttf)`, { weight: '100 900' });
await font.load(); document.fonts.add(font);
const img = new Image(); img.crossOrigin = 'anonymous';
img.src = BASE + PHOTO; await img.decode();
const c = document.createElement('canvas'); c.width = W; c.height = H;
const x = c.getContext('2d');
// 写真を全面に（中央で切り抜き）
const s = Math.max(W / img.width, H / img.height);
x.drawImage(img, (W - img.width * s) / 2, (H - img.height * s) / 2, img.width * s, img.height * s);
// 左を白くぼかす
const g = x.createLinearGradient(0, 0, W, 0);
g.addColorStop(0, 'rgba(255,255,255,.96)'); g.addColorStop(.34, 'rgba(255,255,255,.9)');
g.addColorStop(.52, 'rgba(255,255,255,.35)'); g.addColorStop(.62, 'rgba(255,255,255,0)');
x.fillStyle = g; x.fillRect(0, 0, W, H);
// シリーズ名のタグ
const tag = READER.includes('中間管理職') ? '中小企業が絶対に見るべきAI note' : 'エンジニア脳になる前に読むnote';
x.font = '700 22px KB'; const tw = x.measureText(tag).width;
const L = 64; let y = 150;
x.fillStyle = '#E08A3C'; x.beginPath(); x.roundRect(L, y, tw + 32, 40, 6); x.fill();
x.fillStyle = '#fff'; x.textBaseline = 'middle'; x.fillText(tag, L + 16, y + 21);
// 題名（句読点・記号で区切って最大3行。入らなければ文字を小さく）
const MAXW = 600;
function lines(fs) {
  x.font = `900 ${fs}px KB`;
  const parts = TITLE.replace(/([、。，！？!?…・])/g, '$1\n').replace(/([”」』])/g, '$1\n').split('\n').filter(Boolean);
  const out = []; let cur = '';
  for (const p of parts) {
    if (x.measureText(cur + p).width <= MAXW) { cur += p; continue; }
    if (cur) { out.push(cur); cur = ''; }
    for (const ch of p) {
      if (x.measureText(cur + ch).width > MAXW && cur && !'、。，！？!?…」』）)ー'.includes(ch)) { out.push(cur); cur = ch; }
      else cur += ch;
    }
  }
  if (cur) out.push(cur);
  return out;
}
let fs = 56, ls = lines(fs);
while ((ls.length > 3) && fs > 36) { fs -= 2; ls = lines(fs); }
x.fillStyle = '#1F2A33'; x.textBaseline = 'top';
y = 214; for (const l of ls) { x.fillText(l, L, y); y += fs * 1.32; }
// 名前
x.font = '700 22px KB'; x.fillStyle = '#4A5560'; x.textBaseline = 'alphabetic';
x.fillText('かわる部長', L, H - 44);
window.__kb = await new Promise(r => c.toBlob(r, 'image/jpeg', 0.9));
({ lines: ls, fontSize: fs, bytes: window.__kb.size })
