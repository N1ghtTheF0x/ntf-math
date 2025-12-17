import { NodeJSCustomInspect } from "./types"

export function stringify<V>(value: V)
{
    return value != null && typeof value == "object" && "toString" in value && typeof value.toString == "function" ? value.toString() : String(value)
}

export interface IToString
{
    /**
     * Returns a string representation of an object.
     */
    toString(): string
    get [Symbol.toStringTag](): string
    [NodeJSCustomInspect](): string
}