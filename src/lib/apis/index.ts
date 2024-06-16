import { Apis, Configuration } from './generated'

const api = new Apis(
  new Configuration({
    basePath:
      process.env.NODE_ENV === 'production'
        ? 'http://h24s-19.trap.show/server'
        : 'http://localhost:3000',
  }),
)

export default api
export * from './generated'
