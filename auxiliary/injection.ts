import dayjs from "dayjs"
import { request } from './request'
import { shuffle } from 'lodash'
import { Interval_time, timeZone, github, open_source_project_config, injection_recent_star_config } from "../config/config"
import { GRepo } from '../types'
import { generateOpenSourceProjectHtml, generateRecentStarHtml, getcon, mini } from "./util"

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
    const star: GRepo[] = await request
    .get('/users/' + github.name + '/starred')
    .then((data: { data: GRepo[] }) => data.data)

    const topStar = star.slice(0, injection_recent_star_config.count)

    return newCon.replace(
      getcon('RECENT_STAR_INJECT'),
      generateRecentStarHtml(topStar)
    )
}

export async function open_source_project(newCon: string) {
  const { data: { items } } = await request.get('/search/repositories', {
    params: {
      q: `user:${github.name}`,
      sort: 'stars',
      order: 'desc',
      per_page: open_source_project_config.sum,
    },
  })

  // 随机选择并按 stars 数量降序排序
  const OpenSourceRrojectDetail: GRepo[] = shuffle(items).slice(0, open_source_project_config.count)
    .sort((a: GRepo, b: GRepo) => b.stargazers_count - a.stargazers_count)

  return newCon.replace(
    getcon('OPEN_SOURCE_PROJECT'),
    generateOpenSourceProjectHtml(OpenSourceRrojectDetail)
  )
}
