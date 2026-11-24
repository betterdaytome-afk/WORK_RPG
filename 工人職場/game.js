window.isHome = false;
let moveTarget = null, moveSpeed = 0, lastMoveTime = performance.now();

const stage=document.getElementById('stage'),heroBox=document.getElementById('hero-box'),singleImg=document.getElementById('single-img'),svgHolder=document.getElementById('svg-char-holder'),monsterBox=document.getElementById('monster-box'),monsterImg=document.getElementById('monster-img'),hpBar=document.getElementById('hp-bar'),btnS1=document.getElementById('btn-s1'),btnS2=document.getElementById('btn-s2'),btnS3=document.getElementById('btn-s3');
Object.assign(monsterBox.style, { display: 'flex', flexDirection: 'column', alignItems: 'center' });
const gridBox=document.getElementById('char-grid-box');
roster.forEach(c=>{const d=document.createElement('div');d.className='char-card';d.innerHTML=`<div style="width:84px;height:84px;margin:0 auto 6px;border-radius:14px;background:#fff url('heroes_3d.png') ${c.pos}/400% 200% no-repeat;box-shadow:0 4px 8px rgba(0,0,0,0.25);"></div><h4>${c.name}</h4>`;d.onclick=()=>sel(c);gridBox.appendChild(d);});

let hero = {
  id:'agumon', proj:'🔥', x:180, y:200, dir:1, lv:1, exp:0, maxExp:100, gold:0,
  baseAtk:18, bonusAtk:0, baseMatk:10, bonusMatk:0, spd:210, bonusSpd:0,
  hp:100, baseHp:100, hHp:0, mp:50, baseMp:50, hMp:0,
  defH:0, defC:0, bonusMdef:0, bonusAspd:0, stealHp:0, stealMp:0, skillMult:1,
  str: 5, agi: 5, vit: 5, int: 5,
  eq: { h: null, c: null, w: null }
}, monster={x:460,y:200,hp:100,maxHp:100}, cd={s1:false,s2:false,s3:false}, bag=[], loots=[];

function getMaxHp() { return hero.baseHp + hero.hHp + (hero.vit * 12); }
function getMaxMp() { return hero.baseMp + hero.hMp + (hero.int * 8); }
function getAtk()   { return hero.baseAtk + hero.bonusAtk + (hero.str * 2); }
function getMatk()  { return hero.baseMatk + hero.bonusMatk + (hero.int * 3); }
function getDef()   { return hero.defH + hero.defC + hero.vit; }
function getMdef()  { return hero.int + Math.floor(hero.vit * 0.5) + hero.bonusMdef; }
function getAspd()  { return Number((1 + hero.agi * 0.03 + hero.bonusAspd).toFixed(2)); }
function getSpd()   { return hero.spd + hero.bonusSpd; }

function updStat() {
  hero.hp = Math.min(hero.hp, getMaxHp());
  hero.mp = Math.min(hero.mp, getMaxMp());

  document.getElementById('ui-hp').textContent = `${hero.hp}/${getMaxHp()}`;
  document.getElementById('ui-mp').textContent = `${hero.mp}/${getMaxMp()}`;
  document.getElementById('ui-atk').textContent = getAtk();
  document.getElementById('ui-matk').textContent = getMatk();
  document.getElementById('ui-def').textContent = getDef();
  document.getElementById('ui-mdef').textContent = getMdef();
  document.getElementById('ui-aspd').textContent = getAspd();

  if (document.getElementById('ui-str')) {
    document.getElementById('ui-str').textContent = hero.str;
    document.getElementById('ui-agi').textContent = hero.agi;
    document.getElementById('ui-vit').textContent = hero.vit;
    document.getElementById('ui-int').textContent = hero.int;
  }
  if (document.getElementById('ui-gold')) document.getElementById('ui-gold').textContent = hero.gold;
  if (document.getElementById('cnt-hp')) document.getElementById('cnt-hp').textContent = bag.filter(it => it.t === 'hp').length;
  if (document.getElementById('cnt-mp')) document.getElementById('cnt-mp').textContent = bag.filter(it => it.t === 'mp').length;
}




function spawnVFX(x,y,color,count=12,isBig=false){for(let i=0;i<count;i++){const p=document.createElement('div'),size=isBig?Math.random()*12+6:Math.random()*6+4,angle=Math.random()*Math.PI*2,dist=isBig?Math.random()*140+40:Math.random()*60+20;Object.assign(p.style,{position:'absolute',left:x+'px',top:y+'px',width:size+'px',height:size+'px',borderRadius:'50%',background:i%2===0?color:'#ffffff',boxShadow:`0 0 10px ${color}`,pointerEvents:'none',zIndex:99,transition:'all 0.45s cubic-bezier(0.16, 1, 0.3, 1)',opacity:1});stage.appendChild(p);requestAnimationFrame(()=>{p.style.transform=`translate(${Math.cos(angle)*dist}px, ${Math.sin(angle)*dist}px) scale(0.2)`;p.style.opacity=0;});setTimeout(()=>p.remove(),460);}}
function spawnWave(x,y,color,maxSize=260){const w=document.createElement('div');Object.assign(w.style,{position:'absolute',left:x+'px',top:y+'px',width:'20px',height:'20px',borderRadius:'50%',border:`4px solid ${color}`,boxShadow:`0 0 20px ${color}, inset 0 0 15px ${color}`,transform:'translate(-50%, -50%) scale(1)',pointerEvents:'none',zIndex:98,transition:'all 0.45s ease-out',opacity:1});stage.appendChild(w);requestAnimationFrame(()=>{w.style.transform=`translate(-50%, -50%) scale(${maxSize/20})`;w.style.opacity=0;});setTimeout(()=>w.remove(),460);}
function screenFlash(color){stage.style.boxShadow=`inset 0 0 80px ${color}`;stage.style.transform=`translate(${Math.random()*10-5}px, ${Math.random()*10-5}px)`;setTimeout(()=>{stage.style.boxShadow='';stage.style.transform='';},150);}

function sel(c){document.getElementById('ui-player').textContent=document.getElementById('player-name').value.trim()||'阿明';document.getElementById('ui-partner').textContent=c.name;hero.id=c.id;hero.baseAtk=c.atk;hero.spd=c.spd;hero.proj=c.proj;hero.roleData={...c};heroBox.style.overflow='visible';heroBox.style.height='auto';singleImg.style.display='none';svgHolder.style.display='block';svgHolder.style.width='96px';svgHolder.style.height='96px';svgHolder.innerHTML=`<div style="width:96px;height:96px;background:url('heroes_3d.png') ${c.pos}/400% 200% no-repeat;${c.id==='tentomon'?'transform:scaleX(-1);':''}filter:drop-shadow(0 6px 6px rgba(0,0,0,0.45));"></div>`;btnS2.textContent=hero.lv>=2?`⚡ ${c.qName}(Q)`:`🔒 ${c.qName}(Lv.2)`;btnS3.textContent=hero.lv>=4?`💥 ${c.eName}(E)`:`🔒 ${c.eName}(Lv.4)`;updStat();document.getElementById('char-select-modal').style.display='none';}



// === 全新重寫：怪獸平順巡邏與波次系統 ===
// ✅ 貼上這段：職場地圖分區系統
// ✅ 貼上這段：樓層專屬背景圖 + 每層多等級怪物系統
const workMaps = [
  {
    id: 'lobby',
    name: '1F 門市大廳',
    bgImg: 'bg_work.png', // 👈 日後可換成 'bg_1f.png'
    monsters: [
      { lv: 1, name: '菜鳥奧客',   img: '奧客.png', hp: 85,  atk: 10, exp: 30, tier: 1, scale: 0.95, glow: 'none' },
      { lv: 2, name: '挑剔奧客',   img: '奧客.png', hp: 130, atk: 14, exp: 45, tier: 1, scale: 1.05, glow: 'drop-shadow(0 0 6px #ffeaa7)' },
      { lv: 3, name: '咆哮大奧客', img: '奧客.png', hp: 190, atk: 18, exp: 65, tier: 2, scale: 1.15, glow: 'drop-shadow(0 0 10px #ff7675)' }
    ]
  },
  {
    id: 'office',
    name: '5F 專案辦公室',
    bgImg: 'bg_work.png', // 👈 日後可換成 'bg_5f.png'
    monsters: [
      { lv: 4, name: '摸魚同事',   img: '豬隊友同事.png', hp: 260, atk: 22, exp: 80,  tier: 3, scale: 1.10, glow: 'none' },
      { lv: 5, name: '甩鍋豬隊友', img: '豬隊友同事.png', hp: 340, atk: 27, exp: 105, tier: 3, scale: 1.18, glow: 'drop-shadow(0 0 10px #ff4757)' },
      { lv: 6, name: '專案破壞王', img: '豬隊友同事.png', hp: 430, atk: 33, exp: 135, tier: 4, scale: 1.26, glow: 'drop-shadow(0 0 14px #e84393)' }
    ]
  },
  {
    id: 'boss',
    name: '18F 董事長室',
    bgImg: 'bg_work.png', // 👈 日後可換成 'bg_18f.png'
    monsters: [
      { lv: 8,  name: '畫大餅主管', img: '壞老闆.png', hp: 600,  atk: 40, exp: 180, tier: 6, scale: 1.28, glow: 'drop-shadow(0 0 12px #a55eea)' },
      { lv: 10, name: '無良慣老闆', img: '壞老闆.png', hp: 820,  atk: 48, exp: 240, tier: 7, scale: 1.36, glow: 'drop-shadow(0 0 18px #8e44ad)' },
      { lv: 12, name: '血汗總裁',   img: '壞老闆.png', hp: 1100, atk: 58, exp: 320, tier: 8, scale: 1.45, glow: 'drop-shadow(0 0 22px #ff0000)' }
    ]
  }
];

let currentMapIdx = 0;
let currentMonster = workMaps[0].monsters[0];
let monsterWave = currentMonster.tier;


// =========================================================================
// 👾 多怪同場系統（可自由調整場上同時存在的怪物數量）
// =========================================================================
const MAX_MONSTERS = 3; // 👈 想要場上同時出現幾隻怪，直接改這個數字（例如 3 或 4）
let monsters = [];

