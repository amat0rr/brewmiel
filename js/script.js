/* ==========================================================================
   1. НАЛАШТУВАННЯ СКРОЛУ (LENIS)
   ========================================================================== */
function forceScrollTop() { 
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
}
window.onload = forceScrollTop;
window.onbeforeunload = forceScrollTop;

// Визначаємо, чи це мобільний пристрій
const isMobile = window.innerWidth < 768;

// Ініціалізація плавного скролу
const lenis = new Lenis({
  duration: 1.2, 
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
  direction: 'vertical', 
  gestureDirection: 'vertical', 
  smooth: !isMobile, // На ПК - плавний, на мобільних - вимкнено (нативний)
  mouseMultiplier: 1, 
  smoothTouch: false, 
  touchMultiplier: 2,
});

function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

// === ВИПРАВЛЕННЯ КНОПКИ "ДІЗНАТИСЯ БІЛЬШЕ" ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault(); 
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
        if (isMobile) {
            // ДЛЯ ТЕЛЕФОНІВ: Використовуємо стандартний скрол браузера
            const headerOffset = 80; // Відступ для хедера
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        } else {
            // ДЛЯ ПК: Використовуємо Lenis
            lenis.scrollTo(targetId);
        }
    }
  });
});

/* ==========================================================================
   2. БАЗА ДАНИХ (ПРОДУКТИ, РЕЦЕПТИ, ТЕКСТИ)
   ========================================================================== */
const productKeys = ['winter', 'classic', 'summer'];

const products = {
    winter: { id: 'winter', img: 'assets/png_winter.png', priceUA: 250, priceEN: 7 },
    classic: { id: 'classic', img: 'assets/png_classic.png', priceUA: 250, priceEN: 7 },
    summer: { id: 'summer', img: 'assets/png_summer.png', priceUA: 250, priceEN: 7 }
};

let cart = []; 

