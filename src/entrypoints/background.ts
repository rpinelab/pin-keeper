export default defineBackground(() => {
  (browser.action ?? browser.browserAction).onClicked.addListener(async () => {
    await restorePinnedTabs();
  });
});