// 建立單一怪物的資料與畫面元素
function createOneMonster(idx, isInstant = false) {
  const floor = workMaps[currentMapIdx];
  const tpl = floor.monsters[Math.floor(Math.random() * floor.monsters.length)];
  monsterWave = tpl.tier;

  // 第 0 隻沿用原本 HTML 的 #monster-box，第 1 隻以上自動複製生成
  let box, img, bar, tag;
  if (idx === 0) {
    box = monsterBox;
    img = monsterImg;
    bar = hpBar;
    tag = document.getElementById('monster-name-tag');
    if (!tag) {
      tag = document.createElement('div');
      tag.id = 'monster-name-tag';
      box.insertBefore(tag, box.firstChild);
    }
  } else {
    box = document.createElement('div');
    box.className = 'extra-monster-box';
    Object.assign(box.style, {
      position: 'absolute',
      width: '120px',
      height: '110px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      transformOrigin: 'center bottom',
      mixBlendMode: 'multiply',
      pointerEvents: 'none',
      zIndex: 9
    });
    tag = document.createElement('div');
    img = document.createElement('img');
    Object.assign(img.style, { height: '100px', mixBlendMode: 'multiply', transform: 'rotateX(-22deg) translateY(-10px)', transformOrigin: 'center bottom' });
    const barBg = document.createElement('div');
    Object.assign(barBg.style, { width: '80px', height: '8px', background: '#2f3542', marginTop: '2px' });
    bar = document.createElement('div');
    Object.assign(bar.style, { width: '100%', height: '100%', background: '#ff4757', transition: 'width 0.15s' });
    barBg.appendChild(bar);
    box.appendChild(tag);
    box.appendChild(barBg);
    box.appendChild(img);
    stage.appendChild(box);
  }

  Object.assign(tag.style, {
    background: 'rgba(0,0,0,0.75)',
    color: '#ffeaa7',
    fontSize: '11px',
    fontWeight: 'bold',
    padding: '1px 7px',
    borderRadius: '8px',
    whiteSpace: 'nowrap',
    marginBottom: '2px'
  });
  tag.textContent = `Lv.${tpl.lv} ${tpl.name}`;

  const startX = Math.random() * (stage.clientWidth - 240) + 120;
  const startY = Math.random() * (stage.clientHeight - 240) + 120;

  img.src = tpl.img;
  img.style.scale = '1';
  box.style.transform = `translate(-50%, -50%) scale(${tpl.scale})`;
  img.style.filter = tpl.glow !== 'none' ? tpl.glow : 'drop-shadow(0 6px 8px rgba(0,0,0,0.45))';
  box.style.left = startX + 'px';
  box.style.top = startY + 'px';
  box.style.opacity = '1';
  bar.style.width = '100%';

  const mObj = {
    idx, tpl, box, img, bar, tag,
    x: startX, y: startY,
    tx: startX, ty: startY,
    hp: tpl.hp, maxHp: tpl.hp,
    dead: false
  };

  if (!isInstant) spawnWave(startX, startY, '#74b9ff', 180);
  return mObj;
}

// 取得距離玩家最近的存活怪物（讓子彈與掛機自動鎖定最近目標）
function getNearestMonster() {
  let best = null, minDist = Infinity;
  for (const m of monsters) {
    if (!m.dead && m.hp > 0) {
      const d = Math.hypot(hero.x - m.x, hero.y - m.y);
      if (d < minDist) { minDist = d; best = m; }
    }
  }
  if (best) {
    // 同步更新舊變數，確保所有技能特效與子彈軌道 100% 相容！
    monster.x = best.x;
    monster.y = best.y;
    monster.hp = best.hp;
    monster.maxHp = best.maxHp;
    currentMonster = best.tpl;
  } else {
    monster.hp = 0;
  }
  return best;
}

// 重新生成整層樓的多隻怪物
function spawnFloorMonster(isInstant = false) {
  document.querySelectorAll('.extra-monster-box').forEach(el => el.remove());
  monsters = [];
  for (let i = 0; i < MAX_MONSTERS; i++) {
    monsters.push(createOneMonster(i, isInstant));
  }
  getNearestMonster();
}

window.switchMap = function(idx) {
  currentMapIdx = Number(idx);
  const floor = workMaps[currentMapIdx];
  if (window.isHome) toggleHome();
  stage.style.setProperty('--stage-bg', `url('${floor.bgImg}')`);
  spawnFloorMonster(false);
};

// 每 2.2 秒幫場上每隻存活的怪物分配各自的隨機巡邏目標
setInterval(() => {
  if (window.isHome) return;
  const maxW = stage.clientWidth - 130, maxH = stage.clientHeight - 130;
  monsters.forEach(m => {
    if (m.dead || m.hp <= 0) return;
    m.tx = Math.max(130, Math.min(maxW, m.x + (Math.random() * 260 - 130)));
    m.ty = Math.max(130, Math.min(maxH, m.y + (Math.random() * 200 - 100)));
  });
}, 2200);

// 讓所有怪物平滑移動
(function monsterLoop() {
  if (!window.isHome) {
    monsters.forEach(m => {
      if (m.dead || m.hp <= 0) return;
      const dx = m.tx - m.x, dy = m.ty - m.y, dist = Math.hypot(dx, dy);
      if (dist > 2) {
        m.img.style.transform = dx > 0 ? 'scaleX(-1)' : 'scaleX(1)';
        m.x += (dx / dist) * 1.1;
        m.y += (dy / dist) * 1.1;
        m.box.style.left = m.x + 'px';
        m.box.style.top = m.y + 'px';
      }
    });
    getNearestMonster();
  }
  requestAnimationFrame(monsterLoop);
})();


function playAnim(cls, ms = 300) {
  svgHolder.classList.remove(cls);
  singleImg.classList.remove(cls);
  void svgHolder.offsetWidth;
  void singleImg.offsetWidth;
  svgHolder.classList.add(cls);
  singleImg.classList.add(cls);
  setTimeout(() => {
    svgHolder.classList.remove(cls);
    singleImg.classList.remove(cls);
  }, ms);
}

function walkTo(tx, ty, spd) {
  const maxW = stage.clientWidth - 50, maxH = stage.clientHeight - 50;
  moveTarget = { x: Math.max(50, Math.min(maxW, tx)), y: Math.max(50, Math.min(maxH, ty)) };
  moveSpeed = spd || getSpd(); // 👈 吃到衣服加的移動速度！
  heroBox.style.transition = 'none';
}

(function moveLoop(now) {
  const dt = Math.min((now - lastMoveTime) / 1000, 0.1);
  lastMoveTime = now;
  if (moveTarget) {
    svgHolder.classList.add('is-walking');
    singleImg.classList.add('is-walking');
    const dx = moveTarget.x - hero.x, dy = moveTarget.y - hero.y, dist = Math.hypot(dx, dy);
    if (dist <= moveSpeed * dt) {
      hero.x = moveTarget.x;
      hero.y = moveTarget.y;
      moveTarget = null;
      svgHolder.classList.remove('is-walking');
      singleImg.classList.remove('is-walking');
      if (!window.isHome) checkLoot();
    } else {
      hero.dir = dx < 0 ? -1 : 1;
      heroBox.style.transform = `scaleX(${-hero.dir})`;
      hero.x += (dx / dist) * moveSpeed * dt;
      hero.y += (dy / dist) * moveSpeed * dt;
      if (!window.isHome) checkLoot();
    }
    heroBox.style.left = hero.x + 'px';
    heroBox.style.top = hero.y + 'px';
  }
  requestAnimationFrame(moveLoop);
})(performance.now());




function checkLoot(){for(let i=loots.length-1;i>=0;i--){const l=loots.at(i);if(l&&Math.hypot(hero.x-l.x,hero.y-l.y)<85){l.el.remove();bag.push(l.data);loots.splice(i,1);renderBag();updStat();}}}

const affixPools = {
  h: [
    { key: 'mdef', label: '魔防', min: 3, max: 8 },
    { key: 'mp',   label: '魔力', min: 15, max: 35 },
    { key: 'matk', label: '魔攻', min: 4, max: 10 },
    { key: 'aspd', label: '攻速', min: 0.05, max: 0.12, isFloat: true }
  ],
  c: [
    { key: 'def',  label: '物防', min: 4, max: 10 },
    { key: 'hp',   label: '血量', min: 25, max: 60 },
    { key: 'atk',  label: '物攻', min: 4, max: 10 },
    { key: 'spd',  label: '移速', min: 12, max: 30 }
  ],
  w: [
    { key: 'matk',    label: '魔攻', min: 5, max: 14 },
    { key: 'atk',     label: '物攻', min: 5, max: 14 },
    { key: 'aspd',    label: '攻速', min: 0.06, max: 0.15, isFloat: true },
    { key: 'stealHp', label: '吸血', min: 2, max: 6 },
    { key: 'stealMp', label: '吸魔', min: 1, max: 4 }
  ]
};

function spawnLoot(x, y) {
  const d = { ...pool.at(Math.floor(Math.random() * pool.length)) };
  let rarity = 'common', color = '#ffffff';

  if (affixPools[d.t]) {
    d.atk = 0; d.matk = 0; d.def = 0; d.mdef = 0; d.hp = 0; d.mp = 0;
    d.aspd = 0; d.spd = 0; d.stealHp = 0; d.stealMp = 0;
    d.affixList = [];

    const count = Math.floor(Math.random() * 3) + 1;
    if (count === 3) { d.name = '[史詩]' + d.name; rarity = 'epic'; color = '#ffa502'; }
    else if (count === 2) { d.name = '[精良]' + d.name; rarity = 'rare'; color = '#00d2ff'; }
    else { d.name = '[普通]' + d.name; }

    const list = affixPools[d.t];
    for (let i = 0; i < count; i++) {
      const pick = list.at(Math.floor(Math.random() * list.length));
            const waveMult = 1 + (monsterWave - 1) * 0.08;
      const val = pick.isFloat
        ? Number(((Math.random() * (pick.max - pick.min) + pick.min) * (1 + (monsterWave - 1) * 0.02)).toFixed(2))
        : Math.floor((Math.random() * (pick.max - pick.min + 1) + pick.min) * waveMult);

      d[pick.key] = Number((d[pick.key] + val).toFixed(2));
      d.affixList.push(`+${val}${pick.label}`);
    }
  }

  d.color = color;
  const el = document.createElement('div');
  el.className = `loot-drop loot-${rarity}`;
  el.innerHTML = `${d.icon}<div class="loot-label" style="color:${color}">${d.name}</div>`;
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  el.onpointerdown = e => { e.stopPropagation(); walkTo(x, y); };
  stage.appendChild(el);
  loots.push({ x, y, el, data: d });
}

