import type { ProductSlug } from '../config';

export type Status = 'in-development' | 'beta' | 'released';

export interface Feature {
  title: string;
  body: string;
}

export interface Tier {
  name: string;
  price: string;
  priceNote: string;
  items: string[];
}

export interface Permission {
  name: string;
  kind: 'permission' | 'optional permission' | 'host permission';
  why: string;
}

export interface ImportSource {
  /** Product whose data can be imported. Named factually; no affiliation. */
  from: string;
  what: string;
  how: string;
}

export interface Product {
  slug: ProductSlug;
  name: string;
  /** Two-digit index used in the numbered layout. */
  index: string;
  category: string;
  tagline: string;
  summary: string;
  status: Status;
  statusNote: string;
  browsers: string[];
  features: Feature[];
  free: Tier;
  pro: Tier | null;
  imports: ImportSource;
  /** Privacy-policy specific content. */
  privacy: {
    dataHandled: string[];
    network: string[];
    permissions: Permission[];
    retention: string[];
  };
}

export const STATUS_LABEL: Record<Status, string> = {
  'in-development': 'In development',
  beta: 'Beta',
  released: 'Released',
};

const LICENCE_NETWORK =
  'Optional Pro licence activation. When you enter a licence key, the extension sends the key and a random instance identifier to the Lemon Squeezy licence API to activate and later re-validate it. Nothing else is sent. The response (valid or not, and the licence expiry if any) is stored locally as an entitlement flag.';

