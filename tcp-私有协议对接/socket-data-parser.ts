import { Socket } from 'net'

export class SocketDataParser {
	cacheData: Buffer
	constructor() {
		this.cacheData = Buffer.alloc(0)
	}
	decodeScoketData(socket: Socket, data: Buffer) {
		if (this.cacheData.length > 0) {
			data = Buffer.concat([this.cacheData, data])
		}
		if (data.length < 7) {
			this.cacheData = data
			return
		}

		const lengthH = data.readUInt8(3)
		const lengthL = data.readUInt8(4)

		const payloadLength = lengthH * 256 + lengthL
		if (data.length < 7 + payloadLength) {
			this.cacheData = data
			return
		}
		const payloadBuffer = data.subarray(7, 7 + payloadLength)
		socket.emit('message', parsePayloadData(payloadBuffer))

		this.cacheData = Buffer.alloc(0)

		if (data.length - 7 - payloadLength > 0) {
			this.decodeScoketData(socket, data.subarray(7 + payloadLength))
		}
	}

	encodeSocketData(frame: string | object) {
		if (typeof frame !== 'string') frame = JSON.stringify(frame)
		const headerBuffer = Buffer.alloc(7)
		headerBuffer.writeUInt8(parseInt('0x01', 16))
		headerBuffer.writeUInt8(parseInt('0x01', 16), 1)
		headerBuffer.writeUInt8(parseInt('0x01', 16), 2)
		const payloadLen = Buffer.from(frame).length + 1
		headerBuffer.writeUint16BE(payloadLen, 3)
		headerBuffer.writeUInt8(parseInt('0x01', 16), 5)
		headerBuffer.writeUInt8(parseInt('0x01', 16), 6)
		return Buffer.concat([headerBuffer, Buffer.from(frame), Buffer.alloc(1).fill(0)])
	}
}

function parsePayloadData(payload: Buffer) {
	// 开始处理一个完整的包
}