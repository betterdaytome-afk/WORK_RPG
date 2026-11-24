function makeSvg(c1,c2){return `<svg viewBox="0 0 100 100"><polygon points="26,38 34,12 46,32" fill="${c2}"/><polygon points="74,38 66,12 54,32" fill="${c2}"/><ellipse cx="50" cy="60" rx="30" ry="26" fill="${c1}" stroke="${c2}" stroke-width="3"/><ellipse cx="50" cy="48" rx="18" ry="10" fill="#fff" opacity="0.35"/><ellipse cx="36" cy="84" rx="10" ry="6" fill="${c2}"/><ellipse cx="64" cy="84" rx="10" ry="6" fill="${c2}"/><circle cx="41" cy="54" r="5" fill="#1e272e"/><circle cx="59" cy="54" r="5" fill="#1e272e"/></svg>`;}

const roster = [
  { id: 'agumon', name: '工地學徒', atk: 18, spd: 210, proj: '🧱', pos: '0% 0%', color: '#ff4500', qName: '推車衝鋒', eName: '板模重擊', projCount: 1, projSize: 28, eType: 'giant_fireball',
    evos: [{ lv: 6, name: '水電師傅', proj: '🔧', qName: '管鉗突進', eName: '高壓電鑽砲', atkBonus: 15, hpBonus: 80, scale: 1.25, projCount: 2, projSize: 36, skillMult: 1.35 }, { lv: 12, name: '工地主任', proj: '🏗️', qName: '鋼筋三連擊', eName: '天車重錘砲', atkBonus: 35, hpBonus: 180, scale: 1.48, projCount: 3, projSize: 44, skillMult: 1.8 }] },
  { id: 'gabumon', name: '外送騎手', atk: 17, spd: 270, proj: '🛵', pos: '33.3% 0%', color: '#00d2ff', qName: '壓車甩尾', eName: '準時必達波', projCount: 2, projSize: 20, eType: 'ice_nova',
    evos: [{ lv: 6, name: '物流車長', proj: '📦', qName: '極速配送', eName: '貨櫃連環撞', atkBonus: 14, hpBonus: 75, scale: 1.25, projCount: 3, projSize: 26, skillMult: 1.35 }, { lv: 12, name: '運輸大亨', proj: '🚛', qName: '全速超車', eName: '洲際貨運衝擊', atkBonus: 34, hpBonus: 170, scale: 1.45, projCount: 4, projSize: 32, skillMult: 1.8 }] },
  { id: 'biyomon', name: '超商店員', atk: 16, spd: 290, proj: '🧾', pos: '66.6% 0%', color: '#ff7675', qName: '支援收銀', eName: '微波爐光波', projCount: 3, projSize: 18, eType: 'tornado_spread',
    evos: [{ lv: 6, name: '大夜店長', proj: '☕', qName: '咖啡因暴走', eName: '店長的怒火', atkBonus: 14, hpBonus: 70, scale: 1.28, projCount: 4, projSize: 24, skillMult: 1.35 }, { lv: 12, name: '連鎖區經理', proj: '🏪', qName: '巡店神速', eName: '全通路大特價', atkBonus: 32, hpBonus: 160, scale: 1.48, projCount: 5, projSize: 30, skillMult: 1.8 }] },
  { id: 'tentomon', name: '爆肝工程師', atk: 21, spd: 210, proj: '💻', pos: '100% 0%', color: '#f1c40f', qName: '鍵盤連打', eName: '藍白當機畫面', projCount: 1, projSize: 24, eType: 'lightning_flash',
    evos: [{ lv: 6, name: '資深架構師', proj: '⌨️', qName: '緊急修Bug', eName: '伺服器超載砲', atkBonus: 16, hpBonus: 90, scale: 1.28, projCount: 2, projSize: 32, skillMult: 1.35 }, { lv: 12, name: '科技公司CTO', proj: '🤖', qName: 'AI全自動衝刺', eName: '量子運算轟炸', atkBonus: 36, hpBonus: 210, scale: 1.5, projCount: 3, projSize: 40, skillMult: 1.8 }] },
  { id: 'palmon', name: '廚房學徒', atk: 20, spd: 220, proj: '🍳', pos: '0% 100%', color: '#2ecc71', qName: '大火快炒', eName: '爆炒油煙彈', projCount: 2, projSize: 22, eType: 'poison_cloud',
    evos: [{ lv: 6, name: '熱炒店大廚', proj: '🔪', qName: '中華一番斬', eName: '滿漢全席連擊', atkBonus: 15, hpBonus: 85, scale: 1.25, projCount: 3, projSize: 28, skillMult: 1.35 }, { lv: 12, name: '米其林主廚', proj: '🍽️', qName: '極致刀工', eName: '三星料理奧義', atkBonus: 33, hpBonus: 175, scale: 1.42, projCount: 4, projSize: 35, skillMult: 1.8 }] },
  { id: 'gomamon', name: '保全警衛', atk: 19, spd: 230, proj: '🔦', pos: '33.3% 100%', color: '#74b9ff', qName: '夜間巡邏', eName: '強光手電筒', projCount: 1, projSize: 26, eType: 'water_wave',
    evos: [{ lv: 6, name: '特勤保鑣', proj: '🛡️', qName: '戰術突進', eName: '防暴盾牌衝擊', atkBonus: 15, hpBonus: 100, scale: 1.28, projCount: 2, projSize: 34, skillMult: 1.35 }, { lv: 12, name: '維安總隊長', proj: '🚨', qName: '全城戒備', eName: '特種部隊鎮壓', atkBonus: 35, hpBonus: 230, scale: 1.5, projCount: 3, projSize: 42, skillMult: 1.8 }] },
  { id: 'patamon', name: '實習護理師', atk: 18, spd: 280, proj: '💉', pos: '66.6% 100%', color: '#ffeaa7', qName: '急診衝刺', eName: '一針見血', projCount: 1, projSize: 30, eType: 'holy_beam',
    evos: [{ lv: 6, name: '主治醫師', proj: '🩺', qName: '精準診斷', eName: '電擊去顫器', atkBonus: 18, hpBonus: 80, scale: 1.28, projCount: 2, projSize: 38, skillMult: 1.4 }, { lv: 12, name: '醫院院長', proj: '🏥', qName: '神之手術刀', eName: '奇蹟大治療術', atkBonus: 42, hpBonus: 190, scale: 1.5, projCount: 3, projSize: 46, skillMult: 1.9 }] },
  { id: 'tailmon', name: '菜鳥業務員', atk: 22, spd: 260, proj: '💼', pos: '100% 100%', color: '#fd79a8', qName: '微笑拜訪', eName: '業績達標雷射', projCount: 3, projSize: 16, eType: 'holy_ring',
    evos: [{ lv: 6, name: '金牌銷售王', proj: '📈', qName: '簽約神速', eName: '百萬訂單連發', atkBonus: 18, hpBonus: 85, scale: 1.28, projCount: 4, projSize: 24, skillMult: 1.4 }, { lv: 12, name: '集團執行長', proj: '💎', qName: '併購風暴', eName: '上市敲鐘衝擊', atkBonus: 40, hpBonus: 210, scale: 1.5, projCount: 5, projSize: 30, skillMult: 1.9 }] }
];

