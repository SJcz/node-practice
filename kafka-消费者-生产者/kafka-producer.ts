import Kafka = require('node-rdkafka')
import { logger } from 'log4js' //  这里切换成任何一个日志框架都可以

const EVALUATION_TOPIC = '生产者要发送的消息的topic'

/** kafka 消息体 */
type IKafkaMessage_TestData = {
	id: string
	data: string
}

export class WordResultProducer {
	producer: Kafka.HighLevelProducer
	constructor() {
		this.producer = new Kafka.HighLevelProducer({
			'metadata.broker.list': process.env.kafka_host,
			'dr_cb': true, // Specifies that we want a delivery-report event to be generated,
			'client.id': 'admin_client_localhost',
			'retry.backoff.ms': 200, // 重试间隔
			'message.send.max.retries': 10, // 重试次数
			'socket.keepalive.enable': true, // TCP 长连接
			'queue.buffering.max.messages': 1000, // 生产者队列允许的最大消息数
			'queue.buffering.max.ms': 10, // 类似于 linger.ms, 发送 batch 消息前的超时时间 跟 TCP 一样
			'batch.num.messages': 1000, // 一个 batch 中消息的最大数量
		})

		// Any errors we encounter, including connection errors
		this.producer.on('event.error', function (error: any) {
			console.error('Error from producer')
			console.error(error)
			process.exit(-1)
		})

		this.producer.on('ready', () => {
			logger.info('!!!!!!!!!kafka 客户端连接成功!!!!!!!!')
		})

		// We must either call .poll() manually after sending messages
		// or set the producer to poll on an interval (.setPollInterval).
		// Without this, we do not get delivery events and the queue
		// will eventually fill up.
		this.producer.setPollInterval(100)
		this.producer.on('delivery-report', function (error: any) {
			// Report of delivery statistics here:
			if (error) return logger.error(error)
		})

		this.producer.connect()
		logger.info(`生产者连接 kafka 集群...${process.env.kafka_host}`)
	}

	produceWordResultKafkaMessage(kafkaMessage: IKafkaMessage_TestData) {
		if (!this.producer.isConnected()) throw new Error('kafka 客户端还未连接')
		this.producer.produce(
			// Topic to send the message to
			EVALUATION_TOPIC,
			// optionally we can manually specify a partition for the message
			// this defaults to -1 - which will use librdkafka's default partitioner (consistent random for keyed messages, random for unkeyed messages)
			null,
			// Message to send. Must be a buffer
			Buffer.from(JSON.stringify(kafkaMessage)),
			// for keyed messages, we also specify the key - note that this field is optional
			kafkaMessage.id,
			// you can send a timestamp here. If your broker version supports it,
			// it will get added. Otherwise, we default to 0
			Date.now(),
			// you can send an opaque token here, which gets passed along
			// to your delivery reports
			(err, offset) => {
				// The offset if our acknowledgement level allows us to receive delivery offsets
				if (err) return logger.error(err)
				logger.debug(`produce offset ${offset}`)
			}
		)
	}
}