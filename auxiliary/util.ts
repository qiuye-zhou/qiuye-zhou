import { minify } from "html-minifier";
import { COMMNETS } from '../config/constants'
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

//生成 `以往学习过程写的一些简单东西` 结构
export function generateHTML(list: GRepo[]) {
  const tbody = list.reduce((str, cur) =>str +` <tr>
  <td><a href="${cur.html_url}" target="_blank"><b>
  ${cur.full_name}</b></a> ${
        cur.homepage ? `<a href="${cur.homepage}" target="_blank">🔗</a>` : ''
      }</td>
  <td><img alt="Stars" src="https://img.shields.io/github/stars/${
    cur.full_name
  }?style=flat-square&labelColor=343b41"/></td>
  <td>${new Date(cur.created_at).toLocaleDateString()}</td>
  <td>${new Date(cur.pushed_at).toLocaleDateString()}</td>
  </tr>`,``,)
  return mini`<table>
  <thead align="center">
  <tr border: none;>
    <td><b>🎁 Projects</b></td>
    <td><b>⭐ Stars</b></td>
    <td><b>🕐 Create At</b></td>
    <td><b>📅 Last Active At</b></td>
  </tr>
  </thead>
  <tbody>
  ${tbody}
  </tbody>
  </table>`
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

function getLanguageBadge(language: string | null): string {
  if (!language) return ''
  const badgeUrl =
    languageBadgeMap[language] ||
    `https://img.shields.io/badge/-${encodeURIComponent(language)}-grey?style=flat-square`
  return `<img align="absmiddle" alt="${language}" src="${badgeUrl}"/>`
}

export function generateOpenSourceProjectHtml(list: GRepo[]) {
  const items = list
    .map((cur) => {
      const starsBadge = `https://img.shields.io/github/stars/${cur.full_name}?style=social&label=${encodeURIComponent(cur.name)}`
      const langBadge = getLanguageBadge(cur.language)
      const desc = cur.description ? `: ${cur.description.trim()}` : ''
      return `- <a href="${cur.html_url}" target="_blank"><img align="absmiddle" alt="${cur.name}" src="${starsBadge}"/></a>${desc} ${langBadge}`.trim()
    })
    .join('\n')

  return items
}

export function generateRecentStarHtml(list: GRepo[]) {
  const items = list
    .map((cur) => {
      const starsBadge = `https://img.shields.io/github/stars/${cur.full_name}?style=social&label=${encodeURIComponent(cur.full_name)}`
      const langBadge = getLanguageBadge(cur.language)
      const desc = cur.description ? `: ${cur.description.trim()}` : ''
      return `- <a href="${cur.html_url}" target="_blank"><img align="absmiddle" alt="${cur.full_name}" src="${starsBadge}"/></a>${desc} ${langBadge}`.trim()
    })
    .join('\n')

  return items
}