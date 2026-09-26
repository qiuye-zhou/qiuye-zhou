import { minify } from "html-minifier";
import { COMMNETS } from '../config/constants'
import { statsConfig, skillsConfig } from '../config/config'
import { request } from './request'
import { GHItem, GRepo } from "../types";

//获取文档对应需要替换的位置
export function getcon(token: keyof typeof COMMNETS) {
    return `<!-- ${COMMNETS[token]} -->`
}

//格式化字符串为需要的html格式
export function mini(html: TemplateStringsArray, ...args: any[]) {
    const str = html.reduce((p, c, i) => p + c + (args[i] ? args[i] : ''), '')
    return minify(str, {
      removeAttributeQuotes: true,
      removeEmptyAttributes: true,
      removeTagWhitespace: true,
      collapseWhitespace: true,
    })
}

const languageBadgeMap: Record<string, string> = {
  TypeScript: 'https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white',
  JavaScript: 'https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black',
  Vue: 'https://img.shields.io/badge/-Vue.js-4FC08D?style=flat-square&logo=vue.js&logoColor=white',
  Java: 'https://img.shields.io/badge/-Java-007396?style=flat-square&logo=openjdk&logoColor=white',
  Kotlin: 'https://img.shields.io/badge/-Kotlin-7F52FF?style=flat-square&logo=kotlin&logoColor=white',
  Python: 'https://img.shields.io/badge/-Python-3776AB?style=flat-square&logo=python&logoColor=white',
  Rust: 'https://img.shields.io/badge/-Rust-000000?style=flat-square&logo=rust&logoColor=white',
  Go: 'https://img.shields.io/badge/-Go-00ADD8?style=flat-square&logo=go&logoColor=white',
  'C++': 'https://img.shields.io/badge/-C++-00599C?style=flat-square&logo=cplusplus&logoColor=white',
  C: 'https://img.shields.io/badge/-C-A8B9CC?style=flat-square&logo=c&logoColor=white',
  'C#': 'https://img.shields.io/badge/-C%23-239120?style=flat-square&logo=csharp&logoColor=white',
  Dart: 'https://img.shields.io/badge/-Dart-0175C2?style=flat-square&logo=dart&logoColor=white',
  HTML: 'https://img.shields.io/badge/-HTML5-E34F26?style=flat-square&logo=html5&logoColor=white',
  CSS: 'https://img.shields.io/badge/-CSS3-1572B6?style=flat-square&logo=css3&logoColor=white',
  SCSS: 'https://img.shields.io/badge/-SCSS-CC6699?style=flat-square&logo=sass&logoColor=white',
  Shell: 'https://img.shields.io/badge/-Shell-4EAA25?style=flat-square&logo=gnu-bash&logoColor=white',
  PHP: 'https://img.shields.io/badge/-PHP-777BB4?style=flat-square&logo=php&logoColor=white',
  Lua: 'https://img.shields.io/badge/-Lua-2C2D72?style=flat-square&logo=lua&logoColor=white',
  Swift: 'https://img.shields.io/badge/-Swift-FA7343?style=flat-square&logo=swift&logoColor=white',
  Ruby: 'https://img.shields.io/badge/-Ruby-CC342D?style=flat-square&logo=ruby&logoColor=white',
}

function buildLanguageBadge(language: string): string {
  const badgeUrl =
    languageBadgeMap[language] ||
    `https://img.shields.io/badge/-${encodeURIComponent(language)}-grey?style=flat-square`
  return `<img align="absmiddle" alt="${language}" src="${badgeUrl}"/>`
}

async function getLanguageBadges(cur: GRepo): Promise<string> {
  const primary = cur.language
  try {
    const { data } = await request.get<Record<string, number>>(cur.languages_url)
    const top2 = Object.keys(data || {})
      .sort((a, b) => (data[b] || 0) - (data[a] || 0))
      .slice(0, 2)
    if (top2.length === 0 && primary) return buildLanguageBadge(primary)
    if (top2.length === 1 && primary && top2[0] !== primary) top2.push(primary)
    return top2.map(buildLanguageBadge).join(' ')
  } catch {
    return primary ? buildLanguageBadge(primary) : ''
  }
}

