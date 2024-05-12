import { ResolveError } from "../common/error"
import { check_number_array, check_number, check_string, check_string_array, has_property } from "../common/types"
import { Square } from "../geometry/square"
import { clamp } from "../index"

export interface IVec2
{
    x: number
    y: number
    w: number
}

export type Vec2Array = [number,number] | [number,number,number]
export type Vec2String = `${number},${number}` | `${number},${number};${number}`
export type Vec2Like = IVec2 | Vec2Array | Vec2String  | number
export type Vec2Arguments = [Vec2Like] | [number,number]

export class Vec2 implements IVec2
{
    public static resolve(a: unknown)
    {
        if(a == null || typeof a == "undefined")
            throw new ResolveError("Vec2",a)
        if(check_number_array(a,2) || check_number_array(a,3))
            return new this(a[0],a[1],check_number(a[2]) ? a[2] : undefined)
        if(has_property(a,"x","number") && has_property(a,"y","number"))
            return new this(a.x,a.y,has_property(a,"w","number") ? a.w : undefined)
        if(check_string(a))
        {
            const [sxy,sw] = a.split(";")
            if(check_string(sxy))
            {
                const parts = sxy.split(",")
                if(check_string_array(parts,2))
                    return new this(parseFloat(parts[0]),parseFloat(parts[1]),check_string(sw) ? parseFloat(sw) : undefined)
            }
        }
        if(check_number(a))
            return new this(a,a)
        throw new ResolveError("Vec2",a)
    }
    public static resolveArgs(args: Vec2Arguments)
    {
        if(check_number_array(args,2))
            return new this(args[0],args[1])
        return this.resolve(args[0])
    }
    public static is(a: unknown): a is Vec2Like
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
    public static fromPoints(a: Vec2Like,b: Vec2Like)
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
    public constructor(public x: number = 0,public y: number = 0,public w = 1)
    {

    }
    public toArray(w = false): Vec2Array
    {
        return w ? [this.x,this.y] : [this.x,this.y,this.w]
    }
    public toJSON(): IVec2
    {
        return {
            x: this.x,y: this.y,w: this.w
        }
    }
    public toString(w = false): Vec2String
    {
        return w ? `${this.x},${this.y}` : `${this.x},${this.y};${this.w}`
    }
    public toSquare()
    {
        return new Square(this.x,this.y)
    }
    public clone()
    {
        return new Vec2(this.x,this.y,this.w)
    }
    public setX(x: number)
    {
        this.x = x
        return this
    }
    public setY(y: number)
    {
        this.y = y
        return this
    }
    public setW(w: number)
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
    public multiply(scalar: number)
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
        if(check_number_array(args,1))
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
    public length()
    {
        return Math.sqrt(this.x*this.x+this.y*this.y)
    }
    public cartesianify()
    {
        return new Vec2(
            this.x * Math.cos(this.y),
            this.x * Math.sin(this.y)
        )
    }
    public polarify()
    {
        return new Vec2(
            Math.sqrt(this.x*this.x+this.y*this.y),
            Math.atan(this.y/this.x)
        )
    }
    public normalize()
    {
        const length = this.length()
        if(length == 0) return new Vec2
        return new Vec2(
            this.x / length,
            this.y / length
        )
    }
    public invert()
    {
        return this.multiply(-1)
    }
    public round()
    {
        return new Vec2(Math.round(this.x),Math.round(this.y),Math.round(this.w))
    }
}