import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ArrowRightIcon from "@heroicons/react/solid/ArrowRightIcon";
import throttle from "lodash/throttle";
import ChevronDoubleDownIcon from "@heroicons/react/solid/ChevronDoubleDownIcon";
import ChevronDoubleUpIcon from "@heroicons/react/solid/ChevronDoubleUpIcon";
import { MessageResponse } from "betro-js-client";
import { useFetchMessages, useSendMessage } from "../../hooks";
import { LoadingSpinnerCenter } from "../../ui/LoadingSpinner";
import { getConversation, getProfile } from "../../store/app/selectors";
import Button from "../../ui/Button";
import { ConversationResponseBackend } from "betro-js-client/dist/UserResponses";
import { showConversation, hideConversation } from "../../store/app/actions";
import TextField from "../../ui/TextField";
import Divider from "../../ui/Divider";
import { fromNow } from "../../util/fromNow";

const Message: React.FunctionComponent<{
    message: MessageResponse;
    conversation: ConversationResponseBackend;
}> = ({ message, conversation }) => {
    const [expanded, setExpanded] = useState<boolean>(false);
    const profile = useSelector(getProfile);
    const own_id = profile.user_id;
    const is_own = own_id === message.sender_id;
    const UserProfilePicture = () =>
        conversation.profile_picture == null ? (
            <div />
        ) : (
            <img
                className="h-5 w-5 rounded-full mr-2"
                src={conversation.profile_picture}
                alt={conversation.username}
            />
        );
    const OwnProfilePicture = () =>
        profile.profile_picture == null ? (
            <div />
        ) : (
            <img
                className="h-5 w-5 rounded-full ml-2"
                src={profile.profile_picture}
                alt={profile.username || ""}
            />
        );
    return (
        <div
            onClick={() => setExpanded(!expanded)}
            className={`p-2 flex items-center ${
                is_own ? "justify-end flex-row-reverse" : "justify-start flex-row"
            }`}
        >
            {is_own ? <OwnProfilePicture /> : <UserProfilePicture />}
            <div className={`flex flex-col ${is_own ? "items-end" : "items-start"}`}>
                <div className="font-medium text-gray-900 text-sm">{message.message}</div>
                {expanded && (
                    <div className="font-normal text-gray-500 text-xs">
                        {fromNow(new Date(message.created_at))}
                    </div>
                )}
            </div>
            {is_own && <span className="flex-1" />}
        </div>
    );
};

const Conversation: React.FunctionComponent<{
    conversation: ConversationResponseBackend;
    visible: boolean;
}> = ({ conversation, visible }) => {
    const { fetch } = useFetchMessages(
        conversation.id,
        conversation.own_private_key,
        conversation.public_key
    );
    const sendMessage = useSendMessage(
        conversation.id,
        conversation.own_private_key,
        conversation.public_key
    );
    const conversations = useSelector(getConversation);
    const [input, setInput] = useState<string>("");
    const messages = useMemo(
        () => conversations.messages[conversation.id],
        [conversations.messages, conversation.id]
    );
    const dispatch = useDispatch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchThrottled = useCallback(throttle(fetch, 2000), []);
    useEffect(() => {
        if (visible && messages == null) {
            fetchThrottled();
        }
    }, [fetchThrottled, visible, messages]);
    const sendMessageForm = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            sendMessage(input);
            setInput("");
        },
        [input, sendMessage]
    );
    return (
        <div className="w-60 flex flex-col shadow-subtle mx-2">
            {visible && (
                <div>
                    {messages == null || !messages.isLoaded ? (
                        <LoadingSpinnerCenter />
                    ) : (
                        <div className="h-96 flex flex-col justify-end">
                            <div className="overflow-y-auto p-1 flex flex-col-reverse">
                                {messages.data.map((a) => (
                                    <Message key={a.id} message={a} conversation={conversation} />
                                ))}
                            </div>
                            <form onSubmit={sendMessageForm} className="flex flex-row">
                                <TextField
                                    placeholder="Type your message..."
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e)}
                                />
                                <Button size="small" type="submit">
                                    <ArrowRightIcon className="heroicon" />
                                </Button>
                            </form>
                        </div>
                    )}
                    <Divider />
                </div>
            )}
            <Button
                size="large"
                className="text-left flex flex-row"
                onClick={() => {
                    if (visible) {
                        dispatch(hideConversation(conversation.id));
                    } else {
                        dispatch(showConversation(conversation.id));
                    }
                }}
                key={conversation.id}
            >
                <span className="mr-1">{conversation.username}</span>
                {visible ? (
                    <ChevronDoubleDownIcon className="heroicon" />
                ) : (
                    <ChevronDoubleUpIcon className="heroicon" />
                )}
            </Button>
        </div>
    );
};

export default Conversation;
