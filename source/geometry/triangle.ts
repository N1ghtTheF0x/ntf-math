import { IToString } from "../common/string"
import { Vec2 } from "../vectors/vec2"
import { Vec3 } from "../vectors/vec3"
import { IGeometryObject } from "./object"

export interface ITriangle extends IGeometryObject
{
    readonly a: number
    readonly b: number
    readonly c: number

    readonly alpha: number
    readonly beta: number
    readonly gamma: number

    readonly semiperimeter: number
    readonly height: number
    readonly base: number
}

export abstract class ATriangle<P extends Vec2 | Vec3> implements ITriangle, IToString
{
    public abstract get a(): number
    public abstract get b(): number
    public abstract get c(): number
    public constructor(public A: P,public B: P,public C: P)
    {
        
    }
    public get alpha()
    {
        return Math.acos((this.b*this.b + this.c*this.c - this.a*this.a)/(2*this.b*this.c))
    }
    public get beta()
    {
        return Math.acos((this.c*this.c + this.a*this.a - this.b*this.b)/(2*this.c*this.a))
    }
    public get gamma()
    {
        return Math.acos((this.a*this.a + this.b*this.b - this.c*this.c)/(2*this.a*this.b))
    }
    public get perimeter()
    {
        return this.a+this.b+this.c
    }
    public get semiperimeter()
    {
        return this.perimeter/2
    }
    public get area()
    {
        return Math.sqrt(this.semiperimeter * (this.semiperimeter - this.a) * (this.semiperimeter - this.b) * (this.semiperimeter - this.c))
    }
    public get base()
    {
        return 2 * (this.area/(this.a * Math.sin(this.gamma)))
    }
    public get height()
    {
        return 2 * (this.area/this.base)
    }
}

export class Triangle2D extends ATriangle<Vec2> implements IToString
{
    public get a()
    {
        return Vec2.fromPoints(this.B,this.C).length()
    }
    public get b()
    {
        return Vec2.fromPoints(this.A,this.C).length()
    }
    public get c()
    {
        return Vec2.fromPoints(this.A,this.B).length()
    }
}

export class Triangle3D extends ATriangle<Vec3>
{
    public get a()
    {
        return Vec3.fromPoints(this.B,this.C).length()
    }
    public get b()
    {
        return Vec3.fromPoints(this.A,this.C).length()
    }
    public get c()
    {
        return Vec3.fromPoints(this.A,this.B).length()
    }
}