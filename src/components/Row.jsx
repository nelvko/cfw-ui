// CFW General / Settings 页的标准行:左侧标签(可带副标题),右侧控件
export default function Row({ label, sub, children }) {
  return (
    <div className="row">
      <div className="row-label">
        {label}
        {sub && <span className="row-sub">{sub}</span>}
      </div>
      <div className="row-control">{children}</div>
    </div>
  )
}
