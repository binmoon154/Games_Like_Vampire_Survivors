const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const image = new Image();
image.src = "1.png";

let W = 0, H = 0, dpr = 1;
let atlas = null;
let last = 0;
let state = "menu";
let spawnTimer = 0;
let attackTimer = 0;
let elapsedTime = 0;
let bossFightRemaining = 0;
let bossTimers = new Set();
const map = { width: 1600, height: 1000 };
const camera = { x: 0, y: 0 };

const keys = new Set();
const enemies = [];
const projectiles = [];
const gems = [];
const effects = [];
const destroyedBuildings = new Set();
const destroyedCars = new Set();
const carHealth = new Map();
const carDrops = [];
const cityTileCache = new Map();
let worldSeed = Math.floor(Math.random() * 0xffffffff);
const bossHazards = [];
const bossProjectiles = [];
const defeatedMapBosses = new Set();
let activeArena = null;
let selectedNextMap = null;

const player = {
  x: 0, y: 0, radius: 18,
  hp: 100, maxHp: 100,
  speed: 210, damage: 10,
  attackSpeed: 0.9, pickup: 70,
  weapons: [], passives: [],
  level: 1, xp: 0, nextXp: 12,
  invincible: 0
};

const stats = {
  time: 0, kills: 0, bossKills: 0, score: 0
};

const spriteRects = {
  zombie: [86, 48, 136, 132],
  boar: [301, 64, 104, 114],
  skeleton: [496, 48, 96, 128],
  orc: [697, 48, 116, 128],
  minotaur: [188, 298, 132, 116],
  necromancer: [423, 287, 108, 118],
  imugi: [598, 276, 112, 138]
};

const enemyTypes = {
  zombie: { hp: 28, speed: 68, radius: 19, xp: 2, damage: 8 },
  boar: { hp: 45, speed: 104, radius: 20, xp: 3, damage: 12, minTime: 180 },
  skeleton: { hp: 55, speed: 52, radius: 17, xp: 4, damage: 10, minTime: 240 },
  orc: { hp: 100, speed: 44, radius: 25, xp: 8, damage: 18, minTime: 420 },
  minotaur: { hp: 800, speed: 42, radius: 38, xp: 40, damage: 25, boss: true },
  necromancer: { hp: 1800, speed: 28, radius: 42, xp: 80, damage: 30, boss: true },
  imugi: { hp: 3500, speed: 24, radius: 48, xp: 150, damage: 40, boss: true },
  giantZombieRat: { hp: 720, speed: 68, radius: 36, xp: 60, damage: 24, boss: true },
  giantEnhancedZombie: { hp: 1400, speed: 34, radius: 46, xp: 100, damage: 36, boss: true }
};

const characterCatalog = [
  {
    name: "생존자",
    description: "균형 잡힌 기본 캐릭터. 모든 무기를 안정적으로 사용할 수 있다.",
    stats: "체력 100 · 이동 속도 210 · 행운 0%"
  }
];

const weaponCatalog = [
  {
    id: "magicBullet",
    name: "마법 탄환",
    description: "시야에 들어온 가장 가까운 적을 자동 조준해 탄환을 발사한다.",
    stats: "피해 10 · 레벨당 피해 +3~5 · 공격 주기 0.9초 · 사거리 400px",
    icon: "✦",
    color: "#2878a8"
  },
  {
    id: "spinningShuriken",
    name: "회전 수리검",
    description: "플레이어 주변을 회전하며 가까이 접근한 적을 공격한다.",
    stats: "피해 6 · 레벨당 피해 +3~5 · 반경 70px · 회전 속도 180도/초",
    icon: "◈",
    color: "#a65b2a"
  },
  {
    id: "lightning",
    name: "번개",
    description: "시야에 들어온 적 하나를 번개로 즉시 공격한다.",
    stats: "피해 18 · 레벨당 피해 +3~5 · 공격 주기 2초 · 화면 안의 적 대상",
    icon: "ϟ",
    color: "#7650a8"
  }
];

const passiveCatalog = [
  { id: "power", name: "공격력 강화", description: "레벨마다 공격력 +12.5%.", icon: "⚔", color: "#a84736" },
  { id: "speed", name: "신속", description: "Lv.1 기준 이동 속도 +7.5%. 레벨이 높을수록 증가폭 감소.", icon: "➤", color: "#287d91" },
  { id: "cooldown", name: "집중", description: "Lv.1 기준 공격 주기 -7.5%. 레벨이 높을수록 감소폭 감소.", icon: "◉", color: "#315b9b" },
  { id: "vitality", name: "활력", description: "레벨마다 최대 체력 +10.", icon: "♥", color: "#9a3e54" },
  { id: "magnet", name: "자석", description: "Lv.1 기준 경험치 획득 범위 +20px. 레벨이 높을수록 증가폭 감소.", icon: "✥", color: "#6d4d9b" }
];

const mapCatalog = [
  { name: "폐허 지대", description: "거대 좀비 쥐와 거대 강화 좀비를 상대하는 첫 번째 지역.", stats: "보스 3분/5분 · 둘 다 처치하면 클리어" },
  { name: "얼어붙은 통로", description: "차가운 바닥이 이어진 다음 지역. 이후 업데이트 예정.", stats: "잠김 · 추가 맵 준비 중" }
];

function resize() {
  dpr = Math.min(devicePixelRatio || 1, 2);
  W = innerWidth;
  H = innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = W + "px";
  canvas.style.height = H + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (!player.x) {
    player.x = W / 2;
    player.y = H / 2;
  }
}
addEventListener("resize", resize);
resize();

image.onload = () => {
  atlas = document.createElement("canvas");
  atlas.width = image.naturalWidth;
  atlas.height = image.naturalHeight;
  const a = atlas.getContext("2d");
  a.drawImage(image, 0, 0);
  const pixels = a.getImageData(0, 0, atlas.width, atlas.height);
  for (let i = 0; i < pixels.data.length; i += 4) {
    if (pixels.data[i] > 242 && pixels.data[i + 1] > 242 && pixels.data[i + 2] > 242) {
      pixels.data[i + 3] = 0;
    }
  }
  a.putImageData(pixels, 0, 0);
};

function resetGame() {
  enemies.length = 0;
  projectiles.length = 0;
  gems.length = 0;
  effects.length = 0;
  bossHazards.length = 0;
  bossProjectiles.length = 0;
  defeatedMapBosses.clear();
  activeArena = null;
  elapsedTime = 0;
  bossFightRemaining = 0;
  carDrops.length = 0;
  cityTileCache.clear();
  worldSeed = Math.floor(Math.random() * 0xffffffff);
  destroyedBuildings.clear();
  destroyedCars.clear();
  carHealth.clear();
  bossTimers.clear();

  Object.assign(player, {
    x: W / 2, y: H / 2, hp: 100, maxHp: 100,
    speed: 210, damage: 10, attackSpeed: .9,
    pickup: 70, weapons: [{ id: "magicBullet", level: 1, damageBonus: 0, extraProjectiles: 0 }], passives: [],
    level: 1, xp: 0, nextXp: 12, invincible: 0
  });
  camera.x = player.x;
  camera.y = player.y;
  Object.assign(stats, { time: 0, kills: 0, bossKills: 0, score: 0 });
  spawnTimer = 0;
  attackTimer = 0;

  for (let i = 0; i < 8; i++) spawnEnemy();
}

function findWeapon(id) {
  return player.weapons.find(weapon => weapon.id === id);
}

function findPassive(id) {
  return player.passives.find(passive => passive.id === id);
}

function diminishingEffect(originalEffect, level) {
  if (level <= 0) return 0;
  const firstLevelEffect = originalEffect * .5;
  const growthRatio = 5 / 7;
  return firstLevelEffect * (1 - Math.pow(growthRatio, level)) / (1 - growthRatio);
}

function linearNerfedEffect(originalEffect, level) {
  return originalEffect * .5 * level;
}

function calculatePassiveStats(passives = player.passives) {
  const getLevel = id => passives.find(passive => passive.id === id)?.level || 0;
  const powerBonus = linearNerfedEffect(.25, getLevel("power"));
  const speedBonus = diminishingEffect(.15, getLevel("speed"));
  const cooldownBonus = diminishingEffect(.15, getLevel("cooldown"));
  const vitalityBonus = linearNerfedEffect(20, getLevel("vitality"));
  const pickupBonus = diminishingEffect(40, getLevel("magnet"));
  return {
    damage: 10 * (1 + powerBonus),
    speed: 210 * (1 + speedBonus),
    attackSpeed: .9 * (1 - cooldownBonus),
    maxHp: 100 + vitalityBonus,
    pickup: 70 + pickupBonus
  };
}

function recalculatePassives() {
  const hpRatio = player.maxHp > 0 ? player.hp / player.maxHp : 1;
  Object.assign(player, calculatePassiveStats());
  player.hp = Math.min(player.maxHp, player.maxHp * hpRatio);
}

function addWeapon(id, levels = 1, rolledGrowth = null) {
  const weapon = findWeapon(id);
  const startingLevel = weapon?.level || 0;
  const upgrade = rolledGrowth || rollWeaponGrowth(startingLevel, levels);
  const selectedWeapon = weapon || (player.weapons.length < 2 ? {
    id, level: 0, damageBonus: 0, extraProjectiles: 0
  } : null);
  if (!selectedWeapon) return;
  if (!weapon) player.weapons.push(selectedWeapon);
  selectedWeapon.level += levels;
  selectedWeapon.damageBonus = (selectedWeapon.damageBonus || 0) + upgrade.damageBonus;
  selectedWeapon.extraProjectiles = (selectedWeapon.extraProjectiles || 0) + upgrade.extraProjectiles;
}