export async function generateOpenSourceProjectHtml(list: GRepo[]) {
  const items = await Promise.all(
    list.map(async (cur) => {
      const starsBadge = `https://img.shields.io/github/stars/${cur.full_name}?style=social&label=${encodeURIComponent(cur.name)}`
      const langBadge = await getLanguageBadges(cur)
      const desc = cur.description ? `: ${cur.description.trim()}` : ''
      return `- <a href="${cur.html_url}" target="_blank"><img align="absmiddle" alt="${cur.name}" src="${starsBadge}"/></a>${desc} ${langBadge}`.trim()
    })
  )
  return items.join('\n')
}

// 生成技能图标区域 HTML（按 columns 列自动排列，最后一行不足时 colspan 填满）
export function generateSkillsHtml() {
  const { columns, iconHeight, baseUrl, groups } = skillsConfig
  const colWidth = (100 / columns).toFixed(2)

  const buildCell = (title: string, icons: string[], colspan?: number) => {
    const width = colspan ? 100 : parseFloat(colWidth)
    const colspanAttr = colspan ? ` colspan="${colspan}"` : ''
    const imgs = icons.map((i) => `<img height="${iconHeight}" src="${baseUrl}?i=${i}" alt="${i}"/>`).join('\n      ')
    return `<td width="${width}%"${colspanAttr} valign="top">\n      <h3 align="center">${title}</h3>\n      ${imgs}\n    </td>`
  }

  const rows: string[] = []
  for (let i = 0; i < groups.length; i += columns) {
    const slice = groups.slice(i, i + columns)
    const isLastRow = i + columns >= groups.length
    let cells: string[]
    if (isLastRow && slice.length < columns) {
      // 最后一行不足 columns 个，最后一个 td 用 colspan 填满
      cells = slice.map((g, idx) => {
        const isLast = idx === slice.length - 1
        const span = columns - slice.length + 1
        return isLast ? buildCell(g.title, g.icons, span) : buildCell(g.title, g.icons)
      })
    } else {
      cells = slice.map((g) => buildCell(g.title, g.icons))
    }
    rows.push(`  <tr>\n${cells.join('\n')}\n  </tr>`)
  }

  return `<table>\n${rows.join('\n')}\n</table>`
}

// 生成 GitHub Stats / LeetCode 卡片区域 HTML
export function generateStatsHtml() {
  const { github, screenshot, leetcode } = statsConfig
  const statsUrl = `${github.stats.baseUrl}?username=${github.username}&show_icons=${github.stats.showIcons}`
  const topLangsUrl = `${github.topLangs.baseUrl}/?username=${github.username}&count_private=${github.topLangs.countPrivate}&show_icons=${github.topLangs.showIcons}&layout=${github.topLangs.layout}`
  const leetcodeUrl = `${leetcode.baseUrl}/${leetcode.user}?theme=${leetcode.theme}&font=${leetcode.font}&site=${leetcode.site}`

  return mini`
<table>
  <tr>
    <td align="center">
      <img width="${github.stats.width}px" alt="GitHub Stats" src="${statsUrl}"/>
      <img width="${github.topLangs.width}px" alt="Top Languages" src="${topLangsUrl}"/>
    </td>
    <td align="center">
      <img width="${screenshot.width}px" alt="Screenshot" src="${screenshot.src}"/>
    </td>
  </tr>
</table>

<img width="${leetcode.width}px" alt="LeetCode Stats" src="${leetcodeUrl}"/>
  `
}

export async function generateRecentStarHtml(list: GRepo[]) {
  const items = await Promise.all(
    list.map(async (cur) => {
      const starsBadge = `https://img.shields.io/github/stars/${cur.full_name}?style=social&label=${encodeURIComponent(cur.full_name)}`
      const langBadge = await getLanguageBadges(cur)
      const desc = cur.description ? `: ${cur.description.trim()}` : ''
      return `- <a href="${cur.html_url}" target="_blank"><img align="absmiddle" alt="${cur.full_name}" src="${starsBadge}"/></a>${desc} ${langBadge}`.trim()
    })
  )
  return items.join('\n')
}