import dayjs from "dayjs"
import { request } from './request'
import { shuffle } from 'lodash'
import { Interval_time, timeZone, github } from "../config/config"
import { GRepo } from '../types'
import { generateOpenSourceProjectHtml, generateRepoHTML, getcon, mini } from "./util"

export function injection_footer(newCon: string) {
    const now = new Date()
    const next = dayjs().add(Interval_time, 'h').toDate()
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone
        }).format(date)
    }

    return newCon.replace(
        getcon('FOOTER'),
        mini`
    <p align="center">此文件 <i>README</i> <b>间隔 ${Interval_time} 小时</b>自动刷新生成！
    <br>
    刷新于：${formatDate(now)}
    <br>
    下一次刷新：${formatDate(next)}</p>
    `
    )
}

export async function injection_recent_star(newCon: string) {
    // 获取Star
    const star: any[] = await request
    .get('/users/' + github.name + '/starred')
    .then((data: { data: any }) => data.data)

    const topStar5 = star
      .slice(0, 5)
      .reduce((str, cur) => str + generateRepoHTML(cur), '')

      return newCon =  newCon.replace(
      getcon('RECENT_STAR_INJECT'),
      mini`
      <ul>
      ${topStar5}
      </ul>
      `,
    )
}

export async function open_source_project(newCon: string) {
  // 获取 stars 数量前十的项目
  const { data: { items } } = await request.get('/search/repositories', {
    params: {
      q: `user:${github.name}`,
      sort: 'stars',
      order: 'desc',
      per_page: 10,
    },
  })

  // 随机选择五个并按 stars 数量降序排序
  const OpenSourceRrojectDetail: GRepo[] = shuffle(items).slice(0, 5)
    .sort((a: GRepo, b: GRepo) => b.stargazers_count - a.stargazers_count)

  return newCon.replace(
    getcon('OPEN_SOURCE_PROJECT'),
    generateOpenSourceProjectHtml(OpenSourceRrojectDetail)
  )
}
