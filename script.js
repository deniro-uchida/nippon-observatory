/*
 * ニッポン発生観測所 — event engine
 *
 * 数字・発生間隔・演出は EVENTS に集約しています。
 * 年度版の統計を更新するときは annualCount だけを差し替えれば、
 * 累計カウンターと平均発生間隔に反映されます。
 * soundFile は実音源を追加する際の差し替え口です（現在は仮SE）。
 */

const EVENTS = [
  // 高頻度：カウンター主体。個別の発生タイマーは作らない。
  {id:"delivery", jp:"宅配便", en:"DELIVERY", ic:"📦", c:"#ff9a3d", annualCount:5031470000, category:"high", counterMode:"clock", sound:null, soundFile:null, duration:0, priority:0, animationType:"none", isRare:false},
  {id:"visitor", jp:"訪日外国人", en:"VISITOR", ic:"✈️", c:"#3fa9ff", annualCount:42683600, category:"high", counterMode:"clock", sound:null, soundFile:null, duration:0, priority:0, animationType:"none", isRare:false},

  // 通常イベント
  {id:"ambulance", jp:"救急車出動", en:"AMBULANCE", ic:"🚑", c:"#ff4d5a", annualCount:7718380, category:"normal", sound:"siren", soundFile:null, duration:800, priority:2, animationType:"pulse", isRare:false},
  {id:"blood", jp:"献血", en:"BLOOD", ic:"💧", c:"#2b9bff", annualCount:5013064, category:"normal", sound:"suction", soundFile:null, duration:1000, priority:2, animationType:"shrink", isRare:false},
  {id:"birth", jp:"出生", en:"BIRTH", ic:"👶", c:"#ffc83d", annualCount:686173, category:"normal", sound:"baby", soundFile:null, duration:1500, priority:2, animationType:"bounce", isRare:false},
  {id:"marriage", jp:"結婚", en:"MARRIAGE", ic:"💍", c:"#ff6fa5", annualCount:485092, category:"normal", sound:"bell", soundFile:null, duration:1800, priority:2, animationType:"rings", isRare:false},
  {id:"divorce", jp:"離婚", en:"DIVORCE", ic:"💔", c:"#ff5d8f", annualCount:185904, category:"normal", sound:"snap", soundFile:null, duration:1500, priority:2, animationType:"split", isRare:false},
  {id:"traffic", jp:"交通事故", en:"ACCIDENT", ic:"🚗", c:"#3fa9ff", annualCount:290895, category:"normal", sound:"brake", soundFile:null, duration:1200, priority:2, animationType:"impact", isRare:false},
  {id:"theft", jp:"窃盗", en:"THEFT", ic:"👜", c:"#9b6cff", annualCount:501507, category:"normal", sound:"click", soundFile:null, duration:1000, priority:2, animationType:"dash", isRare:false},
  {id:"fraud", jp:"詐欺", en:"FRAUD", ic:"☎", c:"#8b4cff", annualCount:57324, category:"normal", sound:"notification", soundFile:null, duration:1500, priority:2, animationType:"notice", isRare:false},
  {id:"assaultInjury", jp:"暴行・傷害", en:"ASSAULT", ic:"✦", c:"#ff6b6b", annualCount:51542, category:"normal", sound:"heavyHit", soundFile:null, duration:1500, priority:2, animationType:"impact", isRare:false},
  {id:"founding", jp:"会社設立", en:"FOUNDING", ic:"🏢", c:"#dbe6f5", annualCount:144757, category:"normal", sound:"startup", soundFile:null, duration:1500, priority:2, animationType:"rise", isRare:false},

  // 死亡イベント：死因ごとに独立。SE は共通の抽象的な下降音。
  {id:"cancer", jp:"死亡（がん）", en:"CANCER", ic:"✣", c:"#c9d6e8", annualCount:384111, category:"death", sound:"down", soundFile:null, duration:1500, priority:2, animationType:"fade", isRare:false},
  {id:"heart", jp:"死亡（心疾患）", en:"HEART", ic:"♡", c:"#c9d6e8", annualCount:226388, category:"death", sound:"down", soundFile:null, duration:1500, priority:2, animationType:"fade", isRare:false},
  {id:"aging", jp:"死亡（老衰）", en:"AGING", ic:"◌", c:"#c9d6e8", annualCount:206887, category:"death", sound:"down", soundFile:null, duration:1500, priority:2, animationType:"fade", isRare:false},
  {id:"stroke", jp:"死亡（脳血管疾患）", en:"STROKE", ic:"⌁", c:"#c9d6e8", annualCount:102821, category:"death", sound:"down", soundFile:null, duration:1500, priority:2, animationType:"fade", isRare:false},
  {id:"pneumonia", jp:"死亡（肺炎）", en:"PNEUMONIA", ic:"○", c:"#c9d6e8", annualCount:80176, category:"death", sound:"down", soundFile:null, duration:1500, priority:2, animationType:"fade", isRare:false},
  {id:"accidentDeath", jp:"死亡（不慮の事故）", en:"ACCIDENT", ic:"△", c:"#c9d6e8", annualCount:45743, category:"death", sound:"down", soundFile:null, duration:1500, priority:2, animationType:"fade", isRare:false},
  // 2024年総死亡数から、サイト内で個別表示する死因を差し引いた値。
  {id:"otherDeath", jp:"死亡（その他）", en:"OTHER", ic:"·", c:"#aebbd0", annualCount:559252, category:"death", sound:"down", soundFile:null, duration:1500, priority:2, animationType:"fade", isRare:false},

  // レアイベント：通常イベントより強い演出。
  {id:"fire", jp:"火災", en:"FIRE", ic:"🔥", c:"#ff4a2b", annualCount:37141, category:"rare", sound:"alarm", soundFile:null, duration:3500, priority:4, animationType:"fire", isRare:true},
  {id:"earthquake", jp:"地震", en:"EARTHQUAKE", ic:"⌁", c:"#e8eef8", annualCount:4001, category:"rare", sound:"rumble", soundFile:null, duration:5000, priority:5, animationType:"quake", isRare:true},
  {id:"robbery", jp:"強盗", en:"ROBBERY", ic:"◈", c:"#ffb03a", annualCount:1370, category:"rare", sound:"warning", soundFile:null, duration:3000, priority:4, animationType:"warning", isRare:true},
  {id:"murder", jp:"殺人", en:"MURDER", ic:"!", c:"#e8eef8", annualCount:970, category:"rare", sound:"scream", soundFile:null, duration:4500, priority:5, animationType:"warning", isRare:true},
  {id:"bankruptcy", jp:"企業倒産", en:"BANKRUPTCY", ic:"▥", c:"#cfdcee", annualCount:9901, category:"rare", sound:"collapse", soundFile:null, duration:2500, priority:4, animationType:"collapse", isRare:true}
];

