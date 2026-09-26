export const github = {
    name: 'qiuye-zhou',
}

export const open_source_project_config = {
    sum: 12,
    count: 8,
}

export const injection_recent_star_config = {
    count: 8
}

export const githubAPIEndPoint = 'https://api.github.com'

export const timeZone = 'Asia/Shanghai'

export const motto = `<p align=center><strong>如果你热爱生活就不要浪费时间，因为时间组成了生活。</strong></p>`

export const Interval_time = 168

// GitHub Stats / LeetCode 卡片配置
export const statsConfig = {
  github: {
    username: 'qiuye-zhou',
    stats: {
      width: 500,
      baseUrl: 'https://github-readme-stats-one-bice.vercel.app/api',
      showIcons: true,
    },
    topLangs: {
      width: 500,
      baseUrl: 'https://github-readme-stats-one-bice.vercel.app/api/top-langs',
      countPrivate: true,
      showIcons: true,
      layout: 'compact' as const,
    },
  },
  screenshot: {
    width: 520,
    src: 'https://s21.ax1x.com/2025/08/30/pVcVrQO.png',
  },
  leetcode: {
    width: 500,
    baseUrl: 'https://leetcard.jacoblin.cool',
    user: 'qiuye-zh',
    theme: 'light',
    font: 'Rasa',
    site: 'cn',
  },
}

// 技能图标配置
export const skillsConfig = {
  columns: 3,
  iconHeight: 48,
  baseUrl: 'https://skillicons.dev/icons',
  groups: [
    {
      title: 'Frontend Core',
      icons: ['html', 'css', 'js', 'ts', 'vue', 'react', 'angular', 'nextjs', 'nuxtjs', 'pinia', 'jest'],
    },
    {
      title: 'Backend Core',
      icons: ['nestjs', 'express', 'nodejs', 'java', 'spring'],
    },
    {
      title: 'Engineering & Build',
      icons: ['vite', 'webpack', 'rollupjs', 'pnpm', 'npm', 'electron', 'flutter', 'docker', 'nginx', 'githubactions'],
    },
    {
      title: 'UI & Styling',
      icons: ['tailwind', 'windicss', 'sass', 'bootstrap', 'jquery'],
    },
    {
      title: 'Database & Middleware',
      icons: ['mysql', 'mongodb', 'redis', 'sqlite'],
    },
    {
      title: 'System Languages',
      icons: ['cpp', 'c', 'python', 'dart', 'qt'],
    },
    {
      title: 'Dev Environment & Tools',
      icons: ['vscode', 'visualstudio', 'idea', 'git', 'github', 'gitlab', 'stackoverflow', 'md', 'postman', 'windows', 'linux', 'ubuntu'],
    },
  ],
}
