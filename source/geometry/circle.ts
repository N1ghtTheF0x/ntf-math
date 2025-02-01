import { ResolveError } from "../common/error"
import { IToString } from "../common/string"
import { check_number, check_number_array, check_string, has_property } from "../common/types"
import { IVec2, Vec2, Vec2Array, Vec2Like, Vec2String } from "../vectors/vec2"
import { IGeometryObject } from "./object"

export interface ICircle extends IVec2
{
    radius: number
}

export type CircleArray = [...Vec2Array,number]
export type CircleString = `${Vec2String}|${number}`
export type CircleLike = ICircle | CircleArray | CircleString

export class Circle implements ICircle, IGeometryObject, IToString
{
    public radius: number
    public get perimeter(){return this.radius * Math.PI * 2}
    public get area(){return Math.PI * Math.pow(this.radius,2)}
    public position: Vec2
    public get x(){return this.position.x}
    public set x(val){this.position.x = val}
    public get y(){return this.position.y}
    public set y(val){this.position.y = val}
    public get w(){return this.position.w}
    public set w(val){this.position.w = val}
    public static resolve(a: unknown): Circle
    {
        const value = this.cast(a)
        if(typeof value != "undefined")
            return value
        throw new ResolveError("Circle",a)
    }
    public static cast(a: unknown): Circle | undefined
    {
        if(a == null || typeof a == "undefined")
            return undefined
        if(check_number_array(a,3))
            return new this([a[0],a[1]],a[2])
        if(check_number_array(a,4))
        {
            const c = new this([a[0],a[1]],a[3])
            c.w = a[2]
            return c
        }
        if(has_property(a,"x","number") && has_property(a,"y","number") && has_property(a,"radius","number"))
            return new this(has_property(a,"w","number") ? [a.x,a.y,a.w] : [a.x,a.y],a.radius)
        if(check_string(a))
        {
            const [spos,sradius] = a.split("|")
            const pos = Vec2.cast(spos)
            if(typeof pos == "undefined")
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
        this.position = Vec2.resolve(position)
        if(!check_number(radius))
            throw new TypeError("expected number for radius")
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
    public clone()
    {
        return new Circle(this.position.clone(),this.radius)
    }
    public equals(circle: CircleLike)
    {
        const c = Circle.resolve(circle)
        return c.position.equals(c.position) && this.radius == c.radius
    }
    public inside(a: CircleLike)
    {
        const circle = Circle.resolve(a)
        const distX = circle.x - this.x
        const distY = circle.y - this.y
        const dist = Math.sqrt((distX*distX)+(distY+distY))
        return dist <= this.radius+circle.radius
    }
    public insidePoint(a: Vec2Like)
    {
        return this.position.distance(a) <= this.radius
    }
}