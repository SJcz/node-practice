import fs = require('fs-extra')
import sharp = require('sharp')
import path = require('path')

export const FileBasePath = '/data/download'

export interface IPositionRatio {
	left_ratio: number,
	top_ratio: number,
	width_ratio: number,
	height_ratio: number
}

/**
 * 裁剪图片
 * @param filePath 图片文件绝对路径
 * @param position_ration 要裁剪的图片范围比例
 * @param extra_name 裁剪出的图片后缀名, 可能一张图片有多种裁剪方式
 */
export async function resizeImage(filePath: string, position_ration: IPositionRatio = {
	left_ratio: 0,
	top_ratio: 0,
	height_ratio: 1,
	width_ratio: 1
}, extra_name: string | number) {
	const dirPath = path.join(FileBasePath, 'resize')
	await fs.ensureDir(dirPath)
	const targetFilePath = path.join(dirPath, path.basename(filePath).replace(/\./, `_resize_${extra_name}.`))

	// 对于已经裁剪过的图片, 不用再次裁剪
	if (await fs.pathExists(targetFilePath)) return targetFilePath

	const metadata = await sharp(filePath, { pages: 1 }).metadata()
	const region = getRegionByPositionRatio({
		width: metadata.width,
		height: metadata.height
	}, position_ration)

	await sharp(filePath, { pages: 1 }).extract(region).toFile(targetFilePath)

	return targetFilePath
}

function getRegionByPositionRatio(region: { width: number, height: number }, position_ration: IPositionRatio) {
	return {
		left: Math.round(region.width * position_ration.left_ratio),
		top: Math.round(region.height * position_ration.top_ratio),
		width: Math.round(region.width * position_ration.width_ratio),
		height: Math.round(region.height * position_ration.height_ratio),
	}
}

/**
 * 旋转图片
 * @param filePath 图片文件绝对路径
 * @param rotate 要旋转的度数
 */
export async function rotateImage(filePath: string, rotate: number) {
	const dirPath = path.join(FileBasePath, 'rotate')
	await fs.ensureDir(dirPath)

	const targetFilePath = path.join(dirPath, path.basename(filePath).replace(/\./, '_rotate.'))

	await sharp(filePath, { pages: 1 }).rotate(rotate, {
		background: '#FFF' // 旋转后的图片背景颜色填充
	}).toFile(targetFilePath)

	return targetFilePath
}