const ICON_ROOT = "assets/icons/category-v1/";
const CATEGORY_COLORS = {
  logistics: "#ffb03a",
  mobility: "#3fd7ff",
  care: "#ff4d5a",
  life: "#c8f83c",
  crime: "#9b6cff",
  disaster: "#ff7b45",
  death: "#b8cce4",
  society: "#a8b9d3"
};
const EVENT_TONES = {
  delivery:"logistics", visitor:"mobility", ambulance:"care", blood:"care",
  birth:"life", marriage:"life", divorce:"life", traffic:"mobility",
  theft:"crime", fraud:"crime", assaultInjury:"crime", founding:"society",
  cancer:"death", heart:"death", aging:"death", stroke:"death", pneumonia:"death",
  accidentDeath:"disaster", otherDeath:"death", fire:"disaster", earthquake:"disaster",
  robbery:"crime", murder:"crime", bankruptcy:"society"
};
const SOUND_FILES = {
  ambulance: "assets/se/ambulance.wav",
  blood: "assets/se/blood.wav",
  birth: "assets/se/baby.wav",
  marriage: "assets/se/marriage.wav",
  divorce: "assets/se/divcace.wav",
  traffic: "assets/se/accident.wav",
  theft: "assets/se/theft.wav",
  fraud: "assets/se/fraud.wav",
  assaultInjury: "assets/se/assault.wav",
  founding: "assets/se/founding.wav",
  cancer: "assets/se/death.wav",
  heart: "assets/se/death.wav",
  aging: "assets/se/death.wav",
  stroke: "assets/se/death.wav",
  pneumonia: "assets/se/death.wav",
  accidentDeath: "assets/se/accident.wav",
  otherDeath: "assets/se/death.wav",
  fire: "assets/se/fire.wav",
  earthquake: "assets/se/earthquake.wav",
  robbery: "assets/se/robbery.wav",
  murder: "assets/se/murder.wav",
  bankruptcy: "assets/se/bankruptcy.wav"
};
EVENTS.forEach(ev => {
  ev.tone = EVENT_TONES[ev.id] || "society";
  ev.c = CATEGORY_COLORS[ev.tone] || ev.c;
  ev.iconSrc = `${ICON_ROOT}${ev.id}.png`;
  ev.soundFile = SOUND_FILES[ev.id] || null;
});

