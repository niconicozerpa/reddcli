"use strict";
const initial_state = (() => {
    const output = {
        "posts": [],
        "subreddit": "all",
        "sort": "hot",
        "status": "complete"
    };

    const regexp = /^\/r\/(.+?)(\/(new|top|wiki|ads|controversial|guilded))?(\/|$)/;
    const matches = location.pathname.match(regexp);

    if (matches) {
        if (matches[1]) {
            output.subreddit = matches[1];
        }

        if (matches[3]) {
            output.sort = matches[3];
        }
    }

    return output;
})();

export default (state = initial_state, action) => {
    let output;

    switch (action.type) {
        case "FETCH_REDDIT_URL":
            switch (action.status) {
                case "init":
                    output = Object.assign(
                        {},
                        state,
                        {
                            "posts": [],
                            "comments": [],
                            "status": "init"
                        }
                    );
                    break;
                case "complete":
                    output = Object.assign(
                        {},
                        state,
                        {
                            "posts": action.posts,
                            "comments": action.comments,
                            "status": "complete"
                        }
                    );
                    break;
            }
        break;

        default:
            output = state;
    }

    return output;
};