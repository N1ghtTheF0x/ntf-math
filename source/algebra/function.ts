import { IToString, NodeJSCustomInspect } from "@ntf/types"
import { Vec2 } from "../vectors/vec2"

/**
 * An abstract class of a mathematical function
 * @template Input The amount of input values the function can use
 */
export abstract class MathFunction<Input extends Array<number> = Array<number>> implements IToString
{
    /**
     * Calculate y with input values
     * @param args The input values
     * @returns The y value from the input values
     */
    public abstract get(...args: Input): number
    /**
     * Get the root points of this function
     * @returns The root points, this can be an empty array if no root points have been found
     */
    public abstract roots(): Array<Vec2>
    public abstract get [Symbol.toStringTag](): string
    public abstract [NodeJSCustomInspect](): string
}