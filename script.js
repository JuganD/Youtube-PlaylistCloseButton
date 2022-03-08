// Create the close button and appends it after or before the list expand button
// Returns the newly created button if successful, otherwise returns null
// Parameter "insertAfterExpandButton" accepts TRUE or FALSE
// -> TRUE (or any value that evaluates to TRUE) appends the close button after the expand button,
// where as FALSE appends it before the expand button
function CreateCloseButtonAndAppendIt(expandButtonSelector, insertAfterExpandButton) {
    // Expand button after which we insert the element
    let expandButton = document.querySelector(expandButtonSelector);

    if (expandButton == null)
        return null;

    // Youtube style button wrapper
    let closeListButtonWrapper = document.createElement("yt-icon-button");
    closeListButtonWrapper.id = "list-close-button";

    // The button itself which uses youtube classes to pass as regular button
    let closeListButton = document.createElement("button");
    closeListButton.className = "style-scope yt-icon-button";
    closeListButton.setAttribute("aria-label", "Close list");

    // SVG image for close button
    let svgButton = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgButton.setAttribute("overflow", "visible");
    svgButton.setAttribute("stroke", "#AAAAAA");
    svgButton.setAttribute("stroke-width", 10);
    svgButton.setAttribute("stroke-linecap", "round");
    svgButton.setAttribute("width", "10");
    svgButton.setAttribute("height", "10");
    svgButton.setAttribute("viewBox", "0 0 50 50");

    // First line of the close button
    let line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line1.setAttribute("x1", "0");
    line1.setAttribute("y1", "0");
    line1.setAttribute("x2", "50");
    line1.setAttribute("y2", "50");

    // Second line of the close button
    let line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line2.setAttribute("x1", "50");
    line2.setAttribute("y1", "0");
    line2.setAttribute("x2", "0");
    line2.setAttribute("y2", "50");

    // Append all the elements to their appropriate parents
    svgButton.appendChild(line1);
    svgButton.appendChild(line2);
    closeListButton.appendChild(svgButton);
    closeListButtonWrapper.appendChild(closeListButton);

    // Insert the button to the appropriate location according to the value of "insertAfterExpandButton"
    if (insertAfterExpandButton)
        expandButton.parentNode.insertBefore(closeListButtonWrapper, expandButton.nextSibling);
    else
        expandButton.parentNode.insertBefore(closeListButtonWrapper, expandButton);

    return closeListButtonWrapper;
}

// Thanks to bobince@stackoverflow
function removeURLParameter(url, parameter) {
    let urlparts = url.split('?');
    if (urlparts.length >= 2) {
        let prefix = encodeURIComponent(parameter) + '=';
        let pars = urlparts[1].split(/[&;]/g);

        //reverse iteration as may be destructive
        for (let i = pars.length; i-- > 0;) {
            //idiom for string.startsWith
            if (pars[i].lastIndexOf(prefix, 0) !== -1) {
                pars.splice(i, 1);
            }
        }

        return urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');
    }
    return url;
}

function CloseButtonOnClickEvent() {
    // Current URL of the video
    let videoUrl = window.location.href;

    // Remove the list query parameter but leave the rest
    videoUrl = removeURLParameter(videoUrl, "list");

    // Pause the video to trigger "ytp-time-current" refresh
    document.getElementById("movie_player").click();
    
    // Find the video time elapsed minutes:seconds
    // This way we can calculate the time parameter that Youtube puts, without actually using their functions
    // This is done so that when the page refreshes, the video will continue from the curret time elapsed and not from the beginning.
    // The page should be refreshed in order to make the "Copy video url with current time" function work properly and to be futureproof
    let videoTimeElapsedElements = document.getElementsByClassName("ytp-time-current");

    // Check whether we found the span element or not and append time to the URL
    // Appending time to the URL is not a core functionality and it's optional
    if (videoTimeElapsedElements != null && videoTimeElapsedElements.length > 0) {
        let videoTimeElapsed = videoTimeElapsedElements[0].textContent;
        let splittedTime = null;
        if (videoTimeElapsed != null)
            splittedTime = videoTimeElapsed.split(":");

        if (splittedTime != null && splittedTime.length == 2) {
            // Transform the 0:00 time format to seconds
            // This transformation assumes the timestamp is in correct format already
            let timeToAppend = Number(splittedTime[0]) * 60 + Number(splittedTime[1]);

            // Pass the video url as URL so we can set the query parameter
            // This is not supported in IE and Safari
            var videoUrlWithTime = new URL(videoUrl);
            videoUrlWithTime.searchParams.set('t', timeToAppend + "s");
            videoUrl = videoUrlWithTime.href;
        }
    }

    window.location.href = videoUrl;
}
