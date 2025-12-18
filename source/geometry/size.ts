import { ResolveError } from "../common/error"
import { isValidNumber, isValidString, hasObjectProperty, NodeJSCustomInspect, isFixedTypeArray, checkValidNumber } from "@ntf/types"
import { IToVec2, Vec2Like } from "../vectors/vec2"
import { IGeometryObject } from "./object"

export interface ISize
{
    width: number
    height: number
}

export interface IToSize
{
    toSize(): SizeLike
}

export type SizeArray = [number,number]
export type SizeString = `${number}x${number}`
export type SizeLike = ISize | SizeArray | SizeString | number | IToSize
export type SizeArguments = [size: SizeLike] | SizeArray

export class Size implements ISize, IGeometryObject, IToVec2
{
    public width: number
    public height: number
    public get aspectRatio(){return this.height/this.width}
    public get area(){return this.width*this.height}
    public get perimeter(){return this.width+this.width+this.height+this.height}
    public static resolve(a: unknown): Size
    {
        const value = this.cast(a)
        if(typeof value != "undefined")
            return value
        throw new ResolveError("Square",a)
    }
    public static resolveArgs(args: SizeArguments): Size
    {
        if(isFixedTypeArray(args,isValidNumber,2))
            return new this(args[0],args[1])
        return this.resolve(args[0])
    }
    public static cast(a: unknown): Size | undefined
    {
        if(a == null || typeof a == "undefined")
            return undefined
        if(isFixedTypeArray(a,isValidNumber,2))
            return new this(a[0],a[1])
        if(hasObjectProperty(a,"toSize","function"))
            return this.cast(a.toSize())
        if(hasObjectProperty(a,"width","number") && hasObjectProperty(a,"height","number"))
            return new this(a.width,a.height)
        if(isValidString(a))
        {
            const parts = a.split("x").map((v) => parseFloat(v))
            if(isFixedTypeArray(parts,isValidNumber,2))
                return this.cast(parts)
        }
        if(isValidNumber(a))
            return new this(a,a)
        return undefined
    }
    public static is(a: unknown): a is SizeLike
    {
        return typeof this.cast(a) != "undefined"
    }
    public constructor(width: number,height: number)
    {
        checkValidNumber(width)
        checkValidNumber(height)
        this.width = width
        this.height = height
    }
    public toArray(): SizeArray
    {
        return [this.width,this.height]
    }
    public toString(): SizeString
    {
        return `${this.width}x${this.height}`
    }
    public get [Symbol.toStringTag](): string
    {
        return "Size"
    }
    public [NodeJSCustomInspect](): string
    {
        return `Size <${this.toString()}>`
    }
    public toJSON(): ISize
    {
        return {
            width: this.width,
            height: this.height
        }
    }
    public clone(): Size
    {
        return new Size(this.width,this.height)
    }
    public equals(size: SizeLike): boolean
    public equals(width: number,height: number): boolean
    public equals(...args: SizeArguments): boolean
    {
        const s = Size.resolveArgs(args)
        return this.width == s.width && this.height == s.height
    }
    public toVec2(): Vec2Like
    {
        return [this.width,this.height]
    }
}