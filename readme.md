# Cookie Consent Management Script for Google Tag Manager

## Overview

This script manages cookie consent preferences for analytics, marketing, and functional cookies. It allows users to customize their cookie settings and ensures compliance with GDPR and other privacy regulations. The script works with Google Tag Manager (GTM), and additional setup in GTM is required.

## Features

- Dynamic consent modal and banner.
- Cookie categorization: Analytics, Marketing, and Functional.
- Automatic deletion of cookies based on user preferences.
- Integration with Google Tag Manager (GTM) via `dataLayer` events.

## Setup Instructions

### 1\. Include Styles and Script

Add the following to your HTML to include the script and styles:

```
<link rel="stylesheet" href="https://cookie-consent-for-gtm.pages.dev/styles.min.css" />
<script src="https://cookie-consent-for-gtm.pages.dev/script.min.js"></script>

```

### 2\. Google Tag Manager Integration

This script sends events to the `dataLayer` based on user consent preferences:

- `analytics_accepted` or `analytics_rejected`
- `marketing_accepted` or `marketing_rejected`
- `functional_accepted` or `functional_rejected`

#### Create GTM Triggers

1.  **Example Trigger for All Pages View Plus Marketing Accepted:**

    - Go to **Triggers** > **New**.
    - Choose **Trigger Configuration** > **Trigger Group**.
    - Add:
      - **Page View** (for all pages).
      - Custom Event: `marketing_accepted`.
    - Save the trigger.

2.  Use this trigger to fire tags that rely on marketing cookies, such as remarketing scripts.

### 3\. DataLayer Example

Here's how the script communicates consent preferences to GTM:

```
window.dataLayer.push({ event: 'analytics_accepted' });
window.dataLayer.push({ event: 'marketing_rejected' });

```

## User Interaction

- **Consent Banner:** Displays on first visit or when settings are reset.
- **Settings Modal:** Accessible via a settings button.
- **Save Preferences:** Updates consent preferences and reloads the page.
- **Accept All/Reject All Buttons:** Apply global consent preferences.

## How It Works

1.  **Initialization:**

    - Checks for saved consent preferences.
    - Displays a banner if preferences are not set.
    - Sends existing preferences to GTM.

2.  **Cookie Management:**

    - Deletes cookies that don't align with user preferences.
    - Uses the `js-cookie` library for easier cookie handling.

3.  **Periodic Cleanup:**

    - Automatically deletes non-compliant cookies every second to ensure adherence to preferences.

## Notes

- Ensure GTM tags use the appropriate triggers for consent management.
- Customize the script URL and stylesheet if needed for your project.

For more details or support, contact the script maintainer.
