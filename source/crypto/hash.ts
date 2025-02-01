import { stringify } from "../common/string"

export const DJB2_OFFSET = 5381n

export function djb2<V>(value: V)
{
    const string = stringify(value)
    let hash = DJB2_OFFSET
    for(let i = 0;i < string.length;i++)
    {
        hash = ((hash << 5n) + hash) + BigInt(string.charCodeAt(i))
    }
    return hash
}

export const FNV1_OFFSET = 14695981039346656037n
export const FNV1_PRIME = 1099511628211n

export function fnv1<V>(value: V)
{
    const string = stringify(value)
    let hash = FNV1_OFFSET
    for(let i = 0;i < string.length;i++)
    {
        hash *= FNV1_PRIME
        hash ^= BigInt(string.charCodeAt(i))
    }
    return hash
}

export function sdbm<V>(value: V)
{
    const string = stringify(value)
    let hash = 0n
    for(let i = 0;i < string.length;i++)
    {
        hash =  BigInt(string.charCodeAt(i)) + (hash << 6n) + (hash << 16n) - hash
    }
    return hash
}