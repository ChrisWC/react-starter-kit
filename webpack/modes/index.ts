import production from './production'
import {Configuration} from 'webpack'

export const modes = {
  production,
}

export default function (config: Partial<Configuration>, mode: Record<string, any>) {
  return {
    ...config,
    ...mode,
  }
}