const drinkRecipes = {
  ua: {
    winter: [
      { name: "HOT TODDY", short: "Ідеальний зігріваючий напій для холодних вечорів.", full: "Класичний зимовий напій, що зігріває душу.\n\n<strong>Інгредієнти:</strong>\n• 40 мл зимового сиропу\n• 150 мл окропу або чорного чаю\n• Слайс лимона\n• Паличка кориці\n\n<strong>Приготування:</strong>\nЗмішайте сироп з гарячою водою у чашці. Додайте лимон та корицю. Насолоджуйтесь теплом.", icon: "assets/winter-icon-1.png", detailImage: "assets/winter-picture-1.jpg" },
      { name: "SPICED COFFEE", short: "Ваша улюблена кава з новим пряним характером.", full: "Кава з новим характером.\n\n<strong>Інгредієнти:</strong>\n• 30 мл зимового сиропу\n• 150 мл чорної кави\n• Збиті вершки\n\n<strong>Приготування:</strong>\nЗваріть вашу улюблену каву. Додайте сироп замість цукру. За бажанням прикрасьте вершками.", icon: "assets/winter-icon-2.png", detailImage: "assets/winter-picture-2.jpg" },
      { name: "FOREST TEA", short: "Справжня магія лісу у вашій чашці.", full: "Аромат лісу у вашій чашці.\n\n<strong>Інгредієнти:</strong>\n• 30 мл зимового сиропу\n• 200 мл трав'яного чаю\n• Розмарин\n\n<strong>Приготування:</strong>\nЗаваріть чай. Додайте сироп та перемішайте. Прикрасьте розмарином.", icon: "assets/winter-icon-3.png", detailImage: "assets/winter-picture-3.jpg" }
    ],
    classic: [
      { name: "GOLD RUSH", short: "Золота класика віскі сауер з медовим відтінком.", full: "Сучасна класика, що розкриває смак віскі по-новому.\n\n<strong>Інгредієнти:</strong>\n• 30 мл класичного сиропу\n• 60 мл бурбону\n• 25 мл лимонного соку\n• Лід\n\n<strong>Приготування:</strong>\nЕнергійно збийте всі інгредієнти в шейкері з льодом. Процідіть у стакан з новим льодом.", icon: "assets/winter-icon-1.png", detailImage: "assets/classic-picture-1.jpg" },
      { name: "BEE'S KNEES", short: "Елегантний джин-коктейль епохи сухого закону.", full: "Коктейль, назва якого означає 'вершина досконалості'.\n\n<strong>Інгредієнти:</strong>\n• 25 мл класичного сиропу\n• 60 мл джину\n• 25 мл лимонного соку\n\n<strong>Приготування:</strong>\nЗбийте інгредієнти в шейкері з льодом до охолодження. Процідіть в охолоджений коктейльний келих.", icon: "assets/winter-icon-2.png", detailImage: "assets/classic-picture-2.jpg" },
      { name: "HONEY LEMONADE", short: "Освіжаючий домашній лимонад.", full: "Найкращий спосіб втамувати спрагу.\n\n<strong>Інгредієнти:</strong>\n• 40 мл класичного сиропу\n• 200 мл газованої води\n• 30 мл лимонного соку\n• М'ята\n\n<strong>Приготування:</strong>\nЗмішайте сироп та сік у склянці. Додайте лід та воду. Прикрасьте м'ятою.", icon: "assets/winter-icon-3.png", detailImage: "assets/classic-picture-3.jpg" }
    ],
    summer: [
      { name: "CLASSIC TONIC", short: "Освіжаюча класика з гірчинкою тоніка.", full: "Освіжаюча класика для спекотного дня.\n\n<strong>Інгредієнти:</strong>\n• 30 мл літнього сиропу\n• 150 мл тоніка\n• Лід\n• Розмарин\n\n<strong>Приготування:</strong>\nНаповніть келих льодом. Налийте сироп та тонік. Обережно перемішайте.", icon: "assets/summer-icon-1.png", detailImage: "assets/summer-picture-1.jpg" },
      { name: "MOON SPRITZ", short: "Легкий, ігристий та святковий аперитив.", full: "Легкий та ігристий аперитив.\n\n<strong>Інгредієнти:</strong>\n• 40 мл літнього сиропу\n• 60 мл Просекко\n• 20 мл газованої води\n• Апельсин\n\n<strong>Приготування:</strong>\nУ келих з льодом налийте всі інгредієнти. Прикрасьте слайсом апельсина.", icon: "assets/summer-icon-2.png", detailImage: "assets/summer-picture-2.jpg" },
      { name: "NATURE SOUR", short: "Вишуканий кисло-солодкий баланс.", full: "Кисло-солодкий баланс природи.\n\n<strong>Інгредієнти:</strong>\n• 30 мл літнього сиропу\n• 20 мл лимонного соку\n• Лід\n• Яєчний білок\n\n<strong>Приготування:</strong>\nЗбийте всі інгредієнти у шейкері з льодом. Процідіть у келих.", icon: "assets/summer-icon-3.png", detailImage: "assets/summer-picture-3.jpg" }
    ]
  },
  en: {
    winter: [
      { name: "HOT TODDY", short: "Perfect warming drink for cold evenings.", full: "A classic winter drink that warms the soul.\n\n<strong>Ingredients:</strong>\n• 40 ml winter syrup\n• 150 ml boiling water or black tea\n• Lemon slice\n• Cinnamon stick\n\n<strong>Preparation:</strong>\nMix syrup with hot water in a cup. Add lemon and cinnamon. Enjoy the warmth.", icon: "assets/winter-icon-1.png", detailImage: "assets/winter-picture-1.jpg" },
      { name: "SPICED COFFEE", short: "Your favorite coffee with a new spicy character.", full: "Coffee with a new character.\n\n<strong>Ingredients:</strong>\n• 30 ml winter syrup\n• 150 ml black coffee\n• Whipped cream\n\n<strong>Preparation:</strong>\nBrew your favorite coffee. Add syrup instead of sugar. Garnish with cream if desired.", icon: "assets/winter-icon-2.png", detailImage: "assets/winter-picture-2.jpg" },
      { name: "FOREST TEA", short: "Real forest magic in your cup.", full: "Forest aroma in your cup.\n\n<strong>Ingredients:</strong>\n• 30 ml winter syrup\n• 200 ml herbal tea\n• Rosemary sprig\n\n<strong>Preparation:</strong>\nBrew the tea. Add syrup and stir. Garnish with rosemary.", icon: "assets/winter-icon-3.png", detailImage: "assets/winter-picture-3.jpg" }
    ],
    classic: [
      { name: "GOLD RUSH", short: "Golden classic whiskey sour with a honey touch.", full: "A modern classic that reveals whiskey in a new way.\n\n<strong>Ingredients:</strong>\n• 30 ml classic syrup\n• 60 ml bourbon\n• 25 ml lemon juice\n• Ice\n\n<strong>Preparation:</strong>\nShake all ingredients vigorously with ice. Strain into a rock glass with fresh ice.", icon: "assets/winter-icon-1.png", detailImage: "assets/classic-picture-1.jpg" },
      { name: "BEE'S KNEES", short: "Elegant prohibition-era gin cocktail.", full: "A cocktail appropriately named 'the height of excellence'.\n\n<strong>Ingredients:</strong>\n• 25 мл classic syrup\n• 60 ml gin\n• 25 ml lemon juice\n\n<strong>Preparation:</strong>\nShake ingredients with ice until chilled. Strain into a chilled cocktail glass.", icon: "assets/winter-icon-2.png", detailImage: "assets/classic-picture-2.jpg" },
      { name: "HONEY LEMONADE", short: "Refreshing homemade lemonade.", full: "The best way to quench your thirst.\n\n<strong>Ingredients:</strong>\n• 40 ml classic syrup\n• 200 ml soda water\n• 30 ml lemon juice\n• Mint\n\n<strong>Preparation:</strong>\nMix syrup and juice in a glass. Add ice and water. Garnish with mint.", icon: "assets/winter-icon-3.png", detailImage: "assets/classic-picture-3.jpg" }
    ],
    summer: [
      { name: "CLASSIC TONIC", short: "Refreshing classic with tonic bitterness.", full: "Refreshing classic for a hot day.\n\n<strong>Ingredients:</strong>\n• 30 ml summer syrup\n• 150 ml tonic water\n• Ice\n• Rosemary\n\n<strong>Preparation:</strong>\nFill a glass with ice. Pour syrup and tonic. Stir gently.", icon: "assets/summer-icon-1.png", detailImage: "assets/summer-picture-1.jpg" },
      { name: "MOON SPRITZ", short: "Light, bubbly, and festive aperitif.", full: "Light and bubbly aperitif.\n\n<strong>Ingredients:</strong>\n• 40 ml summer syrup\n• 60 ml Prosecco\n• 20 ml soda water\n• Orange\n\n<strong>Preparation:</strong>\nPour all ingredients into a glass with ice. Garnish with an orange slice.", icon: "assets/summer-icon-2.png", detailImage: "assets/summer-picture-2.jpg" },
      { name: "NATURE SOUR", short: "Exquisite sweet and sour balance.", full: "Sweet and sour balance of nature.\n\n<strong>Ingredients:</strong>\n• 30 ml summer syrup\n• 20 ml lemon juice\n• Ice\n• Egg white\n\n<strong>Preparation:</strong>\nShake all ingredients in a shaker with ice. Strain into a glass.", icon: "assets/summer-icon-3.png", detailImage: "assets/summer-picture-3.jpg" }
    ]
  }
};

