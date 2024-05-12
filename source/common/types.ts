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
export type Predicate<T> = (a: unknown) => a is T

export function check_number(obj: unknown): obj is number
{
    return obj != null && typeof obj == "number" && !isNaN(obj)
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