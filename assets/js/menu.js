import { items, toppings, ices, sugar } from './itemConfig.js';

const categoryLabels = {
  milkTea: { zh: '奶茶类', en: 'Milk Tea', sr: 'Mlečni čaj' },
  fruitTea: { zh: '果茶类', en: 'Fruit Tea', sr: 'Voćni čaj' },
  matchaTea: { zh: '抹茶类', en: 'Matcha Tea', sr: 'Matcha čaj' },
  sogaTea: { zh: '沙冰类', en: 'Soga Tea', sr: 'Soga čaj' },
  coffee: { zh: '咖啡类', en: 'Coffee', sr: 'Kafa' },
  cocoa: { zh: '可可类', en: 'Cocoa', sr: 'Kakao' }
};

function getToppingOption(name) {
  return toppings.find(t => t.text === name || t.name === name) || { text: name, price: 0 };
}

function createToppingsSelect(item) {
  const select = document.createElement('select');
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = '请选择';
  select.appendChild(placeholder);

  toppings.forEach((t) => {
    const option = document.createElement('option');
    option.value = t.name;
    option.textContent = `${t.text}  +${t.price} RSD`;
    select.appendChild(option);
  });

  return select;
}

function createIcesSelect() {
  const select = document.createElement('select');
  select.className = 'ice-select';
  Object.entries(ices).forEach(([key, obj]) => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = obj.text || key;
    if (key === 'normalIce') option.selected = true;
    select.appendChild(option);
  });
  return select;
}

function createSugarSelect() {
  const select = document.createElement('select');
  select.className = 'sugar-select';
  Object.entries(sugar).forEach(([key, obj]) => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = obj.text || key;
    if (key === 'normalIce' || key === 'normal') option.selected = true;
    select.appendChild(option);
  });
  return select;
}


const cart = [];

function render() {
  const lang = localStorage.lang || 'zh';
  const wrap = document.getElementById('products');
  wrap.innerHTML = '';

  Object.keys(items).forEach((categoryKey) => {
    const category = items[categoryKey];
    const section = document.createElement('section');
    section.className = 'category';

    const title = document.createElement('h2');
    title.textContent = categoryLabels[categoryKey]?.[lang] || categoryKey;
    section.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'grid';

    Object.entries(category).forEach(([itemKey, item]) => {
      const card = document.createElement('div');
      card.className = 'card';

      const image = document.createElement('img');
      if (item.image) {
        image.src = item.image.startsWith('assets/') ? `../${item.image}` : item.image;
        image.alt = item.text;
        image.className = 'product-img';
        card.appendChild(image);
      }

      const name = document.createElement('h3');
      name.textContent = itemKey + ' ' + item.text;
      card.appendChild(name);

      
      const toppings = document.createElement('small');
      toppings.textContent = item.toppings ? `小料：${item.toppings}` : '小料：无';
      card.appendChild(toppings);

      const price = document.createElement('p');
      price.textContent = item.mPrice ? `L: ${item.price}, M: ${item.mPrice} RSD` : `L: ${item.price} RSD`;
      card.appendChild(price);

      const button = document.createElement('button');
      button.className = 'add-btn';
      button.textContent = '+';
      button.addEventListener('click', () => {
        openSelectionModal(categoryKey, itemKey);
      });
      card.appendChild(button);
      grid.appendChild(card);
    });

    section.appendChild(grid);
    wrap.appendChild(section);
  });

  update();
}

function openSelectionModal(categoryKey, itemKey) {
  const item = items[categoryKey]?.[itemKey];
  if (!item) return;

  const modal = document.getElementById('selectionModal');
  const title = document.getElementById('selectionTitle');
  const priceLabel = document.getElementById('selectionPrice');
  const toppingSelect = document.getElementById('selectionTopping');
  const iceSelect = document.getElementById('selectionIce');
  const sugarSelect = document.getElementById('selectionSugar');

  title.textContent = `${itemKey} ${item.text}`;
  priceLabel.textContent = item.mPrice ? `L: ${item.price} RSD, M: ${item.mPrice} RSD` : `${item.price} RSD`;

  toppingSelect.innerHTML = '';
  const noneOption = document.createElement('option');
  noneOption.value = '';
  noneOption.textContent = '无';
  toppingSelect.appendChild(noneOption);
  toppings.forEach((t) => {
    const option = document.createElement('option');
    option.value = t.name;
    option.textContent = `${t.text}  +${t.price} RSD`;
    toppingSelect.appendChild(option);
  });

  iceSelect.innerHTML = '';
  Object.entries(ices).forEach(([key, obj]) => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = obj.text || key;
    if (key === 'normalIce') option.selected = true;
    iceSelect.appendChild(option);
  });

  sugarSelect.innerHTML = '';
  Object.entries(sugar).forEach(([key, obj]) => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = obj.text || key;
    if (key === 'normalIce' || key === 'normal') option.selected = true;
    sugarSelect.appendChild(option);
  });

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  modal.dataset.currentItem = `${categoryKey}||${itemKey}`;
}

function closeSelectionModal() {
  const modal = document.getElementById('selectionModal');
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  delete modal.dataset.currentItem;
}

