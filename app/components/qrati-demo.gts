import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import { modifier } from 'ember-modifier';

const ORG = import.meta.env.VITE_ORGANIZATION_ID || '69ad9c7876d8bf6f864b3a65';
const EMBED_URL =
  import.meta.env.VITE_QRATI_EMBED_URL ||
  'https://cdn.jsdelivr.net/npm/@qratilabs/qrati-connect/embed/embed.js';
const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || '';
const STORAGE_KEY = 'qc_demo_user';
const GITHUB_ORG = 'qrati-labs';
const REPO = 'qrati-connect-ember-example';

interface AuthUser {
  userId: string;
  email: string;
  fname: string;
  lname: string;
}

function loadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

async function hashEmail(email: string): Promise<string> {
  const data = new TextEncoder().encode(email.toLowerCase().trim());
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 16);
}

// Re-injects the embed script whenever the user or theme changes.
const mountEmbed = modifier(
  (element: HTMLElement, [user, theme]: [AuthUser, string]) => {
    element.innerHTML = '';
    const s = document.createElement('script');
    s.async = true;
    s.src = EMBED_URL;
    s.dataset.organizationId = ORG;
    s.dataset.router = 'hash';
    s.dataset.theme = theme;
    s.dataset.uid = user.userId;
    s.dataset.fname = user.fname;
    s.dataset.lname = user.lname;
    element.appendChild(s);
  },
);

export default class QratiDemo extends Component {
  @tracked theme: 'light' | 'dark' =
    (localStorage.getItem('qc-theme') as 'light' | 'dark') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  @tracked user: AuthUser | null = loadUser();
  @tracked email = '';
  @tracked name = '';
  @tracked loading = false;
  @tracked error = '';

  repoUrl = `https://github.com/${GITHUB_ORG}/${REPO}`;
  vscodeUrl = `https://vscode.dev/github/${GITHUB_ORG}/${REPO}`;
  year = new Date().getFullYear();

  constructor(owner: unknown, args: object) {
    super(owner, args);
    document.documentElement.setAttribute('data-theme', this.theme);
  }

  @action
  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', this.theme);
    localStorage.setItem('qc-theme', this.theme);
  }

  @action
  updateName(e: Event) {
    this.name = (e.target as HTMLInputElement).value;
  }

  @action
  updateEmail(e: Event) {
    this.email = (e.target as HTMLInputElement).value;
  }

  @action
  async handleSubmit(e: Event) {
    e.preventDefault();
    if (!this.email.trim() || !this.name.trim()) {
      this.error = 'Email and name are required.';
      return;
    }
    this.loading = true;
    this.error = '';
    try {
      const userId = await hashEmail(this.email.trim());
      const [fname, ...rest] = this.name.trim().split(/\s+/);
      const user: AuthUser = { userId, email: this.email.trim(), fname: fname || '', lname: rest.join(' ') };
      if (API_ENDPOINT) {
        try {
          await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email, name: this.name.trim(), userId }),
          });
        } catch (err) {
          console.error('demo-login failed:', err);
        }
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      this.user = user;
    } catch {
      this.error = 'Login failed. Try again.';
    } finally {
      this.loading = false;
    }
  }

  @action
  handleLogout() {
    localStorage.removeItem(STORAGE_KEY);
    this.user = null;
    this.email = '';
    this.name = '';
  }

  <template>
    <button class="theme-toggle" type="button" {{on "click" this.toggleTheme}} aria-label="Toggle theme">
      {{if this.isDark "☀ Light" "🌙 Dark"}}
    </button>

    <div class="page-shell">
      <div class="page-frame">
        <header class="hero">
          <p class="hero-kicker">Qrati Connect Demo</p>
          <h1>
            <a href="https://qrati.com" target="_blank" rel="noopener noreferrer">Qrati</a> Connect inside an Ember host site
          </h1>
          <p class="hero-copy">
            This example shows how to embed
            <a href="https://qrati.com" target="_blank" rel="noopener noreferrer">Qrati</a> Connect into an
            Ember app using the no-code <strong>embed script</strong>, with a host-controlled theme and a
            demo login for organizations that use custom auth.
          </p>
          <div class="action-pills" aria-label="Example links">
            <a href={{this.repoUrl}} target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"/></svg>
              <span>View on GitHub</span>
            </a>
            <a href={{this.vscodeUrl}} target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M10.863 13.919a.8.8 0 0 1-.644.025a.8.8 0 0 1-.279-.183L4.816 9.063l-2.232 1.703a.54.54 0 0 1-.691-.031l-.716-.655a.546.546 0 0 1 0-.805L3.112 7.5L1.177 5.725a.546.546 0 0 1 0-.805l.716-.655a.54.54 0 0 1 .691-.031l2.232 1.703L9.94 1.239a.805.805 0 0 1 .923-.159l2.677 1.295c.281.136.46.422.46.736V8h-3.248V4.534L6.864 7.5l3.888 2.966V8H14v3.889c0 .314-.179.6-.46.736z"/></svg>
              <span>Open in VS Code</span>
            </a>
          </div>
        </header>

        <main class="content-shell">
          {{#if this.user}}
            <div class="session-bar">
              <span>Signed in as <strong>{{this.user.fname}} {{this.user.lname}}</strong> ({{this.user.email}})</span>
              <button class="btn-ghost" type="button" {{on "click" this.handleLogout}}>Log out</button>
            </div>
            <div class="widget-frame" {{mountEmbed this.user this.theme}}></div>
          {{else}}
            <div class="login-card">
              <h2>Demo sign in</h2>
              <p class="sub">Identify yourself to load the widget as a known user.</p>
              <form class="login-form" {{on "submit" this.handleSubmit}}>
                <div class="field">
                  <label for="name">Full name</label>
                  <input id="name" type="text" value={{this.name}} {{on "input" this.updateName}} placeholder="John Doe" autocomplete="name" />
                </div>
                <div class="field">
                  <label for="email">Email</label>
                  <input id="email" type="email" value={{this.email}} {{on "input" this.updateEmail}} placeholder="john@example.com" autocomplete="email" />
                </div>
                {{#if this.error}}<p class="error">{{this.error}}</p>{{/if}}
                <button class="btn-primary" type="submit" disabled={{this.loading}}>
                  {{if this.loading "Signing in…" "Sign in & load widget"}}
                </button>
              </form>
            </div>
          {{/if}}
        </main>

        <footer class="footer">
          <div class="footer-brand">
            <img src="https://assets.qrati.com/images/qrati-connect-logo-square.png" alt="Qrati Connect logo" referrerpolicy="no-referrer" />
            <div>
              <span class="footer-title"><span>Qrati</span> Connect</span>
              <p>Elevate your event experience.</p>
            </div>
          </div>
          <div class="footer-meta">
            <nav aria-label="Footer navigation">
              <a href="https://qrati.com" target="_blank" rel="noopener noreferrer">qrati.com</a>
              <a href="https://www.npmjs.com/package/@qratilabs/qrati-connect" target="_blank" rel="noopener noreferrer">npm</a>
              <a href="https://github.com/qrati-labs" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="https://qrati.com/pricing" target="_blank" rel="noopener noreferrer">Pricing</a>
            </nav>
            <p class="footer-note">© {{this.year}} Qrati Labs. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  </template>

  get isDark() {
    return this.theme === 'dark';
  }
}
