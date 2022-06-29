const urlWhatsAppWeb = "https://web.whatsapp.com/";

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
    }, console.log("WhatsApp Web context menu created"));
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

function popupSwitch(item: any) {
    if (item.hasOwnProperty("wa-in-th-mode")) {
        item["wa-in-th-mode"].newValue === "popup" ? 
            browser.browserAction.setPopup({ popup: urlWhatsAppWeb }) : 
            browser.browserAction.setPopup({ popup: "" });
    }
}

/**
 * Modify user agent
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
browser.storage.onChanged.addListener(popupSwitch);
browser.browserAction.onClicked.addListener(createOrActivateTab);
browser.webRequest.onBeforeSendHeaders.addListener(
    rewriteUserAgentHeader,
    {urls: [urlWhatsAppWeb]},
    ["blocking", "requestHeaders"]
  );
