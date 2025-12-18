import { checkValidNumber, ExpectedTypeError, NodeJSCustomInspect } from "@ntf/types"
import { SignCharacter, signCharacter } from "../common/sign"
import { Vec2 } from "../vectors/vec2"
import { MathFunction } from "./function"

/**
 * The various types of how a quad function can be represented
 */
export type QuadFunctionType = "standard"
/**
 * A typed map of each quad function representations
 */
export type QuadFunctionString = {
    "standard": `f(x) = ${number}x^2 ${SignCharacter} ${number}x ${SignCharacter} ${number}` | `f(x) = ${number}x^2 ${SignCharacter} ${number}x` | `f(x) = ${number}x^2`
}
/**
 * A string representation of a quad function
 */
export type QuadFunctionStrings = QuadFunctionString[QuadFunctionType]
/**
 * A class that implements a quad function with `a`, `b` and `c`
 */
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
        checkValidNumber(a)
        if(a === 0)
            throw new ExpectedTypeError("non-zero valid number",a)
        checkValidNumber(b)
        checkValidNumber(c)
        this.a = a
        this.b = b
        this.c = c
    }
    public get(x: number): number
    {
        checkValidNumber(x)
        return this.a*x*x + this.b*x + this.c
    }
    public roots(): Array<Vec2>
    {
        const roots = new Array<Vec2>

        const discriminant = this.b*this.b - 4 * this.a * this.c
        const n0 = (-this.b + Math.sqrt(discriminant))/(2*this.a)
        const n1 = (-this.b + Math.sqrt(discriminant))/(2*this.a)

        if(!isNaN(n0))
            roots.push(new Vec2(n0,0))
        if(!isNaN(n1) && n0 != n1)
            roots.push(new Vec2(n1,0))

        return roots
    }
    public override toString<T extends QuadFunctionType>(type: T = "standard" as T): QuadFunctionString[T]
    {
        switch(type)
        {
            default:
            case "standard":
            {
                const bsign = signCharacter(this.b)
                const csign = signCharacter(this.c)
                if(bsign && csign)
                    return `f(x) = ${this.a}x^2 ${bsign} ${Math.abs(this.b)}x ${csign} ${Math.abs(this.c)}`
                if(bsign)
                    return `f(x) = ${this.a}x^2 ${bsign} ${Math.abs(this.b)}x`
                return `f(x) = ${this.a}x^2`
            }
        }
    }
    public override get [Symbol.toStringTag](): string
    {
        return "QuadFunction"
    }
    public [NodeJSCustomInspect](): string
    {
        return `QuadFunction <${this.toString()}>`
    }
}