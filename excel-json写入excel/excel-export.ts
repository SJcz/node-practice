import path = require('path');
import ExcelJS, { Column } from 'exceljs'
import _ from 'lodash'

class ExcelExport {
	/**
	 * 将数据写到 excel, 返回文件路径
	 * @param datas 需要写入的数据源
	 * @param columns 列信息
	 * @param dirPath 写入的目录路径
	 * @param filename 文件名称
	 * @param sheetname excel 里面 sheet 的标题
	 */
	async writeExcel<T>(datas: T[], columns: Partial<Column>[],
		dirPath: string, filename: string, sheetname?: string) {
		const wb = new ExcelJS.Workbook()
		const worksheet = wb.addWorksheet(sheetname || 'sheet1')
		worksheet.columns = columns
		for (const data of datas) {
			const row = {}
			for (const column of worksheet.columns) {
				row[column.key] = data[column.key]
			}
			worksheet.addRow(row)
		}
		const filePath = path.join(dirPath, filename)
		await wb.xlsx.writeFile(filePath)
		return filePath
	}

	/**
	 * 将数据写到 excel 多个sheet, 返回文件路径
	 * @param datas 需要写入的数据源(sheet分组)
	 * @param columns_list 列信息(sheet分组)
	 * @param dirPath 写入的目录路径
	 * @param filename 文件名称
	 * @param sheetnames excel 里面 sheet 的标题数组
	 */
	async writeExcelMulSheet<T>(datas: T[][], columns_list: Partial<Column>[][],
		dirPath: string, filename: string, sheetnames: string[]) {
		const wb = new ExcelJS.Workbook()
		for (let i = 0; i < sheetnames.length; i++) {
			const worksheet = wb.addWorksheet(sheetnames[i] || 'sheet1')
			worksheet.columns = columns_list[i]
			for (const data of datas[i]) {
				const row = {}
				for (const column of worksheet.columns) {
					row[column.key] = data[column.key]
				}
				worksheet.addRow(row)
			}
		}
		const filePath = path.join(dirPath, filename)
		await wb.xlsx.writeFile(filePath)
		return filePath
	}

	/**
	 * 将数据写到 excel, 存在merge表格操作, 返回文件路径
	 * @param datas 需要写入的数据源
	 * @param columns 列信息
	 * @param dirPath 写入的目录路径
		 * @param filename 文件名称
	 * @param sheetname excel 里面 sheet 的标题
		 * @param row 第几行开始展示表头
		 * @param mergeParams 要合并的单元格列表
		 *  mergeCellRange 要合并的单元格范围 形如 [A1,F1]
		 *  cellTitle 合并后的单元格标题
	 */
	async writeExcelWithMergeCell<T>(datas: T[], columns: Partial<Column>[],
		dirPath: string, filename: string, sheetname: string, row: number,
		mergeParams: { mergeCellRange: string[], cellTitle: string }[] = []) {
		const wb = new ExcelJS.Workbook()
		const worksheet = wb.addWorksheet(sheetname || 'sheet1')
		for (const { mergeCellRange, cellTitle } of mergeParams) {
			worksheet.mergeCells(mergeCellRange[0], mergeCellRange[1])
			worksheet.getCell(mergeCellRange[0]).value = cellTitle
		}
		worksheet.getRow(row).values = columns.map(item => item.header as string) // 表头值直接占据一行.
		worksheet.columns = columns.map(item => _.omit(item, 'header')) // 删除 header, 避免表头占据一行
		for (const data of datas) {
			const row = {}
			for (const column of worksheet.columns) {
				row[column.key] = data[column.key]
			}
			worksheet.addRow(row)
		}
		const filePath = path.join(dirPath, filename)
		await wb.xlsx.writeFile(filePath)
		return filePath
	}
}

const excelExport = new ExcelExport()

export default excelExport