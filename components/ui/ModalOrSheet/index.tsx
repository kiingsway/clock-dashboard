import { usePortalContainer } from "@/hooks/usePortalContainer";
import { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { BottomSheet } from "../BottomSheet";
import { Modal } from "../Modal";
import useAppSettings from "@/contexts/AppSettingsContext";

interface ModalOrSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  
  accent?: string;
  snapPoints?: number[];
}

export default function ModalOrSheet({ title, children, open, onClose, accent, snapPoints = [0.7, 0.95] }: PropsWithChildren<ModalOrSheetProps>) {
  const { t } = useTranslation();
  const { get: { useBottomSheet } } = useAppSettings();
  const portalContainer = usePortalContainer();

  if (useBottomSheet) return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={title}
      ariaLabel={t('close')}
      snapPoints={snapPoints}
      initialSnap={0}
      dismissible
      container={portalContainer}
    >
      {children}
    </BottomSheet>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      accentColor={accent}
    >
      {children}
    </Modal>
  );
}