function iconMarkup(ev) {
  return `<img class="event-icon" src="${ev.iconSrc}" alt="" aria-hidden="true">`;
}

const TONE_ORDER = ["logistics", "mobility", "care", "life", "crime", "disaster", "death", "society"];
const OBSERVATION_ORDER = [...EVENTS].sort((a, b) => {
  const toneDiff = TONE_ORDER.indexOf(a.tone) - TONE_ORDER.indexOf(b.tone);
  if (toneDiff) return toneDiff;
  return (b.annualCount ?? -1) - (a.annualCount ?? -1);
});

const FIXED_STATS = [
  {...EVENTS.find(e => e.id === "delivery"), rate:"約160個 / 秒"},
  {...EVENTS.find(e => e.id === "visitor"), rate:"約0.74秒に1人"}
];
let dynamicStats = ["ambulance", "blood", "birth"].map(id => EVENTS.find(ev => ev.id === id));

const $ = selector => document.querySelector(selector);
const p2 = n => String(n).padStart(2, "0");
const WD = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function yearInfo(now = new Date()) {
  const year = now.getFullYear();
  const start = new Date(year, 0, 1);
  const end = new Date(year + 1, 0, 1);
  return {year, start, end, elapsed: Math.max(0, now - start) / 1000, total: (end - start) / 1000};
}

function estimate(ev, now = new Date()) {
  if (!Number.isFinite(ev.annualCount)) return null;
  const info = yearInfo(now);
  return Math.floor(ev.annualCount * info.elapsed / info.total);
}

function averageSeconds(ev) {
  if (!Number.isFinite(ev.annualCount) || ev.annualCount <= 0) return null;
  return yearInfo().total / ev.annualCount;
}

function formatTime(date) {
  return `${p2(date.getHours())}:${p2(date.getMinutes())}:${p2(date.getSeconds())}`;
}

function eventUnit(ev) {
  if (["delivery"].includes(ev.id)) return "個";
  if (["visitor", "birth", "cancer", "heart", "aging", "stroke", "pneumonia", "accidentDeath", "otherDeath"].includes(ev.id)) return "人";
  if (["blood", "earthquake"].includes(ev.id)) return "回";
  if (["marriage", "divorce"].includes(ev.id)) return "組";
  if (["founding", "bankruptcy"].includes(ev.id)) return "件";
  return "件";
}

function formatRate(seconds, unit = "件") {
  if (!Number.isFinite(seconds)) return "総死亡数から算出";
  if (seconds < 1) return `約${seconds.toFixed(3)}秒に1${unit}`;
  if (seconds < 60) return `約${seconds < 10 ? seconds.toFixed(1) : Math.round(seconds)}秒に1${unit}`;
  if (seconds < 3600) {
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return s ? `約${m}分${s}秒に1${unit}` : `約${m}分に1${unit}`;
  }
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  return m ? `約${h}時間${m}分に1${unit}` : `約${h}時間に1${unit}`;
}

/* ---------- 左：年初からの推定累計 ---------- */
const statsEl = $("#stats");
function counterStats() {
  return [...FIXED_STATS, ...dynamicStats];
}

