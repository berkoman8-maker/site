/* cases-bundle.js — GlitchGrid Case sistemi (otomatik birlestirildi) */

/* ===== cases-data.js ===== */
/* =====================================================
   CASES-DATA.JS — 100 Kasa, 7 Nadir Seviyesi
   Fiyat: 50 🪙 → 10,000,000,000 🪙
   Admin özel kasaları localStorage'dan merge edilir
===================================================== */

const RARITY = {
  common:     { key:'common',     label:'NORMAL',      color:'#64748b', weight:40   },
  uncommon:   { key:'uncommon',   label:'NADİR',       color:'#22c55e', weight:25   },
  rare:       { key:'rare',       label:'EPİK',        color:'#3b82f6', weight:15   },
  epic:       { key:'epic',       label:'SÜPER EPİK',  color:'#a855f7', weight:10   },
  legendary:  { key:'legendary',  label:'EFSANEVİ',    color:'#f59e0b', weight:5    },
  ancient:    { key:'ancient',    label:'ANTİK',       color:'#ef4444', weight:2    },
  contraband: { key:'contraband', label:'YASAKLI',     color:'#ff6ef7', weight:0.7  },
};

/* Kasa değer çarpanlarını kolayca ölçeklendirmek için yardımcı */
const K  = 1_000;
const M  = 1_000_000;
const B  = 1_000_000_000;

