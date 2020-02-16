import {Configuration} from 'webpack'

export default function (config: Configuration, strictExportPresence = false) {
  const allModule: any = config?.module || {}
  return {
    ...allModule,
    strictExportPresence,
  }
}
