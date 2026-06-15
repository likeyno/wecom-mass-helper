import request from './request'

export function getTemplateList(params) {
  return request.get('/templates', { params })
}

export function getTemplateById(id) {
  return request.get(`/templates/${id}`)
}

export function createTemplate(data) {
  return request.post('/templates', data)
}

export function updateTemplate(id, data) {
  return request.put(`/templates/${id}`, data)
}

export function deleteTemplate(id) {
  return request.delete(`/templates/${id}`)
}
