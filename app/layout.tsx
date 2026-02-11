import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import Script from "next/script";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Morpeth Gallery | Portman Gallery",
  description:
    "Morpeth Gallery (Portman Gallery) showcases art and photography from students, guest artists and collaborators across the school year.",

  // Keep root fallbacks for browser conventions, but point everything else at the tidy folder.
  manifest: "/morpeth-icon-pack/site.webmanifest",

  icons: {
    // Browsers often look for /favicon.ico automatically; we also provide explicit PNG icons.
    icon: [
      { url: "/favicon.ico" },
      {
        url: "/morpeth-icon-pack/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/morpeth-icon-pack/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    // iOS often looks for /apple-touch-icon.png by default, so keep it at the root.
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },

  other: {
    "msapplication-config": "/morpeth-icon-pack/browserconfig.xml",
    "msapplication-TileColor": "#0d2a45",
  },
};

export const viewport = {
  themeColor: "#0d2a45",
};

const mainNav = [
  { href: "/", label: "About" },
  { href: "/exhibitions", label: "Exhibitions" },
  { href: "/student", label: "Student" },
  { href: "/guest-artists", label: "Guest Artists" },
  { href: "/clubs", label: "Clubs" },
  { href: "/support", label: "Support" },
];

const socialLinks: { label: string; href: string }[] = [];

export default function RootLayout({ children }: { children: ReactNode }) {
  const currentYear = new Date().getFullYear();

  return (
    <html lang="en">
      <body className="bg-morpeth-offwhite text-morpeth-navy">
        <div className="flex min-h-screen flex-col">
          {/* Global header / navigation */}
          <header
            className="site-header sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur transition-transform duration-300 will-change-transform"
            data-header
          >
            <div className="site-header-inner mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/morpeth-logo.png"
                  alt="Morpeth School logo"
                  width={44}
                  height={44}
                  className="h-11 w-auto"
                  priority
                />
                <div className="leading-tight">
                  <div className="font-heading text-xs uppercase tracking-[0.25em] text-morpeth-navy md:text-sm">
                    Morpeth Gallery
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Portman Gallery
                  </div>
                </div>
              </Link>

              <nav className="hidden gap-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700 md:flex">
                {mainNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    data-nav-link
                    data-href={item.href}
                    className="nav-link relative hover:text-morpeth-navy"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/70 text-slate-800 shadow-sm transition hover:bg-white md:hidden touch-manipulation"
                aria-label="Open menu"
                aria-controls="mobile-drawer"
                aria-expanded="false"
                data-menu-open
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 7h16M4 12h16M4 17h16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </header>

          {/* Mobile slide-out drawer */}
          <div id="mobile-drawer" className="mobile-drawer" aria-hidden="true">
            {/* IMPORTANT: make overlay a button for reliable taps on iOS */}
            <button
              type="button"
              className="mobile-drawer__overlay"
              aria-label="Close menu"
              data-menu-close
            />
            <aside
              className="mobile-drawer__panel"
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
            >
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Menu
                </p>
                <button
                  type="button"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:bg-slate-50 touch-manipulation"
                  aria-label="Close menu"
                  data-menu-close
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 6l12 12M18 6L6 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              <nav className="mt-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Main navigation
                </p>
                <ul className="mt-2 space-y-1">
                  {mainNav.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="mobile-drawer__link"
                        data-mobile-nav-link
                        data-href={item.href}
                        data-menu-link
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

            </aside>
          </div>

          {/* Main page content */}
          <main className="flex-1">{children}</main>

          {/* Global footer */}
          <footer className="mt-16 bg-morpeth-offwhite text-morpeth-navy md:mt-24">
            <div className="mx-auto max-w-6xl px-4 pb-8 pt-4 text-sm">
              <div className="grid items-start gap-10 md:grid-cols-2 lg:grid-cols-[1.2fr,1.5fr]">
                <div>
                  <div className="flex items-start gap-4">
                    <Image
                      src="/morpeth-logo.png"
                      alt="Morpeth School crest"
                      width={64}
                      height={64}
                      className="h-14 w-auto md:h-16"
                    />
                    <div>
                      <h2 className="font-heading text-lg uppercase tracking-[0.25em] text-morpeth-navy">
                        Morpeth Gallery
                      </h2>
                      <p className="mt-1 max-w-sm text-xs text-slate-600">
                        Morpeth Gallery (Portman Gallery) showcases art and photography from students, guest artists and collaborators across the school year.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">
                      About Morpeth
                    </h3>
                    <ul className="mt-3 space-y-1 text-sm">
                      <li>Portman Place, Bethnal Green</li>
                      <li>London E2 0PX</li>
                      <li className="mt-2">Tel: 020 8981 0921</li>
                      <li>Email: info@morpeth.towerhamlets.sch.uk</li>
                    </ul>
                  </div>
                </div>

                <div className="md:pl-4">
                  <h3 className="sr-only">Find us</h3>
                  <div className="mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
                    <div className="hidden md:block h-72 sm:h-80 md:h-[22rem] lg:h-[24rem]">
                      <iframe
                        title="Map showing Morpeth School location"
                        src="https://www.openstreetmap.org/export/embed.html?bbox=-0.052694%2C51.521544%2C-0.042694%2C51.531544&layer=mapnik&marker=51.526544%2C-0.047694"
                        className="h-full w-full border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        allowFullScreen
                      />
                    </div>
                    <div className="md:hidden h-56 flex items-center justify-center bg-slate-100">
                      <div className="px-6 text-center">
                        <p className="text-sm font-semibold text-morpeth-navy">Map preview</p>
                        <p className="mt-1 text-xs text-slate-600">
                          Tap a link below to open directions.
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-slate-200/70 px-4 py-3 text-xs text-slate-600 flex flex-wrap items-center gap-x-5 gap-y-2">
                      <Link
                        href="https://www.google.com/maps?q=51.526544,-0.047694"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-morpeth-navy underline underline-offset-4 hover:opacity-80"
                      >
                        Open in Google Maps
                      </Link>
                      <Link
                        href="https://maps.apple.com/?q=Morpeth%20School&ll=51.526544,-0.047694"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-morpeth-navy underline underline-offset-4 hover:opacity-80"
                      >
                        Open in Apple Maps
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {socialLinks.length ? (
                <div className="mt-10 flex justify-center gap-6 text-slate-600">
                  {socialLinks.map(({ label, href }) => (
                    <Link
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="group flex items-center gap-2 hover:text-morpeth-navy"
                    >
                      {label === "Instagram" && (
                        <svg
                          viewBox="0 0 24 24"
                          className="h-5 w-5 transition-colors group-hover:fill-morpeth-navy"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 2 .2 2.7.5.7.3 1.3.7 1.9 1.3.6.6 1 .12 1.3 1.9.3.7.4 1.5.5 2.7.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 2-.5 2.7a4.7 4.7 0 0 1-1.3 1.9 4.7 4.7 0 0 1-1.9 1.3c-.7.3-1.5.4-2.7.5-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-2-.2-2.7-.5a4.7 4.7 0 0 1-1.9-1.3 4.7 4.7 0 0 1-1.3-1.9c-.3-.7-.4-1.5-.5-2.7C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-2 .5-2.7.3-.7.7-1.3 1.3-1.9.6-.6 1.2-1 1.9-1.3.7-.3 1.5-.4 2.7-.5C8.4 2.2 8.8 2.2 12 2.2Zm0 2c-3.1 0-3.5 0-4.7.1-1 0-1.6.2-2 .4-.5.2-.8.4-1.2.8-.4.4-.6.7-.8 1.2-.2.4-.4 1-.4 2C2.8 10.5 2.8 10.9 2.8 12s0 1.5.1 2.7c0 1 .2 1.6.4 2 .2.5.4.8.8 1.2.4.4.7.6 1.2.8.4.2 1 .4 2 .4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1 0 1.6-.2 2-.4.5-.2.8-.4 1.2-.8.4-.4.6-.7.8-1.2.2-.4.4-1 .4-2 .1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c0-1-.2-1.6-.4-2-.2-.5-.4-.8-.8-1.2a3 3 0 0 0-1.2-.8c-.4-.2-1-.4-2-.4-1.2-.1-1.6-.1-4.7-.1Zm0 3.5a5.3 5.3 0 1 1 0 10.6 5.3 5.3 0 0 1 0-10.6Zm0 2a3.3 3.3 0 1 0 0 6.6 3.3 3.3 0 0 0 0-6.6Zm5.9-2.6a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z" />
                        </svg>
                      )}
                      {label === "Twitter" && (
                        <svg
                          viewBox="0 0 24 24"
                          className="h-5 w-5 transition-colors group-hover:fill-morpeth-navy"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M3 3h4.5l4.1 5.6L16.8 3H21l-7.1 8.4L21 21h-4.5l-4.4-6L7.2 21H3l7.3-8.6L3 3zm3.1 1.5 4.3 6-4.3 5.1H6l4.5-5.3L6.2 4.5h-.1zm8.9 0-4.4 5.2 4.4 5.8h.1l-4.6-6 4.6-5h-.1z" />
                        </svg>
                      )}
                      {label === "YouTube" && (
                        <svg
                          viewBox="0 0 24 24"
                          className="h-5 w-5 transition-colors group-hover:fill-morpeth-navy"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M23.5 7.5a4 4 0 0 0-.8-1.8c-.7-.8-1.7-.9-2.2-1C17.9 4.4 12 4.4 12 4.4s-5.9 0-8.5.3c-.5.1-1.5.2-2.2 1a4 4 0 0 0-.8 1.8C0 9.1 0 12 0 12s0 2.9.5 4.5a4 4 0 0 0 .8 1.8c.7.8 1.7.9 2.2 1C6.1 19.6 12 19.6 12 19.6s5.9 0 8.5-.3c.5-.1 1.5-.2 2.2-1 .4-.5.7-1.1.8-1.8.5-1.6.5-4.5.5-4.5s0-2.9-.5-4.5ZM9.6 15.4V8.6l6.4 3.4-6.4 3.4Z" />
                        </svg>
                      )}
                      <span className="text-sm">{label}</span>
                    </Link>
                  ))}
                </div>
              ) : null}

              <div className="mt-10 border-t border-slate-200 pt-4 text-center text-xs text-slate-500">
                © {currentYear} Morpeth Gallery. All rights reserved.
              </div>
            </div>
          </footer>

          <Analytics />
          <SpeedInsights />
          <Script id="morpeth-ui" strategy="afterInteractive">
            {`
(function(){
  // Prevent double init in dev/hot reload
  if (window.__morpethUIInit) return;
  window.__morpethUIInit = true;

  const root = document.documentElement;

  // Sticky header scroll-state and hide-on-scroll
  let lastScroll = window.scrollY;
  const header = document.querySelector('[data-header]');
  const onScroll = () => {
    const current = window.scrollY;

    if (current > 8) root.dataset.scrolled = 'true';
    else delete root.dataset.scrolled;

    if (header) {
      if (current > lastScroll && current > 80) header.style.transform = 'translateY(-100%)';
      else header.style.transform = 'translateY(0)';
    }

    lastScroll = current;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Active underline in desktop nav
  const setActive = () => {
    const path = window.location.pathname.replace(/\\/$/, '') || '/';
    document.querySelectorAll('[data-nav-link], [data-mobile-nav-link]').forEach((el) => {
      const href = (el.getAttribute('data-href') || '').replace(/\\/$/, '') || '/';
      const isActive = href === '/' ? path === '/' : path.startsWith(href);
      el.classList.toggle('is-active', isActive);
    });
  };

  // Site-wide reveal-on-scroll effects for pages that do not use explicit RevealOnScroll wrappers.
  let revealObserver = null;
  let revealRaf = 0;

  const isRevealCandidate = (node) => {
    if (!node || !(node instanceof HTMLElement)) return false;
    if (node.closest('[data-no-auto-reveal]')) return false;
    if (node.classList.contains('reveal-observe')) return false;
    if (node.querySelector('.reveal-observe')) return false;
    if (node.getAttribute('aria-hidden') === 'true') return false;

    const className = typeof node.className === 'string' ? node.className : '';
    if (/(^|\\s)(sr-only|pointer-events-none)(\\s|$)/.test(className)) return false;
    if (/(^|\\s)(absolute|fixed)(\\s|$)/.test(className)) return false;

    return true;
  };

  const uniqueNodes = (nodes) => nodes.filter((node, index, all) => all.indexOf(node) === index);

  const collectRevealTargets = () => {
    if (window.location.pathname.startsWith('/studio')) return [];

    const targets = [];

    document.querySelectorAll('main').forEach((mainEl) => {
      if (!(mainEl instanceof HTMLElement)) return;

      const semanticBlocks = Array.from(mainEl.querySelectorAll('section, article, header')).filter((node) =>
        isRevealCandidate(node)
      );

      if (semanticBlocks.length > 0) {
        semanticBlocks.forEach((node) => targets.push(node));
        return;
      }

      const directChildren = Array.from(mainEl.children).filter((node) => isRevealCandidate(node));
      directChildren.forEach((node) => targets.push(node));

      if (directChildren.length === 1 && directChildren[0] instanceof HTMLElement) {
        Array.from(directChildren[0].children)
          .filter((node) => isRevealCandidate(node))
          .forEach((node) => targets.push(node));
      }
    });

    return uniqueNodes(targets);
  };

  const refreshAutoReveals = () => {
    if (revealObserver) {
      revealObserver.disconnect();
      revealObserver = null;
    }

    const targets = collectRevealTargets();
    if (!targets.length) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasIntersectionObserver = 'IntersectionObserver' in window;

    targets.forEach((node, index) => {
      node.classList.add('reveal-observe');
      node.dataset.autoRevealManaged = 'true';
      if (!node.dataset.effect) node.dataset.effect = 'fade-up';
      node.style.setProperty('--reveal-delay', (Math.min(index * 70, 280) + 'ms'));
      node.dataset.revealed = reducedMotion || !hasIntersectionObserver ? 'true' : 'false';
    });

    if (reducedMotion || !hasIntersectionObserver) return;

    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target instanceof HTMLElement) {
            entry.target.dataset.revealed = 'true';
            revealObserver && revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' }
    );

    targets.forEach((node) => revealObserver.observe(node));
  };

  const scheduleRevealRefresh = () => {
    if (revealRaf) window.cancelAnimationFrame(revealRaf);

    revealRaf = window.requestAnimationFrame(() => {
      revealRaf = window.requestAnimationFrame(() => {
        refreshAutoReveals();
      });
    });
  };

  // Mobile drawer open/close
  const drawer = document.getElementById('mobile-drawer');
  let lastOpener = null;

  const syncAria = (isOpen) => {
    document.querySelectorAll('[data-menu-open]').forEach((btn) => {
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    if (drawer) drawer.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
  };

  const openMenu = (opener) => {
    if (opener) lastOpener = opener;
    root.dataset.menuOpen = 'true';
    syncAria(true);

    // Prevent background scroll while the drawer is open (mobile)
    try {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } catch {}

    const first = drawer && drawer.querySelector('[data-menu-link]');
    if (first && typeof first.focus === 'function') {
      try { first.focus(); } catch {}
    }
  };

  const closeMenu = () => {
    delete root.dataset.menuOpen;
    syncAria(false);

    // Restore scrolling
    try {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    } catch {}

    if (lastOpener && typeof lastOpener.focus === 'function') {
      try { lastOpener.focus(); } catch {}
    }
    lastOpener = null;
  };

  const bindMenuEvents = () => {
    const openButtons = document.querySelectorAll('[data-menu-open]');
    const closeButtons = document.querySelectorAll('[data-menu-close]');
    const menuLinks = document.querySelectorAll('[data-menu-link]');

    openButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openMenu(btn);
      });
    });

    closeButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        closeMenu();
      });
    });

    menuLinks.forEach((link) => {
      link.addEventListener('click', () => {
        // Allow Next.js navigation to proceed; just close the menu UI
        closeMenu();
      });
    });
  };

  bindMenuEvents();

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && root.dataset.menuOpen === 'true') closeMenu();
  }, true);

  // Close menu on route changes (Next uses history.pushState)
  const onLocationChange = () => {
    setActive();
    closeMenu();
    scheduleRevealRefresh();
  };

  const patchHistory = (type) => {
    const orig = history[type];
    history[type] = function(){
      const ret = orig.apply(this, arguments);
      window.dispatchEvent(new Event('locationchange'));
      return ret;
    };
  };

  patchHistory('pushState');
  patchHistory('replaceState');
  window.addEventListener('popstate', () => window.dispatchEvent(new Event('locationchange')));
  window.addEventListener('locationchange', onLocationChange);


  // Initial state
  setActive();
  syncAria(root.dataset.menuOpen === 'true');
  scheduleRevealRefresh();
})();
            `}
          </Script>
        </div>
      </body>
    </html>
  );
}
