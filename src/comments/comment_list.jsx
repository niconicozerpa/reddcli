"use strict";
import React from "react";
import PropTypes from "prop-types";

import DateUtils from "../lib/dateutils.js";


function writeComment(comment) {
    const diff_str = DateUtils.diffString(comment.when);

    const when_str = (new Date(comment.when)).toISOString();
    const when_str_title = (new Date(comment.when)).toString();

    const replies = [];

    for (const reply of comment.replies) {
        replies.push(writeComment(reply));
    }

    return (
        <div className="comment" key={comment.key}>
            <div className="user">{comment.user}</div>
            { comment.flair ? <div className="flair">{comment.flair}</div> : "" }
            <div className="points">{comment.votes} point(s)</div>
            <div className="when"><time dateTime={when_str} title={when_str_title}>{diff_str}</time> ago</div>
            <div className="body" dangerouslySetInnerHTML={{__html: comment.body}}></div>

            {replies}
        </div>
    );
}

export default function CommentList(props) {
    
    const comments = [];
    for (let comment of props.comments) {
        comments.push(writeComment(comment));
    }

    let output = null;
    
    if (props.comments && props.comments.length > 0) {
        output = (
            <div className="comments">
                {comments}
            </div>
        );
    }

    return output;
}

CommentList.propTypes = {
    "comments": PropTypes.array
}