/* =========================================
   1. КЕРУВАННЯ СКРОЛОМ ТА ЗАВАНТАЖЕННЯМ
   ========================================= */
function forceScrollTop() { 
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
}
window.onload = forceScrollTop;
window.onbeforeunload = forceScrollTop;

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false, // ВИМКНЕНО на телефонах для кращої продуктивності
  touchMultiplier: 2,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    lenis.scrollTo(this.getAttribute('href'));
  });
});

/* =========================================
   2. ДАНІ ПРОДУКТУ ТА РЕЦЕПТИ (UA / EN)
   ========================================= */
const drinkRecipes = {
  ua: {
    winter: [
      { 
        name: "HOT TODDY", 
        short: "40мл сиропу, 150мл окропу, лимон. Ідеальний зігріваючий напій.", 
        full: "Класичний зимовий напій, що зігріває душу.\n\nІнгредієнти:\n• 40 мл зимового сиропу\n• 150 мл окропу або чорного чаю\n• Слайс лимона\n• Паличка кориці для прикраси\n\nПриготування:\nЗмішайте сироп з гарячою водою у чашці. Додайте лимон та корицю. Насолоджуйтесь теплом.", 
        icon: "assets/winter-icon-1.png", 
        detailImage: "assets/winter-picture-1.jpg" 
      },
      { 
        name: "SPICED COFFEE", 
        short: "Додайте 30мл сиропу у чорну каву замість цукру для пряного аромату.", 
        full: "Кава з новим характером.\n\nІнгредієнти:\n• 30 мл зимового сиропу\n• 150 мл свіжозвареної чорної кави\n• Збиті вершки (за бажанням)\n\nПриготування:\nЗваріть вашу улюблену каву. Додайте сироп замість цукру. За бажанням прикрасьте вершками.", 
        icon: "assets/winter-icon-2.png", 
        detailImage: "assets/winter-picture-2.jpg" 
      },
      { 
        name: "FOREST TEA", 
        short: "Трав'яний чай, 30мл сиропу, паличка кориці. Справжня магія лісу.", 
        full: "Аромат лісу у вашій чашці.\n\nІнгредієнти:\n• 30 мл зимового сиропу\n• 200 мл трав'яного чаю\n• Гілочка розмарину\n\nПриготування:\nЗаваріть чай. Додайте сироп та перемішайте. Прикрасьте розмарином для підсилення аромату.", 
        icon: "assets/winter-icon-3.png", 
        detailImage: "assets/winter-picture-3.jpg" 
      }
    ],
    summer: [
      { 
        name: "CLASSIC TONIC", 
        short: "Келих з льодом, 30мл сиропу, 150мл тоніка. Прикрасьте розмарином.", 
        full: "Освіжаюча класика для спекотного дня.\n\nІнгредієнти:\n• 30 мл літнього сиропу\n• 150 мл тоніка\n• Лід\n• Розмарин\n\nПриготування:\nНаповніть келих льодом. Налийте сироп та тонік. Обережно перемішайте.", 
        icon: "assets/summer-icon-1.png", 
        detailImage: "assets/summer-picture-1.jpg" 
      },
      { 
        name: "MOON SPRITZ", 
        short: "40мл сиропу, 60мл Просекко, сплеш газованої води та слайс апельсина.", 
        full: "Легкий та ігристий аперитив.\n\nІнгредієнти:\n• 40 мл літнього сиропу\n• 60 мл Просекко\n• 20 мл газованої води\n• Апельсин\n\nПриготування:\nУ келих з льодом налийте всі інгредієнти. Прикрасьте слайсом апельсина.", 
        icon: "assets/summer-icon-2.png", 
        detailImage: "assets/summer-picture-2.jpg" 
      },
      { 
        name: "NATURE SOUR", 
        short: "30мл сиропу, 20мл лимонного соку, лід. Збийте у шейкері.", 
        full: "Кисло-солодкий баланс природи.\n\nІнгредієнти:\n• 30 мл літнього сиропу\n• 20 мл лимонного соку\n• Лід\n• Яєчний білок (опціонально)\n\nПриготування:\nЗбийте всі інгредієнти у шейкері з льодом. Процідіть у келих.", 
        icon: "assets/summer-icon-3.png", 
        detailImage: "assets/summer-picture-3.jpg" 
      }
    ]
  },
  en: {
    winter: [
      { 
        name: "HOT TODDY", 
        short: "40ml syrup, 150ml boiling water, lemon. Perfect warming drink.", 
        full: "A classic winter drink that warms the soul.\n\nIngredients:\n• 40 ml winter syrup\n• 150 ml boiling water or black tea\n• Lemon slice\n• Cinnamon stick for garnish\n\nPreparation:\nMix syrup with hot water in a cup. Add lemon and cinnamon. Enjoy the warmth.", 
        icon: "assets/winter-icon-1.png", 
        detailImage: "assets/winter-picture-1.jpg" 
      },
      { 
        name: "SPICED COFFEE", 
        short: "Add 30ml syrup to black coffee instead of sugar for a spicy aroma.", 
        full: "Coffee with a new character.\n\nIngredients:\n• 30 ml winter syrup\n• 150 ml freshly brewed black coffee\n• Whipped cream (optional)\n\nPreparation:\nBrew your favorite coffee. Add syrup instead of sugar. Garnish with cream if desired.", 
        icon: "assets/winter-icon-2.png", 
        detailImage: "assets/winter-picture-2.jpg" 
      },
      { 
        name: "FOREST TEA", 
        short: "Herbal tea, 30ml syrup, cinnamon stick. Real forest magic.", 
        full: "Forest aroma in your cup.\n\nIngredients:\n• 30 ml winter syrup\n• 200 ml herbal tea\n• Rosemary sprig\n\nPreparation:\nBrew the tea. Add syrup and stir. Garnish with rosemary to enhance the aroma.", 
        icon: "assets/winter-icon-3.png", 
        detailImage: "assets/winter-picture-3.jpg" 
      }
    ],
    summer: [
      { 
        name: "CLASSIC TONIC", 
        short: "Glass with ice, 30ml syrup, 150ml tonic. Garnish with rosemary.", 
        full: "Refreshing classic for a hot day.\n\nIngredients:\n• 30 ml summer syrup\n• 150 ml tonic water\n• Ice\n• Rosemary\n\nPreparation:\nFill a glass with ice. Pour syrup and tonic. Stir gently.", 
        icon: "assets/summer-icon-1.png", 
        detailImage: "assets/summer-picture-1.jpg" 
      },
      { 
        name: "MOON SPRITZ", 
        short: "40ml syrup, 60ml Prosecco, splash of soda water and an orange slice.", 
        full: "Light and bubbly aperitif.\n\nIngredients:\n• 40 ml summer syrup\n• 60 ml Prosecco\n• 20 ml soda water\n• Orange\n\nPreparation:\nPour all ingredients into a glass with ice. Garnish with an orange slice.", 
        icon: "assets/summer-icon-2.png", 
        detailImage: "assets/summer-picture-2.jpg" 
      },
      { 
        name: "NATURE SOUR", 
        short: "30ml syrup, 20ml lemon juice, ice. Shake well.", 
        full: "Sweet and sour balance of nature.\n\nIngredients:\n• 30 ml summer syrup\n• 20 ml lemon juice\n• Ice\n• Egg white (optional)\n\nPreparation:\nShake all ingredients in a shaker with ice. Strain into a glass.", 
        icon: "assets/summer-icon-3.png", 
        detailImage: "assets/summer-picture-3.jpg" 
      }
    ]
  }
};

