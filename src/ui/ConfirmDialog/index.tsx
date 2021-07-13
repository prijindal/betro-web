import React, { useCallback, useState } from "react";
import Button from "../Button";

export type ConfirmDialogProps = {
    id?: string;
    title?: React.ReactNode;
    open: boolean;
    handleCancel: () => void;
    handleConfirm?: () => void;
    description?: React.ReactNode;
    cancelText?: string;
    confirmText?: string;
};

const ConfirmDialog: React.FunctionComponent<ConfirmDialogProps> = (props) => {
    const { id, open, handleCancel, handleConfirm, title, description, confirmText, cancelText } =
        props;
    const [closing, setClosing] = useState<boolean>(false);
    const cancel = useCallback(() => {
        setClosing(true);
        setTimeout(() => {
            handleCancel();
            setClosing(false);
        }, 150);
    }, [handleCancel]);
    return (
        <div
            className={`fixed top-0 left-0 bg-black bg-opacity-50 full flex-col justify-center items-center z-30 transition-opacity ${
                open
                    ? closing
                        ? "flex opacity-0 pointer-events-none w-full h-full opacity-0"
                        : "flex opacity-100 w-full h-full"
                    : "pointer-events-none hidden opacity-0 w-0 h-0"
            }`}
        >
            <div
                onClick={cancel}
                className={`bg-white shadow-2xl z-10 fixed top-0 left-0 bg-opacity-0 ${
                    open && !closing ? "w-full h-full" : "w-0 h-0"
                }`}
            />
            <div
                className="bg-white shadow-2xl z-40"
                aria-labelledby={`${id}-title`}
                aria-describedby={`${id}-description`}
            >
                <div className="px-6 py-4 flex-0" id={`${id}-title`}>
                    <span className="text-xl font-medium">{title}</span>
                </div>
                {description != null && (
                    <div className="flex-1 px-6 py-2">
                        <div
                            className="mb-4 text-base font-normal text-gray-600"
                            id={`${id}-description`}
                        >
                            {description}
                        </div>
                    </div>
                )}
                <div className="p-2 flex-0 align-center flex flex-row justify-end">
                    <Button aria-label={cancelText || "Disagree"} onClick={cancel}>
                        {cancelText || "Disagree"}
                    </Button>
                    {handleConfirm != null && (
                        <Button
                            aria-label={confirmText || "Agree"}
                            className="ml-2"
                            onClick={handleConfirm}
                        >
                            {confirmText || "Agree"}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
