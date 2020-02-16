import react from './react'
import reactDom from './reactDom'
import {Configuration} from 'webpack'

export const externals = {
  react,
  reactDom,
}

export default function (config: Partial<Configuration>, external: Record<string, any>) {
  const allExternals: any = config.externals || {}
  return {
    ...config,
    externals: {
      ...allExternals,
      ...external,
    },
  }
}
