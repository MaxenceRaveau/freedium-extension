// Custom-domain Medium publications (e.g. stories.byburk.net) can only be recognized
// from the page itself: Medium article pages carry an app-link meta tag "medium://p/<id>".
const MIRROR = "https://freedium-mirror.cfd/";

function redirectIfMediumArticle() {
  if (document.querySelector('meta[property="al:android:url"][content^="medium://p/"]')) {
    location.replace(MIRROR + location.origin + location.pathname);
  }
}

redirectIfMediumArticle();

chrome.runtime.onMessage.addListener((msg) => {
  // Give the SPA a moment to update the <head> after a history navigation.
  if (msg === "freedium-check") setTimeout(redirectIfMediumArticle, 500);
});
