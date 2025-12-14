import { ResolveError } from "./common/error"
import { HexLike, check_hex, check_number, check_number_array, check_string, check_string_array, get_hex_part, has_property } from "./common/types"
import { clamp } from "./utils"

function _hex_to_array(hex: HexLike)
{
    if(!check_hex(hex))
        return undefined
    const part = get_hex_part(hex)
    const a = parseInt(part.substring(0,2),16)/0xff
    const b = parseInt(part.substring(2,4),16)/0xff
    const c = parseInt(part.substring(4,6),16)/0xff
    const d = part.length == 8 ? parseInt(hex.substring(6,8),16)/0xff : 1
    return [a,b,c,d] as const
}

function _number_to_rgb(number: number)
{
    const blue = number & 0xff
    const green = (number & 0xff00) >>> 8
    const red = (number & 0xff0000) >>> 16
    return [red/0xff,green/0xff,blue/0xff] as const
}

function _number_to_rgba(number: number)
{
    const alpha = number & 0xff
    const blue = (number & 0xff00) >>> 8
    const green = (number & 0xff0000) >>> 16
    const red = (number & 0xff000000) >>> 24
    return [red/0xff,green/0xff,blue/0xff,alpha/0xff] as const
}

function _fix_integer(number: number)
{
    return number * 0xff | 0
}

export interface IRGB
{
    red: number
    green: number
    blue: number
}
export type RGBArray = [number,number,number]
export type RGBString = `rgb(${number},${number},${number})`
export type RGBLike = IRGB | RGBArray | RGBString

export interface IRBBA extends IRGB
{
    alpha: number
}
export type RGBAArray = [number,number,number,number]
export type RGBAString = `rgba(${number},${number},${number},${number})`
export type RGBALike = IRBBA | RGBAArray | RGBAString

export type IAnyRGB = IRGB | IRBBA
export type AnyRGBArray = RGBArray | RGBAArray
export type AnyRGBString = RGBString | RGBAString
export type AnyRGBLike = IAnyRGB | AnyRGBArray | AnyRGBString | HexLike | number

