// 原版 SelectView 组件(renderer.js @3217504, scoped e458e7bc):
// props: items:Array, index:Number(默认0); 点击 item emit select(index)
// itemClass: item + item-double(偶数)/item-single(奇数) + item-selected(选中)
//            + item-first(首个)/item-last(末个)
export default function SelectView({ items = [], value = 0, onChange, className = '' }) {
  return (
    <div className={`main-select-view${className ? ` ${className}` : ''}`}>
      {items.map((item, i) => {
        const cls = ['item', i % 2 === 0 ? 'item-double' : 'item-single']
        if (i === value) cls.push('item-selected')
        if (i === 0) cls.push('item-first')
        else if (i === items.length - 1) cls.push('item-last')
        return (
          <div key={i} className={cls.join(' ')} onClick={() => onChange(i)}>
            {item}
          </div>
        )
      })}
    </div>
  )
}