function createStatNode(ev) {
  const el = document.createElement("div");
  el.className = "stat";
  el.dataset.statId = ev.id;
  el.innerHTML = `
    <div class="hex" style="color:${ev.c}">
      <svg class="shape" viewBox="0 0 56 62" aria-hidden="true">
        <polygon points="28,2 53,16 53,46 28,60 3,46 3,16" fill="${ev.c}1f" stroke="${ev.c}" stroke-width="1.4" opacity=".9"/>
      </svg>
      <span class="ic"></span>
    </div>
    <div class="body">
      <div class="nm"></div>
      <div class="val">—</div>
      <div class="rate"></div>
    </div>`;
  return el;
}

function updateStatNode(el, ev, index) {
  const estimated = estimate(ev);
  el.dataset.statId = ev.id;
  el.style.setProperty("--stat-color", ev.c);
  el.querySelector(".hex").style.color = ev.c;
  const polygon = el.querySelector(".shape polygon");
  polygon.setAttribute("fill", `${ev.c}1f`);
  polygon.setAttribute("stroke", ev.c);
  el.querySelector(".ic").innerHTML = iconMarkup(ev);
  el.querySelector(".nm").textContent = ev.jp;
  const value = el.querySelector(".val");
  value.id = `cnt${index}`;
  value.textContent = estimated === null ? "—" : estimated.toLocaleString("en-US");
  el.querySelector(".rate").textContent = ev.rate || formatRate(averageSeconds(ev), eventUnit(ev));
}

