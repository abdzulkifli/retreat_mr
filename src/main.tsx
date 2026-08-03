import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app/App';
import './styles/global.css';

type BoundaryState = { error: Error | null };

class AppErrorBoundary extends React.Component<React.PropsWithChildren, BoundaryState> {
  state: BoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): BoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('HOME31 runtime error:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <main className="fatal-screen">
          <div>
            <p className="fatal-kicker">The journey could not start</p>
            <h1>Idea 31 encountered a technical roadblock.</h1>
            <p>{this.state.error.message || 'An unexpected browser error occurred.'}</p>
            <button type="button" onClick={() => window.location.reload()}>Reload journey</button>
            <a href="./health.html">Check deployment health</a>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element');

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </React.StrictMode>
);