function rollWeaponGrowth(startingLevel, levels) {
  let damageBonus = 0;
  let extraProjectiles = 0;
  for (let index = 0; index < levels; index++) {
    if (startingLevel !== 0 || index !== 0) damageBonus += 3 + Math.floor(Math.random() * 3);
    if (Math.random() < .14) extraProjectiles++;
  }
  return { damageBonus, extraProjectiles };
}

function weaponBaseDamage(id) {
  if (id === "spinningShuriken") return 6;
  if (id === "lightning") return 18;
  return player.damage;
}

function weaponDamage(weapon) {
  return weaponBaseDamage(weapon.id) + (weapon.damageBonus || 0);
}

function addPassive(id, levels = 1) {
  const passive = findPassive(id);
  if (passive) {
    passive.level += levels;
  } else if (player.passives.length < 3) {
    player.passives.push({ id, level: levels });
  }
  recalculatePassives();
}

function getUpgradeAmount() {
  const roll = Math.random();
  if (roll < 0.08) return 3;
  if (roll < 0.28) return 2;
  return 1;
}

function showRoom(room) {
  const catalogs = {
    character: {
      title: "캐릭터실",
      items: characterCatalog.map(item => ({ name: item.name, description: item.description, icon: "♟", rank: 3 }))
    },
    weapon: {
      title: "무기실",
      items: weaponCatalog.map((item, index) => ({ name: item.name, description: item.description, icon: item.icon, color: item.color, visualClass: "weapon", rank: index + 2 }))
    },
    passive: {
      title: "패시브실",
      items: passiveCatalog.map(item => ({ name: item.name, description: item.description, icon: item.icon, color: item.color, visualClass: "book", rank: 2 }))
    },
    map: {
      title: "맵 선택실",
      items: mapCatalog.map((item, index) => ({ name: item.name, description: item.description, icon: index === 0 ? "▦" : "?", rank: index === 0 ? 4 : 1 }))
    }
  };
  const selected = catalogs[room];
  if (!selected) return;
  roomTitle.textContent = selected.title;
  roomGrid.innerHTML = selected.items.map(item => {
    const bars = Array.from({ length: 5 }, (_, index) =>
      `<i class="${index < item.rank ? "active" : ""}"></i>`
    ).join("");
    const iconStyle = item.visualClass === "weapon" ? `--weapon-color: ${item.color}` : `--book-color: ${item.color || "#202b31"}`;
    return `<article class="room-card">
      <div class="room-card-icon ${item.visualClass || ""}" style="${iconStyle}">${item.icon}</div>
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <div class="room-bars" aria-label="등급 ${item.rank}/5">${bars}</div>
    </article>`;
  }).join("");
  codex.classList.add("hidden");
  roomScreen.classList.remove("hidden");
}

function openCodex() {
  corridorViewport.scrollLeft = 0;
  codexContent.innerHTML = "<h2>복도 입구</h2><p>왼쪽에는 작동하지 않는 엘리베이터만 있습니다. 문을 선택해 내용을 확인하세요.</p>";
  roomScreen.classList.add("hidden");
  menu.classList.add("hidden");
  codex.classList.remove("hidden");
}

function closeCodexView() {
  roomScreen.classList.add("hidden");
  codex.classList.add("hidden");
  menu.classList.remove("hidden");
}

function closeRoomView() {
  roomScreen.classList.add("hidden");
  codex.classList.remove("hidden");
}

function startGame() {
  resetGame();
  state = "playing";
  menu.classList.add("hidden");
  codex.classList.add("hidden");
  roomScreen.classList.add("hidden");
  mapSelectScreen.classList.add("hidden");
  result.classList.add("hidden");
  pauseScreen.classList.add("hidden");
  hud.classList.remove("hidden");
  pause.classList.remove("hidden");
  joystick.classList.remove("hidden");
}

function openNextMapSelection() {
  result.classList.add("hidden");
  mapSelectScreen.classList.remove("hidden");
  mapChoices.innerHTML = "";
  mapSelectionStatus.textContent = selectedNextMap ? `선택됨: ${selectedNextMap}` : "맵을 선택하세요.";
  mapCatalog.forEach((mapData, index) => {
    const card = document.createElement("button");
    card.className = `map-choice${selectedNextMap === mapData.name ? " selected" : ""}`;
    card.innerHTML = `<b>${mapData.name}</b><br><small>${index === 0 ? "클리어 완료" : "다음 지역"}</small><p>${mapData.description}</p>`;
    card.onclick = () => {
      selectedNextMap = mapData.name;
      mapSelectionStatus.textContent = `선택됨: ${selectedNextMap}`;
      document.querySelectorAll(".map-choice").forEach(choice => choice.classList.remove("selected"));
      card.classList.add("selected");
    };
    mapChoices.appendChild(card);
  });
}

function returnFromMapSelection() {
  mapSelectScreen.classList.add("hidden");
  menu.classList.remove("hidden");
}

function togglePause() {
  if (state === "playing") {
    state = "paused";
    updatePauseStats();
    pauseScreen.classList.remove("hidden");
  } else if (state === "paused") {
    state = "playing";
    pauseScreen.classList.add("hidden");
  }
}

function returnToMainMenu() {
  state = "menu";
  pauseScreen.classList.add("hidden");
  hud.classList.add("hidden");
  pause.classList.add("hidden");
  joystick.classList.add("hidden");
  menu.classList.remove("hidden");
}

function spawnEnemy(type = randomEnemyType(), spawnPosition = null) {
  if (enemies.length >= 250) return;

  const distance = Math.max(W, H) * .65 + 100;
  const data = enemyTypes[type];
  let spawnX = spawnPosition?.x ?? player.x;
  let spawnY = spawnPosition?.y ?? player.y;
  for (let attempt = 0; !spawnPosition && attempt < 24; attempt++) {
    const angle = Math.random() * Math.PI * 2;
    spawnX = player.x + Math.cos(angle) * distance;
    spawnY = player.y + Math.sin(angle) * distance;
    const nearbyObjects = getCityObjects({ x: spawnX - data.radius, y: spawnY - data.radius, width: data.radius * 2, height: data.radius * 2 });
    if (!nearbyObjects.some(object => circleOverlapsRect(spawnX, spawnY, data.radius, object))) break;
  }

  enemies.push({
    type,
    x: spawnX,
    y: spawnY,
    hp: data.hp * Math.pow(1.08, Math.floor(stats.time / 60)),
    maxHp: data.hp * Math.pow(1.08, Math.floor(stats.time / 60)),
    radius: data.radius,
    speed: data.speed * (1 + Math.min(.4, Math.floor(stats.time / 120) * .05)),
    hitTimer: 0,
    route: [],
    routeTimer: 0,
    invincibleUntil: data.boss ? elapsedTime + 2 : 0,
    bossState: "approach",
    bossTimer: type === "giantZombieRat" ? 1.5 : 2.2,
    nextAttack: "slam",
    dashCloudTimer: 0,
    attackDirection: 0,
    boss: data.boss || false
  });
}

function randomEnemyType() {
  const t = stats.time;
  const choices = ["zombie"];
  if (t >= 180) choices.push("boar");
  if (t >= 240) choices.push("skeleton");
  if (t >= 420) choices.push("orc");
  return choices[Math.floor(Math.random() * choices.length)];
}

function spawnBoss(type) {
  if (bossTimers.has(type)) return;
  bossTimers.add(type);
  if (!activeArena) activeArena = { x: player.x, y: player.y, radius: 360, type };
  else activeArena.type = type;
  bossFightRemaining = 120;
  const angle = Math.random() * Math.PI * 2;
  spawnEnemy(type, { x: player.x + Math.cos(angle) * 210, y: player.y + Math.sin(angle) * 210 });
  const name = type === "giantZombieRat" ? "거대 좀비 쥐" : "거대 강화 좀비";
  effects.push({ x: player.x, y: player.y - 80, text: `${name} 등장!`, life: 3, max: 3 });
}

function damagePlayer(amount) {
  if (player.invincible > 0 || state !== "playing") return;
  player.hp -= amount;
  player.invincible = .7;
  if (player.hp <= 0) endGame(false);
}

function constrainToBossArena(entity) {
  if (!activeArena) return;
  const dx = entity.x - activeArena.x;
  const dy = entity.y - activeArena.y;
  const distance = Math.hypot(dx, dy) || 1;
  const limit = activeArena.radius - entity.radius - 4;
  if (distance > limit) {
    entity.x = activeArena.x + dx / distance * limit;
    entity.y = activeArena.y + dy / distance * limit;
  }
}

function directionToPlayer(entity) {
  const dx = player.x - entity.x;
  const dy = player.y - entity.y;
  const distance = Math.hypot(dx, dy) || 1;
  return { x: dx / distance, y: dy / distance };
}

