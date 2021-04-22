import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

type ConfirmDialogProps = {
    id: string;
    title: string;
    open: boolean;
    handleConfirm: () => void;
    handleCancel?: () => void;
    description?: string;
    cancelText?: string;
    confirmText?: string;
};

const ConfirmDialog: React.FunctionComponent<ConfirmDialogProps> = (props) => {
    const {
        id,
        open,
        handleCancel,
        handleConfirm,
        title,
        description,
        confirmText,
        cancelText,
    } = props;
    return (
        <Dialog
            open={open}
            onClose={handleCancel}
            aria-labelledby={`${id}-title`}
            aria-describedby={`${id}-description`}
        >
            <DialogTitle id={`${id}-title`}>{title}</DialogTitle>
            {description != null && (
                <DialogContent>
                    <DialogContentText id={`${id}-description`}>{description}</DialogContentText>
                </DialogContent>
            )}
            <DialogActions>
                <Button onClick={handleCancel} color="primary">
                    {cancelText || "Disagree"}
                </Button>
                <Button onClick={handleConfirm} color="primary" autoFocus>
                    {confirmText || "Agree"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;