function getItemDesc(it) {
  if (it.t === 'p') return '使用後立即獲得 +50 經驗值';
  if (it.t === 'hp') return '使用後立即恢復 +50 點生命值';
  if (it.t === 'mp') return '使用後立即恢復 +30 點魔力值';
  const typeName = it.t === 'h' ? '頭部防具' : (it.t === 'c' ? '身體防具' : '武器裝備');
  return `${typeName}（隨機 ${it.affixList ? it.affixList.length : 1} 詞綴）：${(it.affixList || []).join(' / ')}`;
}

function renderBag() {
  document.getElementById('bag-list').innerHTML = bag.map((it, i) => {
    const s = it.t === 'p' ? '+50EXP' : (it.t === 'hp' ? '+50血' : (it.t === 'mp' ? '+30魔' : (it.affixList || []).join(' ')));
    return `<div class="bag-item" onclick="openBagMenu(${i})"><span style="color:${it.color || '#fff'};font-weight:bold;">${it.icon} ${it.name}</span><span style="font-size:11px;color:#ffeaa7">${s}</span></div>`;
  }).join('');
}

function recalcEquip() {
  const eqs = [hero.eq.h, hero.eq.c, hero.eq.w].filter(Boolean);
  hero.bonusAtk  = eqs.reduce((s, e) => s + (e.atk || 0), 0);
  hero.bonusMatk = eqs.reduce((s, e) => s + (e.matk || 0), 0);
  hero.defH      = hero.eq.h ? (hero.eq.h.def || 0) : 0;
  hero.defC      = hero.eq.c ? (hero.eq.c.def || 0) : 0;
  hero.bonusMdef = eqs.reduce((s, e) => s + (e.mdef || 0), 0);
  hero.hHp       = eqs.reduce((s, e) => s + (e.hp || 0), 0);
  hero.hMp       = eqs.reduce((s, e) => s + (e.mp || 0), 0);
  hero.bonusAspd = Number(eqs.reduce((s, e) => s + (e.aspd || 0), 0).toFixed(2));
  hero.bonusSpd  = eqs.reduce((s, e) => s + (e.spd || 0), 0);
  hero.stealHp   = eqs.reduce((s, e) => s + (e.stealHp || 0), 0);
  hero.stealMp   = eqs.reduce((s, e) => s + (e.stealMp || 0), 0);
}

window.useIt = function(i) {
  const it = bag.at(i);
  if (!it) return;
  if (it.reqJob && it.reqJob !== hero.id) {
    const jobRole = roster.find(r => r.id === it.reqJob);
    alert(`❌ 職業不符！這件裝備是【${jobRole ? jobRole.name : '其他職業'}】專用的，你可以選擇分解換金幣喔！`);
    return;
  }
  if (it.t === 'h' || it.t === 'c' || it.t === 'w') {
    hero.eq[it.t] = it;
    const summary = (it.affixList || []).join(' ');
    document.getElementById(`eq-${it.t}`).textContent = `${it.name} (${summary})`;
    recalcEquip();
    hero.hp += (it.hp || 0);
    hero.mp += (it.mp || 0);
  } else if (it.t === 'hp') {
    hero.hp = Math.min(getMaxHp(), hero.hp + it.val);
  } else if (it.t === 'mp') {
    hero.mp = Math.min(getMaxMp(), hero.mp + it.val);
  } else {
    hero.exp += it.exp;
    checkLv();
  }
  bag.splice(i, 1);
  updStat();
  renderBag();
};

stage.onpointerdown=e=>{const r=stage.getBoundingClientRect();walkTo(e.clientX-r.left,e.clientY-r.top);};
window.onkeydown=e=>{
  if(e.key==='ArrowUp')walkTo(hero.x,hero.y-45);
  if(e.key==='ArrowDown')walkTo(hero.x,hero.y+45);
  if(e.key==='ArrowLeft')walkTo(hero.x-45,hero.y);
  if(e.key==='ArrowRight')walkTo(hero.x+45,hero.y);
  if(e.code==='Space'){e.preventDefault();if(!e.repeat)s1();}
  if(e.key.toLowerCase()==='q'&&!e.repeat)s2();
  if(e.key.toLowerCase()==='e'&&!e.repeat)s3();
  if(e.key==='1'&&!e.repeat)drinkPotion('hp');
  if(e.key==='2'&&!e.repeat)drinkPotion('mp');
};

function drinkPotion(type) {
  const idx = bag.findIndex(it => it.t === type);
  if (idx === -1) {
    spawnVFX(hero.x, hero.y, '#636e72', 6, false);
    return;
  }
  useIt(idx);
  spawnWave(hero.x, hero.y, type === 'hp' ? '#ff6b81' : '#70a1ff', 140);
  if (window.sayQuote) window.sayQuote(type === 'hp' ? 'hp' : 'mp');
}
btnS1.onpointerdown=s1;btnS2.onpointerdown=s2;btnS3.onpointerdown=s3;


function s1(){
  if(cd.s1||isHome)return;
  cd.s1=true;
  const cdMs = Math.max(150, Math.floor(800 / getAspd())); // 攻速越高，冷卻越短！
  setTimeout(()=>cd.s1=false, cdMs);
  const r=hero.roleData||roster, dmg=getAtk()+hero.lv*5, count=r.projCount||1;
  for(let i=0;i<count;i++){setTimeout(()=>{const offsetY=count===3?(i-1)*28:(count===2?(i===0?-12:12):0);fire(230,Math.floor(dmg/(count===3?1.5:(count===2?1.3:1))),offsetY,r.projSize||24,r.color||'#ff4500');},count===2?i*90:0);}
}


function s2() {
  if (hero.lv < 2 || cd.s2 || hero.mp < 15 || isHome) return;
  hero.mp -= 15; updStat(); cd.s2 = true; btnS2.disabled = true;
  const r = hero.roleData || roster;
  const color = r.color || '#00d2ff';
  const mult = hero.skillMult || 1;
  const baseDmg = getAtk() * 2.2 * mult;

  // 衝刺路徑粒子特效
  for (let i = 0; i < 4; i++) {
    setTimeout(() => spawnVFX(hero.x, hero.y, color, Math.floor(10 * mult), mult > 1), i * 45);
  }

  const baseDash = ['biyomon', 'tailmon', 'gabumon'].includes(hero.id) ? 140 : 110;
  walkTo(hero.x + hero.dir * baseDash * mult, hero.y, 780 * mult);

  setTimeout(() => {
    spawnWave(hero.x, hero.y, color, 160 * mult);
    if (!lockedTarget || lockedTarget.dead || lockedTarget.hp <= 0) lockedTarget = getNearestMonster();
    hit(260, baseDmg, color, lockedTarget);

    // === 工地學徒系專屬「推車衝鋒」升職追加攻擊（單體死鎖版） ===
    if (hero.id === 'agumon') {
      const qTarget = lockedTarget; // 記住 Q 技能鎖定的唯一目標，打死絕不轉打別隻怪
      const shootQ = (icon, offsetY, size, dmgMult) => {
        const oldProj = hero.proj;
        hero.proj = icon;
        const prevLock = lockedTarget;
        lockedTarget = qTarget;
        fire(280 * mult, baseDmg * dmgMult, offsetY, size, '#ff4500', true);
        lockedTarget = prevLock;
        hero.proj = oldProj;
      };

      if (mult >= 1.8) {
        // 工地主任（管理層）：衝鋒後追加 3 發鋼筋三連擊（單體鎖定）
        spawnWave(hero.x, hero.y, '#ffeaa7', 240);
        [-26, 0, 26].forEach(offY => shootQ('🏗️', offY, 36, 0.45));
      } else if (mult > 1) {
        // 水電師傅（資深期）：衝鋒後追加高壓管鉗重擊
        shootQ('🔧', 0, 38, 0.65);
      }
    }
  }, 130);

  setTimeout(() => { cd.s2 = false; btnS2.disabled = false; }, 2000);
}

