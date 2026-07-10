import { items, toppings, ices, sugar } from './itemConfig.js';

const categoryLabels = {
  milkTea: { zh: '奶茶类', en: 'Milk Tea', sr: 'Mlečni čaj' },
  fruitTea: { zh: '果茶类', en: 'Fruit Tea', sr: 'Voćni čaj' },
  matchaTea: { zh: '抹茶类', en: 'Matcha Tea', sr: 'Matcha čaj' },
  sogaTea: { zh: '沙冰类', en: 'Soga Tea', sr: 'Soga čaj' },
  coffee: { zh: '咖啡类', en: 'Coffee', sr: 'Kafa' },
  cocoa: { zh: '可可类', en: 'Cocoa', sr: 'Kakao' }
};

const categorySubtitles = {
  milkTea: { zh: '香浓丝滑 · 口口满足', en: 'Silky, rich, and satisfying', sr: 'Svilenkasto, bogato i puno ukusa' },
  fruitTea: { zh: '清爽果香 · 鲜活解腻', en: 'Fresh fruit tea, bright and crisp', sr: 'Svež voćni čaj' },
  matchaTea: { zh: '茶香清雅 · 奶感绵密', en: 'Clean matcha aroma with creamy texture', sr: 'Nežna matcha aroma' },
  sogaTea: { zh: '冰爽细腻 · 甜蜜降温', en: 'Cool, smooth, and sweet', sr: 'Hladno i osvežavajuće' },
  coffee: { zh: '醇香提神 · 奶咖平衡', en: 'Balanced coffee and cream', sr: 'Uravnotežena kafa' },
  cocoa: { zh: '浓郁可可 · 温柔甜感', en: 'Deep cocoa with soft sweetness', sr: 'Bogati kakao' }
};

const productImageExtensions = ['png', 'PNG', 'jpg', 'JPG', 'jpeg', 'webp'];

function getImageCandidates(categoryKey, itemKey, item) {
  const generated = productImageExtensions.map(ext => `/assets/images/drinks/${categoryKey}/${itemKey}.${ext}`);
  const configured = item.image ? [`/${item.image.replace(/^\/+/, '')}`] : [];
  return [...new Set([...generated, ...configured])];
}

function setProductImage(image, categoryKey, itemKey, item) {
  const candidates = getImageCandidates(categoryKey, itemKey, item);
  let index = 0;

  image.src = candidates[index];
  image.onerror = () => {
    index += 1;
    if (index < candidates.length) {
      image.src = candidates[index];
      return;
    }
    image.classList.add('is-missing');
    image.removeAttribute('src');
  };
}

function getToppingOption(name) {
  return toppings.find(t => t.text === name || t.name === name) || { text: name, price: 0 };
}

function getBasePrice(product, sizeChoice = 'L') {
  return sizeChoice === 'M' && product.mPrice ? product.mPrice : product.price;
}

