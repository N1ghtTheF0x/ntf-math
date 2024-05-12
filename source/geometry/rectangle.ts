import { ResolveError } from "../common/error"
import { check_number_array, check_string, has_property } from "../common/types"
import { IVec2, Vec2, Vec2Array, Vec2Like, Vec2String } from "../vectors/vec2"
import { BoundingBox } from "./bbox"
import { ISquare, Square, SquareArray, SquareLike, SquareString } from "./square"

export interface IRectangle extends IVec2, ISquare
{

}

export type RectangleArray = [...Vec2Array,...SquareArray]
export type RectangleString = `${Vec2String}|${SquareString}`
export type RectangleLike = IRectangle | RectangleArray | RectangleString

export class Rectangle implements IRectangle
{
    public position: Vec2
    public size: Square
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
        if(a == null || typeof a == "undefined")
            throw new ResolveError("Rectangle",a)
        if(check_number_array(a,4))
            return new this(a[0],a[1],a[2],a[3])
        if(check_number_array(a,5))
        {
            const rect = new this(a[0],a[1],a[3],a[4])
            rect.w = a[2]
            return rect
        }
        if(check_string(a))
        {
            const [spos,ssize] = a.split("|")
            const pos = Vec2.resolve(spos)
            const size = Square.resolve(ssize)
            return new this(pos.x,pos.y,size.width,size.height)
        }
        if(has_property(a,"x","number") && has_property(a,"y","number") && has_property(a,"width","number") && has_property(a,"height","number"))
            return new this(a.x,a.y,a.width,a.height)
        throw new ResolveError("Rectangle",a)
    }
    public static is(a: unknown): a is RectangleLike
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
    public constructor(pos: Vec2Like,size: SquareLike)
    public constructor(x: number,y: number,width: number,height: number)
    public constructor(a: Vec2Like | number,b: SquareLike | number,c?: number,d?: number)
    {
        const vec = Vec2.is(a) ? Vec2.resolve(a) : undefined
        const size = Square.is(b) ? Square.resolve(b) : undefined
        const x = typeof a == "number" ? a : vec?.x
        const y = typeof b == "number" ? b : vec?.y
        const width = typeof c == "number" ? c : size?.width
        const height = typeof d == "number" ? d : size?.height
        if(!x || !y || !width || !height) throw new TypeError
        this.position = new Vec2(x,y)
        this.size = new Square(width,height)
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
    public toBoundingBox()
    {
        return new BoundingBox(this.x,this.x + this.width,this.y,this.y + this.height)
    }
}