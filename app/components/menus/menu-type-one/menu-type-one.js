"use strict";

(function() {
    var menu_collapsed = function(e) {
        var elem = eventsObj.getTarget(e),
            menu = document.getElementById("menu");

        if (e.path.indexOf(menu) !== -1 && menu.classList.contains("menu__wraper_mobile")) {
            if (menu.classList.contains('menu__wraper_mobile_expanded')) {
                menu.classList.remove('menu__wraper_mobile_expanded');
            }
            else {
                menu.classList.add('menu__wraper_mobile_expanded');
            }
        }
        else {
            if (menu.classList.contains('menu__wraper_mobile_expanded')) {
                menu.classList.remove('menu__wraper_mobile_expanded');
            }
        }
    };

    eventsObj.addEvent(document, 'click', menu_collapsed);
})();



