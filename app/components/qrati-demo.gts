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
          <section class="seo-section"><p class="seo-kicker">Event Gallery Features</p><h2>Why Developers Choose Qrati Connect</h2><div class="seo-features-grid"><article class="seo-feature-card"><h3>🖼️ Live Event Photo Wall</h3><p>Responsive masonry gallery and full-screen lightbox.</p></article><article class="seo-feature-card"><h3>📸 Guest Media Uploads</h3><p>QR uploads with compression and HEIC conversion.</p></article><article class="seo-feature-card"><h3>⭐ Reactions &amp; Contests</h3><p>Reactions, ratings, and live rankings.</p></article><article class="seo-feature-card"><h3>⚡ Native Embed</h3><p>Ember hosts the same framework-agnostic embed.</p></article></div></section>
          <section class="seo-section"><p class="seo-kicker">Common Questions</p><h2>Frequently Asked Questions</h2><div class="faq-list"><details open><summary>How do I embed an event photo gallery in Ember?</summary><p>Load the embed script and render it with your organization ID.</p></details><details><summary>Can attendees upload photos?</summary><p>Yes, when uploads are enabled in Qrati.</p></details><details><summary>How does Ember handle theme sync?</summary><p>Tracked state remounts the embed with the selected theme.</p></details><details><summary>Does it support dark mode?</summary><p>Yes. Set light or dark.</p></details><details><summary>Can I run photo contests?</summary><p>Yes. Rankings and reactions are supported.</p></details></div></section>
          <section class="seo-section seo-cta-section"><h2>Host Your Event on Qrati. <span class="cta-highlight">Stream the Live Gallery on Your Website.</span></h2><a class="btn-cta-primary" href="https://qrati.com">Host Your Event on Qrati →</a></section>
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