const STATIC_CASES = [

  /* ══════════════ GRUP 1: TEMEL (50–500) ══════════════ */
  {
    id:'starter',   tier:'basic', tierLabel:'TEMEL',
    name:'Başlangıç Kasası', emoji:'📦', price:50,
    glowColor:'rgba(100,116,139,.4)',
    desc:'Yeni oyuncular için. Temel silah ve zırhlar.',
    items:[
      {name:'Ahşap Kalkan',    emoji:'🛡️', rarity:'common',    value:20},
      {name:'Taş Kılıç',      emoji:'⚔️', rarity:'common',    value:25},
      {name:'Hasır Şapka',    emoji:'🪖', rarity:'common',    value:18},
      {name:'Demir Balta',    emoji:'🪓', rarity:'uncommon',  value:65},
      {name:'Yay & Ok',       emoji:'🏹', rarity:'uncommon',  value:80},
      {name:'Gümüş Zırh',     emoji:'🥋', rarity:'rare',      value:160},
      {name:'Kristal Asa',    emoji:'🪄', rarity:'epic',      value:350},
      {name:'Altın Kılıç',    emoji:'🗡️', rarity:'legendary', value:700},
      {name:'Ejder Tozu',     emoji:'✨', rarity:'ancient',   value:1400},
      {name:'İlahi Silah',    emoji:'⚡', rarity:'contraband',value:3000},
    ],
  },
  {
    id:'bronze',    tier:'basic', tierLabel:'TEMEL',
    name:'Bronz Kasa', emoji:'🟫', price:75,
    glowColor:'rgba(180,100,50,.4)',
    desc:'Bronz kalite ekipmanlar.',
    items:[
      {name:'Bronz Bıçak',    emoji:'🔪', rarity:'common',    value:30},
      {name:'Bronz Kalkan',   emoji:'🛡️', rarity:'common',    value:28},
      {name:'Tunç Zırh',      emoji:'🥋', rarity:'uncommon',  value:90},
      {name:'Bronz Yay',      emoji:'🏹', rarity:'uncommon',  value:100},
      {name:'Döküm Kılıç',    emoji:'⚔️', rarity:'rare',      value:200},
      {name:'Bronz Ejder',    emoji:'🐉', rarity:'epic',      value:500},
      {name:'Antik Bronz',    emoji:'🏺', rarity:'legendary', value:1100},
      {name:'Bronz Tanrısı',  emoji:'🔱', rarity:'ancient',   value:2200},
      {name:'Zamanın Bronzu', emoji:'⏳', rarity:'contraband',value:5000},
    ],
  },
  {
    id:'forest',    tier:'basic', tierLabel:'TEMEL',
    name:'Orman Kasası', emoji:'🌲', price:100,
    glowColor:'rgba(34,197,94,.35)',
    desc:'Ormanın derinliklerinden doğa eşyaları.',
    items:[
      {name:'Meşe Yayı',      emoji:'🪵', rarity:'common',    value:40},
      {name:'Dikenli Kalkan', emoji:'🌿', rarity:'common',    value:38},
      {name:'Zehir Oku',      emoji:'🏹', rarity:'uncommon',  value:110},
      {name:'Orman Büyüsü',   emoji:'🍃', rarity:'uncommon',  value:130},
      {name:'Elf Kılıcı',     emoji:'⚔️', rarity:'rare',      value:280},
      {name:'Druid Asası',    emoji:'🪄', rarity:'epic',      value:650},
      {name:'Orman Ruhu',     emoji:'🌳', rarity:'legendary', value:1400},
      {name:'Ağaç Tanrısı',   emoji:'🌲', rarity:'ancient',   value:3000},
      {name:'Doğanın Gücü',  emoji:'☘️', rarity:'contraband',value:6500},
    ],
  },
  {
    id:'iron',      tier:'basic', tierLabel:'TEMEL',
    name:'Demir Kasa', emoji:'⚙️', price:120,
    glowColor:'rgba(148,163,184,.35)',
    desc:'Demir işçiliğinin en iyi ürünleri.',
    items:[
      {name:'Demir Çivi',     emoji:'🔩', rarity:'common',    value:45},
      {name:'Çelik Plaka',    emoji:'🛡️', rarity:'common',    value:42},
      {name:'Demir Zırh',     emoji:'🥋', rarity:'uncommon',  value:120},
      {name:'Demir Boru',     emoji:'🔧', rarity:'uncommon',  value:140},
      {name:'Çelik Kılıç',    emoji:'⚔️', rarity:'rare',      value:320},
      {name:'Demir Golem',    emoji:'🤖', rarity:'epic',      value:750},
      {name:'Çelik Titan',    emoji:'🗿', rarity:'legendary', value:1600},
      {name:'Demir Efendi',   emoji:'⚙️', rarity:'ancient',   value:3500},
      {name:'Metal Tanrısı',  emoji:'🔨', rarity:'contraband',value:8000},
    ],
  },
  {
    id:'stone',     tier:'basic', tierLabel:'TEMEL',
    name:'Taş Kasa', emoji:'🪨', price:150,
    glowColor:'rgba(120,113,108,.35)',
    desc:'Antik taş ustaların eserleri.',
    items:[
      {name:'Çakıl Taşı',     emoji:'🪨', rarity:'common',    value:55},
      {name:'Granit Kalkan',  emoji:'🛡️', rarity:'common',    value:52},
      {name:'Mermer Zırh',    emoji:'🥋', rarity:'uncommon',  value:145},
      {name:'Obsidyen Bıçak', emoji:'🔪', rarity:'uncommon',  value:165},
      {name:'Kaya Kılıcı',    emoji:'⚔️', rarity:'rare',      value:380},
      {name:'Taş Golem',      emoji:'🗿', rarity:'epic',      value:880},
      {name:'Granit Titan',   emoji:'🏔️', rarity:'legendary', value:1900},
      {name:'Taş Tanrısı',    emoji:'🪨', rarity:'ancient',   value:4200},
      {name:'Dünya Efendisi', emoji:'🌍', rarity:'contraband',value:9500},
    ],
  },

  /* ══════════════ GRUP 2: PREMIUM (150–1K) ══════════════ */
  {
    id:'weapon',    tier:'premium', tierLabel:'PREMİUM',
    name:'Silah Kasası', emoji:'🗡️', price:150,
    glowColor:'rgba(59,130,246,.4)',
    desc:'Güçlü saldırı silahları.',
    items:[
      {name:'Pas Bıçak',      emoji:'🔪', rarity:'common',    value:60},
      {name:'Demir Ok',       emoji:'🏹', rarity:'common',    value:55},
      {name:'Savaş Baltası',  emoji:'🪓', rarity:'uncommon',  value:160},
      {name:'Lazer Tabancası',emoji:'🔫', rarity:'uncommon',  value:200},
      {name:'Kara Bıçak',     emoji:'🗡️', rarity:'rare',      value:420},
      {name:'Plazma Kılıcı',  emoji:'⚔️', rarity:'epic',      value:900},
      {name:'Nükleer Tüfek',  emoji:'💥', rarity:'legendary', value:2000},
      {name:'Tanrı Kılıcı',   emoji:'🌟', rarity:'ancient',   value:4500},
      {name:'Ölüm Orağı',     emoji:'☠️', rarity:'contraband',value:10*K},
    ],
  },
  {
    id:'armor',     tier:'premium', tierLabel:'PREMİUM',
    name:'Zırh Kasası', emoji:'🛡️', price:175,
    glowColor:'rgba(99,102,241,.4)',
    desc:'Sağlam savunma ekipmanları.',
    items:[
      {name:'Deri Zırh',      emoji:'🥼', rarity:'common',    value:65},
      {name:'Tahta Kalkan',   emoji:'🛡️', rarity:'common',    value:60},
      {name:'Zincir Zırh',    emoji:'⛓️', rarity:'uncommon',  value:170},
      {name:'Plaka Zırh',     emoji:'🦺', rarity:'uncommon',  value:200},
      {name:'Mithril Kalkan', emoji:'🔵', rarity:'rare',      value:450},
      {name:'Ejder Zırhı',    emoji:'🐉', rarity:'epic',      value:950},
      {name:'Titan Zırhı',    emoji:'🗿', rarity:'legendary', value:2100},
      {name:'Tanrısal Kalkan',emoji:'✨', rarity:'ancient',   value:4800},
      {name:'Yenilmez Zırh',  emoji:'💫', rarity:'contraband',value:11*K},
    ],
  },
  {
    id:'ocean',     tier:'premium', tierLabel:'PREMİUM',
    name:'Okyanus Kasası', emoji:'🌊', price:200,
    glowColor:'rgba(6,182,212,.4)',
    desc:'Derinliklerin gizemli silahları.',
    items:[
      {name:'Mercan Kılıç',     emoji:'🪸', rarity:'common',    value:80},
      {name:'Deniz Kabuğu',     emoji:'🐚', rarity:'common',    value:75},
      {name:'Mürekkep Bombası', emoji:'🦑', rarity:'uncommon',  value:220},
      {name:'Deniz Zırhı',      emoji:'🦞', rarity:'uncommon',  value:260},
      {name:'Tsunami Bıçağı',   emoji:'🌊', rarity:'rare',      value:600},
      {name:'Köpekbalığı Dişi', emoji:'🦷', rarity:'epic',      value:1400},
      {name:'Derin Deniz Gizemi',emoji:'🐙',rarity:'legendary', value:3000},
      {name:'Poseidon Trident', emoji:'🔱', rarity:'ancient',   value:6500},
      {name:'Okyanus Tanrısı',  emoji:'🌏', rarity:'contraband',value:15*K},
    ],
  },
  {
    id:'fire',      tier:'premium', tierLabel:'PREMİUM',
    name:'Ateş Kasası', emoji:'🔥', price:250,
    glowColor:'rgba(249,115,22,.4)',
    desc:'Alevlerin içinden doğan silahlar.',
    items:[
      {name:'Kor Parçası',    emoji:'🔥', rarity:'common',    value:95},
      {name:'Alev Oku',       emoji:'🏹', rarity:'common',    value:90},
      {name:'Ateş Kılıcı',    emoji:'⚔️', rarity:'uncommon',  value:260},
      {name:'Lav Kalkan',     emoji:'🛡️', rarity:'uncommon',  value:300},
      {name:'Cehennem Alevi', emoji:'🌋', rarity:'rare',      value:720},
      {name:'Alev Efendisi',  emoji:'😈', rarity:'epic',      value:1700},
      {name:'Ateş Tanrısı',   emoji:'🔥', rarity:'legendary', value:3800},
      {name:'Güneş Kılıcı',   emoji:'☀️', rarity:'ancient',   value:8500},
      {name:'Evrenin Ateşi',  emoji:'💥', rarity:'contraband',value:18*K},
    ],
  },
  {
    id:'neon',      tier:'special', tierLabel:'ÖZEL',
    name:'Neon Kasası', emoji:'💜', price:250,
    glowColor:'rgba(255,110,247,.4)',
    desc:'Şehrin neon renkli koleksiyonu.',
    items:[
      {name:'Neon Bandana',   emoji:'🎀', rarity:'common',    value:100},
      {name:'Mor Güneş Gözlüğü',emoji:'🕶️',rarity:'common',  value:90},
      {name:'Elektrik Eldiven',emoji:'🧤',rarity:'uncommon',  value:260},
      {name:'Lazer Çizme',    emoji:'👢', rarity:'uncommon',  value:300},
      {name:'Hologram Kılıç', emoji:'⚔️', rarity:'rare',      value:700},
      {name:'Plazma Süpürge', emoji:'🧹', rarity:'epic',      value:1500},
      {name:'Neon Tanrı',     emoji:'💡', rarity:'legendary', value:3500},
      {name:'Siber Varlık',   emoji:'🤖', rarity:'ancient',   value:7500},
      {name:'Dijital Efsane', emoji:'💻', rarity:'contraband',value:17*K},
    ],
  },

  /* ══════════════ GRUP 3: ELİT (300–2K) ══════════════ */
  {
    id:'space',     tier:'elite', tierLabel:'ELİT',
    name:'Uzay Kasası', emoji:'🚀', price:300,
    glowColor:'rgba(168,85,247,.4)',
    desc:'Galaksinin kozmik eşyaları.',
    items:[
      {name:'Meteor Parçası',  emoji:'🪨', rarity:'common',    value:120},
      {name:'Uzay Eldiveni',   emoji:'🧤', rarity:'common',    value:110},
      {name:'Yıldız Tozu',     emoji:'✨', rarity:'uncommon',  value:300},
      {name:'Neon Zırh',       emoji:'🦺', rarity:'uncommon',  value:350},
      {name:'Galaksi Kılıcı',  emoji:'🌌', rarity:'rare',      value:750},
      {name:'Antimateria Silah',emoji:'🔮',rarity:'epic',      value:1600},
      {name:'Kara Delik Ateşi',emoji:'🕳️', rarity:'legendary', value:3500},
      {name:'Kozmik Tanrı',    emoji:'👑', rarity:'ancient',   value:8*K},
      {name:'Evren Parçalayıcı',emoji:'💫',rarity:'contraband',value:20*K},
    ],
  },
  {
    id:'shadow',    tier:'elite', tierLabel:'ELİT',
    name:'Karanlık Kasa', emoji:'🌑', price:350,
    glowColor:'rgba(139,92,246,.4)',
    desc:'Gecenin karanlığından silahlar.',
    items:[
      {name:'Gölge Hançeri',   emoji:'🌒', rarity:'common',    value:140},
      {name:'Zifiri Maske',    emoji:'🎭', rarity:'common',    value:130},
      {name:'Karanlık Yay',    emoji:'🏹', rarity:'uncommon',  value:380},
      {name:'Ruh Emici',       emoji:'🕸️', rarity:'uncommon',  value:420},
      {name:'Gölge Büyüsü',    emoji:'🔮', rarity:'rare',      value:950},
      {name:'Karanlık Zırh',   emoji:'🦇', rarity:'epic',      value:2100},
      {name:'Ölüm Dokunuşu',   emoji:'💀', rarity:'legendary', value:4800},
      {name:'Karanlık Tanrı',  emoji:'🌑', rarity:'ancient',   value:11*K},
      {name:'Evrenin Karanlığı',emoji:'⬛',rarity:'contraband',value:25*K},
    ],
  },
  {
    id:'cyber',     tier:'special', tierLabel:'ÖZEL',
    name:'Siberpunk Kasası', emoji:'🤖', price:350,
    glowColor:'rgba(34,197,94,.4)',
    desc:'Geleceğin siborg ekipmanları.',
    items:[
      {name:'Krom Kol',        emoji:'🦾', rarity:'common',    value:140},
      {name:'Nöro Chip',       emoji:'💾', rarity:'common',    value:130},
      {name:'Lazer Göz',       emoji:'👁️', rarity:'uncommon',  value:360},
      {name:'Exo Zırh',        emoji:'🦿', rarity:'uncommon',  value:420},
      {name:'Plazma Kanon',    emoji:'🔫', rarity:'rare',      value:950},
      {name:'Nano Bot Sürüsü', emoji:'⚙️', rarity:'epic',      value:2100},
      {name:'Siberpunk Tanrı', emoji:'🤖', rarity:'legendary', value:4500},
      {name:'Dijital Ölümsüz', emoji:'💡', rarity:'ancient',   value:10*K},
      {name:'Yapay Zeka Efendi',emoji:'🧠',rarity:'contraband',value:22*K},
    ],
  },
  {
    id:'ghost',     tier:'elite', tierLabel:'ELİT',
    name:'Hayalet Kasası', emoji:'👻', price:400,
    glowColor:'rgba(226,232,240,.2)',
    desc:'Öteki dünyadan ürpertici silahlar.',
    items:[
      {name:'Ectoplazm Şişesi',emoji:'🧪', rarity:'common',    value:160},
      {name:'Hayalet Maskesi', emoji:'😨', rarity:'common',    value:150},
      {name:'Ruh Bağı',        emoji:'⛓️', rarity:'uncommon',  value:420},
      {name:'Ölüm Feneri',     emoji:'🔦', rarity:'uncommon',  value:480},
      {name:'Hayalet Orak',    emoji:'🌙', rarity:'rare',      value:1100},
      {name:'Cehennem Kapısı', emoji:'🚪', rarity:'epic',      value:2400},
      {name:'Ölüm Perisi',     emoji:'🧚', rarity:'legendary', value:5200},
      {name:'Grim Reaper',     emoji:'💀', rarity:'ancient',   value:12*K},
      {name:'Ölümün Efendisi', emoji:'☠️', rarity:'contraband',value:28*K},
    ],
  },
  {
    id:'ice',       tier:'elite', tierLabel:'ELİT',
    name:'Buz Kasası', emoji:'❄️', price:420,
    glowColor:'rgba(147,197,253,.4)',
    desc:'Kutupların dondurucu silahları.',
    items:[
      {name:'Buz Kristali',   emoji:'💎', rarity:'common',    value:170},
      {name:'Kar Topu',       emoji:'🌨️', rarity:'common',    value:155},
      {name:'Fırtına Oku',    emoji:'🏹', rarity:'uncommon',  value:440},
      {name:'Buz Zırhı',      emoji:'🧊', rarity:'uncommon',  value:510},
      {name:'Kılıç Kırağı',   emoji:'❄️', rarity:'rare',      value:1200},
      {name:'Çığ Fırtınası',  emoji:'🌬️', rarity:'epic',      value:2600},
      {name:'Buz Tanrısı',    emoji:'🥶', rarity:'legendary', value:5800},
      {name:'Kutup Efendisi', emoji:'🐻‍❄️',rarity:'ancient',   value:13*K},
      {name:'Ebedi Dondurucu',emoji:'☃️', rarity:'contraband',value:30*K},
    ],
  },
  {
    id:'thunder',   tier:'elite', tierLabel:'ELİT',
    name:'Gök Gürültüsü Kasası', emoji:'⚡', price:480,
    glowColor:'rgba(250,204,21,.4)',
    desc:'Şimşeklerin elektrikli gücü.',
    items:[
      {name:'Statik Tüy',     emoji:'🪶', rarity:'common',    value:190},
      {name:'Yıldırım Taşı',  emoji:'🪨', rarity:'common',    value:180},
      {name:'Elektrik Zırhı', emoji:'🦺', rarity:'uncommon',  value:490},
      {name:'Şimşek Bıçağı',  emoji:'🔪', rarity:'uncommon',  value:560},
      {name:'Çarpan Yıldırım',emoji:'⚡', rarity:'rare',      value:1300},
      {name:'Fırtına Hançeri',emoji:'🗡️', rarity:'epic',      value:2900},
      {name:'Thor Çekici',    emoji:'🔨', rarity:'legendary', value:6500},
      {name:'Gök Tanrısı',    emoji:'⚡', rarity:'ancient',   value:15*K},
      {name:'Zeus Silahı',    emoji:'🌩️', rarity:'contraband',value:33*K},
    ],
  },
  {
    id:'poison',    tier:'special', tierLabel:'ÖZEL',
    name:'Zehir Kasası', emoji:'☠️', price:320,
    glowColor:'rgba(163,230,53,.4)',
    desc:'Ölümcül zehirlerle kaplı silahlar.',
    items:[
      {name:'Zehirli Hançer', emoji:'🗡️', rarity:'common',    value:130},
      {name:'Zehir Şişesi',   emoji:'🧪', rarity:'common',    value:120},
      {name:'Asit Kalkan',    emoji:'🛡️', rarity:'uncommon',  value:340},
      {name:'Kobra Dişi',     emoji:'🐍', rarity:'uncommon',  value:400},
      {name:'Ölüm Zehiri',    emoji:'💀', rarity:'rare',      value:1000},
      {name:'Zehir Ejderi',   emoji:'🐉', rarity:'epic',      value:2300},
      {name:'Medusa Bakışı',  emoji:'🪬', rarity:'legendary', value:5500},
      {name:'Zehir Tanrısı',  emoji:'☠️', rarity:'ancient',   value:12*K},
      {name:'Evrenin Zehiri', emoji:'🌿', rarity:'contraband',value:27*K},
    ],
  },
  {
    id:'music_case',tier:'special', tierLabel:'ÖZEL',
    name:'Müzik Kasası', emoji:'🎵', price:280,
    glowColor:'rgba(249,168,212,.4)',
    desc:'Ritim ve melodinin gücünden eşyalar.',
    items:[
      {name:'Nota Kılıcı',    emoji:'🎵', rarity:'common',    value:115},
      {name:'Davul Tokması',  emoji:'🥁', rarity:'common',    value:105},
      {name:'Gitar Zırhı',    emoji:'🎸', rarity:'uncommon',  value:300},
      {name:'Melodi Yayı',    emoji:'🎻', rarity:'uncommon',  value:360},
      {name:'Sesli Patlama',  emoji:'💥', rarity:'rare',      value:900},
      {name:'Ritim Kalkanı',  emoji:'🛡️', rarity:'epic',      value:2000},
      {name:'Müzik Tanrısı',  emoji:'🎹', rarity:'legendary', value:4600},
      {name:"Apollon'un Lyra",emoji:'🪕', rarity:'ancient',   value:10*K},
      {name:'Evrenin Melodisi',emoji:'🎶',rarity:'contraband',value:23*K},
    ],
  },
  {
    id:'sport',     tier:'special', tierLabel:'ÖZEL',
    name:'Spor Kasası', emoji:'🏆', price:230,
    glowColor:'rgba(250,204,21,.35)',
    desc:'Efsanevi spor koleksiyonu.',
    items:[
      {name:'Futbol Topu',    emoji:'⚽', rarity:'common',    value:90},
      {name:'Spor Şapka',     emoji:'🧢', rarity:'common',    value:85},
      {name:'Kupa Tokası',    emoji:'🏆', rarity:'uncommon',  value:240},
      {name:'Altın Krampon',  emoji:'👟', rarity:'uncommon',  value:290},
      {name:'Efsane Forma',   emoji:'👕', rarity:'rare',      value:750},
      {name:'Şampiyon Kemeri',emoji:'🥇', rarity:'epic',      value:1800},
      {name:'Altın Top',      emoji:'🌟', rarity:'legendary', value:4200},
      {name:'Spor Tanrısı',   emoji:'⚡', rarity:'ancient',   value:9500},
      {name:'Olimpiyat Alevi',emoji:'🔥', rarity:'contraband',value:21*K},
    ],
  },

  /* ══════════════ GRUP 4: EFSANEVİ (500–10K) ══════════════ */
  {
    id:'dragon',    tier:'legendary', tierLabel:'EFSANEVİ',
    name:'Ejderha Kasası', emoji:'🐉', price:500,
    glowColor:'rgba(239,68,68,.4)',
    desc:'Ejderlerin gizli hazineleri.',
    items:[
      {name:'Ejder Pulu',     emoji:'🐚', rarity:'common',    value:200},
      {name:'Lav Topu',       emoji:'🔥', rarity:'common',    value:220},
      {name:'Zehir Dişi',     emoji:'🦷', rarity:'uncommon',  value:480},
      {name:'Kanat Kılıcı',   emoji:'🗡️', rarity:'uncommon',  value:600},
      {name:'Ejder Kafatası', emoji:'💀', rarity:'rare',      value:1300},
      {name:'Lav Zırhı',      emoji:'🌋', rarity:'epic',      value:2800},
      {name:'Ejder Kalbi',    emoji:'❤️‍🔥',rarity:'legendary', value:6000},
      {name:'Antik Ejder Ruhu',emoji:'🐲',rarity:'ancient',   value:14*K},
      {name:'Tanrı Ejderi',   emoji:'🔱', rarity:'contraband',value:35*K},
    ],
  },
  {
    id:'time',      tier:'legendary', tierLabel:'EFSANEVİ',
    name:'Zaman Kasası', emoji:'⏳', price:550,
    glowColor:'rgba(245,158,11,.4)',
    desc:'Farklı çağlardan zamansız eserler.',
    items:[
      {name:'Saatin Kumu',    emoji:'⌛', rarity:'common',    value:220},
      {name:'Antik Harita',   emoji:'🗺️', rarity:'common',    value:240},
      {name:'Saat Mekanizması',emoji:'⚙️',rarity:'uncommon',  value:580},
      {name:'Zaman Kristali', emoji:'💎', rarity:'uncommon',  value:680},
      {name:'Kronos Kılıcı',  emoji:'⚔️', rarity:'rare',      value:1450},
      {name:'Zaman Durdurucu',emoji:'⏱️', rarity:'epic',      value:3100},
      {name:'Geçmiş Kontrol', emoji:'🔮', rarity:'legendary', value:6800},
      {name:'Zaman Tanrısı',  emoji:'⏳', rarity:'ancient',   value:16*K},
      {name:'Sonsuzluk Taşı', emoji:'♾️', rarity:'contraband',value:40*K},
    ],
  },
  {
    id:'volcano',   tier:'legendary', tierLabel:'EFSANEVİ',
    name:'Volkan Kasası', emoji:'🌋', price:600,
    glowColor:'rgba(251,146,60,.4)',
    desc:'Lavların içinden ateşten silahlar.',
    items:[
      {name:'Volkan Taşı',    emoji:'🪨', rarity:'common',    value:240},
      {name:'Lav Kristali',   emoji:'💎', rarity:'common',    value:260},
      {name:'Ateş Kolyesi',   emoji:'📿', rarity:'uncommon',  value:600},
      {name:'Magma Kalkan',   emoji:'🛡️', rarity:'uncommon',  value:720},
      {name:'Kor Kılıcı',     emoji:'🗡️', rarity:'rare',      value:1600},
      {name:'Yanardağ Zırhı', emoji:'🌋', rarity:'epic',      value:3400},
      {name:'Ateş Tanrısı',   emoji:'🔥', rarity:'legendary', value:7500},
      {name:'Lav Efendisi',   emoji:'😈', rarity:'ancient',   value:18*K},
      {name:"Dünyanın Ateşi", emoji:'🌍', rarity:'contraband',value:45*K},
    ],
  },
  {
    id:'heaven',    tier:'legendary', tierLabel:'EFSANEVİ',
    name:'Cennet Kasası', emoji:'☁️', price:750,
    glowColor:'rgba(253,224,71,.35)',
    desc:'İlahi güçlerin nadir koleksiyonu.',
    items:[
      {name:'Meleksi Tüy',    emoji:'🪶', rarity:'common',    value:300},
      {name:'Kutsal Su',      emoji:'💧', rarity:'common',    value:280},
      {name:'Altın Halo',     emoji:'👼', rarity:'uncommon',  value:760},
      {name:'İlahi Işık',     emoji:'🌟', rarity:'uncommon',  value:850},
      {name:'Serafim Kanatları',emoji:'🦋',rarity:'rare',     value:1900},
      {name:'İlahi Kılıç',    emoji:'⚔️', rarity:'epic',      value:4200},
      {name:'Cennet Kalkanı', emoji:'🛡️', rarity:'legendary', value:9000},
      {name:'Baş Melek',      emoji:'😇', rarity:'ancient',   value:22*K},
      {name:"Tanrı'nın Eli",  emoji:'✋', rarity:'contraband',value:55*K},
    ],
  },
  {
    id:'ancient_case',tier:'legendary',tierLabel:'EFSANEVİ',
    name:'Antik Medeniyet Kasası', emoji:'🏛️', price:800,
    glowColor:'rgba(234,179,8,.4)',
    desc:'Kaybolmuş medeniyetlerin kalıntıları.',
    items:[
      {name:'Mısır Papirüsü', emoji:'📜', rarity:'common',    value:320},
      {name:'Antik Vazo',     emoji:'🏺', rarity:'common',    value:300},
      {name:'Roma Kılıcı',    emoji:'⚔️', rarity:'uncommon',  value:800},
      {name:'Yunan Kalkanı',  emoji:'🛡️', rarity:'uncommon',  value:920},
      {name:'Sfenks Sırrı',   emoji:'🦁', rarity:'rare',      value:2200},
      {name:'Atlantis Gemisi',emoji:'⛵', rarity:'epic',      value:5000},
      {name:'Sümer Yazıtı',   emoji:'🪨', rarity:'legendary', value:11*K},
      {name:"Firavun'un Gücü",emoji:'👑', rarity:'ancient',   value:25*K},
      {name:'Tanrılar Silahı',emoji:'🔱', rarity:'contraband',value:60*K},
    ],
  },
  {
    id:'galaxy',    tier:'legendary', tierLabel:'EFSANEVİ',
    name:'Galaksi Kasası', emoji:'🌌', price:900,
    glowColor:'rgba(99,102,241,.5)',
    desc:'Evrenin en uzak köşelerinden eşyalar.',
    items:[
      {name:'Nebula Tozu',    emoji:'🌌', rarity:'common',    value:360},
      {name:'Yıldız Kalkanı', emoji:'⭐', rarity:'common',    value:340},
      {name:'Galaktik Zırh',  emoji:'🦺', rarity:'uncommon',  value:900},
      {name:'Evren Kılıcı',   emoji:'⚔️', rarity:'uncommon',  value:1050},
      {name:'Kara Delik Taşı',emoji:'🕳️', rarity:'rare',      value:2500},
      {name:'Pulsار Kalkanı', emoji:'🌠', rarity:'epic',      value:5500},
      {name:'Galaksi Tanrısı',emoji:'🌌', rarity:'legendary', value:12*K},
      {name:'Evren Efendisi', emoji:'✨', rarity:'ancient',   value:28*K},
      {name:'Big Bang Silahı',emoji:'💥', rarity:'contraband',value:70*K},
    ],
  },
  {
    id:'myth',      tier:'legendary', tierLabel:'EFSANEVİ',
    name:'Mitoloji Kasası', emoji:'⚗️', price:1*K,
    glowColor:'rgba(168,85,247,.5)',
    desc:'Mitolojik tanrıların silahları.',
    items:[
      {name:'Zeus Şimşeği',   emoji:'⚡', rarity:'common',    value:400},
      {name:'Ares Kalkanı',   emoji:'🛡️', rarity:'common',    value:380},
      {name:'Poseidon Çatalı',emoji:'🔱', rarity:'uncommon',  value:1000},
      {name:'Artemis Yayı',   emoji:'🏹', rarity:'uncommon',  value:1150},
      {name:'Hephaestus Çekici',emoji:'🔨',rarity:'rare',     value:2800},
      {name:'Athena Kılıcı',  emoji:'⚔️', rarity:'epic',      value:6000},
      {name:'Ares Zırhı',     emoji:'🪖', rarity:'legendary', value:13*K},
      {name:'Olimpos Silahı', emoji:'🏔️', rarity:'ancient',   value:30*K},
      {name:'Tanrılar Birliği',emoji:'👁️',rarity:'contraband',value:75*K},
    ],
  },
  {
    id:'quantum',   tier:'legendary', tierLabel:'EFSANEVİ',
    name:'Kuantum Kasası', emoji:'⚛️', price:2*K,
    glowColor:'rgba(6,182,212,.5)',
    desc:'Kuantum fiziğinin gizli silahları.',
    items:[
      {name:'Kuantum Tüneli', emoji:'⚛️', rarity:'common',    value:800},
      {name:'Dalga Kalkan',   emoji:'〰️', rarity:'common',    value:750},
      {name:'Foton Kılıcı',   emoji:'💫', rarity:'uncommon',  value:2000},
      {name:'Quark Zırh',     emoji:'🔬', rarity:'uncommon',  value:2300},
      {name:'Anti-Madde Silah',emoji:'💥',rarity:'rare',      value:5500},
      {name:'Kuantum Efendisi',emoji:'⚗️',rarity:'epic',      value:12*K},
      {name:'Kuantum Tanrısı',emoji:'⚛️', rarity:'legendary', value:28*K},
      {name:'Evren Teorisi',  emoji:'📐', rarity:'ancient',   value:65*K},
      {name:'Higgs Bozon',    emoji:'✨', rarity:'contraband',value:160*K},
    ],
  },

  /* ══════════════ GRUP 5: ULTRA (5K–100K) ══════════════ */
  {
    id:'void',      tier:'ultra', tierLabel:'ULTRA',
    name:'Boşluk Kasası', emoji:'🌀', price:5*K,
    glowColor:'rgba(139,92,246,.6)',
    desc:'Hiçliğin içinden gelen güçler.',
    items:[
      {name:'Boşluk Kırığı',  emoji:'🌀', rarity:'common',    value:2000},
      {name:'Karanlık Enerji',emoji:'⬛', rarity:'common',    value:1800},
      {name:'Boyut Geçişi',   emoji:'🚪', rarity:'uncommon',  value:5000},
      {name:'Null Zırh',      emoji:'🛡️', rarity:'uncommon',  value:5800},
      {name:'Void Kılıcı',    emoji:'⚔️', rarity:'rare',      value:14*K},
      {name:'Boşluk Efendisi',emoji:'🌀', rarity:'epic',      value:30*K},
      {name:'Null Tanrısı',   emoji:'⬛', rarity:'legendary', value:70*K},
      {name:'Boyut Bükücü',   emoji:'🌌', rarity:'ancient',   value:160*K},
      {name:'VOID_PRIME',     emoji:'💀', rarity:'contraband',value:400*K},
    ],
  },
  {
    id:'demon',     tier:'ultra', tierLabel:'ULTRA',
    name:'Şeytan Kasası', emoji:'😈', price:7*K,
    glowColor:'rgba(220,38,38,.6)',
    desc:'Cehennemden gelen lanetli eşyalar.',
    items:[
      {name:'Şeytan Tırnağı', emoji:'😈', rarity:'common',    value:2800},
      {name:'Cehennem Taşı',  emoji:'🔴', rarity:'common',    value:2600},
      {name:'Lanet Zinciri',  emoji:'⛓️', rarity:'uncommon',  value:7000},
      {name:'Şeytan Zırhı',   emoji:'🦇', rarity:'uncommon',  value:8000},
      {name:'Cehennem Kılıcı',emoji:'⚔️', rarity:'rare',      value:20*K},
      {name:'Şeytan Efendisi',emoji:'😈', rarity:'epic',      value:45*K},
      {name:'Lucifer Silahı', emoji:'🔥', rarity:'legendary', value:100*K},
      {name:'Şeytan Tanrısı', emoji:'👿', rarity:'ancient',   value:230*K},
      {name:'HELL_PRIME',     emoji:'🌋', rarity:'contraband',value:550*K},
    ],
  },
  {
    id:'angel',     tier:'ultra', tierLabel:'ULTRA',
    name:'Melek Kasası', emoji:'😇', price:8*K,
    glowColor:'rgba(253,224,71,.6)',
    desc:'Cennetten gelen kutsal silahlar.',
    items:[
      {name:'Melek Tüyü',     emoji:'🪶', rarity:'common',    value:3200},
      {name:'Kutsal Kristal', emoji:'💎', rarity:'common',    value:3000},
      {name:'İlahi Zırh',     emoji:'🛡️', rarity:'uncommon',  value:8000},
      {name:'Melek Yayı',     emoji:'🏹', rarity:'uncommon',  value:9200},
      {name:'Kutsal Kılıç',   emoji:'⚔️', rarity:'rare',      value:23*K},
      {name:'Baş Melek Silahı',emoji:'😇',rarity:'epic',      value:52*K},
      {name:'Melek Tanrısı',  emoji:'👼', rarity:'legendary', value:120*K},
      {name:'İlahi Kuvvet',   emoji:'✨', rarity:'ancient',   value:280*K},
      {name:'HEAVEN_PRIME',   emoji:'☁️', rarity:'contraband',value:650*K},
    ],
  },
  {
    id:'cosmic',    tier:'ultra', tierLabel:'ULTRA',
    name:'Kozmik Kasa', emoji:'🌠', price:10*K,
    glowColor:'rgba(124,58,237,.6)',
    desc:'Sonsuz evrenin kozmik güçleri.',
    items:[
      {name:'Kozmik Toz',     emoji:'🌠', rarity:'common',    value:4000},
      {name:'Yıldız Işığı',   emoji:'⭐', rarity:'common',    value:3800},
      {name:'Galaktik Enerji',emoji:'✨', rarity:'uncommon',  value:10*K},
      {name:'Kozmik Kalkan',  emoji:'🛡️', rarity:'uncommon',  value:12*K},
      {name:'Süpernova Kılıcı',emoji:'💥',rarity:'rare',      value:30*K},
      {name:'Kozmik Tanrısı', emoji:'🌌', rarity:'epic',      value:68*K},
      {name:'Evren Hakimi',   emoji:'👑', rarity:'legendary', value:160*K},
      {name:'Kozmik Varlık',  emoji:'🌠', rarity:'ancient',   value:380*K},
      {name:'COSMIC_PRIME',   emoji:'💫', rarity:'contraband',value:900*K},
    ],
  },
  {
    id:'titan',     tier:'ultra', tierLabel:'ULTRA',
    name:'Titan Kasası', emoji:'🗿', price:15*K,
    glowColor:'rgba(180,130,60,.5)',
    desc:'Titan ırklarının efsanevi silahları.',
    items:[
      {name:'Titan Kemiği',   emoji:'🦴', rarity:'common',    value:6000},
      {name:'Dev Zırhı',      emoji:'🥋', rarity:'common',    value:5500},
      {name:'Titan Kalkanı',  emoji:'🛡️', rarity:'uncommon',  value:15*K},
      {name:'Titan Kılıcı',   emoji:'⚔️', rarity:'uncommon',  value:18*K},
      {name:'Dev Topuzu',     emoji:'⚒️', rarity:'rare',      value:45*K},
      {name:'Titan Efendisi', emoji:'🗿', rarity:'epic',      value:100*K},
      {name:'Titan Tanrısı',  emoji:'🏔️', rarity:'legendary', value:240*K},
      {name:'Titan Efendisi', emoji:'👑', rarity:'ancient',   value:560*K},
      {name:'TITAN_PRIME',    emoji:'🗿', rarity:'contraband',value:1_300*K},
    ],
  },

  /* ══════════════ GRUP 6: EFSANE (50K–1M) ══════════════ */
  {
    id:'supernova', tier:'mythic', tierLabel:'MİTİK',
    name:'Süpernova Kasası', emoji:'💥', price:50*K,
    glowColor:'rgba(255,165,0,.6)',
    desc:'Yıldız patlamalarının enerjisi.',
    items:[
      {name:'Nova Kırıntısı', emoji:'💥', rarity:'common',    value:20*K},
      {name:'Yıldız Parçası', emoji:'⭐', rarity:'common',    value:18*K},
      {name:'Nova Zırhı',     emoji:'🛡️', rarity:'uncommon',  value:50*K},
      {name:'Nova Kılıcı',    emoji:'⚔️', rarity:'uncommon',  value:58*K},
      {name:'Süpernova Çekirdeği',emoji:'🔴',rarity:'rare',   value:140*K},
      {name:'Nova Efendisi',  emoji:'💥', rarity:'epic',      value:320*K},
      {name:'Nova Tanrısı',   emoji:'🌟', rarity:'legendary', value:750*K},
      {name:'Yıldız Patlaması',emoji:'💫',rarity:'ancient',   value:1.8*M},
      {name:'NOVA_PRIME',     emoji:'🌠', rarity:'contraband',value:4.5*M},
    ],
  },
  {
    id:'blackhole', tier:'mythic', tierLabel:'MİTİK',
    name:'Kara Delik Kasası', emoji:'🕳️', price:100*K,
    glowColor:'rgba(17,24,39,.9)',
    desc:'Kara deliğin çekim gücü.',
    items:[
      {name:'Kara Delik Çekirdeği',emoji:'🕳️',rarity:'common',value:40*K},
      {name:'Olay Ufku Parçası',emoji:'⬛',rarity:'common',   value:38*K},
      {name:'Hawking Işıması', emoji:'✨', rarity:'uncommon',  value:100*K},
      {name:'Kara Delik Zırhı',emoji:'🛡️',rarity:'uncommon',  value:115*K},
      {name:'Graviton Kılıcı', emoji:'⚔️', rarity:'rare',      value:280*K},
      {name:'Kara Delik Efendisi',emoji:'🕳️',rarity:'epic',   value:650*K},
      {name:'Kara Delik Tanrısı',emoji:'👑',rarity:'legendary',value:1.5*M},
      {name:'Singülarite',    emoji:'🌀', rarity:'ancient',   value:3.5*M},
      {name:'BLACK_HOLE_PRIME',emoji:'💀',rarity:'contraband',value:9*M},
    ],
  },
  {
    id:'universe',  tier:'mythic', tierLabel:'MİTİK',
    name:'Evren Kasası', emoji:'🌍', price:250*K,
    glowColor:'rgba(79,70,229,.7)',
    desc:'Evrenin tüm gücü tek kasada.',
    items:[
      {name:'Evren Tozu',     emoji:'🌍', rarity:'common',    value:100*K},
      {name:'Dünya Parçası',  emoji:'🌎', rarity:'common',    value:95*K},
      {name:'Galaksi Kalıntısı',emoji:'🌌',rarity:'uncommon', value:250*K},
      {name:'Evren Zırhı',    emoji:'🛡️', rarity:'uncommon',  value:290*K},
      {name:'Evren Kılıcı',   emoji:'⚔️', rarity:'rare',      value:700*K},
      {name:'Evren Efendisi', emoji:'🌍', rarity:'epic',      value:1.6*M},
      {name:'Evren Tanrısı',  emoji:'👁️', rarity:'legendary', value:3.8*M},
      {name:'Büyük Patlama',  emoji:'💥', rarity:'ancient',   value:9*M},
      {name:'UNIVERSE_PRIME', emoji:'🌌', rarity:'contraband',value:B/4},
    ],
  },
  {
    id:'god',       tier:'divine', tierLabel:'İLAHİ',
    name:'Tanrı Kasası', emoji:'👁️', price:M,
    glowColor:'rgba(255,215,0,.8)',
    desc:'Tanrıların kullandığı en güçlü silahlar.',
    items:[
      {name:'Tanrı Kıvılcımı',emoji:'✨', rarity:'common',    value:400*K},
      {name:'İlahi Parça',    emoji:'👁️', rarity:'common',    value:380*K},
      {name:'Tanrı Zırhı',    emoji:'🛡️', rarity:'uncommon',  value:M},
      {name:'Tanrı Kılıcı',   emoji:'⚔️', rarity:'uncommon',  value:1.2*M},
      {name:'İlahi Yıldırım', emoji:'⚡', rarity:'rare',      value:3*M},
      {name:'Tanrı Efendisi', emoji:'👁️', rarity:'epic',      value:7*M},
      {name:'İlahi Tanrı',    emoji:'😇', rarity:'legendary', value:17*M},
      {name:'Tanrılar Üstü',  emoji:'🌟', rarity:'ancient',   value:40*M},
      {name:'GOD_PRIME',      emoji:'👑', rarity:'contraband',value:100*M},
    ],
  },
  {
    id:'creator',   tier:'divine', tierLabel:'İLAHİ',
    name:'Yaratıcı Kasası', emoji:'🌟', price:5*M,
    glowColor:'rgba(255,255,255,.6)',
    desc:'Evreni yaratan gücün kasası.',
    items:[
      {name:'Yaratılış Tozu', emoji:'🌟', rarity:'common',    value:2*M},
      {name:'İlk Işık',       emoji:'💡', rarity:'common',    value:1.9*M},
      {name:'Yaratılış Zırhı',emoji:'🛡️', rarity:'uncommon',  value:5*M},
      {name:'Yaratılış Kılıcı',emoji:'⚔️',rarity:'uncommon',  value:6*M},
      {name:'Sonsuz Enerji',  emoji:'♾️', rarity:'rare',      value:15*M},
      {name:'Yaratıcı Efendi',emoji:'🌟', rarity:'epic',      value:35*M},
      {name:'Yaratıcı Tanrı', emoji:'👁️', rarity:'legendary', value:80*M},
      {name:'İlk Neden',      emoji:'🌀', rarity:'ancient',   value:200*M},
      {name:'CREATOR_PRIME',  emoji:'✨', rarity:'contraband',value:500*M},
    ],
  },
  {
    id:'omega',     tier:'divine', tierLabel:'İLAHİ',
    name:'OMEGA Kasası', emoji:'Ω', price:B/10,
    glowColor:'rgba(255,0,255,.7)',
    desc:'Var oluşun son sınırı. En nadir eşyalar burada.',
    items:[
      {name:'Omega Kırıntısı',emoji:'Ω',  rarity:'common',    value:40*M},
      {name:'Son Enerji',     emoji:'💠', rarity:'common',    value:38*M},
      {name:'Omega Zırhı',    emoji:'🛡️', rarity:'uncommon',  value:100*M},
      {name:'Omega Kılıcı',   emoji:'⚔️', rarity:'uncommon',  value:120*M},
      {name:'Omega Patlaması',emoji:'💥', rarity:'rare',      value:300*M},
      {name:'Omega Efendisi', emoji:'Ω',  rarity:'epic',      value:700*M},
      {name:'Omega Tanrısı',  emoji:'👑', rarity:'legendary', value:1.6*B},
      {name:'Var Oluşun Sonu',emoji:'⬛', rarity:'ancient',   value:4*B},
      {name:'OMEGA_PRIME',    emoji:'🌀', rarity:'contraband',value:B*10},
    ],
  },

  /* ══════════════ GRUP 7: ÖZEL ETKİNLİK ══════════════ */
  {
    id:'event',     tier:'event', tierLabel:'ETKİNLİK',
    name:'Efsane Etkinlik Kasası', emoji:'🎉', price:1*K,
    glowColor:'rgba(255,110,247,.5)',
    desc:'Özel etkinliklerin ultra nadir eşyaları!',
    items:[
      {name:'Etkinlik Rozeti',emoji:'🎖️', rarity:'common',    value:400},
      {name:'Özel Bayrak',    emoji:'🚩', rarity:'common',    value:380},
      {name:'Parıltılı Pelerin',emoji:'🦸',rarity:'uncommon', value:1000},
      {name:'Etkinlik Kılıcı',emoji:'⚡', rarity:'uncommon',  value:1200},
      {name:'Efsane Zırh',    emoji:'🛡️', rarity:'rare',      value:3000},
      {name:'Mitolojik Silah',emoji:'🔱', rarity:'epic',      value:7000},
      {name:'Tanrısal Güç',   emoji:'👑', rarity:'legendary', value:16*K},
      {name:'Mitoloji Tanrısı',emoji:'⚗️',rarity:'ancient',  value:38*K},
      {name:'EFSANE_1',       emoji:'🌈', rarity:'contraband',value:100*K},
    ],
  },
  {
    id:'holiday',   tier:'event', tierLabel:'ETKİNLİK',
    name:'Bayram Kasası', emoji:'🎊', price:500,
    glowColor:'rgba(34,197,94,.5)',
    desc:'Bayramlara özel sınırlı koleksiyon.',
    items:[
      {name:'Bayram Şekeri',  emoji:'🍬', rarity:'common',    value:200},
      {name:'Kutlama Fişeği', emoji:'🎆', rarity:'common',    value:220},
      {name:'Bayram Maskesi', emoji:'🎭', rarity:'uncommon',  value:550},
      {name:'Kutsal Bayrak',  emoji:'🏳️', rarity:'uncommon',  value:650},
      {name:'Bayram Kılıcı',  emoji:'⚔️', rarity:'rare',      value:1700},
      {name:'Kutlama Zırhı',  emoji:'🛡️', rarity:'epic',      value:4000},
      {name:'Bayram Ruhu',    emoji:'🎊', rarity:'legendary', value:9500},
      {name:'Kutsal Hediye',  emoji:'🎁', rarity:'ancient',   value:22*K},
      {name:'BAYRAM_PRIME',   emoji:'🌟', rarity:'contraband',value:55*K},
    ],
  },
  {
    id:'season',    tier:'event', tierLabel:'ETKİNLİK',
    name:'Sezon Kasası', emoji:'🏅', price:750,
    glowColor:'rgba(245,158,11,.5)',
    desc:'Sezon sonu özel ödülleri.',
    items:[
      {name:'Sezon Madalyası',emoji:'🏅', rarity:'common',    value:300},
      {name:'Sezon Bandanası',emoji:'🎗️', rarity:'common',    value:280},
      {name:'Sezon Zırhı',    emoji:'🥋', rarity:'uncommon',  value:750},
      {name:'Sezon Kılıcı',   emoji:'⚔️', rarity:'uncommon',  value:880},
      {name:'Şampiyonluk Kasası',emoji:'🏆',rarity:'rare',    value:2300},
      {name:'Sezon Tanrısı',  emoji:'👑', rarity:'epic',      value:5500},
      {name:'Efsane Sezon',   emoji:'🌟', rarity:'legendary', value:13*K},
      {name:'Tüm Sezonlar',   emoji:'♾️', rarity:'ancient',   value:30*K},
      {name:'SEZON_PRIME',    emoji:'🏆', rarity:'contraband',value:75*K},
    ],
  },

  /* ══════════════ GRUP 8: İSİM KASI (özel 50) ══════════════ */
];

