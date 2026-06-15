import request from './request'

export function getTaskList(params) {
  return request.get('/tasks', { params })
}

export function getTaskDetail(id) {
  return request.get(`/tasks/${id}`)
}

export function createTask(data) {
  return request.post('/tasks', data)
}

export function retryTask(id) {
  return request.post(`/tasks/${id}/retry`)
}
