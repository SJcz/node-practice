import _ = require('lodash')
import XLSX = require('node-xlsx')
import { ISheetFormat } from './sheet.format'


/**解析的 sheet 数据结构 */
interface ISheet {
	/**sheet 名字 */
	name: string,
	/**行列数据 */
	data: unknown[]
}

/**
 * excel 解析类, 用于解析excel文件
 * 读取 excel 使用 node-xlsx, 全部读取为字符串, 方便处理
 * !!!!!!!!!该解析器只适用于解析标准的 excel 表格, 不支持单元格合并的表格!!!!!!!!!
 * 使用 exceljs 读取 excel 文件会将 excel 里面的各种格式都解析出来, 耗时长, 内存占据大, 数据结构复杂.
 * 因此不推荐使用 exceljs 解析 excel 文件
 */
class ExcelParser {

	/**
	* 解析 excel 内容为需要的 接送 数组对象, 不验证 json 对象是否满足限定条件, 只保证所有字段存在
	* 上层需要通过 Joi 或者其他形式验证 json 是否符合要求
	* @param filepath 要解析的 excel 文件路径
	* @param SheetFormat 要解析的 excel 对应的说明格式
	* @param headRaw 表头行是第几行, 默认第 0 行, 也就是 excel 第一行
	* @param dataStartRaw 数据行从第几行开始, 默认第 1 行, 也就是 excel 第2行
	*/
	basicParse<T>(filepath: string, SheetFormat: ISheetFormat, headRaw = 0, dataStartRaw = 1): T[] {
		const worksheets: ISheet[] = XLSX.parse(filepath, { cellDates: true })
		const sheet = worksheets.find(sheet => sheet.name.trim() == SheetFormat.title)
		if (!sheet) throw new Error(`${SheetFormat.title} sheet 缺失, 请检查 execl`)

		const sheetHeaderMap = this._getValidSheetHeaderMap(sheet, SheetFormat.needFields, headRaw)

		const missedFields = this._getSheetHeaderMissedFields(sheetHeaderMap, SheetFormat.needFields)
		if (missedFields.length) {
			throw new Error(`${SheetFormat.title} sheet 缺失部分必需表头字段:, ${missedFields.join(',')}`)
		}


		const objectArr = this._parseSheetRowsToObjectArr<T>(sheet, sheetHeaderMap, dataStartRaw)

		const basicDataList: T[] = this._translateValueToString(
			this._replaceKey(objectArr, SheetFormat.fieldNameEnum),
			SheetFormat.mandatoryStrFields || []
		)
		return basicDataList
	}

	/**
	* 获取一个 sheet 有效的表头字段 map
	* @param {ISheet} sheet excel sheet 对象
	* @param {string[]} needFields SheetFormat 中定义的表头字段列表
	* @param headRaw 表头行是第几行, 默认第 0 行, 也就是 excel 第一行
	* @return  key 是列索引 value 是列头名
	*/
	_getValidSheetHeaderMap(sheet: ISheet, needFields: string[], headRaw: number): { [key: string]: string } {
		const sheetHeaderMap = {}
		for (let i = 0; i <= (sheet.data[headRaw] as any).length; i++) {
			const cell = sheet.data[headRaw][i] as string
			if (cell == null || !needFields.includes(cell)) continue
			sheetHeaderMap[i] = cell
		}
		return sheetHeaderMap
	}

	/**
	* 对比标准字段, 获取一个 sheet 缺失的表头字段列表
	* @param {*} sheetHeaderMap excel sheet 中提取的表头 map
	* @param {*} needFields  SheetEntity 中定义的表头字段列表
	* @returns 
	*/
	_getSheetHeaderMissedFields(sheetHeaderMap: { [key: string]: string }, needFields: string[]): string[] {
		const values = Object.values(sheetHeaderMap)
		return _.difference(needFields, values)
	}

	/**
	* 根据 sheet 表头字段, 将 sheet 的第2行开始的数据转化为 json 数组
	* @param {*} sheet excel sheet 对象
	* @param {*} sheetHeaderMap excel sheet 中提取的表头 map
	* @param dataStartRaw 数据行从第几行开始, 默认第 1 行, 也就是 excel 第2行
	*/
	_parseSheetRowsToObjectArr<T>(sheet: ISheet, sheetHeaderMap: { [key: string]: string }, dataStartRaw: number): (T & { row_num: number })[] {
		const objectArr: (T & { row_num: number })[] = []
		for (let i = dataStartRaw; i < sheet.data.length; i++) {
			const obj = {} as (T & { row_num: number })
			for (const key in sheetHeaderMap) {
				const cell = sheet.data[i][Number(key)]
				obj[sheetHeaderMap[key]] = cell
			}
			if (isInvalidJson(obj)) continue // 空行跳过
			obj.row_num = i + 1 // 记录该数据处于 sheet 中第几行
			objectArr.push(obj)
		}
		return objectArr
	}

	/**
	* 将 json 数组中的 中文表头key 替换成变量表示.
	* @param {*} objectArr 
	* @param {*} keyJson 
	*/
	_replaceKey(objectArr, keyJson) {
		const translateJson = {}
		for (const key in keyJson) {
			translateJson[keyJson[key]] = key
		}
		return objectArr.map(object => {
			Object.keys(translateJson).forEach(key => {
				object[translateJson[key]] = object[key]
			})
			return object
		})
	}

	/**
	* 将 json 数组中 部分 非字符串的 值转为 字符串
	* @param {*} objectArr 
	* @param {*} keys 需要转化的 key 列表
	*/
	_translateValueToString(objectArr: any[], keys: string[]): any[] {
		return objectArr.map(object => {
			keys.forEach(key => {
				if (object[key] !== undefined) object[key] = String(object[key])
			})
			return object
		})
	}
}

/**
	* 判断一个 json 是否是无效的, 当所有 value 都是 null 或者 undefined 或者 空字符串时, 属于无效json
	* @param json 
	*/
function isInvalidJson(json: Record<string, unknown>): boolean {
	for (const key in json) {
		if (!_.isNull(json[key]) && !_.isUndefined(json[key]) && json[key] != '') return false
	}
	return true
}

const excelParser = new ExcelParser()

export default excelParser