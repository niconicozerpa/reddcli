import { connect } from "react-redux"

import BasePostList from "./basepostlist.jsx"
import * as Actions from "../actions"


const mapStateToProps = (state) => {
    return {
        "subreddit": state.subreddit,
        "sort": state.sort,
        "posts": state.posts,
        "comments": state.comments,
        "status": state.status
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchSubreddit: (subreddit = "all", sort = "hot") => dispatch(
            Actions.fetchSubreddit(subreddit, sort)
        ),
        fetchPost: (id) => dispatch(Actions.fetchPost(id)),
        fetchRedditURL: (url) => dispatch(Actions.fetchRedditURL(url))
    }
}

const PostList = connect(
    mapStateToProps,
    mapDispatchToProps
  )(BasePostList)

export default PostList