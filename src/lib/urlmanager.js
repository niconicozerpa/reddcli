"use strict";
export function onURLChange(callback, call_now) {

    const evt_hash = () => {
        if (location.dontRunHashEvent) {
            location.dontRunHashEvent = false;
        } else {
            var url = location.hash.replace(/^#/, "");
            callback(url);
        }
    };
    
    window.addEventListener("hashchange", evt_hash);

    if (call_now) {
        evt_hash();
    }
}

export function setURL(new_url) {
    location.dontRunHashEvent = true;
    if (new_url.indexOf("/") != 0) {
        new_url = `/${new_url}`;
    }
    location.hash = new_url;
}