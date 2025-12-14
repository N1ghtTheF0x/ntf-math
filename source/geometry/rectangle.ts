import { ResolveError } from "../common/error"
import { IToString } from "../common/string"
import { check_number, check_number_array, check_string, has_property } from "../common/types"
import { IVec2, Vec2, Vec2Array, Vec2Like, Vec2String } from "../vectors/vec2"
import { BoundingBoxLike } from "./bbox"
import { IGeometryObject } from "./object"
import { ISize, Size, SizeArray, SizeLike, SizeString } from "./size"

export interface IRectangle extends IVec2, ISize
{

}

export type RectangleArray = [...Vec2Array,...SizeArray]
export type RectangleString = `${Vec2String}|${SizeString}`
export type RectangleLike = IRectangle | RectangleArray | RectangleString

export class Rectangle implements IRectangle, IGeometryObject, IToString
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
    public static cast(a: unknown): Rectangle | undefined
    {
        if(a == null || typeof a == "undefined")
            return undefined
        if(check_number_array(a,4))
            return new this([a[0],a[1]],[a[2],a[3]])
        if(check_number_array(a,5))
        {
            const rect = new this([a[0],a[1]],[a[3],a[4]])
            rect.w = a[2]
            return rect
        }
        if(check_string(a))
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
        if(has_property(a,"x","number") && has_property(a,"y","number") && has_property(a,"width","number") && has_property(a,"height","number"))
        {
            const rect = new this([a.x,a.y],[a.width,a.height])
            if(has_property(a,"w","number"))
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
    public toArray(w = false): RectangleArray
    {
        return [...this.position.toArray(w),...this.size.toArray()]
    }
    public toString(w = false): RectangleString
    {
        return `${this.position.toString(w)}|${this.size.toString()}`
    }
    public toJSON(): IRectangle
    {
        return {...this.position.toJSON(),...this.size.toJSON()}
    }
    public toBoundingBox(): BoundingBoxLike
    {
        return [this.x,this.x + this.width,this.y,this.y + this.height]
    }
    public clone()
    {
        return new Rectangle(this.position.clone(),this.size.clone())
    }
    public equals(rectangle: RectangleLike)
    {
        const rect = Rectangle.resolve(rectangle)
        return this.position.equals(rect.position) && this.size.equals(rect.size)
    }
}