function spawnThrownCar(boss) {
  const direction = directionToPlayer(boss);
  bossProjectiles.push({
    x: boss.x, y: boss.y,
    vx: direction.x * 330, vy: direction.y * 330,
    radius: 24, damage: 32, life: 2.5,
    angle: Math.atan2(direction.y, direction.x)
  });
  effects.push({ x: boss.x, y: boss.y - 50, text: "차량 투척!", life: .7, max: .7 });
}

function performFanSlam(boss) {
  const dx = player.x - boss.x;
  const dy = player.y - boss.y;
  const distance = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx);
  let difference = Math.abs(angle - boss.attackDirection);
  if (difference > Math.PI) difference = Math.PI * 2 - difference;
  if (distance < 230 && difference < Math.PI / 4) damagePlayer(34);
  effects.push({ x: boss.x, y: boss.y, text: "충격파!", life: .65, max: .65 });
}

function updateBossBehavior(boss, dt) {
  boss.bossTimer -= dt;
  if (boss.type === "giantZombieRat") {
    if (boss.bossState === "ratWindup") {
      if (boss.bossTimer <= 0) {
        boss.bossState = "ratDash";
        boss.bossTimer = .8;
        boss.dashCloudTimer = 0;
      }
      return { x: 0, y: 0, speed: 0 };
    }
    if (boss.bossState === "ratDash") {
      boss.dashCloudTimer -= dt;
      if (boss.dashCloudTimer <= 0 && bossHazards.length < 50) {
        bossHazards.push({ x: boss.x, y: boss.y, radius: 34, life: 4, damage: 12, damageTimer: 0, type: "poison" });
        boss.dashCloudTimer = .16;
      }
      if (boss.bossTimer <= 0) {
        boss.bossState = "recover";
        boss.bossTimer = .8;
        return { x: 0, y: 0, speed: 0 };
      }
      return { x: boss.dashX, y: boss.dashY, speed: 460 };
    }
    if (boss.bossState === "recover") {
      if (boss.bossTimer <= 0) {
        boss.bossState = "approach";
        boss.bossTimer = 2.1;
      }
      return { x: 0, y: 0, speed: 0 };
    }
    if (boss.bossTimer <= 0) {
      const direction = directionToPlayer(boss);
      boss.dashX = direction.x;
      boss.dashY = direction.y;
      boss.attackDirection = Math.atan2(direction.y, direction.x);
      boss.bossState = "ratWindup";
      boss.bossTimer = .65;
      effects.push({ x: boss.x, y: boss.y - 50, text: "돌진 준비!", life: .65, max: .65 });
      return { x: 0, y: 0, speed: 0 };
    }
    return { ...directionToPlayer(boss), speed: boss.speed };
  }

  if (boss.bossState === "slamWindup" || boss.bossState === "throwWindup") {
    if (boss.bossTimer <= 0) {
      if (boss.bossState === "slamWindup") performFanSlam(boss);
      else spawnThrownCar(boss);
      boss.bossState = "recover";
      boss.bossTimer = 1;
      boss.nextAttack = boss.nextAttack === "slam" ? "throw" : "slam";
    }
    return { x: 0, y: 0, speed: 0 };
  }
  if (boss.bossState === "recover") {
    if (boss.bossTimer <= 0) {
      boss.bossState = "approach";
      boss.bossTimer = 1.8;
    }
    return { x: 0, y: 0, speed: 0 };
  }
  if (boss.bossTimer <= 0) {
    boss.attackDirection = Math.atan2(player.y - boss.y, player.x - boss.x);
    boss.bossState = boss.nextAttack === "throw" ? "throwWindup" : "slamWindup";
    boss.bossTimer = boss.nextAttack === "throw" ? .7 : .9;
    return { x: 0, y: 0, speed: 0 };
  }
  return { ...directionToPlayer(boss), speed: boss.speed };
}

function updateBossHazards(dt) {
  for (const hazard of bossHazards) {
    hazard.life -= dt;
    hazard.damageTimer -= dt;
    if (hazard.damageTimer <= 0 && Math.hypot(player.x - hazard.x, player.y - hazard.y) < player.radius + hazard.radius) {
      damagePlayer(hazard.damage);
      hazard.damageTimer = .9;
    }
  }
  for (let index = bossHazards.length - 1; index >= 0; index--) {
    if (bossHazards[index].life <= 0) bossHazards.splice(index, 1);
  }
}

function updateBossProjectiles(dt) {
  for (const projectile of bossProjectiles) {
    projectile.x += projectile.vx * dt;
    projectile.y += projectile.vy * dt;
    projectile.life -= dt;
    if (Math.hypot(player.x - projectile.x, player.y - projectile.y) < player.radius + projectile.radius) {
      damagePlayer(projectile.damage);
      projectile.life = 0;
    }
  }
  for (let index = bossProjectiles.length - 1; index >= 0; index--) {
    if (bossProjectiles[index].life <= 0) bossProjectiles.splice(index, 1);
  }
}

function screenPosition(entity) {
  return {
    x: entity.x - camera.x + W / 2,
    y: entity.y - camera.y + H / 2
  };
}

function isVisible(entity, margin = 0) {
  const position = screenPosition(entity);
  return position.x >= -margin && position.x <= W + margin &&
    position.y >= -margin && position.y <= H + margin;
}

function nearestEnemy() {
  let best = null;
  let distance = Infinity;
  for (const e of enemies) {
    if (e.hp <= 0 || !isVisible(e, e.radius)) continue;
    const d = Math.hypot(e.x - player.x, e.y - player.y);
    if (d < distance) {
      distance = d;
      best = e;
    }
  }
  return best;
}

function nearestCar() {
  let best = null;
  let distance = Infinity;
  const range = { x: player.x - W / 2, y: player.y - H / 2, width: W, height: H };
  for (const car of getCityObjects(range)) {
    if (car.kind !== "car") continue;
    const x = car.x + car.width / 2;
    const y = car.y + car.height / 2;
    const currentDistance = Math.hypot(x - player.x, y - player.y);
    if (currentDistance < distance) {
      distance = currentDistance;
      best = { ...car, x, y };
    }
  }
  return best;
}

function nearestTargets(count = 1) {
  const targets = enemies
    .filter(enemy => enemy.hp > 0 && isVisible(enemy, enemy.radius) && elapsedTime >= (enemy.invincibleUntil || 0))
    .map(enemy => ({ type: "enemy", target: enemy, x: enemy.x, y: enemy.y, distance: Math.hypot(enemy.x - player.x, enemy.y - player.y) }));
  const range = { x: player.x - W / 2, y: player.y - H / 2, width: W, height: H };
  for (const car of getCityObjects(range)) {
    if (car.kind !== "car") continue;
    const x = car.x + car.width / 2;
    const y = car.y + car.height / 2;
    targets.push({ type: "car", target: car, x, y, distance: Math.hypot(x - player.x, y - player.y) });
  }
  return targets.sort((a, b) => a.distance - b.distance).slice(0, count);
}

function nearestTarget() {
  return nearestTargets(1)[0] || null;
}

function shoot() {
  for (const weapon of player.weapons) {
    if (weapon.id === "spinningShuriken") {
      const count = 1 + (weapon.extraProjectiles || 0);
      let shurikens = projectiles.filter(projectile => projectile.orbiting && projectile.weaponId === weapon.id);
      while (shurikens.length < count) {
        const shuriken = {
          orbiting: true,
          weaponId: weapon.id,
          angle: 0,
          orbitRadius: 70,
          angularSpeed: Math.PI,
          x: player.x + 70,
          y: player.y,
          radius: 10,
          damage: weaponDamage(weapon),
          life: Infinity,
          hitTimers: new Map(),
          hitEnemies: new Set(),
          hitCars: new Set()
        };
        projectiles.push(shuriken);
        shurikens.push(shuriken);
      }
      shurikens.slice(0, count).forEach((shuriken, index) => {
        shuriken.angle = index / count * Math.PI * 2;
        shuriken.damage = weaponDamage(weapon);
      });
      continue;
    }
    const count = 1 + (weapon.extraProjectiles || 0);
    const targets = nearestTargets(weapon.id === "lightning" ? count : 1);
    if (!targets.length) continue;
    const target = targets[0];
    const dx = target.x - player.x;
    const dy = target.y - player.y;
    const length = Math.hypot(dx, dy) || 1;
    const damage = weaponDamage(weapon);

    if (weapon.id === "lightning") {
      if (stats.time < (weapon.nextAttackAt || 0)) continue;
      for (const hit of targets) {
        if (hit.type === "car") damageCar(hit.target, damage);
        else hit.target.hp -= damage;
        effects.push({ x: hit.x, y: hit.y, text: "번개!", life: .5, max: .5 });
      }
      weapon.nextAttackAt = stats.time + 6;
      continue;
    }

    const baseAngle = Math.atan2(dy, dx);
    for (let index = 0; index < count; index++) {
      const angle = baseAngle + (index - (count - 1) / 2) * .12;
      projectiles.push({
        x: player.x, y: player.y,
        vx: Math.cos(angle) * 500,
        vy: Math.sin(angle) * 500,
        radius: 7,
        damage,
        life: .9, pierce: 1,
        hitEnemies: new Set(), hitCars: new Set()
      });
    }
  }
}

function gainXp(value) {
  player.xp += value;
  stats.score += value * 10;

  while (player.xp >= player.nextXp) {
    player.xp -= player.nextXp;
    player.level++;
    player.nextXp = Math.floor((20 + player.level * 15 + Math.pow(player.level, 1.4) * 2) / 3);
    showLevelUp();
  }
}

