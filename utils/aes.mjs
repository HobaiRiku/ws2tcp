import {createCipheriv, createDecipheriv, randomBytes} from 'crypto'
import { Transform } from 'stream'

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
export const aesDecrypt = (data, key, options) => {
  try {
    // 解码data
    data = Buffer.from(data, 'base64')
    // decrypt data with key
    const iv = data.slice(-16)
    const encrypted = data.slice(0, -16)
    const decipher = createDecipheriv('aes-256-cbc', key, iv)
    const decrypted = decipher.update(encrypted)
    const result = Buffer.concat([decrypted, decipher.final()])
    if(options?.toString === false){
      return result
    }
    return result.toString()
  } catch (err) {
    throw new Error(`aesDecrypt error: ${err.message}`)
  }
}

// 创建streamUp桢,[0x01,0x01,0x01]代表不使用端对端加密，[0x01,0x01,0x02]代表使用端对端加密
export const createStreamUpFrame = (useEncrypt, key) => {
  const frameHeader = Buffer.from([0x01, 0x01, useEncrypt ? 0x02 : 0x01])
  // 桢身体代表将要使用的传输数据aes加密的key和iv
  if(!useEncrypt) {
    return frameHeader
  }
  return Buffer.concat([frameHeader, key])
}

export const parseStreamUpFrame = (frame) => {
  // 校验桢头是否是streamUp桢
  if(frame[0] !== 0x01 || frame[1] !== 0x01) {
    throw new Error('Invalid streamUp frame')
  }
  // 是否使用端对端加密
  const useEncrypt = frame[2] === 0x02
  if(!useEncrypt) {
    return {
      useEncrypt
    } 
  }
  // 解析key和iv
  const key = frame.slice(3, 35)
  return {
    useEncrypt,
    key,
  }
}


export class DebugStream extends Transform {
  constructor(label) {
    super();
    this.label = label;
  }

  _transform(chunk, encoding, callback) {
    console.log(`[${this.label}] Data:`, chunk.toString());
    this.push(chunk);
    callback();
  }
}


// 端对端无感知加密流
export class EncryptStream extends Transform {
  constructor(key) {
    super();
    this.key = key;
    this.algorithm = 'aes-256-cbc';
  }

  _transform(chunk, encoding, callback) {
    let offset = 0;
    const maxChunkSize = 65535 - 16; // 最大数据块大小，减去 IV 的长度

    while (offset < chunk.length) {
      const end = Math.min(offset + maxChunkSize, chunk.length);
      const dataChunk = chunk.slice(offset, end);
      offset = end;

      const iv = randomBytes(16);
      const cipher = createCipheriv(this.algorithm, this.key, iv);
      const encryptedData = Buffer.concat([cipher.update(dataChunk), cipher.final()]);
      const packet = Buffer.concat([iv, encryptedData]);
      const length = Buffer.alloc(2);
      length.writeUInt16BE(packet.length, 0);
      this.push(Buffer.concat([length, packet]));
    }

    callback();
  }
}

// 端对端无感知解密流
export class DecryptStream extends Transform {
  constructor(key) {
    super();
    this.key = key;
    this.algorithm = 'aes-256-cbc';
    this.buffer = Buffer.alloc(0);
  }

  _transform(chunk, encoding, callback) {
    this.buffer = Buffer.concat([this.buffer, chunk]);

    while (this.buffer.length >= 2) {
      const length = this.buffer.readUInt16BE(0);
      if (this.buffer.length >= length + 2) {
        const packet = this.buffer.subarray(2, length + 2);
        this.buffer = this.buffer.subarray(length + 2);

        // Decrypt packet
        const iv = packet.subarray(0, 16);
        const encryptedData = packet.subarray(16);
        const decipher = createDecipheriv(this.algorithm, this.key, iv);
        const decryptedData = Buffer.concat([decipher.update(encryptedData), decipher.final()]);

        this.push(decryptedData);
      } else {
        break;
      }
    }

    callback();
  }
}