function s3() {
  if (hero.lv < 4 || cd.s3 || hero.mp < 30 || isHome) return;
  hero.mp -= 30; updStat(); cd.s3 = true; btnS3.disabled = true;

  const r = hero.roleData || roster;
  const color = r.color || '#ff4500';
  const mult = hero.skillMult || 1;
  const baseDmg = (getMatk() * 2.8 + getAtk() * 1.2) * mult;

  // 鎖定施放 E 大招當下的唯一目標，連發過程絕不轉火其他怪物
  if (!lockedTarget || lockedTarget.dead || lockedTarget.hp <= 0) lockedTarget = getNearestMonster();
  const eTarget = lockedTarget;

  screenFlash(color);

  const shootCustom = (icon, rng, dmg, offsetY, size) => {
    const oldProj = hero.proj;
    const prevLock = lockedTarget;
    hero.proj = icon;
    lockedTarget = eTarget;
    fire(rng, dmg, offsetY, size, color, true);
    lockedTarget = prevLock;
    hero.proj = oldProj;
  };

  if (hero.id === 'agumon') {
    // 工地學徒系：板模重擊 / 天車重錘砲
    shootCustom(mult >= 1.8 ? '🏗️' : '🧱', 400 * mult, baseDmg, 0, Math.floor(58 * mult));
    spawnVFX(hero.x, hero.y, color, Math.floor(30 * mult), true);
  } else if (hero.id === 'gabumon') {
    // 外送騎手系：準時必達波 / 洲際貨運衝擊
    shootCustom(mult >= 1.8 ? '🚛' : '📦', 380 * mult, baseDmg * 0.7, 0, Math.floor(52 * mult));
    spawnWave(hero.x, hero.y, '#00d2ff', 360 * mult);
    if (eTarget) setTimeout(() => spawnWave(eTarget.x, eTarget.y, '#ffffff', 240 * mult), 200);
  } else if (hero.id === 'biyomon') {
    // 超商店員系：微波爐光波 / 全通路大特價
    const count = mult >= 1.8 ? 9 : (mult > 1 ? 7 : 5);
    const icon = mult >= 1.8 ? '🏪' : '☕';
    for (let i = 0; i < count; i++) {
      setTimeout(() => shootCustom(icon, 380 * mult, baseDmg * 0.25, (i - Math.floor(count / 2)) * 30, Math.floor(34 * mult)), i * 70);
    }
  } else if (hero.id === 'tentomon') {
    // 爆肝工程師系：藍白當機畫面 / 量子運算轟炸
    const strikes = mult >= 1.8 ? 6 : (mult > 1 ? 5 : 4);
    const icon = mult >= 1.8 ? '🤖' : '💻';
    for (let i = 0; i < strikes; i++) {
      setTimeout(() => {
        shootCustom(icon, 420 * mult, baseDmg * 0.3, (i % 2 === 0 ? -18 : 18), Math.floor(42 * mult));
        if (eTarget) {
          spawnVFX(eTarget.x + (Math.random() * 50 - 25), eTarget.y, '#f1c40f', 15, true);
          spawnWave(eTarget.x, eTarget.y, '#f1c40f', 180 * mult);
        }
      }, i * 95);
    }
  } else if (hero.id === 'palmon') {
    // 廚房學徒系：爆炒油煙彈 / 三星料理奧義
    const waves = mult > 1 ? 4 : 3;
    const icon = mult >= 1.8 ? '🍽️' : '🍳';
    for (let i = 0; i < waves; i++) {
      setTimeout(() => {
        shootCustom(icon, 380 * mult, baseDmg * 0.4, (i - 1) * 22, Math.floor(44 * mult));
        if (eTarget) {
          spawnVFX(eTarget.x, eTarget.y, '#2ecc71', 25, true);
          spawnWave(eTarget.x, eTarget.y, '#2ecc71', 220 * mult);
        }
      }, i * 220);
    }
  } else if (hero.id === 'gomamon') {
    // 保全警衛系：強光手電筒 / 特種部隊鎮壓
    const shots = mult >= 1.8 ? 7 : (mult > 1 ? 5 : 4);
    const icon = mult >= 1.8 ? '🚨' : '🛡️';
    for (let i = 0; i < shots; i++) {
      setTimeout(() => shootCustom(icon, 380 * mult, baseDmg * 0.3, (i % 2 === 0 ? -22 : 22), Math.floor(38 * mult)), i * 85);
    }
  } else if (hero.id === 'patamon') {
    // 實習護理師系：一針見血 / 奇蹟大治療術
    shootCustom(mult >= 1.8 ? '🏥' : '💉', 450 * mult, baseDmg * 0.8, 0, Math.floor(60 * mult));
    spawnWave(hero.x, hero.y, '#ffeaa7', 450 * mult);
    spawnVFX(hero.x, hero.y, '#f39c12', Math.floor(35 * mult), true);
    if (eTarget) setTimeout(() => spawnVFX(eTarget.x, eTarget.y, '#ffeaa7', Math.floor(40 * mult), true), 200);
  } else {
    // 菜鳥業務員系：業績達標雷射 / 上市敲鐘衝擊
    spawnWave(hero.x, hero.y, '#fd79a8', 300 * mult);
    const lasers = mult >= 1.8 ? 10 : (mult > 1 ? 8 : 6);
    const icon = mult >= 1.8 ? '💎' : '📈';
    for (let i = 0; i < lasers; i++) {
      setTimeout(() => shootCustom(icon, 380 * mult, baseDmg * 0.2, (i % 3 - 1) * 20, Math.floor(30 * mult)), i * 55);
    }
  }

  setTimeout(() => { cd.s3 = false; btnS3.disabled = false; }, 4000);
}


let lockedTarget = null; // 全域鎖定目標，在打死它之前絕不換人

function fire(rng, dmg, offsetY = 0, fontSize = 24, color = '#ff4500', noSwitch = false) {
  playAnim('is-attacking', 280);
  if (!noSwitch && (!lockedTarget || lockedTarget.dead || lockedTarget.hp <= 0 || Math.hypot(hero.x - lockedTarget.x, hero.y - lockedTarget.y) >= rng + 50)) {
    lockedTarget = getNearestMonster();
  }
  const targetM = lockedTarget;
  const ok = targetM && Math.hypot(hero.x - targetM.x, hero.y - targetM.y) < rng;

  if (ok) {
    hero.dir = targetM.x < hero.x ? -1 : 1;
    heroBox.style.transform = `scaleX(${-hero.dir})`;
  }

  const fb = document.createElement('div');
  fb.className = 'fireball';
  fb.textContent = hero.proj;
  fb.style.fontSize = fontSize + 'px';
  fb.style.filter = `drop-shadow(0 0 8px ${color})`;
  fb.style.transform = 'translate(-50%, -50%)';
  fb.style.transition = 'left 0.45s linear, top 0.45s linear';

  const startX = hero.x + hero.dir * 45;
  const startY = hero.y - 15 + offsetY;
  fb.style.left = startX + 'px';
  fb.style.top = startY + 'px';
  stage.appendChild(fb);
  spawnVFX(startX, startY, color, 5, false);

  const endX = ok ? targetM.x : (hero.x + hero.dir * 260);
  const endY = ok ? (targetM.y - 10 + offsetY * 0.4) : startY;
  requestAnimationFrame(() => {
    fb.style.left = endX + 'px';
    fb.style.top = endY + 'px';
  });

  setTimeout(() => {
    fb.remove();
    hit(rng, dmg, color, targetM);
  }, 450);
}

function hit(rng, dmg, color = '#ffaa00', singleTarget = null) {
  if (window.isHome) return;
  dmg = Math.floor(dmg);

  // 優先使用子彈傳來的鎖定目標；若是 Q 技能直接呼叫 hit，則抓離玩家最近的那 1 隻
  const m = (singleTarget && !singleTarget.dead && singleTarget.hp > 0) ? singleTarget : getNearestMonster();
  if (!m || m.dead || m.hp <= 0) return;

  // 確認這 1 隻目標在射程內
  if (Math.hypot(hero.x - m.x, hero.y - m.y) < rng + 60) {
    spawnVFX(m.x, m.y, color, 10, false);
    m.hp = Math.max(0, m.hp - dmg);

    m.img.style.filter = 'brightness(2.5) saturate(2)';
    setTimeout(() => {
      m.img.style.filter = m.tpl.glow !== 'none' ? m.tpl.glow : 'drop-shadow(0 6px 8px rgba(0,0,0,0.45))';
    }, 120);

    const t = document.createElement('div');
    t.className = 'dmg-text';
    t.textContent = `-${dmg}`;
    t.style.left = (m.x + Math.random() * 20 - 10) + 'px';
    t.style.top = (m.y - 45) + 'px';
    stage.appendChild(t);
    setTimeout(() => t.remove(), 800);

    const targetBar = m.idx === 0 ? document.getElementById('hp-bar') : m.bar;
if (targetBar) targetBar.style.width = (m.hp / m.maxHp * 100) + '%';


    if (m.hp <= 0) {
      m.dead = true;
if (lockedTarget === m) lockedTarget = null;
      spawnWave(m.x, m.y, '#ffeaa7', 220);
      spawnVFX(m.x, m.y, '#ffeaa7', 24, true);
      spawnLoot(m.x, m.y);
      hero.exp += m.tpl.exp;
      checkLv();

      m.box.style.opacity = '0';
      setTimeout(() => {
        const fresh = createOneMonster(m.idx, true);
        Object.assign(m, fresh);
      }, 900);
    }

    if (hero.stealHp > 0 || hero.stealMp > 0) {
      hero.hp = Math.min(getMaxHp(), hero.hp + hero.stealHp);
      hero.mp = Math.min(getMaxMp(), hero.mp + hero.stealMp);
      updStat();
    }
  }
  getNearestMonster();
}

function checkLv() {
  const r = hero.roleData || roster;
  while (hero.exp >= hero.maxExp) {
    hero.lv++;
    hero.exp -= hero.maxExp;
    hero.maxExp = Math.floor(hero.maxExp * 1.3);
    hero.baseAtk += 4;
    hero.str += 2;
    hero.agi += 2;
    hero.vit += 2;
    hero.int += 1;
    spawnWave(hero.x, hero.y, '#55efc4', 250);

    if (r.evos) {
      const evo = r.evos.find(e => e.lv === hero.lv);
      if (evo) {
        hero.baseAtk += evo.atkBonus;
        hero.baseHp += evo.hpBonus;
        hero.hp = getMaxHp();
        hero.mp = getMaxMp();
        hero.skillMult = evo.skillMult;

        hero.proj = evo.proj;
        r.projCount = evo.projCount;
        r.projSize = evo.projSize;
        r.qName = evo.qName;
        r.eName = evo.eName;

        document.getElementById('ui-partner').textContent = `${evo.name} ✨`;

        const evoIdx = r.evos.indexOf(evo);
        const dexEntry = (typeof digidex !== 'undefined') ? digidex.find(d => d.id === `${hero.id}_e${evoIdx}`) : null;
        const evoImg = (dexEntry && dexEntry.img) ? dexEntry.img : evo.img;

        if (evoImg) {
          svgHolder.style.display = 'none';
          singleImg.style.display = 'block';
          singleImg.src = evoImg;
          singleImg.style.transition = 'height 0.5s ease, scale 0.5s ease';
          singleImg.style.height = Math.floor(110 * evo.scale) + 'px';
          singleImg.style.scale = '1';
          singleImg.style.filter = `drop-shadow(0 0 14px ${r.color}) drop-shadow(0 0 26px #ffffff)`;
        } else {
          const charDiv = svgHolder.querySelector('div');
          if (charDiv) {
            charDiv.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            charDiv.style.transform = `scale(${evo.scale})`;
            charDiv.style.filter = `drop-shadow(0 0 14px ${r.color}) drop-shadow(0 0 26px #ffffff)`;
          }
        }

        screenFlash('#ffffff');
        spawnWave(hero.x, hero.y, r.color, 420);
        spawnVFX(hero.x, hero.y, r.color, 45, true);
        const evoText = document.createElement('div');
        evoText.className = 'dmg-text';
        evoText.style.color = '#ffeaa7';
        evoText.style.fontSize = '22px';
        evoText.style.textShadow = `0 0 12px ${r.color}, 2px 2px 0 #000`;
        evoText.textContent = `🌟 超進化！${evo.name}！`;
        evoText.style.left = (hero.x - 60) + 'px';
        evoText.style.top = (hero.y - 80) + 'px';
        stage.appendChild(evoText);
        setTimeout(() => evoText.remove(), 1800);
      }
    }

    if (hero.lv >= 2) { btnS2.disabled = false; btnS2.textContent = `⚡ ${r.qName}(Q)`; }
    if (hero.lv >= 4) { btnS3.disabled = false; btnS3.textContent = `💥 ${r.eName}(E)`; }
  }
  updStat();
  document.getElementById('lv').textContent = hero.lv;
  document.getElementById('exp').textContent = hero.exp;
  document.getElementById('max-exp').textContent = hero.maxExp;
}

