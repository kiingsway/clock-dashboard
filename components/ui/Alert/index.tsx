import { ReactNode } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import { TiWarning } from "react-icons/ti";
import { MdError } from "react-icons/md";
import { IoMdInformationCircle } from "react-icons/io";
import styles from "./Alert.module.scss";

export type AlertVariant = "success" | "warning" | "danger" | "info";

interface Props {
  variant?: AlertVariant;
  title: string;
  message?: ReactNode;
  button?: {
    onClick: () => void;
    ariaLabel: string;
    text?: ReactNode;
  }
}

const ICONS: Record<AlertVariant, ReactNode> = {
  success: <AiFillCheckCircle />,
  warning: <TiWarning />,
  danger: <MdError />,
  info: <IoMdInformationCircle />,
};

export default function Alert({ variant = 'info', title, message, button }: Props) {
  return (
    <div className={`${styles.alert} ${styles[variant]}`} role="alert">
      <div className={styles.icon}>{ICONS[variant]}</div>

      <div className={styles.content}>
        <h4 className={styles.title}>{title}</h4>
        {message && <p className={styles.message}>{message}</p>}
      </div>

      {button && (
        <button
          type="button"
          className={styles.btn}
          onClick={button.onClick}
          aria-label={button.ariaLabel}
        >
          {button.text || <>&times;</>}
        </button>
      )}
    </div>
  );
}