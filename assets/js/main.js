(function () {
  function setupNavDrawerButtonEvents() {
    const navDrawerButton = document.querySelector('#nav-bar__drawer-button');

    navDrawerButton.addEventListener('click', () => {
      const navDrawer = document.querySelector('.nav-drawer');

      navDrawer.classList.add('nav-drawer--visible');
      document.documentElement.style.setProperty('overflow', 'hidden');
    });
  }

  function setupNavDrawerEvents() {
    const navDrawer = document.querySelector('.nav-drawer');

    navDrawer.addEventListener('click', () => {
      navDrawer.classList.remove('nav-drawer--visible');
      document.documentElement.style.removeProperty('overflow');
    });

    const navDrawerSheet = document.querySelector('.nav-drawer__sheet');

    navDrawerSheet.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  function setupTocButtonEvent() {
    const tocButton = document.querySelector('#nav-bar__toc-button');

    tocButton.addEventListener('click', () => {
      const toc = document.querySelector('.toc');

      toc.classList.add('toc--visible');
      document.documentElement.style.setProperty('overflow', 'hidden');
    });
  }

  function setupTocEvents() {
    const toc = document.querySelector('.toc');

    toc.addEventListener('click', () => {
      toc.classList.remove('toc--visible');
      document.documentElement.style.removeProperty('overflow');
    });

    const tocSheet = document.querySelector('.toc > ul');

    tocSheet.addEventListener('click', (e) => {
      if (e.target.nodeName.toLowerCase() !== 'a') {
        e.stopPropagation();
      }
    });
  }

  function getThemeColor(element) {
    return getComputedStyle(element).getPropertyValue('background-color');
  }

  function isLightThemeColor(themeColor) {
    const rgb = themeColor.replace(/[^\d,]/g, '').split(',');

    if (rgb.length > 3) {
      return true;
    }

    const brightness = ((rgb[0] * 299) + (rgb[1] * 587) + (rgb[2] * 114)) / 1000;

    return brightness > 155;
  }

  function setupCenchatButtonTheme() {
    const cenchatButton = document.querySelector('#cenchat-widget-button');
    const brandColor = getThemeColor(cenchatButton);

    if (isLightThemeColor(brandColor)) {
      cenchatButton.style.color = 'rgba(0, 0, 0, 0.87)';
    } else {
      cenchatButton.style.color = 'rgba(255, 255, 255, 0.87)';
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    setupNavDrawerButtonEvents();
    setupNavDrawerEvents();
    setupTocButtonEvent();
    setupTocEvents();
    setupCenchatButtonTheme();
  });
}());
