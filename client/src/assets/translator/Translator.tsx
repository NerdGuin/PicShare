type Translations = Record<string, string>;

let translations: Translations = {};
let observer: MutationObserver | null = null;
let currentLang = 'en';

async function loadLanguage(lang: string) {
  currentLang = lang;

  const data = await import(`./${lang}.json`);
  translations = data.default as Translations;

  translateAll();
}

function applyTranslation(el: Element) {
  const key = el.getAttribute('data-i18n');
  if (!key) return;

  const value = translations[key];
  if (!value) return;

  const tag = el.tagName.toLowerCase();

  if (tag === 'input' || tag === 'textarea') {
    (el as HTMLInputElement).placeholder = value;
    return;
  }

  if (tag === 'img') {
    (el as HTMLImageElement).alt = value;
    return;
  }

  el.innerHTML = value;
  // el.textContent = value;
}

function translateAll() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    applyTranslation(el);
  });
}

function startObserver() {
  if (observer) return;

  observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) return;

        const element = node as Element;

        if (element.hasAttribute('data-i18n')) {
          applyTranslation(element);
        }

        element
          .querySelectorAll('[data-i18n]')
          .forEach((el) => applyTranslation(el));
      });
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

/**
 * Inicializa o tradutor
 */
export async function initTranslator(lang: string = 'pt') {
  await loadLanguage(lang);
  startObserver();
}

/**
 * Troca idioma em tempo real
 */
export function setLanguage(lang: string) {
  if (lang === currentLang) return;
  loadLanguage(lang);
}
export function toggleLanguage() {
  const next = currentLang === 'pt' ? 'en' : 'pt';
  setLanguage(next);
}
