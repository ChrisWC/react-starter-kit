import babel from './babel'
import {Configuration} from 'webpack'

export const rules = {
  babel,
}

export default function (config: Partial<Configuration>, rule: Record<string, any>) {
  const allRules: any = config?.module?.rules || []
  return {
    ...config,
    module: {
      rules: [
        ...allRules,
        rule,
      ],
    },
  }
}
