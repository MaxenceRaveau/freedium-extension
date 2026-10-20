const MIRROR = "https://freedium-mirror.cfd/";

// Medium article URLs end with a hex post ID: /@user/some-title-8b36d8ee6c43 or /p/8b36d8ee6c43
const ARTICLE_PATH = /(?:-|\/p\/)[0-9a-f]{8,12}\/?$/;

function isMediumHost(hostname) {
  return hostname === "medium.com" || hostname.endsWith(".medium.com");
}

function mediumArticleUrl(url) {
  try {
    const u = new URL(url);
    if (isMediumHost(u.hostname) && ARTICLE_PATH.test(u.pathname)) {
      return u.origin + u.pathname;
    }
  } catch {}
  return null;
}

// medium.com / *.medium.com: redirect before the page even loads.
chrome.webNavigation.onBeforeNavigate.addListener(
  ({ tabId, frameId, url }) => {
    if (frameId !== 0) return;
    const article = mediumArticleUrl(url);
    if (article) chrome.tabs.update(tabId, { url: MIRROR + article });
  },
  { url: [{ hostSuffix: "medium.com" }] }
);

// In-page (SPA) navigation, e.g. clicking another article inside Medium.
chrome.webNavigation.onHistoryStateUpdated.addListener(({ tabId, frameId, url }) => {
  if (frameId !== 0) return;
  const article = mediumArticleUrl(url);
  if (article) {
    chrome.tabs.update(tabId, { url: MIRROR + article });
  } else if (!url.startsWith(MIRROR)) {
    // Possibly a custom-domain Medium site: let the content script check the page.
    chrome.tabs.sendMessage(tabId, "freedium-check").catch(() => {});
  }
});
