import { ResolveError } from "../common/error"
import { check_number_array, check_string, has_property } from "../common/types"
import { IVec2, Vec2, Vec2Array, Vec2Like, Vec2String } from "../vectors/vec2"
import { IGeometryObject } from "./object"

export interface ICircle extends IVec2
{
    radius: number
}

export type CircleArray = [...Vec2Array,number]
export type CircleString = `${Vec2String}|${number}`
export type CircleLike = ICircle | CircleArray | CircleString

export class Circle implements ICircle, IGeometryObject
{
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
        if(a == null || typeof a == "undefined")
            throw new ResolveError("Circle",a)
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
            const pos = Vec2.resolve(spos)
            const radius = parseFloat(sradius)
            if(!isNaN(radius))
                return new this(pos,radius)
        }
        throw new ResolveError("Circle",a)
    }
    public static is(a: unknown): a is CircleLike
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
    public constructor(position: Vec2Like,public radius: number)
    {
        this.position = Vec2.resolve(position)
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