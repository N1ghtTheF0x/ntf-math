/**
 * A type that represents the sign of a number
 */
export type SignCharacter = "-" | "+"
/**
 * Get the sign character from a number
 * @param num A number
 */
export function signCharacter(num: number | bigint): SignCharacter | undefined
{
    if(num == 0)
        return undefined
    if(num < 0)
        return "-"
    if(num > 0)
        return "+"
    return undefined
}