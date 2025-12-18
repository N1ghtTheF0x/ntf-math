import { FixedArray } from "@ntf/types"

export function numberToRGB(number: number): FixedArray<number,3>
{
    const blue = number & 0xff
    const green = (number & 0xff00) >>> 8
    const red = (number & 0xff0000) >>> 16
    return [red/0xff,green/0xff,blue/0xff]
}

export function numberToRGBA(number: number): FixedArray<number,4>
{
    const alpha = number & 0xff
    const blue = (number & 0xff00) >>> 8
    const green = (number & 0xff0000) >>> 16
    const red = (number & 0xff000000) >>> 24
    return [red/0xff,green/0xff,blue/0xff,alpha/0xff]
}