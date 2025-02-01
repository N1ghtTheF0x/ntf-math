import { ResolveError } from "../common/error"
import { IToString } from "../common/string"
import { check_number, check_number_array, check_string, has_property } from "../common/types"
import { Vec2Like } from "../vectors/vec2"
import { IGeometryObject } from "./object"

export interface ISize
{
    width: number
    height: number
}

export type SizeArray = [number,number]
export type SizeString = `${number}x${number}`
export type SizeLike = ISize | SizeArray | SizeString | number
export type SizeArguments = [SizeLike] | [number,number]

export class Size implements ISize, IGeometryObject, IToString
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
    public static cast(a: unknown): Size | undefined
    {
        if(a == null || typeof a == "undefined")
            return undefined
        if(check_number_array(a,2))
            return new this(a[0],a[1])
        if(has_property(a,"width","number") && has_property(a,"height","number"))
            return new this(a.width,a.height)
        if(check_string(a))
        {
            const parts = a.split("x").map((v) => parseFloat(v))
            if(check_number_array(parts,2))
                return this.cast(parts)
        }
        if(check_number(a))
            return new this(a,a)
        return undefined
    }
    public static is(a: unknown): a is SizeLike
    {
        return typeof this.cast(a) != "undefined"
    }
    public constructor(width: number,height: number)
    {
        if(!check_number(width))
            throw new TypeError("expected number for width")
        if(!check_number(height))
            throw new TypeError("expected number for height")
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
    public toJSON(): ISize
    {
        return {
            width: this.width,
            height: this.height
        }
    }
    public clone()
    {
        return new Size(this.width,this.height)
    }
    public equals(square: SizeLike)
    {
        const s = Size.resolve(square)
        return this.width == s.width && this.height == s.height
    }
    public toVec2(): Vec2Like
    {
        return [this.width,this.height]
    }
}