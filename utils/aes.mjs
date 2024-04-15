import {createCipheriv, createDecipheriv, randomBytes} from 'crypto'

// aes256 加密
export const aesEncrypt = (data, key) => {
  try {
    // encrypt data with key
    const iv = randomBytes(16)
    const cipher = createCipheriv('aes-256-cbc', key, iv)
    const encrypted = cipher.update(data)
    const result = Buffer.concat([encrypted, cipher.final(), iv])
    // 返回base64编码的字符串
    return result.toString('base64')
  } catch (err) {
    throw new Error(`aesEncrypt error: ${err.message}`)
  }
}

// aes25解密
export const aesDecrypt = (data, key) => {
  try {
    // 解码data
    data = Buffer.from(data, 'base64')
    // decrypt data with key
    const iv = data.slice(-16)
    const encrypted = data.slice(0, -16)
    const decipher = createDecipheriv('aes-256-cbc', key, iv)
    const decrypted = decipher.update(encrypted)
    const result = Buffer.concat([decrypted, decipher.final()])
    return result.toString()
  } catch (err) {
    throw new Error(`aesDecrypt error: ${err.message}`)
  }
}
