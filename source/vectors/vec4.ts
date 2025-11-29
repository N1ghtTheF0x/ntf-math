import { IVec3, Vec3 } from "./vec3"

export type IVec4 = IVec3
export type Vec4Array = [number,number,number,number]
export type Vec4String = `${number},${number},${number};${number}`
export type Vec4Like = IVec4 | Vec4Array | Vec4String | number
export type Vec4Arguments = [Vec4Like] | [number,number,number,number]
export const Vec4 = Vec3