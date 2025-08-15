import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("💥 Render error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return <pre style={{color:"red"}}>{String(this.state.error)}</pre>;
    }
    return this.props.children;
  }
}