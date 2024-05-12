export * from "./algebra/function"
export * from "./algebra/linear"
export * from "./algebra/quad"
export * from "./common/error"
export * from "./common/sign"
export * from "./common/types"
export * from "./geometry/angle"
export * from "./geometry/bbox"
export * from "./geometry/circle"
export * from "./geometry/object"
export * from "./geometry/rectangle"
export * from "./geometry/square"
export * from "./geometry/triangle"
export * from "./matrices/mat3"
export * from "./matrices/mat4"
export * from "./vectors/vec2"
export * from "./vectors/vec3"
export * from "./quaternion"
export * from "./color"

export function log_hypot(a: number,b: number)
{
    const a_abs = Math.abs(a)
    const b_abs = Math.abs(b)
    if(a == 0)
        return Math.log(b_abs)
    if(b == 0)
        return Math.log(a_abs)
    if(a_abs < 3000 && b_abs < 3000)
        return 0.5 * Math.log(a*a+b*b)
    const _a = a/2, _b = b/2
    return 0.5 * Math.log(_a*_a+_b*_b) + Math.LN2
}

export function clamp<T extends number | bigint>(value: T,min: T,max: T)
{
    if(value <= min)
        return min
    if(value >= max)
        return max
    return value
}

export const EPSILON = 1e-16