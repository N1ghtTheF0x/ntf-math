import { IToString, isFixedTypeArray, isValidNumber, hasObjectProperty, isValidString, checkValidNumber, NodeJSCustomInspect } from "@ntf/types"
import { ResolveError } from "../common/error"
import { clamp } from "../utils"
import { IToVec2, Vec2Like } from "../vectors/vec2"
import { IToVec3, Vec3Like } from "../vectors/vec3"
import { IToHSL, IToHSLA, HSLLike, HSLALike, HSLA } from "./hsl"
import { numberToRGB, numberToRGBA } from "./utils"

export interface IRGB
{
    red: number
    green: number
    blue: number
}

export interface IToRGB
{
    toRGB(): RGBLike
}

export type RGBArray = [number,number,number]
export type RGBString = `rgb(${number},${number},${number})`
export type RGBLike = IRGB | RGBArray | RGBString | IToRGB
export type RGBArguments = [rgb: RGBLike] | RGBArray

export interface IRBBA extends IRGB
{
    alpha: number
}

export interface IToRGBA
{
    toRGBA(): RGBALike
}

export type RGBAArray = [number,number,number,number]
export type RGBAString = `rgba(${number},${number},${number},${number})`
export type RGBALike = IRBBA | RGBAArray | RGBAString | IToRGBA
export type RGBAArguments = [rgba: RGBALike] | RGBAArray

export type IAnyRGB = IRGB | IRBBA
export type AnyRGBArray = RGBArray | RGBAArray
export type AnyRGBString = RGBString | RGBAString
export type IAnyToRGB = IToRGB | IToRGBA
export type AnyRGBLike = IAnyRGB | AnyRGBArray | AnyRGBString | number | IAnyToRGB
export type AnyRGBArguments = RGBArguments | RGBAArguments

export class RGBA implements IRBBA, IToVec2, IToVec3, IToHSL, IToHSLA, IToString
{
    private _red: number
    public get red(){return this._red}
    public set red(val){this._red = clamp(val,0,1)}
    private _green: number
    public get green(){return this._green}
    public set green(val){this._green = clamp(val,0,1)}
    private _blue: number
    public get blue(){return this._blue}
    public set blue(val){this._blue = clamp(val,0,1)}
    private _alpha: number
    public get alpha(){return this._alpha}
    public set alpha(val){this._alpha = clamp(val,0,1)}
    public static resolve(a: unknown): RGBA
    {
        const value = this.cast(a)
        if(typeof value != "undefined")
            return value
        throw new ResolveError("RGBAColor",a)
    }
    public static resolveArgs(args: AnyRGBArguments): RGBA
    {
        if(isFixedTypeArray(args,isValidNumber,3) || isFixedTypeArray(args,isValidNumber,4))
            return new this(args[0],args[1],args[2],args[3])
        return this.resolve(args[0])
    }
    public static cast(a: unknown): RGBA | undefined
    {
        if(a == null || typeof a == "undefined")
            return undefined
        if(isFixedTypeArray(a,isValidNumber,3) || isFixedTypeArray(a,isValidNumber,4))
            return new this(a[0],a[1],a[2],a[3])
        if(hasObjectProperty(a,"toRGB","function"))
            return this.cast(a.toRGB())
        if(hasObjectProperty(a,"toRGBA","function"))
            return this.cast(a.toRGBA())
        if(hasObjectProperty(a,"red","number") && hasObjectProperty(a,"green","number") && hasObjectProperty(a,"blue","number"))
            return new this(a.red,a.green,a.blue,hasObjectProperty(a,"alpha","number") ? a.alpha : undefined)
        if(isValidNumber(a))
        {
            const hex = a.toString(16)
            const convert = hex.length <= 6 ? numberToRGB : numberToRGBA
            return this.cast(convert(a))
        }
        if(isValidString(a))
        {
            if(a.startsWith("rgb"))
            {
                const hasAlpha = a.startsWith("rgba")
                const offset = hasAlpha ? 5 : 4
                const parts = a.substring(offset,a.indexOf(")",offset)).split(",")
                if(isFixedTypeArray(parts,isValidString,hasAlpha ? 4 : 3))
                    return this.cast(parts.map((v) => parseInt(v) / 0xff))
            }
        }
        return undefined
    }
    public static is(a: unknown): a is AnyRGBLike
    {
        return typeof this.cast(a) != "undefined"
    }
    public constructor(red: number,green: number,blue: number,alpha: number = 1)
    {
        checkValidNumber(red)
        checkValidNumber(green)
        checkValidNumber(blue)
        checkValidNumber(alpha)
        this._red = clamp(red,0,1)
        this._green = clamp(green,0,1)
        this._blue = clamp(blue,0,1)
        this._alpha = clamp(alpha,0,1)
    }
    public toArray(withAlpha: boolean = this._alpha !== 1): AnyRGBArray
    {
        return withAlpha ? [this.red,this.green,this.blue,this.alpha] : [this.red,this.green,this.blue] 
    }
    public toJSON(withAlpha: boolean = this._alpha !== 1): IAnyRGB
    {
        return withAlpha ? {
            red: this.red,green: this.green,blue: this.blue,alpha: this.alpha
        } : {
            red: this.red,green: this.green,blue: this.blue
        }
    }
    public toString(withAlpha: boolean = this._alpha !== 1): AnyRGBString
    {
        return withAlpha ? `rgba(${clamp(this.red * 0xff | 0,0,0xff)},${clamp(this.green * 0xff | 0,0,0xff)},${clamp(this.blue * 0xff | 0,0,0xff)},${this.alpha})` : `rgb(${clamp(this.red * 0xff | 0,0,0xff)},${clamp(this.green * 0xff | 0,0,0xff)},${clamp(this.blue * 0xff | 0,0,0xff)})`
    }
    public get [Symbol.toStringTag](): string
    {
        return "RGBA"
    }
    public [NodeJSCustomInspect](): string
    {
        return `RGBA <${this.toString()}>`
    }
    public toVec2(): Vec2Like
    {
        return [this.red,this.green,this.blue]
    }
    public toVec3(): Vec3Like
    {
        return [this.red,this.green,this.blue,this.alpha]
    }
    public toHSL(withAlpha?: false): HSLLike
    public toHSL(withAlpha?: true): HSLALike
    public toHSL(withAlpha: boolean = this._alpha !== 1): HSLLike | HSLALike
    {
        const red = this.red, green = this.green, blue = this.blue
        const min = Math.min(red,green,blue), max = Math.max(red,green,blue)
        const luminace = (min+max)/2
        if(min == max)
            return new HSLA(0,0,luminace,withAlpha ? this.alpha : undefined)
        const d = max - min
        const saturation = luminace > 0.5 ? d / (2 - max - min) : d / (max + min)
        if(max == red)
            return new HSLA(((green - blue) / d + (green < blue ? 6 : 0))/6,saturation,luminace,withAlpha ? this.alpha : undefined)
        if(max == green)
            return new HSLA(((blue - red) / d + 2)/6,saturation,luminace,withAlpha ? this.alpha : undefined)
        if(max == blue)
            return new HSLA(((red - green) / d + 4)/6,saturation,luminace,withAlpha ? this.alpha : undefined)
        return new HSLA(0,saturation,luminace,withAlpha ? this.alpha : undefined)
    }
    public toHSLA(): HSLALike
    {
        return this.toHSL(true)
    }
    public invert(withAlpha: boolean = this._alpha !== 1): RGBA
    {
        return new RGBA(
            1 - this.red,
            1 - this.green,
            1 - this.blue,
            withAlpha ? 1 - this.alpha : this.alpha
        )
    }
}