/* ── 50 adet daha otomatik oluştur ──────────────────── */
const AUTO_CASES_DEF = [
  {n:'Ateş Çekirdeği',   e:'🔴', p:1.5*K, t:'elite',   gl:'rgba(239,68,68,.5)',   base:600},
  {n:'Fırtına Merkezi',  e:'🌪️',  p:2*K,   t:'elite',   gl:'rgba(100,116,139,.5)', base:800},
  {n:'Şimşek Çakması',   e:'⚡', p:2.5*K, t:'elite',   gl:'rgba(250,204,21,.5)',  base:1000},
  {n:'Buz Sarayı',       e:'🧊', p:3*K,   t:'elite',   gl:'rgba(147,197,253,.5)', base:1200},
  {n:'Orman Efendisi',   e:'🌿', p:3.5*K, t:'elite',   gl:'rgba(34,197,94,.5)',   base:1400},
  {n:'Gece Avı',         e:'🌙', p:4*K,   t:'elite',   gl:'rgba(99,102,241,.5)',  base:1600},
  {n:'Güneş Tapınağı',   e:'☀️', p:4.5*K, t:'legendary',gl:'rgba(250,204,21,.6)', base:1800},
  {n:'Ay Işığı',         e:'🌕', p:5*K,   t:'legendary',gl:'rgba(200,200,255,.5)',base:2000},
  {n:'Yıldız Tozu',      e:'⭐', p:6*K,   t:'legendary',gl:'rgba(255,215,0,.5)',  base:2400},
  {n:'Kristal Mağara',   e:'💎', p:7*K,   t:'legendary',gl:'rgba(34,211,238,.5)', base:2800},
  {n:'Lanet Kasası',     e:'🤬', p:8*K,   t:'legendary',gl:'rgba(220,38,38,.5)',  base:3200},
  {n:'Rüya Alemi',       e:'💭', p:9*K,   t:'legendary',gl:'rgba(168,85,247,.5)', base:3600},
  {n:'Ejder Yumurtası',  e:'🥚', p:10*K,  t:'legendary',gl:'rgba(239,68,68,.5)',  base:4000},
  {n:'Atlantis Hazinesi',e:'🌊', p:12*K,  t:'ultra',    gl:'rgba(6,182,212,.5)',  base:4800},
  {n:'Demir Taht',       e:'👑', p:15*K,  t:'ultra',    gl:'rgba(148,163,184,.5)',base:6000},
  {n:'Altın Şehir',      e:'🏙️', p:18*K,  t:'ultra',    gl:'rgba(245,158,11,.5)', base:7200},
  {n:'Gümüş Dağ',        e:'🏔️', p:22*K,  t:'ultra',    gl:'rgba(200,200,210,.5)',base:8800},
  {n:'Kristal Kule',     e:'🗼', p:28*K,  t:'ultra',    gl:'rgba(34,211,238,.5)', base:11*K},
  {n:'Şeytan Kalesi',    e:'🏰', p:35*K,  t:'ultra',    gl:'rgba(220,38,38,.6)',  base:14*K},
  {n:'Cennet Kapısı',    e:'🚪', p:45*K,  t:'ultra',    gl:'rgba(253,224,71,.5)', base:18*K},
  {n:'Karanlık Boyut',   e:'🌑', p:60*K,  t:'mythic',   gl:'rgba(17,24,39,.8)',   base:24*K},
  {n:'Işık Boyutu',      e:'✨', p:80*K,  t:'mythic',   gl:'rgba(255,255,255,.6)',base:32*K},
  {n:'Ölüm Vadisi',      e:'💀', p:100*K, t:'mythic',   gl:'rgba(220,38,38,.7)',  base:40*K},
  {n:'Yaşam Ağacı',      e:'🌳', p:130*K, t:'mythic',   gl:'rgba(34,197,94,.6)',  base:52*K},
  {n:'Çöküş Kasası',     e:'🌑', p:170*K, t:'mythic',   gl:'rgba(79,70,229,.7)',  base:68*K},
  {n:'Aydınlanma',       e:'💡', p:220*K, t:'mythic',   gl:'rgba(250,204,21,.7)', base:88*K},
  {n:'Son Savaş',        e:'⚔️', p:300*K, t:'mythic',   gl:'rgba(220,38,38,.8)',  base:120*K},
  {n:'Sonsuzluk Kapısı', e:'♾️', p:400*K, t:'divine',   gl:'rgba(255,215,0,.7)',  base:160*K},
  {n:'İlk Işık',         e:'🌅', p:600*K, t:'divine',   gl:'rgba(255,200,0,.8)',  base:240*K},
  {n:'Son Işık',         e:'🌇', p:800*K, t:'divine',   gl:'rgba(255,100,0,.8)',  base:320*K},
  {n:'Mutlak Güç',       e:'💪', p:M,     t:'divine',   gl:'rgba(255,0,0,.8)',    base:400*K},
  {n:'Mutlak Zırh',      e:'🛡️', p:1.5*M, t:'divine',   gl:'rgba(0,0,255,.8)',    base:600*K},
  {n:'Tanrısal Kılıç',   e:'⚔️', p:2*M,   t:'divine',   gl:'rgba(255,215,0,.9)', base:800*K},
  {n:'Tanrısal Zırh',    e:'🛡️', p:3*M,   t:'divine',   gl:'rgba(255,255,0,.9)', base:1.2*M},
  {n:'Evren Sonu',       e:'🌌', p:5*M,   t:'divine',   gl:'rgba(150,0,255,.9)', base:2*M},
  {n:'Yaratılış Anı',    e:'💥', p:8*M,   t:'divine',   gl:'rgba(255,150,0,.9)', base:3.2*M},
  {n:'Sonsuz Güç',       e:'∞',  p:12*M,  t:'divine',   gl:'rgba(255,255,255,1)',base:4.8*M},
  {n:'Ultra Omega',      e:'Ω',  p:20*M,  t:'divine',   gl:'rgba(255,0,255,1)',  base:8*M},
  {n:'Yarı Tanrı',       e:'⚡', p:50*M,  t:'divine',   gl:'rgba(200,0,200,1)',  base:20*M},
  {n:'Tam Tanrı',        e:'👁️', p:100*M, t:'divine',   gl:'rgba(255,215,0,1)',  base:40*M},
  {n:'Ötesi',            e:'🌀', p:200*M, t:'divine',   gl:'rgba(0,255,255,1)',  base:80*M},
  {n:'Sonsuzluktan Öte', e:'♾️', p:500*M, t:'divine',   gl:'rgba(255,255,255,1)',base:200*M},
  {n:'GlitchGrid Prime', e:'🎮', p:B,     t:'divine',   gl:'rgba(124,58,237,1)', base:400*M},
  {n:'Absolute Zero',    e:'🔵', p:2*B,   t:'divine',   gl:'rgba(0,0,255,1)',    base:800*M},
  {n:'Absolute One',     e:'⚪', p:5*B,   t:'divine',   gl:'rgba(255,255,255,1)',base:2*B},
  {n:'Yaratıcının Geri Kalanı',e:'✨',p:B*10,t:'divine',gl:'rgba(255,215,0,1)', base:4*B},
];

