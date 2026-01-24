import { checkValidNumber, hasTypedProperty, isFixedTypeArray, isValidNumber, isValidString, IToString, NodeJSCustomInspect } from "@ntf/types"
import { ResolveError } from "../common/error"
import { Vec2, Vec2Arguments, Vec2Like } from "../vectors/vec2"
import { Circle, CircleArguments, CircleLike } from "./circle"
import { IRectangle, IToRectangle, RectangleLike } from "./rectangle"
import { SizeLike } from "./size"

export interface IBoundingBox
{
    left: number
    right: number
    top: number
    bottom: number
}

export interface IToBoundingBox
{
    toBoundingBox(): BoundingBoxLike
}

export type BoundingBoxArray = [number,number,number,number]
export type BoundingBoxString = `${number},${number},${number},${number}`
export type BoundingBoxLike = IBoundingBox | BoundingBoxArray | BoundingBoxString | IToBoundingBox | number
export type BoundingBoxArgs = [bbox: BoundingBoxLike] | BoundingBoxArray

export class BoundingBox implements IBoundingBox, IRectangle, IToRectangle, IToString
{
    public left: number
    public right: number
    public top: number
    public bottom: number
    public get width(): number {return this.right - this.left}
    public set width(val: number) {this.right = this.left + val}
    public get height(): number {return this.bottom - this.top}
    public set height(val: number) {this.bottom = this.top + val}
    public get x(): number {return this.left}
    public set x(x: number) {this.left = x}
    public get y(): number {return this.top}
    public set y(y: number) {this.top = y}
    public w: number = 1
    public static resolve(a: unknown): BoundingBox
    {
        const value = this.cast(a)
        if(typeof value != "undefined")
            return value
        throw new ResolveError("BoundingBox",a)
    }
    public static resolveArgs(args: BoundingBoxArgs): BoundingBox
    {
        if(isFixedTypeArray(args,isValidNumber,4))
            return new this(args[0],args[1],args[2],args[3])
        return this.resolve(args[0])
    }
    public static cast(a: unknown): BoundingBox | undefined
    {
        if(a == null || typeof a == "undefined")
            return undefined
        if(isValidString(a))
        {
            const parts = a.split(",")
            if(isFixedTypeArray(parts,isValidString,4))
                return this.cast(parts.map((v) => parseFloat(v)))
        }
        if(isValidNumber(a))
            return new this(a,a,a,a)
        if(isFixedTypeArray(a,isValidNumber,4))
            return new this(a[0]!,a[1]!,a[2]!,a[3]!)
        if(hasTypedProperty(a,"toBoundingBox","function"))
            return this.cast(a.toBoundingBox())
        if(hasTypedProperty(a,"left","number") && hasTypedProperty(a,"right","number") && hasTypedProperty(a,"top","number") && hasTypedProperty(a,"bottom","number"))
            return new this(a.left,a.right,a.top,a.bottom)
        return undefined
    }
    public static is(a: unknown): a is BoundingBoxLike
    {
        return typeof this.cast(a) != "undefined"
    }
    public constructor(left: number,right: number,top: number,bottom: number)
    {
        checkValidNumber(left)
        checkValidNumber(right)
        checkValidNumber(top)
        checkValidNumber(bottom)
        this.left = left
        this.right = right
        this.top = top
        this.bottom = bottom
    }
    public toArray(): BoundingBoxArray
    {
        return [this.left,this.right,this.top,this.bottom]
    }
    public toString(): BoundingBoxString
    {
        return `${this.left},${this.right},${this.top},${this.bottom}`
    }
    public get [Symbol.toStringTag](): string
    {
        return "BoundingBox"
    }
    public [NodeJSCustomInspect](): string
    {
        return `BoundingBox <${this.toString()}>`
    }
    public toJSON(): IBoundingBox
    {
        return {
            left: this.left,top: this.top,
            right: this.right,bottom: this.bottom
        }
    }
    public clone(): BoundingBox
    {
        return new BoundingBox(this.left,this.right,this.top,this.bottom)
    }
    public equals(bbox: BoundingBoxLike): boolean
    public equals(left: number,right: number,top: number,bottom: number): boolean
    public equals(...args: BoundingBoxArgs): boolean
    {
        const b = BoundingBox.resolveArgs(args)
        return this.left === b.left && this.right === b.right && this.top === b.top && this.bottom === b.bottom
    }
    public toSize(): SizeLike
    {
        return [this.width,this.height]
    }
    public toVec2(): Vec2Like
    {
        return [this.left,this.top]
    }
    public toRectangle(): RectangleLike
    {
        return [this.left,this.top,this.width,this.height]
    }
    public inside(bbox: BoundingBoxLike): boolean
    public inside(left: number,right: number,top: number,bottom: number): boolean
    public inside(...args: BoundingBoxArgs): boolean
    {
        const bbox = BoundingBox.resolve(args)
        return this.right >= bbox.left && bbox.right >= this.left && this.bottom >= bbox.top && bbox.bottom >= this.top
    }
    public insidePoint(point: Vec2Like): boolean
    public insidePoint(x: number,y: number): boolean
    public insidePoint(...args: Vec2Arguments): boolean
    {
        const point = Vec2.resolveArgs(args)
        return this.left <= point.x && this.right >= point.x && this.top <= point.y && this.bottom >= point.y
    }
    public insideCircle(circle: CircleLike): boolean
    public insideCircle(x: number,y: number,radius: number): boolean
    public insideCircle(position: Vec2Like,radius: number): boolean
    public insideCircle(...args: CircleArguments): boolean
    {
        const circle = Circle.resolveArgs(args)
        const center = Vec2.resolve(circle).add(circle.radius)
        const bboxhe = new Vec2(this.width/2,this.height/2)
        const bboxcenter = new Vec2(this.left + bboxhe.x,this.top + bboxhe.y)
        let diff = center.subtract(bboxcenter)
        const clamped = Vec2.clamp(diff,bboxhe.invert(),bboxhe)
        const closest = bboxcenter.add(clamped)
        diff = closest.subtract(center)
        return diff.length() < circle.radius
    }
}