setInterval(() => {
  if (hero.mp < getMaxMp()) {
    hero.mp = Math.min(getMaxMp(), hero.mp + 3);
    updStat();
  }
}, 1000);

setInterval(() => {
  if (!isHome && monster.hp > 0 && Math.hypot(hero.x - monster.x, hero.y - monster.y) < 110) {
       const dmg = Math.max(1, currentMonster.atk - getDef());
    hero.hp = Math.max(0, hero.hp - dmg);
    playAnim('is-hurt', 300);
    const t = document.createElement('div');
    t.className = 'dmg-text';
    t.style.color = '#ff4757';
    t.textContent = `-${dmg}`;
    t.style.left = hero.x + 'px';
    t.style.top = (hero.y - 50) + 'px';
    stage.appendChild(t);
    setTimeout(() => t.remove(), 800);
    if (hero.hp <= 0) {
      alert('💀 體力耗盡！已送回安全點恢復');
      hero.hp = getMaxHp();
      walkTo(100, 200, 999);
    }
    updStat();
  }
}, 1500);


let homeGroundItems=JSON.parse(localStorage.getItem('digi_ground')||'[]'),homeEggs=[],homePets=JSON.parse(localStorage.getItem('digi_pets')||'[]'),homeVisitors=[];


function toggleHome() {
  isHome = !isHome;
  const btn = document.getElementById('btn-toggle-home');
  const homeBtns = document.querySelectorAll('.home-only');

  if (isHome) {
    stage.classList.add('home-mode');
    stage.style.filter = 'none'; // 回家時恢復溫馨居家原色
    monsterBox.style.display = 'none';
    document.querySelectorAll('.extra-monster-box').forEach(el => el.style.display = 'none'); // 隱藏其他怪物
    loots.forEach(l => l.el.style.display = 'none');
    btn.textContent = '⚔️ 前往野外打怪';
    btn.style.background = '#d63031';
    homeBtns.forEach(b => b.style.display = 'inline-block');
    renderHomeEntities();
    if (homeVisitors.length === 0) spawnVisitor();
  } else {
    stage.classList.remove('home-mode');
    monsterBox.style.display = 'flex';
    document.querySelectorAll('.extra-monster-box').forEach(el => el.style.display = 'flex'); // 出門打怪顯示全部怪物
    loots.forEach(l => l.el.style.display = 'block');
    btn.textContent = '🏠 回到家園';
    btn.style.background = '#00b894';
    homeBtns.forEach(b => b.style.display = 'none');
    clearHomeEntities();
  }
}


function getSellPrice(it) {
  if (!it.affixList) return 15;
  return it.affixList.length * 35;
}

window.openBagMenu = function(i) {
  const it = bag.at(i);
  if (!it) return;
  document.getElementById('bag-modal-title').textContent = `${it.icon} ${it.name}`;
  document.getElementById('bag-modal-desc').textContent = getItemDesc(it);

  document.getElementById('btn-bag-use').onclick = () => {
    useIt(i);
    document.getElementById('bag-action-modal').style.display = 'none';
  };

  const price = getSellPrice(it);
  const btnSell = document.getElementById('btn-bag-sell');
  btnSell.textContent = `💰 ${it.affixList ? '分解' : '出售'} (+${price}金)`;
  btnSell.onclick = () => {
    bag.splice(i, 1);
    hero.gold += price;
    spawnVFX(hero.x, hero.y, '#fdcb6e', 15, false);
    updStat();
    renderBag();
    document.getElementById('bag-action-modal').style.display = 'none';
  };

  const btnDrop = document.getElementById('btn-bag-drop');
  btnDrop.style.display = isHome ? 'inline-block' : 'none';
  btnDrop.onclick = () => {
    const dropped = bag.splice(i, 1).at(0);
    if (dropped) {
      homeGroundItems.push({ data: dropped, x: Math.max(80, Math.min(stage.clientWidth - 80, hero.x + (Math.random() * 60 - 30))), y: Math.max(80, Math.min(stage.clientHeight - 80, hero.y + 35)), owner: document.getElementById('ui-player').textContent });
      saveHomeData(); renderBag(); renderHomeEntities(); updStat();
    }
    document.getElementById('bag-action-modal').style.display = 'none';
  };
  document.getElementById('bag-action-modal').style.display = 'flex';
};

function openMultiModal() {
  document.getElementById('shop-gold').textContent = hero.gold;
  const myData = {
    name: document.getElementById('ui-player').textContent,
    id: hero.id,
    lv: hero.lv,
    atk: getAtk(),
    hp: getMaxHp()
  };
  document.getElementById('my-share-code').value = btoa(encodeURIComponent(JSON.stringify(myData)));
  document.getElementById('multi-modal').style.display = 'flex';
}

function copyShareCode() {
  const input = document.getElementById('my-share-code');
  input.select();
  navigator.clipboard.writeText(input.value);
  alert('✅ 已複製你的馴獸師代碼！快傳給朋友吧！');
}

function buyPotion(type, cost) {
  if (hero.gold < cost) { alert('❌ 金幣不足！請先去打怪並分解多餘裝備。'); return; }
  hero.gold -= cost;
  bag.push(type === 'hp' ? { icon: '❤️', name: '回復藥水', t: 'hp', val: 50 } : { icon: '💙', name: '魔力藥水', t: 'mp', val: 30 });
  document.getElementById('shop-gold').textContent = hero.gold;
  updStat();
  renderBag();
}

function importFriend(mode) {
  const raw = document.getElementById('friend-code-input').value.trim();
  if (!raw) { alert('請先貼上朋友的馴獸師代碼！'); return; }
  try {
    const f = JSON.parse(decodeURIComponent(atob(raw)));
    const partner = roster.find(c => c.id === f.id) || roster[0];
    document.getElementById('multi-modal').style.display = 'none';

    if (mode === 'visit') {
      if (!isHome) toggleHome();
      const vx = 260, vy = 220;
      const gift = { ...pool.at(Math.floor(Math.random() * pool.length)) };
      gift.name = `[${f.name}的見面禮]${gift.name}`;
      gift.color = '#55efc4';
      homeGroundItems.push({ data: gift, x: vx + 35, y: vy + 20, owner: f.name });
      homeVisitors.push({ pName: `${f.name} Lv.${f.lv}`, partner, x: vx, y: vy, msg: `嗨！我是 ${f.name}，送你一份見面禮！` });
      saveHomeData(); renderHomeEntities();
    } else if (mode === 'duel') {
      if (isHome) toggleHome();
      monster.maxHp = Math.max(200, f.hp * 2);
      monster.hp = monster.maxHp;
      hpBar.style.width = '100%';
      monsterImg.style.filter = 'drop-shadow(0 0 16px #e84393)';
      alert(`⚔️ 挑戰開始！對手是【${f.name} (Lv.${f.lv})】，血量 ${monster.maxHp}！`);
    }
  } catch (e) {
    alert('❌ 代碼格式不正確，請確認有完整複製！');
  }
}

function openBreedModal(){const p1=document.getElementById('breed-p1'),p2=document.getElementById('breed-p2'),opts=roster.map(c=>`<option value="${c.id}">${c.name}</option>`).join('');p1.innerHTML=opts;p2.innerHTML=opts;p2.selectedIndex=1;document.getElementById('breed-modal').style.display='flex';}
function doBreed(){const c1=roster.find(c=>c.id===document.getElementById('breed-p1').value)||roster.at(0),c2=roster.find(c=>c.id===document.getElementById('breed-p2').value)||roster.at(1),parent=Math.random()<0.5?c1:c2,babyName=`${c1.name.slice(0,1)}${c2.name.slice(0,1)}獸(二代)`,eggX=Math.max(120,Math.min(stage.clientWidth-150,hero.x+60)),eggY=Math.max(120,Math.min(stage.clientHeight-120,hero.y));homeEggs.push({id:Date.now(),babyName,pos:parent.pos,color:parent.color,x:eggX,y:eggY,progress:0});spawnVFX(eggX,eggY,'#fd79a8',25,true);document.getElementById('breed-modal').style.display='none';renderHomeEntities();}

setInterval(()=>{if(!isHome)return;let changed=false;for(let i=homeEggs.length-1;i>=0;i--){const eggObj=homeEggs.at(i);eggObj.progress+=20;changed=true;if(eggObj.progress>=100){const egg=homeEggs.splice(i,1).at(0);if(egg)hatchEgg(egg);}}if(changed)renderHomeEntities();},1000);
function hatchEgg(egg){spawnWave(egg.x,egg.y,'#ffeaa7',260);spawnVFX(egg.x,egg.y,egg.color,35,true);homePets.push({name:egg.babyName,pos:egg.pos,color:egg.color,x:egg.x,y:egg.y});hero.baseAtk+=3;updStat();saveHomeData();renderHomeEntities();}

