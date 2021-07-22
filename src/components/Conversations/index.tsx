import React, { useCallback, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import throttle from "lodash/throttle";
import ChevronDoubleDownIcon from "@heroicons/react/solid/ChevronDoubleDownIcon";
import ChevronDoubleUpIcon from "@heroicons/react/solid/ChevronDoubleUpIcon";
import { useFetchConversations, useProcessIncomingMessage } from "../../hooks";
import { LoadingSpinnerCenter } from "../../ui/LoadingSpinner";
import { getConversation, getOpenedConversations } from "../../store/app/selectors";
import Button from "../../ui/Button";
import { hideConversation, openConversation, showConversation } from "../../store/app/actions";
import Conversation from "./Conversation";
import BetroApiObject from "../../api/context";
import Divider from "../../ui/Divider";
import UserListItem from "../UserListItem";

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
    const toggleConversation = useCallback(
        (id: string) => {
            const conversation = conversations.opened.find((a) => a.id === id);
            if (conversation == null) {
                dispatch(openConversation(id));
                return;
            }
            if (conversation.visible) {
                dispatch(hideConversation(id));
            } else {
                dispatch(showConversation(id));
            }
        },
        [conversations.opened, dispatch]
    );
    return (
        <div className="flex flex-row items-end pt-4 pl-4">
            {openedConversations.map((a) => (
                <Conversation key={a.id} conversation={a} visible={a.visible} />
            ))}
            <div className="w-60 flex flex-col shadow-subtle">
                {opened && (
                    <div>
                        {!conversations.isLoaded ? (
                            <LoadingSpinnerCenter />
                        ) : (
                            <div className="overflow-y-auto h-96">
                                {conversations.data.length === 0 && (
                                    <div className="p-3 text-center">No Conversations found</div>
                                )}
                                {conversations.data.map((a) => (
                                    <div
                                        className="p-2 cursor-pointer"
                                        onClick={() => toggleConversation(a.id)}
                                        key={a.id}
                                    >
                                        <UserListItem user={a} />
                                    </div>
                                ))}
                            </div>
                        )}
                        <Divider />
                    </div>
                )}
                <Button
                    noHoverBg
                    outlined
                    size="large"
                    className="text-left flex flex-row"
                    onClick={() => {
                        setOpened(!opened);
                        fetchThrottled();
                    }}
                >
                    <span className="mr-1">Messages</span>
                    {opened ? (
                        <ChevronDoubleDownIcon className="heroicon" />
                    ) : (
                        <ChevronDoubleUpIcon className="heroicon" />
                    )}
                </Button>
            </div>
        </div>
    );
};

export default Conversations;
