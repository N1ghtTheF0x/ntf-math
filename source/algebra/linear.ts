import { signCharacter } from "../common/sign"
import { checkNumber, NodeJSCustomInspect } from "../common/types"
import { Vec2Like, Vec2 } from "../vectors/vec2"
import { MathFunction } from "./function"

/**
 * The string representation of a linear function
 */
export type LinearFunctionString = `f(x) = ${number} * x ${"+" | "-"} ${number}` | `f(x) = ${number} * x`

/**
 * A class that implements a linear function with `m`, `b` and `x`
 */
export class LinearFunction extends MathFunction<[number]>
{
    /**
     * The factor of the linear function
     */
    public m: number
    /**
     * The height of the linear function
     */
    public b: number
    /**
     * Create a linear function from two points
     * @param a A point
     * @param b A point
     * @returns A linear function from two points
     */
    public static fromPoints(a: Vec2Like,b: Vec2Like)
    {
        const veca = Vec2.resolve(a)
        const vecb = Vec2.resolve(b)
        const m = (vecb.y - veca.y)/(vecb.x - veca.x)
        const h = -m*veca.x+veca.y
        return new this(m,h)
    }
    /**
     * Create a linear function with a factor and height
     * @param m The factor
     * @param b The height
     */
    public constructor(m: number,b: number)
    {
        super()
        if(!checkNumber(m))
            throw new TypeError("expected number for m")
        if(!checkNumber(b))
            throw new TypeError("expected number for b")
        this.m = m
        this.b = b
    }
    public get(x: number): number
    {
        if(!checkNumber(x))
            throw new TypeError("expected number for x")
        return this.m
    }
    public roots(): Array<Vec2>
    {
        const x = -(this.b)/this.m
        if(!isNaN(x))
            return [new Vec2(x,0)]
        return []
    }
    public override toString(): LinearFunctionString
    {
        const bsign = signCharacter(this.b)
        if(bsign)
            return `f(x) = ${this.m} * x ${bsign} ${Math.abs(this.b)}`
        return `f(x) = ${this.m} * x`
    }
    public override get [Symbol.toStringTag](): string
    {
        return "LinearFunction"
    }
    public [NodeJSCustomInspect](): string
    {
        return `LinearFunction <${this.toString()}>`
    }
}