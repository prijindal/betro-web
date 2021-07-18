import React, { useCallback, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import throttle from "lodash/throttle";
import { useFetchConversations, useProcessIncomingMessage } from "../../hooks";
import { LoadingSpinnerCenter } from "../../ui/LoadingSpinner";
import { getConversation, getOpenedConversations } from "../../store/app/selectors";
import Button from "../../ui/Button";
import { openConversation } from "../../store/app/actions";
import Conversation from "./Conversation";
import BetroApiObject from "../../api/context";

const Conversations = () => {
    const { fetch } = useFetchConversations();
    const dispatch = useDispatch();
    const [opened, setOpened] = useState<boolean>(false);
    const conversations = useSelector(getConversation);
    const openedConversations = useSelector(getOpenedConversations);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchThrottled = useCallback(throttle(fetch, 2000), []);
    const processMessage = useProcessIncomingMessage();
    useEffect(() => {
        BetroApiObject.conversation.listenMessages(async (m) => {
            processMessage(JSON.parse(m.data));
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className="max-w-5xl overflow-auto flex flex-row items-end">
            {openedConversations.map((a) => (
                <Conversation key={a.id} conversation={a} visible={a.visible} />
            ))}
            <div>
                {opened && (
                    <div>
                        {!conversations.isLoaded ? (
                            <LoadingSpinnerCenter />
                        ) : (
                            <div>
                                {conversations.data.map((a) => (
                                    <div
                                        onClick={() => dispatch(openConversation(a.id))}
                                        key={a.id}
                                    >
                                        {a.username}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                <Button
                    onClick={() => {
                        setOpened(!opened);
                        fetchThrottled();
                    }}
                >
                    Messages
                </Button>
            </div>
        </div>
    );
};

export default Conversations;
