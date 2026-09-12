import { Component } from 'react'

// 顶层错误边界:原版是 Electron 单页应用,渲染期异常会直接白屏。
// Web 版在此兜底,把异常限制在页面内容区并给出可恢复入口。
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('[cfw-ui] render error:', error, info)
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children
    return (
      <div className="crash-view">
        <div className="crash-title">Something went wrong</div>
        <pre className="crash-msg">{String(error?.stack || error)}</pre>
        <div className="btn clickable" onClick={() => this.setState({ error: null })}>
          Reload
        </div>
      </div>
    )
  }
}
