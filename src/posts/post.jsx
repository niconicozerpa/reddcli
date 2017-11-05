import React from "react";
import PropTypes from "prop-types";
import DateUtils from "../lib/dateutils.js";
import NumberUtils from "../lib/numberutils.js";

function Post(props) {
    const diff_str = DateUtils.diffString(props.when);

    const when_str = (new Date(props.when)).toISOString();
    const when_str_title = (new Date(props.when)).toString();

    const preview_img = props.preview && props.preview != "self" ? (
        <img alt={props.title} src={props.preview}/>
    ) : null;

    function changeLink(event) {
        event.preventDefault()
        props.fetchRedditURL(event.target.getAttribute("href"));
    }

    return (
        <article className="post">
            <div className="vote-data">
                <div className="buttons">
                    <a className="up">Up</a>
                    <div className="qty">{NumberUtils.humanize(props.votes)}</div>
                    <a className="down">Down</a>
                </div>
                { props.preview && 
                    <div className={"preview" + (props.preview != "self" ? " image":" self") }>{preview_img}</div>
                }
            </div>
            <div className="main">
                <h1><a
                    href={props.url ? props.url : props.permalink}
                    onClick={props.url ? null : changeLink}
                    target={props.url ? "_blank" : null }>{props.title}</a></h1> 
                {" "}
                <a href={`/r/${props.subreddit}`} onClick={changeLink} className="subreddit">{props.subreddit}</a>
                <div className="post-footer">
                    Submitted <time dateTime={when_str} title={when_str_title}>{diff_str}</time> ago
                    by <span className="user">{props.user}</span>
                    {" "}
                    <span className="type">{props.type}</span>
                    {" "}
                    <a href={props.permalink} onClick={changeLink} className="comments">
                    {props.commentsCount} comment(s)</a>
                </div>
                { props.body &&
                    <div className="body" dangerouslySetInnerHTML={{__html: props.body}}></div>
                }
            </div>
        </article>
    );
}

Post.propTypes = {
    "id": PropTypes.string.isRequired,
    "when": PropTypes.string.isRequired,
    "title": PropTypes.string.isRequired,
    "subreddit": PropTypes.string.isRequired,
    "user": PropTypes.string.isRequired,
    "type": PropTypes.string.isRequired,
    "permalink": PropTypes.string.isRequired,
    "url": PropTypes.string,
    "votes": PropTypes.number.isRequired,
    "commentsCount": PropTypes.number.isRequired,
    "body": PropTypes.string,
    "preview": PropTypes.string,
    "fetchRedditURL": PropTypes.func
}

export default Post;