/* Emojiyi item olarak çevirir, her nadir için otomatik fiyat */
function makeAutoItems(base) {
  const mult = [1, 1.5, 3, 6, 14, 30, 70, 160, 400];
  const rarities = ['common','common','uncommon','uncommon','rare','epic','legendary','ancient','contraband'];
  const emojis   = ['⚙️','🔧','⚡','💫','✨','💎','👑','🌟','🔱'];
  const names    = [
    'Normal Parça','Temel Eşya','Nadir Eşya','Özel Eşya',
    'Epik Eşya','Süper Epik','Efsanevi Eşya','Antik Eşya','Yasaklı Eşya'
  ];
  return rarities.map((r,i) => ({
    name:   names[i],
    emoji:  emojis[i],
    rarity: r,
    value:  Math.round(base * mult[i]),
  }));
}

const AUTO_CASES = AUTO_CASES_DEF.map((d, i) => ({
  id:        'auto_' + i,
  tier:      d.t,
  tierLabel: d.t === 'divine' ? 'İLAHİ' :
             d.t === 'mythic' ? 'MİTİK'  :
             d.t === 'ultra'  ? 'ULTRA'   :
             d.t === 'legendary' ? 'EFSANEVİ' :
             d.t === 'elite'  ? 'ELİT'   :
             d.t === 'event'  ? 'ETKİNLİK' : 'ÖZEL',
  name:      d.n,
  emoji:     d.e,
  price:     d.p,
  glowColor: d.gl,
  desc:      d.n + ' — özel koleksiyon.',
  items:     makeAutoItems(d.base),
}));

/* ══════════════════════════════════════════════════
   ADMIN ÖZEL KASALARI (localStorage)
══════════════════════════════════════════════════ */
function getAdminCases() {
  try {
    return JSON.parse(localStorage.getItem('gz_admin_cases') || '[]');
  } catch { return []; }
}

/* Tüm kasalar = statik + otomatik + admin özel */
const CASES = [...STATIC_CASES, ...AUTO_CASES, ...getAdminCases()];

/* ══════════════════════════════════════════════════
   ROULETTE YARDIMCILARI
══════════════════════════════════════════════════ */
const RARITY_WEIGHTS = {
  common:40, uncommon:25, rare:15, epic:10, legendary:5, ancient:2, contraband:0.7
};

function rollItem(caseData) {
  const items = caseData.items || [];
  const total = items.reduce((s, item) => s + (RARITY_WEIGHTS[item.rarity] || 1), 0);
  let r = Math.random() * total;
  for (const item of items) {
    r -= (RARITY_WEIGHTS[item.rarity] || 1);
    if (r <= 0) return item;
  }
  return items[0];
}

function getRandomItem(caseData) {
  const items = caseData.items || [];
  return items[Math.floor(Math.random() * items.length)];
}


/* ===== cases.js ===== */
/* =====================================================
   CASES.JS — Case Opening Ana Motor
===================================================== */
if (!GZ.requireAuth()) throw '';
GZ.renderNavbar('cases');

const ME = GZ.currentUser();

/* ─── Aktif durum ─── */
let activeCaseData = null;
let pendingItems   = [];
let singlePending  = null;
let isSpinning     = false;
let currentCategory = 'all';

/* ─────────────────────────────────────────
   PANEL & SİDEBAR YÖNETİMİ
───────────────────────────────────────── */
function switchPanel(id) {
  document.querySelectorAll('.cases-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar-nav-btn').forEach(b => b.classList.remove('active'));
  const panel = document.getElementById('panel-' + id);
  const btn   = document.getElementById('snb-' + id);
  if (panel) panel.classList.add('active');
  if (btn)   btn.classList.add('active');

  if (id === 'open')        { showCaseList(); }
  if (id === 'inventory')   { renderInventory(); }
  if (id === 'rebirth')     { renderRebirthPanel(); }
  if (id === 'wheel')       { setTimeout(()=>{ if(typeof renderWheelInv==='function'){renderWheelInv();drawWheel();updateWheelUI();}}, 50); }
  if (id === 'leaderboard') { setTimeout(()=>{ if(typeof renderLeaderboard==='function') renderLeaderboard(); }, 50); }
  if (id === 'battle')      { setTimeout(()=>{ if(typeof initBattleSetup==='function') initBattleSetup(); refreshBattleLobbies(); }, 50); }
}

function filterCategory(cat) {
  currentCategory = cat;
  switchPanel('open');
  document.querySelectorAll('[id^="snb-"]').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById('snb-' + cat);
  if (btn) btn.classList.add('active');
  document.getElementById('snb-open').classList.add('active');
}

/* ─────────────────────────────────────────
   KASA LİSTESİ
───────────────────────────────────────── */
const CATEGORIES = [
  { key:'basic',     label:'Temel Kasalar',     icon:'📦' },
  { key:'premium',   label:'Premium Kasalar',   icon:'⭐' },
  { key:'elite',     label:'Elit Kasalar',       icon:'💎' },
  { key:'legendary', label:'Efsanevi Kasalar',   icon:'🐉' },
  { key:'special',   label:'Özel Kasalar',       icon:'✨' },
  { key:'event',     label:'Etkinlik Kasaları',  icon:'🎉' },
];

function buildCaseList() {
  const wrap = document.getElementById('cases-categories-wrap');
  wrap.innerHTML = '';

  // badge güncelle
  const totalEl = document.getElementById('badge-all');
  if (totalEl) totalEl.textContent = CASES.length;

  const filtered = currentCategory === 'all'
    ? CASES
    : CASES.filter(c => c.tier === currentCategory);

  if (currentCategory === 'all') {
    CATEGORIES.forEach(cat => {
      const list = CASES.filter(c => c.tier === cat.key);
      if (!list.length) return;
      wrap.innerHTML += `<div class="cases-category-title">${cat.icon} ${cat.label}</div>`;
      const grid = document.createElement('div');
      grid.className = 'cases-grid';
      list.forEach(c => grid.appendChild(makeCaseCard(c)));
      wrap.appendChild(grid);
    });
  } else {
    const catInfo = CATEGORIES.find(c => c.key === currentCategory);
    if (catInfo) wrap.innerHTML += `<div class="cases-category-title">${catInfo.icon} ${catInfo.label}</div>`;
    const grid = document.createElement('div');
    grid.className = 'cases-grid';
    filtered.forEach(c => grid.appendChild(makeCaseCard(c)));
    wrap.appendChild(grid);
  }
}

function makeCaseCard(c) {
  const card = document.createElement('div');
  card.className = 'case-card';

  /* glowColor güvenli şekilde işle */
  const glow = c.glowColor || 'rgba(124,58,237,.4)';
  card.style.setProperty('--card-glow', glow);
  try {
    card.style.borderColor = glow.replace(/[\d.]+\)$/, '0.45)');
  } catch(e) {
    card.style.borderColor = glow;
  }

  /* onclick: her tıklamada çalışır, zamana bağlı değil */
  card.addEventListener('click', function() { selectCase(c); });

  /* Rebirth çarpanı — fonksiyon henüz tanımlı olmayabilir, güvenli fallback */
  const mult = (typeof getRebirthMultiplier === 'function') ? getRebirthMultiplier() : 1;

  card.innerHTML = `
    <span class="case-card-tier tier-${c.tier}">${c.tierLabel || ''}</span>
    <span class="case-card-emoji">${c.emoji || '📦'}</span>
    <div class="case-card-name">${c.name || ''}</div>
    <div class="case-card-price">${(c.price||0).toLocaleString('tr-TR')} 🪙</div>
    <div class="case-card-items">${(c.items||[]).length} eşya</div>
  `;
  return card;
}

/* ─────────────────────────────────────────
   KASA SEÇ / AÇ
───────────────────────────────────────── */
function selectCase(c) {
  activeCaseData = c;
  isSpinning     = false;
  pendingItems   = [];
  singlePending  = null;

  document.getElementById('view-caselist').classList.add('hidden');
  document.getElementById('view-opencase').classList.remove('hidden');
  document.getElementById('won-overlay').classList.add('hidden');
  document.getElementById('multi-results').classList.add('hidden');

  document.getElementById('open-icon').textContent  = c.emoji;
  document.getElementById('open-name').textContent  = c.name;
  document.getElementById('open-price').textContent = `Fiyat: ${c.price.toLocaleString('tr-TR')} 🪙`;
  document.getElementById('open-desc').textContent  = c.desc;
  document.getElementById('open-x3-btn').textContent = `3x Aç (${(c.price*3).toLocaleString('tr-TR')} 🪙)`;

  updateBalanceDisplay();
  buildContentsPreview(c);
  buildRoulette(null);
}

function showCaseList() {
  document.getElementById('view-caselist').classList.remove('hidden');
  document.getElementById('view-opencase').classList.add('hidden');
  document.getElementById('won-overlay').classList.add('hidden');
  document.getElementById('multi-results').classList.add('hidden');
  buildCaseList();
}

/* ─────────────────────────────────────────
   İÇERİK ÖNİZLEME
───────────────────────────────────────── */
function buildContentsPreview(c) {
  const wrap = document.getElementById('contents-preview');
  wrap.innerHTML = '';
  c.items.forEach(item => {
    const el = document.createElement('div');
    el.className = 'prev-item';
    el.style.borderColor = RARITY[item.rarity]?.color || '#444';
    el.innerHTML = `
      <span>${item.emoji}</span>
      <span class="r-${item.rarity}">${RARITY[item.rarity]?.label}</span>
      <span>${item.name}</span>
      <span class="gold-text">${item.value.toLocaleString()}🪙</span>
    `;
    wrap.appendChild(el);
  });
}

/* ─────────────────────────────────────────
   ROULETTE
───────────────────────────────────────── */
const ITEM_W  = 110;
const WIN_POS = 46;

function buildRoulette(winnerItem) {
  const track = document.getElementById('roulette-track');
  track.style.transition = 'none';
  track.style.transform  = 'translateX(0)';
  track.innerHTML = '';
  for (let i = 0; i < 60; i++) {
    const item = (i === WIN_POS && winnerItem) ? winnerItem : getRandomItem(activeCaseData);
    const el   = document.createElement('div');
    el.className = `r-item rb-${item.rarity}`;
    el.style.background = hexToRgba(RARITY[item.rarity]?.color || '#444', 0.08);
    el.innerHTML = `<span class="r-item-emoji">${item.emoji}</span><span class="r-item-name">${item.name}</span>`;
    track.appendChild(el);
  }
}

