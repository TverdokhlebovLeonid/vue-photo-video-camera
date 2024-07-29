export const base64Blob = (arr: string) => {
  const base64 = arr.split(',')[1]
  const type = arr.split(';')[0].split(':')[1]
  const decodedData = window.atob(base64)
  const byteNumbers = new Array(decodedData.length)
  for (let i = 0; i < decodedData.length; i++) {
    byteNumbers[i] = decodedData.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  return new Blob([byteArray], { type: type })
}