export const products: Record<ProductSlug, Product> = {
  arbor: {
    slug: 'arbor',
    name: 'Arbor',
    index: '01',
    category: 'Tree-style tab and session manager',
    tagline: 'Your windows and tabs as a tree. Every branch saved, every session recoverable.',
    summary:
      'Arbor keeps a live tree of your windows and tabs in the browser side panel. Close a branch and it stays in the tree until you want it back. Snapshots are written continuously, so a crash or a forced restart never costs you a session.',
    status: 'in-development',
    statusNote: 'Not yet on the Chrome Web Store. Source is public; builds are for testing only.',
    browsers: ['Chrome', 'Edge'],
    features: [
      {
        title: 'Side-panel tree',
        body: 'Windows, tab groups and tabs shown as a collapsible tree in the Chrome side panel. Drag to reorder or move between windows.',
      },
      {
        title: 'Notes on any node',
        body: 'Attach a note to a tab, a group or a window. Notes travel with the node when you save, restore or export.',
      },
      {
        title: 'Close and save',
        body: 'Closing a tab or window from the tree keeps it as a saved node. Restore a single tab or an entire branch with one click.',
      },
      {
        title: 'Search',
        body: 'Search titles, URLs and notes across open and saved nodes. Results are grouped by window.',
      },
      {
        title: 'Crash-safe snapshots',
        body: 'The tree is snapshotted to local storage on every change. After a crash, a recovery screen lets you review and restore the last good state.',
      },
      {
        title: 'Import from Tabs Outliner',
        body: 'Load a Tabs Outliner backup file and get the same hierarchy, notes and saved windows in Arbor.',
      },
    ],
    free: {
      name: 'Free',
      price: '$0',
      priceNote: 'MIT-licensed, forever',
      items: [
        'Full side-panel tree',
        'Notes, close-and-save, search',
        'Crash-safe snapshots and recovery screen',
        'Manual export and import of backups',
        'Tabs Outliner backup import',
      ],
    },
    pro: {
      name: 'Pro',
      price: '$15',
      priceNote: 'One-time payment, no subscription',
      items: [
        'Scheduled local backups',
        'Google Drive backup to your own account',
        'Keyboard and clipboard power features',
        'Licence valid across all your browser profiles',
        'Everything in Free',
      ],
    },
    imports: {
      from: 'Tabs Outliner',
      what: 'backup files (.tree)',
      how: 'Export a backup from Tabs Outliner, open Arbor, choose Import, pick the file. The hierarchy, notes and saved windows are recreated. Nothing is uploaded; the file is parsed in your browser.',
    },
    privacy: {
      dataHandled: [
        'The URL, title and favicon of each open tab, and the structure of your windows and tab groups. This is required to draw the tree.',
        'Notes you write on tree nodes.',
        'Snapshots of the tree, kept so a session can be recovered after a crash.',
        'Settings, such as backup schedule and keyboard shortcuts.',
        'If you activate Pro: your licence key and the resulting entitlement status.',
      ],
      network: [
        LICENCE_NETWORK,
        'Optional Google Drive backup (Pro). If you turn it on, Arbor asks Chrome for a Google OAuth token via chrome.identity with the drive.file scope. That scope only grants access to files Arbor itself creates. Backup files are uploaded directly from your browser to your own Google Drive; they never pass through a BrowserForge server, because there is none. You can disconnect at any time from the Arbor settings page or from your Google account permissions page, after which Arbor holds no token.',
        'No other network requests are made. Arbor does not fetch favicons from third parties; it uses the favicon Chrome already has.',
      ],
      permissions: [
        { name: 'tabs', kind: 'permission', why: 'Read the URL and title of each tab and react to tabs opening, moving and closing so the tree stays current.' },
        { name: 'tabGroups', kind: 'permission', why: 'Show tab groups in the tree and keep group colours and names in saved sessions.' },
        { name: 'sidePanel', kind: 'permission', why: 'Display the tree in the browser side panel.' },
        { name: 'storage', kind: 'permission', why: 'Store the tree, notes, snapshots and settings locally.' },
        { name: 'unlimitedStorage', kind: 'permission', why: 'Large trees and snapshot histories can exceed the default storage quota.' },
        { name: 'sessions', kind: 'permission', why: 'Restore recently closed tabs and windows with their history intact.' },
        { name: 'favicon', kind: 'permission', why: 'Show the favicon Chrome has already cached for each tab, without contacting any site.' },
        { name: 'alarms', kind: 'permission', why: 'Run scheduled local backups (Pro) at the interval you choose.' },
        { name: 'downloads', kind: 'permission', why: 'Write backup files to your downloads folder when you export or when a scheduled backup runs.' },
        { name: 'identity', kind: 'optional permission', why: 'Obtain a Google OAuth token for Drive backup (Pro). Requested only when you enable Drive backup.' },
        { name: 'https://www.googleapis.com/*', kind: 'host permission', why: 'Upload backups to Google Drive (Pro). Requested only when you enable Drive backup.' },
      ],
      retention: [
        'Tree data, notes and snapshots stay in local extension storage until you delete them in Arbor or uninstall the extension. Uninstalling removes all local extension data.',
        'Backup files you export, or that scheduled backups write, are ordinary files on your disk or in your Google Drive and are under your control.',
        'The licence entitlement flag is removed when you deactivate the licence or uninstall.',
      ],
    },
  },

  reroute: {
    slug: 'reroute',
    name: 'Reroute',
    index: '02',
    category: 'URL rewrite rules',
    tagline: 'Rewrite URLs on the way in. Wildcards, regular expressions, and a rule tester that tells the truth.',
    summary:
      'Reroute redirects and rewrites URLs before they load. Write rules with wildcards or regular expressions, use capture groups and transforms, and check each rule against sample URLs before you turn it on. A built-in cleaner strips tracking parameters using the ClearURLs rule catalog shipped inside the extension.',
    status: 'in-development',
    statusNote: 'Not yet on the Chrome Web Store. Source is public; builds are for testing only.',
    browsers: ['Chrome', 'Edge'],
    features: [
      {
        title: 'Wildcard and regex rules',
        body: 'Match with simple wildcards or full regular expressions. Use capture groups in the destination and apply transforms such as lowercase, encode or decode.',
      },
      {
        title: 'SPA and history-state redirects',
        body: 'Rules also apply to navigations that never hit the network, such as single-page apps changing the URL with pushState.',
      },
      {
        title: 'Tracking-parameter cleaner',
        body: 'Removes utm_*, fbclid, gclid and hundreds of other tracking parameters using the ClearURLs rule catalog. The catalog ships inside the extension; nothing is downloaded at runtime.',
      },
      {
        title: 'Per-site allowlist',
        body: 'Exclude sites where redirects should never apply. Allowlist entries win over every rule.',
      },
      {
        title: 'Rule tester',
        body: 'Paste a URL and see exactly which rule matches, what the captures are, and the resulting destination, before the rule is enabled.',
      },
      {
        title: 'Import from Redirector',
        body: 'Import a Redirector rule export and get the same rules, one to one, including wildcards, regex, exclude patterns and resource types.',
      },
    ],
    free: {
      name: 'Free',
      price: '$0',
      priceNote: 'MIT-licensed, forever',
      items: [
        'Unlimited wildcard and regex rules',
        'Capture groups and transforms',
        'SPA/history-state redirects',
        'Tracking-parameter cleaner',
        'Per-site allowlist and rule tester',
        'Redirector rule import and export',
      ],
    },
    pro: {
      name: 'Pro',
      price: '$9',
      priceNote: 'One-time payment, no subscription',
      items: [
        'Cross-device rule sync through your browser account',
        'Curated rule packs',
        'Shareable team rule sets',
        'Everything in Free',
      ],
    },
    imports: {
      from: 'Redirector',
      what: 'rule export files (.json)',
      how: 'Export your rules from Redirector, open Reroute, choose Import, pick the file. Each rule is converted one to one and disabled until you review it. The file is parsed in your browser and never uploaded.',
    },
    privacy: {
      dataHandled: [
        'The rules you write or import: patterns, destinations, allowlist entries, and their enabled state.',
        'Settings, such as whether the tracking-parameter cleaner is on.',
        'When a rule matches, Reroute necessarily reads the URL being navigated to in order to rewrite it. It does not read page content, form data, cookies or headers, and it does not keep a history of URLs it has rewritten unless you turn on the local debug log, which is off by default and stored only on your device.',
        'If you activate Pro: your licence key and the resulting entitlement status.',
      ],
      network: [
        LICENCE_NETWORK,
        'Reroute downloads no rule lists at runtime. The tracking-parameter catalog and any curated rule packs are bundled in the extension package and update only when the extension itself updates through the store.',
        'Cross-device rule sync (Pro) uses chrome.storage.sync, the sync storage built into your browser. Your rules are transported by your browser vendor under your own browser account and never touch a BrowserForge server.',
        'No other network requests are made.',
      ],
      permissions: [
        { name: 'declarativeNetRequest', kind: 'permission', why: 'Redirect and rewrite URLs at the network layer without reading the request or response body.' },
        { name: 'declarativeNetRequestWithHostAccess', kind: 'permission', why: 'Allow redirect rules with regex substitution to apply on the sites you have granted access to.' },
        { name: 'webNavigation', kind: 'permission', why: 'Detect history-state navigations in single-page apps so rules can apply to them.' },
        { name: 'tabs', kind: 'permission', why: 'Update the URL of the current tab when a history-state redirect applies, and show the active rule count on the toolbar icon.' },
        { name: 'storage', kind: 'permission', why: 'Store rules, allowlist and settings locally, and in browser sync storage if Pro sync is enabled.' },
        { name: '<all_urls>', kind: 'host permission', why: 'Rules can target any site, so redirects must be able to apply on any origin. Reroute does not inject scripts or read page content.' },
      ],
      retention: [
        'Rules and settings stay in local storage (and browser sync storage if you enabled Pro sync) until you delete them or uninstall the extension.',
        'The optional debug log is capped at the most recent 500 entries and can be cleared from the options page.',
        'The licence entitlement flag is removed when you deactivate the licence or uninstall.',
      ],
    },
  },

  cookiesweep: {
    slug: 'cookiesweep',
    name: 'CookieSweep',
    index: '03',
    category: 'Automatic cookie and site-data cleanup',
    tagline: 'Leave a site, and its cookies leave with you.',
    summary:
      'CookieSweep deletes cookies and site data when you leave a site or close a tab, unless the site is on your whitelist. It understands partitioned cookies, clears localStorage, IndexedDB and cache alongside cookies, and keeps a local activity log so you can see exactly what was removed.',
    status: 'in-development',
    statusNote: 'Not yet on the Chrome Web Store. Source is public; builds are for testing only.',
    browsers: ['Chrome', 'Edge'],
    features: [
      {
        title: 'Cleanup on leave or close',
        body: 'When the last tab for a site closes, or after a configurable delay, its cookies and site data are removed.',
      },
      {
        title: 'Whitelist and greylist',
        body: 'Whitelisted sites are never cleaned. Greylisted sites keep their data until the browser restarts.',
      },
      {
        title: 'More than cookies',
        body: 'Clears localStorage, IndexedDB, cache and service worker registrations for the site, not just the cookie jar.',
      },
      {
        title: 'Partitioned-cookie aware',
        body: 'Handles cookies partitioned by top-level site (CHIPS) correctly, so embedded third-party state is cleaned with the site that created it.',
      },
      {
        title: 'Activity log',
        body: 'A local log of every cleanup: which site, what was removed, when. Nothing leaves your browser.',
      },
      {
        title: 'Import from Cookie AutoDelete',
        body: 'Import a Cookie AutoDelete settings and expression export and keep your whitelist, greylist and options.',
      },
    ],
    free: {
      name: 'Free',
      price: '$0',
      priceNote: 'MIT-licensed, zero telemetry, no Pro tier',
      items: [
        'Automatic cleanup on tab close or site leave',
        'Whitelist and greylist',
        'localStorage, IndexedDB, cache and service worker cleanup',
        'Partitioned-cookie support',
        'Local activity log',
        'Cookie AutoDelete settings import',
      ],
    },
    pro: null,
    imports: {
      from: 'Cookie AutoDelete',
      what: 'settings and expression exports (.json)',
      how: 'Export settings and expressions from Cookie AutoDelete, open CookieSweep, choose Import, pick the files. Whitelist and greylist entries and matching options are recreated. The files are parsed in your browser and never uploaded.',
    },
    privacy: {
      dataHandled: [
        'Your whitelist, greylist and settings.',
        'The hostnames of open tabs, in memory only, so CookieSweep knows when the last tab for a site has closed.',
        'A local activity log: hostname, what was removed, and a timestamp for each cleanup. The log can be disabled or cleared.',
        'CookieSweep reads cookie names and domains in order to delete them. It does not read cookie values into storage, and it never transmits them anywhere.',
      ],
      network: [
        'CookieSweep makes no network requests at all. It has no Pro tier, no licence check, no update feed and no telemetry.',
      ],
      permissions: [
        { name: 'cookies', kind: 'permission', why: 'Enumerate and delete cookies for a site, including partitioned cookies.' },
        { name: 'browsingData', kind: 'permission', why: 'Remove localStorage, IndexedDB, cache and service workers for a specific origin.' },
        { name: 'tabs', kind: 'permission', why: 'Know which sites are open and when a tab closes or navigates away, which is what triggers a cleanup.' },
        { name: 'storage', kind: 'permission', why: 'Store your whitelist, greylist, settings and activity log locally.' },
        { name: 'alarms', kind: 'permission', why: 'Run delayed cleanups after you leave a site, and periodic cleanups if you enable them.' },
        { name: 'notifications', kind: 'optional permission', why: 'Show a short notification after a cleanup, if you turn that option on.' },
        { name: '<all_urls>', kind: 'host permission', why: 'The cookies and browsingData APIs can only act on sites the extension has host access to. CookieSweep does not inject scripts or read page content.' },
      ],
      retention: [
        'Whitelist, greylist and settings stay in local storage until you change them or uninstall the extension.',
        'The activity log is capped at the most recent 1,000 entries by default and can be cleared or disabled from the options page.',
        'Open-tab hostnames are held in memory only and discarded when the browser closes.',
      ],
    },
  },
};

export const productList: Product[] = [products.arbor, products.reroute, products.cookiesweep];