function getSizeOptionLabel(product, sizeChoice = 'L') {
  return `${sizeChoice} ${getBasePrice(product, sizeChoice)} RSD`;
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

const cartStorageKey = 'kaolaCart';
const cart = [];

function saveCart() {
  sessionStorage.setItem(cartStorageKey, JSON.stringify(cart));
}

function loadCart() {
  const savedCart = sessionStorage.getItem(cartStorageKey);
  if (!savedCart) return;

  try {
    const parsedCart = JSON.parse(savedCart);
    if (!Array.isArray(parsedCart)) return;
    cart.splice(0, cart.length, ...parsedCart.filter(item => item && item.id));
  } catch (error) {
    sessionStorage.removeItem(cartStorageKey);
  }
}

function render() {
  const lang = localStorage.lang || 'zh';
  const wrap = document.getElementById('products');
  wrap.innerHTML = '';

  Object.keys(items).forEach((categoryKey) => {
    const category = items[categoryKey];
    const section = document.createElement('section');
    section.className = 'category';

    const categoryHeader = document.createElement('div');
    categoryHeader.className = 'category-header';

    const headingGroup = document.createElement('div');

    const title = document.createElement('h2');
    title.textContent = categoryLabels[categoryKey]?.[lang] || categoryKey;
    headingGroup.appendChild(title);

    const subtitle = document.createElement('p');
    subtitle.className = 'category-subtitle';
    subtitle.textContent = categorySubtitles[categoryKey]?.[lang] || '';
    headingGroup.appendChild(subtitle);

    categoryHeader.appendChild(headingGroup);

    if (categoryKey === 'milkTea') {
      const note = document.createElement('div');
      note.className = 'category-note';
      note.textContent = '✓ 奶茶可选冷热，默认推荐冰饮';
      categoryHeader.appendChild(note);
    }

    section.appendChild(categoryHeader);

    const grid = document.createElement('div');
    grid.className = 'grid';

    Object.entries(category).forEach(([itemKey, item]) => {
      const card = document.createElement('div');
      card.className = 'card';

      const imageWrap = document.createElement('div');
      imageWrap.className = 'product-media';

      if (item.image) {
        const image = document.createElement('img');
        setProductImage(image, categoryKey, itemKey, item);
        image.alt = item.text;
        image.className = 'product-img';
        imageWrap.appendChild(image);
      }

      if ((categoryKey === 'milkTea' && (itemKey === 'M1' || itemKey === 'M9'))) {
        const badge = document.createElement('span');
        badge.className = 'product-badge';
        badge.textContent = 'NEW';
        imageWrap.appendChild(badge);
      }

      card.appendChild(imageWrap);

      const content = document.createElement('div');
      content.className = 'product-content';

      const name = document.createElement('h3');
      name.textContent = itemKey + ' ' + item.text;
      content.appendChild(name);

      const toppingsInfo = document.createElement('small');
      toppingsInfo.className = 'included-toppings';
      toppingsInfo.textContent = item.toppings ? `已含：${item.toppings}` : '已含：无';
      content.appendChild(toppingsInfo);

      const price = document.createElement('p');
      price.className = 'price';
      price.textContent = item.mPrice ? `L ${item.price} / M ${item.mPrice} RSD` : `${item.price} RSD`;
      content.appendChild(price);

      card.appendChild(content);

      const button = document.createElement('button');
      button.className = 'add-btn';
      button.type = 'button';
      button.setAttribute('aria-label', `添加 ${item.text}`);
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

function openSelectionModal(categoryKey, itemKey, editCartId = null, preset = {}) {
  const item = items[categoryKey]?.[itemKey];
  if (!item) return;

  const modal = document.getElementById('selectionModal');
  const title = document.getElementById('selectionTitle');
  const priceLabel = document.getElementById('selectionPrice');
  const sizeSelector = document.getElementById('sizeSelector');
  const toppingSelect = document.getElementById('selectionTopping');
  const iceSelect = document.getElementById('selectionIce');
  const sugarSelect = document.getElementById('selectionSugar');
  const submitButton = document.querySelector('#selectionForm .submit-btn');
  const selectedSize = item.mPrice ? (preset.size || 'L') : 'L';

  title.textContent = `${itemKey} ${item.text}`;
  modal.dataset.selectedSize = selectedSize;
  priceLabel.hidden = !!item.mPrice;
  priceLabel.textContent = item.mPrice ? '' : `${item.price} RSD`;
  if (editCartId) {
    modal.dataset.editingCartId = editCartId;
  } else {
    delete modal.dataset.editingCartId;
  }
  if (submitButton) {
    submitButton.textContent = editCartId ? '保存修改' : '加入购物车';
  }

  if (sizeSelector) {
    sizeSelector.hidden = !item.mPrice;
    sizeSelector.querySelectorAll('.size-option').forEach((button) => {
      const size = button.dataset.size || 'L';
      button.textContent = getSizeOptionLabel(item, size);
      button.classList.toggle('active', size === selectedSize);
    });
  }

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
  toppingSelect.value = preset.toppings?.[0] || '';

  iceSelect.innerHTML = '';
  Object.entries(ices).forEach(([key, obj]) => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = obj.text || key;
    if (key === 'normalIce') option.selected = true;
    iceSelect.appendChild(option);
  });
  if (preset.ice) iceSelect.value = preset.ice;

  sugarSelect.innerHTML = '';
  Object.entries(sugar).forEach(([key, obj]) => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = obj.text || key;
    if (key === 'normalIce' || key === 'normal') option.selected = true;
    sugarSelect.appendChild(option);
  });
  if (preset.sugar) sugarSelect.value = preset.sugar;

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
  delete modal.dataset.selectedSize;
  delete modal.dataset.editingCartId;
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

  modal.addEventListener('click', (event) => {
    const sizeButton = event.target.closest('.size-option');
    if (!sizeButton) return;
    const current = modal.dataset.currentItem;
    if (!current) return;
    const [categoryKey, itemKey] = current.split('||');
    const item = items[categoryKey]?.[itemKey];
    if (!item || !item.mPrice) return;

    const selectedSize = sizeButton.dataset.size || 'L';
    modal.dataset.selectedSize = selectedSize;
    modal.querySelectorAll('.size-option').forEach((button) => {
      button.classList.toggle('active', button === sizeButton);
    });
  });

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
      const sizeVal = modal.dataset.selectedSize || 'L';
      if (modal.dataset.editingCartId) {
        updateCartItem(modal.dataset.editingCartId, categoryKey, itemKey, selected, iceVal, sugarVal, sizeVal);
      } else {
        add(categoryKey, itemKey, selected, iceVal, sugarVal, sizeVal);
      }
      closeSelectionModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSelectionModal();
    }
  });
}

function createCartItem(categoryKey, itemKey, selectedToppings = [], iceChoice = null, sugarChoice = null, sizeChoice = 'L', qty = 1) {
  const product = items[categoryKey][itemKey];
  const toppingObjs = (selectedToppings || []).map(name => getToppingOption(name));
  const toppingCost = toppingObjs.reduce((s, t) => s + (t.price || 0), 0);
  const normalizedSize = product.mPrice ? sizeChoice : 'L';
  const unitPrice = getBasePrice(product, normalizedSize) + toppingCost;
  const id = `${categoryKey}-${itemKey}-${normalizedSize}-${(selectedToppings || []).slice().sort().join('|')}-${iceChoice||''}-${sugarChoice||''}`;
  return {
    id,
    qty,
    price: unitPrice,
    name: product.text,
    categoryKey,
    itemKey,
    size: normalizedSize,
    toppings: selectedToppings,
    toppingCost,
    ice: iceChoice,
    sugar: sugarChoice
  };
}

function add(categoryKey, itemKey, selectedToppings = [], iceChoice = null, sugarChoice = null, sizeChoice = 'L') {
  const cartItem = createCartItem(categoryKey, itemKey, selectedToppings, iceChoice, sugarChoice, sizeChoice);
  const existing = cart.find((x) => x.id === cartItem.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push(cartItem);
  }
  update();
}

function updateCartItem(id, categoryKey, itemKey, selectedToppings = [], iceChoice = null, sugarChoice = null, sizeChoice = 'L') {
  const index = cart.findIndex((x) => x.id === id);
  if (index === -1) return;

  const currentQty = cart[index].qty || 1;
  const updatedItem = createCartItem(categoryKey, itemKey, selectedToppings, iceChoice, sugarChoice, sizeChoice, currentQty);
  cart.splice(index, 1);

  const existing = cart.find((x) => x.id === updatedItem.id);
  if (existing) {
    existing.qty += updatedItem.qty;
  } else {
    cart.splice(index, 0, updatedItem);
  }

  update();
}

function getCartItemProductKeys(item) {
  if (item.categoryKey && item.itemKey) {
    return { categoryKey: item.categoryKey, itemKey: item.itemKey };
  }

  const [categoryKey, itemKey] = (item.id || '').split('-');
  return { categoryKey, itemKey };
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
    mainLine.textContent = `${idx + 1}. ${i.name} ${i.size || 'L'} x${i.qty}  ${i.price} RSD`;
    itemHeader.appendChild(mainLine);

    const actions = document.createElement('div');
    actions.className = 'cart-item-actions';

    const editButton = document.createElement('button');
    editButton.className = 'cart-edit-btn';
    editButton.textContent = '修改';
    editButton.addEventListener('click', () => {
      const { categoryKey, itemKey } = getCartItemProductKeys(i);
      if (!items[categoryKey]?.[itemKey]) return;
      openSelectionModal(categoryKey, itemKey, i.id, i);
    });
    actions.appendChild(editButton);

    const removeButton = document.createElement('button');
    removeButton.className = 'cart-remove-btn';
    removeButton.textContent = '删除';
    removeButton.addEventListener('click', () => {
      removeItem(i.id);
    });
    actions.appendChild(removeButton);
    itemHeader.appendChild(actions);

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
  const checkoutButton = document.getElementById('openCheckout');
  if (checkoutButton) {
    checkoutButton.disabled = count === 0;
  }
  saveCart();
}

function openCheckoutModal() {
  if (cart.reduce((sum, item) => sum + (item.qty || 0), 0) === 0) return;

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
  loadCart();
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
