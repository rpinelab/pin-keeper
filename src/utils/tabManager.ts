export const restorePinnedTabs = async () => {
  const pinnedTabs = await browser.tabs.query({ pinned: true})

  const pinnedUrlConfigs = [
    'https://www.google.com/',
    'https://www.bing.com/',
  ]

  for (const url of pinnedUrlConfigs) {
    const matchedTabs = pinnedTabs.filter(tab => tab.url?.startsWith(url))
    if (matchedTabs.length > 0) {
      continue
    }

    // Open a new tab and pin it
    await browser.tabs.create({
      url: url,
      pinned: true,
      active: false,
    })
  }
}