function formatRollingValue(value) {
  return value.replace(/^0+(?=\d)/, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function rollNumberDigits(el, to) {
  if (!el || !Number.isFinite(to)) return;
  if (el._countUpFrame) cancelAnimationFrame(el._countUpFrame);
  const digits = String(Math.max(0, Math.round(to)));
  const targets = [...digits].reverse().map(Number);
  const stepDurations = targets.map(digit => digit === 0 ? 30 : 40 + digit * 16);
  const totalDuration = stepDurations.reduce((sum, duration) => sum + duration, 0);
  const start = performance.now();
  el.dataset.counting = "true";
  el.classList.add("is-counting");
  const frame = now => {
    const elapsed = now - start;
    const progress = Math.min(1, elapsed / totalDuration);
    let stepIndex = 0;
    let stepStart = 0;
    while (stepIndex < stepDurations.length - 1 && elapsed >= stepStart + stepDurations[stepIndex]) {
      stepStart += stepDurations[stepIndex];
      stepIndex += 1;
    }
    const stepProgress = Math.min(1, Math.max(0, (elapsed - stepStart) / stepDurations[stepIndex]));
    const activeTarget = targets[stepIndex];
    const activeDigit = Math.min(activeTarget, Math.floor(stepProgress * (activeTarget + 1)));
    const suffix = digits.slice(digits.length - stepIndex);
    el.textContent = formatRollingValue(`${activeDigit}${suffix}`);
    if (progress < 1) {
      el._countUpFrame = requestAnimationFrame(frame);
      return;
    }
    el.textContent = to.toLocaleString("en-US");
    el.dataset.counting = "false";
    el.classList.remove("is-counting");
    delete el._countUpFrame;
  };
  el._countUpFrame = requestAnimationFrame(frame);
}

function renderStats(animate = false) {
  // 連続発生時に前回の移動アニメーションが計測位置へ影響しないようにする。
  [...statsEl.children].forEach(node => node.getAnimations?.().forEach(animation => animation.cancel()));
  const previous = new Map([...statsEl.children].map(node => [node.dataset.statId, node.getBoundingClientRect()]));
  const nodes = new Map([...statsEl.children].map(node => [node.dataset.statId, node]));
  const nextStats = counterStats();
  const nextIds = new Set(nextStats.map(ev => ev.id));

  [...nodes.keys()].forEach(id => {
    if (!nextIds.has(id)) nodes.get(id).remove();
  });

  nextStats.forEach((ev, index) => {
    let node = nodes.get(ev.id);
    if (!node) {
      node = createStatNode(ev);
      nodes.set(ev.id, node);
    }
    updateStatNode(node, ev, index);
    statsEl.appendChild(node);
  });

  if (!animate) return;
  requestAnimationFrame(() => {
    nextStats.forEach(ev => {
      const node = nodes.get(ev.id);
      const before = previous.get(ev.id);
      const after = node.getBoundingClientRect();
      if (before) {
        const deltaY = before.top - after.top;
        if (Math.abs(deltaY) > 1) {
          node.animate(
            [{transform:`translateY(${deltaY}px)`}, {transform:"translateY(0)"}],
            {duration:620, easing:"cubic-bezier(.22,.8,.28,1)"}
          );
        }
      } else {
        node.animate(
          [
            {opacity:0, transform:"translateX(-34px)", offset:0},
            {opacity:0, transform:"translateX(-14px)", offset:.42},
            {opacity:1, transform:"translateX(0)", offset:.72},
            {opacity:1, transform:"translateX(0)", offset:1}
          ],
          {duration:760, easing:"cubic-bezier(.22,.8,.28,1)"}
        );
      }
    });
  });
}

function promoteStat(ev) {
  if (ev.category === "high" || !Number.isFinite(ev.annualCount)) return;
  dynamicStats = [ev, ...dynamicStats.filter(item => item.id !== ev.id)].slice(0, 3);
  renderStats(true);
  requestAnimationFrame(() => {
    const node = statsEl.querySelector(`[data-stat-id="${ev.id}"]`);
    const value = node?.querySelector(".val");
    const target = estimate(ev);
    if (!value || !Number.isFinite(target)) return;
    // 割り込み直後は、右端の一桁から順番に数字を出して完成値へつなげる。
    rollNumberDigits(value, target);
  });
}

renderStats();

function tickCounters() {
  counterStats().forEach((ev, i) => {
    const node = document.getElementById(`cnt${i}`);
    const estimated = estimate(ev);
    if (node && node.dataset.counting !== "true") {
      node.textContent = estimated === null ? "—" : estimated.toLocaleString("en-US");
    }
  });
}
tickCounters();
requestAnimationFrame(function updateCounterFrame() {
  tickCounters();
  requestAnimationFrame(updateCounterFrame);
});

/* ---------- 時計と年間進捗 ---------- */
function tickClock() {
  const now = new Date();
  $("#clock").textContent = `${now.getFullYear()}.${p2(now.getMonth() + 1)}.${p2(now.getDate())} ${WD[now.getDay()]} ${formatTime(now)}`;
  const info = yearInfo(now);
  const pct = info.elapsed / info.total * 100;
  $("#yearPct").textContent = `${pct.toFixed(1)}%`;
  const circumference = 2 * Math.PI * 38;
  $("#yearArc").setAttribute("stroke-dasharray", `${circumference * pct / 100} ${circumference}`);
  const range = $(".range");
  if (range) range.textContent = "一年の進捗状況";
}
tickClock();
setInterval(tickClock, 1000);

/* ---------- 最近の出来事 ---------- */
const feed = $("#feed");
function makeRow(ev, time, isNew = false) {
  const row = document.createElement("div");
  row.className = `row${isNew ? " new" : ""}`;
  row.innerHTML = `<span class="t">${time}</span><span class="ic" style="color:${ev.c}">${iconMarkup(ev)}</span><span class="nm">${ev.jp}</span>`;
  return row;
}

function addToFeed(ev, date = new Date()) {
  feed.insertBefore(makeRow(ev, formatTime(date), true), feed.firstChild);
  while (feed.children.length > 12) feed.removeChild(feed.lastChild);
}

function seededEvents() {
  const ordered = EVENTS.filter(ev => ev.category !== "high");
  const now = Date.now();
  for (let i = 0; i < 12; i++) {
    feed.appendChild(makeRow(ordered[i % ordered.length], formatTime(new Date(now - i * 2600))));
  }
}
seededEvents();

/* ---------- イベント演出 ---------- */
const center = $(".center");
const activePops = [];
const MAX_POPS = 26;
const recentPositions = [];
let audioContext = null;
let soundEnabled = true;
let audioUnlocked = false;
const activeVoices = [];
const lastSoundAt = new Map();

// ブラウザの自動再生制限を、ページ上の最初の操作で解除する。
// サウンド設定は初期ONのまま保持し、操作前の自動発生だけ無音にする。
function unlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === "suspended") audioContext.resume().catch(() => {});
  } catch (_) {
    // Web Audio API が使えない環境では、実音源の再生だけを試みる。
  }
}

