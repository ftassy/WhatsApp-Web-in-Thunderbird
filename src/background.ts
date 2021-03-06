const urlWhatsAppWeb = "https://web.whatsapp.com/";
const spacesToolbarButtonId = "wa_in_th_" + (Math.floor(Math.random() * 99999999)).toString();

// Modify User Agent
// This is necessary as WhatsApp Web only accept few web browsers.
const ua = navigator.userAgent.includes("Firefox") ? 
    navigator.userAgent.slice(0, navigator.userAgent.lastIndexOf("Thunderbird")) : 
    navigator.userAgent.replace("Thunderbird", "Firefox");

//@ts-ignore
let browser = browser;

function initialize(): void {
    setWaInThMode();
    createContextMenu();
    setSpacesToolbarButton();
}

function setWaInThMode(): void {
    let getTeInThMode = browser.storage.local.get("wa-in-th-mode");
    getTeInThMode.then((storedValue: any) => {
        if (storedValue["wa-in-th-mode"] === "popup") {
            browser.browserAction.setPopup({ popup: urlWhatsAppWeb });
        } else {
            browser.browserAction.setPopup({ popup: "" });
            browser.storage.local.set({ "wa-in-th-mode": "tab" });
        }
    }); 
}

function createContextMenu(): void {
    browser.menus.create({
        id: "contextMenuEntry",
        title: browser.i18n.getMessage("context"),
        type: "normal",
        contexts: ["browser_action"],
        onclick: createOrActivateTab
    }, console.log("WhatsApp Web context menu created."));
}

function setSpacesToolbarButton(): void {
    let getTeInThMode = browser.storage.local.get("wa-in-th-spaces-toolbar");
    getTeInThMode.then((storedValue: any) => {
        if (storedValue["wa-in-th-spaces-toolbar"] === "true") {
            addSpacesToolbarButton();
            return;
        } 
        if (storedValue["wa-in-th-spaces-toolbar"] === "false") {
            removeSpacesToolbarButton();
            return;
        }
        browser.storage.local.set({ "wa-in-th-spaces-toolbar": "true" });
        addSpacesToolbarButton();
    });
}

function addSpacesToolbarButton(): void {
    const label: string = browser.i18n.getMessage("context");
    try {
        browser.spacesToolbar.addButton(
            spacesToolbarButtonId,
            {
                defaultIcons: {
                    "16": "icons/icon16.png",
                    "32": "icons/icon32.png"
                },
                title: label,
                url: urlWhatsAppWeb
            });
        console.log("WhatsApp Web spaces toolbar menu created.");
    } catch(e: any) {
        console.log("spacesToolbar is not defined...\n", e);
    }
}

function removeSpacesToolbarButton(): void {
    const label: string = browser.i18n.getMessage("context");
    try {
        browser.spacesToolbar.removeButton(spacesToolbarButtonId);
        console.log("WhatsApp Web spaces toolbar menu removed.");
    } catch(e: any) {
        console.log("spacesToolbar is not defined...\n", e);
    }
}

async function createOrActivateTab() {

    let tabId: number = NaN;

    const tabProperties: any = {
        active: true,
        url: urlWhatsAppWeb,
    };

    // Querying with empty queryInfo instead of URL is counter intuitive but is a 
    // workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=1728631 causing
    // errors where querying with URL criteria while calendar tab is open.
    //@ts-ignore
    const queryTabs: any = await browser.tabs.query({});
    if (queryTabs.length >= 1) {
        for (let tab of queryTabs) {
            if (tab.hasOwnProperty("url")) {
                if (tab.url.includes(urlWhatsAppWeb)) {
                    tabId = tab.id;
                    break;
                }
            }
        }
    }

    if (isNaN(tabId)) {
        browser.tabs.create(tabProperties);
    } else {
        browser.tabs.update(tabId, tabProperties);
    }
}

function onStorageChange(item: any) {
    if (item.hasOwnProperty("wa-in-th-mode")) {
        item["wa-in-th-mode"].newValue === "popup" ? 
            browser.browserAction.setPopup({ popup: urlWhatsAppWeb }) : 
            browser.browserAction.setPopup({ popup: "" });
    }
    if (item.hasOwnProperty("wa-in-th-spaces-toolbar")) {
        setSpacesToolbarButton();
    }
}

/**
 * Modify user agent
 * Source : https://github.com/mdn/webextensions-examples/tree/master/user-agent-rewriter
 */
function rewriteUserAgentHeader(e: any) {
  for (let header of e.requestHeaders) {
    if (header.name.toLowerCase() === "user-agent") {
      header.value = ua;
    }
  }
  return {requestHeaders: e.requestHeaders};
}

initialize();
browser.storage.onChanged.addListener(onStorageChange);
browser.browserAction.onClicked.addListener(createOrActivateTab);
browser.webRequest.onBeforeSendHeaders.addListener(
    rewriteUserAgentHeader,
    {urls: [urlWhatsAppWeb]},
    ["blocking", "requestHeaders"]
  );
