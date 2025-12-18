import { IToString } from "@ntf/types"

export interface IGeometryObject extends IToString
{
    readonly area: number
    readonly perimeter: number
}