function initSelectionModal() {
  const modal = document.getElementById('selectionModal');
  const closeBtn = document.getElementById('closeSelectionModal');
  const overlay = document.getElementById('selectionOverlay');
  const cancelBtn = document.getElementById('cancelSelection');
  const form = document.getElementById('selectionForm');

  if (closeBtn) closeBtn.addEventListener('click', closeSelectionModal);
  if (overlay) overlay.addEventListener('click', closeSelectionModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeSelectionModal);

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const modal = document.getElementById('selectionModal');
      const current = modal.dataset.currentItem;
      if (!current) return;
      const [categoryKey, itemKey] = current.split('||');
      const toppingSelect = document.getElementById('selectionTopping');
      const iceSelect = document.getElementById('selectionIce');
      const sugarSelect = document.getElementById('selectionSugar');
      const selected = toppingSelect.value ? [toppingSelect.value] : [];
      const iceVal = iceSelect ? iceSelect.value : null;
      const sugarVal = sugarSelect ? sugarSelect.value : null;
      add(categoryKey, itemKey, selected, iceVal, sugarVal);
      closeSelectionModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSelectionModal();
    }
  });
}

function add(categoryKey, itemKey, selectedToppings = [], iceChoice = null, sugarChoice = null) {
  const product = items[categoryKey][itemKey];
  const toppingObjs = (selectedToppings || []).map(name => getToppingOption(name));
  const toppingCost = toppingObjs.reduce((s, t) => s + (t.price || 0), 0);
  const unitPrice = product.price + toppingCost;
  const id = `${categoryKey}-${itemKey}-${(selectedToppings || []).slice().sort().join('|')}-${iceChoice||''}-${sugarChoice||''}`;
  const existing = cart.find((x) => x.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, qty: 1, price: unitPrice, name: product.text, toppings: selectedToppings, toppingCost, ice: iceChoice, sugar: sugarChoice });
  }
  update();
}

function removeItem(id) {
  const index = cart.findIndex((x) => x.id === id);
  if (index !== -1) {
    cart.splice(index, 1);
    update();
  }
}

function update() {
  let total = 0;
  const c = document.getElementById('cartItems');
  c.innerHTML = '';
  let count = 0; // 总杯数

  cart.forEach((i, idx) => {
    total += i.qty * i.price;
    const itemRow = document.createElement('div');
    itemRow.className = 'cart-item';

    const itemHeader = document.createElement('div');
    itemHeader.className = 'cart-item-header';

    const mainLine = document.createElement('div');
    mainLine.textContent = `${idx + 1}. ${i.name} x${i.qty}  ${i.price} RSD`;
    itemHeader.appendChild(mainLine);

    const removeButton = document.createElement('button');
    removeButton.className = 'cart-remove-btn';
    removeButton.textContent = '删除';
    removeButton.addEventListener('click', () => {
      removeItem(i.id);
    });
    itemHeader.appendChild(removeButton);

    itemRow.appendChild(itemHeader);

    if (i.toppings && i.toppings.length > 0) {
      const toppingsDiv = document.createElement('div');
      toppingsDiv.className = 'cart-toppings';
      i.toppings.forEach(topping => {
        const topObj = getToppingOption(topping);
        const toppingLine = document.createElement('div');
        toppingLine.className = 'topping-line';
        toppingLine.textContent = ` ${topObj.text || topping}: +${topObj.price || 0} RSD`;
        toppingsDiv.appendChild(toppingLine);
      });
      itemRow.appendChild(toppingsDiv);
    }
    // show ice selection
    if (i.ice) {
      const iceObj = (ices && ices[i.ice]) ? ices[i.ice] : null;
      const iceLine = document.createElement('div');
      iceLine.className = 'cart-ice';
      iceLine.textContent = ` 冰度: ${iceObj ? iceObj.text : i.ice}`;
      itemRow.appendChild(iceLine);
    }
    // show sugar selection
    if (i.sugar) {
      const sugarObj = (sugar && sugar[i.sugar]) ? sugar[i.sugar] : null;
      const sugarLine = document.createElement('div');
      sugarLine.className = 'cart-sugar';
      sugarLine.textContent = ` 甜度: ${sugarObj ? sugarObj.text : i.sugar}`;
      itemRow.appendChild(sugarLine);
    }
    count += i.qty;
    c.appendChild(itemRow);
  });

  document.getElementById('total').textContent = `Count: ${count}, Total: ${total} RSD`;
  document.getElementById('cartCount').textContent = count;
  localStorage.cart = JSON.stringify(cart);
}

function openCheckoutModal() {
  const modal = document.getElementById('checkoutModal');
  if (!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkoutModal');
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

function initCheckoutModal() {
  const openBtn = document.getElementById('openCheckout');
  const closeBtn = document.getElementById('closeCheckoutModal');
  const overlay = document.getElementById('checkoutOverlay');

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      openCheckoutModal();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeCheckoutModal);
  }

  if (overlay) {
    overlay.addEventListener('click', closeCheckoutModal);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCheckoutModal();
    }
  });
}

// Language switcher
window.addEventListener('DOMContentLoaded', () => {
  const langSwitch = document.getElementById('langSwitch');
  if (langSwitch) {
    langSwitch.value = localStorage.lang || 'zh';
    langSwitch.addEventListener('change', (e) => {
      i18n.setLanguage(e.target.value);
      render();
    });
  }
  
  // Cart toggle button
  const cartToggle = document.getElementById('cartToggle');
  const cartPanel = document.getElementById('cart');
  if (cartToggle && cartPanel) {
    cartToggle.addEventListener('click', () => {
      cartPanel.classList.toggle('visible');
    });
  }
  
  initCheckoutModal();
  initSelectionModal();
  render();
});

// Listen for language changes from other components
window.addEventListener('languageChanged', (e) => {
  const langSwitch = document.getElementById('langSwitch');
  if (langSwitch) {
    langSwitch.value = e.detail.lang;
  }
  render();
});
