import React from "react";
import PropTypes from "prop-types";

import Post from "./post.jsx";
import CommentList from "../comments/comment_list.jsx";

class BasePostList extends React.Component {
    constructor(props) {
        super(props);

        this.handleLink = this.handleLink.bind(this);
        this.fetchRedditURL = this.fetchRedditURL.bind(this);
    }

    handleLink(href) {
        this.props.handleURL(href);
    }

    fetchRedditURL(href) {
        this.props.fetchRedditURL(href);
    }

    render()
    {
        let output;
        let last_post_id = null;
        let post_comments = null;

        if (this.props.posts.length > 0) {
            output = this.props.posts.map((post) => {
                last_post_id = post.key;
                return <Post
                    fetchRedditURL={this.fetchRedditURL}
                    key={post.key}
                    id={post.id}
                    title={post.title}
                    permalink={post.permalink}
                    subreddit={post.subreddit}
                    url={post.url}
                    when={post.when}
                    user={post.user}
                    type={post.type}
                    votes={post.votes}
                    commentsCount={post.comments_count}
                    preview={post.preview}
                    body={post.body}
                />;
            });

            output.push(<CommentList key={`comments-${last_post_id}`} comments={this.props.comments}/>);
        } else {
            output = (<div className="loading">
                <div className="out"></div>
                <div className="in"></div>
            </div>);
        }

        return <div className="post-list">{output}</div>;
    }
}

BasePostList.propTypes = {
    "posts": PropTypes.array.isRequired,
    "comments": PropTypes.array,
    "fetchSubreddit": PropTypes.func,
    "handleURL": PropTypes.func,
    "fetchRedditURL": PropTypes.func,
    "status": PropTypes.string.isRequired
};

export default BasePostList;