// === 🎒 職場裝備與補給品 ===
const pool=[
  // 1. 工地學徒 (agumon) 專屬套裝
  {icon:'⛑️',name:'黃色工地安全帽',t:'h',reqJob:'agumon',def:4},
  {icon:'🦺',name:'反光工程背心',t:'c',reqJob:'agumon',def:8},
  {icon:'🔨',name:'重型電動槌',t:'w',reqJob:'agumon',atk:15},

  // 2. 外送騎手 (gabumon) 專屬套裝
  {icon:'🪖',name:'藍牙全罩安全帽',t:'h',reqJob:'gabumon',def:4},
  {icon:'🧥',name:'防風極速外送夾克',t:'c',reqJob:'gabumon',def:8},
  {icon:'📦',name:'極速掃碼槍',t:'w',reqJob:'gabumon',atk:15},

  // 3. 超商店員 (biyomon) 專屬套裝
  {icon:'🧢',name:'店長識別遮陽帽',t:'h',reqJob:'biyomon',def:4},
  {icon:'👕',name:'條紋超商工作圍裙',t:'c',reqJob:'biyomon',def:8},
  {icon:'🧾',name:'高速收銀機',t:'w',reqJob:'biyomon',atk:15},

  // 4. 爆肝工程師 (tentomon) 專屬套裝
  {icon:'👓',name:'抗藍光黑框眼鏡',t:'h',reqJob:'tentomon',def:4},
  {icon:'🧥',name:'矽谷連帽衛衣',t:'c',reqJob:'tentomon',def:8},
  {icon:'⌨️',name:'客製機械鍵盤',t:'w',reqJob:'tentomon',atk:15},

  // 5. 廚房學徒 (palmon) 專屬套裝
  {icon:'👨‍🍳',name:'高筒純白主廚帽',t:'h',reqJob:'palmon',def:4},
  {icon:'🥼',name:'雙排扣主廚制服',t:'c',reqJob:'palmon',def:8},
  {icon:'🍳',name:'黑鐵中華炒鍋',t:'w',reqJob:'palmon',atk:15},

  // 6. 保全警衛 (gomamon) 專屬套裝
  {icon:'👮',name:'徽章勤務大盤帽',t:'h',reqJob:'gomamon',def:4},
  {icon:'🛡️',name:'防刺戰術勤務服',t:'c',reqJob:'gomamon',def:8},
  {icon:'🔦',name:'高壓防暴警棍',t:'w',reqJob:'gomamon',atk:15},

  // 7. 實習護理師 (patamon) 專屬套裝
  {icon:'🏥',name:'十字無菌護理帽',t:'h',reqJob:'patamon',def:4},
  {icon:'🩺',name:'純白急診室白袍',t:'c',reqJob:'patamon',def:8},
  {icon:'💉',name:'鈦合金手術刀',t:'w',reqJob:'patamon',atk:15},

  // 8. 菜鳥業務員 (tailmon) 專屬套裝
  {icon:'🎧',name:'商務藍牙耳麥',t:'h',reqJob:'tailmon',def:4},
  {icon:'👔',name:'高訂修身西裝',t:'c',reqJob:'tailmon',def:8},
  {icon:'💼',name:'黃金簽約鋼筆',t:'w',reqJob:'tailmon',atk:15},

  // 全職業通用補給藥水（提高掉落權重，避免 24 件裝備稀釋藥水機率）
  {icon:'❤️',name:'回復藥水',t:'hp',val:50},{icon:'❤️',name:'回復藥水',t:'hp',val:50},{icon:'❤️',name:'回復藥水',t:'hp',val:50},
  {icon:'💙',name:'魔力藥水',t:'mp',val:30},{icon:'💙',name:'魔力藥水',t:'mp',val:30},{icon:'💙',name:'魔力藥水',t:'mp',val:30},
  {icon:'🧪',name:'經驗藥水',t:'p',exp:50},{icon:'🧪',name:'經驗藥水',t:'p',exp:50}
];

