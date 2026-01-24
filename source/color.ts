import { HSLA, AnyHSLArray, AnyHSLString, IAnyHSL, IAnyToHSL } from "./color/hsl"
import { RGBA, AnyRGBArray, AnyRGBString, IAnyRGB, IAnyToRGB } from "./color/rgb"
import { HexColor } from "./color/utils"
import { ResolveError } from "./common/error"
import { isValidNumber, isFixedTypeArray } from "@ntf/types"

export type AnyColor = RGBA | HSLA
export type AnyColorArray = AnyRGBArray | AnyHSLArray
export type AnyColorString = AnyRGBString | AnyHSLString
export type IAnyColor = IAnyRGB | IAnyHSL
export type IAnyToColor = IAnyToRGB | IAnyToHSL
export type AnyColorLike = AnyColorArray | AnyColorString | IAnyColor | number | HexColor
export type AnyColorArguments = AnyColorArray | [color: AnyColorLike]

export namespace AnyColor
{
    export function cast(a: unknown,preferHSL: boolean = false): AnyColor | undefined
    {
        const results: Array<AnyColor | undefined> = []
        try
        {
            const rgba = RGBA.resolve(a)
            results.push(rgba)
        }
        catch(e){}
        try
        {
            const hsla = HSLA.resolve(a)
            results.push(hsla)
        }
        catch(e){}
        let offset = preferHSL ? 1 : 0
        const firstItem = results[offset]
        if(firstItem)
            return firstItem
        const secondItem = results[offset+1]
        if(secondItem)
            return secondItem
        return undefined
    }
    export function resolve(a: unknown,preferHSL: boolean = false): AnyColor
    {
        const value = cast(a,preferHSL)
        if(typeof value != "undefined")
            return value
        throw new ResolveError("Color",a)
    }
    export function resolveArgs(args: AnyColorArguments,preferHSL: boolean = false): AnyColor
    {
        if(isFixedTypeArray(args,isValidNumber,3) || isFixedTypeArray(args,isValidNumber,4))
            return resolve(args,preferHSL)
        return resolve(args[0],preferHSL)
    }
}