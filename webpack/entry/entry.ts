import {Configuration} from 'webpack'

export default function (config: Partial<Configuration>, filename: string) {
  return {
    ...config,
    entry: filename,
  }
}
