export type JavaScriptTypes = "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function"
export type JavaScriptTypeMap = {
    "string": string
    "number": number
    "bigint": bigint
    "boolean": boolean
    "symbol": symbol
    "undefined": undefined
    "object": object
    "function": Function
}
export type HexDigit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "A" | "B" | "C" | "D" | "E" | "F"
export type HexLike = `#${string}` | `0x${string}` | string
export type Predicate<T> = (a: unknown) => a is T

export function check_number(obj: unknown): obj is number
{
    return obj != null && typeof obj == "number" && !isNaN(obj) && isFinite(obj)
}

export function check_hex_digit(obj: unknown): obj is HexDigit
{
    if(!check_string(obj) || obj.length != 1)
        return false
    switch(obj.toUpperCase())
    {
        default:
            return false
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
        case "A":
        case "B":
        case "C":
        case "D":
        case "E":
        case "F":
            return true
    }
}

export function get_hex_part(string: string): string
{
    let offset = 0
    if(string.startsWith("#") || string.startsWith("$"))
        offset = 1
    if(string.startsWith("0x"))
        offset = 2
    return string.substring(offset)
}

export function check_hex(obj: unknown): obj is HexLike
{
    if(!check_string(obj))
        return false
    const value = get_hex_part(obj).split("").map((char) => parseInt(char.toUpperCase(),16))
    return check_number_array(value)
}

export function check_string(obj: unknown): obj is string
{
    return obj != null && typeof obj == "string" && obj.length > 0
}

export function check_array<T>(obj: unknown,predicate?: Predicate<T>,requiredLength?: number): obj is Array<T>
{
    if(!Array.isArray(obj)) return false
    if(requiredLength && requiredLength != obj.length) return false
    for(const item of obj)
        if(predicate && !predicate(item))
            return false
    return true
}

export function check_number_array(obj: unknown,requiredLength?: number): obj is Array<number>
{
    return check_array(obj, check_number, requiredLength)
}

export function check_string_array(obj: unknown,requiredLength?: number): obj is Array<string>
{
    return check_array(obj, check_string, requiredLength)
}

export function has_property<Obj,Name extends string,Type extends JavaScriptTypes>(obj: Obj,name: Name,type: Type): obj is Obj & {[name in Name]: JavaScriptTypeMap[Type]}
{
    return obj != null && typeof obj == "object" && name in obj && typeof (obj as any)[name] == type
}