(function () {
  // Function to dynamically load the styles
  function loadCookieStyles() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cookie-consent-for-gtm.pages.dev/cookieStyles.css';
    document.head.appendChild(link);

    // Load FontAwesome for the cookie icon
    const fontAwesomeLink = document.createElement('link');
    fontAwesomeLink.rel = 'stylesheet';
    fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
    document.head.appendChild(fontAwesomeLink);
  }

  // Function to create the settings modal
  function createSettingsModal() {
    const analyticsCookies = getCookie('analyticsCookies') === 'true';
    const marketingCookies = getCookie('marketingCookies') === 'true';
    const functionalCookies = getCookie('functionalCookies') === 'true';

    const modalTemplate = `
    <div class="cookie-settings-modal">
      <div class="cookie-settings-overlay" onclick="closeSettingsModal()"></div>
      <div class="cookie-settings-content">
        <h2>Cookie Settings</h2>
        <p>We use cookies to improve your experience on our website. Please choose your preferences below:</p>

        <h3>Cookie Categories</h3>
        <div class="cookie-category">
          <input type="checkbox" id="required-cookies" checked disabled>
          <label for="required-cookies">Required Cookies</label>
          <p>Required cookies are essential for the website to function properly. These cookies ensure basic functionalities and security features of the website, anonymously.</p>
        </div>

        <div class="cookie-category">
          <input type="checkbox" id="analytics-cookies" ${analyticsCookies ? 'checked' : ''}>
          <label for="analytics-cookies">Allow Analytics Cookies</label>
          <p>Analytics cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. Example: Google Analytics.</p>
        </div>

        <div class="cookie-category">
          <input type="checkbox" id="marketing-cookies" ${marketingCookies ? 'checked' : ''}>
          <label for="marketing-cookies">Allow Marketing Cookies</label>
          <p>Marketing cookies are used to track visitors across websites to display relevant advertisements. Example: Facebook Pixel.</p>
        </div>

        <div class="cookie-category">
          <input type="checkbox" id="functional-cookies" ${functionalCookies ? 'checked' : ''}>
          <label for="functional-cookies">Allow Functional Cookies</label>
          <p>Functional cookies enable the website to provide enhanced functionality and personalization. For example, saving your language preferences.</p>
        </div>

        <button class="save-btn" onclick="saveCookiePreferences()">Save Preferences</button>
        <button class="close-btn" onclick="closeSettingsModal()">Close</button>
      </div>
    </div>
  `;
    document.body.insertAdjacentHTML('beforeend', modalTemplate);
  }

  // Function to close the settings modal and reload the page
  function closeSettingsModal() {
    const modal = document.querySelector('.cookie-settings-modal');
    if (modal) modal.remove();
    location.reload(); // Reload the page
  }

  // Function to set a cookie
  function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = 'expires=' + date.toUTCString();
    document.cookie = name + '=' + value + ';' + expires + ';path=/';
  }

  // Function to get a cookie
  function getCookie(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  // Function to delete a cookie
  function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }

  // Function to delete cookies by category
  function deleteCookiesByCategory(category) {
    const cookiesToDelete = {
      analytics: [
        '_ga',
        '_gid',
        '_gat',
        'AMP_TOKEN',
        '_gac_',
        '_utm',
        '_clck',
        '_clsk',
        '_hjSession_',
        '_hjIncludedInSample',
        'ajs_anonymous_id',
        'ajs_group_id',
        'ajs_user_id',
        's_cc',
        's_sq',
        's_vi',
        's_fid',
        's_nr',
        's_lv',
        's_vnum',
        's_depth',
        's_invisit',
        's_ppv',
        '_pk_id.',
        '_pk_ses.',
        '_pk_ref.',
        '_pk_cvar.',
        'piwik_ignore',
        'MATOMO_SESSID',
        '__utma',
        '__utmb',
        '__utmc',
        '__utmt',
        '__utmz',
        '__utmv',
        '__utmx',
        '__utmxx',
        '_gaexp',
        '_opt_awcid',
        '_opt_awmid',
        '_opt_awgid',
        '_opt_awkid',
        '_opt_utmc',
      ],
      marketing: [
        '_fbp',
        'fr',
        '_gcl_au',
        '_uetsid',
        '_uetvid',
        'IDE',
        'test_cookie',
        '__kla_id',
        '_lc2_fpi',
        '_li',
        'bscookie',
        'UserMatchHistory',
        'li_sugr',
        'lidc',
        'lang',
        'bcookie',
        'personalization_id',
        'guest_id',
        'external_referer',
        'auth_token',
        'twid',
        'ct0',
        'remember_checked_on',
        'datr',
        'sb',
        'locale',
        'wd',
        'c_user',
        'xs',
        'pl',
        'presence',
        'act',
        'spin',
        'NID',
        '1P_JAR',
        'ANID',
        'CONSENT',
        'DV',
        'OGPC',
        'OTZ',
        'APISID',
        'HSID',
        'SAPISID',
        'SID',
        'SSID',
      ],
      functional: ['language', 'theme', 'currency', 'user_preferences'],
    };

    const cookies = cookiesToDelete[category];
    if (cookies) {
      const allCookies = document.cookie.split(';');
      allCookies.forEach((cookie) => {
        const cookieName = cookie.split('=')[0].trim();
        cookies.forEach((cookieToDelete) => {
          if (cookieName.includes(cookieToDelete)) {
            deleteCookie(cookieName);
          }
        });
      });
    }
  }

  // Function to log consent preferences
  function logConsent(preferences) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      preferences: preferences,
    };
    const consentLogs = JSON.parse(localStorage.getItem('consentLogs')) || [];
    consentLogs.push(logEntry);
    localStorage.setItem('consentLogs', JSON.stringify(consentLogs));
    console.log('Consent logged:', logEntry);
  }

  // Function to save cookie preferences and reload the page
  function saveCookiePreferences() {
    const analyticsCookies = document.getElementById('analytics-cookies').checked;
    const marketingCookies = document.getElementById('marketing-cookies').checked;
    const functionalCookies = document.getElementById('functional-cookies').checked;

    setCookie('analyticsCookies', analyticsCookies, 365);
    setCookie('marketingCookies', marketingCookies, 365);
    setCookie('functionalCookies', functionalCookies, 365);
    setCookie('cookieSettingsSaved', true, 365);

    const preferences = {
      analyticsCookies,
      marketingCookies,
      functionalCookies,
    };

    logConsent(preferences); // Log consent here
    console.log('Preferences saved');
    dataLayer.push({ event: 'analytics_' + (analyticsCookies ? 'accepted' : 'rejected') });
    dataLayer.push({ event: 'marketing_' + (marketingCookies ? 'accepted' : 'rejected') });
    dataLayer.push({ event: 'functional_' + (functionalCookies ? 'accepted' : 'rejected') });

    // Delete cookies by category if not accepted
    if (!analyticsCookies) deleteCookiesByCategory('analytics');
    if (!marketingCookies) deleteCookiesByCategory('marketing');
    if (!functionalCookies) deleteCookiesByCategory('functional');

    closeSettingsModal();
  }

  // Function to apply saved cookie preferences
  function applyCookiePreferences() {
    const analyticsCookies = getCookie('analyticsCookies') === 'true';
    const marketingCookies = getCookie('marketingCookies') === 'true';
    const functionalCookies = getCookie('functionalCookies') === 'true';

    const preferences = {
      analyticsCookies,
      marketingCookies,
      functionalCookies,
    };

    logConsent(preferences); // Log consent here

    if (analyticsCookies) {
      console.log('Analytics cookies enabled');
      dataLayer.push({ event: 'analytics_accepted' });
    } else {
      dataLayer.push({ event: 'analytics_rejected' });
    }

    if (marketingCookies) {
      console.log('Marketing cookies enabled');
      dataLayer.push({ event: 'marketing_accepted' });
    } else {
      dataLayer.push({ event: 'marketing_rejected' });
    }

    if (functionalCookies) {
      console.log('Functional cookies enabled');
      dataLayer.push({ event: 'functional_accepted' });
    } else {
      dataLayer.push({ event: 'functional_rejected' });
    }

    // Run deleteCookiesByCategory as an interval every 1 second
    setInterval(() => {
      if (!analyticsCookies) deleteCookiesByCategory('analytics');
      if (!marketingCookies) deleteCookiesByCategory('marketing');
      if (!functionalCookies) deleteCookiesByCategory('functional');
    }, 1000);
  }

  // Function to create the cookie banner
  function createCookieBanner() {
    const bannerTemplate = `
    <div class="cookie-banner">
      <p>This website uses cookies to ensure you get the best experience on our website. <a href="/cookie-policy.html" target="_blank">Cookie Policy</a></p>
      <div class="cookie-buttons">
        <button class="accept-btn" onclick="acceptAllCookies()">Accept All</button>
        <button class="reject-btn" onclick="rejectAllCookies()">Reject All</button>
        <button class="settings-btn" onclick="createSettingsModal()">Settings</button>
      </div>
    </div>
  `;
    document.body.insertAdjacentHTML('beforeend', bannerTemplate);
  }

  // Function to create the cookie settings button
  function createCookieSettingsButton() {
    const buttonTemplate = `
    <button class="cookie-settings-button" onclick="createSettingsModal()" title="Cookie Settings">
      <i class="fas fa-cookie-bite"></i>
    </button>
  `;
    document.body.insertAdjacentHTML('beforeend', buttonTemplate);
  }

  // Function to accept all cookies
  function acceptAllCookies() {
    setCookie('analyticsCookies', true, 365);
    setCookie('marketingCookies', true, 365);
    setCookie('functionalCookies', true, 365);
    setCookie('cookieSettingsSaved', true, 365);

    const preferences = {
      analyticsCookies: true,
      marketingCookies: true,
      functionalCookies: true,
    };

    logConsent(preferences); // Log consent here
    console.log('Cookies Accepted');
    dataLayer.push({ event: 'analytics_accepted' });
    dataLayer.push({ event: 'marketing_accepted' });
    dataLayer.push({ event: 'functional_accepted' });
    const banner = document.querySelector('.cookie-banner');
    if (banner) banner.remove();
    createCookieSettingsButton();
    location.reload(); // Refresh the page to load scripts
  }

  // Function to reject all cookies
  function rejectAllCookies() {
    setCookie('analyticsCookies', false, 365);
    setCookie('marketingCookies', false, 365);
    setCookie('functionalCookies', false, 365);
    setCookie('cookieSettingsSaved', true, 365);

    const preferences = {
      analyticsCookies: false,
      marketingCookies: false,
      functionalCookies: false,
    };

    logConsent(preferences); // Log consent here
    console.log('Cookies Rejected');
    dataLayer.push({ event: 'analytics_rejected' });
    dataLayer.push({ event: 'marketing_rejected' });
    dataLayer.push({ event: 'functional_rejected' });

    // Delete cookies by category
    deleteCookiesByCategory('analytics');
    deleteCookiesByCategory('marketing');
    deleteCookiesByCategory('functional');

    const banner = document.querySelector('.cookie-banner');
    if (banner) banner.remove();
    createCookieSettingsButton();
    location.reload(); // Refresh the page to remove scripts
  }

  // Attach functions to the window object to make them accessible
  window.createSettingsModal = createSettingsModal;
  window.closeSettingsModal = closeSettingsModal;
  window.saveCookiePreferences = saveCookiePreferences;
  window.acceptAllCookies = acceptAllCookies;
  window.rejectAllCookies = rejectAllCookies;

  // Load styles, create the banner, and apply saved preferences on window load
  window.addEventListener('load', () => {
    loadCookieStyles();
    const cookieSettingsSaved = getCookie('cookieSettingsSaved') === 'true';
    if (cookieSettingsSaved) {
      createCookieSettingsButton();
    } else {
      createCookieBanner();
    }
    applyCookiePreferences(); // Notify GTM of the current cookie status
  });
})();
