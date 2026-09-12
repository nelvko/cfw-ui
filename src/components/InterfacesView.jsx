import { useEffect, useMemo, useState } from 'react'
import SelectView from './SelectView'
import { getInterfaces } from '../service'

// 对应原版 InterfacesView(renderer.js scoped d9b850ea, 组件名 InterfacesView):
// 遮罩覆盖右侧内容区(左上起点 170/25), 顶部 "Network Interfaces" + IPv4/IPv6 切换,
// 列表按网卡分组展示 Address / Netmask(含 CIDR 前缀) / MAC;
// internal 地址红色 #D44545, external 绿色 #13AF42; Esc 或点遮罩关闭。
export default function InterfacesView({ onClose }) {
  const [interfaces, setInterfaces] = useState([])
  const [ipvIndex, setIpvIndex] = useState(0)
  const ipv = ['IPv4', 'IPv6'][ipvIndex]

  useEffect(() => {
    getInterfaces().then(setInterfaces)
  }, [])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // 原版 ifs: 仅保留该 family 下确实存在地址的网卡
  const ifs = useMemo(
    () =>
      interfaces.reduce((acc, iface) => {
        const addrs = (iface.addrs || []).filter((a) => a.family === ipv)
        if (addrs.length > 0) acc.push({ name: iface.name, addrs })
        return acc
      }, []),
    [interfaces, ipv],
  )

  return (
    <div className="interfaces-mask" onMouseDown={onClose}>
      <div className="interfaces-card" onMouseDown={(e) => e.stopPropagation()}>
        <div className="interfaces-header">
          <span>Network Interfaces</span>
          <SelectView items={['IPv4', 'IPv6']} value={ipvIndex} onChange={setIpvIndex} />
        </div>
        <div className="interfaces-list">
          {ifs.map((iface) => (
            <div key={iface.name} className="if-list">
              <span className="if-name">{iface.name}</span>
              {iface.addrs.map((a) => (
                <div key={a.address} className={`if-addr ${a.internal ? 'internal' : 'external'}`}>
                  <div className="if-addr-row">
                    <span className="if-addr-label">Address:</span>
                    <span>{a.address}</span>
                  </div>
                  <div className="if-addr-row">
                    <span className="if-addr-label">Netmask:</span>
                    <span>
                      {a.netmask}
                      {a.cidr ? ` (${a.cidr.split('/')[1]})` : ''}
                    </span>
                  </div>
                  <div className="if-addr-row">
                    <span className="if-addr-label">MAC:</span>
                    <span>{a.mac}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
