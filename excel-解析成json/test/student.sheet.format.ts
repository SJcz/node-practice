import { ISheetFormat } from '../sheet.format'

/**导入 excel 表时, 对 sheet 里面字段的说明 */
const StudentSheetFormat: ISheetFormat = {
	title: 'Sheet1',
	fieldNameEnum: {
		student_name: '学生姓名',
		phone: '家长电话',
	},
	/**需要将 excel 中的值强制需要转化为字符串的key */
	mandatoryStrFields: ['student_name', 'phone'],
	needFields: []
}

StudentSheetFormat.needFields = Object.values(StudentSheetFormat.fieldNameEnum)

export default StudentSheetFormat