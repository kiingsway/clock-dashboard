import { ReactNode, Component, ErrorInfo } from "react";
import ErrorAlert, { ErrorAlertProps } from "./ErrorAlert";

interface Props {
  children: ReactNode;
  fallback?: React.ComponentType<ErrorAlertProps>;
}

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = {
    error: null,
  };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary:", error, info);
  }

  retry = () => {
    this.setState({ error: null });
  };

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    const Fallback = this.props.fallback ?? ErrorAlert;

    return (
      <Fallback
        error={this.state.error}
        retry={this.retry}
      />
    );
  }
}