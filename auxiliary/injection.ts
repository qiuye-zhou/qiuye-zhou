import dayjs from "dayjs"
import { request } from './request'
import { shuffle } from 'lodash'
import { Interval_time, timeZone, source, github } from "../config/config"
import { GRepo } from '../types'
import { generateHTML, generateOpenSourceProjectHtml, generateRepoHTML, getcon, mini } from "./util"

export function injection_footer(newCon: string) {
    const now = new Date()
    const next = dayjs().add(Interval_time, 'h').toDate()
    
    return newCon.replace(
      getcon('FOOTER'),
      mini` 
    <p align="center">此文件 <i>README</i> <b>间隔 ${Interval_time} 小时</b>自动刷新生成！
    </br>
    刷新于：${now.toLocaleString(undefined, {
      timeStyle: 'short',
      dateStyle: 'short',
      timeZone,
    })}
    <br/>
    下一次刷新：${next.toLocaleString(undefined, {
      timeStyle: 'short',
      dateStyle: 'short',
      timeZone,
    })}</p>
    `,
    )
}

export async function injection_SmallToys(newCon: string) {
  const limit = source.SmallToys.limit
  const SmallToys_list = source.SmallToys.random ? 
    shuffle(source.SmallToys.address).slice(0, limit) 
    : source.SmallToys.address.slice(0, limit)
  
  const SmallToysDetail: GRepo[] = await Promise.all(
    SmallToys_list.map(async (name) => {
      const data = await request.get('/repos/' + name)
      return data.data
    }),
  )
  return newCon
  .replace(
    getcon('SMALL_TOYS_INJECT'),
    generateHTML(SmallToysDetail),
  ) as string
}

export async function injection_recent_star(newCon: string) {
    // 获取Star
    const star: any[] = await request
    .get('/users/' + github.name + '/starred')
    .then((data) => data.data)

    const topStar5 = star
      .slice(0, 5)
      .reduce((str, cur) => str + generateRepoHTML(cur), '')

    newCon =  newCon.replace(
      getcon('RECENT_STAR_INJECT'),
      mini`
      <ul>
      ${topStar5}
      </ul>
      `,
    )

    const random = shuffle(star.slice(5))
      .slice(0, 5)
      .reduce((str, cur) => str + generateRepoHTML(cur), '')

    return newCon.replace(
      getcon('RANDOM_STARS_INJECT'),
      mini`
      <ul>
      ${random}
      </ul>
      `,
    )
}

export async function open_source_project(newCon: string) {
  const OpenSourceRrojectDetail: GRepo[] = await Promise.all(
    source.OpenSource.map(async (name) => {
      const data = await request.get('/repos/' + name)
      return data.data
    }),
  )

  return newCon.replace(
    getcon('OPEN_SOURCE_PROJECT'),
    generateOpenSourceProjectHtml(OpenSourceRrojectDetail)
  )
}