// === 📖 職人全圖鑑資料庫 ===
const digidex = [];
function regDigi(id, name, stage, attr, atk, color, icon, img = '', pos = '') {
  const exist = digidex.find(d => d.id === id);
  if (exist) { if (img) exist.img = img; if (pos) exist.pos = pos; return; }
  digidex.push({ id, name, stage, attr, atk, color, icon, img, pos });
}

roster.forEach(c => {
  regDigi(c.id, c.name, '菜鳥期', '基層職員', c.atk, c.color, c.proj, '', c.pos);
  if (c.evos) c.evos.forEach((e, idx) => regDigi(c.id + '_e' + idx, e.name, idx === 0 ? '資深期' : '管理層', '升職型態', c.atk + e.atkBonus, c.color, e.proj, ''));
});

// 預留圖片設定（日後換成真人/Q版職人圖檔名即可）
regDigi('agumon_e0', '水電師傅', '資深期', '升職型態', 33, '#ff4500', '🔧', '');
regDigi('agumon_e1', '工地主任', '管理層', '升職型態', 53, '#ff4500', '🏗️', '');
regDigi('gabumon_e0', '物流車長', '資深期', '升職型態', 31, '#00d2ff', '📦', '');
regDigi('gabumon_e1', '運輸大亨', '管理層', '升職型態', 51, '#00d2ff', '🚛', '');

