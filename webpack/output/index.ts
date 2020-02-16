import library from './library'
import {Configuration} from 'webpack'

export const outputs = {
  library,
}

export default function (config: Partial<Configuration>, output: Record<string, any>) {
  return {
    ...config,
    ...output,
  }
}
