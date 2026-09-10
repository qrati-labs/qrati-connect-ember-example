import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { modifier } from 'ember-modifier';
import type Owner from '@ember/owner';
import { initCookieConsent } from '../lib/cookieConsent';

const ORG = import.meta.env.VITE_ORGANIZATION_ID || '';
const EMBED_URL =
  import.meta.env.VITE_CDN_URL ||
  'https://cdn.jsdelivr.net/npm/@qratilabs/qrati-connect/embed/embed.js';
const GITHUB_ORG = 'qrati-labs';
const REPO = 'qrati-connect-ember-example';

// Re-injects the embed script whenever the theme changes.
const mountEmbed = modifier((element: HTMLElement, [theme]: [string]) => {
  element.innerHTML = '';
  const s = document.createElement('script');
  s.async = true;
  s.src = EMBED_URL;
  s.dataset.organizationId = ORG;
  s.dataset.router = 'hash';
  s.dataset.theme = theme;
  element.appendChild(s);
});

export default class QratiDemo extends Component {
  @tracked theme: 'light' | 'dark' =
    (localStorage.getItem('qc-theme') as 'light' | 'dark') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light');

  repoUrl = `https://github.com/${GITHUB_ORG}/${REPO}`;
  vscodeUrl = `https://vscode.dev/github/${GITHUB_ORG}/${REPO}`;
  year = new Date().getFullYear();

  constructor(owner: Owner, args: object) {
    super(owner, args);
    document.documentElement.setAttribute('data-theme', this.theme);
    document.documentElement.classList.toggle('dark', this.theme === 'dark');
    initCookieConsent();
  }

  @action
  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', this.theme);
    document.documentElement.classList.toggle('dark', this.theme === 'dark');
    localStorage.setItem('qc-theme', this.theme);
  }

  <template>
    <button
      class="theme-toggle"
      type="button"
      {{on "click" this.toggleTheme}}
      aria-label="Toggle theme"
    >
      {{if this.isDark "☀ Light" "🌙 Dark"}}
    </button>

    <div class="page-shell">
      <div class="page-frame">
        <header class="hero">
          <p class="hero-kicker">Qrati Connect Demo</p>
          <h1>
            <a
              href="https://qrati.com"
              target="_blank"
              rel="noopener noreferrer"
            >Qrati</a>
            Connect inside an Ember host site
          </h1>
          <p class="hero-copy">
            This example shows how to embed
            <a
              href="https://qrati.com"
              target="_blank"
              rel="noopener noreferrer"
            >Qrati</a>
            Connect into an Ember app using the no-code
            <strong>embed script</strong>, with a host-controlled theme.
          </p>
          <div class="action-pills" aria-label="Example links">
            <a href={{this.repoUrl}} target="_blank" rel="noopener noreferrer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                aria-hidden="true"
              ><path
                  fill="currentColor"
                  d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
                /></svg>
              <span>View on GitHub</span>
            </a>
            <a
              href={{this.vscodeUrl}}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                aria-hidden="true"
              ><path
                  fill="currentColor"
                  d="M10.863 13.919a.8.8 0 0 1-.644.025a.8.8 0 0 1-.279-.183L4.816 9.063l-2.232 1.703a.54.54 0 0 1-.691-.031l-.716-.655a.546.546 0 0 1 0-.805L3.112 7.5L1.177 5.725a.546.546 0 0 1 0-.805l.716-.655a.54.54 0 0 1 .691-.031l2.232 1.703L9.94 1.239a.805.805 0 0 1 .923-.159l2.677 1.295c.281.136.46.422.46.736V8h-3.248V4.534L6.864 7.5l3.888 2.966V8H14v3.889c0 .314-.179.6-.46.736z"
                /></svg>
              <span>Open in VS Code</span>
            </a>
          </div>
        </header>

        <main class="content-shell">
          <section class="widget-frame" aria-label="Interactive Ember Event Gallery" {{mountEmbed this.theme}}><h2 class="sr-only">Live Event Photo Gallery Component</h2></section>
