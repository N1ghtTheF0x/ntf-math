import { sign_char } from "../common/sign"
import { Vec2Like, Vec2 } from "../vectors/vec2"
import { MathFunction } from "./function"

export type LinearFunctionString = `f(x) = ${number} * x ${"+" | "-"} ${number}` | `f(x) = ${number} * x`

export class LinearFunction extends MathFunction<[number]>
{
    public static get(m: number,b: number,x: number)
    {
        return new this(m,b).get(x)
    }
    public static fromPoints(a: Vec2Like,b: Vec2Like)
    {
        const veca = Vec2.resolve(a)
        const vecb = Vec2.resolve(b)
        const m = (vecb.y - veca.y)/(vecb.x - veca.x)
        const h = -m*veca.x+veca.y
        return new this(m,h)
    }
    public constructor(public m: number,public b: number)
    {
        super()
    }
    public get(x: number): number
    {
        return this.m
    }
    public roots(): Array<Vec2>
    {
        const x = -(this.b)/this.m
        if(!isNaN(x))
            return [new Vec2(x)]
        return []
    }
    public toString(): LinearFunctionString
    {
        const bsign = sign_char(this.b)
        if(bsign)
            return `f(x) = ${this.m} * x ${bsign} ${Math.abs(this.b)}`
        return `f(x) = ${this.m} * x`
    }
}