function showLevelUp() {
  if (state === "levelup") return;
  state = "levelup";
  levelup.classList.remove("hidden");

  const weaponChoices = weaponCatalog
    .filter(weapon => findWeapon(weapon.id) || player.weapons.length < 2)
    .map(weapon => ({
      type: "weapon",
      id: weapon.id,
      name: weapon.name,
      description: weapon.description,
      icon: weapon.icon,
      color: weapon.color,
      level: findWeapon(weapon.id)?.level || 0,
      apply: (amount, growth) => addWeapon(weapon.id, amount, growth)
    }));
  const passiveChoices = passiveCatalog
    .filter(passive => findPassive(passive.id) || player.passives.length < 3)
    .map(passive => ({
      type: "passive",
      id: passive.id,
      name: passive.name,
      description: passive.description,
      icon: passive.icon,
      color: passive.color,
      level: findPassive(passive.id)?.level || 0,
      apply: amount => addPassive(passive.id, amount)
    }));
  const selected = [...weaponChoices, ...passiveChoices]
    .sort(() => Math.random() - .5)
    .slice(0, 3);
  selected.forEach(choice => {
    choice.upgradeAmount = getUpgradeAmount();
    if (choice.type === "weapon") {
      choice.growth = rollWeaponGrowth(choice.level, choice.upgradeAmount);
      choice.upgradeSummary = getWeaponUpgradeSummary(choice);
    } else {
      choice.upgradeSummary = getPassiveUpgradeSummary(choice);
    }
  });
  choices.innerHTML = "";
  showUpgradePreview(selected[0]);

  selected.forEach((choice, index) => {
    const card = document.createElement("button");
    const upgradeAmount = choice.upgradeAmount;
    card.className = `card level-up-${upgradeAmount}`;
    const finalLevel = choice.level + upgradeAmount;
    const iconClass = choice.type === "weapon" ? "choice-weapon" : "choice-book";
    const iconStyle = choice.type === "weapon" ? `--weapon-color: ${choice.color}` : `--book-color: ${choice.color}`;
    card.innerHTML = `<span class="${iconClass}" style="${iconStyle}">${choice.icon}</span><b>${index + 1}. ${choice.name}</b><br><small>${choice.type === "weapon" ? "무기" : "패시브"} · Lv.${choice.level} → Lv.${finalLevel}<br>+${upgradeAmount} 레벨<br>${choice.upgradeSummary}<br>${choice.description}</small>`;
    card.onmouseenter = () => showUpgradePreview(choice);
    card.onfocus = () => showUpgradePreview(choice);
    card.onclick = () => {
      choice.apply(upgradeAmount, choice.growth);
      levelup.classList.add("hidden");
      state = "playing";
      updateHud();
    };
    choices.appendChild(card);
  });
}

function formatUpgradeValue(value, digits = 2) {
  return Number(value.toFixed(digits)).toString();
}

function getWeaponUpgradeSummary(choice) {
  const currentWeapon = findWeapon(choice.id);
  const startingDamage = weaponBaseDamage(choice.id) + (currentWeapon?.damageBonus || 0);
  const finalDamage = startingDamage + choice.growth.damageBonus;
  const startingProjectiles = 1 + (currentWeapon?.extraProjectiles || 0);
  const finalProjectiles = startingProjectiles + choice.growth.extraProjectiles;
  const projectileRolls = choice.upgradeAmount;
  const damageText = choice.level === 0
    ? `기본 피해 ${formatUpgradeValue(weaponBaseDamage(choice.id))} → ${formatUpgradeValue(finalDamage)} (강화 +${choice.growth.damageBonus})`
    : `피해 ${formatUpgradeValue(startingDamage)} → ${formatUpgradeValue(finalDamage)} (+${choice.growth.damageBonus})`;
  const projectileText = `발사체/타격 ${startingProjectiles} → ${finalProjectiles} (추가 ${choice.growth.extraProjectiles}회, 선택 레벨 ${projectileRolls}회 각각 14% 판정)`;
  return `${damageText}<br>${projectileText}`;
}

function getPassiveUpgradeSummary(choice) {
  const currentStats = calculatePassiveStats();
  const nextPassives = player.passives.map(passive => ({ ...passive }));
  const passive = nextPassives.find(item => item.id === choice.id);
  if (passive) passive.level += choice.upgradeAmount;
  else nextPassives.push({ id: choice.id, level: choice.upgradeAmount });
  const nextStats = calculatePassiveStats(nextPassives);
  const statByPassive = {
    power: ["공격력", "damage", ""],
    speed: ["이동 속도", "speed", ""],
    cooldown: ["공격 주기", "attackSpeed", "초"],
    vitality: ["최대 체력", "maxHp", ""],
    magnet: ["경험치 획득 범위", "pickup", "px"]
  };
  const [label, key, unit] = statByPassive[choice.id];
  const before = currentStats[key];
  const after = nextStats[key];
  const difference = after - before;
  const precision = key === "attackSpeed" ? 3 : 2;
  const change = `${difference > 0 ? "+" : ""}${formatUpgradeValue(difference, precision)}${unit}`;
  return `${label} ${formatUpgradeValue(before, precision)}${unit} → ${formatUpgradeValue(after, precision)}${unit} (${change})`;
}

function showUpgradePreview(choice) {
  if (!choice) {
    upgradePreview.innerHTML = "<p>선택 가능한 항목이 없습니다.</p>";
    return;
  }
  const iconClass = choice.type === "weapon" ? "choice-weapon" : "choice-book";
  const iconStyle = choice.type === "weapon" ? `--weapon-color: ${choice.color}` : `--book-color: ${choice.color}`;
  upgradePreview.innerHTML = `
    <div class="${iconClass}" style="${iconStyle}">${choice.icon}</div>
    <h2>${choice.name}</h2>
    <p>${choice.type === "weapon" ? "무기" : "패시브"} · Lv.${choice.level}<br>${choice.upgradeSummary || choice.description}</p>
  `;
}

