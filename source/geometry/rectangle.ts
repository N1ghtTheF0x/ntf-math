import { ResolveError } from "../common/error"
import { isValidString, hasTypedProperty, NodeJSCustomInspect, isFixedTypeArray, isValidNumber } from "@ntf/types"
import { IToVec2, IVec2, Vec2, Vec2Array, Vec2Like, Vec2String } from "../vectors/vec2"
import { BoundingBoxLike, IToBoundingBox } from "./bbox"
import { IGeometryObject } from "./object"
import { ISize, IToSize, Size, SizeArray, SizeLike, SizeString } from "./size"

export interface IRectangle extends IVec2, ISize
{

}

export interface IToRectangle
{
    toRectangle(): RectangleLike
}

export type RectangleArray = [...Vec2Array,...SizeArray]
export type RectangleString = `${Vec2String}|${SizeString}`
export type RectangleLike = IRectangle | RectangleArray | RectangleString | IToRectangle
export type RectangleArguments = [rectangle: RectangleLike] | [position: Vec2Like,size: SizeLike] | RectangleArray

export class Rectangle implements IRectangle, IGeometryObject, IToBoundingBox, IToVec2, IToSize
{
    public position: Vec2
    public size: Size
    public get area(){return this.width*this.height}
    public get perimeter(){return this.width+this.width+this.height+this.height}
    public get x(){return this.position.x}
    public set x(val){this.position.x = val}
    public get y(){return this.position.y}
    public set y(val){this.position.y = val}
    public get w(){return this.position.w}
    public set w(val){this.position.w = val}
    public get width(){return this.size.width}
    public set width(val){this.size.width = val}
    public get height(){return this.size.height}
    public set height(val){this.size.height = val}
    public static resolve(a: unknown): Rectangle
    {
        const value = this.cast(a)
        if(typeof value != "undefined")
            return value
        throw new ResolveError("Rectangle",a)
    }
    public static resolveArgs(args: RectangleArguments): Rectangle
    {
        if(isFixedTypeArray(args,isValidNumber,4))
            return new this([args[0],args[1]],[args[2],args[3]])
        return this.resolve(args[0])
    }
    public static cast(a: unknown): Rectangle | undefined
    {
        if(a == null || typeof a == "undefined")
            return undefined
        if(isValidString(a))
        {
            const [spos,ssize] = a.split("|")
            const pos = Vec2.cast(spos)
            const size = Size.cast(ssize)
            if(typeof pos == "undefined" || typeof size == "undefined")
                return undefined
            const rect = new this([pos.x,pos.y],[size.width,size.height])
            rect.w = pos.w
            return rect
        }
        if(isFixedTypeArray(a,isValidNumber,4))
            return new this([a[0]!,a[1]!],[a[2]!,a[3]!])
        if(isFixedTypeArray(a,isValidNumber,5))
        {
            const rect = new this([a[0]!,a[1]!],[a[3]!,a[4]!])
            rect.w = a[2]!
            return rect
        }
        if(hasTypedProperty(a,"toRectangle","function"))
            return this.cast(a.toRectangle())
        if(hasTypedProperty(a,"x","number") && hasTypedProperty(a,"y","number") && hasTypedProperty(a,"width","number") && hasTypedProperty(a,"height","number"))
        {
            const rect = new this([a.x,a.y],[a.width,a.height])
            if(hasTypedProperty(a,"w","number"))
                rect.w = a.w
            return rect
        }
        return undefined
    }
    public static is(a: unknown): a is RectangleLike
    {
        return typeof this.cast(a) != "undefined"
    }
    public constructor(pos: Vec2Like,size: SizeLike)
    {
        this.position = Vec2.resolve(pos)
        this.size = Size.resolve(size)
    }
    public toArray(w: boolean = this.w !== 1): RectangleArray
    {
        return [...this.position.toArray(w),...this.size.toArray()]
    }
    public toString(w: boolean = this.w !== 1): RectangleString
    {
        return `${this.position.toString(w)}|${this.size.toString()}`
    }
    public get [Symbol.toStringTag](): string
    {
        return "Rectangle"
    }
    public [NodeJSCustomInspect](): string
    {
        return `Rectangle <${this.toString()}>`
    }
    public toJSON(): IRectangle
    {
        return {...this.position.toJSON(),...this.size.toJSON()}
    }
    public toBoundingBox(): BoundingBoxLike
    {
        return [this.x,this.x + this.width,this.y,this.y + this.height]
    }
    public toVec2(): Vec2Like
    {
        return [this.x,this.y,this.w]
    }
    public toSize(): SizeLike
    {
        return [this.width,this.height]
    }
    public clone(): Rectangle
    {
        return new Rectangle(this.position.clone(),this.size.clone())
    }
    public equals(rectangle: RectangleLike): boolean
    public equals(position: Vec2Like,size: SizeLike): boolean
    public equals(x: number,y: number,width: number,height: number): boolean
    public equals(...args: RectangleArguments): boolean
    {
        const rect = Rectangle.resolveArgs(args)
        return this.position.equals(rect.position) && this.size.equals(rect.size)
    }
}