const copy = {
  ua: {
    tagline: "Магія дикої природи у кожній краплі. Крафтовий медовий еліксир, створений за стародавніми рецептами для сучасних ритуалів.", 
    heroBtn: "ДІЗНАТИСЯ БІЛЬШЕ",
    productTitle: "Колекції", drinkTitle: "Мистецтво споживання", change: "Змінити смак",
    winter: "Зимова казка у пляшці. Глибокий смак темного меду поєднаний з зігріваючою корицею, бодяном та пікантним коренем імбиру. Ідеальний компаньйон для затишних вечорів, гарячого чаю або авторського глінтвейну.",
    summer: "Подих літнього вітру. Легкий та освіжаючий букет з лугових трав, прохолодної м'яти та соковитого лайма на основі ніжного квіткового меду. Додає вишуканості лимонадам та легким аперитивам у спекотний день.",
    editionSuffix: "ВЕРСІЯ",
    aboutLink: "Про нас", aboutTitle: "Наша історія",
    aboutText: "BRAND NAME — це історія про повернення до витоків. Ми віримо, що природа має відповіді на всі питання, а смак може бути не просто відчуттям, а емоцією.<br><br>Наші сиропи створюються вручну, невеликими партіями, щоб зберегти душу кожного інгредієнта. Ми використовуємо лише натуральний мед, зібраний на диких пасіках, та трави, що виросли під сонцем, а не в теплицях.<br><br>Це не просто додаток до напоїв. Це спроба зупинити час, вдихнути аромат лісу чи поля і відчути справжній смак життя.",
    // КОНТАКТИ
    contactTitle: "Напишіть нам",
    contactTopic: "Тема звернення",
    contactOptions: { order: "Замовлення продукту", question: "Запитання", collab: "Співпраця" },
    contactName: "Ваше ім'я",
    contactContact: "Email або Telegram",
    contactMessage: "Повідомлення",
    contactPlaceholderName: "Олександр",
    contactPlaceholderContact: "@username або email",
    contactPlaceholderMessage: "Я хочу замовити...",
    contactBtn: "Надіслати"
  },
  en: {
    tagline: "Magic of wild nature in every drop. Craft honey elixir created from ancient recipes for modern rituals.", 
    heroBtn: "LEARN MORE",
    productTitle: "Collections", drinkTitle: "Art of Drinking", change: "Change Flavor",
    winter: "Winter fairy tale in a bottle. The deep taste of dark honey combined with warming cinnamon, star anise, and spicy ginger root. The perfect companion for cozy evenings, hot tea, or signature mulled wine.",
    summer: "Breath of the summer wind. Light and refreshing bouquet of meadow herbs, cool mint, and juicy lime based on delicate floral honey. Adds sophistication to lemonades and light aperitifs on a hot day.",
    editionSuffix: "EDITION",
    aboutLink: "About Us", aboutTitle: "Our Story",
    aboutText: "BREWMIEL is a story about returning to the roots. We believe that nature has answers to all questions, and taste can be not just a sensation, but an emotion.<br><br>Our syrups are handcrafted in small batches to preserve the soul of every ingredient. We use only natural honey collected from wild apiaries and herbs grown under the sun, not in greenhouses.<br><br>It's not just an additive to drinks. It's an attempt to stop time, breathe in the scent of the forest or field, and feel the true taste of life.",
    // CONTACTS
    contactTitle: "Contact Us",
    contactTopic: "Subject",
    contactOptions: { order: "Product Order", question: "Question", collab: "Collaboration" },
    contactName: "Your Name",
    contactContact: "Email or Telegram",
    contactMessage: "Message",
    contactPlaceholderName: "Alex",
    contactPlaceholderContact: "@username or email",
    contactPlaceholderMessage: "I want to order...",
    contactBtn: "Send"
  }
};

