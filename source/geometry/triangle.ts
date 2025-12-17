import { stringify } from "../common/string"
import { NodeJSCustomInspect } from "../common/types"
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

export abstract class Triangle<T> implements ITriangle
{
    public abstract get a(): number
    public abstract get b(): number
    public abstract get c(): number
    public constructor(public A: T,public B: T,public C: T)
    {
        
    }
    public get alpha(): number
    {
        return Math.acos((this.b*this.b + this.c*this.c - this.a*this.a)/(2*this.b*this.c))
    }
    public get beta(): number
    {
        return Math.acos((this.c*this.c + this.a*this.a - this.b*this.b)/(2*this.c*this.a))
    }
    public get gamma(): number
    {
        return Math.acos((this.a*this.a + this.b*this.b - this.c*this.c)/(2*this.a*this.b))
    }
    public get perimeter(): number
    {
        return this.a+this.b+this.c
    }
    public get semiperimeter(): number
    {
        return this.perimeter/2
    }
    public get area(): number
    {
        return Math.sqrt(this.semiperimeter * (this.semiperimeter - this.a) * (this.semiperimeter - this.b) * (this.semiperimeter - this.c))
    }
    public get base(): number
    {
        return 2 * (this.area/(this.a * Math.sin(this.gamma)))
    }
    public get height(): number
    {
        return 2 * (this.area/this.base)
    }
    public toString(): string
    {
        return `${stringify(this.A)}|${stringify(this.B)}|${stringify(this.C)}`
    }
    public get [Symbol.toStringTag](): string
    {
        return "Triangle"
    }
    public [NodeJSCustomInspect](): string
    {
        return `Triangle <${this.toString()}>`
    }
}

export class Triangle2D extends Triangle<Vec2>
{
    public get a(): number
    {
        return Vec2.fromPoints(this.B,this.C).length()
    }
    public get b(): number
    {
        return Vec2.fromPoints(this.A,this.C).length()
    }
    public get c(): number
    {
        return Vec2.fromPoints(this.A,this.B).length()
    }
}

export class Triangle3D extends Triangle<Vec3>
{
    public get a(): number
    {
        return Vec3.fromPoints(this.B,this.C).length()
    }
    public get b(): number
    {
        return Vec3.fromPoints(this.A,this.C).length()
    }
    public get c(): number
    {
        return Vec3.fromPoints(this.A,this.B).length()
    }
}