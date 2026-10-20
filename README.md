<p align="center">
  <img src="icons/icon128.png" alt="Freedium logo" width="96">
</p>

# Freedium Redirect

A Chrome extension that automatically opens Medium articles through [Freedium](https://freedium-mirror.cfd/) by prefixing the article URL with `https://freedium-mirror.cfd/`.

```
https://medium.com/@user/some-article-8b36d8ee6c43
→ https://freedium-mirror.cfd/https://medium.com/@user/some-article-8b36d8ee6c43
```

It works both on `medium.com` and on Medium publications hosted on their own domain, such as `https://stories.byburk.net/...`.

## Installation

1. Open `chrome://extensions`.
2. Enable **Developer mode** (top right).
3. Click **Load unpacked** and select this folder.

After editing any file, click the reload ↻ button on the extension's card.

## How it works

| Case | Detection | Where |
| --- | --- | --- |
| `medium.com` / `*.medium.com` | The URL path ends with a hex post ID (`-8b36d8ee6c43` or `/p/8b36d8ee6c43`). The redirect happens before the page loads. | `background.js` |
| Custom domains | The page contains Medium's app-link tag `<meta property="al:android:url" content="medium://p/<id>">`, which only article pages have. The page loads briefly, then redirects. | `content.js` |
| In-site navigation | Clicking from one article to another without a full page reload is caught via `webNavigation.onHistoryStateUpdated`. | `background.js` |

Only article pages are redirected: the Medium homepage, profiles, tags and your own Medium pages open normally. Query strings like `?source=...` are dropped, and the redirect replaces the history entry so the Back button doesn't bounce you back to Medium.

## Permissions

- **webNavigation** — to see Medium URLs before they load.
- **Access to all sites** — needed so the content script can check unknown domains for the Medium meta tag. It only reads that one tag.

## Files

```
manifest.json   extension configuration (Manifest V3)
background.js   redirects medium.com articles and in-site navigation
content.js      detects Medium articles on custom domains
icons/          Freedium logo (from github.com/Freedium-cfd)
```

## Changing the mirror

If the Freedium domain changes, update the `MIRROR` constant in both `background.js` and `content.js`, and the `freedium-mirror.cfd` entry in `exclude_matches` in `manifest.json`.
