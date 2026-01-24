import { IToString, isFixedTypeArray, isValidNumber, hasTypedProperty, isValidString, checkValidNumber, NodeJSCustomInspect } from "@ntf/types"
import { ResolveError } from "../common/error"
import { clamp } from "../utils"
import { IToVec2, Vec2Like } from "../vectors/vec2"
import { IToVec3, Vec3Like } from "../vectors/vec3"
import { IToRGB, IToRGBA, RGBALike, RGBLike, RGBA } from "./rgb"
import { hasHexNumberAlpha, HexColor, hexNumberToRGB, hexNumberToRGBA, isHexNumber, numberToRGB, numberToRGBA } from "./utils"

export interface IHSL
{
    hue: number
    saturation: number
    luminace: number
}

export interface IToHSL
{
    toHSL(): HSLLike
}

export type HSLArray = [number,number,number]
export type HSLString = `hsl(${number},${number},${number})`
export type HSLLike = IHSL | HSLArray | HSLString | IToHSL | HexColor
export type HSLArguments = HSLArray | [hsl: HSLLike]

export interface IHSLA extends IHSL
{
    alpha: number
}

export interface IToHSLA
{
    toHSLA(): HSLALike
}

export type HSLAArray = [number,number,number,number]
export type HSLAString = `hsla(${number},${number},${number},${number})`
export type HSLALike = IHSLA | HSLAArray | HSLAString | IToHSLA
export type HSLAArguments = HSLAArray | [hsla: HSLALike]

export type IAnyHSL = IHSL | IHSLA
export type AnyHSLArray = HSLArray | HSLAArray
export type AnyHSLString = HSLString | HSLAString
export type IAnyToHSL = IToHSL | IToHSLA
export type AnyHSLLike = IAnyHSL | AnyHSLArray | AnyHSLString | number | IAnyToHSL
export type AnyHSLArguments = HSLArguments | HSLAArguments

