// slide from one container to the other
// remembers state
// minor modifications from original
// listens to all transition ends, hides the "loader" dom element to stop flickering as transition starts
function PageSlider(container) {
    var container = container,
        currentPage,
        stateHistory = [];

    this.slidePage = function( page, callback) {
        var l = stateHistory.length,
            state = window.location.hash;

        if (l === 0) {
            stateHistory.push(state);
            this.slidePageFrom(page, null, callback);
            return;
        }
        if (state === stateHistory[l-2]) {
            stateHistory.pop();
            this.slidePageFrom(page, 'left', callback);
        } else {
            stateHistory.push(state);
            this.slidePageFrom(page, 'right', callback);
        }

    }

    this.slidePageFrom = function(page, from, callback) {
        container.append(page);

        if (!currentPage || !from) {
            page.attr("class", "page center");
            currentPage = page;
            callback && callback();
            return;
        }

        // Position the page at the starting position of the animation
        page.attr("class", "page " + from);

        currentPage.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
            $(e.target).remove();
            callback && callback();
        });

        container[0].offsetWidth;

        page.attr("class", "page transition center");
        // custom - hide loader / main content of the current page so no odd flashes
        currentPage.find(".main-content").hide();
        // end custom
        currentPage.attr("class", "page transition " + (from === "left" ? "right" : "left"));
        currentPage = page;
    }

}