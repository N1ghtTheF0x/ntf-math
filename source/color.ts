import { ResolveError } from "./common/error"
import { IToString } from "./common/string"
import { FixedArray, HexLike, NodeJSCustomInspect, checkHex, checkNumber, checkNumberArray, checkString, checkStringArray, getHexValue, hasProperty } from "./common/types"
import { clamp } from "./utils"
import { IToVec2, Vec2Like } from "./vectors/vec2"
import { IToVec3, Vec3Like } from "./vectors/vec3"

function __hex_to_array__(hex: HexLike): FixedArray<number,4> | undefined
{
    if(!checkHex(hex))
        return undefined
    const part = getHexValue(hex)
    const red = parseInt(part.substring(0,2),16)/0xff
    const green = parseInt(part.substring(2,4),16)/0xff
    const blue = parseInt(part.substring(4,6),16)/0xff
    const alpha = part.length == 8 ? parseInt(hex.substring(6,8),16)/0xff : 1
    return [red,green,blue,alpha]
}

function __number_to_rgb__(number: number): FixedArray<number,3>
{
    const blue = number & 0xff
    const green = (number & 0xff00) >>> 8
    const red = (number & 0xff0000) >>> 16
    return [red/0xff,green/0xff,blue/0xff]
}

function __number_to_rgba__(number: number): FixedArray<number,4>
{
    const alpha = number & 0xff
    const blue = (number & 0xff00) >>> 8
    const green = (number & 0xff0000) >>> 16
    const red = (number & 0xff000000) >>> 24
    return [red/0xff,green/0xff,blue/0xff,alpha/0xff]
}

const __to_byte__ = (scale: number) => clamp(scale * 0xff | 0,0,0xff)

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
export type AnyRGBLike = IAnyRGB | AnyRGBArray | AnyRGBString | HexLike | number | IAnyToRGB
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
        if(checkNumberArray(args,3) || checkNumberArray(args,4))
            return new this(args[0],args[1],args[2],args[3])
        return this.resolve(args[0])
    }
    public static cast(a: unknown): RGBA | undefined
    {
        if(a == null || typeof a == "undefined")
            return undefined
        if(checkNumberArray(a,3) || checkNumberArray(a,4))
            return new this(a[0],a[1],a[2],a[3])
        if(hasProperty(a,"toRGB","function"))
            return this.cast(a.toRGB())
        if(hasProperty(a,"toRGBA","function"))
            return this.cast(a.toRGBA())
        if(hasProperty(a,"red","number") && hasProperty(a,"green","number") && hasProperty(a,"blue","number"))
            return new this(a.red,a.green,a.blue,hasProperty(a,"alpha","number") ? a.alpha : undefined)
        if(checkNumber(a))
        {
            const hex = a.toString(16)
            const convert = hex.length <= 6 ? __number_to_rgb__ : __number_to_rgba__
            return this.cast(convert(a))
        }
        if(checkString(a))
        {
            if(a.startsWith("rgb"))
            {
                const hasAlpha = a.startsWith("rgba")
                const offset = hasAlpha ? 5 : 4
                const parts = a.substring(offset,a.indexOf(")",offset)).split(",")
                if(checkStringArray(parts,hasAlpha ? 4 : 3))
                    return this.cast(parts.map((v) => parseInt(v) / 0xff))
            }
            return this.cast(__hex_to_array__(a))
        }
        return undefined
    }
    public static is(a: unknown): a is AnyRGBLike
    {
        return typeof this.cast(a) != "undefined"
    }
    public constructor(red: number,green: number,blue: number,alpha: number = 1)
    {
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
        return withAlpha ? `rgba(${__to_byte__(this.red)},${__to_byte__(this.green)},${__to_byte__(this.blue)},${this.alpha})` : `rgb(${__to_byte__(this.red)},${__to_byte__(this.green)},${__to_byte__(this.blue)})`
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
export type HSLLike = IHSL | HSLArray | HSLString | IToHSL
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
export type AnyHSLLike = IAnyHSL | AnyHSLArray | AnyHSLString | HexLike | number | IAnyToHSL
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
        if(checkNumberArray(args,3) || checkNumberArray(args,4))
            return new this(args[0],args[1],args[2],args[3])
        return this.resolve(args[0])
    }
    public static cast(a: unknown): HSLA | undefined
    {
        if(a == null || typeof a == "undefined")
            return undefined
        if(checkNumberArray(a,3) || checkNumberArray(a,4))
            return new this(a[0],a[1],a[2],a[3])
        if(hasProperty(a,"toHSL","function"))
            return this.cast(a.toHSL())
        if(hasProperty(a,"toHSLA","function"))
            return this.cast(a.toHSLA())
        if(hasProperty(a,"hue","number") && hasProperty(a,"saturation","number") && hasProperty(a,"luminace","number"))
            return new this(a.hue,a.saturation,a.luminace,hasProperty(a,"alpha","number") ? a.alpha : undefined)
        if(checkNumber(a))
        {
            const hex = a.toString(16)
            const convert = hex.length <= 6 ? __number_to_rgb__ : __number_to_rgba__
            return this.cast(convert(a))
        }
        if(checkString(a))
        {
            if(a.startsWith("hsl"))
            {
                const hasAlpha = a.startsWith("hsla")
                const offset = hasAlpha ? 5 : 4
                const parts = a.substring(offset,a.indexOf(")",offset)).split(",")
                if(checkStringArray(parts,hasAlpha ? 4 : 3))
                    return this.cast(parts.map((v) => parseInt(v) / 0xff))
            }
            return this.cast(__hex_to_array__(a))
        }
        return undefined
    }
    public static is(a: unknown): a is AnyHSLLike
    {
        return typeof this.cast(a) != "undefined"
    }
    public constructor(hue: number,saturation: number,luminace: number,alpha: number = 1)
    {
        if(!checkNumber(hue))
            throw new TypeError("expected number for hue")
        if(!checkNumber(saturation))
            throw new TypeError("expected number for saturation")
        if(!checkNumber(luminace))
            throw new TypeError("expected number for luminace")
        if(!checkNumber(alpha))
            throw new TypeError("expected number for alpha")
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
        return withAlpha ? `hsla(${__to_byte__(this.hue)},${__to_byte__(this.saturation)},${__to_byte__(this.luminace)},${this.alpha})` : `hsl(${__to_byte__(this.hue)},${__to_byte__(this.saturation)},${__to_byte__(this.luminace)})`
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

export type AnyColor = RGBA | HSLA
export type AnyColorArray = AnyRGBArray | AnyHSLArray
export type AnyColorString = AnyRGBString | AnyHSLString
export type IAnyColor = IAnyRGB | IAnyHSL
export type IAnyToColor = IAnyToRGB | IAnyToHSL
export type AnyColorLike = AnyColorArray | AnyColorString | IAnyColor | HexLike | number
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
        if(checkNumberArray(args,3) || checkNumberArray(args,4))
            return resolve(args,preferHSL)
        return resolve(args[0],preferHSL)
    }
}