const copy = {
  ua: {
    tagline: "Магія дикої природи у кожній краплі. Крафтовий медовий еліксир, створений за стародавніми рецептами для сучасних ритуалів.", 
    heroBtn: "ДІЗНАТИСЯ БІЛЬШЕ",
    productTitle: "Колекції", drinkTitle: "Мистецтво споживання", change: "Змінити смак",
    winter: "Зимова казка у пляшці. Глибокий смак темного меду поєднаний з зігріваючою корицею, бодяном та пікантним коренем імбиру.",
    classic: "Чиста гармонія природи. Збалансований смак різнотрав'я з ледь відчутними нотками квіткового пилку. Універсальний еліксир.",
    summer: "Подих літнього вітру. Легкий та освіжаючий букет з лугових трав, прохолодної м'яти та соковитого лайма.",
    editionSuffix: "ВЕРСІЯ",
    winterName: "Brewmiel. Зимова версія", classicName: "Brewmiel. Класична версія", summerName: "Brewmiel. Літня версія",
    aboutLink: "Про нас", aboutTitle: "Наша історія",
    aboutText: "BREWMIEL — це історія про повернення до витоків. Ми віримо, що природа має відповіді на всі питання, а смак може бути не просто відчуттям, а емоцією.<br><br>Наші сиропи створюються вручну, невеликими партіями, щоб зберегти душу кожного інгредієнта. Ми використовуємо лише натуральний мед, зібраний на диких пасіках, та трави, що виросли під сонцем, а не в теплицях.<br><br>Це не просто додаток до напоїв. Це спроба зупинити час, вдихнути аромат лісу чи поля і відчути справжній смак життя.",
    contactTitle: "Напишіть нам", cartTitle: "Замовити продукт",
    contactOptions: { order: "Замовлення продукту", question: "Запитання", collab: "Співпраця" },
    contactName: "Ваше ім'я", contactContact: "Email або Telegram", contactMessage: "Повідомлення",
    contactPlaceholderName: "Олександр", contactPlaceholderContact: "@username або email", contactPlaceholderMessage: "Я хочу замовити...",
    contactBtn: "Надіслати", addToCart: "Додати до кошика", readMoreBtn: "Детальніше",
    contactTopic: "Тема звернення", total: "Загалом",
    deliveryToggle: "Вказати адресу доставки",
    delService: "Служба доставки",
    delCity: "Місто",
    delBranch: "Відділення / Поштомат",
    delPhone: "Номер телефону",
    delSurname: "Прізвище", 
    delName: "Ім'я",
    paymentInfo: "💰 Оплата: При отриманні"
  },
  en: {
    tagline: "Magic of wild nature in every drop. Craft honey elixir created from ancient recipes for modern rituals.", 
    heroBtn: "LEARN MORE",
    productTitle: "Collections", drinkTitle: "Art of Drinking", change: "Change Flavor",
    winter: "Winter fairy tale in a bottle. The deep taste of dark honey combined with warming cinnamon, star anise, and spicy ginger root.",
    classic: "Pure harmony of nature. Balanced taste of wildflowers with subtle notes of pollen. A universal elixir.",
    summer: "Breath of the summer wind. Light and refreshing bouquet of meadow herbs, cool mint, and juicy lime.",
    editionSuffix: "EDITION",
    winterName: "Brewmiel. Winter Edition", classicName: "Brewmiel. Classic Edition", summerName: "Brewmiel. Summer Edition",
    aboutLink: "About Us", aboutTitle: "Our Story",
    aboutText: "BREWMIEL is a story about returning to the roots. We believe that nature has answers to all questions, and taste can be not just a sensation, but an emotion.<br><br>Our syrups are handcrafted in small batches to preserve the soul of every ingredient. We use only natural honey collected from wild apiaries and herbs grown under the sun, not in greenhouses.<br><br>It's not just an additive to drinks. It's an attempt to stop time, breathe in the scent of the forest or field, and feel the true taste of life.",
    contactTitle: "Contact Us", cartTitle: "Order Product",
    contactOptions: { order: "Product Order", question: "Question", collab: "Collaboration" },
    contactName: "Your Name", contactContact: "Email or Telegram", contactMessage: "Message",
    contactPlaceholderName: "Alex", contactPlaceholderContact: "@username or email", contactPlaceholderMessage: "I want to order...",
    contactBtn: "Send", addToCart: "Add to Cart", readMoreBtn: "Read More",
    contactTopic: "Subject", total: "Total",
    deliveryToggle: "Specify delivery address",
    delService: "Delivery Service",
    delCity: "City",
    delBranch: "Branch / Postomat",
    delPhone: "Phone Number",
    delSurname: "Surname", 
    delName: "First Name",
    paymentInfo: "💰 Payment: Upon Receipt"
  }
};

