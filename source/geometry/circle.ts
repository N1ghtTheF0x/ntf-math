import { ResolveError } from "../common/error"
import { isValidNumber, isValidString, hasTypedProperty, NodeJSCustomInspect, isFixedTypeArray, checkValidNumber } from "@ntf/types"
import { IToVec2, IVec2, Vec2, Vec2Arguments, Vec2Array, Vec2Like, Vec2String } from "../vectors/vec2"
import { IGeometryObject } from "./object"

export interface ICircle extends IVec2
{
    radius: number
}

export interface IToCircle
{
    toCircle(): CircleLike
}

export type CircleArray = [...Vec2Array,number]
export type CircleString = `${Vec2String}|${number}`
export type CircleLike = ICircle | CircleArray | CircleString | IToCircle
export type CircleArguments = [circle: CircleLike] | [position: Vec2Like,radius: number] | CircleArray

export class Circle implements ICircle, IGeometryObject, IToVec2
{
    public radius: number
    public get perimeter(){return this.radius * Math.PI * 2}
    public get area(){return Math.PI * Math.pow(this.radius,2)}
    public position: Vec2
    public get x(): number {return this.position.x}
    public set x(val: number) {this.position.x = val}
    public get y(): number {return this.position.y}
    public set y(val: number) {this.position.y = val}
    public get w(): number {return this.position.w}
    public set w(val: number) {this.position.w = val}
    public static resolve(a: unknown): Circle
    {
        const value = this.cast(a)
        if(typeof value != "undefined")
            return value
        throw new ResolveError("Circle",a)
    }
    public static resolveArgs(args: CircleArguments): Circle
    {
        if(isFixedTypeArray(args,isValidNumber,3))
            return new this([args[0],args[1]],args[2])
        if(args.length === 2)
            return new this(args[0],args[1])
        return this.resolve(args[0])
    }
    public static cast(a: unknown): Circle | undefined
    {
        if(a == null || typeof a == "undefined")
            return undefined
        if(isFixedTypeArray(a,isValidNumber,3))
            return new this([a[0]!,a[1]!],a[2]!)
        if(isFixedTypeArray(a,isValidNumber,4))
        {
            const c = new this([a[0]!,a[1]!],a[3]!)
            c.w = a[2]!
            return c
        }
        if(hasTypedProperty(a,"toCircle","function"))
            return this.cast(a.toCircle())
        if(hasTypedProperty(a,"x","number") && hasTypedProperty(a,"y","number") && hasTypedProperty(a,"radius","number"))
            return new this(hasTypedProperty(a,"w","number") ? [a.x,a.y,a.w] : [a.x,a.y],a.radius)
        if(isValidString(a))
        {
            const [spos,sradius] = a.split("|")
            const pos = Vec2.cast(spos)
            if(pos === undefined || sradius === undefined)
                return undefined
            const radius = parseFloat(sradius)
            if(!isNaN(radius))
                return new this(pos,radius)
        }
        return undefined
    }
    public static is(a: unknown): a is CircleLike
    {
        return typeof this.cast(a) != "undefined"
    }
    public constructor(position: Vec2Like,radius: number)
    {
        checkValidNumber(radius)
        this.position = Vec2.resolve(position)
        this.radius = radius
    }
    public toArray(): CircleArray
    {
        return [...this.position.toArray(),this.radius]
    }
    public toJSON(): ICircle
    {
        return {
            ...this.position.toJSON(),
            radius: this.radius
        }
    }
    public toString(): CircleString
    {
        return `${this.position.toString()}|${this.radius}`
    }
    public get [Symbol.toStringTag](): string
    {
        return "Circle"
    }
    public [NodeJSCustomInspect](): string
    {
        return `Circle <${this.toString()}>`
    }
    public clone(): Circle
    {
        return new Circle(this.position.clone(),this.radius)
    }
    public toVec2(): Vec2Like
    {
        return [this.x,this.y,this.w]
    }
    public equals(circle: CircleLike): boolean
    public equals(x: number,y: number,radius: number): boolean
    public equals(position: Vec2Like,radius: number): boolean
    public equals(...args: CircleArguments): boolean
    {
        const c = Circle.resolveArgs(args)
        return c.position.equals(c.position) && this.radius == c.radius
    }
    public inside(circle: CircleLike): boolean
    public inside(x: number,y: number,radius: number): boolean
    public inside(position: Vec2Like,radius: number): boolean
    public inside(...args: CircleArguments): boolean
    {
        const circle = Circle.resolveArgs(args)
        const distX = circle.x - this.x
        const distY = circle.y - this.y
        const dist = Math.sqrt((distX*distX)+(distY+distY))
        return dist <= this.radius+circle.radius
    }
    public insidePoint(point: Vec2Like): boolean
    public insidePoint(x: number,y: number): boolean
    public insidePoint(...args: Vec2Arguments): boolean
    {
        return this.position.distance(Vec2.resolveArgs(args)) <= this.radius
    }
}