function spawnVisitor() {
  if (!window.isHome) return;
  if (homeVisitors.length >= 3) homeVisitors.shift();

  // 1. 改成職場同事名字
  const names = ['隔壁部門老王', '茶水間小美', '實習生小陳', '人資姐姐', '樓下警衛伯伯'];
  const pName = names.at(Math.floor(Math.random() * names.length));
  const partner = roster.at(Math.floor(Math.random() * roster.length));
  const vx = Math.random() * (stage.clientWidth - 250) + 120;
  const vy = Math.random() * (stage.clientHeight - 200) + 100;

  // 2. 放下見面禮
  const gift = { ...pool.at(Math.floor(Math.random() * pool.length)) };
  gift.name = `[${pName}贈禮]${gift.name}`;
  gift.color = '#55efc4';
  if (['h', 'c', 'w'].includes(gift.t)) gift.affixList = [gift.atk ? `+${gift.atk}物攻` : `+${gift.def}物防`];
 homeGroundItems.push({ data: gift, x: vx + 35, y: vy + 20, owner: pName });
  saveHomeData();

  // 3. 建立訪客資料（預設先顯示送禮台詞）
  const visitorObj = {
    id: Date.now() + Math.random(),
    pName,
    partner,
    x: vx,
    y: vy,
    msg: '順路經過，送你一份慰勞品放在地上囉！',
    showBubble: true
  };
  homeVisitors.push(visitorObj);
  spawnWave(vx, vy, '#74b9ff', 160);
  renderHomeEntities();

  // 3 秒後收起對話氣泡
  setTimeout(() => {
    visitorObj.showBubble = false;
    if (window.isHome) renderHomeEntities();
  }, 3000);

  // 4. 待滿 15 秒後，同事說「先下班囉！」並自動消失離開
  setTimeout(() => {
    const idx = homeVisitors.findIndex(v => v.id === visitorObj.id);
    if (idx !== -1) {
      if (window.isHome) {
        spawnWave(visitorObj.x, visitorObj.y, '#a29bfe', 120);
        spawnVFX(visitorObj.x, visitorObj.y, '#74b9ff', 15, false);
      }
      homeVisitors.splice(idx, 1);
      if (window.isHome) renderHomeEntities();
    }
  }, 15000);
}


setInterval(() => {
  if (!isHome) return;
  homePets.forEach(p => {
    p.x = Math.max(90, Math.min(stage.clientWidth - 120, p.x + (Math.random() * 140 - 70)));
    p.y = Math.max(90, Math.min(stage.clientHeight - 90, p.y + (Math.random() * 140 - 70)));
  });
  homeVisitors.forEach(v => {
    if (homeGroundItems.length > 0 && Math.random() > 0.5) {
      const t = homeGroundItems.at(Math.floor(Math.random() * homeGroundItems.length));
      v.x = t.x - 30;
      v.y = t.y;
      v.msg = `哇！地上的 ${t.data.name} 真不錯！`;
    } else {
      v.x = Math.max(90, Math.min(stage.clientWidth - 120, v.x + (Math.random() * 180 - 90)));
      v.y = Math.max(90, Math.min(stage.clientHeight - 90, v.y + (Math.random() * 180 - 90)));
      v.msg = '你家佈置得好溫馨！';
    }
  });
  renderHomeEntities();
}, 3200);

function clearHomeEntities() {
  document.querySelectorAll('.home-entity').forEach(el => el.remove());
}

function renderHomeEntities() {
  clearHomeEntities();
  if (!isHome) return;

  homeGroundItems.forEach((item, idx) => {
    if (!item || !item.data) return;
    const el = document.createElement('div');
    el.className = 'home-entity';
    el.style.cssText = `left:${item.x}px;top:${item.y}px;text-align:center;cursor:pointer;`;
    el.innerHTML = `<div style="font-size:24px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.6));">${item.data.icon}</div><div style="font-size:10px;background:rgba(0,0,0,0.65);color:#fff;padding:1px 5px;border-radius:4px;white-space:nowrap;">${item.data.name.replace(/\[.*?\]/g, '')}</div>`;
    el.onpointerdown = e => {
      e.stopPropagation();
      bag.push(item.data);
      homeGroundItems.splice(idx, 1);
      saveHomeData();
      renderBag();
      renderHomeEntities();
      updStat();
    };
    stage.appendChild(el);
  });

  homeEggs.forEach((egg, idx) => {
    const el = document.createElement('div');
    el.className = 'home-entity egg-wobble';
    el.style.cssText = `left:${egg.x}px;top:${egg.y}px;text-align:center;cursor:pointer;`;
    el.innerHTML = `<div style="font-size:28px;">🥚</div><div style="font-size:10px;background:rgba(0,0,0,0.65);color:#ffeaa7;padding:1px 5px;border-radius:4px;white-space:nowrap;">${egg.progress}%</div>`;
    el.onpointerdown = e => {
      e.stopPropagation();
      egg.progress += 35;
      spawnVFX(egg.x, egg.y, '#ffeaa7', 8, false);
      if (egg.progress >= 100) {
        homeEggs.splice(idx, 1);
        hatchEgg(egg);
      } else {
        renderHomeEntities();
      }
    };
    stage.appendChild(el);
  });

homePets.forEach((pet, idx) => {
  const el = document.createElement('div');
  el.className = 'home-entity';
  el.style.cssText = `left:${pet.x}px;top:${pet.y}px;text-align:center;cursor:pointer;`;
  const shortName = pet.name.replace('(二代)', '');
  el.innerHTML = `<div style="width:52px;height:52px;margin:0 auto;background:url('heroes_3d.png') ${pet.pos}/400% 200% no-repeat;filter:drop-shadow(0 0 6px ${pet.color});"></div><div style="font-size:10px;background:rgba(0,0,0,0.6);color:#55efc4;padding:1px 5px;border-radius:4px;white-space:nowrap;">${shortName}</div>`;
  el.onpointerdown = e => {
    e.stopPropagation();
    spawnVFX(pet.x, pet.y, '#ff7675', 10, false);
    if (confirm(`要讓【${shortName}】辦理離職離開家園嗎？（可回收 +50 金幣）`)) {
      homePets.splice(idx, 1);
      hero.gold += 50;
      saveHomeData();
      saveGame();
      updStat();
      renderHomeEntities();
    }
  };
  stage.appendChild(el);
});


  homeVisitors.forEach(v => {
    const el = document.createElement('div');
    el.className = 'home-entity';
    el.style.cssText = `left:${v.x}px;top:${v.y}px;text-align:center;cursor:pointer;`;
    const bubbleHtml = v.showBubble ? `<div style="font-size:11px;background:#fff;color:#2d3436;padding:3px 7px;border-radius:8px;margin-bottom:2px;box-shadow:0 2px 6px rgba(0,0,0,0.3);white-space:nowrap;">${v.msg}</div>` : '';
    const shortPlayer = v.pName.replace('玩家_', '');
    el.innerHTML = `${bubbleHtml}<div style="width:64px;height:64px;margin:0 auto;background:url('heroes_3d.png') ${v.partner.pos}/400% 200% no-repeat;"></div><div style="font-size:10px;background:rgba(0,0,0,0.65);color:#74b9ff;padding:1px 6px;border-radius:4px;white-space:nowrap;">${shortPlayer}</div>`;
    el.onpointerdown = e => {
      e.stopPropagation();
      v.showBubble = true;
      renderHomeEntities();
      setTimeout(() => { v.showBubble = false; renderHomeEntities(); }, 2500);
    };
    stage.appendChild(el);
  });
}


function saveHomeData() {
  localStorage.setItem('digi_ground', JSON.stringify(homeGroundItems));
  localStorage.setItem('digi_pets', JSON.stringify(homePets));
}

// === 📖 數碼圖鑑顯示系統 ===
function openDex() {
  document.getElementById('dex-count').textContent = digidex.length;
  const grid = document.getElementById('dex-grid');
  grid.innerHTML = digidex.map(d => {
    let avatarHtml = `<span style="filter:drop-shadow(0 0 8px ${d.color})">${d.icon}</span>`;
    let has3D = false;

    if (d.img) {
      avatarHtml = `<img src="${d.img}" alt="${d.name}">`;
      has3D = true;
    } else if (d.pos) {
      avatarHtml = `<div style="width:60px;height:60px;background:url('heroes_3d.png') ${d.pos}/440% 265% no-repeat;"></div>`;
      has3D = true;
    }

    const statusTag = has3D ? '<span style="color:#55efc4;">● 3D已實裝</span>' : '<span style="color:#aaa;">○ 待分配3D圖</span>';
    return `<div class="dex-card" style="border-color:${d.color}">
      <div class="dex-avatar" style="box-shadow:inset 0 0 12px ${d.color}">${avatarHtml}</div>
      <div style="font-weight:bold;font-size:13px;color:#fff;">${d.name}</div>
      <div style="font-size:11px;color:#ffeaa7;margin:2px 0;">${d.stage}｜攻 ${d.atk}</div>
      <div style="font-size:10px;">${statusTag}</div>
    </div>`;
  }).join('');
  document.getElementById('dex-modal').style.display = 'flex';
}
// === 🧹 打開批量分解選項視窗 ===
function openBatchSellModal() {
  document.getElementById('batch-sell-modal').style.display = 'flex';
}

// === 💰 執行勾選條件的批量分解 ===
function execBatchSell() {
  const sellOther  = document.getElementById('chk-sell-other').checked;
  const sellCommon = document.getElementById('chk-sell-common').checked;
  const sellRare   = document.getElementById('chk-sell-rare').checked;

  if (!sellOther && !sellCommon && !sellRare) {
    alert('請至少勾選一項要分解的條件喔！');
    return;
  }

  let soldCount = 0, totalGold = 0;
  for (let i = bag.length - 1; i >= 0; i--) {
    const it = bag[i];
    // 改用裝備部位 (h頭部、c身體、w武器) 判斷，這樣訪客送的裝備也能被分解！
    if (!['h', 'c', 'w'].includes(it.t)) continue;

    const isOtherJob = it.reqJob && it.reqJob !== hero.id;
    const affixLen   = it.affixList ? it.affixList.length : 1;

    let shouldSell = false;
    if (isOtherJob) {
      if (sellOther) shouldSell = true; // 非本職業裝備
    } else {
      if (sellCommon && affixLen === 1) shouldSell = true; // 本職業 1詞綴白裝
      if (sellRare && affixLen === 2) shouldSell = true;   // 本職業 2詞綴藍裝
    }

    if (shouldSell) {
      totalGold += getSellPrice(it);
      bag.splice(i, 1);
      soldCount++;
    }
  }

  document.getElementById('batch-sell-modal').style.display = 'none';

  if (soldCount === 0) {
    alert('背包裡目前沒有符合勾選條件的裝備喔！');
    return;
  }

  hero.gold += totalGold;
  spawnVFX(hero.x, hero.y, '#fdcb6e', 20, false);
  updStat();
  renderBag();
  saveGame();
  alert(`✅ 成功分解了 ${soldCount} 件裝備，獲得 +${totalGold} 金幣！`);
}