const flagUA = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480"><g fill-rule="evenodd" stroke-width="1pt"><path fill="#ffd700" d="M0 0h640v480H0z"/><path fill="#0057b8" d="M0 0h640v240H0z"/></g></svg>`;
const flagUK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480"><path fill="#012169" d="M0 0h640v480H0z"/><path fill="#FFF" d="M75 0l244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z"/><path fill="#C8102E" d="M424 281l216 159v40L369 281h55zm-184 20l6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z"/><path fill="#FFF" d="M241 0v480h160V0H241zM0 160v160h640V160H0z"/><path fill="#C8102E" d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z"/></svg>`;

/* =========================================
   3. ЛОГІКА ІНТЕРФЕЙСУ
   ========================================= */
let lang = 'ua';
let index = 1; 
let currentRecipeIndex = 0;

function updateProductVisuals() {
  document.querySelectorAll('.bottle-card').forEach(c => c.classList.remove('active', 'on-left', 'on-right'));

  const total = productKeys.length;
  const activeKey = productKeys[index];
  
  const prevIndex = (index - 1 + total) % total;
  const nextIndex = (index + 1) % total;

  const activeCard = document.querySelector(`.bottle-card.${activeKey}`);
  const prevCard = document.querySelector(`.bottle-card.${productKeys[prevIndex]}`);
  const nextCard = document.querySelector(`.bottle-card.${productKeys[nextIndex]}`);

  if(activeCard) activeCard.classList.add('active');
  if(prevCard) prevCard.classList.add('on-left');
  if(nextCard) nextCard.classList.add('on-right');

  document.body.setAttribute('data-product', activeKey);
  
  document.getElementById('prodPrevBtn').classList.remove('hidden');
  document.getElementById('prodNextBtn').classList.remove('hidden');
  
  const editionName = lang === 'ua' ? 
      (activeKey === 'winter' ? 'ЗИМОВА' : activeKey === 'classic' ? 'КЛАСИЧНА' : 'ЛІТНЯ') : 
      (activeKey === 'winter' ? 'WINTER' : activeKey === 'classic' ? 'CLASSIC' : 'SUMMER');
      
  document.getElementById('edition').innerText = `${editionName} ${copy[lang].editionSuffix}`;
  document.getElementById('productDesc').innerText = copy[lang][activeKey];
  
  const price = lang === 'ua' ? products[activeKey].priceUA + ' ₴' : '$' + products[activeKey].priceEN;
  document.getElementById('priceDisplay').innerText = price;
  
  updateDrinks(activeKey);
}

updateProductVisuals();

