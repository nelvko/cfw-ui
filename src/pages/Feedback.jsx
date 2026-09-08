import { useState } from 'react'

// 与原版 CFW About 页 select(index) 打开的外部链接数组一致
const URLS = [
  'https://t.me/Rules_lhie1',
  'https://t.me/Fndroids',
  'https://github.com/Fndroid/clash_for_windows_pkg',
  'https://github.com/Dreamacro/clash',
  'https://github.com/yichengchen/clashX',
  'https://docs.cfw.lbyczf.com/',
  'https://fndroid.github.io/clash-config-builder/',
  'https://github.com/tiagonmas/Windows-Loopback-Exemption-Manager',
  'https://github.com/Noisyfox/sysproxy',
  'https://github.com/eycorsican/go-tun2socks',
  'https://dev.maxmind.com/geoip/geoip2/geolite2/',
  'https://github.com/twitter/twemoji',
  'https://github.com/Jigsaw-Code/outline-client',
  'https://github.com/microsoft/terminal/',
  'https://www.wintun.net/',
  'https://github.com/winsw/winsw',
  'https://apps.apple.com/us/app-bundle/quantumult-x-upgrade/id1482985563',
  'https://github.com/Kr328/clash-premium-installer',
  'https://github.com/microsoft/monaco-editor',
  'https://fonts.google.com/icons',
]

// [label, index]
const RELEVANCE = [
  ['Github', 2],
  ['Document', 5],
]

const CREDITS = [
  ['Clash', 3],
  ['ClashX', 4],
  ['Quantumult(X)', 16],
  ['GeoLite2', 10],
  ['twemoji', 11],
  ['EnableLoopback', 7],
  ['sysproxy', 8],
  ['go-tun2socks', 9],
  ['outline-client', 12],
  ['terminal', 13],
  ['Wintun', 14],
  ['winsw', 15],
  ['clash-premium-installer', 17],
  ['monaco-editor', 18],
  ['Material Icons', 19],
]

const DISCLAIMER = `1. This software is only intended for the purpose of learning and researching network technology. Users must comply with the laws and regulations in their respective regions and must not use it for illegal purposes. The software will not be held responsible for any actions of the user.

2. Users must strictly abide by the laws, regulations, and policies of their own countries/regions when using this software. Any consequences or liabilities resulting from violations of relevant laws, regulations, and policies shall be borne by the user.

3. The software is not responsible for the transmission of content. Therefore, if any problems or consequences arise from the use of this software, the user shall bear all responsibility.

4. If the software violates any laws and regulations of the user's country/region, the user must immediately stop using it and bear the corresponding legal responsibility.

5. While using this software, the user acknowledges and agrees that the software cannot guarantee network stability, accuracy, timeliness, and security. The software will not be held responsible for any connection problems or inability to connect caused by network congestion, firewall restrictions, DNS pollution, operator interference, and other reasons.

6. The software does not provide technical support and is not responsible for any direct or indirect losses caused by the user's use of this software, including but not limited to property damage, data loss, and other forms of loss.

7. The software has made every effort to ensure the stability and safety of the software, but will not be held responsible for any direct or indirect losses suffered by the user due to the use of this software.

8. The software reserves the right to change the terms and conditions at any time. Once the terms and conditions change, an announcement will be posted on the software page. Users need to pay attention and abide by the latest version of the terms and conditions.

9. The software may display advertisements from third-party entities. The software does not endorse, guarantee, or assume responsibility for the accuracy, relevancy, or quality of the information presented in these advertisements. Users acknowledge and agree that the software is not liable for any loss or damage arising from the display of advertisements or any transactions or interactions users may have with the advertisers. The user is solely responsible for any interactions with advertisers and is advised to exercise caution and conduct due diligence before engaging in any transactions or interactions with advertisers.`

export default function Feedback() {
  const [disclaimer, setDisclaimer] = useState(false)
  const select = (i) => window.open(URLS[i], '_blank')

  return (
    <div id="main-about-view" className="about">
      <div className="section">
        <div className="title">Developer</div>
        <div className="content">
          <span className="link" onClick={() => window.open('https://github.com/nelvko', '_blank')}>
            nelvko
          </span>
        </div>
      </div>

      <div className="section">
        <div className="title">Relevance</div>
        <div className="chat-list">
          {RELEVANCE.map(([label, idx]) => (
            <div key={label} className="link" onClick={() => select(idx)}>
              {label}
            </div>
          ))}
          <div className="link" onClick={() => setDisclaimer(true)}>
            Disclaimer Statement
          </div>
        </div>
      </div>

      <div className="section">
        <div className="title">Credits</div>
        <div className="credits">
          {CREDITS.map(([label, idx]) => (
            <div key={label} className="link" onClick={() => select(idx)}>
              {label}
            </div>
          ))}
        </div>
      </div>

      <div className="section ad-section">
        <div className="title">Advertisement</div>
        <div className="ad-img-list" />
      </div>

      <div className="slogan">独立思考，明辨是非。</div>

      {disclaimer && (
        <div
          className="mask"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setDisclaimer(false)
          }}
        >
          <pre className="disclaimer-pre">{DISCLAIMER}</pre>
        </div>
      )}
    </div>
  )
}
