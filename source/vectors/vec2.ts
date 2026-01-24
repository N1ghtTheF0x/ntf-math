import { ResolveError } from "../common/error"
import { isValidNumber, isValidString, hasTypedProperty, NodeJSCustomInspect, IToString, isFixedTypeArray, checkValidNumber } from "@ntf/types"
import { IToSize, SizeLike } from "../geometry/size"
import { IToVec3, Vec3Like } from "./vec3"
import { clamp } from "../utils"
import { IToHSL, IToHSLA, HSLLike, HSLALike } from "../color/hsl"
import { IToRGB, IToRGBA, RGBLike, RGBALike } from "../color/rgb"

export interface IVec2
{
    x: number
    y: number
    w: number
}

export interface IToVec2
{
    toVec2(): Vec2Like
}

export type Vec2Array = [number,number] | [number,number,number]
export type Vec2String = `${number},${number}` | `${number},${number};${number}`
export type Vec2Like = IVec2 | Vec2Array | Vec2String | number | IToVec2
export type Vec2Arguments = [Vec2Like] | [number,number]

export class Vec2 implements IVec2, IToVec3, IToSize, IToRGB, IToRGBA, IToHSL, IToHSLA, IToString
{
    public x: number
    public y: number
    public w: number
    public static resolve(a: unknown): Vec2
    {
        const value = this.cast(a)
        if(typeof value != "undefined")
            return value
        throw new ResolveError("Vec2",a)
    }
    public static cast(a: unknown): Vec2 | undefined
    {
        if(a == null || typeof a == "undefined")
            return undefined
        if(isValidString(a))
        {
            const [sxy,sw] = a.split(";")
            if(isValidString(sxy))
            {
                const parts = sxy.split(",")
                if(isFixedTypeArray(parts,isValidString,2))
                    return new this(parseFloat(parts[0]!),parseFloat(parts[1]!),isValidString(sw) ? parseFloat(sw) : undefined)
            }
        }
        if(isValidNumber(a))
            return new this(a,a)
        if(isFixedTypeArray(a,isValidNumber,2) || isFixedTypeArray(a,isValidNumber,3))
            return new this(a[0]!,a[1]!,a[2]!)
        if(hasTypedProperty(a,"toVec2","function"))
            return this.cast(a.toVec2())
        if(hasTypedProperty(a,"x","number") && hasTypedProperty(a,"y","number"))
            return new this(a.x,a.y,hasTypedProperty(a,"w","number") ? a.w : undefined)
        return undefined
    }
    public static resolveArgs(args: Vec2Arguments): Vec2
    {
        if(isFixedTypeArray(args,isValidNumber,2))
            return new this(args[0],args[1])
        return this.resolve(args[0])
    }
    public static is(a: unknown): a is Vec2Like
    {
        return typeof this.cast(a) != "undefined"
    }
    public static fromPoints(a: Vec2Like,b: Vec2Like): Vec2
    {
        const veca = this.resolve(a)
        const vecb = this.resolve(b)
        return new this(vecb.x - veca.x,vecb.y - veca.y)
    }
    public static clamp(value: Vec2Like,min: Vec2Like,max: Vec2Like)
    {
        const a = this.resolve(value), b = this.resolve(min), c = this.resolve(max)
        return new this(
            clamp(a.x,b.x,c.x),
            clamp(a.y,b.y,c.y)
        )
    }
    public static get zero(): Vec2 {return new this(0,0)}
    public static get one(): Vec2 {return new this(1,1)}
    public constructor(x: number,y: number,w: number = 1)
    {
        checkValidNumber(x)
        checkValidNumber(y)
        checkValidNumber(w)
        this.x = x
        this.y = y
        this.w = w
    }
    public toArray(w: boolean = this.w !== 1): Vec2Array
    {
        return w ? [this.x,this.y,this.w] : [this.x,this.y]
    }
    public toJSON(): IVec2
    {
        return {
            x: this.x,y: this.y,w: this.w
        }
    }
    public toString(w: boolean = this.w !== 1): Vec2String
    {
        return w ? `${this.x},${this.y};${this.w}` : `${this.x},${this.y}`
    }
    public get [Symbol.toStringTag](): string
    {
        return "Vec2"
    }
    public [NodeJSCustomInspect](): string
    {
        return `Vec2 <${this.toString()}>`
    }
    public toSize(): SizeLike
    {
        return [this.x,this.y]
    }
    public toVec3(z: number = 0): Vec3Like
    {
        return [this.x,this.y,z,this.w]
    }
    public toRGB(): RGBLike
    {
        const vec = this.normalize()
        return [vec.x,vec.y,vec.w]
    }
    public toRGBA(): RGBALike
    {
        const vec = this.normalize()
        return [vec.x,vec.y,vec.w,1]
    }
    public toHSL(): HSLLike
    {
        const vec = this.normalize()
        return [vec.x,vec.y,vec.w]
    }
    public toHSLA(): HSLALike
    {
        const vec = this.normalize()
        return [vec.x,vec.y,vec.w,1]
    }
    public clone(): Vec2
    {
        return new Vec2(this.x,this.y,this.w)
    }
    public equals(vec: Vec2Like): boolean
    public equals(x: number,y: number): boolean
    public equals(...args: Vec2Arguments): boolean
    {
        const a = Vec2.resolveArgs(args)
        return this.x == a.x && this.y == a.y
    }
    public setX(x: number): this
    {
        this.x = x
        return this
    }
    public setY(y: number): this
    {
        this.y = y
        return this
    }
    public setW(w: number): this
    {
        this.w = w
        return this
    }
    public set(x: number,y: number): this
    public set(vec: Vec2Like): this
    public set(...args: Vec2Arguments): this
    {
        const vec = Vec2.resolveArgs(args)
        return this.setX(vec.x).setY(vec.y)
    }
    public add(x: number,y: number): Vec2
    public add(vec: Vec2Like): Vec2
    public add(...args: Vec2Arguments): Vec2
    {
        const vec = Vec2.resolveArgs(args)
        return new Vec2(
            this.x + vec.x,
            this.y + vec.y
        )
    }
    public offset(x: number,y: number): this
    public offset(vec: Vec2Like): this
    public offset(...args: Vec2Arguments): this
    {
        const vec = Vec2.resolveArgs(args)
        this.x += vec.x
        this.y += vec.y
        return this
    }
    public subtract(x: number,y: number): Vec2
    public subtract(vec: Vec2Like): Vec2
    public subtract(...args: Vec2Arguments): Vec2
    {
        const vec = Vec2.resolveArgs(args)
        return new Vec2(
            this.x - vec.x,
            this.y - vec.y
        )
    }
    public multiply(scalar: number): Vec2
    {
        return new Vec2(
            this.x * scalar,
            this.y * scalar
        )
    }
    public naiveMultiply(x: number,y: number): Vec2
    public naiveMultiply(vec: Vec2Like): Vec2
    public naiveMultiply(...args: Vec2Arguments): Vec2
    {
        const vec = Vec2.resolveArgs(args)
        return new Vec2(
            this.x * vec.x,
            this.y * vec.y
        )
    }
    public divide(x: number,y: number): Vec2
    public divide(scalar: number): Vec2
    public divide(vec: Vec2Like): Vec2
    public divide(...args: Vec2Arguments | [number]): Vec2
    {
        if(isFixedTypeArray(args,isValidNumber,1))
            return new Vec2(
                this.x / args[0],
                this.y / args[0]
            )
        const vec = Vec2.resolveArgs(args)
        return new Vec2(
            this.x / vec.x,
            this.y / vec.y
        )
    }
    public dot(x: number,y: number): number
    public dot(vec: Vec2Like): number
    public dot(...args: Vec2Arguments): number
    {
        const vec = Vec2.resolveArgs(args)
        return this.x*vec.x+this.y*vec.y
    }
    public distance(x: number,y: number): number
    public distance(vec: Vec2Like): number
    public distance(...args: Vec2Arguments): number
    {
        const vec = Vec2.resolveArgs(args)
        return Math.pow(vec.x - this.x,2) + Math.pow(vec.y - this.y,2)
    }
    public distanceSquare(x: number,y: number): number
    public distanceSquare(vec: Vec2Like): number
    public distanceSquare(...args: Vec2Arguments): number
    {
        const vec = Vec2.resolveArgs(args)
        return Math.sqrt(Math.pow(vec.x - this.x,2) + Math.pow(vec.y - this.y,2))
    }
    public length(): number
    {
        return Math.sqrt(this.x*this.x+this.y*this.y)
    }
    public cartesianify(): Vec2
    {
        return new Vec2(
            this.x * Math.cos(this.y),
            this.x * Math.sin(this.y)
        )
    }
    public polarify(): Vec2
    {
        return new Vec2(
            Math.sqrt(this.x*this.x+this.y*this.y),
            Math.atan(this.y/this.x)
        )
    }
    public normalize(): Vec2
    {
        const length = this.length()
        if(length == 0) return Vec2.zero
        return new Vec2(
            this.x / length,
            this.y / length,
            this.w / length
        )
    }
    public invert(): Vec2
    {
        return this.multiply(-1)
    }
    public round(): Vec2
    {
        return new Vec2(Math.round(this.x),Math.round(this.y),Math.round(this.w))
    }
}