function update(dt) {
  elapsedTime += dt;
  if (activeArena) {
    bossFightRemaining = Math.max(0, bossFightRemaining - dt);
    if (bossFightRemaining <= 0) {
      endGame(false);
      return;
    }
  } else {
    stats.time += dt;
  }
  player.invincible = Math.max(0, player.invincible - dt);

  const direction = getMovement();
  const playerBounds = {
    x: player.x + Math.min(0, direction.x * player.speed * dt) - player.radius,
    y: player.y + Math.min(0, direction.y * player.speed * dt) - player.radius,
    width: Math.abs(direction.x * player.speed * dt) + player.radius * 2,
    height: Math.abs(direction.y * player.speed * dt) + player.radius * 2
  };
  moveWithCollision(player, direction.x * player.speed * dt, direction.y * player.speed * dt, getCityObjects(playerBounds), false);
  constrainToBossArena(player);
  camera.x = player.x;
  camera.y = player.y;

  const interval =
    stats.time < 120 ? 1.5 :
    stats.time < 300 ? 1 :
    stats.time < 600 ? .7 : .45;

  if (!activeArena) {
    spawnTimer -= dt;
    if (spawnTimer <= 0) {
      spawnEnemy();
      spawnTimer = interval;
    }
  }

  if (stats.time >= 180) spawnBoss("giantZombieRat");
  if (stats.time >= 300) spawnBoss("giantEnhancedZombie");

  attackTimer -= dt;
  if (attackTimer <= 0) {
    shoot();
    attackTimer = player.attackSpeed;
  }

  for (const e of enemies) {
    let targetX = player.x;
    let targetY = player.y;
    if (!e.boss) {
      const closeToPlayer = Math.hypot(player.x - e.x, player.y - e.y) <= e.radius + player.radius;
      if (closeToPlayer) {
        e.route.length = 0;
        targetX = e.x;
        targetY = e.y;
      } else {
        e.routeTimer -= dt;
        if (e.routeTimer <= 0 || !e.route.length) {
          e.route = findRoute(e, player.x, player.y);
          e.routeTimer = .45 + Math.random() * .15;
        }
        while (e.route.length && Math.hypot(e.route[0].x - e.x, e.route[0].y - e.y) < Math.max(12, e.radius * .5)) e.route.shift();
      }
      if (!closeToPlayer && e.route.length) {
        targetX = e.route[0].x;
        targetY = e.route[0].y;
      }
    }
    let dx = targetX - e.x;
    let dy = targetY - e.y;
    let movementSpeed = e.speed;
    if (e.type === "giantZombieRat" || e.type === "giantEnhancedZombie") {
      const movement = updateBossBehavior(e, dt);
      dx = movement.x;
      dy = movement.y;
      movementSpeed = movement.speed;
    }
    const distance = Math.hypot(dx, dy) || 1;
    const moveX = dx / distance * movementSpeed * dt;
    const moveY = dy / distance * movementSpeed * dt;
    const enemyBounds = {
      x: e.x + Math.min(0, moveX) - e.radius,
      y: e.y + Math.min(0, moveY) - e.radius,
      width: Math.abs(moveX) + e.radius * 2,
      height: Math.abs(moveY) + e.radius * 2
    };
    const enemyObstacles = getCityObjects(enemyBounds);
    moveWithCollision(e, moveX, moveY, enemyObstacles, e.boss);
    if (e.boss) constrainToBossArena(e);
    pushEnemyAwayFromObstacles(e, enemyObstacles);

    if (Math.hypot(player.x - e.x, player.y - e.y) <= e.radius + player.radius && player.invincible <= 0) {
      player.hp -= enemyTypes[e.type].damage;
      player.invincible = .7;
      if (player.hp <= 0) endGame(false);
    }
  }

  updateBossHazards(dt);
  updateBossProjectiles(dt);

  for (const p of projectiles) {
    if (p.orbiting) {
      p.angle = (p.angle + p.angularSpeed * dt) % (Math.PI * 2);
      p.x = player.x + Math.cos(p.angle) * p.orbitRadius;
      p.y = player.y + Math.sin(p.angle) * p.orbitRadius;
      for (const [target, lastHit] of p.hitTimers) {
        if (stats.time - lastHit > .4) p.hitTimers.delete(target);
      }
    } else {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
    }

    const projectileBounds = { x: p.x - p.radius, y: p.y - p.radius, width: p.radius * 2, height: p.radius * 2 };
    for (const car of getCityObjects(projectileBounds)) {
      if (car.kind !== "car" || !circleOverlapsRect(p.x, p.y, p.radius, car)) continue;
      if (p.orbiting ? p.hitTimers.has(car.id) : p.hitCars.has(car.id)) continue;
      damageCar(car, p.damage);
      if (p.orbiting) p.hitTimers.set(car.id, stats.time);
      else {
        p.hitCars.add(car.id);
        p.pierce--;
      }
      effects.push({ x: car.x + car.width / 2, y: car.y + car.height / 2, text: Math.round(p.damage), life: .5, max: .5 });
      if (!p.orbiting) {
        if (p.pierce < 0) p.life = 0;
        break;
      }
    }

    for (const e of enemies) {
      if (e.hp <= 0 || elapsedTime < (e.invincibleUntil || 0)) continue;
      if (p.orbiting ? p.hitTimers.has(e) : p.hitEnemies.has(e)) continue;
      if (Math.hypot(p.x - e.x, p.y - e.y) < p.radius + e.radius) {
        e.hp -= p.damage;
        if (p.orbiting) p.hitTimers.set(e, stats.time);
        else {
          p.hitEnemies.add(e);
          p.pierce--;
        }
        effects.push({ x: e.x, y: e.y, text: Math.round(p.damage), life: .5, max: .5 });
        if (!p.orbiting) {
          if (p.pierce < 0) p.life = 0;
          break;
        }
      }
    }
  }

  for (const g of gems) {
    const dx = player.x - g.x;
    const dy = player.y - g.y;
    const distance = Math.hypot(dx, dy) || 1;

    if (distance < player.pickup) {
      g.x += dx / distance * 260 * dt;
      g.y += dy / distance * 260 * dt;
    }
    if (distance < 24) {
      g.collected = true;
      gainXp(g.value);
    }
  }

  for (const drop of carDrops) {
    if (drop.collected || Math.hypot(player.x - drop.x, player.y - drop.y) >= player.radius + 12) continue;
    drop.collected = true;
    if (drop.type === "medkit") {
      player.hp = Math.min(player.maxHp, player.hp + 35);
      effects.push({ x: player.x, y: player.y - 28, text: "체력 회복", life: .8, max: .8 });
    } else {
      for (const gem of gems) {
        if (!gem.collected && Math.hypot(player.x - gem.x, player.y - gem.y) < Math.max(W, H)) {
          gem.collected = true;
          gainXp(gem.value);
        }
      }
      effects.push({ x: player.x, y: player.y - 28, text: "자석", life: .8, max: .8 });
    }
  }

  for (const e of enemies) {
    if (e.hp <= 0 && !e.dead) {
      e.dead = true;
      stats.kills++;
      if (e.boss) {
        stats.bossKills++;
        if (e.type === "giantZombieRat" || e.type === "giantEnhancedZombie") {
          defeatedMapBosses.add(e.type);
          carDrops.push({ x: e.x - 14, y: e.y, type: "medkit" });
          carDrops.push({ x: e.x + 14, y: e.y, type: "magnet" });
          const mapBossAlive = enemies.some(enemy =>
            enemy !== e && !enemy.dead && enemy.hp > 0 &&
            (enemy.type === "giantZombieRat" || enemy.type === "giantEnhancedZombie")
          );
          if (!mapBossAlive) {
            activeArena = null;
            bossFightRemaining = 0;
            bossHazards.length = 0;
            bossProjectiles.length = 0;
          }
          if (defeatedMapBosses.size === 2) endGame(true);
        }
        if (e.type === "imugi") endGame(true);
      }
      gems.push({ x: e.x, y: e.y, value: enemyTypes[e.type].xp });
    }
  }

  for (const e of enemies) e.hitTimer -= dt;
  for (const p of projectiles) p.life -= 0;
  for (const f of effects) f.life -= dt;

  cleanup();
  updateHud();
}

function cleanup() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    if (enemies[i].dead) enemies.splice(i, 1);
  }
  for (let i = projectiles.length - 1; i >= 0; i--) {
    if (projectiles[i].life <= 0) projectiles.splice(i, 1);
  }
  for (let i = gems.length - 1; i >= 0; i--) {
    if (gems[i].collected) gems.splice(i, 1);
  }
  for (let i = effects.length - 1; i >= 0; i--) {
    if (effects[i].life <= 0) effects.splice(i, 1);
  }
  for (let i = carDrops.length - 1; i >= 0; i--) {
    if (carDrops[i].collected) carDrops.splice(i, 1);
  }
}

function getMovement() {
  let x = 0, y = 0;
  if (keys.has("KeyA") || keys.has("ArrowLeft")) x--;
  if (keys.has("KeyD") || keys.has("ArrowRight")) x++;
  if (keys.has("KeyW") || keys.has("ArrowUp")) y--;
  if (keys.has("KeyS") || keys.has("ArrowDown")) y++;

  x += joystickVector.x;
  y += joystickVector.y;

  const length = Math.hypot(x, y) || 1;
  return { x: x / Math.max(1, length), y: y / Math.max(1, length) };
}

function drawSprite(type, x, y, size) {
  if (!atlas) {
    ctx.fillStyle = "#8ac926";
    ctx.fillRect(x - size / 2, y - size / 2, size, size);
    return;
  }
  const [sx, sy, sw, sh] = spriteRects[type];
  ctx.drawImage(atlas, sx, sy, sw, sh, x - size / 2, y - size / 2, size, size);
}

function drawBuilding(x, y, width, height, color, accent) {
  ctx.fillStyle = "#080a10aa";
  ctx.fillRect(x + 10, y + 12, width, height);
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 4;
  ctx.strokeRect(x + 2, y + 2, width - 4, height - 4);

  ctx.fillStyle = "#b7c9c955";
  for (let windowY = y + 28; windowY < y + height - 18; windowY += 42) {
    for (let windowX = x + 24; windowX < x + width - 18; windowX += 48) {
      ctx.fillRect(windowX, windowY, 22, 14);
    }
  }
  ctx.fillStyle = "#111724";
  ctx.fillRect(x + width / 2 - 22, y + height - 42, 44, 42);
  ctx.fillStyle = "#d7a84b";
  ctx.fillRect(x + width / 2 - 15, y + height - 32, 30, 7);
}

function drawCar(x, y, angle, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = "#080a10aa";
  ctx.fillRect(-21, -11, 42, 24);
  ctx.fillStyle = color;
  ctx.fillRect(-19, -10, 38, 20);
  ctx.fillStyle = "#8db2c455";
  ctx.fillRect(-9, -7, 17, 14);
  ctx.fillStyle = "#171b24";
  ctx.fillRect(-15, -13, 9, 4);
  ctx.fillRect(6, -13, 9, 4);
  ctx.fillRect(-15, 9, 9, 4);
  ctx.fillRect(6, 9, 9, 4);
  ctx.restore();
}

function createTileRandom(tileX, tileY) {
  let seed = (worldSeed ^ Math.imul(tileX, 374761393) ^ Math.imul(tileY, 668265263)) >>> 0;
  return () => {
    seed += 0x6d2b79f5;
    let value = seed;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

function cityTileObjects(tileX, tileY) {
  const tileKey = `${tileX}:${tileY}`;
  const cached = cityTileCache.get(tileKey);
  if (cached) return cached;

  const random = createTileRandom(tileX, tileY);
  const originX = tileX * map.width;
  const originY = tileY * map.height;
  const buildingSlots = [
    [70, 70, 430, 240], [1100, 70, 430, 240],
    [70, 700, 430, 220], [1100, 700, 430, 220]
  ];
  for (let index = buildingSlots.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1));
    [buildingSlots[index], buildingSlots[other]] = [buildingSlots[other], buildingSlots[index]];
  }
  const buildingCount = 1 + Math.floor(random() * 2);
  const buildings = buildingSlots.slice(0, buildingCount).map(([x, y, width, height], index) => ({
    id: `building:${tileX}:${tileY}:${index}`,
    kind: "building",
    x: originX + x, y: originY + y, width, height
  }));
  const carCount = Math.floor(random() * 3);
  const carLanes = [
    [735, 0, Math.PI / 2, "#d34f5f"],
    [865, 0, -Math.PI / 2, "#4e9bc4"],
    [0, 445, 0, "#d69b42"],
    [0, 555, Math.PI, "#70a35d"]
  ];
  for (let index = carLanes.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1));
    [carLanes[index], carLanes[other]] = [carLanes[other], carLanes[index]];
  }
  const cars = carLanes.slice(0, carCount).map(([laneX, laneY, angle, color], index) => {
    const x = laneX || 60 + random() * (map.width - 120);
    const y = laneY || 60 + random() * (map.height - 120);
    const vertical = Math.abs(Math.sin(angle)) > .5;
    const width = vertical ? 24 : 42;
    const height = vertical ? 42 : 24;
    return {
      id: `car:${tileX}:${tileY}:${index}`,
      kind: "car", x: originX + x - width / 2, y: originY + y - height / 2,
      width, height, angle, color, maxHp: 45,
      hp: carHealth.get(`car:${tileX}:${tileY}:${index}`) ?? 45
    };
  });
  const objects = [...buildings, ...cars];
  cityTileCache.set(tileKey, objects);
  return objects;
}

