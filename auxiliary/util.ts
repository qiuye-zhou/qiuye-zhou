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

export function generateRepoHTML<T extends GHItem>(item: T) {
  return `<li><a href="${item.html_url}">${item.full_name}</a>${
    item.description ? `<p>${item.description}</p>` : ''
  }</li>`
}

export function generateOpenSourceProjectHtml<T extends GHItem>(list: T[]) {
  const tbody = list.reduce(
    (str, cur) =>
      str +
      ` <tr>
      <td><a href="${cur.html_url}"><b>
      ${cur.full_name}</b></a></td>
      <td><img alt="Stars" src="https://img.shields.io/github/stars/${cur.full_name}?style=flat-square&labelColor=343b41"/></td>
      <td><img alt="Forks" src="https://img.shields.io/github/forks/${cur.full_name}?style=flat-square&labelColor=343b41"/></td>
      <td><a href="https://github.com/${cur.full_name}/issues" target="_blank"><img alt="Issues" src="https://img.shields.io/github/issues/${cur.full_name}?style=flat-square&labelColor=343b41"/></a></td>
      <td><a href="https://github.com/${cur.full_name}/pulls" target="_blank"><img alt="Pull Requests" src="https://img.shields.io/github/issues-pr/${cur.full_name}?style=flat-square&labelColor=343b41"/></a></td>
      <td><a href="https://github.com/${cur.full_name}/commits" target="_blank"><img alt="Last Commits" src="https://img.shields.io/github/last-commit/${cur.full_name}?style=flat-square&labelColor=343b41"/></a></td>
      </tr>`,
    ``,
  )

  return mini`<table>
  <thead align="center">
    <tr border: none;>
      <td><b>🎁 Projects</b></td>
      <td><b>⭐ Stars</b></td>
      <td><b>📚 Forks</b></td>
      <td><b>🛎 Issues</b></td>
      <td><b>📬 Pull requests</b></td>
      <td><b>💡 Last Commit</b></td>
    </tr>
  </thead>
  <tbody>
    ${tbody}
  </tbody>
  </table>`
}