function spinRoulette(winner) {
  return new Promise(resolve => {
    const isMob   = window.innerWidth <= 600;
    const itemW   = isMob ? 92 : ITEM_W;
    const track   = document.getElementById('roulette-track');
    const outerW  = track.parentElement.offsetWidth;
    const center  = WIN_POS * itemW + itemW / 2 - outerW / 2;
    const jitter  = (Math.random() - .5) * 35;
    setTimeout(() => {
      track.style.transition = 'transform 4.5s cubic-bezier(0.12,0.8,0.25,1.0)';
      track.style.transform  = `translateX(-${center + jitter}px)`;
      setTimeout(resolve, 4700);
    }, 50);
  });
}

/* ─────────────────────────────────────────
   AÇMA
───────────────────────────────────────── */
async function triggerOpen() {
  if (isSpinning || !activeCaseData) return;
  if (!GZ.spendBalance(activeCaseData.price)) { gz_toast('Yetersiz bakiye!', 'error'); return; }

  document.getElementById('won-overlay').classList.add('hidden');
  document.getElementById('multi-results').classList.add('hidden');
  setOpenBtns(true);

  const winner  = rollItem(activeCaseData);
  singlePending = applyRebirthMultiplier(winner);
  buildRoulette(winner);
  isSpinning = true;
  await spinRoulette(winner);
  isSpinning = false;

  showWonOverlay(singlePending);
  setOpenBtns(false);
  updateBalanceDisplay();
  GZ.addXP(10 + Math.round(winner.value / 100));
}

async function triggerOpenMulti(count) {
  if (isSpinning || !activeCaseData) return;
  const total = activeCaseData.price * count;
  if (!GZ.spendBalance(total)) { gz_toast(`${total.toLocaleString()} 🪙 gerekli.`, 'error'); return; }

  document.getElementById('won-overlay').classList.add('hidden');
  document.getElementById('multi-results').classList.add('hidden');
  setOpenBtns(true);
  pendingItems = [];
  for (let i = 0; i < count; i++) pendingItems.push(applyRebirthMultiplier(rollItem(activeCaseData)));

  buildRoulette(pendingItems[pendingItems.length - 1]);
  isSpinning = true;
  await spinRoulette(pendingItems[pendingItems.length - 1]);
  isSpinning = false;

  showMultiResults(pendingItems);
  setOpenBtns(false);
  updateBalanceDisplay();
  pendingItems.forEach(it => GZ.addXP(10 + Math.round(it.value / 100)));
}

/* ─────────────────────────────────────────
   WON OVERLAY
───────────────────────────────────────── */
function showWonOverlay(item) {
  const r = RARITY[item.rarity];
  document.getElementById('won-emoji').textContent    = item.emoji;
  document.getElementById('won-rarity-text').textContent = r?.label || item.rarity;
  document.getElementById('won-rarity-text').style.color  = r?.color || '#fff';
  document.getElementById('won-item-name').textContent    = item.name;
  document.getElementById('won-item-value').textContent   = `${item.value.toLocaleString()} 🪙`;
  document.getElementById('won-label').textContent =
    item.rarity === 'contraband' ? '🌈 YASAKLI!' :
    item.rarity === 'ancient'    ? '🔥 ANTİK!'   :
    item.rarity === 'legendary'  ? '⭐ EFSANEVİ!' : 'TEBRİKLER!';
  const card = document.getElementById('won-card');
  card.style.borderColor = r?.color || '#fff';
  card.style.boxShadow   = `0 0 50px ${hexToRgba(r?.color||'#fff', .35)}`;
  card.classList.remove('pop-in'); void card.offsetWidth; card.classList.add('pop-in');
  document.getElementById('won-overlay').classList.remove('hidden');
  if (['legendary','ancient','contraband'].includes(item.rarity)) gz_confetti();
}

function closeWon()  { document.getElementById('won-overlay').classList.add('hidden'); singlePending = null; }
function keepWon()   { if (!singlePending) return; GZ.addToInventory(singlePending); gz_toast(`${singlePending.name} eklendi!`,'success'); singlePending=null; document.getElementById('won-overlay').classList.add('hidden'); }
function sellWon()   {
  if (!singlePending) return;
  const val = singlePending.value;
  GZ.addBalance(val);
  recordEarned(val);
  gz_toast(`${singlePending.name} ${val.toLocaleString()} 🪙'ye satıldı!`,'gold');
  singlePending=null; document.getElementById('won-overlay').classList.add('hidden'); updateBalanceDisplay();
}

/* ─────────────────────────────────────────
   ÇOKLU SONUÇLAR
───────────────────────────────────────── */
function showMultiResults(items) {
  const grid = document.getElementById('multi-grid');
  grid.innerHTML = '';
  items.forEach(item => {
    const r = RARITY[item.rarity];
    const el = document.createElement('div');
    el.className = 'multi-item';
    el.style.borderColor = r?.color||'#444';
    el.innerHTML = `
      <span class="multi-item-emoji">${item.emoji}</span>
      <div class="multi-item-rarity" style="color:${r?.color}">${r?.label}</div>
      <div class="multi-item-name">${item.name}</div>
      <div class="multi-item-val">${item.value.toLocaleString()} 🪙</div>
    `;
    grid.appendChild(el);
  });
  document.getElementById('multi-results').classList.remove('hidden');
}

function keepAll()  { pendingItems.forEach(it => GZ.addToInventory(it)); gz_toast(`${pendingItems.length} eşya eklendi!`,'success'); pendingItems=[]; document.getElementById('multi-results').classList.add('hidden'); }
function sellAll()  {
  const total = pendingItems.reduce((s,i)=>s+i.value,0);
  GZ.addBalance(total); recordEarned(total);
  gz_toast(`Toplam ${total.toLocaleString()} 🪙!`,'gold');
  pendingItems=[]; document.getElementById('multi-results').classList.add('hidden'); updateBalanceDisplay();
}
function closeMulti(){ pendingItems=[]; document.getElementById('multi-results').classList.add('hidden'); }

/* ─────────────────────────────────────────
   ENVANTER
───────────────────────────────────────── */
function renderInventory() {
  const sort = document.getElementById('inv-sort')?.value||'newest';
  const rarityOrder = {contraband:0,ancient:1,legendary:2,epic:3,rare:4,uncommon:5,common:6};
  let inv = GZ.getInventory().slice();
  if      (sort==='newest')     inv.reverse();
  else if (sort==='value-desc') inv.sort((a,b)=>b.value-a.value);
  else if (sort==='value-asc')  inv.sort((a,b)=>a.value-b.value);
  else if (sort==='rarity')     inv.sort((a,b)=>(rarityOrder[a.rarity]||9)-(rarityOrder[b.rarity]||9));

  const grid = document.getElementById('inventory-grid');
  grid.innerHTML = '';
  if (!inv.length) { grid.innerHTML='<p class="empty-inv-msg">Henüz eşyan yok. Case aç!</p>'; renderInvStats([]); return; }

  inv.forEach(item => {
    const r  = RARITY[item.rarity];
    const el = document.createElement('div');
    el.className = 'inv-item';
    el.style.borderColor = r?.color||'#444';
    el.innerHTML = `
      <span class="inv-item-emoji">${item.emoji}</span>
      <span class="inv-item-rarity" style="color:${r?.color}">${r?.label}</span>
      <span class="inv-item-name">${item.name}</span>
      <span class="inv-item-val">${item.value.toLocaleString()} 🪙</span>
      <button class="inv-sell-btn" onclick="sellInventoryItem('${item.uid}')">SAT</button>
    `;
    grid.appendChild(el);
  });
  renderInvStats(inv);
}

function renderInvStats(inv) {
  const total = inv.reduce((s,i)=>s+i.value,0);
  const leg   = inv.filter(i=>['legendary','ancient','contraband'].includes(i.rarity)).length;
  const el = document.getElementById('inv-stats');
  if (el) el.innerHTML = `
    <div class="inv-stat-pill">Toplam: <b>${inv.length}</b></div>
    <div class="inv-stat-pill">Değer: <b>${total.toLocaleString()} 🪙</b></div>
    <div class="inv-stat-pill">Nadir+: <b>${leg}</b></div>
  `;
}

function sellInventoryItem(uid) {
  const item = GZ.removeFromInventory(uid);
  if (!item) return;
  GZ.addBalance(item.value); recordEarned(item.value);
  gz_toast(`${item.name} ${item.value.toLocaleString()} 🪙!`,'gold');
  updateBalanceDisplay(); renderInventory();
}

function sellAllInventory() {
  const inv = GZ.getInventory();
  if (!inv.length) { gz_toast('Envanter boş!','info'); return; }
  const total = inv.reduce((s,i)=>s+i.value,0);
  if (!confirm(`${inv.length} eşyayı ${total.toLocaleString()} 🪙'ye sat?`)) return;
  const u = GZ.currentUser();
  u.inventory=[]; u.balance=(u.balance||0)+total;
  u.stats=u.stats||{}; u.stats.totalEarned=(u.stats.totalEarned||0)+total;
  GZ.saveCurrentUser(u); GZ.refreshBalanceUI();
  gz_toast(`Tümü ${total.toLocaleString()} 🪙!`,'gold'); renderInventory();
}

/* ─────────────────────────────────────────
   YARDIMCI
───────────────────────────────────────── */
function setOpenBtns(disabled) {
  document.getElementById('open-btn').disabled    = disabled;
  document.getElementById('open-x3-btn').disabled = disabled;
}
function updateBalanceDisplay() {
  const el = document.getElementById('open-bal');
  if (el) el.textContent = GZ.getBalance().toLocaleString('tr-TR');
  GZ.refreshBalanceUI();
  updateSidebarRebirth();
}
function recordEarned(val) {
  const u = GZ.currentUser(); if (!u) return;
  u.stats=u.stats||{}; u.stats.totalEarned=(u.stats.totalEarned||0)+val;
  GZ.saveCurrentUser(u);
}
function hexToRgba(hex, alpha) {
  if (!hex||!hex.startsWith('#')) return `rgba(124,58,237,${alpha})`;
  return `rgba(${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)},${alpha})`;
}

/* Rebirth çarpanı */
function getRebirthMultiplier() {
  const u = GZ.currentUser();
  const rb = u?.rebirth || 0;
  if (rb === 0) return 1;
  if (rb === 1) return 1.25;
  if (rb === 2) return 1.50;
  if (rb === 3) return 2.00;
  if (rb === 4) return 2.50;
  if (rb >= 5)  return 3.00 + (rb - 5) * 0.5;
  return 1;
}

function applyRebirthMultiplier(item) {
  const mult = getRebirthMultiplier();
  if (mult === 1) return item;
  return { ...item, value: Math.round(item.value * mult) };
}

function updateSidebarRebirth() {
  const u = GZ.currentUser();
  const rb = u?.rebirth || 0;
  const mult = getRebirthMultiplier();
  const el1 = document.getElementById('sb-rebirth-count');
  const el2 = document.getElementById('sb-rebirth-mult');
  if (el1) el1.textContent = rb;
  if (el2) el2.textContent = `Çarpan: x${mult.toFixed(2)}`;
}

/* ─── BAŞLAT ─── */
buildCaseList();
updateBalanceDisplay();


/* ===== battle.js ===== */
/* =====================================================
   BATTLE.JS — Online Kasa Savaşı
   - Herkes aynı kasayı açar
   - Kaç kasa açılacağı seçilir
   - Roulette animasyonu her tur
   - Bakiyeden para düşer
   - En yüksek toplam değer kazanır
===================================================== */

const BATTLE_STORAGE = 'gz_battle_lobbies';

/* ── Battle Lobi Yönetimi (localStorage) ── */
function getBattleLobbies() { return JSON.parse(localStorage.getItem(BATTLE_STORAGE)||'{}'); }
function saveBattleLobbies(d) { localStorage.setItem(BATTLE_STORAGE, JSON.stringify(d)); }

function createBattleLobbyEntry(config) {
  const lobbies = getBattleLobbies();
  const id = 'BL' + Date.now();
  lobbies[id] = {
    id, name: config.name, password: config.password || '',
    host: config.host, caseId: config.caseId,
    count: config.count,   // kaç kasa
    players: [config.host],
    status: 'waiting',     // waiting | fighting | done
    results: {},           // {username: [item, item, ...]}
    createdAt: Date.now(),
  };
  saveBattleLobbies(lobbies);
  return id;
}
function getBattleLobby(id) { return getBattleLobbies()[id] || null; }
function saveBattleLobby(id, data) {
  const lobbies = getBattleLobbies();
  lobbies[id] = data; saveBattleLobbies(lobbies);
}
function deleteBattleLobby(id) {
  const lobbies = getBattleLobbies();
  delete lobbies[id]; saveBattleLobbies(lobbies);
}

/* ── State ── */
let activeBattleLobbyId = null;
let battlePollTimer     = null;
let battleCaseCount     = 1;
let battleSelectedCase  = null;
let battleRunning       = false;
let lastBattleLobby     = null;  // rövanş için

const ME_B = GZ.currentUser();

/* ══════════════════════════════════════════════════
   SETUP EKRANI
══════════════════════════════════════════════════ */
function initBattleSetup() {
  // Kasa seçim dropdown'ını doldur
  const sel = document.getElementById('battle-case-select');
  if (!sel) return;
  sel.innerHTML = '<option value="">-- Kasa seçin --</option>';
  CASES.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = `${c.emoji} ${c.name} — ${c.price.toLocaleString('tr-TR')} 🪙`;
    sel.appendChild(opt);
  });

  // Count butonları
  document.querySelectorAll('#battle-count-opts .opt-btn').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('#battle-count-opts .opt-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      battleCaseCount = parseInt(b.dataset.val);
      updateBattleCostInfo();
    });
  });

  refreshBattleLobbies();
}

function updateBattlePreview() {
  const sel = document.getElementById('battle-case-select');
  const caseId = sel?.value;
  const preview = document.getElementById('battle-case-preview');
  const costInfo = document.getElementById('battle-cost-info');

  if (!caseId) {
    if (preview) preview.style.display = 'none';
    if (costInfo) costInfo.style.display = 'none';
    battleSelectedCase = null;
    return;
  }
  battleSelectedCase = CASES.find(c => c.id === caseId) || null;
  if (!battleSelectedCase) return;

  document.getElementById('bcp-emoji').textContent = battleSelectedCase.emoji;
  document.getElementById('bcp-name').textContent  = battleSelectedCase.name;
  document.getElementById('bcp-price').textContent = battleSelectedCase.price.toLocaleString('tr-TR') + ' 🪙';
  preview.style.display = 'flex';
  costInfo.style.display = 'flex';
  updateBattleCostInfo();
}

function updateBattleCostInfo() {
  if (!battleSelectedCase) return;
  const total = battleSelectedCase.price * battleCaseCount;
  const el = document.getElementById('battle-total-cost');
  if (el) el.textContent = total.toLocaleString('tr-TR') + ' 🪙';
}

function refreshBattleLobbies() {
  const container = document.getElementById('battle-lobby-list');
  if (!container) return;
  const lobbies = getBattleLobbies();
  const list    = Object.values(lobbies).filter(l => l.status === 'waiting');
  container.innerHTML = '';
  if (!list.length) {
    container.innerHTML = '<p class="no-lobbies-msg">Henüz lobi yok.</p>'; return;
  }
  list.forEach(l => {
    const c = CASES.find(x => x.id === l.caseId);
    const locked = !!l.password;
    const row = document.createElement('div');
    row.className = 'lobby-row';
    row.innerHTML = `
      <div class="lobby-row-info">
        <div class="lobby-row-name">
          ${locked?'<i class="fa-solid fa-lock lobby-lock-icon"></i>':''}
          ${escHtml(l.name||'Kasa Savaşı')}
        </div>
        <div class="lobby-row-sub">
          ${c?c.emoji+' '+c.name:'?'} — ${l.count}x kasa &bull; Host: ${escHtml(l.host)}
        </div>
      </div>
      <div class="lobby-row-actions">
        <span class="player-count-badge">${l.players.length}/2</span>
        ${l.players.length>=2
          ? '<span class="lobby-full-badge">DOLU</span>'
          : `<button class="btn btn-primary btn-sm" onclick="joinBattleLobbyById('${l.id}',${locked})">Katıl</button>`}
      </div>`;
    container.appendChild(row);
  });
}

function createBattleLobby() {
  if (!battleSelectedCase) { gz_toast('Önce bir kasa seçin!','error'); return; }
  const total = battleSelectedCase.price * battleCaseCount;
  if (GZ.getBalance() < total) {
    gz_toast(`Bu savaş için ${total.toLocaleString('tr-TR')} 🪙 gerekli!`,'error'); return;
  }
  const name = document.getElementById('battle-lobby-name').value.trim() || ME_B.username + "'in Savaşı";
  const pass = document.getElementById('battle-lobby-pass').value;
  const id   = createBattleLobbyEntry({
    name, password: pass, host: ME_B.username,
    caseId: battleSelectedCase.id, count: battleCaseCount,
  });
  activeBattleLobbyId = id;
  lastBattleLobby = { caseId: battleSelectedCase.id, count: battleCaseCount };
  showBattleWaiting(id);
}

