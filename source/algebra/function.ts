import { Vec2 } from "../vectors/vec2"

export abstract class MathFunction<Input extends Array<number> = Array<number>>
{
    public abstract get(...args: Input): number
    public abstract roots(): Array<Vec2>
}