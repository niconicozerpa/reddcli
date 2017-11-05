"use strict";

import { setURL } from "./lib/urlmanager.js";
import "whatwg-fetch";
// import Promise from "bluebird";


function fetchRedditURLInit(url) {
    return {
        "type": "FETCH_REDDIT_URL",
        "url": url,
        "status": "init"
    };
}

const getBodyHTML = (function () {
    const dv = document.createElement("div");
    
    return function(contents) {
        dv.innerHTML = contents;
        dv.innerHTML = dv.innerText;
        Array.prototype.forEach.call(dv.querySelectorAll("a[href]"), function (elm) {
            elm.target = "_blank";
        });
       
        return dv.innerHTML;
    };
})();

function processComments(comment) {
    const body = getBodyHTML(comment.body_html);

    const replies = [];
    if (
        comment.replies
        && comment.replies.data
        && comment.replies.data.children
        && comment.replies.data.children.length > 0
    ) {
        for (let reply of comment.replies.data.children) {
            if (reply.kind == "t1") {
                replies.push(processComments(reply.data));
            }
        }
    }
    
    return {
        "key": comment.id,
        "user": comment.author,
        "flair": comment.author_flair_text,
        "body": body,
        "when": (new Date(comment.created_utc * 1000)).toISOString(),
        "votes": comment.score,
        "replies": replies
    };
}

function fetchRedditURLComplete(url, response) {
    const posts = [], comments = [];

    let display_body = true;
    if (!(response instanceof Array)) {
        response = [response];
        display_body = false;
    }

    for (let listing of response) {
        for (let item of listing.data.children) {
            switch (item.kind) {
                case "t3": { // Link

                    let preview_img = null;
    
                    if (item.data.preview && item.data.preview && item.data.preview.images) {
                        const images = item.data.preview.images;
                        const node = document.createElement("div");
                        
                        if (images[0].resolutions[0]) {
                            node.innerHTML = images[0].resolutions[0].url;
                        } else {
                            node.innerHTML = images[0].source.url;
                        }

                        preview_img = node.innerText;
                    }

                    if (!preview_img) {
                        preview_img = "self";
                    }

                    let body = null;
    
                    if (display_body && item.data.selftext_html) {
                        body = getBodyHTML(item.data.selftext_html);
                    }

                    const new_post = {
                        "key": item.data.id,
                        "id": item.data.id,
                        "title": item.data.title,
                        "subreddit": item.data.subreddit,
                        "permalink": item.data.permalink,
                        "url": item.data.is_self ? null : item.data.url,
                        "when": (new Date(item.data.created_utc * 1000)).toISOString(),
                        "user": item.data.author,
                        "type": item.data.is_self ? `self.${item.data.subreddit}` : item.data.domain,
                        "votes": item.data.score,
                        "comments_count": item.data.num_comments,
                        "preview": preview_img,
                        "body": body
                    };

                    posts.push(new_post);
                }
                break;
                case "t1": { // Comment

                    comments.push(processComments(item.data));
                    
                    break;
                }
            }
        }
    }

    return {
        "type": "FETCH_REDDIT_URL",
        "url": url,
        "posts": posts,
        "comments": comments,
        "status": "complete"
    };
}

export function fetchRedditURL(url) {

    return async (dispatch) => {
        dispatch(fetchRedditURLInit(url));

        const service_url = "https://api.reddit.com/" + String(url).replace(/^\//, "");

        if (location.pathname != url) {
            setURL(url);
        }

        const response = await fetch(service_url);
        
        if (response.status != 200) {
            return { error: "Something went wrong :(" };
        } else {
            const output = await response.json();
            dispatch(fetchRedditURLComplete(url, output));
        }
    };
}