function joinBattleLobbyById(id, locked) {
  if (locked) {
    const pass = prompt('Lobi şifresi:');
    if (pass === null) return;
    if (getBattleLobby(id)?.password !== pass) { gz_toast('Şifre yanlış!','error'); return; }
  }
  doJoinBattleLobby(id);
}

function doJoinBattleLobby(id) {
  const lobby = getBattleLobby(id);
  if (!lobby) { gz_toast('Lobi bulunamadı.','error'); return; }
  if (lobby.status !== 'waiting') { gz_toast('Savaş başlamış!','error'); return; }
  if (lobby.players.length >= 2) { gz_toast('Lobi dolu!','error'); return; }
  if (lobby.players.includes(ME_B.username)) { gz_toast('Zaten lobidesin.','info'); return; }

  // Ücret kontrolü
  const c = CASES.find(x => x.id === lobby.caseId);
  if (!c) { gz_toast('Kasa bulunamadı!','error'); return; }
  const total = c.price * lobby.count;
  if (GZ.getBalance() < total) {
    gz_toast(`Bu savaş için ${total.toLocaleString('tr-TR')} 🪙 gerekli!`,'error'); return;
  }

  lobby.players.push(ME_B.username);
  saveBattleLobby(id, lobby);
  activeBattleLobbyId = id;
  lastBattleLobby = { caseId: lobby.caseId, count: lobby.count };
  showBattleWaiting(id);
}

/* ══════════════════════════════════════════════════
   BEKLEME ODASI
══════════════════════════════════════════════════ */
function showBattleWaiting(id) {
  document.getElementById('battle-screen-setup').classList.add('hidden');
  document.getElementById('battle-screen-waiting').classList.remove('hidden');
  document.getElementById('battle-screen-fight').classList.add('hidden');
  renderBattleWaiting(id);
  startBattlePoll(id);
}

function renderBattleWaiting(id) {
  const lobby = getBattleLobby(id);
  if (!lobby) return;
  const c = CASES.find(x => x.id === lobby.caseId);
  const total = c ? c.price * lobby.count : 0;

  document.getElementById('bw-title').textContent    = lobby.name || 'Kasa Savaşı';
  document.getElementById('bw-share-id').textContent = id;
  document.getElementById('bw-info').textContent     =
    `${c?c.emoji+' '+c.name:'?'} — ${lobby.count}x kasa — Maliyet: ${total.toLocaleString('tr-TR')} 🪙`;

  // Oyuncular
  const pWrap = document.getElementById('bw-players');
  pWrap.innerHTML = '';
  [0,1].forEach(i => {
    const p = lobby.players[i];
    const d = document.createElement('div');
    d.className = 'wait-player-slot';
    d.innerHTML = `
      <div class="wait-avatar ${p?'filled':''}"
           style="${p?'background:linear-gradient(135deg,'+(i===0?'#1d4ed8,#3b82f6':'#b91c1c,#ef4444')+')':''}">
        ${p?p.slice(0,2).toUpperCase():'?'}
      </div>
      <div class="wait-name">${p||'Bekleniyor...'}</div>
      ${lobby.host===p?'<div class="wait-badge host-badge">HOST</div>':''}
    `;
    pWrap.appendChild(d);
  });

  // Detaylar
  document.getElementById('bw-details').innerHTML = `
    <div class="winfo-item"><span>Kasa</span><b>${c?c.emoji+' '+c.name:'?'}</b></div>
    <div class="winfo-item"><span>Adet</span><b>${lobby.count}x</b></div>
    <div class="winfo-item"><span>Toplam</span><b style="color:var(--gold)">${total.toLocaleString('tr-TR')} 🪙</b></div>
    <div class="winfo-item"><span>Şifre</span><b>${lobby.password?'🔒 Evet':'🔓 Hayır'}</b></div>
  `;

  // Start butonu
  const canStart = lobby.players.length === 2 && lobby.host === ME_B.username;
  const btn = document.getElementById('battle-start-btn');
  if (btn) {
    btn.disabled = !canStart;
    document.getElementById('battle-start-hint').textContent =
      canStart ? '' : lobby.host === ME_B.username ? '(Rakip bekleniyor)' : '(Host başlatacak)';
  }
}

function copyBattleLobbyId() {
  const id = document.getElementById('bw-share-id').textContent;
  navigator.clipboard?.writeText(id).then(()=>gz_toast('Kopyalandı!','success')).catch(()=>gz_toast('ID: '+id,'info'));
}

function startBattlePoll(id) {
  clearInterval(battlePollTimer);
  battlePollTimer = setInterval(() => {
    const lobby = getBattleLobby(id);
    if (!lobby) { clearInterval(battlePollTimer); backToBattleSetup(); return; }
    renderBattleWaiting(id);
    if (lobby.status === 'fighting' && lobby.host !== ME_B.username) {
      clearInterval(battlePollTimer);
      runBattleAsClient(id);
    }
    if (lobby.status === 'done') {
      clearInterval(battlePollTimer);
    }
  }, 1200);
}

function leaveBattleLobby() {
  clearInterval(battlePollTimer);
  if (activeBattleLobbyId) {
    const lobby = getBattleLobby(activeBattleLobbyId);
    if (lobby) {
      lobby.players = lobby.players.filter(p => p !== ME_B.username);
      if (lobby.players.length === 0) deleteBattleLobby(activeBattleLobbyId);
      else { lobby.host = lobby.players[0]; saveBattleLobby(activeBattleLobbyId, lobby); }
    }
  }
  activeBattleLobbyId = null;
  backToBattleSetup();
}

function startBattleFromLobby() {
  const lobby = getBattleLobby(activeBattleLobbyId);
  if (!lobby || lobby.players.length < 2) { gz_toast('Rakip gerekli!','error'); return; }
  lobby.status = 'fighting';
  saveBattleLobby(activeBattleLobbyId, lobby);
  clearInterval(battlePollTimer);
  runBattle(activeBattleLobbyId);
}

/* ══════════════════════════════════════════════════
   SAVAŞ ANİMASYONU
══════════════════════════════════════════════════ */
const ITEM_W_B  = 108;
const WIN_POS_B = 46;

async function runBattle(id) {
  const lobby = getBattleLobby(id);
  if (!lobby) return;
  const caseData = CASES.find(x => x.id === lobby.caseId);
  if (!caseData) return;

  // Her iki oyuncudan da ücret düş
  const total = caseData.price * lobby.count;
  if (!GZ.spendBalance(total)) {
    gz_toast('Yetersiz bakiye!','error'); backToBattleSetup(); return;
  }

  showBattleFightScreen(lobby, caseData);

  const p1 = lobby.players[0];
  const p2 = lobby.players[1];
  const p1Items = [], p2Items = [];
  let p1Total = 0, p2Total = 0;

  for (let round = 0; round < lobby.count; round++) {
    // Tur göstergesi
    document.getElementById('ba-round').textContent = `Tur ${round+1} / ${lobby.count}`;

    // Her iki oyuncu için eşya çek
    const item1 = applyRebirthMultiplier(rollItem(caseData));
    const item2 = applyRebirthMultiplier(rollItem(caseData));
    p1Items.push(item1); p2Items.push(item2);

    // Çift roulette animasyonu
    await runDualRoulette(caseData, item1, item2, p1, p2, round);

    p1Total += item1.value;
    p2Total += item2.value;

    // Skor güncelle
    updateBattleScoreBoard(p1, p2, p1Items, p2Items, p1Total, p2Total);

    if (round < lobby.count - 1) {
      document.getElementById('ba-status').textContent = 'Sonraki tura geçiliyor...';
      await sleep(1200);
    }
  }

  // Sonuçları kaydet
  lobby.results = { [p1]: p1Items, [p2]: p2Items };
  lobby.totals  = { [p1]: p1Total, [p2]: p2Total };
  lobby.status  = 'done';
  lobby.winner  = p1Total >= p2Total ? p1 : p2;
  saveBattleLobby(id, lobby);

  await sleep(800);
  showBattleResult(lobby, caseData, p1Total, p2Total, p1Items, p2Items);
}

/* Client tarafı (rakip) — sonuçları bekle */
async function runBattleAsClient(id) {
  const lobby = getBattleLobby(id);
  if (!lobby) return;
  const caseData = CASES.find(x => x.id === lobby.caseId);
  if (!caseData) return;

  const total = caseData.price * lobby.count;
  if (!GZ.spendBalance(total)) { gz_toast('Yetersiz bakiye!','error'); backToBattleSetup(); return; }

  showBattleFightScreen(lobby, caseData);
  document.getElementById('ba-status').textContent = 'Savaş başladı! Sonuçlar yükleniyor...';

  // Host'un sonuçlarını bekle (poll)
  await waitForBattleResults(id);
}

async function waitForBattleResults(id) {
  for (let i=0; i<60; i++) {
    await sleep(1000);
    const lobby = getBattleLobby(id);
    if (lobby?.status === 'done' && lobby.results) {
      // Animasyonu oynat
      const caseData = CASES.find(x => x.id === lobby.caseId);
      const p1 = lobby.players[0], p2 = lobby.players[1];
      const p1Items = lobby.results[p1]||[], p2Items = lobby.results[p2]||[];

      for (let r=0; r<lobby.count; r++) {
        document.getElementById('ba-round').textContent = `Tur ${r+1} / ${lobby.count}`;
        await runDualRoulette(caseData, p1Items[r], p2Items[r], p1, p2, r);
        updateBattleScoreBoard(p1,p2,p1Items.slice(0,r+1),p2Items.slice(0,r+1),
          p1Items.slice(0,r+1).reduce((s,x)=>s+x.value,0),
          p2Items.slice(0,r+1).reduce((s,x)=>s+x.value,0));
        if (r < lobby.count-1) await sleep(1000);
      }
      showBattleResult(lobby, caseData,
        lobby.totals[p1]||0, lobby.totals[p2]||0, p1Items, p2Items);
      return;
    }
  }
  gz_toast('Sonuç alınamadı, zaman aşımı.','error');
  backToBattleSetup();
}

/* ── Fight Screen ── */
function showBattleFightScreen(lobby, caseData) {
  document.getElementById('battle-screen-setup').classList.add('hidden');
  document.getElementById('battle-screen-waiting').classList.add('hidden');
  document.getElementById('battle-screen-fight').classList.remove('hidden');

  const p1 = lobby.players[0], p2 = lobby.players[1]||'Rakip';
  document.getElementById('bf-title').textContent = '⚔️ SAVAŞ BAŞLADI!';

  // Oyuncu kartları
  document.getElementById('bf-grid').innerHTML = `
    <div class="bf-player-card blue">
      <div class="bf-avatar">${p1.slice(0,2).toUpperCase()}</div>
      <div class="bf-name">${escHtml(p1)}</div>
      <div class="bf-total" id="bf-p1-total">0 🪙</div>
    </div>
    <div class="bf-vs orbitron">VS</div>
    <div class="bf-player-card red">
      <div class="bf-avatar">${p2.slice(0,2).toUpperCase()}</div>
      <div class="bf-name">${escHtml(p2)}</div>
      <div class="bf-total" id="bf-p2-total">0 🪙</div>
    </div>
  `;

  // Roulette alanı
  const roulArea = document.getElementById('ba-roulettes');
  roulArea.innerHTML = `
    <div class="ba-roulette-wrap">
      <div class="ba-roulette-label">🔵 ${escHtml(p1)}</div>
      <div class="ba-roulette-needle"></div>
      <div class="ba-roulette-outer"><div class="ba-roulette-track" id="br-track-1"></div></div>
    </div>
    <div class="ba-roulette-wrap">
      <div class="ba-roulette-label">🔴 ${escHtml(p2)}</div>
      <div class="ba-roulette-needle"></div>
      <div class="ba-roulette-outer"><div class="ba-roulette-track" id="br-track-2"></div></div>
    </div>
  `;

  document.getElementById('battle-score-board').classList.add('hidden');
  document.getElementById('ba-status').textContent = 'Hazırlanıyor...';
}

/* ── Çift Roulette ── */
async function runDualRoulette(caseData, item1, item2, p1name, p2name, round) {
  const track1 = document.getElementById('br-track-1');
  const track2 = document.getElementById('br-track-2');
  if (!track1 || !track2) return;

  // Track'leri oluştur
  buildBattleTrack(track1, caseData, item1);
  buildBattleTrack(track2, caseData, item2);

  document.getElementById('ba-status').textContent = `${round+1}. kasa açılıyor... 🎰`;

  // İkisi eş zamanlı dönsün
  await Promise.all([
    spinBattleTrack(track1, WIN_POS_B),
    spinBattleTrack(track2, WIN_POS_B),
  ]);

  // Kazananı vurgula
  const r1 = RARITY[item1.rarity], r2 = RARITY[item2.rarity];
  document.getElementById('ba-status').innerHTML =
    `🔵 <b style="color:${r1?.color}">${item1.emoji} ${item1.name}</b> — ${item1.value.toLocaleString()} 🪙 &nbsp;|&nbsp; ` +
    `🔴 <b style="color:${r2?.color}">${item2.emoji} ${item2.name}</b> — ${item2.value.toLocaleString()} 🪙`;
}

function buildBattleTrack(track, caseData, winnerItem) {
  track.style.transition = 'none';
  track.style.transform  = 'translateX(0)';
  track.innerHTML = '';
  for (let i=0; i<60; i++) {
    const item = (i===WIN_POS_B) ? winnerItem : getRandomItem(caseData);
    const el   = document.createElement('div');
    el.className = 'r-item rb-'+item.rarity;
    el.style.background = hexToRgba(RARITY[item.rarity]?.color||'#444', 0.08);
    el.style.width  = '88px';
    el.style.height = '82px';
    el.style.flexShrink = '0';
    el.style.margin = '0 3px';
    el.innerHTML = `<span class="r-item-emoji">${item.emoji}</span><span class="r-item-name">${item.name}</span>`;
    track.appendChild(el);
  }
}

function spinBattleTrack(track, winPos) {
  return new Promise(resolve => {
    const isMob  = window.innerWidth <= 600;
    const itemW  = isMob ? 76 : 94;
    const outerW = track.parentElement.offsetWidth;
    const center = winPos * itemW + itemW/2 - outerW/2;
    const jitter = (Math.random()-0.5) * 28;
    setTimeout(() => {
      track.style.transition = 'transform 4s cubic-bezier(0.12,0.8,0.25,1.0)';
      track.style.transform  = `translateX(-${center+jitter}px)`;
      setTimeout(resolve, 4200);
    }, 40);
  });
}

/* ── Score Board ── */
function updateBattleScoreBoard(p1,p2,p1Items,p2Items,p1Total,p2Total) {
  const el1 = document.getElementById('bf-p1-total');
  const el2 = document.getElementById('bf-p2-total');
  if (el1) el1.textContent = p1Total.toLocaleString('tr-TR') + ' 🪙';
  if (el2) el2.textContent = p2Total.toLocaleString('tr-TR') + ' 🪙';

  const board = document.getElementById('battle-score-board');
  board.classList.remove('hidden');
  const makeItems = (items) => items.map(item=>{
    const r=RARITY[item.rarity];
    return `<span class="bsb-item" style="border-color:${r?.color||'#444'}" title="${item.name}">
      ${item.emoji}<span class="bsb-item-val">${item.value.toLocaleString()}</span>
    </span>`;
  }).join('');
  document.getElementById('bsb-p1-row').innerHTML =
    `<b>🔵 ${escHtml(p1)}</b><div class="bsb-items">${makeItems(p1Items)}</div>
     <span class="bsb-total">${p1Total.toLocaleString()} 🪙</span>`;
  document.getElementById('bsb-p2-row').innerHTML =
    `<b>🔴 ${escHtml(p2)}</b><div class="bsb-items">${makeItems(p2Items)}</div>
     <span class="bsb-total">${p2Total.toLocaleString()} 🪙</span>`;
}