document.addEventListener("pointerdown", unlockAudio, {capture:true, once:true});
document.addEventListener("keydown", unlockAudio, {capture:true, once:true});
// 日本列島の上に重なるように設定した、おおまかな発生ゾーン（center基準の%）。
// 正確な都道府県位置ではなく、列島の流れを感じるための演出用座標。
const MAP_EFFECT_ZONES = [
  {left:71, top:15, spreadX:9, spreadY:7}, // 北海道
  {left:67, top:27, spreadX:10, spreadY:8}, // 東北
  {left:62, top:40, spreadX:10, spreadY:9}, // 関東
  {left:56, top:52, spreadX:11, spreadY:9}, // 中部
  {left:49, top:63, spreadX:12, spreadY:9}, // 関西・中国
  {left:40, top:73, spreadX:12, spreadY:9}, // 四国・九州
  {left:29, top:83, spreadX:10, spreadY:7}  // 南九州・沖縄方面
];

function ensurePopLayer() {
  let layer = $("#mapPops");
  if (!layer) {
    layer = document.createElement("div");
    layer.id = "mapPops";
    layer.className = "map-pops";
    center.appendChild(layer);
  }
  return layer;
}

function randomPosition() {
  // 列島の流れに沿ったゾーンから選び、同じ場所への連続表示だけ避ける。
  for (let attempt = 0; attempt < 12; attempt++) {
    const zone = MAP_EFFECT_ZONES[Math.floor(Math.random() * MAP_EFFECT_ZONES.length)];
    const candidate = {
      left: zone.left + (Math.random() - .5) * zone.spreadX,
      top: zone.top + (Math.random() - .5) * zone.spreadY
    };
    const separated = recentPositions.every(pos => Math.hypot(pos.left - candidate.left, pos.top - candidate.top) > 9);
    if (separated || attempt === 11) {
      recentPositions.push(candidate);
      if (recentPositions.length > 12) recentPositions.shift();
      return candidate;
    }
  }
  return {left: 50, top: 50};
}

function playSound(kind, ev) {
  if (!soundEnabled || !audioUnlocked) return;
  const nowMs = performance.now();
  const previous = lastSoundAt.get(kind) || 0;
  if (nowMs - previous < 160) return;
  lastSoundAt.set(kind, nowMs);
  if (ev && ev.soundFile) {
    const audio = new Audio(ev.soundFile);
    audio.volume = 0.18;
    audio.play().catch(() => {});
    return;
  }
  try {
    const voicePriority = ev?.priority || 1;
    if (activeVoices.length >= 5) {
      const weakest = activeVoices.reduce((a, b) => (a.priority <= b.priority ? a : b));
      if (weakest.priority >= voicePriority) return;
      weakest.osc.stop();
      activeVoices.splice(activeVoices.indexOf(weakest), 1);
    }
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === "suspended") audioContext.resume();
    const now = audioContext.currentTime;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const settings = {
      siren:[650, 0.12, "square"], suction:[220, 0.10, "sine"], baby:[740, 0.12, "triangle"],
      bell:[880, 0.18, "sine"], snap:[160, 0.10, "square"], brake:[120, 0.10, "sawtooth"],
      click:[900, 0.07, "square"], notification:[520, 0.10, "sine"], hit:[130, 0.12, "square"],
      heavyHit:[90, 0.14, "square"], startup:[440, 0.12, "triangle"], down:[420, 0.16, "sine"],
      alarm:[460, 0.16, "square"], rumble:[55, 0.22, "sine"], warning:[180, 0.14, "square"],
      scream:[700, 0.13, "sawtooth"], collapse:[90, 0.15, "sawtooth"]
    }[kind] || [400, 0.08, "sine"];
    osc.type = settings[2];
    osc.frequency.setValueAtTime(settings[0], now);
    if (kind === "down" || kind === "collapse" || kind === "rumble") osc.frequency.exponentialRampToValueAtTime(45, now + 0.28);
    if (kind === "siren") osc.frequency.linearRampToValueAtTime(980, now + 0.18);
    gain.gain.setValueAtTime(settings[1], now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc.connect(gain).connect(audioContext.destination);
    const voice = {osc, priority:voicePriority};
    activeVoices.push(voice);
    osc.addEventListener("ended", () => {
      const index = activeVoices.indexOf(voice);
      if (index >= 0) activeVoices.splice(index, 1);
    }, {once:true});
    osc.start(now);
    osc.stop(now + 0.32);
  } catch (_) {
    // AudioContext が使えない環境でも画面演出は継続する。
  }
}

