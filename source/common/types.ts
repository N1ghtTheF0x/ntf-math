/**
 * All valid types of JavaScript you can get from `typeof`
 */
export type JavaScriptTypes = "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function"
/**
 * A JavaScript function that can be typed (or not)
 */
export type JavaScriptFunction<Args extends Array<any> = Array<any>,ReturnType extends any = any> = (...args: Args) => ReturnType
/**
 * A mapped type for getting the type of a JavaScript value
 */
export type JavaScriptTypeMap = {
    "string": string
    "number": number
    "bigint": bigint
    "boolean": boolean
    "symbol": symbol
    "undefined": undefined
    "object": object
    "function": JavaScriptFunction
}
/**
 * Any kind of JavaScript number
 */
export type JavaScriptNumber = number | bigint

/**
 * A array that has a fixed length
 */
export type FixedArray<T,Length extends number> = Array<T> & {length: Length}

/**
 * A value that might look like a hex value
 */
export type HexLike = `$${string}` | `#${string}` | `0x${string}` | string
/**
 * A predicate function type for verifing types
 */
export type Predicate<T> = (a: unknown) => a is T

/**
 * Check if `value` is a finite valid number
 * @param value A value
 */
export function checkNumber(value: unknown): value is number
{
    return value !== null && typeof value == "number" && !isNaN(value) && isFinite(value)
}

/**
 * Retrieve the value of a hex string
 * @param string A string
 */
export function getHexValue(string: string): string
{
    let offset = 0
    if(string.startsWith("#") || string.startsWith("$"))
        offset = 1
    if(string.startsWith("0x"))
        offset = 2
    return string.substring(offset)
}

/**
 * Check if `value` is a hex value
 * @param value A value
 */
export function checkHex(value: unknown): value is HexLike
{
    if(!checkString(value))
        return false
    const hexValue = getHexValue(value).split("").map((char) => parseInt(char.toUpperCase(),16))
    return checkNumberArray(hexValue)
}

/**
 * Check if `value` is a string with content
 * @param value A value
 */
export function checkString(value: unknown): value is string
{
    return value !== null && typeof value == "string" && value.length > 0
}

/**
 * Check if `value` is a array
 * @param value A value
 * @param predicate A function that checks each item
 * @param requiredLength If needed, check if it is a fixed length array
 */
export function checkArray<T,Length extends number>(value: unknown,predicate?: Predicate<T>,requiredLength?: number): value is FixedArray<T,Length>
{
    if(!Array.isArray(value)) return false
    if(typeof requiredLength == "number" && requiredLength !== value.length) return false
    for(const item of value)
        if(typeof predicate == "function" && !predicate(item))
            return false
    return true
}

/**
 * Check if `value` is a number array
 * @param value A value
 * @param requiredLength If needed, check if it is a fixed length array
 */
export function checkNumberArray<Length extends number>(value: unknown,requiredLength?: Length): value is FixedArray<number,Length>
{
    return checkArray<number,Length>(value, checkNumber, requiredLength)
}

/**
 * Check if `value` is a string array
 * @param value A value
 * @param requiredLength If needed, check if it is a fixed length array
 */
export function checkStringArray<Length extends number>(value: unknown,requiredLength?: Length): value is FixedArray<string,Length>
{
    return checkArray<string,Length>(value, checkString, requiredLength)
}

/**
 * Check if `value` has a property called `name`
 * @param value A value
 * @param propertyName The name of the property
 * @param type
 */
export function hasProperty<Obj extends unknown,K extends PropertyKey,T extends JavaScriptTypes>(value: Obj,propertyName: K,type: T): value is Obj & {[name in K]: JavaScriptTypeMap[T]}
{
    return value !== null && typeof value == "object" && 
    propertyName in value && typeof (value as any)[propertyName] == type
}

export const NodeJSCustomInspect = Symbol.for("nodejs.util.inspect.custom")