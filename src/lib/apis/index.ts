import { Apis, Configuration } from './generated'

const api = new Apis(
  new Configuration({
    basePath:
      process.env.NODE_ENV === 'production'
        ? 'https://trap.show/h24s_19_server'
        : 'http://localhost:3000',
  }),
)

export default api
export * from './generated'
