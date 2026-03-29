import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#0f172a',
                    color: 'white',
                    padding: '20px',
                    textAlign: 'center'
                }}>
                    <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>Oops!</h1>
                    <p style={{ color: '#94a3b8', marginBottom: '32px', maxWidth: '500px' }}>
                        Something went wrong in this part of the application.
                        This can happen due to a temporary glitch or a missing resource.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '12px',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Reload Application
                    </button>
                    {process.env.NODE_ENV === 'development' && (
                        <pre style={{
                            marginTop: '24px',
                            padding: '16px',
                            background: '#1e293b',
                            borderRadius: '8px',
                            fontSize: '12px',
                            textAlign: 'left',
                            maxWidth: '100%',
                            overflow: 'auto'
                        }}>
                            {this.state.error?.toString()}
                        </pre>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
