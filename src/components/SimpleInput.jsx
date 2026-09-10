// 原版 SimpleInput 组件(renderer.js scoped 0f00486f):
// 相对定位容器(width 250px) + 居中 input + 绝对定位 suffix(如 px/ms)
export default function SimpleInput({ value, onChange, placeholder, suffix, type = 'text' }) {
  return (
    <div className="main-simple-input">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck="false"
      />
      {suffix && <span className="suffix">{suffix}</span>}
    </div>
  )
}
