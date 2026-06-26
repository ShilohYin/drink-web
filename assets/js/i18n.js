// i18n - Internationalization Module
const i18n = {
  currentLang: localStorage.getItem('lang') || 'zh',
  translations: {},

  // Initialize i18n by loading language file
  async init() {
    try {
      const response = await fetch(`/lang/${this.currentLang}.json`);
      this.translations = await response.json();
      this.applyTranslations();
    } catch (error) {
      console.error('Failed to load language file:', error);
    }
  },

  // Get translation for a key
  t(key) {
    return this.translations[key] || key;
  },

  // Change language
  async setLanguage(lang) {
    this.currentLang = lang;
    localStorage.setItem('lang', lang);
    try {
      const response = await fetch(`/lang/${lang}.json`);
      this.translations = await response.json();
      this.applyTranslations();
      // Dispatch custom event for other components
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    } catch (error) {
      console.error('Failed to load language file:', error);
    }
  },

  // Apply translations to all elements with data-i18n attribute
  applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      element.textContent = this.t(key);
    });

    // Also update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      element.placeholder = this.t(key);
    });
  }
};

// Initialize i18n when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => i18n.init());
} else {
  i18n.init();
}