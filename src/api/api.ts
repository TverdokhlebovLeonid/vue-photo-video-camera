import Http from '@/api/http'

export const postSendFotoVideo = async (payload: FormData) => Http.post('/file', payload)
