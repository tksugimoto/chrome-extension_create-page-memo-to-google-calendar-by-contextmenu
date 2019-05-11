
const ContextMenuId = 'a';

const createContextMenu = () => {
	chrome.contextMenus.create({
		title: 'Googleカレンダーに追加（ページをメモ）',
		contexts: [
			'page',
			'selection',
		],
		id: ContextMenuId,
	});
};

chrome.runtime.onInstalled.addListener(createContextMenu);
chrome.runtime.onStartup.addListener(createContextMenu);

chrome.contextMenus.onClicked.addListener((info, tab) => {
	if (info.menuItemId === ContextMenuId) {
		const startDate = new Date();
		const endDate = new Date(startDate.getTime());
		endDate.setHours(startDate.getHours() + 1);
		const dates = [
			startDate.toISOString().replace(/-|:|\.\d{3}/g, ''),
			endDate.toISOString().replace(/-|:|\.\d{3}/g, ''),
		];

		const queryObject = {
			action: 'TEMPLATE',
			text: tab.title,
			details: tab.url,
			dates: dates.join('/'),
		};
		if (info.selectionText) {
			queryObject.details += '\n\n' + info.selectionText;
		}

		const querys = Object.entries(queryObject).map(([key, value]) => {
			return `${key}=${encodeURIComponent(value)}`;
		});
		const calendarCreateUrl = 'https://www.google.com/calendar/render?' + querys.join('&');

		const createProperties = {
			url: calendarCreateUrl,
		};

		const openerTabId = tab.id;
		if (openerTabId !== chrome.tabs.TAB_ID_NONE) {
			createProperties.openerTabId = openerTabId;
		}

		chrome.tabs.create(createProperties);
	}
});