function triggerMapEffect(ev, isTest = false) {
  const layer = ensurePopLayer();
  const pop = document.createElement("div");
  const pos = randomPosition();
  const displayDuration = ev.isRare ? Math.max((ev.duration || 1500) * 1.4, 5000) : Math.max((ev.duration || 1200) * 2.5, 3600);
  pop.className = `map-pop event-${ev.id} effect-${ev.animationType}${ev.isRare ? " rare" : ""}`;
  pop.style.setProperty("--event-color", ev.c);
  pop.style.setProperty("--pop-duration", `${displayDuration}ms`);
  pop.style.left = `${pos.left}%`;
  pop.style.top = `${pos.top}%`;
  pop.innerHTML = `<span class="pop-hex" style="color:${ev.c}"><svg viewBox="0 0 56 62" aria-hidden="true"><polygon points="28,2 53,16 53,46 28,60 3,46 3,16" fill="${ev.c}1f" stroke="${ev.c}" stroke-width="1.4" opacity=".9"/></svg><span class="pop-icon">${iconMarkup(ev)}</span></span><span class="pop-name">${ev.jp}</span>`;
  layer.appendChild(pop);
  activePops.push(pop);
  while (activePops.length > MAX_POPS) activePops.shift()?.remove();
  window.setTimeout(() => {
    pop.remove();
    const index = activePops.indexOf(pop);
    if (index >= 0) activePops.splice(index, 1);
  }, displayDuration + 100);

  if (ev.animationType === "quake") {
    document.body.classList.add("quake-shake");
    window.setTimeout(() => document.body.classList.remove("quake-shake"), ev.duration || 5000);
  }
  if (ev.animationType === "fire" || ev.animationType === "warning" || ev.animationType === "collapse") {
    const bodyEffect = ev.id === "murder" ? "event-murder" : `event-${ev.animationType}`;
    document.body.classList.add(bodyEffect);
    window.setTimeout(() => document.body.classList.remove(bodyEffect), ev.duration || 2500);
  }
  playSound(ev.sound, ev);
  if (!isTest) promoteStat(ev);
  if (!isTest) flashTile(ev);
  // テストクリックは、ログと推定累計に影響させない。
  if (!isTest) addToFeed(ev);
}

const tileByEventId = new Map();
function flashTile(ev) {
  const tile = tileByEventId.get(ev.id);
  if (!tile) return;
  tile.classList.remove("is-occurring");
  void tile.offsetWidth;
  tile.classList.add("is-occurring");
  const plus = document.createElement("span");
  plus.className = "tile-plus";
  plus.textContent = "+1";
  tile.appendChild(plus);
  window.setTimeout(() => {
    tile.classList.remove("is-occurring");
    plus.remove();
  }, 1800);
}

/* ---------- View：スクロール可能なイベント表 ---------- */
const eventTableModal = $("#eventTableModal");
const eventTableBody = $("#eventTableBody");
const sourceModal = $("#sourceModal");
const sourceBtn = $("#sourceBtn");

function openSources() {
  sourceModal.classList.add("is-open");
  sourceModal.setAttribute("aria-hidden", "false");
  sourceBtn.setAttribute("aria-expanded", "true");
}

function closeSources() {
  sourceModal.classList.remove("is-open");
  sourceModal.setAttribute("aria-hidden", "true");
  sourceBtn.setAttribute("aria-expanded", "false");
}

function eventTableLabel(ev) {
  const unit = eventUnit(ev);
  const emphasizeNumber = value => value.replace(/(\d[\d,]*(?:\.\d+)?)/, '<span class="table-number">$1</span>');
  return {
    annual: Number.isFinite(ev.annualCount) ? emphasizeNumber(`${ev.annualCount.toLocaleString("en-US")}${unit}`) : "要設定",
    rate: emphasizeNumber(formatRate(averageSeconds(ev), unit))
  };
}

