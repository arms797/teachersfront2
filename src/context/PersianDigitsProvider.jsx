// PersianDigitsProvider.jsx
import { useEffect, useRef } from 'react'

const toPersianDigits = (text) => {
  if (!text) return text
  const map = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹']
  return text.replace(/\d/g, d => map[d])
}

// پیمایش و تبدیل همه‌ی نودهای متنی
const convertTextNodes = (root) => {
  if (!root) return
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false)
  const nodesToChange = []
  let node
  while ((node = walker.nextNode())) {
    // متن داخل عناصر ورودی را تغییر نده (value متفاوت است)
    const parentTag = node.parentElement?.tagName
    if (parentTag && ['SCRIPT','STYLE','TEXTAREA','INPUT'].includes(parentTag)) continue
    const original = node.nodeValue
    const converted = toPersianDigits(original)
    if (converted !== original) nodesToChange.push({ node, converted })
  }
  nodesToChange.forEach(({ node, converted }) => { node.nodeValue = converted })
}

export default function PersianDigitsProvider({ children }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // تبدیل اولیه
    convertTextNodes(el)

    // مشاهده تغییرات و تبدیل خودکار
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'childList') {
          m.addedNodes.forEach((n) => {
            if (n.nodeType === Node.TEXT_NODE) {
              const converted = toPersianDigits(n.nodeValue)
              if (converted !== n.nodeValue) n.nodeValue = converted
            } else if (n.nodeType === Node.ELEMENT_NODE) {
              convertTextNodes(n)
            }
          })
        } else if (m.type === 'characterData') {
          const t = m.target
          const converted = toPersianDigits(t.nodeValue)
          if (converted !== t.nodeValue) t.nodeValue = converted
        }
      }
    })

    observer.observe(el, {
      childList: true,
      characterData: true,
      subtree: true
    })

    return () => observer.disconnect()
  }, [])

  return <div ref={containerRef}>{children}</div>
}
