/**解析excel时, 对 sheet 中字段的说明, 提供用于解析的属性 */
export interface ISheetFormat {
  /**sheet 标题 */
  title: string,
  /**sheet 里面所有的表头枚举*/
  fieldNameEnum: { [ket: string]: string }
  /**需要将 excel 中的值强制需要转化为字符串的key */
  mandatoryStrFields: string[]
  /**必须的表头字段, 如果缺少某个表头字段, 那么就认为 excel sheet 不合格, 解析报错 */
  needFields: string[]
}