export class HSLA implements IHSLA, IToRGB, IToRGBA, IToVec2, IToVec3, IToString
{
    private _hue: number
    public get hue(){return this._hue}
    public set hue(val){this._hue = clamp(val,0,1)}
    private _saturation: number
    public get saturation(){return this._saturation}
    public set saturation(val){this._saturation = clamp(val,0,1)}
    private _luminace: number
    public get luminace(){return this._luminace}
    public set luminace(val){this._luminace = clamp(val,0,1)}
    private _alpha: number
    public get alpha(){return this._alpha}
    public set alpha(val){this._alpha = clamp(val,0,1)}
    public static resolve(a: unknown): HSLA
    {
        const value = this.cast(a)
        if(typeof value != "undefined")
            return value
        throw new ResolveError("HSLColor",a)
    }
    public static resolveArgs(args: AnyHSLArguments): HSLA
    {
        if(isFixedTypeArray(args,isValidNumber,3) || isFixedTypeArray(args,isValidNumber,4))
            return new this(args[0],args[1],args[2],args[3])
        return this.resolve(args[0])
    }
    public static cast(a: unknown): HSLA | undefined
    {
        if(a == null || typeof a == "undefined")
            return undefined
        if(isFixedTypeArray(a,isValidNumber,3) || isFixedTypeArray(a,isValidNumber,4))
            return new this(a[0]!,a[1]!,a[2]!,a[3]!)
        if(hasTypedProperty(a,"toHSL","function"))
            return this.cast(a.toHSL())
        if(hasTypedProperty(a,"toHSLA","function"))
            return this.cast(a.toHSLA())
        if(hasTypedProperty(a,"hue","number") && hasTypedProperty(a,"saturation","number") && hasTypedProperty(a,"luminace","number"))
            return new this(a.hue,a.saturation,a.luminace,hasTypedProperty(a,"alpha","number") ? a.alpha : undefined)
        if(isValidNumber(a))
        {
            const hex = a.toString(16)
            const convert = hex.length <= 6 ? numberToRGB : numberToRGBA
            return this.cast(convert(a))
        }
        if(isValidString(a))
        {
            if(a.startsWith("hsl"))
            {
                const hasAlpha = a.startsWith("hsla")
                const offset = hasAlpha ? 5 : 4
                const parts = a.substring(offset,a.indexOf(")",offset)).split(",")
                if(isFixedTypeArray(parts,isValidString,hasAlpha ? 4 : 3))
                    return this.cast(parts.map((v) => parseInt(v) / 0xff))
            }
            if(isHexNumber(a))
            {
                const convert = hasHexNumberAlpha(a) ? hexNumberToRGBA : hexNumberToRGB
                return this.cast(convert(a))
            }
        }
        return undefined
    }
    public static is(a: unknown): a is AnyHSLLike
    {
        return typeof this.cast(a) != "undefined"
    }
    public constructor(hue: number,saturation: number,luminace: number,alpha: number = 1)
    {
        checkValidNumber(hue)
        checkValidNumber(saturation)
        checkValidNumber(luminace)
        checkValidNumber(alpha)
        this._hue = clamp(hue,0,1)
        this._saturation = clamp(saturation,0,1)
        this._luminace = clamp(luminace,0,1)
        this._alpha = clamp(alpha,0,1)
    }
    public toArray(withAlpha = this._alpha !== 1): AnyHSLArray
    {
        return withAlpha ? [this.hue,this.saturation,this.luminace,this.alpha] : [this.hue,this.saturation,this.luminace]
    }
    public toJSON(withAlpha = this._alpha !== 1): IAnyHSL
    {
        return withAlpha ? {
            hue: this.hue,saturation: this.saturation,luminace: this.luminace,alpha: this.alpha
        } : {
            hue: this.hue,saturation: this.saturation,luminace: this.luminace
        }
    }
    public toString(withAlpha = this._alpha !== 1): AnyHSLString
    {
        return withAlpha ? `hsla(${clamp(this.hue * 0xff | 0,0,0xff)},${clamp(this.saturation * 0xff | 0,0,0xff)},${clamp(this.luminace * 0xff | 0,0,0xff)},${this.alpha})` : `hsl(${clamp(this.hue * 0xff | 0,0,0xff)},${clamp(this.saturation * 0xff | 0,0,0xff)},${clamp(this.luminace * 0xff | 0,0,0xff)})`
    }
    public get [Symbol.toStringTag](): string
    {
        return "HSLA"
    }
    public [NodeJSCustomInspect](): string
    {
        return `HSLA <${this.toString()}>`
    }
    public toRGB(withAlpha?: true): RGBALike
    public toRGB(withAlpha?: false): RGBLike
    public toRGB(withAlpha: boolean = this._alpha !== 1): RGBLike | RGBALike
    {
        if(this.saturation == 0)
            return new RGBA(this.luminace * 0xff,this.luminace * 0xff,this.luminace * 0xff,withAlpha ? this.alpha : undefined)
        const q = this.luminace < 0.5 ? this.luminace * (1 + this.saturation) : this.luminace + this.saturation - this.luminace * this.saturation
        const p = 2 * this.luminace - q
        function __hue_2_rgb__(t: number): number
        {
            let _t = t
            if(_t < 0)
                _t++
            if(_t > 1)
                _t--
            if(_t < 1./6)
                return p + (q - p) * 6 * _t
            if(_t < 1./2)
                return q
            if(_t < 2./3)
                return p + (q - p) * (2./3 - _t) * 6
            return p
        }
        return new RGBA(__hue_2_rgb__(this.hue + 1./3) * 0xff,__hue_2_rgb__(this.hue) * 0xff,__hue_2_rgb__(this.hue - 1./3) * 0xff,withAlpha ? this.alpha : undefined)
    }
    public toRGBA(): RGBALike
    {
        return this.toRGB(true)
    }
    public toVec2(): Vec2Like
    {
        return [this.hue,this.saturation,this.luminace]
    }
    public toVec3(): Vec3Like
    {
        return [this.hue,this.saturation,this.luminace,this.alpha]
    }
    public invert(withAlpha: boolean = this._alpha !== 1): HSLA
    {
        return new HSLA(
            1 - this.hue,
            1 - this.saturation,
            1 - this.luminace,
            withAlpha ? 1 - this.alpha : this.alpha
        )
    }
}