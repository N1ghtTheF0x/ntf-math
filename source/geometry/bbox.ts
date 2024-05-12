import { ResolveError } from "../common/error"
import { check_number_array, check_string, check_string_array, has_property } from "../common/types"
import { Vec2, Vec2Like } from "../vectors/vec2"
import { Circle, CircleLike, ICircle } from "./circle"
import { Rectangle } from "./rectangle"
import { ISquare, Square } from "./square"

export interface IBoundingBox
{
    left: number
    right: number
    top: number
    bottom: number
}

export type BoundingBoxArray = [number,number,number,number]
export type BoundingBoxString = `${number},${number},${number},${number}`
export type BoundingBoxLike = IBoundingBox | BoundingBoxArray | BoundingBoxString

export class BoundingBox implements IBoundingBox, ISquare
{
    public get width(){return this.right - this.left}
    public set width(val){this.right = this.left + val}
    public get height(){return this.bottom - this.top}
    public set height(val){this.bottom = this.top + val}
    public static resolve(a: unknown): BoundingBox
    {
        if(a == null || typeof a == "undefined")
            throw new ResolveError("BoundingBox",a)
        if(check_number_array(a,4))
            return new this(a[0],a[1],a[2],a[3])
        if(has_property(a,"left","number") && has_property(a,"right","number") && has_property(a,"top","number") && has_property(a,"bottom","number"))
            return new this(a.left,a.right,a.top,a.bottom)
        if(check_string(a))
        {
            const parts = a.split(",")
            if(check_string_array(parts,4))
                return this.resolve(parts.map((v) => parseFloat(v)))
        }
        throw new ResolveError("BoundingBox",a)
    }
    public static is(a: unknown): a is BoundingBoxLike
    {
        try
        {
            this.resolve(a)
        }
        catch(e)
        {
            return false
        }
        return true
    }
    public constructor(public left: number,public right: number,public top: number,public bottom: number)
    {

    }
    public toArray(): BoundingBoxArray
    {
        return [this.left,this.right,this.top,this.bottom]
    }
    public toString(): BoundingBoxString
    {
        return `${this.left},${this.right},${this.top},${this.bottom}`
    }
    public toJSON(): IBoundingBox
    {
        return {
            left: this.left,top: this.top,
            right: this.right,bottom: this.bottom
        }
    }
    public toSquare()
    {
        return new Square(this.width,this.height)
    }
    public toRectangle()
    {
        return new Rectangle(this.left,this.top,this.width,this.height)
    }
    public inside(a: BoundingBoxLike)
    {
        const bbox = BoundingBox.resolve(a)
        return this.right >= bbox.left && bbox.right >= this.left && this.bottom >= bbox.top && bbox.bottom >= this.top
    }
    public insidePoint(a: Vec2Like)
    {
        const point = Vec2.resolve(a)
        return this.left <= point.x && this.right >= point.x && this.top >= point.y && this.bottom <= point.y
    }
    public insideCircle(a: CircleLike)
    {
        const circle = Circle.resolve(a)
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