function setProduct(selected) {
    const newIndex = productKeys.indexOf(selected);
    if (newIndex !== -1 && newIndex !== index) {
        index = newIndex;
        updateProductVisuals();
    }
}

document.getElementById('prodNextBtn').onclick = () => { 
    index = (index + 1) % productKeys.length; 
    updateProductVisuals(); 
};
document.getElementById('prodPrevBtn').onclick = () => { 
    index = (index - 1 + productKeys.length) % productKeys.length; 
    updateProductVisuals(); 
};

/* --- ЛОГІКА КОШИКА --- */
function addToCart() {
    const productId = productKeys[index];
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) { existingItem.quantity++; } else { cart.push({ id: productId, quantity: 1 }); }
    updateFloatingButton();
    const btn = document.getElementById('addToCartBtn');
    btn.classList.add('clicked');
    setTimeout(() => { btn.classList.remove('clicked'); }, 100);
    const badge = document.getElementById('cartBadge');
    badge.classList.remove('pop');
    void badge.offsetWidth;
    badge.classList.add('pop');
}
document.getElementById('addToCartBtn').onclick = addToCart;

function updateFloatingButton() {
    const icon = document.getElementById('contactIcon');
    const badge = document.getElementById('cartBadge');
    if (cart.length > 0) {
        icon.innerHTML = '<path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>';
        badge.style.display = 'block';
    } else {
        icon.innerHTML = '<path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"/>';
        badge.style.display = 'none';
    }
}

function resizeTextarea() {
    const msg = document.getElementById('message');
    msg.style.height = 'auto'; 
    msg.style.height = (msg.scrollHeight) + 'px'; 
    if (msg.scrollHeight >= 200) { msg.style.overflowY = "auto"; } 
    else { msg.style.overflowY = "hidden"; }
}

function renderCartInModal() {
    const listContainer = document.getElementById('cartItemsList');
    const title = document.getElementById('contactTitle');
    const topicWrapper = document.getElementById('topicWrapper');
    const message = document.getElementById('message');
    const totalBlock = document.getElementById('cartTotalBlock'); 
    
    if (cart.length > 0) {
        title.innerText = copy[lang].cartTitle;
        listContainer.style.display = 'block';
        topicWrapper.style.display = 'none'; 
        totalBlock.style.display = 'block';
        
        let html = '';
        let orderText = 'Замовлення:\n';
        let totalPrice = 0;
        
        cart.forEach((item) => {
            const productData = products[item.id];
            const name = lang === 'ua' ? copy[lang][item.id + 'Name'] : copy[lang][item.id + 'Name'];
            const price = lang === 'ua' ? productData.priceUA : productData.priceEN;
            const currency = lang === 'ua' ? ' ₴' : '$';
            
            totalPrice += price * item.quantity;
            orderText += `- ${name}: ${item.quantity} шт.\n`;
            
            html += `
            <div class="cart-item">
                <img src="${productData.img}" class="cart-item-img">
                <div class="cart-item-info">
                    <div class="cart-item-name">${name}</div>
                    <div class="cart-item-price">${lang === 'ua' ? price + currency : currency + price}</div>
                </div>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="changeQty('${item.id}', -1)" ${item.quantity <= 1 ? 'disabled style="opacity: 0.3"' : ''}>-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
                </div>
                <button class="delete-btn" onclick="removeItem('${item.id}')">&times;</button>
            </div>`;
        });
        
        listContainer.innerHTML = html;
        const totalStr = lang === 'ua' ? `${copy[lang].total}: ${totalPrice} ₴` : `${copy[lang].total}: $${totalPrice}`;
        totalBlock.innerText = totalStr;
        message.value = orderText + `\n${totalStr}`; 
        resizeTextarea(); 
        
    } else {
        title.innerText = copy[lang].contactTitle;
        listContainer.style.display = 'none';
        totalBlock.style.display = 'none';
        topicWrapper.style.display = 'block';
        message.value = '';
        resizeTextarea(); 
    }
}

window.changeQty = function(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity < 1) item.quantity = 1;
        renderCartInModal();
    }
};

window.removeItem = function(id) {
    cart = cart.filter(i => i.id !== id);
    updateFloatingButton();
    renderCartInModal();
};

const contactTriggers = document.querySelectorAll('.contact-trigger');
contactTriggers.forEach(btn => { 
    btn.addEventListener('click', () => { 
        renderCartInModal(); 
        document.getElementById("contactModal").classList.add('show'); 
        document.body.classList.add('no-scroll');
        lenis.stop();
        if (cart.length > 0) {
            handleTopicChange(true); 
        } else {
            handleTopicChange(); 
        }
    }); 
});

/* =========================================
   4. КАРУСЕЛЬ РЕЦЕПТІВ
   ========================================= */
