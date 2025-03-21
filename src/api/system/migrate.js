import request from '@/utils/request'

const api_name = '/admin/system/dbconnect'

export default {
  migrate(migrateVo) {
    return request({
      url: `${api_name}/migrate`,
      method: 'post',
      data: migrateVo
    })
  }
}