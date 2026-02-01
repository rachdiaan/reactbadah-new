import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        this.setState({ errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
                    <div className="max-w-xl w-full bg-red-900/20 border border-red-500/50 rounded-xl p-6">
                        <h1 className="text-2xl font-bold text-red-400 mb-4">Something went wrong</h1>
                        <p className="text-gray-300 mb-4">The application crashed. Here is the error:</p>
                        <pre className="bg-black/50 p-4 rounded-lg overflow-auto text-sm font-mono text-red-200 mb-4">
                            {this.state.error && this.state.error.toString()}
                        </pre>
                        <details className="bg-black/30 p-4 rounded-lg overflow-auto text-xs font-mono text-gray-400">
                            <summary className="cursor-pointer mb-2 font-semibold">Stack Trace</summary>
                            {this.state.errorInfo?.componentStack}
                        </details>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold"
                        >
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