function updateDrinks(season) {
    const recipes = drinkRecipes[lang][season];
    const track = document.getElementById('carouselTrack');
    track.innerHTML = '';
    recipes.forEach((recipe, i) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.onclick = () => handleCardClick(i);
        card.innerHTML = `
            <div class="card-img"><img src="${recipe.icon}" alt="${recipe.name}"></div>
            <h3>${recipe.name}</h3><p>${recipe.short}</p>
            <div class="card-link">${copy[lang].readMoreBtn} &rarr;</div>`;
        track.appendChild(card);
    });
    currentRecipeIndex = 0; 
    updateCarouselVisuals();
}

function updateCarouselVisuals() {
    const cards = document.querySelectorAll('.carousel-track .card');
    const total = cards.length;
    cards.forEach((card, i) => {
        card.className = 'card'; 
        if (i === currentRecipeIndex) { card.classList.add('active'); } 
        else if (i === getPrevIndex(total)) { card.classList.add('prev'); } 
        else if (i === getNextIndex(total)) { card.classList.add('next'); }
    });
}

function getPrevIndex(total) { return (currentRecipeIndex - 1 + total) % total; }
function getNextIndex(total) { return (currentRecipeIndex + 1) % total; }

function handleCardClick(index) {
    const total = document.querySelectorAll('.carousel-track .card').length;
    if (index === currentRecipeIndex) { openRecipe(index); } 
    else if (index === getNextIndex(total)) { nextSlide(); } 
    else if (index === getPrevIndex(total)) { prevSlide(); } 
    else { currentRecipeIndex = index; updateCarouselVisuals(); }
}

function nextSlide() {
    const total = document.querySelectorAll('.carousel-track .card').length;
    currentRecipeIndex = (currentRecipeIndex + 1) % total;
    updateCarouselVisuals();
}
function prevSlide() {
    const total = document.querySelectorAll('.carousel-track .card').length;
    currentRecipeIndex = (currentRecipeIndex - 1 + total) % total;
    updateCarouselVisuals();
}
document.getElementById('prevBtn').onclick = prevSlide;
document.getElementById('nextBtn').onclick = nextSlide;

/* =========================================
   5. ПЕРЕКЛАД ТА ІНШЕ
   ========================================= */
function applyLang() {
  document.getElementById('tagline').innerText = copy[lang].tagline;
  document.getElementById('productTitle').innerText = copy[lang].productTitle;
  document.getElementById('drinkTitle').innerText = copy[lang].drinkTitle;
  document.getElementById('aboutBtn').innerText = copy[lang].aboutLink;
  document.getElementById('aboutTitle').innerText = copy[lang].aboutTitle;
  document.getElementById('aboutText').innerHTML = copy[lang].aboutText;
  document.getElementById('heroBtn').innerText = copy[lang].heroBtn;
  document.getElementById('addToCartBtn').innerText = copy[lang].addToCart;

  const links = document.querySelectorAll('.card-link');
  links.forEach(link => { link.innerHTML = `${copy[lang].readMoreBtn} &rarr;`; });

  // Форма
  document.getElementById('contactTitle').innerText = copy[lang].contactTitle;
  document.getElementById('lblTopic').innerText = copy[lang].contactTopic; 
  document.getElementById('lblName').innerText = copy[lang].contactName;
  document.getElementById('lblContact').innerText = copy[lang].contactContact;
  document.getElementById('lblMessage').innerText = copy[lang].contactMessage;
  document.getElementById('btnSubmit').innerText = copy[lang].contactBtn;
  
  document.getElementById('name').placeholder = copy[lang].contactPlaceholderName;
  document.getElementById('email').placeholder = copy[lang].contactPlaceholderContact;
  document.getElementById('message').placeholder = copy[lang].contactPlaceholderMessage;
  
  document.getElementById('optOrder').innerText = copy[lang].contactOptions.order;
  document.getElementById('optQuestion').innerText = copy[lang].contactOptions.question;
  document.getElementById('optCollab').innerText = copy[lang].contactOptions.collab;

  // Оновлення текстів доставки
  document.getElementById('lblDelivery').innerText = copy[lang].deliveryToggle;
  document.getElementById('lblService').innerText = copy[lang].delService;
  document.getElementById('lblCity').innerText = copy[lang].delCity;
  document.getElementById('lblBranch').innerText = copy[lang].delBranch;
  document.getElementById('lblPhone').innerText = copy[lang].delPhone;
  document.getElementById('lblDelSurname').innerText = copy[lang].delSurname; 
  document.getElementById('lblDelName').innerText = copy[lang].delName; 
  document.getElementById('paymentInfo').innerText = copy[lang].paymentInfo;

  if (lang === 'ua') { document.getElementById('langFlag').innerHTML = flagUK; } 
  else { document.getElementById('langFlag').innerHTML = flagUA; }
  
  if (cart.length > 0) renderCartInModal();
  updateProductVisuals();
}