function getCityObjects(bounds) {
  const objects = [];
  const left = Math.floor(bounds.x / map.width);
  const right = Math.floor((bounds.x + bounds.width) / map.width);
  const top = Math.floor(bounds.y / map.height);
  const bottom = Math.floor((bounds.y + bounds.height) / map.height);
  for (let tileY = top; tileY <= bottom; tileY++) {
    for (let tileX = left; tileX <= right; tileX++) {
      for (const object of cityTileObjects(tileX, tileY)) {
        if (object.kind === "building" ? destroyedBuildings.has(object.id) : destroyedCars.has(object.id)) continue;
        if (object.x < bounds.x + bounds.width && object.x + object.width > bounds.x &&
            object.y < bounds.y + bounds.height && object.y + object.height > bounds.y) {
          objects.push(object);
        }
      }
    }
  }
  return objects;
}

function circleOverlapsRect(x, y, radius, rect) {
  const nearestX = Math.max(rect.x, Math.min(x, rect.x + rect.width));
  const nearestY = Math.max(rect.y, Math.min(y, rect.y + rect.height));
  return Math.hypot(x - nearestX, y - nearestY) < radius;
}

function pushEnemyAwayFromObstacles(enemy, obstacles) {
  const padding = 4;
  for (const rect of obstacles) {
    if (destroyedBuildings.has(rect.id) || destroyedCars.has(rect.id)) continue;
    const nearestX = Math.max(rect.x, Math.min(enemy.x, rect.x + rect.width));
    const nearestY = Math.max(rect.y, Math.min(enemy.y, rect.y + rect.height));
    let dx = enemy.x - nearestX;
    let dy = enemy.y - nearestY;
    let distance = Math.hypot(dx, dy);

    if (distance < .001) {
      const sides = [
        { distance: enemy.x - rect.x, dx: -1, dy: 0 },
        { distance: rect.x + rect.width - enemy.x, dx: 1, dy: 0 },
        { distance: enemy.y - rect.y, dx: 0, dy: -1 },
        { distance: rect.y + rect.height - enemy.y, dx: 0, dy: 1 }
      ].sort((a, b) => a.distance - b.distance);
      dx = sides[0].dx;
      dy = sides[0].dy;
      enemy.x += dx * (sides[0].distance + enemy.radius + padding);
      enemy.y += dy * (sides[0].distance + enemy.radius + padding);
      continue;
    }

    const overlap = enemy.radius + padding - distance;
    if (overlap > 0) {
      enemy.x += dx / distance * overlap;
      enemy.y += dy / distance * overlap;
    }
  }
}

function segmentHitsRect(x1, y1, x2, y2, rect) {
  let low = 0;
  let high = 1;
  const dx = x2 - x1;
  const dy = y2 - y1;
  for (const [start, delta, min, max] of [
    [x1, dx, rect.x, rect.x + rect.width],
    [y1, dy, rect.y, rect.y + rect.height]
  ]) {
    if (Math.abs(delta) < .0001) {
      if (start <= min || start >= max) return false;
      continue;
    }
    let first = (min - start) / delta;
    let second = (max - start) / delta;
    if (first > second) [first, second] = [second, first];
    low = Math.max(low, first);
    high = Math.min(high, second);
    if (low >= high) return false;
  }
  return true;
}

function destroyCityObject(object) {
  if (object.kind === "building") {
    destroyedBuildings.add(object.id);
    effects.push({ x: object.x + object.width / 2, y: object.y + object.height / 2, text: "파괴!", life: .7, max: .7 });
    return;
  }
  if (destroyedCars.has(object.id)) return;
  destroyedCars.add(object.id);
  carHealth.delete(object.id);
  effects.push({ x: object.x + object.width / 2, y: object.y + object.height / 2, text: "차량 파괴!", life: .8, max: .8 });
  const roll = Math.random();
  if (roll < .05) carDrops.push({ x: object.x + object.width / 2, y: object.y + object.height / 2, type: "medkit" });
  else if (roll < .1) carDrops.push({ x: object.x + object.width / 2, y: object.y + object.height / 2, type: "magnet" });
}

function damageCar(car, damage) {
  if (destroyedCars.has(car.id)) return;
  const hp = Math.max(0, car.hp - damage);
  car.hp = hp;
  carHealth.set(car.id, hp);
  const [, tileX, tileY] = car.id.split(":");
  const cachedCar = cityTileObjects(Number(tileX), Number(tileY)).find(object => object.id === car.id);
  if (cachedCar) cachedCar.hp = hp;
  if (hp <= 0) destroyCityObject(car);
}

function moveWithCollision(entity, dx, dy, obstacles, canDestroy) {
  for (const axis of ["x", "y"]) {
    const amount = axis === "x" ? dx : dy;
    if (!amount) continue;
    const nextX = entity.x + (axis === "x" ? amount : 0);
    const nextY = entity.y + (axis === "y" ? amount : 0);
    let blocked = false;
    for (const object of obstacles) {
      if (object.kind === "building" ? destroyedBuildings.has(object.id) : destroyedCars.has(object.id)) continue;
      if (!circleOverlapsRect(nextX, nextY, entity.radius, object)) continue;
      if (canDestroy) destroyCityObject(object);
      else blocked = true;
    }
    if (!blocked) {
      entity.x = nextX;
      entity.y = nextY;
    }
  }
}

function findRoute(entity, targetX, targetY) {
  const margin = 120;
  const bounds = {
    x: Math.min(entity.x, targetX) - margin,
    y: Math.min(entity.y, targetY) - margin,
    width: Math.abs(targetX - entity.x) + margin * 2,
    height: Math.abs(targetY - entity.y) + margin * 2
  };
  const obstacles = getCityObjects(bounds).map(object => ({
    x: object.x - entity.radius - 4,
    y: object.y - entity.radius - 4,
    width: object.width + (entity.radius + 4) * 2,
    height: object.height + (entity.radius + 4) * 2
  }));
  const targetBlocked = point => obstacles.some(rect =>
    point.x > rect.x && point.x < rect.x + rect.width && point.y > rect.y && point.y < rect.y + rect.height
  );
  if (targetBlocked({ x: targetX, y: targetY })) {
    let nearestTarget = null;
    for (let index = 0; index < 16; index++) {
      const angle = index / 16 * Math.PI * 2;
      const point = {
        x: targetX + Math.cos(angle) * (entity.radius + player.radius + 6),
        y: targetY + Math.sin(angle) * (entity.radius + player.radius + 6)
      };
      if (!targetBlocked(point) && (!nearestTarget || Math.hypot(point.x - entity.x, point.y - entity.y) < Math.hypot(nearestTarget.x - entity.x, nearestTarget.y - entity.y))) {
        nearestTarget = point;
      }
    }
    if (nearestTarget) {
      targetX = nearestTarget.x;
      targetY = nearestTarget.y;
    }
  }
  if (!obstacles.some(rect => segmentHitsRect(entity.x, entity.y, targetX, targetY, rect))) {
    return [{ x: targetX, y: targetY }];
  }

  const nodes = [{ x: entity.x, y: entity.y }, { x: targetX, y: targetY }];
  for (const rect of obstacles) {
    for (const point of [
      { x: rect.x - 3, y: rect.y - 3 },
      { x: rect.x + rect.width + 3, y: rect.y - 3 },
      { x: rect.x - 3, y: rect.y + rect.height + 3 },
      { x: rect.x + rect.width + 3, y: rect.y + rect.height + 3 }
    ]) {
      if (!obstacles.some(other => point.x > other.x && point.x < other.x + other.width && point.y > other.y && point.y < other.y + other.height)) {
        nodes.push(point);
      }
    }
  }

  const distances = nodes.map((_, index) => index === 0 ? 0 : Infinity);
  const previous = nodes.map(() => -1);
  const visited = new Set();
  for (let step = 0; step < nodes.length; step++) {
    let current = -1;
    for (let index = 0; index < nodes.length; index++) {
      if (!visited.has(index) && (current < 0 || distances[index] < distances[current])) current = index;
    }
    if (current < 0 || !Number.isFinite(distances[current]) || current === 1) break;
    visited.add(current);
    for (let next = 1; next < nodes.length; next++) {
      if (visited.has(next) || next === current) continue;
      if (obstacles.some(rect => segmentHitsRect(nodes[current].x, nodes[current].y, nodes[next].x, nodes[next].y, rect))) continue;
      const distance = distances[current] + Math.hypot(nodes[next].x - nodes[current].x, nodes[next].y - nodes[current].y);
      if (distance < distances[next]) {
        distances[next] = distance;
        previous[next] = current;
      }
    }
  }

  if (!Number.isFinite(distances[1])) return [{ x: targetX, y: targetY }];
  const route = [];
  for (let index = 1; index > 0; index = previous[index]) route.unshift(nodes[index]);
  return route;
}