// === 💾 角色進度自動存檔與讀檔系統 ===
function saveGame() {
  const saveData = {
    playerName: document.getElementById('ui-player').textContent,
    hero: {
      id: hero.id, lv: hero.lv, exp: hero.exp, maxExp: hero.maxExp, gold: hero.gold,
      baseAtk: hero.baseAtk, baseMatk: hero.baseMatk, spd: hero.spd,
      baseHp: hero.baseHp, baseMp: hero.baseMp, skillMult: hero.skillMult,
      str: hero.str, agi: hero.agi, vit: hero.vit, int: hero.int,
      eq: hero.eq
    },
    bag: bag,
    monsterWave: monsterWave
  };
  localStorage.setItem('digi_save_v1', JSON.stringify(saveData));
}

function loadGame() {
  const raw = localStorage.getItem('digi_save_v1');
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    const c = roster.find(r => r.id === data.hero.id);
    if (!c) return;

    // 恢復角色資料與裝備
    sel(c);
    document.getElementById('ui-player').textContent = data.playerName || '學徒阿痞';
    Object.assign(hero, data.hero);
    bag = data.bag || [];
    monsterWave = data.monsterWave || 1;

    // 恢復穿在身上的三件裝備顯示
    ['h', 'c', 'w'].forEach(slot => {
      if (hero.eq && hero.eq[slot]) {
        const it = hero.eq[slot];
        document.getElementById(`eq-${slot}`).textContent = `${it.name} (${(it.affixList || []).join(' ')})`;
      }
    });
    recalcEquip();
    hero.hp = getMaxHp();
    hero.mp = getMaxMp();

    // 檢查目前等級是否已經進化，恢復進化外觀與名稱
    if (c.evos) {
      let currentEvo = null, evoIdx = -1;
      c.evos.forEach((e, idx) => { if (hero.lv >= e.lv) { currentEvo = e; evoIdx = idx; } });
      if (currentEvo) {
        hero.proj = currentEvo.proj;
        hero.roleData.projCount = currentEvo.projCount;
        hero.roleData.projSize = currentEvo.projSize;
        hero.roleData.qName = currentEvo.qName;
        hero.roleData.eName = currentEvo.eName;
        document.getElementById('ui-partner').textContent = `${currentEvo.name} ✨`;
        const dexEntry = (typeof digidex !== 'undefined') ? digidex.find(d => d.id === `${hero.id}_e${evoIdx}`) : null;
        const evoImg = (dexEntry && dexEntry.img) ? dexEntry.img : currentEvo.img;
        if (evoImg) {
          svgHolder.style.display = 'none';
          singleImg.style.display = 'block';
          singleImg.src = evoImg;
          singleImg.style.height = Math.floor(110 * currentEvo.scale) + 'px';
          singleImg.style.filter = `drop-shadow(0 0 14px ${c.color}) drop-shadow(0 0 26px #ffffff)`;
        }
      }
    }

    if (hero.lv >= 2) { btnS2.disabled = false; btnS2.textContent = `⚡ ${hero.roleData.qName}(Q)`; }
    if (hero.lv >= 4) { btnS3.disabled = false; btnS3.textContent = `💥 ${hero.roleData.eName}(E)`; }
    document.getElementById('lv').textContent = hero.lv;
    document.getElementById('exp').textContent = hero.exp;
    document.getElementById('max-exp').textContent = hero.maxExp;

    updStat();
    renderBag();
  } catch (e) {
    console.error('讀檔失敗:', e);
  }
}

// 每 5 秒自動存檔一次，並在網頁剛打開時自動讀取進度！
setInterval(() => { if (hero.roleData) saveGame(); }, 5000);
window.addEventListener('load', loadGame);

// === 🔄 清除存檔並回到選角畫面 ===
function resetCharacter() {
  if (!confirm('確定要清除目前進度，重新選擇其他職業嗎？')) return;
  localStorage.removeItem('digi_save_v1');
  location.reload();
}


// =========================================================================
// 🚀 職場打工人擴充包：1.社畜語錄氣泡 / 2.上班摸魚(自動掛機) / 3.Boss遠程丟急件
// =========================================================================

// === 1. 💬 社畜語錄氣泡系統 ===
const workQuotes = {
  s1: ['收到！', '馬上處理！', '加班費算一下！', '這我來！', '準時打卡！'],
  s2: ['這不在我的 KPI 裡！', '別再改需求了！', '請找窗口確認！', '我先閃人囉！'],
  s3: ['老子不幹了！！', '全部給我通通退回！', '年終獎金交出來！', '準時下班最大！'],
  hp: ['冰美式續命 +50！', '吃顆 B 群再戰！', '深呼吸不生氣...', '摸魚回血中...'],
  mp: ['手搖飲補魔 +30！', '薪水入帳精神百倍！', '下午茶時間到！']
};

window.sayQuote = function(type) {
  if (window.isHome) return;
  const list = workQuotes[type] || workQuotes.s1;
  const text = list[Math.floor(Math.random() * list.length)];

  const old = document.getElementById('hero-quote-bubble');
  if (old) old.remove();

  const b = document.createElement('div');
  b.id = 'hero-quote-bubble';
  b.textContent = text;
  Object.assign(b.style, {
    position: 'absolute',
    left: hero.x + 'px',
    top: (hero.y - 78) + 'px',
    transform: 'translate(-50%, -100%)',
    background: '#ffffff',
    color: '#2d3436',
    fontWeight: 'bold',
    fontSize: '12px',
    padding: '4px 10px',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.35)',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    zIndex: 60,
    transition: 'opacity 0.3s, top 0.3s'
  });
  stage.appendChild(b);

  setTimeout(() => {
    b.style.top = (hero.y - 95) + 'px';
    b.style.opacity = '0';
  }, 1100);
  setTimeout(() => b.remove(), 1450);
};

// 自動掛勾原本的技能函式，不破壞原程式結構
const _origS1 = s1, _origS2 = s2, _origS3 = s3;
s1 = function() {
  const wasReady = !cd.s1 && !window.isHome;
  _origS1();
  if (wasReady && Math.random() < 0.25) window.sayQuote('s1'); // 普攻 25% 機率講話，避免太吵
};
s2 = function() {
  const wasReady = hero.lv >= 2 && !cd.s2 && hero.mp >= 15 && !window.isHome;
  _origS2();
  if (wasReady) window.sayQuote('s2');
};
s3 = function() {
  const wasReady = hero.lv >= 4 && !cd.s3 && hero.mp >= 30 && !window.isHome;
  _origS3();
  if (wasReady) window.sayQuote('s3');
};

// === 2. 🤖 上班摸魚（自動掛機）系統 ===
let isAutoPlay = false;

(function initAutoButton() {
  const nav = document.getElementById('top-nav-bar');
  if (!nav || document.getElementById('btn-auto-play')) return;
  const btn = document.createElement('button');
  btn.id = 'btn-auto-play';
  btn.className = 'nav-btn';
  btn.style.background = '#636e72';
  btn.textContent = '🤖 摸魚掛機:關';
  btn.onclick = () => {
    isAutoPlay = !isAutoPlay;
    btn.textContent = isAutoPlay ? '🤖 摸魚掛機:開' : '🤖 摸魚掛機:關';
    btn.style.background = isAutoPlay ? '#e17055' : '#636e72';
    if (isAutoPlay) window.sayQuote('s1');
  };
  nav.appendChild(btn);
})();

// ✅ 貼上這段修正版（修復撿寶卡住 + 提高自動喝水靈敏度）：
let lastAutoDrink = 0;

setInterval(() => {
  if (!isAutoPlay || window.isHome || !hero.roleData) return;

  const now = Date.now();
  // 1. 血量低於 75% 自動喝紅水；魔力低於 35% 自動喝藍水（每 1.2 秒檢查一次避免連喝浪費）
  if (now - lastAutoDrink > 1200) {
    if (hero.hp < getMaxHp() * 0.75) {
      const hasHp = bag.some(it => it.t === 'hp');
      if (hasHp) {
        drinkPotion('hp');
        lastAutoDrink = now;
      }
    } else if (hero.mp < getMaxMp() * 0.35) {
      const hasMp = bag.some(it => it.t === 'mp');
      if (hasMp) {
        drinkPotion('mp');
        lastAutoDrink = now;
      }
    }
  }

  // 2. 優先撿地上的戰利品（修正加上 [0]！）
  if (loots.length > 0 && loots[0]) {
    walkTo(loots[0].x, loots[0].y);
    return;
  }

  // 3. 追擊怪物並自動放招
  if (monster.hp > 0) {
    const dist = Math.hypot(hero.x - monster.x, hero.y - monster.y);
    if (dist > 170) {
      const offsetX = hero.x < monster.x ? -110 : 110;
      walkTo(monster.x + offsetX, monster.y);
    } else {
      if (hero.lv >= 4 && !cd.s3 && hero.mp >= 30) s3();
      else if (hero.lv >= 2 && !cd.s2 && hero.mp >= 15) s2();
      else s1();
    }
  }
}, 750);