const changeBtn = document.getElementById('changeBtn'); 
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const floatingLang = document.getElementById('floatingLang');
const langFlag = document.getElementById('langFlag');

floatingLang.onclick = () => { lang = (lang === 'ua') ? 'en' : 'ua'; applyLang(); };
toggleSwitch.addEventListener('change', (e) => {
  if (e.target.checked) document.body.classList.add('light');
  else document.body.classList.remove('light');
});

const aboutModal = document.getElementById("aboutModal");
const aboutClose = document.querySelector(".about-close");
const aboutBtn = document.getElementById("aboutBtn");
const recipeModal = document.getElementById("recipeModal");
const recipeClose = document.querySelector(".recipe-close");
const contactModal = document.getElementById("contactModal");
const contactClose = document.querySelector(".contact-close");

aboutBtn.addEventListener('click', (e) => { 
    e.preventDefault(); 
    aboutModal.classList.add('show'); 
    document.body.classList.add('no-scroll');
    lenis.stop();
});

function openRecipe(cardIndex) {
    const productId = productKeys[index];
    const recipeData = drinkRecipes[lang][productId][cardIndex];
    document.getElementById('recipeTitle').innerText = recipeData.name;
    document.getElementById('recipeText').innerHTML = recipeData.full;
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

const messageInput = document.getElementById('message');
messageInput.addEventListener('input', resizeTextarea); 

// === ЛОГІКА ДОСТАВКИ ===
const deliveryToggle = document.getElementById('deliveryToggle');
const deliveryContainer = document.getElementById('deliveryFields');
const closeDeliveryBtn = document.getElementById('closeDeliveryBtn');
const deliverySectionWrapper = document.querySelector('.delivery-section'); 
const typeSelect = document.getElementById('type'); 
const delInputs = deliveryContainer.querySelectorAll('input[type="text"], input[type="tel"]');

function toggleDelivery(show) {
    if (show) {
        deliveryContainer.classList.remove('hidden');
        deliveryToggle.checked = true;
        delInputs.forEach(input => input.required = true);
    } else {
        deliveryContainer.classList.add('hidden');
        deliveryToggle.checked = false;
        delInputs.forEach(input => {
            input.value = '';
            input.required = false;
        });
    }
}

function handleTopicChange(forceOrder = false) {
    if (forceOrder) {
        typeSelect.value = "Замовлення";
    }

    if (typeSelect.value === 'Замовлення') {
        deliverySectionWrapper.style.display = 'block';
    } else {
        deliverySectionWrapper.style.display = 'none';
        toggleDelivery(false); 
    }
}

typeSelect.addEventListener('change', () => handleTopicChange());

window.addEventListener('load', () => {
    deliveryToggle.checked = false;
    toggleDelivery(false);
    handleTopicChange(); 
});

deliveryToggle.addEventListener('change', (e) => toggleDelivery(e.target.checked));
closeDeliveryBtn.addEventListener('click', () => toggleDelivery(false));

// === АВТОПІДСТАНОВКА НОВОЇ ПОШТИ ===
const cityInput = document.getElementById('delCity');
const cityList = document.getElementById('citySuggestions');
const branchInput = document.getElementById('delBranch');
const branchList = document.getElementById('branchSuggestions');

let selectedCityRef = null;

function debounce(func, timeout = 300){
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

const searchCities = async (e) => {
    const query = e.target.value;
    const service = document.querySelector('input[name="deliveryService"]:checked').value;
    
    if (service !== 'Нова Пошта' || query.length < 2) {
        cityList.classList.remove('active');
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/api/np/cities', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ query })
        });
        const cities = await res.json();

        cityList.innerHTML = '';
        if (cities.length > 0) {
            cities.forEach(city => {
                const li = document.createElement('li');
                li.innerText = city.name;
                li.onclick = () => {
                    cityInput.value = city.name;
                    selectedCityRef = city.ref;
                    cityList.classList.remove('active');
                    branchInput.value = '';
                    branchInput.focus();
                };
                cityList.appendChild(li);
            });
            cityList.classList.add('active');
        } else {
            cityList.classList.remove('active');
        }
    } catch (err) {
        console.error(err);
    }
};

const searchBranches = async (e) => {
    const query = e.target.value;
    if (!selectedCityRef) return; 

    try {
        const res = await fetch('http://localhost:3000/api/np/warehouses', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ cityRef: selectedCityRef, query })
        });
        const branches = await res.json();

        branchList.innerHTML = '';
        if (branches.length > 0) {
            branches.forEach(branch => {
                const li = document.createElement('li');
                li.innerText = branch;
                li.onclick = () => {
                    branchInput.value = branch;
                    branchList.classList.remove('active');
                };
                branchList.appendChild(li);
            });
            branchList.classList.add('active');
        } else {
            branchList.classList.remove('active');
        }
    } catch (err) {
        console.error(err);
    }
};

