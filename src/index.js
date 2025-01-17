import Cookies from 'js-cookie';

(function () {
  console.log('Cookie Script Loaded');
  window.dataLayer = window.dataLayer || [];

  // Function to create the settings modal
  function createSettingsModal() {
    const analyticsCookies = Cookies.get('analyticsCookies') === 'true';
    const marketingCookies = Cookies.get('marketingCookies') === 'true';
    const functionalCookies = Cookies.get('functionalCookies') === 'true';

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
        <p><a href="/cookie-policy.html" target="_blank">Cookie Policy</a></p>
      </div>
    </div>
  `;
    document.body.insertAdjacentHTML('beforeend', modalTemplate);
  }

  // Function to close the settings modal and reload the page
  function closeSettingsModal() {
    const modal = document.querySelector('.cookie-settings-modal');
    if (modal) modal.remove();
    // eslint-disable-next-line no-restricted-globals
    location.reload();
  }

  // Function to delete a cookie
  function deleteCookie(name) {
    // Get the current domain from the location
    const domainParts = location.hostname.split('.');

    // Remove the first part of the domain (subdomain) for root domain deletion
    let rootDomain = location.hostname; // Default to the current domain
    if (domainParts.length > 2) {
      domainParts.shift(); // Remove the subdomain
      rootDomain = '.' + domainParts.join('.'); // Construct the root domain
    }

    // Delete the cookie for the current domain
    Cookies.remove(name, { path: '/', domain: location.hostname });

    // Delete the cookie for the root domain (if applicable)
    Cookies.remove(name, { path: '/', domain: rootDomain });
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
        '_vwo',
        '_ga',
        '_wingify',
        '_vis',
        'wingify',
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
        '__kla',
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
        '__nbpix',
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

    Cookies.set('analyticsCookies', analyticsCookies, { expires: 365, path: '/' });
    Cookies.set('marketingCookies', marketingCookies, { expires: 365, path: '/' });
    Cookies.set('functionalCookies', functionalCookies, { expires: 365, path: '/' });
    Cookies.set('cookieSettingsSaved', true, { expires: 365, path: '/' });

    const preferences = {
      analyticsCookies,
      marketingCookies,
      functionalCookies,
    };

    logConsent(preferences); // Log consent here
    console.log('Preferences saved');
    window.dataLayer.push({ event: 'analytics_' + (analyticsCookies ? 'accepted' : 'rejected') });
    window.dataLayer.push({ event: 'marketing_' + (marketingCookies ? 'accepted' : 'rejected') });
    window.dataLayer.push({ event: 'functional_' + (functionalCookies ? 'accepted' : 'rejected') });

    // Delete cookies by category if not accepted
    if (!analyticsCookies) deleteCookiesByCategory('analytics');
    if (!marketingCookies) deleteCookiesByCategory('marketing');
    if (!functionalCookies) deleteCookiesByCategory('functional');

    closeSettingsModal();
  }

  // Function to apply saved cookie preferences
  function applyCookiePreferences() {
    const analyticsCookies = Cookies.get('analyticsCookies') === 'true';
    const marketingCookies = Cookies.get('marketingCookies') === 'true';
    const functionalCookies = Cookies.get('functionalCookies') === 'true';

    const preferences = {
      analyticsCookies,
      marketingCookies,
      functionalCookies,
    };

    logConsent(preferences); // Log consent here
    if (analyticsCookies) {
      console.log('Analytics cookies enabled');
      window.dataLayer.push({ event: 'analytics_accepted' });
    } else {
      window.dataLayer.push({ event: 'analytics_rejected' });
    }

    if (marketingCookies) {
      console.log('Marketing cookies enabled');
      window.dataLayer.push({ event: 'marketing_accepted' });
    } else {
      window.dataLayer.push({ event: 'marketing_rejected' });
    }

    if (functionalCookies) {
      console.log('Functional cookies enabled');
      window.dataLayer.push({ event: 'functional_accepted' });
    } else {
      window.dataLayer.push({ event: 'functional_rejected' });
    }

    // Run deleteCookiesByCategory as an interval every 1 second
    setInterval(() => {
      if (!analyticsCookies) deleteCookiesByCategory('analytics');
      if (!marketingCookies) deleteCookiesByCategory('marketing');
      if (!functionalCookies) deleteCookiesByCategory('functional');
    }, 1000);
  }

  setInterval(() => {
    const analyticsCookies = Cookies.get('analyticsCookies') === 'true';
    const marketingCookies = Cookies.get('marketingCookies') === 'true';
    const functionalCookies = Cookies.get('functionalCookies') === 'true';

    if (!analyticsCookies) deleteCookiesByCategory('analytics');
    if (!marketingCookies) deleteCookiesByCategory('marketing');
    if (!functionalCookies) deleteCookiesByCategory('functional');
  }, 1000);

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
    </button>
  `;
    document.body.insertAdjacentHTML('beforeend', buttonTemplate);
  }

  // Function to accept all cookies
  function acceptAllCookies() {
    Cookies.set('analyticsCookies', true, { expires: 365, path: '/' });
    Cookies.set('marketingCookies', true, { expires: 365, path: '/' });
    Cookies.set('functionalCookies', true, { expires: 365, path: '/' });
    Cookies.set('cookieSettingsSaved', true, { expires: 365, path: '/' });

    const preferences = {
      analyticsCookies: true,
      marketingCookies: true,
      functionalCookies: true,
    };

    logConsent(preferences); // Log consent here
    console.log('Cookies Accepted');
    window.dataLayer.push({ event: 'analytics_accepted' });
    window.dataLayer.push({ event: 'marketing_accepted' });
    window.dataLayer.push({ event: 'functional_accepted' });
    const banner = document.querySelector('.cookie-banner');
    if (banner) banner.remove();
    createCookieSettingsButton();
    location.reload(); // Refresh the page to load scripts
  }

  // Function to reject all cookies
  function rejectAllCookies() {
    Cookies.set('analyticsCookies', false, { expires: 365, path: '/' });
    Cookies.set('marketingCookies', false, { expires: 365, path: '/' });
    Cookies.set('functionalCookies', false, { expires: 365, path: '/' });
    Cookies.set('cookieSettingsSaved', true, { expires: 365, path: '/' });

    const preferences = {
      analyticsCookies: false,
      marketingCookies: false,
      functionalCookies: false,
    };

    logConsent(preferences); // Log consent here
    console.log('Cookies Rejected');
    window.dataLayer.push({ event: 'analytics_rejected' });
    window.dataLayer.push({ event: 'marketing_rejected' });
    window.dataLayer.push({ event: 'functional_rejected' });

    // Delete cookies by category
    deleteCookiesByCategory('analytics');
    deleteCookiesByCategory('marketing');
    deleteCookiesByCategory('functional');

    const banner = document.querySelector('.cookie-banner');
    if (banner) banner.remove();
    createCookieSettingsButton();
    location.reload(); // Refresh the page to remove scripts
  }

  // Function to initialize the script
  function initializeCookieScript() {
    console.log('Initializing Cookie Script');
    const cookieSettingsSaved = Cookies.get('cookieSettingsSaved') === 'true';

    if (cookieSettingsSaved) {
      createCookieSettingsButton();
    } else {
      createCookieBanner();
    }

    applyCookiePreferences(); // Notify GTM of the current cookie status
  }

  // Attach functions to the window object for accessibility
  window.createSettingsModal = createSettingsModal;
  window.closeSettingsModal = closeSettingsModal;
  window.saveCookiePreferences = saveCookiePreferences;
  window.acceptAllCookies = acceptAllCookies;
  window.rejectAllCookies = rejectAllCookies;
  window.deleteCookiesByCategory = deleteCookiesByCategory;

  // Call the initialization function directly
  // Ensure the DOM is fully loaded before initializing the script
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCookieScript);
  } else {
    initializeCookieScript();
  }
})();
