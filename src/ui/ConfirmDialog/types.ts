export type ConfirmDialogProps = {
    id: string;
    title: React.ReactNode;
    open: boolean;
    handleCancel: () => void;
    handleConfirm?: () => void;
    description?: string;
    cancelText?: string;
    confirmText?: string;
};
