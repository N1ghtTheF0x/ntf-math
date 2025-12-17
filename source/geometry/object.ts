import { IToString } from "../common/string"

export interface IGeometryObject extends IToString
{
    readonly area: number
    readonly perimeter: number
}