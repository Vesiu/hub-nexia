let isAdmin = false;
let userItems = [];
let linaItems = [];

// Déverrouillage Admin (admin123)
function toggleAdmin() {
  if (!isAdmin) {
    const pwd = prompt("Mot de passe administrateur :");
    if (pwd === "admin123") {
      isAdmin = true;
      document.getElementById("admin-btn-text").textContent = "Admin (Actif)";
      document.querySelectorAll(".admin-eye").forEach(el => el.style.display = "inline-block");
      alert("Mode Administrateur déverrouillé !");
    } else if (pwd !== null) {
      alert("Mot de passe incorrect.");
    }
  } else {
    isAdmin = false;
    document.getElementById("admin-btn-text").textContent = "Admin";
    document.querySelectorAll(".admin-eye").forEach(el => el.style.display = "none");
    alert("Mode Administrateur désactivé.");
  }
}

// Masquage / affichage de section avec l'œil
function toggleSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (el) {
    el.classList.toggle("section-hidden");
  }
}

// Navigation entre la page d'accueil et le simulateur
function showTradePage() {
  document.getElementById("page-hub").classList.add("hidden");
  document.getElementById("page-trade").classList.remove("hidden");
  window.scrollTo(0, 0);
}

function showHubPage() {
  document.getElementById("page-trade").classList.add("hidden");
  document.getElementById("page-hub").classList.remove("hidden");
  window.scrollTo(0, 0);
}

// Ouvrir directement le simulateur avec un item du shop
function openTradeWith(itemName, rate) {
  showTradePage();
  linaItems = [{ name: itemName, rate: rate }];
  renderTrade();
}

// Ajout manuel d'un Brainrot
function addItem(side) {
  const name = prompt("Nom de l'item :");
  if (!name) return;
  const rateInput = prompt("Production par seconde en Millions (ex: 100 pour 100M/s, 1200 pour 1.2B/s) :", "100");
  const rate = (parseFloat(rateInput) || 0) * 1000000;

  if (side === "user") {
    userItems.push({ name, rate });
  } else {
    linaItems.push({ name, rate });
  }
  renderTrade();
}

function removeItem(side, index) {
  if (side === "user") userItems.splice(index, 1);
  else linaItems.splice(index, 1);
  renderTrade();
}

function formatRate(num) {
  if (num >= 1000000000) return `+${(num / 1000000000).toFixed(1)} B/s`;
  if (num >= 1000000) return `+${(num / 1000000).toFixed(0)} M/s`;
  return `+${num} /s`;
}

// Mise à jour de l'affichage de l'échange
function renderTrade() {
  const userContainer = document.getElementById("user-items");
  const linaContainer = document.getElementById("lina-items");

  userContainer.innerHTML = userItems.length === 0
    ? '<p style="text-align:center;font-size:0.75rem;color:#999;padding-top:20px;">Aucun item</p>'
    : userItems.map((item, idx) => `
      <div class="trade-item-row">
        <span>${item.name} (${formatRate(item.rate)})</span>
        <button style="border:none;background:none;color:#f43f5e;font-weight:bold;cursor:pointer;" onclick="removeItem('user', ${idx})">✕</button>
      </div>
    `).join("");

  linaContainer.innerHTML = linaItems.length === 0
    ? '<p style="text-align:center;font-size:0.75rem;color:#999;padding-top:20px;">Aucun item</p>'
    : linaItems.map((item, idx) => `
      <div class="trade-item-row">
        <span>${item.name} (${formatRate(item.rate)})</span>
        <button style="border:none;background:none;color:#f43f5e;font-weight:bold;cursor:pointer;" onclick="removeItem('lina', ${idx})">✕</button>
      </div>
    `).join("");

  const userTotal = userItems.reduce((acc, it) => acc + it.rate, 0);
  const linaTotal = linaItems.reduce((acc, it) => acc + it.rate, 0);
  const cash = parseFloat(document.getElementById("cash-input").value) || 0;

  document.getElementById("user-stat").textContent = `${formatRate(userTotal)} ${cash > 0 ? `(+${cash}€)` : ""}`;
  document.getElementById("lina-stat").textContent = formatRate(linaTotal);

  document.getElementById("summary-text").textContent =
    `Offre : ${userItems.length} item(s) (${formatRate(userTotal)})${cash > 0 ? ` + ${cash} €` : ""} ➔ Demandé : ${linaItems.length} item(s) (${formatRate(linaTotal)})`;
}

// Copier la proposition
function copyTrade() {
  const pseudo = document.getElementById("pseudo-input").value.trim() || "Anonyme";
  const discord = document.getElementById("discord-input").value.trim() || "Non renseigné";
  const cash = parseFloat(document.getElementById("cash-input").value) || 0;

  const uStr = userItems.map(it => `• ${it.name} (${formatRate(it.rate)})`).join("\n") || "Aucun item";
  const lStr = linaItems.map(it => `• ${it.name} (${formatRate(it.rate)})`).join("\n") || "Aucun item";

  const message = `🌸 PROPOSITION DE TRADE ROBLOX\n━━━━━━━━━━━━━━━━━━━━\n👤 Pseudo : ${pseudo}\n💬 Discord : ${discord}\n\n📥 OFFRE DU JOUEUR :\n${uStr}\n${cash > 0 ? `💶 Complément : +${cash} €\n` : ""}\n📤 REÇOIT (Shop Lina) :\n${lStr}`;

  navigator.clipboard.writeText(message).then(() => {
    alert("Proposition copiée dans le presse-papier !");
  });
}

function openDiscord() {
  copyTrade();
  window.open("https://discord.gg", "_blank");
}