const flagUA = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480"><g fill-rule="evenodd" stroke-width="1pt"><path fill="#ffd700" d="M0 0h640v480H0z"/><path fill="#0057b8" d="M0 0h640v240H0z"/></g></svg>`;
const flagUK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480"><path fill="#012169" d="M0 0h640v480H0z"/><path fill="#FFF" d="M75 0l244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z"/><path fill="#C8102E" d="M424 281l216 159v40L369 281h55zm-184 20l6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z"/><path fill="#FFF" d="M241 0v480h160V0H241zM0 160v160h640V160H0z"/><path fill="#C8102E" d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z"/></svg>`;

/* =========================================
   3. ЛОГІКА ІНТЕРФЕЙСУ
   ========================================= */
let lang = 'ua';
let index = 0; 

const edition = document.getElementById('edition');
const desc = document.getElementById('productDesc');
const changeBtn = document.getElementById('changeBtn');
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const floatingLang = document.getElementById('floatingLang');
const langFlag = document.getElementById('langFlag');
const winterBottle = document.querySelector('.bottle-card.winter');
const summerBottle = document.querySelector('.bottle-card.summer');

function updateProduct() {
  if (index === 0) {
    winterBottle.classList.add('active');
    summerBottle.classList.remove('active');
    document.body.setAttribute('data-product', 'winter');
  } else {
    summerBottle.classList.add('active');
    winterBottle.classList.remove('active');
    document.body.setAttribute('data-product', 'summer');
  }
  
  const key = index === 0 ? 'winter' : 'summer';
  const editionName = lang === 'ua' ? (index === 0 ? 'ЗИМОВА' : 'ЛІТНЯ') : (index === 0 ? 'WINTER' : 'SUMMER');
  edition.innerText = `${editionName} ${copy[lang].editionSuffix}`;
  desc.innerText = copy[lang][key];

  updateDrinks(key);
}

