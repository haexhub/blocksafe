import { create } from 'ipfs-core'

export default (context: any, inject: any) => {
    inject('ipfs', (options: any) => create(options))
}