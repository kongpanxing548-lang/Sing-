const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, '') ?? ''

export function publicPath(path: string) {
  if (!path || /^(https?:|data:|blob:)/.test(path)) return path
  if (!basePath || path.startsWith(`${basePath}/`)) return path
  return path.startsWith('/') ? `${basePath}${path}` : `${basePath}/${path}`
}