function updateDrinks(season) {
    const recipes = drinkRecipes[lang][season];
    document.getElementById('drinkTitle1').innerText = recipes[0].name;
    document.getElementById('drinkDesc1').innerText = recipes[0].short;
    document.getElementById('drinkTitle2').innerText = recipes[1].name;
    document.getElementById('drinkDesc2').innerText = recipes[1].short;
    document.getElementById('drinkTitle3').innerText = recipes[2].name;
    document.getElementById('drinkDesc3').innerText = recipes[2].short;
    document.getElementById('drinkImg1').src = recipes[0].icon;
    document.getElementById('drinkImg2').src = recipes[1].icon;
    document.getElementById('drinkImg3').src = recipes[2].icon;
    document.getElementById('drinkImg1').style.display = 'block';
    document.getElementById('drinkImg2').style.display = 'block';
    document.getElementById('drinkImg3').style.display = 'block';
}

changeBtn.onclick = () => { index = (index + 1) % 2; updateProduct(); };
toggleSwitch.addEventListener('change', (e) => {
  if (e.target.checked) document.body.classList.add('light');
  else document.body.classList.remove('light');
});

function applyLang() {
  // Основні тексти
  document.getElementById('tagline').innerText = copy[lang].tagline;
  document.getElementById('productTitle').innerText = copy[lang].productTitle;
  document.getElementById('drinkTitle').innerText = copy[lang].drinkTitle;
  document.getElementById('changeBtn').innerText = copy[lang].change;
  document.getElementById('aboutBtn').innerText = copy[lang].aboutLink;
  document.getElementById('aboutTitle').innerText = copy[lang].aboutTitle;
  document.getElementById('aboutText').innerHTML = copy[lang].aboutText;
  const heroBtn = document.getElementById('heroBtn');
  if(heroBtn) heroBtn.innerText = copy[lang].heroBtn;

  // Тексти контактної форми
  document.getElementById('contactTitle').innerText = copy[lang].contactTitle;
  document.getElementById('lblTopic').innerText = copy[lang].contactTopic;
  document.getElementById('lblName').innerText = copy[lang].contactName;
  document.getElementById('lblContact').innerText = copy[lang].contactContact;
  document.getElementById('lblMessage').innerText = copy[lang].contactMessage;
  document.getElementById('btnSubmit').innerText = copy[lang].contactBtn;
  
  // Плейсхолдери форми
  document.getElementById('name').placeholder = copy[lang].contactPlaceholderName;
  document.getElementById('email').placeholder = copy[lang].contactPlaceholderContact;
  document.getElementById('message').placeholder = copy[lang].contactPlaceholderMessage;

  // Опції селекту
  document.getElementById('optOrder').innerText = copy[lang].contactOptions.order;
  document.getElementById('optQuestion').innerText = copy[lang].contactOptions.question;
  document.getElementById('optCollab').innerText = copy[lang].contactOptions.collab;

  if (lang === 'ua') { langFlag.innerHTML = flagUK; } else { langFlag.innerHTML = flagUA; }
  updateProduct(); 
}
floatingLang.onclick = () => { lang = (lang === 'ua') ? 'en' : 'ua'; applyLang(); };

/* =========================================
   4. МОДАЛЬНІ ВІКНА
   ========================================= */
const contactModal = document.getElementById("contactModal");
const contactClose = document.querySelector(".contact-close");
const contactTriggers = document.querySelectorAll('.contact-trigger');
const aboutModal = document.getElementById("aboutModal");
const aboutClose = document.querySelector(".about-close");
const aboutBtn = document.getElementById("aboutBtn");
const recipeModal = document.getElementById("recipeModal");
const recipeClose = document.querySelector(".recipe-close");

contactTriggers.forEach(btn => { 
    btn.addEventListener('click', () => { 
        contactModal.classList.add('show'); 
        document.body.classList.add('no-scroll');
        lenis.stop();
    }); 
});

