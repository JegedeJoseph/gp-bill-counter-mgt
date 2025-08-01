import { Modal, Button } from "antd";
import { ClientOnly } from "~/utils/client-only";
import { useState } from "react";

type DialogProps = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function AppDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: DialogProps) {
  return (
    <ClientOnly fallback={null}>
      <Modal
        title={title}
        open={isOpen}
        onOk={onConfirm}
        onCancel={onCancel}
        footer={[
          <Button key="cancel" onClick={onCancel}>
            Cancel
          </Button>,
          <Button key="confirm" type="primary" danger onClick={onConfirm}>
            Confirm
          </Button>,
        ]}
      >
        <p>{message}</p>
      </Modal>
    </ClientOnly>
  );
}

export function useDialog() {
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    onCancel: () => {},
  });

  const openDialog = ({
    title,
    message,
    onConfirm,
    onCancel,
  }: {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
  }) => {
    setDialogState({
      isOpen: true,
      title,
      message,
      onConfirm,
      onCancel,
    });
  };

  const closeDialog = () => {
    setDialogState((prev) => ({ ...prev, isOpen: false }));
  };

  return { dialogState, openDialog, closeDialog };
}
