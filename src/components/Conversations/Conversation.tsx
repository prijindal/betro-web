import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ArrowRightIcon from "@heroicons/react/solid/ArrowRightIcon";
import throttle from "lodash/throttle";
import { useFetchMessages, useSendMessage } from "../../hooks";
import { LoadingSpinnerCenter } from "../../ui/LoadingSpinner";
import { getConversation, getProfile } from "../../store/app/selectors";
import Button from "../../ui/Button";
import { ConversationResponseBackend } from "betro-js-client/dist/UserResponses";
import { showConversation, hideConversation } from "../../store/app/actions";
import TextField from "../../ui/TextField";

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
    const profile = useSelector(getProfile);
    const own_id = profile.user_id;
    const conversations = useSelector(getConversation);
    const [input, setInput] = useState<string>("");
    const messages = conversations.messages[conversation.id];
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
        <div>
            {visible && (
                <div>
                    {messages == null || !messages.isLoaded ? (
                        <LoadingSpinnerCenter />
                    ) : (
                        <div>
                            <div>
                                {messages.data.map((a) => (
                                    <div
                                        className={`flex flex-row ${
                                            own_id === a.sender_id ? "justify-end" : "justify-start"
                                        }`}
                                        key={a.id}
                                    >
                                        <div>{a.message}</div>
                                    </div>
                                ))}
                            </div>
                            <form onSubmit={sendMessageForm} className="flex flex-row">
                                <TextField
                                    placeholder="Type your message..."
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e)}
                                />
                                <Button type="submit">
                                    <ArrowRightIcon className="heroicon" />
                                </Button>
                            </form>
                        </div>
                    )}
                </div>
            )}
            <Button
                onClick={() => {
                    if (visible) {
                        dispatch(hideConversation(conversation.id));
                    } else {
                        dispatch(showConversation(conversation.id));
                    }
                }}
                key={conversation.id}
            >
                {conversation.username}
            </Button>
        </div>
    );
};

export default Conversation;
