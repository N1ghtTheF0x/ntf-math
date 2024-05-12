import { sign_char } from "../common/sign"
import { Vec2, Vec2Like } from "../vectors/vec2"
import { MathFunction } from "./function"

export type QuadFunctionType = "standard"
export type QuadFunctionString = {
    "standard": `f(x) = ${number}x^2 ${"+" | "-"} ${number}x ${"+" | "-"} ${number}` | `f(x) = ${number}x^2 ${"+" | "-"} ${number}x` | `f(x) = ${number}x^2`
}
export type QuadFunctionStrings = QuadFunctionString[QuadFunctionType]

export class QuadFunction extends MathFunction<[number]>
{
    public static get(a: number,b: number,c: number,x: number)
    {
        return new this(a,b,c).get(x)
    }
    public constructor(public a: number,public b: number,public c: number)
    {
        super()
        if(a == 0)
            throw new Error("'a' cannot be 0")
    }
    public get(x: number): number
    {
        return this.a*x*x + this.b*x + this.c
    }
    public roots(): Array<Vec2>
    {
        const roots = new Array<Vec2>

        const discriminant = this.b*this.b - 4 * this.a * this.c
        const n0 = (-this.b + Math.sqrt(discriminant))/(2*this.a)
        const n1 = (-this.b + Math.sqrt(discriminant))/(2*this.a)

        if(!isNaN(n0))
            roots.push(new Vec2(n0))
        if(!isNaN(n1) && n0 != n1)
            roots.push(new Vec2(n1))

        return roots
    }
    public toString<T extends QuadFunctionType>(type: T = "standard" as T): QuadFunctionString[T]
    {
        switch(type)
        {
            default:
            case "standard":
            {
                const bsign = sign_char(this.b)
                const csign = sign_char(this.c)
                if(bsign && csign)
                    return `f(x) = ${this.a}x^2 ${bsign} ${Math.abs(this.b)}x ${csign} ${Math.abs(this.c)}`
                if(bsign)
                    return `f(x) = ${this.a}x^2 ${bsign} ${Math.abs(this.b)}x`
                return `f(x) = ${this.a}x^2`
            }
        }
    }
}