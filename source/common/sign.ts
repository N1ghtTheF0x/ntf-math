export function sign_char(num: number | bigint)
{
    if(num == 0)
        return undefined
    if(num < 0)
        return "-"
    if(num > 0)
        return "+"
    return undefined
}