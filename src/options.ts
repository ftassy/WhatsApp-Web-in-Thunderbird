let buttonTab: HTMLElement | null = document.getElementById("mode-switcher-tab");
let buttonPopup: HTMLElement | null = document.getElementById("mode-switcher-popup");
let labelTab: HTMLElement | null = document.getElementById("tab");
let labelPopup: HTMLElement | null = document.getElementById("popup");
let labelDisplay: HTMLElement | null = document.getElementById("display");

let buttonNo: HTMLElement | null = document.getElementById("space-toolbar-switcher-no");
let buttonYes: HTMLElement | null = document.getElementById("space-toolbar-switcher-yes");
let labelNo: HTMLElement | null = document.getElementById("no");
let labelYes: HTMLElement | null = document.getElementById("yes");
let labelShowSpaceToolbar: HTMLElement | null = document.getElementById("show-space-toolbar");
//@ts-ignore
let browser = browser;

function initializeDisplayInputs(): void {
    let getWaInThMode = browser.storage.local.get("wa-in-th-mode");
    getWaInThMode.then((storedValue: any) => {
        if (!(buttonTab instanceof HTMLElement && buttonPopup instanceof HTMLElement)) {
            return;
        }
        if (storedValue.hasOwnProperty("wa-in-th-mode")) {
            switch (storedValue["wa-in-th-mode"]) {
                case "tab":
                    buttonTab.setAttribute("checked", "true");
                    return;
                case "popup":
                    buttonPopup.setAttribute("checked", "true");
                    return;
            }
        }
        browser.storage.local.set({ "wa-in-th-mode": "tab" });
    });
}

function initializeSpaceToolbarInputs(): void {
    let getWaInThSpaceToolbar = browser.storage.local.get("wa-in-th-space-toolbar");
    getWaInThSpaceToolbar.then((storedValue: any) => {
        if (!(buttonNo instanceof HTMLElement && buttonYes instanceof HTMLElement)) {
            return;
        }
        if (storedValue.hasOwnProperty("wa-in-th-space-toolbar")) {
            switch (storedValue["wa-in-th-space-toolbar"]) {
                case "false":
                    buttonNo.setAttribute("checked", "true");
                    return;
                case "true":
                    buttonYes.setAttribute("checked", "true");
                    return;
            }
        }
        browser.storage.local.set({ "wa-in-th-mode": "true" });
    });
}

function internationalize() {
    if (labelTab instanceof HTMLElement) {
        labelTab.innerText = browser.i18n.getMessage("tab");
    }
    if (labelPopup instanceof HTMLElement) {
        labelPopup.innerText = browser.i18n.getMessage("popup");
    }
    if (labelDisplay instanceof HTMLElement) {
        labelDisplay.innerText = browser.i18n.getMessage("display");
    }
    if (labelNo instanceof HTMLElement) {
        labelNo.innerText = browser.i18n.getMessage("no");
    }
    if (labelYes instanceof HTMLElement) {
        labelYes.innerText = browser.i18n.getMessage("yes");
    }
    if (labelShowSpaceToolbar instanceof HTMLElement) {
        labelShowSpaceToolbar.innerText = browser.i18n.getMessage("show-space-toolbar");
    }
}

function onClickModeSwitcher(newValue: string): void {
    browser.storage.local.set({ "wa-in-th-mode": newValue });
}


if (buttonTab instanceof HTMLElement && buttonPopup instanceof HTMLElement) {
    buttonTab.addEventListener("input", () => onClickModeSwitcher("tab"));
    buttonPopup.addEventListener("input", () => onClickModeSwitcher("popup"));
}

function onClickSpaceToolbarSwitcher(newValue: string): void {
    browser.storage.local.set({ "wa-in-th-space-toolbar": newValue });
}


if (buttonNo instanceof HTMLElement && buttonYes instanceof HTMLElement) {
    buttonNo.addEventListener("input", () => onClickSpaceToolbarSwitcher("false"));
    buttonYes.addEventListener("input", () => onClickSpaceToolbarSwitcher("true"));
}

initializeDisplayInputs();
initializeSpaceToolbarInputs();
internationalize();
