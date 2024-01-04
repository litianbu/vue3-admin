if (!/pnpm/.test(process.env.npm_execpath || '')) {
  console.warn(`\u001b[33m请使用pnpm安装依赖 `)
  process.exit(1)
}