function drawCityTile(originX, originY, tileX, tileY) {
  const roadLeft = originX + 610;
  const roadTop = originY + 370;
  const roadWidth = 380;
  const roadHeight = 260;

  ctx.fillStyle = "#252b36";
  ctx.fillRect(roadLeft, originY, roadWidth, map.height);
  ctx.fillRect(originX, roadTop, map.width, roadHeight);

  ctx.fillStyle = "#68707a";
  ctx.fillRect(roadLeft - 18, originY, 18, map.height);
  ctx.fillRect(roadLeft + roadWidth, originY, 18, map.height);
  ctx.fillRect(originX, roadTop - 18, map.width, 18);
  ctx.fillRect(originX, roadTop + roadHeight, map.width, 18);

  ctx.setLineDash([34, 24]);
  ctx.strokeStyle = "#e5c96a99";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(roadLeft + 92, originY);
  ctx.lineTo(roadLeft + 92, originY + map.height);
  ctx.moveTo(roadLeft + roadWidth - 92, originY);
  ctx.lineTo(roadLeft + roadWidth - 92, originY + map.height);
  ctx.moveTo(originX, roadTop + 82);
  ctx.lineTo(originX + map.width, roadTop + 82);
  ctx.moveTo(originX, roadTop + roadHeight - 82);
  ctx.lineTo(originX + map.width, roadTop + roadHeight - 82);
  ctx.stroke();
  ctx.setLineDash([]);

  const buildingColors = [
    ["#4b5564", "#7d8998"], ["#5b4f55", "#967b7e"],
    ["#4b5960", "#7d9494"], ["#62564d", "#9b886f"]
  ];
  for (const object of cityTileObjects(tileX, tileY)) {
    if (object.kind === "building") {
      if (destroyedBuildings.has(object.id)) continue;
      const index = Number(object.id.split(":").at(-1));
      const [color, accent] = buildingColors[index];
      drawBuilding(originX + object.x - tileX * map.width, originY + object.y - tileY * map.height, object.width, object.height, color, accent);
      continue;
    }
    if (destroyedCars.has(object.id)) continue;
    const carX = originX + object.x + object.width / 2 - tileX * map.width;
    const carY = originY + object.y + object.height / 2 - tileY * map.height;
    drawCar(carX, carY, object.angle, object.color);
    if (object.hp < object.maxHp) {
      ctx.fillStyle = "#000";
      ctx.fillRect(carX - 20, carY - 25, 40, 4);
      ctx.fillStyle = "#ef476f";
      ctx.fillRect(carX - 20, carY - 25, 40 * Math.max(0, object.hp / object.maxHp), 4);
    }
  }
}

function drawMap() {
  const left = Math.floor((camera.x - W / 2) / map.width) - 1;
  const right = Math.ceil((camera.x + W / 2) / map.width) + 1;
  const top = Math.floor((camera.y - H / 2) / map.height) - 1;
  const bottom = Math.ceil((camera.y + H / 2) / map.height) + 1;

  for (let tileY = top; tileY <= bottom; tileY++) {
    for (let tileX = left; tileX <= right; tileX++) {
      const originX = tileX * map.width - camera.x + W / 2;
      const originY = tileY * map.height - camera.y + H / 2;
      ctx.fillStyle = (tileX + tileY) % 2 === 0 ? "#171b29" : "#1a2030";
      ctx.fillRect(originX, originY, map.width, map.height);

      ctx.strokeStyle = "#242b3e";
      ctx.lineWidth = 1;
      for (let x = 0; x <= map.width; x += 48) {
        ctx.beginPath();
        ctx.moveTo(originX + x, originY);
        ctx.lineTo(originX + x, originY + map.height);
        ctx.stroke();
      }
      for (let y = 0; y <= map.height; y += 48) {
        ctx.beginPath();
        ctx.moveTo(originX, originY + y);
        ctx.lineTo(originX + map.width, originY + y);
        ctx.stroke();
      }

      drawCityTile(originX, originY, tileX, tileY);
    }
  }
}

