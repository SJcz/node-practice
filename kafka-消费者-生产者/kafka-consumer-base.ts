import Kafka = require('node-rdkafka')
import { logger } from 'log4js' // 这里切换成任何一个日志框架都可以
import { Assignment } from 'node-rdkafka'

export abstract class ConsumerBase {
	/**kafka 消费者 */
	consumer: Kafka.KafkaConsumer
	/**消费者 group */
	group_id: string
	/**消费的 topic */
	topic: string
	/**消费者的 名字, 默认是类名 */
	name: string
	/**拉取 kafka 消息的最大线程数量, 也就是一次拉取消息的数量 */
	max_thread_poll_size: number

	constructor(topic: string, group_id: string, max_thread_poll_size = 10) {
		this.name = this.constructor.name
		this.topic = topic
		this.group_id = group_id
		this.max_thread_poll_size = max_thread_poll_size
	}

	start() {
		logger.info(`${this.name}: 开始启动, 
            kafka_host = ${process.env.kafka_host} group = ${this.group_id}`)
		this.consumer = new Kafka.KafkaConsumer({
			'metadata.broker.list': process.env.kafka_host,
			'group.id': this.group_id,
			'enable.auto.offset.store': false,
			'offset_commit_cb': this.offset_commit_cb.bind(this),
			'rebalance_cb': this.rebalance_cb.bind(this),
			'enable.auto.commit': true
		}, {
			'auto.offset.reset': 'earliest',
		})
		this.consumer.connect()
		logger.info(`${this.name}: 连接 kafka 集群...`)
		this.consumer
			.on('ready', () => {
				logger.info(`${this.name}: 成功连接到 kafka 集群, 接收 topic = ${this.topic}`)
				this.consumer.subscribe([this.topic])

				// Consume from the librdtesting-01 topic. This is what determines
				// the mode we are running in. By not specifying a callback (or specifying
				// only a callback) we get messages as soon as they are available.
				this.poll()
			})
		// .on('data', this.onDataCallback.bind(this))
		this.consumer
			.on('disconnected', (metrics: Kafka.ClientMetrics) => {
				logger.error(`${this.name}: 消费者失去连接 connectionOpened=${metrics.connectionOpened}`)
			})
	}

	offset_commit_cb() {
		// err: Error, topicPartitions: Assignment[]
		// logger.info(`${this.name}: topic=${this.topic} 触发 offset_commit_cb`)
		// if (err) {
		//  logger.error(`${this.name}-offset_commit_cb: topic=${this.topic}  offset 提交失败 `)
		//  logger.error(err.stack)
		// }
		// if (topicPartitions && topicPartitions.length) {
		//  logger.info(`${this.name}-offset_commit_cb: topic=${this.topic} 当前各分区 offset 信息`)
		//  logger.info(JSON.stringify(topicPartitions))
		// }
	}

	rebalance_cb(err: Error & { code: number, errno: number, origin: string }, assignment: Assignment[]) {
		logger.info(`${this.name}: topic = ${this.topic} 触发 rebalance_cb`)
		logger.info(`${this.name}-rebalance_cb 信息: topic =${this.topic} 
        errCode=${err.code} errno=${err.errno} origin=${err.origin}, message=${err.message}`)

		if (err.code !== Kafka.CODES.ERRORS.ERR__ASSIGN_PARTITIONS
			&& err.code !== Kafka.CODES.ERRORS.ERR__REVOKE_PARTITIONS) {
			logger.error(`${this.name}-rebalance_cb: topic =${this.topic} 遇到非正常 rebalance_cb 错误`)
		}
		switch (err.code) {
			case Kafka.CODES.ERRORS.ERR__ASSIGN_PARTITIONS:
				logger.info(`${this.name}: topic =${this.topic} 分配 partition: 
                    assignment=${JSON.stringify(assignment)}`)
				return this.consumer.assign(assignment)
			case Kafka.CODES.ERRORS.ERR__REVOKE_PARTITIONS:
				logger.info(`${this.name}: topic =${this.topic} 取消 partition: 
                    assignment=${JSON.stringify(assignment)}`)
				return this.consumer.unassign()
		}
	}

	/**kafaka 消息处理总函数, 该函数无论同步异步, 不影响 kafka offset 的自动提交, 因此可能在该函数还未执行完时, 就触发 offset_commit_cb */
	async onDataCallback(err: Kafka.LibrdKafkaError, messages: Kafka.Message[]) {
		if (err) {
			logger.error(`${this.name}-onDataCallback: 接收 kafka 消息发生异常: message=${err.message}`)
			this.poll()
			return
		}

		if (!messages || !messages.length) {
			this.poll()
			return
		}
		for (let i = 0; i < messages.length; i++) {
			const message = messages[i]
			try {
				logger.info(`${this.name}-onDataCallback: 处理 kafka message, 
                    topic=${message.topic} size=${message.size} offset=${message.offset} partition=${message.partition}`)
				console.time('consumerMessage')
				await this.consumerMessage(message)
				console.timeEnd('consumerMessage')
				// logger.info(`${this.name}-onDataCallback: 处理完成`)
			} catch (e) {
				logger.error(`${this.name}-onDataCallback: 处理 kafka message 发生不可预知异常: 
                    message=${e.message}, offset=${message.offset} partition=${message.partition}`)
				logger.error(e.stack)
			}
		}
		this.consumer.offsetsStore(messages.map(item => {
			return {
				offset: item.offset + 1,
				partition: item.partition,
				topic: item.topic
			}
		})) // 提交
		this.poll()
	}

	/**子类需要实现的具体消费函数 */
	abstract consumerMessage(message: Kafka.Message)

	poll() {
		this.consumer.consume(this.max_thread_poll_size, this.onDataCallback.bind(this))
	}
}