// === 3. 📩 Boss 遠程攻擊（「急件」與「扣薪單」飛彈） ===
setInterval(() => {
  if (window.isHome || monster.hp <= 0 || !hero.roleData) return;
  const dist = Math.hypot(hero.x - monster.x, hero.y - monster.y);
  // 當玩家在 120 ~ 450 距離內，Boss 會丟出遠程職場暗器
  if (dist >= 120 && dist <= 450) {
    const mProjList = ['📩', '💸', '📉', '💣'];
    const icon = mProjList[Math.floor(Math.random() * mProjList.length)];
    const startX = monster.x, startY = monster.y - 10;
    const targetX = hero.x, targetY = hero.y - 10;

    const proj = document.createElement('div');
    proj.textContent = icon;
    Object.assign(proj.style, {
      position: 'absolute',
      left: startX + 'px',
      top: startY + 'px',
      fontSize: '26px',
      transform: 'translate(-50%, -50%)',
      filter: 'drop-shadow(0 0 8px #ff4757)',
      transition: 'left 0.55s linear, top 0.55s linear',
      pointerEvents: 'none',
      zIndex: 18
    });
    stage.appendChild(proj);

    requestAnimationFrame(() => {
      proj.style.left = targetX + 'px';
      proj.style.top = targetY + 'px';
    });

    setTimeout(() => {
      proj.remove();
      if (window.isHome || monster.hp <= 0) return;
      // 檢查玩家有沒有走位躲開（距離落點 65px 內算被砸中）
      if (Math.hypot(hero.x - targetX, hero.y - targetY) < 65) {
        const dmg = Math.max(1, Math.floor((12 + (monsterWave - 1) * 2.5) - getMdef()));
        hero.hp = Math.max(0, hero.hp - dmg);
        playAnim('is-hurt', 300);
        spawnVFX(hero.x, hero.y, '#ff4757', 8, false);

        const t = document.createElement('div');
        t.className = 'dmg-text';
        t.style.color = '#ff7675';
        t.textContent = `${icon}-${dmg}`;
        t.style.left = hero.x + 'px';
        t.style.top = (hero.y - 50) + 'px';
        stage.appendChild(t);
        setTimeout(() => t.remove(), 800);

        if (hero.hp <= 0) {
          alert('💀 被老闆的急件砸暈了！已送回安全點恢復');
          hero.hp = getMaxHp();
          walkTo(100, 200, 999);
        }
        updStat();
      }
    }, 950);
  }
}, 3000);
// === 🗺️ 自動在導覽列建立「職場地圖切換選單」 ===
(function initMapSelector() {
  const nav = document.getElementById('top-nav-bar');
  if (!nav || document.getElementById('map-select')) return;

  const sel = document.createElement('select');
  sel.id = 'map-select';
  sel.className = 'nav-btn';
  Object.assign(sel.style, {
    background: '#0984e3',
    color: '#ffffff',
    border: '1px solid rgba(255,255,255,0.4)',
    outline: 'none',
    cursor: 'pointer'
  });

  sel.innerHTML = workMaps.map((m, i) => `<option value="${i}" style="background:#2d3436;color:#fff;">🗺️ ${m.name}</option>`).join('');
  sel.onchange = (e) => switchMap(e.target.value);

  nav.appendChild(sel);
spawnFloorMonster(true);

})();

// =========================================================================
// 👥 5人即時連線組隊系統（已綁定你的專屬 Firebase 伺服器）
// =========================================================================
const FB_URL = "https://work-party-default-rtdb.asia-southeast1.firebasedatabase.app";
const MY_UID = "u_" + Math.random().toString(36).slice(2, 9);
let currentRoom = null;
let teammateEls = {};

// 1. 自動在左上角導覽列建立「👥 組隊房間」按鈕
(function initPartyUI() {
  const nav = document.getElementById('top-nav-bar');
  if (!nav || document.getElementById('btn-party-room')) return;

  const btn = document.createElement('button');
  btn.id = 'btn-party-room';
  btn.className = 'nav-btn';
  btn.style.background = '#6c5ce7';
  btn.textContent = '👥 組隊房間';
  btn.onclick = openPartyModal;
  nav.appendChild(btn);
})();

// 2. 打開組隊視窗（開房 / 輸入4位數房號加入 / 退出房間）
window.openPartyModal = function() {
  let modal = document.getElementById('party-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'party-modal';
    Object.assign(modal.style, {
      position: 'fixed', inset: '0', background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999
    });
    document.body.appendChild(modal);
  }

  if (currentRoom) {
    modal.innerHTML = `
      <div style="background:#1e272e;color:#fff;padding:20px;border-radius:14px;width:88%;max-width:340px;text-align:center;border:2px solid #6c5ce7;">
        <h3 style="margin-top:0;color:#a29bfe;">👥 組隊房間連線中</h3>
        <div style="font-size:26px;font-weight:bold;letter-spacing:4px;background:#2f3640;padding:10px;border-radius:8px;margin:12px 0;color:#55efc4;">
          房號：${currentRoom}
        </div>
        <p style="font-size:13px;color:#dfe6e9;">把這組 4 位數房號傳給朋友（最多 5 人同房），輸入即可並肩作戰！</p>
        <div style="display:flex;gap:10px;justify-content:center;margin-top:16px;">
          <button onclick="leavePartyRoom()" style="flex:1;padding:10px;border:none;border-radius:8px;background:#d63031;color:#fff;font-weight:bold;cursor:pointer;">離開房間</button>
          <button onclick="document.getElementById('party-modal').style.display='none'" style="flex:1;padding:10px;border:none;border-radius:8px;background:#636e72;color:#fff;font-weight:bold;cursor:pointer;">返回遊戲</button>
        </div>
      </div>`;
  } else {
    modal.innerHTML = `
      <div style="background:#1e272e;color:#fff;padding:20px;border-radius:14px;width:88%;max-width:340px;text-align:center;border:2px solid #6c5ce7;">
        <h3 style="margin-top:0;color:#a29bfe;">👥 5人即時連線組隊</h3>
        <button onclick="createPartyRoom()" style="width:100%;padding:12px;border:none;border-radius:8px;background:#00b894;color:#fff;font-size:15px;font-weight:bold;cursor:pointer;margin-bottom:14px;">
          ➕ 建立新房間（產生房號）
        </button>
        <div style="border-top:1px solid #485460;padding-top:14px;">
          <input id="input-room-id" type="number" placeholder="輸入朋友的 4 位數房號" style="width:90%;padding:10px;border-radius:8px;border:none;text-align:center;font-size:16px;margin-bottom:10px;">
          <button onclick="joinPartyRoom()" style="width:100%;padding:11px;border:none;border-radius:8px;background:#0984e3;color:#fff;font-size:15px;font-weight:bold;cursor:pointer;">
            🚀 加入朋友房間
          </button>
        </div>
        <button onclick="document.getElementById('party-modal').style.display='none'" style="margin-top:12px;padding:6px 18px;border:none;border-radius:6px;background:transparent;color:#b2bec3;cursor:pointer;">關閉視窗</button>
      </div>`;
  }
  modal.style.display = 'flex';
};

// 3. 建立房間（自動生成 4 位數房號）
window.createPartyRoom = function() {
  const code = String(Math.floor(1000 + Math.random() * 9000));
  currentRoom = code;
  document.getElementById('btn-party-room').textContent = `👥 房:${code}`;
  document.getElementById('btn-party-room').style.background = '#00b894';
  openPartyModal();
};

// 4. 加入房間（檢查房間人數上限 5 人）
window.joinPartyRoom = async function() {
  const code = (document.getElementById('input-room-id').value || '').trim();
  if (code.length !== 4) { alert('請輸入正確的 4 位數房號！'); return; }
  try {
    const res = await fetch(`${FB_URL}/rooms/${code}.json`);
    const data = await res.json();
    if (!data) { alert('找不到這個房間，請確認房號是否正確！'); return; }

    // 過濾掉超過 10 秒沒活動的離線玩家
    const now = Date.now();
    const activePlayers = Object.values(data).filter(p => p && (now - p.ts < 10000));
    if (activePlayers.length >= 5) { alert('這個房間已經滿 5 人囉！'); return; }

    currentRoom = code;
    document.getElementById('btn-party-room').textContent = `👥 房:${code}`;
    document.getElementById('btn-party-room').style.background = '#00b894';
    document.getElementById('party-modal').style.display = 'none';
  } catch (e) {
    alert('連線失敗，請確認手機有開啟網路！');
  }
};

// 5. 離開房間並清除畫面上的隊友
window.leavePartyRoom = async function() {
  if (currentRoom) {
    fetch(`${FB_URL}/rooms/${currentRoom}/${MY_UID}.json`, { method: 'DELETE' }).catch(() => {});
  }
  currentRoom = null;
  Object.values(teammateEls).forEach(el => el.remove());
  teammateEls = {};
  document.getElementById('btn-party-room').textContent = '👥 組隊房間';
  document.getElementById('btn-party-room').style.background = '#6c5ce7';
  document.getElementById('party-modal').style.display = 'none';
};

// 6. 每 0.8 秒同步一次自己與隊友的位置、外觀、樓層與等級
setInterval(async () => {
  if (!currentRoom || !hero.roleData) return;
  const r = hero.roleData;
  const myName = (document.getElementById('p-name-display')?.textContent || '打工人').trim();

  // 上傳自己的即時座標與狀態
  const payload = {
    name: myName,
    lv: hero.lv,
    x: Math.round(hero.x),
    y: Math.round(hero.y),
    dir: hero.dir,
    mapIdx: typeof currentMapIdx !== 'undefined' ? currentMapIdx : 0,
    isHome: !!window.isHome,
    pos: r.pos || '0% 0%',
    color: r.color || '#55efc4',
    ts: Date.now()
  };

  try {
    await fetch(`${FB_URL}/rooms/${currentRoom}/${MY_UID}.json`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });

    // 讀取同房間所有隊友資料並渲染到畫面上
    const res = await fetch(`${FB_URL}/rooms/${currentRoom}.json`);
    const roomData = await res.json();
    if (!roomData) return;

    const now = Date.now();
    const activeIds = new Set();

    Object.entries(roomData).forEach(([uid, p]) => {
      if (uid === MY_UID || !p || (now - p.ts > 10000)) return;
      // 只顯示在同一層樓且不在家裡的隊友
      const sameFloor = !window.isHome && !p.isHome && p.mapIdx === (typeof currentMapIdx !== 'undefined' ? currentMapIdx : 0);
      if (!sameFloor) return;

      activeIds.add(uid);
      let el = teammateEls[uid];
      if (!el) {
        el = document.createElement('div');
        Object.assign(el.style, {
          position: 'absolute', width: '90px', textAlign: 'center',
          pointerEvents: 'none', zIndex: 11,
          transition: 'left 0.75s linear, top 0.75s linear'
        });
        stage.appendChild(el);
        teammateEls[uid] = el;
      }

      el.style.left = p.x + 'px';
      el.style.top = p.y + 'px';
      el.innerHTML = `
        <div style="font-size:10px;background:rgba(0,0,0,0.75);color:#55efc4;padding:1px 6px;border-radius:6px;white-space:nowrap;margin-bottom:2px;border:1px solid ${p.color};">
          Lv.${p.lv} ${p.name}
        </div>
        <div style="width:68px;height:68px;margin:0 auto;background:url('heroes_3d.png') ${p.pos}/400% 200% no-repeat;transform:translate(-15%, -50%) scaleX(${-p.dir});filter:drop-shadow(0 4px 8px ${p.color});"></div>
      `;
    });

    // 清除已離線或換樓層的隊友圖示
    Object.keys(teammateEls).forEach(uid => {
      if (!activeIds.has(uid)) {
        teammateEls[uid].remove();
        delete teammateEls[uid];
      }
    });
  } catch (e) {
    // 斷網時安靜略過，不影響單機遊玩
  }
}, 800);
