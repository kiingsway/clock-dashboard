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
    console.group("ErrorBoundary");
    console.error("Error:", error);
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    console.error("Component stack:", info.componentStack);
    console.groupEnd();
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