function drawBoss(boss, x, y) {
  ctx.save();
  ctx.translate(x, y);
  if (boss.type === "giantZombieRat") {
    const direction = directionToPlayer(boss);
    ctx.rotate(Math.atan2(direction.y, direction.x));
    ctx.fillStyle = "#171a18";
    ctx.beginPath();
    ctx.ellipse(-8, 5, 34, 25, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#5c5141";
    ctx.beginPath();
    ctx.ellipse(9, 0, 30, 22, 0, 0, Math.PI * 2);
    ctx.ellipse(29, -2, 19, 17, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#75634a";
    ctx.beginPath();
    ctx.ellipse(20, -17, 8, 12, -.35, 0, Math.PI * 2);
    ctx.ellipse(38, -14, 7, 10, .3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#8ef05b";
    ctx.fillRect(35, -8, 5, 4);
    ctx.fillStyle = "#17110e";
    ctx.fillRect(47, 2, 5, 4);
    ctx.fillStyle = "#fff1cc";
    ctx.fillRect(35, 9, 4, 11);
    ctx.fillRect(43, 9, 4, 9);
    ctx.strokeStyle = "#b6a083";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-35, 8);
    ctx.quadraticCurveTo(-56, 18, -48, 32);
    ctx.quadraticCurveTo(-42, 39, -56, 42);
    ctx.stroke();
  } else {
    ctx.fillStyle = "#292f2d";
    ctx.beginPath();
    ctx.ellipse(0, 8, 34, 43, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#52634e";
    ctx.beginPath();
    ctx.ellipse(0, -13, 25, 25, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#788367";
    ctx.fillRect(-43, -25, 27, 53);
    ctx.fillRect(17, -20, 34, 59);
    ctx.fillStyle = "#343a35";
    ctx.fillRect(-42, 18, 27, 18);
    ctx.fillRect(18, 25, 34, 18);
    ctx.fillStyle = "#d96d52";
    ctx.fillRect(-12, -18, 7, 5);
    ctx.fillRect(8, -18, 7, 5);
    ctx.fillStyle = "#172019";
    ctx.fillRect(-2, -8, 7, 4);
    ctx.fillStyle = "#8d8773";
    ctx.fillRect(-8, 4, 17, 5);
  }
  ctx.restore();
}

function drawBossArena() {
  if (!activeArena) return;
  const center = screenPosition(activeArena);
  ctx.save();
  ctx.strokeStyle = activeArena.type === "giantZombieRat" ? "#72bd5488" : "#a9a18a88";
  ctx.lineWidth = 7;
  ctx.setLineDash([12, 8]);
  ctx.beginPath();
  ctx.arc(center.x, center.y, activeArena.radius - 20, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  for (let index = 0; index < 16; index++) {
    const angle = index / 16 * Math.PI * 2;
    const x = center.x + Math.cos(angle) * (activeArena.radius - 20);
    const y = center.y + Math.sin(angle) * (activeArena.radius - 20);
    if (activeArena.type === "giantZombieRat") {
      ctx.fillStyle = "#344b32";
      ctx.beginPath();
      ctx.arc(x, y, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#79b95a";
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.fillStyle = "#a7d75b99";
      ctx.beginPath();
      ctx.arc(x - 5, y - 3, 5, 0, Math.PI * 2);
      ctx.arc(x + 7, y + 4, 4, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = "#706957";
      ctx.fillRect(-23, -14, 46, 28);
      ctx.fillStyle = "#a0967c";
      ctx.fillRect(-14, -8, 24, 7);
      ctx.restore();
    }
  }
  ctx.restore();
}

function drawBossTelegraph(boss, position) {
  if (boss.bossState === "ratWindup") {
    ctx.strokeStyle = "#ff3d4fbb";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(position.x, position.y);
    ctx.lineTo(position.x + Math.cos(boss.attackDirection) * 310, position.y + Math.sin(boss.attackDirection) * 310);
    ctx.stroke();
  } else if (boss.bossState === "slamWindup") {
    ctx.fillStyle = "#f0a14e44";
    ctx.beginPath();
    ctx.moveTo(position.x, position.y);
    ctx.arc(position.x, position.y, 230, boss.attackDirection - Math.PI / 4, boss.attackDirection + Math.PI / 4);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#ffd07a99";
    ctx.lineWidth = 3;
    ctx.stroke();
  } else if (boss.bossState === "throwWindup") {
    ctx.strokeStyle = "#ff3d4f88";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(position.x, position.y);
    ctx.lineTo(player.x - camera.x + W / 2, player.y - camera.y + H / 2);
    ctx.stroke();
  }
}

function render() {
  drawMap();
  drawBossArena();

  for (const hazard of bossHazards) {
    const position = screenPosition(hazard);
    ctx.fillStyle = `rgba(83, 174, 55, ${Math.min(.38, hazard.life / 10)})`;
    ctx.beginPath();
    ctx.arc(position.x, position.y, hazard.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#b7df66aa";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  for (const projectile of bossProjectiles) {
    const position = screenPosition(projectile);
    drawCar(position.x, position.y, projectile.angle, "#986f4d");
  }

  for (const drop of carDrops) {
    const position = screenPosition(drop);
    if (position.x < -24 || position.x > W + 24 || position.y < -24 || position.y > H + 24) continue;
    ctx.fillStyle = drop.type === "medkit" ? "#ef476f" : "#ffd166";
    ctx.beginPath();
    ctx.arc(position.x, position.y, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(drop.type === "medkit" ? "+" : "M", position.x, position.y);
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";
  }

  for (const g of gems) {
    if (!isVisible(g, 20)) continue;
    const position = screenPosition(g);
    ctx.fillStyle = "#06d6a0";
    ctx.beginPath();
    ctx.moveTo(position.x, position.y - 7);
    ctx.lineTo(position.x + 7, position.y);
    ctx.lineTo(position.x, position.y + 7);
    ctx.lineTo(position.x - 7, position.y);
    ctx.closePath();
    ctx.fill();
  }

  for (const p of projectiles) {
    if (!isVisible(p, 20)) continue;
    const position = screenPosition(p);
    if (p.orbiting) {
      ctx.save();
      ctx.translate(position.x, position.y);
      ctx.rotate(p.angle * 2);
      ctx.fillStyle = "#e8fbff";
      ctx.strokeStyle = "#46d9f2";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.lineTo(3, -3);
      ctx.lineTo(10, 0);
      ctx.lineTo(3, 3);
      ctx.lineTo(0, 10);
      ctx.lineTo(-3, 3);
      ctx.lineTo(-10, 0);
      ctx.lineTo(-3, -3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      continue;
    }
    ctx.fillStyle = "#ffd166";
    ctx.beginPath();
    ctx.arc(position.x, position.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  for (const e of enemies) {
    if (!isVisible(e, e.radius + 30)) continue;
    const position = screenPosition(e);
    if (e.type === "giantZombieRat" || e.type === "giantEnhancedZombie") {
      drawBossTelegraph(e, position);
      drawBoss(e, position.x, position.y);
    } else {
      drawSprite(e.type, position.x, position.y, e.radius * 2.5);
    }
    if (e.boss || e.hp < e.maxHp) {
      ctx.fillStyle = "#000";
      ctx.fillRect(position.x - 28, position.y - e.radius - 10, 56, 5);
      ctx.fillStyle = "#ef476f";
      ctx.fillRect(position.x - 28, position.y - e.radius - 10, 56 * Math.max(0, e.hp / e.maxHp), 5);
    }
  }

  ctx.fillStyle = player.invincible > 0 ? "#ffffff" : "#4cc9f0";
  ctx.beginPath();
  ctx.arc(W / 2, H / 2, player.radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#fff";
  ctx.font = "bold 14px sans-serif";
  for (const f of effects) {
    if (!isVisible(f, 40)) continue;
    const position = screenPosition(f);
    ctx.globalAlpha = f.life / f.max;
    ctx.fillText(f.text, position.x, position.y - (1 - f.life / f.max) * 25);
  }
  ctx.globalAlpha = 1;
}

function updateHud() {
  const minutes = Math.floor(stats.time / 60).toString().padStart(2, "0");
  const seconds = Math.floor(stats.time % 60).toString().padStart(2, "0");
  time.textContent = `${minutes}:${seconds}`;
  if (activeArena) {
    const remaining = Math.ceil(bossFightRemaining);
    bossTimer.textContent = `${Math.floor(remaining / 60).toString().padStart(2, "0")}:${(remaining % 60).toString().padStart(2, "0")}`;
    bossTimerHud.classList.remove("hidden");
  } else {
    bossTimerHud.classList.add("hidden");
  }
  level.textContent = player.level;
  kills.textContent = stats.kills;
  hpFill.style.width = `${Math.max(0, player.hp / player.maxHp * 100)}%`;
  xpFill.style.width = `${player.xp / player.nextXp * 100}%`;
  weaponLabel.textContent = `무기 ${player.weapons.length} / 2`;
  passiveLabel.textContent = `패시브 ${player.passives.length} / 3`;
  weaponSlots.innerHTML = renderInventorySlots(player.weapons, 2, weaponCatalog);
  passiveSlots.innerHTML = renderInventorySlots(player.passives, 3, passiveCatalog);
}

function renderInventorySlots(items, maxSlots, catalog) {
  const iconClass = catalog === passiveCatalog ? "slot-book" : "slot-weapon";
  return Array.from({ length: maxSlots }, (_, index) => {
    const item = items[index];
    if (!item) return '<span class="inventory-slot empty">+</span>';
    const data = catalog.find(entry => entry.id === item.id);
    const iconStyle = catalog === passiveCatalog ? `--book-color: ${data.color}` : `--weapon-color: ${data.color}`;
    return `<span class="inventory-slot filled" style="${iconStyle}" title="${data.name} Lv.${item.level}">
      <span class="${iconClass}">${data.icon}</span><small>${data.name}</small><b>Lv.${item.level}</b>
    </span>`;
  }).join("");
}

function updatePauseStats() {
  const weapons = player.weapons.map(weapon => {
    const data = weaponCatalog.find(item => item.id === weapon.id);
    return `${data.name} Lv.${weapon.level}`;
  }).join(", ") || "없음";
  const passives = player.passives.map(passive => {
    const data = passiveCatalog.find(item => item.id === passive.id);
    return `${data.name} Lv.${passive.level}`;
  }).join(", ") || "없음";
  pauseStats.innerHTML = `
    <b>현재 능력치</b><br>
    체력: ${Math.ceil(player.hp)} / ${player.maxHp}<br>
    이동 속도: ${Math.round(player.speed)}<br>
    공격력: ${Math.round(player.damage)}<br>
    공격 주기: ${player.attackSpeed.toFixed(2)}초<br>
    경험치 획득 범위: ${Math.round(player.pickup)}<br>
    <br><b>장착 무기 (${player.weapons.length}/2)</b><br>${weapons}<br>
    <b>장착 패시브 (${player.passives.length}/3)</b><br>${passives}
  `;
}

function endGame(won) {
  if (state === "gameover" || state === "victory") return;
  state = won ? "victory" : "gameover";
  hud.classList.add("hidden");
  pause.classList.add("hidden");
  joystick.classList.add("hidden");
  result.classList.remove("hidden");
  resultTitle.textContent = won ? "첫 번째 맵 클리어!" : "게임 오버";
  if (won) nextMapButton.classList.remove("hidden");
  else nextMapButton.classList.add("hidden");
  resultText.innerHTML =
    `생존 시간: ${Math.floor(stats.time)}초<br>` +
    `처치 수: ${stats.kills}<br>` +
    `보스 처치: ${stats.bossKills}<br>` +
    `레벨: ${player.level}<br>` +
    `점수: ${stats.score}`;
}

function loop(now) {
  const dt = Math.min((now - last) / 1000 || 0, .05);
  last = now;
  if (state === "playing") update(dt);
  render();
  requestAnimationFrame(loop);
}

const joystickVector = { x: 0, y: 0 };
let joystickId = null;

function moveJoystick(touch) {
  const rect = joystick.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  let x = touch.clientX - cx;
  let y = touch.clientY - cy;
  const distance = Math.hypot(x, y);
  const max = 45;
  if (distance > max) {
    x = x / distance * max;
    y = y / distance * max;
  }
  joystickVector.x = x / max;
  joystickVector.y = y / max;
  stick.style.transform = `translate(${x}px, ${y}px)`;
}

joystick.addEventListener("touchstart", e => {
  e.preventDefault();
  if (joystickId === null) {
    joystickId = e.changedTouches[0].identifier;
    moveJoystick(e.changedTouches[0]);
  }
}, { passive: false });

joystick.addEventListener("touchmove", e => {
  e.preventDefault();
  for (const touch of e.changedTouches) {
    if (touch.identifier === joystickId) moveJoystick(touch);
  }
}, { passive: false });

joystick.addEventListener("touchend", e => {
  e.preventDefault();
  for (const touch of e.changedTouches) {
    if (touch.identifier === joystickId) {
      joystickId = null;
      joystickVector.x = joystickVector.y = 0;
      stick.style.transform = "";
    }
  }
}, { passive: false });

addEventListener("keydown", e => {
  keys.add(e.code);
  if (e.code === "Escape") togglePause();
  if (state === "levelup" && ["Digit1", "Digit2", "Digit3"].includes(e.code)) {
    document.querySelectorAll(".card")[Number(e.code.at(-1)) - 1]?.click();
  }
});
addEventListener("keyup", e => keys.delete(e.code));

start.onclick = startGame;
codexButton.onclick = openCodex;
closeCodex.onclick = closeCodexView;
backToCorridor.onclick = closeRoomView;
document.querySelectorAll(".corridor-door").forEach(door => {
  door.onclick = () => showRoom(door.dataset.room);
});
again.onclick = startGame;
nextMapButton.onclick = openNextMapSelection;
returnFromMapSelect.onclick = returnFromMapSelection;
pause.onclick = togglePause;
resume.onclick = togglePause;
restart.onclick = startGame;
returnToMenu.onclick = returnToMainMenu;

requestAnimationFrame(loop);
