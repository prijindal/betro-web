import React, { useState, useCallback, Suspense } from "react";
import Divider from "../../ui/Divider";
import HeartIcon from "@heroicons/react/solid/HeartIcon";
import HeartOutlineIcon from "@heroicons/react/outline/HeartIcon";
import CodeIcon from "@heroicons/react/solid/CodeIcon";
import { LikeResponse, PostResource } from "betro-js-client";
import { UserAvatar } from "../UserListItem/UserAvatar";
import { getPrimaryText } from "../UserListItem/getPrimaryText";
import { fromNow } from "../../util/fromNow";
import { useNavigate } from "react-router-dom";
import BetroApiObject from "../../api/context";
import Button from "../../ui/Button";
import ConfirmDialog from "../../ui/ConfirmDialog";
import { LoadingSpinnerCenter } from "../../ui/LoadingSpinner";

const MarkedText = React.lazy(() => import("../../components/MarkedText"));

const PostLikedButton: React.FunctionComponent<{ post: PostResource }> = (props) => {
    const { post } = props;
    const [isLiked, setIsLiked] = useState<boolean>(post.is_liked);
    const [likes, setLikes] = useState<number>(post.likes);
    const [loading, setLoading] = useState<boolean>(false);
    const toggleLike = useCallback(async () => {
        let likeResponse: LikeResponse | null = null;
        setIsLiked(!isLiked);
        setLoading(true);
        if (isLiked) {
            likeResponse = await BetroApiObject.post.unlike(post.id);
        } else {
            likeResponse = await BetroApiObject.post.like(post.id);
        }
        setLoading(false);
        if (likeResponse != null && likeResponse.likes != null) {
            setLikes(likeResponse.likes);
        }
    }, [isLiked, post.id]);
    return (
        <Button
            outlined
            color={isLiked ? "purple" : "gray"}
            noBorder
            noHoverBg
            className={`flex flex-row item-center`}
            disabled={loading}
            onClick={toggleLike}
            aria-label="add to favorites"
        >
            {isLiked ? (
                <HeartIcon className="heroicon" />
            ) : (
                <HeartOutlineIcon className="heroicon" />
            )}
            <span className="ml-1 text-base">{likes.toString()}</span>
        </Button>
    );
};

const PostListItem: React.FunctionComponent<{ routing: boolean; post: PostResource }> = (props) => {
    const { post, routing } = props;
    const navigate = useNavigate();
    const [showSource, setShowSource] = useState<boolean>(false);
    const secondary =
        post.user.first_name != null
            ? `@${post.user.username} ${fromNow(new Date(post.created_at))}`
            : fromNow(new Date(post.created_at));
    const onClickHandler = routing ? () => navigate(`/post/${post.id}`) : () => null;
    return (
        <div className="my-2 max-w-xl">
            <div className="flex flex-row p-4">
                <UserAvatar user={post.user} />
                <div className="flex flex-col justify-center ml-4">
                    <div className="font-medium text-gray-900 text-sm">
                        {getPrimaryText(post.user)}
                    </div>
                    <div className="font-normal text-gray-500 text-sm">{secondary}</div>
                </div>
                <span className="flex-grow" />
                <span
                    onClick={() => setShowSource(true)}
                    className="cursor-pointer text-gray-500 hover:text-purple-700 w-8 h-8 p-2"
                >
                    <CodeIcon />
                </span>
            </div>
            {post.media_content != null && (
                <div className="p-4" onClick={onClickHandler}>
                    <img
                        className="max-w-xl max-h-48"
                        src={post.media_content}
                        alt={post.text_content || "Post"}
                    />
                </div>
            )}
            <div className="p-4" onClick={onClickHandler}>
                <Suspense fallback={<LoadingSpinnerCenter />}>
                    <MarkedText text={post.text_content || ""} />
                </Suspense>
            </div>
            <div className="p-2 flex flex-row items-center">
                <PostLikedButton post={post} />
            </div>
            <Divider />
            <ConfirmDialog
                open={showSource}
                handleCancel={() => setShowSource(false)}
                description={
                    <pre className="max-w-xl overflow-x-auto">{JSON.stringify(post, null, 4)}</pre>
                }
            />
        </div>
    );
};

export default PostListItem;