aboutBtn.addEventListener('click', (e) => { 
    e.preventDefault(); 
    aboutModal.classList.add('show'); 
    document.body.classList.add('no-scroll');
    lenis.stop();
});

function openRecipe(cardIndex) {
    const season = index === 0 ? 'winter' : 'summer';
    const recipeData = drinkRecipes[lang][season][cardIndex];
    document.getElementById('recipeTitle').innerText = recipeData.name;
    document.getElementById('recipeText').innerText = recipeData.full;
    document.getElementById('recipeImg').src = recipeData.detailImage;
    recipeModal.classList.add('show');
    document.body.classList.add('no-scroll');
    lenis.stop();
}

function closeContactModal() { contactModal.classList.remove('show'); document.body.classList.remove('no-scroll'); lenis.start(); }
function closeAboutModal() { aboutModal.classList.remove('show'); document.body.classList.remove('no-scroll'); lenis.start(); }
function closeRecipeModal() { recipeModal.classList.remove('show'); document.body.classList.remove('no-scroll'); lenis.start(); }

contactClose.onclick = closeContactModal;
aboutClose.onclick = closeAboutModal;
recipeClose.onclick = closeRecipeModal;

window.onclick = function(event) { 
    if (event.target == contactModal) closeContactModal();
    if (event.target == aboutModal) closeAboutModal();
    if (event.target == recipeModal) closeRecipeModal();
}

/* =========================================
   5. ОБРОБКА ФОРМИ
   ========================================= */
const messageInput = document.getElementById('message');
messageInput.addEventListener('input', function() { this.style.height = 'auto'; this.style.height = (this.scrollHeight) + 'px'; });
const form = document.getElementById("ajaxForm");
const statusMsg = document.getElementById("statusMessage");
async function handleSubmit(event) {
  event.preventDefault();
  const data = new FormData(event.target);
  const submitBtn = form.querySelector('.submit-btn');
  const originalText = submitBtn.innerText;
  submitBtn.innerText = "Відправляємо...";
  submitBtn.disabled = true;
  fetch(event.target.action, { method: form.method, body: data, headers: { 'Accept': 'application/json' } })
  .then(response => {
    if (response.ok) { statusMsg.innerHTML = "Дякуємо! Ваше повідомлення надіслано."; statusMsg.className = "status-message success"; form.reset(); setTimeout(() => { closeContactModal(); statusMsg.innerHTML=""; }, 2000); } 
    else { response.json().then(data => { if (Object.hasOwn(data, 'errors')) { statusMsg.innerHTML = data["errors"].map(error => error["message"]).join(", "); } else { statusMsg.innerHTML = "Сталася помилка. Спробуйте ще раз."; } statusMsg.className = "status-message error"; }) }
  }).catch(error => { statusMsg.innerHTML = "Помилка мережі."; statusMsg.className = "status-message error"; }).finally(() => { submitBtn.innerText = originalText; submitBtn.disabled = false; });
}
form.addEventListener("submit", handleSubmit);

/* =========================================
   6. ІНІЦІАЛІЗАЦІЯ
   ========================================= */
toggleSwitch.checked = false;
document.body.classList.remove('light');
document.body.setAttribute('data-product', 'winter');
applyLang();

// Сніг
const canvas = document.querySelector('.snow');
const ctx = canvas.getContext('2d');
let w, h;
const flakesCount = window.innerWidth < 600 ? 30 : 80;
function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
window.addEventListener('resize', resize); resize();
const flakes = [...Array(flakesCount)].map(() => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 2 + 1, s: Math.random() * 1 + 0.5 }));
function snow() { 
  ctx.clearRect(0, 0, w, h); 
  ctx.fillStyle = document.body.classList.contains('light') ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.6)'; 
  ctx.beginPath(); 
  flakes.forEach(f => { ctx.moveTo(f.x, f.y); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); f.y += f.s; if (f.y > h) f.y = 0; }); 
  ctx.fill(); 
  requestAnimationFrame(snow); 
}

const date = new Date();
const month = date.getMonth(); 
const isWinter = (month === 11 || month === 0 || month === 1);

if (isWinter) {
    snow();
} else {
    canvas.style.display = 'none'; 
}