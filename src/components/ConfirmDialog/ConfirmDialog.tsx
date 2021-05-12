import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "../Button";

import { ConfirmDialogProps } from "./types";

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
                <Button onClick={handleCancel}>{cancelText || "Disagree"}</Button>
                {handleConfirm != null && (
                    <Button onClick={handleConfirm}>{confirmText || "Agree"}</Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;
