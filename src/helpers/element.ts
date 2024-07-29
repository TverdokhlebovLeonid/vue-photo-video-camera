import { ElMessage } from 'element-plus'
import type { IShowMessage } from '@/helpers/interfaceHelpers'

export const showMessage = (dataText: string, type = 'success', duration = 2500) => {
  ElMessage({
    showClose: true,
    message: dataText,
    type: type,
    duration: duration,
  } as IShowMessage)
}