function renderEventTable() {
  eventTableBody.innerHTML = OBSERVATION_ORDER.map(ev => {
    const values = eventTableLabel(ev);
    return `<tr><td><span class="table-icon" style="color:${ev.c}">${iconMarkup(ev)}</span><span><b>${ev.jp}</b><small>${ev.en}</small></span></td><td>${values.annual}</td><td>${values.rate}</td></tr>`;
  }).join("");
}

function openEventTable() {
  renderEventTable();
  eventTableModal.classList.add("is-open");
  eventTableModal.setAttribute("aria-hidden", "false");
}

function closeEventTable() {
  eventTableModal.classList.remove("is-open");
  eventTableModal.setAttribute("aria-hidden", "true");
}

$("#viewEventsBtn").addEventListener("click", openEventTable);
$("#eventTableClose").addEventListener("click", closeEventTable);
$("#eventTableBackdrop").addEventListener("click", closeEventTable);
sourceBtn.addEventListener("click", openSources);
$("#sourceClose").addEventListener("click", closeSources);
$("#sourceBackdrop").addEventListener("click", closeSources);
document.addEventListener("keydown", event => {
  if (event.key !== "Escape") return;
  closeEventTable();
  closeSources();
});

/* ---------- 平均発生間隔によるイベント生成 ---------- */
function randomDelay(ev) {
  const average = averageSeconds(ev);
  // 指数分布に近い揺らぎ。極端な待ち時間だけ UX 用に抑える。
  const sample = -Math.log(1 - Math.random()) * average;
  const minimum = ev.isRare ? 8 : 0.5;
  const maximum = Math.max(average * 3.5, minimum);
  return Math.min(Math.max(sample, minimum), maximum) * 1000;
}

function scheduleEvent(ev) {
  window.setTimeout(() => {
    triggerMapEffect(ev);
    scheduleEvent(ev);
  }, randomDelay(ev));
}

EVENTS.filter(ev => ev.category !== "high" && Number.isFinite(ev.annualCount) && ev.annualCount > 0).forEach(scheduleEvent);

/* ---------- 下部イベント一覧 ---------- */
const tiles = $("#tiles");
OBSERVATION_ORDER.forEach((ev, index) => {
  const tile = document.createElement("button");
  const previous = OBSERVATION_ORDER[index - 1];
  tile.className = `tile${!previous || previous.tone !== ev.tone ? " group-start" : ""}`;
  tile.type = "button";
  tile.dataset.eventId = ev.id;
  tile.dataset.tone = ev.tone;
  tile.style.setProperty("--tile-color", ev.c);
  tile.setAttribute("aria-label", `${ev.jp}の観測演出を再生`);
  tile.innerHTML = `<span class="ic" style="color:${ev.c}">${iconMarkup(ev)}</span><span class="jp">${ev.jp.replace("死亡（", "死亡 ").replace("）", "")}</span><span class="en">${ev.en}</span><span class="tile-rate">${formatRate(averageSeconds(ev), eventUnit(ev))}</span>`;
  tile.addEventListener("click", () => {
    unlockAudio();
    triggerMapEffect(ev, true);
  });
  tileByEventId.set(ev.id, tile);
  tiles.appendChild(tile);
});

/* ---------- イコライザー ---------- */
const eq = $("#eqbars");
for (let i = 0; i < 90; i++) {
  const bar = document.createElement("i");
  bar.style.height = `${14 + Math.random() * 90}px`;
  bar.style.animationDelay = `${-Math.random() * 1.8}s`;
  bar.style.animationDuration = `${1.1 + Math.random() * 1.4}s`;
  eq.appendChild(bar);
}

/* ---------- サウンド ---------- */
$("#soundBtn").addEventListener("click", () => {
  unlockAudio();
  soundEnabled = !soundEnabled;
  $("#soundLbl").textContent = soundEnabled ? "サウンド ON" : "サウンド OFF";
  $("#soundBtn").setAttribute("aria-pressed", String(soundEnabled));
  if (soundEnabled) playSound("click");
});