<section class="answer-section"><div><span class="seo-kicker">The short answer</span><h2>What does Qrati Connect add to Ember?</h2><p>It adds a complete hosted event-media experience: guests can discover galleries, upload media, search, react, rate, and join contests while Qrati controls access, branding, and moderation.</p></div><div class="answer-points"><span>✓ One embed to maintain</span><span>✓ No gallery backend</span><span>✓ Host-controlled theme and routing</span><span>✓ Organization-controlled features</span></div></section><section class="seo-section" aria-labelledby="feature-map-heading"><p class="seo-kicker">Complete capability map</p><h2 id="feature-map-heading">One embed. The full event experience.</h2><p class="section-intro">An active Qrati subscription is required. Your organization ID selects the event space, branding, access rules, and enabled features.</p><div class="feature-map-grid"><article class="feature-map-card"><div class="feature-map-heading"><iconify-icon icon="material-symbols:integration-instructions"></iconify-icon><h3>Embed cleanly</h3></div><p>Web component, themes, hash or memory routing, and host URL allowlists.</p></article><article class="feature-map-card"><div class="feature-map-heading"><iconify-icon icon="material-symbols:event"></iconify-icon><h3>Run the event</h3></div><p>Landing pages, folders, search, sorting, status, stats, and maps.</p></article><article class="feature-map-card"><div class="feature-map-heading"><iconify-icon icon="material-symbols:photo-library"></iconify-icon><h3>Show every memory</h3></div><p>Image/video layouts, lazy loading, captions, downloads, and lightbox.</p></article><article class="feature-map-card"><div class="feature-map-heading"><iconify-icon icon="material-symbols:cloud-upload"></iconify-icon><h3>Collect uploads</h3></div><p>Validation, progress, retry, cancel, HEIC conversion, crop, trim, and processing.</p></article><article class="feature-map-card"><div class="feature-map-heading"><iconify-icon icon="material-symbols:celebration"></iconify-icon><h3>Make it social</h3></div><p>Keyword/facial search, reactions, ratings, points, contests, and leaderboards.</p></article><article class="feature-map-card"><div class="feature-map-heading"><iconify-icon icon="material-symbols:shield-lock"></iconify-icon><h3>Keep people safe</h3></div><p>Authentication, roles, permissions, terms, moderation, and feature gates.</p></article></div></section><section class="seo-section" aria-labelledby="features-heading"><p class="seo-kicker">Why developers choose Qrati Connect</p><h2 id="features-heading">A reliable event layer, ready for Ember</h2><div class="seo-features-grid"><article class="seo-feature-card"><iconify-icon icon="material-symbols:gallery-thumbnail"></iconify-icon><h3>Live photo wall</h3><p>Responsive masonry, blurhash loading, and keyboard-friendly lightbox.</p></article><article class="seo-feature-card"><iconify-icon icon="material-symbols:photo-camera"></iconify-icon><h3>Guest uploads</h3><p>QR or direct uploads with compression and HEIC conversion.</p></article><article class="seo-feature-card"><iconify-icon icon="material-symbols:star"></iconify-icon><h3>Reactions and contests</h3><p>Emoji reactions, ratings, and live contest rankings.</p></article><article class="seo-feature-card"><iconify-icon icon="material-symbols:bolt"></iconify-icon><h3>Framework-friendly</h3><p>Use the same Qrati embed in Ember and other hosts.</p></article></div></section><section class="seo-section" aria-labelledby="quickstart-heading"><p class="seo-kicker">Developer integration</p><h2 id="quickstart-heading">Embed in 3 simple steps</h2><p class="section-intro">Install the package or embed script, render the element, and pass your organization ID. Subscription first; organization ID second.</p><pre><code>pnpm add @qratilabs/qrati-connect

&lt;qrati-connect organization-id="your-organization-id" theme="light" router="hash"&gt;&lt;/qrati-connect&gt;</code></pre></section><section class="seo-section" aria-labelledby="faq-heading"><p class="seo-kicker">Common questions</p><h2 id="faq-heading">Frequently asked questions</h2><div class="faq-list"><details open><summary>How do I embed an event photo gallery in Ember?</summary><p>Load Qrati Connect and render its element with your organization ID.</p></details><details><summary>Do I need a Qrati subscription?</summary><p>Yes. An active subscription is required. The organization ID connects the embed to your event space and settings.</p></details><details><summary>Can attendees upload photos?</summary><p>Yes, when uploads are enabled in your Qrati organization settings.</p></details><details><summary>Can I run photo contests?</summary><p>Yes. Rankings, reactions, and ratings are configured in Qrati.</p></details></div></section><section class="seo-section seo-cta-section"><div class="seo-cta-card"><p class="seo-kicker">Host on Qrati · embed anywhere</p><h2>Give every event a place to come alive.</h2><p>Start with a Qrati subscription, create your organization, and bring its live gallery to your Ember site.</p><a class="btn-cta-primary" href="https://qrati.com/contact-us">Contact Qrati →</a></div></section>
        </main>

        <footer class="footer">
          <div class="footer-brand">
            <img
              src="https://assets.qrati.com/images/qrati-connect-logo-square.png"
              alt="Qrati Connect logo"
              referrerpolicy="no-referrer"
            />
            <div>
              <span class="footer-title"><span>Qrati</span> Connect</span>
              <p>Elevate your event experience.</p>
            </div>
          </div>
          <div class="footer-meta">
            <nav aria-label="Footer navigation">
              <a
                href="https://qrati.com"
                target="_blank"
                rel="noopener noreferrer"
              >qrati.com</a>
              <a
                href="https://www.npmjs.com/package/@qratilabs/qrati-connect"
                target="_blank"
                rel="noopener noreferrer"
              >npm</a>
              <a
                href="https://github.com/qrati-labs"
                target="_blank"
                rel="noopener noreferrer"
              >GitHub</a>
              <a
                href="https://qrati.com/pricing"
                target="_blank"
                rel="noopener noreferrer"
              >Pricing</a>
            </nav>
            <p class="footer-note">©
              {{this.year}}
              Qrati Labs. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  </template>

  get isDark() {
    return this.theme === 'dark';
  }
}