// 傳說級職場大老與行業巨頭
regDigi('wargreymon', '營建集團總裁', '傳說級', '建築巨頭', 95, '#ff4500', '🏙️', '');
regDigi('metalgarurumon', '全球供應鏈之王', '傳說級', '物流巨頭', 92, '#00d2ff', '🚢', '');
regDigi('omegamon', '跨國商業帝王', '傳說級', '董事會', 130, '#ffffff', '👑', '');
regDigi('imperialdramon', '矽谷科技教父', '傳說級', '科技巨頭', 115, '#0984e3', '🚀', '');
regDigi('dukemon', '首席王牌律師', '傳說級', '法務巨頭', 120, '#d63031', '⚖️', '');
regDigi('alphamon', '神秘天使投資人', '傳說級', '金融巨頭', 128, '#2d3436', '💰', '');
regDigi('magnamon', '華爾街操盤手', '傳說級', '金融巨頭', 105, '#fdcb6e', '📊', '');
regDigi('ulforceveedramon', '首席飛行員機長', '傳說級', '航空巨頭', 118, '#74b9ff', '✈️', '');

// 各行各業職人圖鑑
regDigi('veemon', '消防救護員', '菜鳥期', '公職人員', 22, '#0984e3', '🚒', '');
regDigi('guilmon', '汽車修護技師', '菜鳥期', '技術人員', 24, '#d63031', '🔩', '');
regDigi('renamon', '時尚服裝設計師', '菜鳥期', '創意人員', 23, '#fdcb6e', '✂️', '');
regDigi('terriermon', '咖啡廳拉花師', '菜鳥期', '餐飲人員', 21, '#55efc4', '🧋', '');
regDigi('impmon', '深夜電台DJ', '菜鳥期', '媒體人員', 22, '#a29bfe', '🎙️', '');
regDigi('beelzemon', '百萬訂閱實況主', '傳說級', '自媒體王', 122, '#6c5ce7', '🎥', '');
regDigi('lucemon', '王牌會計精算師', '資深期', '金融人員', 88, '#ffeaa7', '🧮', '');
regDigi('lilithmon', '公關危機處理女王', '傳說級', '公關巨頭', 110, '#fd79a8', '💄', '');

// 職場大魔王（Boss 圖鑑）
regDigi('devimon', '無良慣老闆', '主管級', '職場魔王', 48, '#2d3436', '👹', '');
regDigi('myotismon', '瘋狂加班狂魔', '高管級', '職場魔王', 75, '#6c5ce7', '⏰', '');
regDigi('metalseadramon', '無理取鬧奧客', '傳說級', '職場魔王', 96, '#00cec9', '📢', '');
regDigi('puppetmon', '甩鍋推責主管', '傳說級', '職場魔王', 90, '#00b894', '🎭', '');
regDigi('machinedramon', '無情裁員機器', '傳說級', '職場魔王', 102, '#636e72', '📉', '');
regDigi('piedmon', '畫大餅董事長', '傳說級', '職場魔王', 105, '#e84393', '🥧', '');
regDigi('apocalymon', '年終獎金歸零獸', '傳說級', '終極魔王', 135, '#b2bec3', '💸', '');
regDigi('diaboromon', '週五下班前急件', '傳說級', '終極魔王', 125, '#a29bfe', '📩', '');
