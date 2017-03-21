
const ContextMenuId = "a";

function createContextMenus() {
	chrome.contextMenus.create({
		title: "ページをメモ（Googleカレンダーに追加）",
		contexts: [
			"page",
			"selection"
		],
		id: ContextMenuId
	});
}

chrome.runtime.onInstalled.addListener(createContextMenus);
chrome.runtime.onStartup.addListener(createContextMenus);

chrome.contextMenus.onClicked.addListener((info, tab) => {
	if (info.menuItemId === ContextMenuId) {
		const querys = {
			action: "TEMPLATE",
			text: tab.title,
			details: tab.url
		};
		if (info.selectionText) {
			querys.details += "\n\n" + info.selectionText;
		}

		const createCalendarUrl = "https://www.google.com/calendar/render?" + Object.keys(querys).map(key => {
			const value = encodeURIComponent(querys[key]);
			return `${key}=${value}`;
		}).join("&");

		const createProperties = {
			url: createCalendarUrl
		};

		const openerTabId = tab.id;
		if (openerTabId !== chrome.tabs.TAB_ID_NONE) {
			createProperties.openerTabId = openerTabId;
		}

		chrome.tabs.create(createProperties);
	}
});