/* ── Sonuç ── */
function showBattleResult(lobby, caseData, p1Total, p2Total, p1Items, p2Items) {
  const p1 = lobby.players[0], p2 = lobby.players[1]||'Rakip';
  const meIsP1  = ME_B.username === p1;
  const myTotal = meIsP1 ? p1Total : p2Total;
  const opTotal = meIsP1 ? p2Total : p1Total;
  const winner  = lobby.winner || (p1Total >= p2Total ? p1 : p2);
  const iWon    = winner === ME_B.username;

  // Ödül
  if (iWon) {
    const reward = p1Total + p2Total;
    GZ.addBalance(reward);
    GZ.addXP(200 + Math.round(reward/50));
    gz_toast(`🏆 Kazandın! +${reward.toLocaleString('tr-TR')} 🪙`,'gold');
    gz_confetti(['#f59e0b','#ef4444','#a855f7']);
  } else {
    GZ.addXP(30);
    gz_toast('Kaybettin! Şansını tekrar dene.','info');
  }
  updateBalanceDisplay();

  // Tur özeti
  const rounds = p1Items.map((item,i)=>{
    const r1=RARITY[item.rarity], r2=RARITY[p2Items[i]?.rarity];
    const roundWinner = item.value >= (p2Items[i]?.value||0) ? p1 : p2;
    return `
      <div class="br-round-row">
        <span class="br-round-num">Tur ${i+1}</span>
        <span class="br-item" style="color:${r1?.color}">${item.emoji} ${item.name} (${item.value.toLocaleString()})</span>
        <span class="br-vs">vs</span>
        <span class="br-item" style="color:${r2?.color}">${p2Items[i]?.emoji} ${p2Items[i]?.name} (${(p2Items[i]?.value||0).toLocaleString()})</span>
        <span class="br-round-winner" style="color:${roundWinner===p1?'#3b82f6':'#ef4444'}">${roundWinner===p1?'🔵':'🔴'}</span>
      </div>`;
  }).join('');

  document.getElementById('br-title').textContent   = iWon ? '🏆 KAZANDIN!' : '💀 KAYBETTİN!';
  document.getElementById('br-banner').innerHTML    =
    `${iWon?'🔵':'🔴'} <b>${escHtml(winner)}</b> kazandı! &nbsp;|&nbsp;
     🔵 ${p1Total.toLocaleString()} 🪙 vs 🔴 ${p2Total.toLocaleString()} 🪙`;
  document.getElementById('br-banner').style.color  = iWon?'var(--gold)':'var(--red)';
  document.getElementById('br-rounds').innerHTML    = rounds;

  document.getElementById('battle-result-overlay').classList.remove('hidden');

  // Lobi temizle
  setTimeout(()=>deleteBattleLobby(activeBattleLobbyId||''), 5000);
  activeBattleLobbyId = null;
}

function closeBattleResult() {
  document.getElementById('battle-result-overlay').classList.add('hidden');
  backToBattleSetup();
}

function rematchBattle() {
  document.getElementById('battle-result-overlay').classList.add('hidden');
  backToBattleSetup();
  // Önceki seçimleri geri yükle
  if (lastBattleLobby) {
    const sel = document.getElementById('battle-case-select');
    if (sel) { sel.value = lastBattleLobby.caseId; updateBattlePreview(); }
    const countBtn = document.querySelector(`#battle-count-opts .opt-btn[data-val="${lastBattleLobby.count}"]`);
    if (countBtn) {
      document.querySelectorAll('#battle-count-opts .opt-btn').forEach(b=>b.classList.remove('active'));
      countBtn.classList.add('active');
      battleCaseCount = lastBattleLobby.count;
      updateBattleCostInfo();
    }
  }
}

function backToBattleSetup() {
  clearInterval(battlePollTimer);
  document.getElementById('battle-screen-setup').classList.remove('hidden');
  document.getElementById('battle-screen-waiting').classList.add('hidden');
  document.getElementById('battle-screen-fight').classList.add('hidden');
  document.getElementById('battle-result-overlay').classList.add('hidden');
  refreshBattleLobbies();
}

/* ── Yardımcı ── */
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function escHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

/* ── switchPanel hook ── */
const _origSP_battle = window.switchPanel;
window.switchPanel = function(id) {
  _origSP_battle(id);
  if (id === 'battle') setTimeout(()=>{ initBattleSetup(); refreshBattleLobbies(); }, 50);
};

/* ── Init ── */
document.addEventListener('DOMContentLoaded', initBattleSetup);
if (document.readyState !== 'loading') initBattleSetup();


/* ===== wheel.js ===== */
/* =====================================================
   WHEEL.JS — Eşya Çarkı Sistemi
   Oyuncular envanterinden eşya koyar (10'a kadar),
   çark döner, kazanan hepsini alır.
   Erken döndürme oylama sistemi dahil.
===================================================== */

const WHEEL_MAX   = 10;
const WHEEL_MIN_VOTE = 3;  // oylama için minimum eşya sayısı

let wheelItems    = [];   // { item, owner } dizisi  (localStorage'da tutulur)
let wheelSpinning = false;
let myVoted       = false;
let wheelAngle    = 0;
let wheelAnimId   = null;

const WHEEL_STORAGE = 'gz_wheel_pool';
const WHEEL_VOTES   = 'gz_wheel_votes';

/* ─── Depolama ─── */
function getWheelPool() { return JSON.parse(localStorage.getItem(WHEEL_STORAGE) || '[]'); }
function saveWheelPool(pool) { localStorage.setItem(WHEEL_STORAGE, JSON.stringify(pool)); }
function getWheelVotes() { return JSON.parse(localStorage.getItem(WHEEL_VOTES) || '[]'); }
function saveWheelVotes(v) { localStorage.setItem(WHEEL_VOTES, JSON.stringify(v)); }

function clearWheel() {
  localStorage.removeItem(WHEEL_STORAGE);
  localStorage.removeItem(WHEEL_VOTES);
  wheelItems = [];
  myVoted    = false;
}

/* ─── Çarka eşya ekle ─── */
function addItemToWheel(uid) {
  const pool = getWheelPool();
  if (pool.length >= WHEEL_MAX) { gz_toast(`Çark doldu! (${WHEEL_MAX} eşya)`,'error'); return; }

  const me = GZ.currentUser();
  if (pool.find(p => p.itemUid === uid && p.owner === me.username)) {
    gz_toast('Bu eşyayı zaten ekledin!','info'); return;
  }

  const allInv = GZ.getInventory();
  const item   = allInv.find(i => String(i.uid) === String(uid));
  if (!item) { gz_toast('Eşya bulunamadı!','error'); return; }

  // Envanterde kalıcı işaretleme yerine çarkta tut, döndükten sonra envanterden sil
  pool.push({ itemUid: uid, item: { ...item }, owner: me.username });
  saveWheelPool(pool);

  gz_toast(`${item.name} çarka eklendi!`,'success');
  renderWheelPool();
  renderWheelInv();
  drawWheel();
  updateWheelUI();

  // 10 eşyaya ulaşınca otomatik dön
  if (pool.length >= WHEEL_MAX) {
    gz_toast('Çark doldu! Otomatik döndürülüyor...','gold');
    setTimeout(spinWheel, 1200);
  }
}

/* ─── Çarktan eşya çıkar ─── */
function removeFromWheel(idx) {
  const pool  = getWheelPool();
  const me    = GZ.currentUser();
  const entry = pool[idx];
  if (!entry) return;
  if (entry.owner !== me.username) { gz_toast('Başkasının eşyasını çıkaramazsın!','error'); return; }

  pool.splice(idx, 1);
  saveWheelPool(pool);
  renderWheelPool();
  renderWheelInv();
  drawWheel();
  updateWheelUI();
}

/* ─── Envanter listesini göster ─── */
function renderWheelInv() {
  const grid   = document.getElementById('wheel-inv-grid');
  const empty  = document.getElementById('wheel-inv-empty');
  if (!grid) return;

  const inv    = GZ.getInventory();
  const pool   = getWheelPool();
  const me     = GZ.currentUser();
  const inPool = new Set(pool.filter(p=>p.owner===me.username).map(p=>String(p.itemUid)));

  grid.innerHTML = '';
  const available = inv.filter(i => !inPool.has(String(i.uid)));

  if (!available.length) {
    grid.innerHTML = '<p class="empty-inv-msg" id="wheel-inv-empty">Eklenecek eşya yok.</p>';
    return;
  }

  available.slice(0, 30).forEach(item => {
    const r  = RARITY[item.rarity];
    const el = document.createElement('div');
    el.className = 'inv-item';
    el.style.borderColor = r?.color || '#444';
    el.style.cursor = 'pointer';
    el.title = 'Çarka ekle';
    el.innerHTML = `
      <span class="inv-item-emoji">${item.emoji}</span>
      <span class="inv-item-rarity" style="color:${r?.color}">${r?.label}</span>
      <span class="inv-item-name">${item.name}</span>
      <span class="inv-item-val">${item.value.toLocaleString()} 🪙</span>
      <button class="inv-sell-btn" style="background:linear-gradient(135deg,#7c3aed,#9d5cf6);opacity:1"
              onclick="addItemToWheel('${item.uid}')">EKLE</button>
    `;
    el.onclick = (e) => { if (e.target.tagName !== 'BUTTON') addItemToWheel(String(item.uid)); };
    grid.appendChild(el);
  });
}

/* ─── Havuz listesini göster ─── */
function renderWheelPool() {
  const list  = document.getElementById('wheel-item-list');
  const empty = document.getElementById('wheel-pool-empty');
  const count = document.getElementById('wheel-count');
  if (!list) return;

  const pool = getWheelPool();
  const me   = GZ.currentUser();

  if (count) count.textContent = `${pool.length}/${WHEEL_MAX}`;
  list.innerHTML = '';

  if (!pool.length) {
    list.innerHTML = '<p class="wheel-empty-msg" id="wheel-pool-empty">Henüz eşya yok.</p>';
    return;
  }

  pool.forEach((entry, idx) => {
    const item = entry.item;
    const r    = RARITY[item.rarity];
    const isMine = entry.owner === me.username;
    const row  = document.createElement('div');
    row.className = 'wheel-item-row';
    row.innerHTML = `
      <span class="wie-emoji">${item.emoji}</span>
      <div class="wie-info">
        <div class="wie-name">${item.name}</div>
        <div class="wie-owner">👤 ${entry.owner}</div>
      </div>
      <span class="wie-val" style="color:${r?.color}">${item.value.toLocaleString()} 🪙</span>
      ${isMine ? `<button class="wie-remove" onclick="removeFromWheel(${idx})">✕</button>` : ''}
    `;
    list.appendChild(row);
  });
}

/* ─── Oylama ─── */
function castVote() {
  const pool  = getWheelPool();
  const me    = GZ.currentUser();

  if (pool.length < WHEEL_MIN_VOTE) {
    gz_toast(`Oylama için en az ${WHEEL_MIN_VOTE} eşya gerekli!`,'error'); return;
  }
  if (myVoted) { gz_toast('Zaten oy verdin!','info'); return; }
  if (!pool.find(p => p.owner === me.username)) {
    gz_toast('Önce çarka eşya eklemelisin!','error'); return;
  }

  let votes = getWheelVotes();
  if (!votes.includes(me.username)) votes.push(me.username);
  saveWheelVotes(votes);
  myVoted = true;

  const voteBtn = document.getElementById('vote-btn');
  if (voteBtn) { voteBtn.textContent = '✅ Oyladın'; voteBtn.disabled = true; }

  gz_toast('Oyun verildi!','success');
  updateVoteUI();

  // Herkes oy verdiyse dön
  const owners = [...new Set(pool.map(p => p.owner))];
  const voted  = votes.filter(v => owners.includes(v));
  if (voted.length >= owners.length && owners.length >= 1) {
    gz_toast('Herkes oy verdi! Çark dönüyor...','gold');
    setTimeout(spinWheel, 800);
  }
}

function updateVoteUI() {
  const pool   = getWheelPool();
  const votes  = getWheelVotes();
  const owners = [...new Set(pool.map(p => p.owner))];
  const voted  = votes.filter(v => owners.includes(v));
  const pct    = owners.length > 0 ? Math.round((voted.length / owners.length) * 100) : 0;

  const bar    = document.getElementById('vote-bar');
  const text   = document.getElementById('vote-count-text');
  if (bar)  bar.style.width  = pct + '%';
  if (text) text.textContent = `${voted.length} / ${owners.length} oy`;
}

function updateWheelUI() {
  const pool = getWheelPool();
  const btn  = document.getElementById('wheel-spin-btn');
  if (btn) btn.disabled = pool.length < 2 || wheelSpinning;
  updateVoteUI();

  const voteCard = document.getElementById('wheel-vote-card');
  if (voteCard) {
    voteCard.style.opacity = pool.length >= WHEEL_MIN_VOTE ? '1' : '0.4';
  }
}

/* ─── ÇARK ÇİZİMİ ─── */
const WHEEL_COLORS = [
  '#7c3aed','#ef4444','#22c55e','#f59e0b','#3b82f6',
  '#a855f7','#06b6d4','#ff6ef7','#fb923c','#84cc16',
];