export class RGBAColor implements IRBBA
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
    public static resolve(a: unknown): RGBAColor
    {
        const value = this.cast(a)
        if(typeof value != "undefined")
            return value
        throw new ResolveError("RGBAColor",a)
    }
    public static cast(a: unknown): RGBAColor | undefined
    {
        if(a == null || typeof a == "undefined")
            return undefined
        if(check_number_array(a,3) || check_number_array(a,4))
            return new this(a[0],a[1],a[2],a[3])
        if(has_property(a,"red","number") && has_property(a,"green","number") && has_property(a,"blue","number"))
            return new this(a.red,a.green,a.blue,has_property(a,"alpha","number") ? a.alpha : undefined)
        if(check_number(a))
        {
            const hex = a.toString(16)
            const convert = hex.length <= 6 ? _number_to_rgb : _number_to_rgba
            return this.cast(convert(a))
        }
        if(check_string(a))
        {
            if(a.startsWith("rgb"))
            {
                const hasAlpha = a.startsWith("rgba")
                const offset = hasAlpha ? 5 : 4
                const parts = a.substring(offset,a.indexOf(")",offset)).split(",")
                if(check_string_array(parts,hasAlpha ? 4 : 3))
                    return this.cast(parts.map((v) => parseInt(v) / 0xff))
            }
            return this.cast(_hex_to_array(a))
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
    public toArray(withAlpha = false): AnyRGBArray
    {
        return withAlpha ? [this.red,this.green,this.blue,this.alpha] : (this.alpha == 1 ? [this.red,this.green,this.blue] : this.toArray(true))
    }
    public toJSON(withAlpha = false): IAnyRGB
    {
        return withAlpha ? {
            red: this.red,green: this.green,blue: this.blue,alpha: this.alpha
        } : (this.alpha == 1 ? {red: this.red,green: this.green,blue: this.blue} : this.toJSON(true))
    }
    public toString(withAlpha = false): AnyRGBString
    {
        return withAlpha ? `rgba(${_fix_integer(this.red)},${_fix_integer(this.green)},${_fix_integer(this.blue)},${this.alpha})` : (this.alpha == 1 ? `rgb(${_fix_integer(this.red)},${_fix_integer(this.green)},${_fix_integer(this.blue)})` : this.toString(true))
    }
    public toHSL(withAlpha = true)
    {
        const red = this.red, green = this.green, blue = this.blue
        const min = Math.min(red,green,blue), max = Math.max(red,green,blue)
        const luminace = (min+max)/2
        if(min == max)
            return new HSLColor(0,0,luminace,withAlpha ? this.alpha : undefined)
        const d = max - min
        const saturation = luminace > 0.5 ? d / (2 - max - min) : d / (max + min)
        if(max == red)
            return new HSLColor(((green - blue) / d + (green < blue ? 6 : 0))/6,saturation,luminace)
        if(max == green)
            return new HSLColor(((blue - red) / d + 2)/6,saturation,luminace)
        if(max == blue)
            return new HSLColor(((red - green) / d + 4)/6,saturation,luminace)
        return new HSLColor(0,saturation,luminace,withAlpha ? this.alpha : undefined)
    }
    public invert(withAlpha = false)
    {
        return new RGBAColor(
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
export type HSLArray = [number,number,number]
export type HSLString = `hsl(${number},${number},${number})`
export type HSLLike = IHSL | HSLArray | HSLString

export interface IHSLA extends IHSL
{
    alpha: number
}
export type HSLAArray = [number,number,number,number]
export type HSLAString = `hsla(${number},${number},${number},${number})`
export type HSLALike = IHSLA | HSLAArray | HSLAString

export type IAnyHSL = IHSL | IHSLA
export type AnyHSLArray = HSLArray | HSLAArray
export type AnyHSLString = HSLString | HSLAString
export type AnyHSLLike = IAnyHSL | AnyHSLArray | AnyHSLString | HexLike | number

export class HSLColor implements IHSLA
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
    public static resolve(a: unknown): HSLColor
    {
        const value = this.cast(a)
        if(typeof value != "undefined")
            return value
        throw new ResolveError("HSLColor",a)
    }
    public static cast(a: unknown): HSLColor | undefined
    {
        if(a == null || typeof a == "undefined")
            return undefined
        if(check_number_array(a,3) || check_number_array(a,4))
            return new this(a[0],a[1],a[2],a[3])
        if(has_property(a,"hue","number") && has_property(a,"saturation","number") && has_property(a,"luminace","number"))
            return new this(a.hue,a.saturation,a.luminace,has_property(a,"alpha","number") ? a.alpha : undefined)
        if(check_number(a))
        {
            const hex = a.toString(16)
            const convert = hex.length <= 6 ? _number_to_rgb : _number_to_rgba
            return this.cast(convert(a))
        }
        if(check_string(a))
        {
            if(a.startsWith("hsl"))
            {
                const hasAlpha = a.startsWith("hsla")
                const offset = hasAlpha ? 5 : 4
                const parts = a.substring(offset,a.indexOf(")",offset)).split(",")
                if(check_string_array(parts,hasAlpha ? 4 : 3))
                    return this.cast(parts.map((v) => parseInt(v) / 0xff))
            }
            return this.cast(_hex_to_array(a))
        }
        return undefined
    }
    public static is(a: unknown)
    {
        return typeof this.cast(a) != "undefined"
    }
    public constructor(hue: number,saturation: number,luminace: number,alpha: number = 1)
    {
        if(!check_number(hue))
            throw new TypeError("expected number for hue")
        if(!check_number(saturation))
            throw new TypeError("expected number for saturation")
        if(!check_number(luminace))
            throw new TypeError("expected number for luminace")
        if(!check_number(alpha))
            throw new TypeError("expected number for alpha")
        this._hue = clamp(hue,0,1)
        this._saturation = clamp(saturation,0,1)
        this._luminace = clamp(luminace,0,1)
        this._alpha = clamp(alpha,0,1)
    }
    public toArray(withAlpha = false): AnyHSLArray
    {
        return withAlpha ? [this.hue,this.saturation,this.luminace,this.alpha] : (this.alpha == 1 ? [this.hue,this.saturation,this.luminace] : this.toArray(true))
    }
    public toJSON(withAlpha = false): IAnyHSL
    {
        return withAlpha ? {
            hue: this.hue,saturation: this.saturation,luminace: this.luminace,alpha: this.alpha
        } : (this.alpha == 1 ? {hue: this.hue,saturation: this.saturation,luminace: this.luminace} : this.toJSON(true))
    }
    public toString(withAlpha = false): AnyHSLString
    {
        return withAlpha ? `hsla(${_fix_integer(this.hue)},${_fix_integer(this.saturation)},${_fix_integer(this.luminace)},${this.alpha})` : (this.alpha == 1 ? `hsl(${_fix_integer(this.hue)},${_fix_integer(this.saturation)},${_fix_integer(this.luminace)})` : this.toString(true))
    }
    public toRGB(withAlpha = true)
    {
        if(this.saturation == 0)
            return new RGBAColor(this.luminace * 0xff,this.luminace * 0xff,this.luminace * 0xff,withAlpha ? this.alpha : undefined)
        const q = this.luminace < 0.5 ? this.luminace * (1 + this.saturation) : this.luminace + this.saturation - this.luminace * this.saturation
        const p = 2 * this.luminace - q
        function _hue_2_rgb(t: number)
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
        return new RGBAColor(_hue_2_rgb(this.hue + 1./3) * 0xff,_hue_2_rgb(this.hue) * 0xff,_hue_2_rgb(this.hue - 1./3) * 0xff,withAlpha ? this.alpha : undefined)
    }
    public invert(withAlpha = false)
    {
        return new HSLColor(
            1 - this.hue,
            1 - this.saturation,
            1 - this.luminace,
            withAlpha ? 1 - this.alpha : this.alpha
        )
    }
}

export type AnyColor = RGBAColor | HSLColor
export type AnyColorArray = AnyRGBArray | AnyHSLArray
export type AnyColorString = AnyRGBString | AnyHSLString
export type IColor = IAnyRGB | IAnyHSL
export type AnyColorLike = AnyColorArray | AnyColorString | IColor | HexLike | number

export function resolveColor(a: unknown,preferHSL: boolean = false): AnyColor
{
    const value = castColor(a,preferHSL)
    if(typeof value != "undefined")
        return value
    throw new ResolveError("Color",a)
}

export function castColor(a: unknown,preferHSL: boolean = false): AnyColor | undefined
{
    const results: Array<AnyColor | undefined> = []
    try
    {
        const rgba = RGBAColor.resolve(a)
        results.push(rgba)
    }
    catch(e){}
    try
    {
        const hsla = HSLColor.resolve(a)
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