if (cityInput) cityInput.addEventListener('input', debounce(searchCities));
if (branchInput) {
    branchInput.addEventListener('focus', (e) => { if(selectedCityRef) searchBranches(e); });
    branchInput.addEventListener('input', debounce(searchBranches));
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.input-group-relative')) {
        if(cityList) cityList.classList.remove('active');
        if(branchList) branchList.classList.remove('active');
    }
});

// === ВІДПРАВКА ФОРМИ ===
const form = document.getElementById("ajaxForm");
const statusMsg = document.getElementById("statusMessage");

async function handleSubmit(event) {
  event.preventDefault();
  
  const formEl = event.target;
  const submitBtn = formEl.querySelector('.submit-btn');
  const originalText = submitBtn.innerText;
  const statusMsg = document.getElementById("statusMessage");

  submitBtn.innerText = "Відправляємо...";
  submitBtn.disabled = true;

  const formData = new FormData(formEl);
  const data = Object.fromEntries(formData.entries()); 
  
  const isDelivery = document.getElementById('deliveryToggle').checked;
  const deliveryData = isDelivery ? {
      active: true,
      service: document.querySelector('input[name="deliveryService"]:checked').value,
      city: document.getElementById('delCity').value,
      branch: document.getElementById('delBranch').value,
      phone: document.getElementById('delPhone').value,
      surname: document.getElementById('delSurname').value,
      name: document.getElementById('delName').value
  } : { active: false };

  data.delivery = deliveryData;
  
  const serverUrl = 'http://localhost:3000/send-order';

  try {
    const response = await fetch(serverUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      statusMsg.innerHTML = "Дякуємо! Ваше замовлення надіслано.";
      statusMsg.className = "status-message success";
      formEl.reset();
      
      toggleDelivery(false);
      handleTopicChange(); 
      
      if (cart.length > 0) {
          cart = [];
          updateFloatingButton();
          setTimeout(() => { closeContactModal(); statusMsg.innerHTML=""; }, 2000);
      } else {
          setTimeout(() => { closeContactModal(); statusMsg.innerHTML=""; }, 2000);
      }
      
    } else {
      statusMsg.innerHTML = "Сталася помилка. Спробуйте ще раз.";
      statusMsg.className = "status-message error";
      console.error('Server Error:', result);
    }

  } catch (error) {
    statusMsg.innerHTML = "Помилка з'єднання з сервером.";
    statusMsg.className = "status-message error";
    console.error('Network Error:', error);
  } finally {
    submitBtn.innerText = originalText;
    submitBtn.disabled = false;
  }
}

if (form) {
    form.addEventListener("submit", handleSubmit);
}

/* ==========================================================================
   6. СТАРТ ТА СНІГ
   ========================================================================== */
toggleSwitch.checked = false;
document.body.classList.remove('light');
applyLang();

const canvas = document.querySelector('.snow');
const ctx = canvas.getContext('2d');
let w, h;

// ОПТИМІЗАЦІЯ СНІГУ: Зменшено кількість для мобільних
const flakesCount = window.innerWidth < 600 ? 20 : 60;

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
const hardwareConcurrency = navigator.hardwareConcurrency || 4;

// Запускаємо сніг тільки якщо зима та процесор достатньо потужний
if (isWinter && hardwareConcurrency > 2) {
    snow();
} else {
    canvas.style.display = 'none'; 
}

/* ==========================================================================
   7. СВАЙПИ (SWIPES)
   ========================================================================== */
function addSwipeSupport(element, onLeft, onRight) {
    let touchStartX = 0;
    let touchEndX = 0;
    
    element.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].clientX; // Виправлено на clientX
    }, {passive: true});
    
    element.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX; // Виправлено на clientX
        handleGesture();
    }, {passive: true});
    
    function handleGesture() {
        if (touchEndX < touchStartX - 50) onLeft(); 
        if (touchEndX > touchStartX + 50) onRight(); 
    }
}

const productStage = document.getElementById('productStage');
addSwipeSupport(productStage, 
    () => { document.getElementById('prodNextBtn').click(); }, 
    () => { document.getElementById('prodPrevBtn').click(); } 
);

const recipeSection = document.getElementById('recipeSection');
addSwipeSupport(recipeSection, nextSlide, prevSlide);

/* Фікс для віртуальної клавіатури на Android */
if (window.visualViewport && window.innerWidth < 768 && 'ontouchstart' in window) {
    window.visualViewport.addEventListener('resize', () => {
       document.body.style.height = window.visualViewport.height + 'px';
    });
}
