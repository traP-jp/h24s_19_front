import { Apis, Configuration } from './generated'

const api = new Apis(new Configuration())

export default api
export * from './generated'
