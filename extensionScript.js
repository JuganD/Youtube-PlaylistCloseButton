// ==UserScript==
// @name     Youtube-PlaylistCloseButton
// @version  1.0.2
// @author   JuganD
// @grant    none
// @match    https://www.youtube.com/*
// @run-at   document-end
// @require  https://cdn.jsdelivr.net/gh/JuganD/Youtube-PlaylistCloseButton@1.0.2/script.js
// ==/UserScript==

function CreateButtonOnVideoPage() {
    if (window.location.pathname == "/watch") {
        // This is defensive measure in case something happens and this function procs twice, which will create 2 buttons
        let closeButtonWasCreated = document.getElementById("list-close-button");
        if (closeButtonWasCreated == null) {
            // Create the button and append it AFTER the expand button
            // This is configurable! If you want, you can change the "true" value to "false", 
            // which will put the close button BEFORE the expand button
            // The first parameter is the query selector for the expand button.
            let closeButton = CreateCloseButtonAndAppendIt("#secondary-inner #expand-button", true);
            if (closeButton != null) {
                // If everything worked as intended, we should have the new element in the DOM and attach onclick event
                closeButton.addEventListener("click", CloseButtonOnClickEvent);
            }
        }
    }
}

// Attach the function to one of the YouTube events, because the website is SPA, which prevents the extension to execute on each page change
// This event occurs when YouTube has finished the navigation to the new location
window.addEventListener('yt-navigate-finish', function () {
    CreateButtonOnVideoPage();
});

// This function is executed only when the extension detects that the current page matches YouTube
// In this case, the event 'yt-navigate-finish' won't be invoked! To go around that, we call the function anyway. 
// It checks whether the page is the right one and executes.
CreateButtonOnVideoPage();
