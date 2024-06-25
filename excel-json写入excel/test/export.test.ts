import path from 'path'
import excelExport from '../excel-export'
import { 学生家长电话表_表头字段 } from './student.column'
import fs from 'fs-extra'
const jsonData = require('./json-data.json')

describe('测试 json 数据写入到 excel', () => {
	const filePath = path.join('.', '学生家长电话表.xlsx')
	afterEach(async () => {
		await fs.remove(filePath)
	})
	it('普通单sheet写入', async () => {
		await excelExport.writeExcel(jsonData, 学生家长电话表_表头字段, '.', '学生家长电话表.xlsx', 'A小学')
		const fileExist = fs.existsSync(filePath)
		expect(fileExist).toBe(true)
	})

	it('多sheet写入', async () => {
		await excelExport.writeExcelMulSheet([jsonData, jsonData], [学生家长电话表_表头字段, 学生家长电话表_表头字段], '.', '学生家长电话表.xlsx', ['A小学', 'B小学'])
		const fileExist = fs.existsSync(filePath)
		expect(fileExist).toBe(true)
	})

	it('合并sheet写入', async () => {
		await excelExport.writeExcelWithMergeCell(jsonData, 学生家长电话表_表头字段, '.', '学生家长电话表.xlsx', 'A小学', 1, [{
			mergeCellRange: ['A1', 'B1'],
			cellTitle: 'A小学学生电话'
		}])
		const fileExist = fs.existsSync(filePath)
		expect(fileExist).toBe(true)
	})
})
