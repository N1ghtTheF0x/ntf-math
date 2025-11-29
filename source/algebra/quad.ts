import { sign_char } from "../common/sign"
import { check_number } from "../common/types"
import { Vec2 } from "../vectors/vec2"
import { MathFunction } from "./function"

export type QuadFunctionType = "standard"
export type QuadFunctionString = {
    "standard": `f(x) = ${number}x^2 ${"+" | "-"} ${number}x ${"+" | "-"} ${number}` | `f(x) = ${number}x^2 ${"+" | "-"} ${number}x` | `f(x) = ${number}x^2`
}
export type QuadFunctionStrings = QuadFunctionString[QuadFunctionType]

export class QuadFunction extends MathFunction<[number]>
{
    public a: number
    public b: number
    public c: number
    public static get(a: number,b: number,c: number,x: number)
    {
        return new this(a,b,c).get(x)
    }
    public constructor(a: number,b: number,c: number)
    {
        super()
        if(!check_number(a))
            throw new TypeError("expected number for a")
        if(a == 0)
            throw new TypeError("a cannot be 0")
        if(!check_number(b))
            throw new TypeError("expected number for b")
        if(!check_number(c))
            throw new TypeError("expected number for c")
        this.a = a
        this.b = b
        this.c = c
    }
    public get(x: number): number
    {
        if(!check_number(x))
            throw new TypeError("expected number for x")
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
    public override toString<T extends QuadFunctionType>(type: T = "standard" as T): QuadFunctionString[T]
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