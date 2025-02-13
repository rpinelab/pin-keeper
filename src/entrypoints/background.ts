export default defineBackground(() => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/no-unnecessary-condition
  (browser.action ?? browser.browserAction).onClicked.addListener(async () => {
    await restorePinnedTabs();
  });
});
