import { ResolveError } from "../common/error"
import { check_number, check_number_array, check_string, has_property } from "../common/types"
import { Vec2, Vec2Like } from "../vectors/vec2"
import { IGeometryObject } from "./object"

export interface ISquare
{
    width: number
    height: number
}

export type SquareArray = [number,number]
export type SquareString = `${number}x${number}`
export type SquareLike = ISquare | SquareArray | SquareString | number
export type SquareArguments = [SquareLike] | [number,number]

export class Square implements ISquare, IGeometryObject
{
    public get aspectRatio(){return this.height/this.width}
    public get area(){return this.width*this.height}
    public get perimeter(){return this.width+this.width+this.height+this.height}
    public static resolve(a: unknown): Square
    {
        if(a == null || typeof a == "undefined")
            throw new ResolveError("Square",a)
        if(check_number_array(a,2))
            return new this(a[0],a[1])
        if(has_property(a,"width","number") && has_property(a,"height","number"))
            return new this(a.width,a.height)
        if(check_string(a))
        {
            const parts = a.split("x").map((v) => parseFloat(v))
            if(check_number_array(parts,2))
                return this.resolve(parts)
        }
        if(check_number(a))
            return new this(a,a)
        throw new ResolveError("Square",a)
    }
    public static fromVector(a: Vec2Like)
    {
        const vec = Vec2.resolve(a)
        return new this(vec.x,vec.y)
    }
    public static is(a: unknown): a is SquareLike
    {
        try
        {
            this.resolve(a)
        }
        catch(e)
        {
            return false
        }
        return true
    }
    public constructor(public width: number,public height: number)
    {

    }
    public toArray(): SquareArray
    {
        return [this.width,this.height]
    }
    public toString(): SquareString
    {
        return `${this.width}x${this.height}`
    }
    public toJSON(): ISquare
    {
        return {
            width: this.width,
            height: this.height
        }
    }
    public clone()
    {
        return new Square(this.width,this.height)
    }
    public toVector()
    {
        return new Vec2(this.width,this.height)
    }
}