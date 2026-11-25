// ツールバーアイコンのクリックで ON/OFF を切り替える
const updateBadge = (enabled) => {
    chrome.action.setBadgeText({ text: enabled ? 'ON' : 'OFF' });
    chrome.action.setBadgeBackgroundColor({ color: enabled ? '#2e7d32' : '#757575' });
    chrome.action.setTitle({ title: `Enter Key Swap: ${enabled ? 'ON' : 'OFF'}（クリックで切替）` });
};

const init = () => chrome.storage.local.get({ enabled: true }, ({ enabled }) => updateBadge(enabled));
chrome.runtime.onInstalled.addListener(init);
chrome.runtime.onStartup.addListener(init);

chrome.action.onClicked.addListener(() => {
    chrome.storage.local.get({ enabled: true }, ({ enabled }) => {
        const next = !enabled;
        chrome.storage.local.set({ enabled: next });
        updateBadge(next);
    });
});
