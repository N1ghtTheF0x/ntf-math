import { FixedArray } from "@ntf/types"

export function numberToRGB(number: number): FixedArray<number,3>
{
    const short = number < 0x1000
    const blue = short ? number & 0xf : number & 0xff
    const green = short ? (number & 0xf0) >>> 4 : (number & 0xff00) >>> 8
    const red = short ? (number & 0xf00) >>> 8 : (number & 0xff0000) >>> 16
    return [red/0xff,green/0xff,blue/0xff]
}

export function numberToRGBA(number: number): FixedArray<number,4>
{
    const short = number < 0x10000
    const alpha = short ? number & 0xf : number & 0xff
    const blue = short ? (number & 0xf0) >>> 4 : (number & 0xff00) >>> 8
    const green = short ? (number & 0xf00) >>> 8 : (number & 0xff0000) >>> 16
    const red = short ? (number & 0xf000) >>> 12 : (number & 0xff000000) >>> 24
    return [red/0xff,green/0xff,blue/0xff,alpha/0xff]
}

export type HexColorPrefix = "$" | "#" | "0x"
export type HexColor = `${HexColorPrefix}${string}`

export function isHexNumber(hex: string): hex is HexColor
{
    hex = hex.trim()
    return ["$","#"].includes(hex[0] ?? "") || hex.startsWith("0x")
}

function __parse_hex__(hex: string): string
{
    hex = hex.trim()
    return ["$","#"].includes(hex[0] ?? "") ? hex.substring(1) : (hex.startsWith("0x") ? hex.substring(2) : hex)
}

export function hasHexNumberAlpha(hex: string): boolean
{
    const v = __parse_hex__(hex)
    return [4,8].includes(v.length)
}

export function hexNumberToRGB(hex: HexColor): FixedArray<number,3>
{
    const value = __parse_hex__(hex)
    const short = value.length === 3
    const red = parseInt(short ? value[0]! : value.substring(0,2),16)
    const green = parseInt(short ? value[1]! : value.substring(2,4),16)
    const blue = parseInt(short ? value[2]! : value.substring(4,6),16)
    return [red/0xff,green/0xff,blue/0xff]
}

export function hexNumberToRGBA(hex: HexColor): FixedArray<number,4>
{
    const value = __parse_hex__(hex)
    const short = value.length === 4
    const red = parseInt(short ? value[0]! : value.substring(0,2),16)
    const green = parseInt(short ? value[1]! : value.substring(2,4),16)
    const blue = parseInt(short ? value[2]! : value.substring(4,6),16)
    const alpha = parseInt(short ? value[3]! : value.substring(6,8),16)
    return [red/0xff,green/0xff,blue/0xff,alpha/0xff]
}