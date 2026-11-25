// ISOLATED world: chrome.storage の設定を <html data-enter-swap> に反映し、MAIN world の injected.js に伝える
const apply = (enabled) => {
    document.documentElement.dataset.enterSwap = enabled ? 'on' : 'off';
};

chrome.storage.local.get({ enabled: true }, ({ enabled }) => apply(enabled));

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && 'enabled' in changes) apply(changes.enabled.newValue);
});
