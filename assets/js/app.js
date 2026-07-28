const GAS_URL='https://script.google.com/macros/s/AKfycbzjv9udncYbCQlFec7b9XVyK45hQYqc5u8G2sytjD9BXeQGUuU31q0mKg4FM_45M9KH/exec';
async function submitOrder(order){
 return fetch(GAS_URL,{method:'POST',body:JSON.stringify(order)});
}

// Language switcher
document.getElementById('langSwitch').value = localStorage.getItem('lang') || 'zh';
document.getElementById('langSwitch').addEventListener('change', (e) => {
  i18n.setLanguage(e.target.value);
});

// Listen for language changes
window.addEventListener('languageChanged', (e) => {  
  const langSwitch = document.getElementById('langSwitch');
  if (langSwitch) {
    langSwitch.value = e.detail.lang;
  }
});

// Language switcher
document.addEventListener('DOMContentLoaded', () => {
  const langSwitch = document.getElementById('langSwitch');
  if (langSwitch) {
    langSwitch.value = localStorage.getItem('lang') || 'zh';
    langSwitch.addEventListener('change', (e) => {
      i18n.setLanguage(e.target.value);
    });
  }

  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const navigationId = mobileNavToggle?.getAttribute('aria-controls');
  const homeNavigation = navigationId ? document.getElementById(navigationId) : null;
  if (mobileNavToggle && homeNavigation) {
    mobileNavToggle.addEventListener('click', () => {
      const isOpen = homeNavigation.classList.toggle('is-open');
      mobileNavToggle.classList.toggle('is-open', isOpen);
      mobileNavToggle.setAttribute('aria-expanded', String(isOpen));
      mobileNavToggle.setAttribute('aria-label', i18n.t(isOpen ? 'close_navigation' : 'open_navigation'));
    });

    homeNavigation.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        homeNavigation.classList.remove('is-open');
        mobileNavToggle.classList.remove('is-open');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
        mobileNavToggle.setAttribute('aria-label', i18n.t('open_navigation'));
      });
    });
  }
});
