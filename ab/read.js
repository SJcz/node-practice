const fs = require('fs')

/**
 * 将某个文件读取为 base 64 字符串
 * @param {*} path 
 */
async function readFile2Base64(path) {
	return new Promise((resolve, reject) => {
		fs.exists(path, exists => {
			if (!exists) return resolve('')
			fs.readFile(path, (err, data) => {
				if (err) return reject(err)
				return resolve(data.toString('base64'))
			})
		})
	})
}


readFile2Base64(process.cwd() + '/ab/word.jpg').then(str => {
	console.log(typeof str)
	const json = {
		category: 'word',
		base64_list: []
	}
	for (let i = 0; i < 10; i++) {
		json.base64_list.push(str)
	}
	fs.writeFileSync('./ab/上传的base64单字.json', JSON.stringify(json))

	const param = require('./上传的base64单字.json')
	console.log(typeof param)
}).catch(console.log)