import { AiOutlineReload } from 'react-icons/ai';
import Alert from '../Alert';

export interface ErrorAlertProps {
  error: Error;
  retry: () => void;
}

export default function ErrorAlert({ error, retry }: ErrorAlertProps) {
  return (
    <Alert
      title={error.name}
      message={String(error.message)}
      variant="danger"
      button={{
        ariaLabel: 'Retry',
        onClick: retry,
        text: <AiOutlineReload />
      }}
    />
  )
}
