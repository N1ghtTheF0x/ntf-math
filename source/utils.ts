/**
 * Clamp `value` between `min` and `max`
 * @param value The input value
 * @param min The minimum value
 * @param max The maximum value
 * @returns A value between `min` and `max`
 */
export function clamp<T extends number | bigint>(value: T, min: T, max: T): T
{
    if(value <= min)
        return min
    if(value >= max)
        return max
    return value
}

/**
 * Calculate the natural logarithm of the magnitude of a complex number `a+bia+bi`
 * @param a The input value a
 * @param b The input value b
 * @returns The result
 */
export function logHypot(a: number, b: number): number
{
    const a_abs = Math.abs(a)
    const b_abs = Math.abs(b)
    if (a == 0)
        return Math.log(b_abs)
    if (b == 0)
        return Math.log(a_abs)
    if (a_abs < 3000 && b_abs < 3000)
        return 0.5 * Math.log(a * a + b * b)
    const _a = a / 2, _b = b / 2
    return 0.5 * Math.log(_a * _a + _b * _b) + Math.LN2
}

export const EPSILON = 1e-16

export const lerp = <T extends number | bigint>(a: T,b: T,t: T) => ((typeof a == "number" ? 1 : 1n) as T - t) * a + t * b