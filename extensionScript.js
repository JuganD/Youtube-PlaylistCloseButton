// ==UserScript==
// @name     Youtube-ListCloseButton
// @version  1.0.0
// @author   JuganD
// @grant    none
// @match    https://www.youtube.com/*
// @run-at   document-end
// @require  https://cdn.jsdelivr.net/gh/JuganD/Youtube-PlaylistCloseButton@1.0.0/script.js
// ==/UserScript==

function CreateButtonOnVideoPage() {
    if (window.location.pathname == "/watch") {
        // This is defensive measure in case something happens and this function procs twice, which will create 2 buttons
        let closeButtonWasCreated = document.getElementById("list-close-button");
        if (closeButtonWasCreated == null) {
            // Create the button and append it AFTER the expand button
            // This is configurable! If you want, you can change the "true" value to "false", 
            // which will put the close button BEFORE the expand button
            let closeButton = CreateCloseButtonAndAppendIt(true);
            if (closeButton != null) {
                // If everything worked as intended, we should have the new element in the DOM and attach onclick event
                closeButton.addEventListener("click", CloseButtonOnClickEvent);
            }
        }
    }
}

window.addEventListener('yt-navigate-finish', function () {
    CreateButtonOnVideoPage();
});

CreateButtonOnVideoPage();
