import path from 'path'
import excelParser from '../excel-parser'
import StudentSheetFormat from './student.sheet.format'

interface IExcelStudentSheetDataItem {
	student_name: string
	phone: string
	学生姓名: string
	家长电话: string
}

describe('测试 excel 解析器', () => {
	it('解析学生家长电话表', async () => {
		const basicData: IExcelStudentSheetDataItem[] = excelParser.basicParse(path.resolve('./学生家长电话表.xlsx'), StudentSheetFormat)
		expect(basicData.length).toBe(16)
		for (const item of basicData) {
			expect(item).toHaveProperty('student_name', item.学生姓名)
			expect(item).toHaveProperty('phone', item.家长电话)
		}
	})
})