function drawWheel() {
  const canvas = document.getElementById('wheelCanvas');
  if (!canvas) return;
  const ctx  = canvas.getContext('2d');
  const pool = getWheelPool();
  const cx   = canvas.width / 2;
  const cy   = canvas.height / 2;
  const R    = cx - 10;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!pool.length) {
    ctx.fillStyle = '#1a1a2e';
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.2)';
    ctx.font = 'bold 16px Rajdhani, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('Eşya Ekle', cx, cy);
    return;
  }

  const sliceAngle = (Math.PI * 2) / pool.length;

  pool.forEach((entry, i) => {
    const startA = wheelAngle + i * sliceAngle;
    const endA   = startA + sliceAngle;

    /* Dilim */
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, R, startA, endA);
    ctx.closePath();
    ctx.fillStyle = WHEEL_COLORS[i % WHEEL_COLORS.length];
    ctx.fill();
    ctx.strokeStyle = '#0a0a0f';
    ctx.lineWidth   = 2;
    ctx.stroke();

    /* Emoji */
    const midA  = startA + sliceAngle / 2;
    const ex    = cx + Math.cos(midA) * R * 0.68;
    const ey    = cy + Math.sin(midA) * R * 0.68;
    ctx.save();
    ctx.translate(ex, ey);
    ctx.rotate(midA + Math.PI / 2);
    ctx.font = `${Math.max(16, Math.min(28, 200 / pool.length))}px sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(entry.item.emoji, 0, 0);
    ctx.restore();

    /* İsim */
    if (pool.length <= 8) {
      const nx = cx + Math.cos(midA) * R * 0.38;
      const ny = cy + Math.sin(midA) * R * 0.38;
      ctx.save();
      ctx.translate(nx, ny);
      ctx.rotate(midA + Math.PI / 2);
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${Math.max(8, Math.min(12, 120/pool.length))}px Rajdhani, sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const name = entry.item.name.length > 10 ? entry.item.name.slice(0,9)+'…' : entry.item.name;
      ctx.fillText(name, 0, 0);
      ctx.restore();
    }
  });

  /* Merkez daire */
  ctx.beginPath(); ctx.arc(cx, cy, 28, 0, Math.PI * 2);
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 28);
  grad.addColorStop(0, '#1e1040'); grad.addColorStop(1, '#0a0a0f');
  ctx.fillStyle = grad; ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 2; ctx.stroke();

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 14px Orbitron, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('🎡', cx, cy);
}

/* ─── ÇARKI DÖNDÜR ─── */
function spinWheel() {
  const pool = getWheelPool();
  if (pool.length < 2) { gz_toast('En az 2 eşya gerekli!','error'); return; }
  if (wheelSpinning) return;

  wheelSpinning = true;
  updateWheelUI();

  const statusEl = document.getElementById('wheel-status');
  if (statusEl) statusEl.textContent = '🎡 Çark dönüyor...';

  /* Kazananı belirle — değer ağırlıklı (daha değerli = daha az şans, daha az = daha fazla) */
  const totalVal = pool.reduce((s, e) => s + e.item.value, 0);
  let r = Math.random() * totalVal;
  let winnerIdx = 0;
  // Eşit şans: Math.floor(Math.random() * pool.length)
  // Değer ağırlıklı tersine (az değerli = daha çok şans):
  for (let i = 0; i < pool.length; i++) {
    r -= (totalVal - pool[i].item.value + 1);
    if (r <= 0) { winnerIdx = i; break; }
  }
  winnerIdx = Math.floor(Math.random() * pool.length); // Eşit şans modu

  /* Animasyon */
  const canvas      = document.getElementById('wheelCanvas');
  const sliceAngle  = (Math.PI * 2) / pool.length;
  // İbreye göre kazanan dilim üste gelmeli: ibre 12 de (üst = -π/2)
  // Kazanan dilimin orta açısı: winnerIdx * sliceAngle + sliceAngle/2
  // Hedef dönüş: ibreye çarpsın diye -(winnerIdx * sliceAngle + sliceAngle/2) - π/2
  const targetSlice = winnerIdx * sliceAngle + sliceAngle / 2;
  const extraSpins  = (8 + Math.random() * 5) * Math.PI * 2;
  const targetAngle = extraSpins - targetSlice - Math.PI / 2;

  const startTime = performance.now();
  const duration  = 5000 + Math.random() * 2000;
  const startAngle = wheelAngle;

  function animate(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    wheelAngle     = startAngle + targetAngle * eased;
    drawWheel();
    if (progress < 1) {
      wheelAnimId = requestAnimationFrame(animate);
    } else {
      wheelAngle = ((startAngle + targetAngle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
      wheelSpinning = false;
      onWheelFinish(winnerIdx, pool);
    }
  }
  wheelAnimId = requestAnimationFrame(animate);
}

function onWheelFinish(winnerIdx, pool) {
  const winner = pool[winnerIdx];
  const me     = GZ.currentUser();
  const isMine = winner.owner === me.username;

  // Kazanan kendi mi?
  const statusEl = document.getElementById('wheel-status');
  if (statusEl) {
    statusEl.textContent = isMine
      ? `🏆 Kazandın! ${winner.item.name} senin!`
      : `😢 ${winner.owner} kazandı! (${winner.item.name})`;
    statusEl.style.color = isMine ? '#f59e0b' : '#ef4444';
  }

  // Toplam değeri hesapla
  const totalValue = pool.reduce((s, e) => s + e.item.value, 0);

  if (isMine) {
    // Hepsini bakiyeye ekle
    GZ.addBalance(totalValue);
    recordEarned(totalValue);
    gz_toast(`🏆 Kazandın! +${totalValue.toLocaleString()} 🪙`, 'gold');
    gz_confetti();
    GZ.addXP(200 + Math.round(totalValue / 100));
  } else {
    gz_toast(`😢 ${winner.owner} kazandı!`, 'info');
    GZ.addXP(20);
  }

  updateBalanceDisplay();

  // Çarkı temizle
  setTimeout(() => {
    clearWheel();
    renderWheelPool();
    renderWheelInv();
    drawWheel();
    updateWheelUI();
    myVoted = false;
    const voteBtn = document.getElementById('vote-btn');
    if (voteBtn) { voteBtn.textContent = '✅ Erken Döndür (Oy Ver)'; voteBtn.disabled = false; }
    if (statusEl) { statusEl.textContent = 'Eşya ekleyip çarkı döndür!'; statusEl.style.color = ''; }
  }, 4000);
}

/* ─── Init ─── */
function initWheel() {
  drawWheel();
  renderWheelPool();
  renderWheelInv();
  updateWheelUI();
}

// Panel açıldığında çağrılacak (cases.js'den)
const _origSwitchPanel = window.switchPanel;
window.switchPanel = function(id) {
  _origSwitchPanel(id);
  if (id === 'wheel') initWheel();
};

document.addEventListener('DOMContentLoaded', () => {
  drawWheel();
  renderWheelPool();
  updateWheelUI();
});
if (document.readyState !== 'loading') {
  drawWheel();
  renderWheelPool();
  updateWheelUI();
}


/* ===== rebirth.js ===== */
/* =====================================================
   REBIRTH.JS — Rebirth Sistemi
   Her rebirth: bakiye + envanter sıfırlanır,
   kalıcı değer çarpanı kazanılır.
===================================================== */

const REBIRTH_MULTIPLIERS = [
  1.00,  // 0 rebirth
  1.25,  // 1
  1.50,  // 2
  2.00,  // 3
  2.50,  // 4
  3.00,  // 5
  3.50,  // 6
  4.00,  // 7
  5.00,  // 8
  6.00,  // 9
  8.00,  // 10+
];

function getRebirth() {
  const u = GZ.currentUser();
  return u?.rebirth || 0;
}

function getMultiplierForLevel(rb) {
  const idx = Math.min(rb, REBIRTH_MULTIPLIERS.length - 1);
  // 10+ için ekstra hesap
  if (rb > 10) return REBIRTH_MULTIPLIERS[10] + (rb - 10) * 1.0;
  return REBIRTH_MULTIPLIERS[idx];
}

function renderRebirthPanel() {
  const u  = GZ.currentUser();
  const rb = u?.rebirth || 0;
  const mult = getMultiplierForLevel(rb);
  const nextMult = getMultiplierForLevel(rb + 1);

  // Mevcut istatistikler
  const statsEl = document.getElementById('rebirth-current-stats');
  if (statsEl) {
    statsEl.innerHTML = `
      <div class="reb-stat-box">
        <div class="reb-stat-val" style="color:var(--gold)">${rb}</div>
        <div class="reb-stat-label">Rebirth Sayısı</div>
      </div>
      <div class="reb-stat-box">
        <div class="reb-stat-val" style="color:var(--primary2)">x${mult.toFixed(2)}</div>
        <div class="reb-stat-label">Mevcut Çarpan</div>
      </div>
      <div class="reb-stat-box">
        <div class="reb-stat-val" style="color:var(--cyan)">x${nextMult.toFixed(2)}</div>
        <div class="reb-stat-label">Sonraki Çarpan</div>
      </div>
    `;
  }

  // Rebirth geçmişi / yol haritası
  const histEl = document.getElementById('rebirth-history');
  if (histEl) {
    const rows = REBIRTH_MULTIPLIERS.map((m, i) => {
      const done   = i < rb;
      const active = i === rb;
      const next   = i === rb + 1;
      return `
        <div style="display:flex;align-items:center;gap:.75rem;padding:.5rem .75rem;
                    background:${active?'rgba(245,158,11,.1)':done?'rgba(34,197,94,.06)':'var(--bg3)'};
                    border-radius:9px;border:1px solid ${active?'rgba(245,158,11,.3)':done?'rgba(34,197,94,.2)':'var(--border)'};
                    margin-bottom:.35rem">
          <span style="font-size:1.1rem">${done?'✅':active?'🔥':next?'⬆️':'⏳'}</span>
          <div style="flex:1">
            <b style="font-size:.85rem;color:${active?'var(--gold)':done?'var(--green)':'var(--muted2)'}">
              Rebirth ${i} ${active?'(Şu an)':done?'(Tamamlandı)':next?'(Sonraki)':''}
            </b>
          </div>
          <span style="font-family:'Orbitron',sans-serif;font-size:.9rem;font-weight:700;
                       color:${active?'var(--gold)':done?'var(--green)':'var(--muted2)'}">
            x${m.toFixed(2)}
          </span>
        </div>
      `;
    }).join('');
    histEl.innerHTML = `
      <div style="font-size:.78rem;font-weight:700;color:var(--muted2);letter-spacing:1px;margin-bottom:.75rem">
        REBİRTH YOL HARİTASI
      </div>
      ${rows}
      ${rb >= 10 ? `<div style="text-align:center;color:var(--gold);font-size:.85rem;font-weight:700;margin-top:.5rem">
        🌟 Her rebirth'te +x1.00 eklenir!</div>` : ''}
    `;
  }

  // Buton durumu
  const btn = document.getElementById('rebirth-btn');
  const inv = GZ.getInventory();
  const bal = GZ.getBalance();
  if (btn) {
    btn.textContent = `🔥 REBİRTH AT (${rb} → ${rb+1}) — x${nextMult.toFixed(2)} çarpan`;
    // Minimum gereksinim: bakiye > 0 veya envanter > 0
    const hasStuff = bal > 0 || inv.length > 0;
    btn.disabled = !hasStuff;
    if (!hasStuff) {
      btn.title = 'Rebirth için önce case aç ve para kazan!';
    }
  }
}

function doRebirth() {
  const u  = GZ.currentUser();
  const rb = (u?.rebirth || 0);
  const nextMult = getMultiplierForLevel(rb + 1);
  const inv = GZ.getInventory();
  const bal = GZ.getBalance();

  // Onay
  const confirmed = confirm(
    `REBİRTH ${rb} → ${rb + 1}\n\n` +
    `Kaybedeceklerin:\n` +
    `• ${bal.toLocaleString()} 🪙 bakiye\n` +
    `• ${inv.length} envanter eşyası\n\n` +
    `Kazanacakların:\n` +
    `• Kalıcı x${nextMult.toFixed(2)} değer çarpanı\n\n` +
    `Bu işlem geri alınamaz! Devam etmek istiyor musun?`
  );
  if (!confirmed) return;

  // Rebirth uygula
  u.rebirth   = rb + 1;
  u.balance   = 500; // küçük başlangıç bonusu
  u.inventory = [];
  u.xp        = 0;
  u.level     = 1;
  // Stats'ı koru ama sıfırla
  u.stats = {
    casesOpened:   u.stats?.casesOpened   || 0,
    footballWins:  u.stats?.footballWins  || 0,
    footballGames: u.stats?.footballGames || 0,
    totalGoals:    u.stats?.totalGoals    || 0,
    totalEarned:   u.stats?.totalEarned   || 0,
    rebirths:      (u.stats?.rebirths || 0) + 1,
  };
  GZ.saveCurrentUser(u);
  GZ.refreshBalanceUI();

  // Çark'ı da temizle
  localStorage.removeItem('gz_wheel_pool');
  localStorage.removeItem('gz_wheel_votes');

  gz_toast(`🔥 Rebirth ${u.rebirth} tamamlandı! Çarpan: x${nextMult.toFixed(2)}`, 'gold');
  gz_confetti(['#f59e0b','#ef4444','#a855f7','#06b6d4']);

  // Paneli güncelle
  renderRebirthPanel();
  updateSidebarRebirth();
  updateBalanceDisplay();

  // Animasyon — ekran ışıması
  const flash = document.createElement('div');
  flash.style.cssText = `
    position:fixed;inset:0;background:rgba(245,158,11,.25);
    z-index:9998;pointer-events:none;
    animation:rebirth-flash .8s ease-out forwards;
  `;
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 900);

  // CSS animasyonu
  if (!document.getElementById('rebirth-anim-style')) {
    const st = document.createElement('style');
    st.id = 'rebirth-anim-style';
    st.textContent = `@keyframes rebirth-flash {
      0%   { opacity:1; }
      100% { opacity:0; }
    }`;
    document.head.appendChild(st);
  }
}

/* Sayfa yüklenince sidebar'ı güncelle */
document.addEventListener('DOMContentLoaded', () => {
  updateSidebarRebirth();
  renderRebirthPanel();
});
if (document.readyState !== 'loading') {
  updateSidebarRebirth();
}


/* ===== cases-leaderboard.js ===== */
/* =====================================================
   CASES-LEADERBOARD.JS — Sıralama Tablosu
   Kategoriler: Bakiye, Case, Envanter Değeri,
                Rebirth, Futbol Galibiyet, Seviye
===================================================== */

/* Aktif kategori */
let lbCategory = 'balance';

/* Kategori tanımları */
const LB_CATS = {
  balance:  { label:'💰 Bakiye',          valFn: u => u.balance||0,                    fmt: v => v.toLocaleString('tr-TR')+' 🪙',   th:'Bakiye'         },
  cases:    { label:'📦 Açılan Case',      valFn: u => u.stats?.casesOpened||0,         fmt: v => v.toLocaleString('tr-TR')+' case',  th:'Case'           },
  invvalue: { label:'🎒 Envanter Değeri',  valFn: u => (u.inventory||[]).reduce((s,i)=>s+i.value,0), fmt: v=>v.toLocaleString('tr-TR')+' 🪙', th:'Envanter'  },
  rebirth:  { label:'🔥 Rebirth',          valFn: u => u.rebirth||0,                    fmt: v => v+'x Rebirth',                       th:'Rebirth'        },
  fbwins:   { label:'⚽ Futbol Galibiyet', valFn: u => u.stats?.footballWins||0,         fmt: v => v+' galibiyet',                      th:'Galibiyet'      },
  level:    { label:'⭐ Seviye',           valFn: u => (u.level||1)*500+(u.xp||0),       fmt: (v,u) => `Lv.${u.level||1} (${u.xp||0} XP)`, th:'Seviye'     },
};

/* Tab geçişi */
function switchLbTab(cat, el) {
  lbCategory = cat;
  document.querySelectorAll('.lb-tab').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  renderLeaderboard();
}

/* ── Ana render ── */
function renderLeaderboard() {
  const cat      = LB_CATS[lbCategory];
  const search   = (document.getElementById('lb-search')?.value || '').toLowerCase();
  const me       = GZ.currentUser();
  const allUsers = Object.values(GZ.getUsers());

  /* Sırala */
  const ranked = allUsers
    .filter(u => !u.banned)
    .sort((a, b) => cat.valFn(b) - cat.valFn(a))
    .map((u, i) => ({ ...u, _rank: i + 1, _val: cat.valFn(u) }));

  /* Kendi yerim */
  const myRank = ranked.find(u => u.username === me?.username);

  /* Arama filtresi */
  const filtered = search
    ? ranked.filter(u => u.username.toLowerCase().includes(search))
    : ranked;

  document.getElementById('lb-total-badge').textContent = ranked.length + ' oyuncu';
  document.getElementById('lb-val-th').textContent      = cat.th;

  /* Podiyum (sadece arama yoksa göster) */
  if (!search) {
    renderPodium(ranked.slice(0, 3), cat);
  } else {
    document.getElementById('lb-podium').innerHTML = '';
  }

  /* Tablo */
  renderTable(filtered, cat, me?.username);

  /* Kendi konumum bar */
  renderMyRank(myRank, cat, me);
}

/* ── Podiyum ── */
function renderPodium(top3, cat) {
  const el     = document.getElementById('lb-podium');
  const crowns = ['👑','🥈','🥉'];
  const order  = [1, 0, 2]; // görsel sıra: 2. - 1. - 3.

  if (!top3.length) { el.innerHTML = ''; return; }

  const slots = order.map(idx => {
    const u = top3[idx];
    if (!u) return '';
    const rank   = idx + 1;
    const cls    = `podium-${rank === 1 ? '1st' : rank === 2 ? '2nd' : '3rd'}`;
    const val    = cat.fmt(u._val, u);
    const initials = u.username.slice(0, 2).toUpperCase();
    const rbBadge  = (u.rebirth||0) > 0 ? `<span class="lb-rb-badge">🔥${u.rebirth}</span>` : '';

    return `
      <div class="podium-slot ${cls}">
        <div class="podium-crown">${crowns[idx]}</div>
        <div class="podium-avatar">${initials}</div>
        <div class="podium-name">${escHtml(u.username)}${rbBadge}</div>
        <div class="podium-val">${val}</div>
        <div class="podium-stand">${rank}</div>
      </div>`;
  });

  el.innerHTML = slots.join('');
}

/* ── Tablo ── */
function renderTable(list, cat, myUsername) {
  const tbody = document.getElementById('lb-tbody');
  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:2.5rem;color:var(--muted)">Oyuncu bulunamadı.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(u => {
    const isMe    = u.username === myUsername;
    const rankCls = u._rank === 1 ? 'rank-1' : u._rank === 2 ? 'rank-2' : u._rank === 3 ? 'rank-3' : 'rank-other';
    const val     = cat.fmt(u._val, u);
    const winRate = u.stats?.footballGames > 0
      ? Math.round((u.stats.footballWins / u.stats.footballGames) * 100) + '%'
      : '—';

    return `
      <tr class="${isMe ? 'lb-me-row' : ''}">
        <td class="lb-rank-cell">
          <span class="lb-rank-num ${rankCls}">${u._rank}</span>
        </td>
        <td>
          <div class="lb-player-cell">
            <div class="lb-player-av">${u.username.slice(0,2).toUpperCase()}</div>
            <span class="lb-player-name">${escHtml(u.username)}</span>
            ${isMe ? '<span class="lb-me-badge">SEN</span>' : ''}
            ${(u.rebirth||0)>0 ? `<span class="lb-rb-badge">🔥${u.rebirth}</span>` : ''}
          </div>
        </td>
        <td style="font-weight:700;color:var(--gold)">${val}</td>
        <td>Lv.<b>${u.level||1}</b></td>
        <td>${u.rebirth||0}x</td>
        <td>${(u.stats?.casesOpened||0).toLocaleString('tr-TR')}</td>
        <td>
          <span style="color:var(--green)">${u.stats?.footballWins||0}</span>
          <span style="color:var(--muted2)">/${u.stats?.footballGames||0}</span>
          <span style="color:var(--muted);font-size:.75rem"> (${winRate})</span>
        </td>
      </tr>`;
  }).join('');
}

/* ── Kendi konumum ── */
function renderMyRank(myRank, cat, me) {
  const el = document.getElementById('lb-myrank-bar');
  if (!myRank || !me) { el.innerHTML = ''; return; }

  const val     = cat.fmt(myRank._val, myRank);
  const allCount = Object.values(GZ.getUsers()).filter(u=>!u.banned).length;
  const pct     = allCount > 1 ? Math.round((1 - (myRank._rank - 1) / allCount) * 100) : 100;

  el.innerHTML = `
    <span class="lb-myrank-label">📍 Senin konumun:</span>
    <span class="lb-myrank-val">#${myRank._rank}</span>
    <span class="lb-myrank-label">—</span>
    <span style="font-weight:700;color:var(--text)">${val}</span>
    <span class="lb-myrank-label">— Oyuncuların <b style="color:var(--cyan)">${pct}%</b>'inden iyisin</span>
  `;
}

/* ── switchPanel override — leaderboard için ── */
const _origSwitchPanelLB = window.switchPanel;
window.switchPanel = function(id) {
  _origSwitchPanelLB(id);
  if (id === 'leaderboard') {
    // Kısa gecikme: DOM hazır olsun
    setTimeout(renderLeaderboard, 50);
  }
};

/* ── Yardımcı ── */
function escHtml(s) {
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ── İlk yüklemede leaderboard hazırla ── */
document.addEventListener('DOMContentLoaded', () => {
  // Sidebar rozetleri güncelle
  const allUsers = Object.values(GZ.getUsers()).filter(u=>!u.banned).length;
  const badge = document.querySelector('#snb-leaderboard .snb-badge');
  if (badge) badge.textContent = allUsers;
});

