import { ResolveError } from "../common/error"
import { IVec2, Vec2} from "./vec2"
import { check_number_array, check_number, check_string, check_string_array, has_property } from "../common/types"
import { clamp } from "../index"


export interface IVec3 extends IVec2
{
    z: number
}

export type Vec3Array = [number,number,number] | [number,number,number,number]
export type Vec3String = `${number},${number},${number}` | `${number},${number},${number};${number}`
export type Vec3Like = IVec3 | Vec3Array | Vec3String | number
export type Vec3Arguments = [Vec3Like] | [number,number,number]

export class Vec3 implements IVec3
{
    public x: number
    public y: number
    public z: number
    public w: number
    public static resolve(a: unknown): Vec3
    {
        const value = this.cast(a)
        if(typeof value != "undefined")
            return value
        throw new ResolveError("Vec3",a)
    }
    public static cast(a: unknown): Vec3 | undefined
    {
        if(a == null || typeof a == "undefined")
            return undefined
        if(check_number_array(a,3) || check_number_array(a,4))
            return new this(a[0],a[1],a[2],check_number(a[3]) ? a[3] : undefined)
        if(has_property(a,"x","number") && has_property(a,"y","number") && has_property(a,"z","number"))
            return new this(a.x,a.y,a.z,has_property(a,"w","number") ? a.w : undefined)
        if(check_string(a))
        {
            const [sxyz,sw] = a.split(";")
            if(check_string(sxyz))
            {
                const parts = sxyz.split(",")
                if(check_string_array(parts,3))
                    return new this(parseFloat(parts[0]),parseFloat(parts[1]),parseFloat(parts[2]),check_string(sw) ? parseFloat(sw) : undefined)
            }
        }
        if(check_number(a))
            return new this(a,a,a)
        return undefined
    }
    public static resolveArgs(args: Vec3Arguments)
    {
        if(check_number_array(args,3))
            return new this(args[0],args[1],args[2])
        return this.resolve(args[0])
    }
    public static is(a: unknown): a is Vec3Like
    {
        return typeof this.cast(a) != "undefined"
    }
    public static fromPoints(a: Vec3Like,b: Vec3Like)
    {
        const veca = this.resolve(a)
        const vecb = this.resolve(b)
        return new this(vecb.x - veca.x,vecb.y - veca.y,vecb.z - veca.z)
    }
    public static clamp(value: Vec3Like,min: Vec3Like,max: Vec3Like)
    {
        const a = this.resolve(value), b = this.resolve(min), c = this.resolve(max)
        return new this(
            clamp(a.x,b.x,c.x),
            clamp(a.y,b.y,c.y),
            clamp(a.z,b.z,c.z)
        )
    }
    public static intersectPlane(planeP: Vec3Like,planeN: Vec3Like,lineStart: Vec3Like,lineEnd: Vec3Like,t: number)
    {
        planeN = this.resolve(planeN).normalize()
        const plane_d = -this.resolve(planeN).dot(planeP)
        const ad = this.resolve(lineStart).dot(planeN)
        const bd = this.resolve(lineEnd).dot(planeN)
        t = (-plane_d - ad) / (bd - ad)
        const lineStartToEnd = this.resolve(lineEnd).subtract(lineStart)
        const linetoIntersect = lineStartToEnd.multiply(t)
        return Vec3.resolve(lineStart).add(linetoIntersect)
    }
    public constructor(x: number = 0,y: number = 0,z: number = 0,w: number = 1)
    {
        if(!check_number(x))
            throw new TypeError("expected number for x")
        if(!check_number(y))
            throw new TypeError("expected number for y")
        if(!check_number(z))
            throw new TypeError("expected number for z")
        if(!check_number(w))
            throw new TypeError("expected number for w")
        this.x = x
        this.y = y
        this.z = z
        this.w = w
    }
    public toArray(w = false): Vec3Array
    {
        return w ? [this.x,this.y,this.z] : [this.x,this.y,this.z,this.w]
    }
    public toJSON(): IVec3
    {
        return {
            x: this.x,y: this.y,z: this.z,w: this.w
        }
    }
    public toString(w = false): Vec3String
    {
        return w ? `${this.x},${this.y},${this.z}` : `${this.x},${this.y},${this.z};${this.w}`
    }
    public toVec2()
    {
        return new Vec2(this.x,this.y,this.w)
    }
    public clone()
    {
        return new Vec3(this.x,this.y,this.z,this.w)
    }
    public equals(vec: Vec3Like)
    {
        const a = Vec3.resolve(vec)
        return this.x == a.x && this.y == a.y && this.z == a.z
    }
    public setX(x: number)
    {
        this.x = x
        return this
    }
    public setY(y: number)
    {
        this.y = y
        return this
    }
    public setZ(z: number)
    {
        this.z = z
        return this
    }
    public set(x: number,y: number,z: number): this
    public set(vec: Vec3Like): this
    public set(...args: Vec3Arguments): this
    {
        const vec = Vec3.resolveArgs(args)
        return this.setX(vec.x).setY(vec.y).setZ(vec.z)
    }
    public add(x: number,y: number,z: number): Vec3
    public add(vec: Vec3Like): Vec3
    public add(...args: Vec3Arguments): Vec3
    {
        const vec = Vec3.resolveArgs(args)
        return new Vec3(
            this.x + vec.x,
            this.y + vec.y,
            this.z + vec.z
        )
    }
    public offset(x: number,y: number,z: number): this
    public offset(vec: Vec3Like): this
    public offset(...args: Vec3Arguments): this
    {
        const vec = Vec3.resolveArgs(args)
        this.x += vec.x
        this.y += vec.y
        this.z += vec.z
        return this
    }
    public subtract(x: number,y: number,z: number): Vec3
    public subtract(vec: Vec3Like): Vec3
    public subtract(...args: Vec3Arguments): Vec3
    {
        const vec = Vec3.resolveArgs(args)
        return new Vec3(
            this.x - vec.x,
            this.y - vec.y,
            this.z - vec.z
        )
    }
    public multiply(scalar: number)
    {
        return new Vec3(
            this.x * scalar,
            this.y * scalar,
            this.z * scalar
        )
    }
    public naiveMultiply(x: number,y: number,z: number): Vec3
    public naiveMultiply(vec: Vec3Like): Vec3
    public naiveMultiply(...args: Vec3Arguments): Vec3
    {
        const vec = Vec3.resolveArgs(args)
        return new Vec3(
            this.x * vec.x,
            this.y * vec.y,
            this.z * vec.z
        )
    }
    public divide(x: number,y: number,z: number): Vec3
    public divide(scalar: number): Vec3
    public divide(vec: Vec3Like): Vec3
    public divide(...args: Vec3Arguments | [number]): Vec3
    {
        if(check_number_array(args,1))
            return new Vec3(
                this.x / args[0],
                this.y / args[0],
                this.z / args[0]
            )
        const vec = Vec3.resolveArgs(args)
        return new Vec3(
            this.x / vec.x,
            this.y / vec.y,
            this.z / vec.z
        )
    }
    public dot(x: number,y: number,z: number): number
    public dot(vec: Vec3Like): number
    public dot(...args: Vec3Arguments)
    {
        const vec = Vec3.resolveArgs(args)
        return this.x*vec.x+this.y*vec.y+this.z*vec.z
    }
    public cross(x: number,y: number,z: number): Vec3
    public cross(vec: Vec3Like): Vec3
    public cross(...args: Vec3Arguments): Vec3
    {
        const vec = Vec3.resolveArgs(args)
        return new Vec3(
            this.y*vec.z - this.z*vec.y,
            this.z*vec.x - this.x*vec.z,
            this.x*vec.y - this.y*vec.x
        )
    }
    public distance(x: number,y: number,z: number): number
    public distance(vec: Vec3Like): number
    public distance(...args: Vec3Arguments): number
    {
        const vec = Vec3.resolveArgs(args)
        return Math.pow(vec.x - this.x,2) + Math.pow(vec.y - this.y,2) + Math.pow(vec.z - this.z,2)
    }
    public distanceSquare(x: number,y: number,z: number): number
    public distanceSquare(vec: Vec3Like): number
    public distanceSquare(...args: Vec3Arguments): number
    {
        const vec = Vec3.resolveArgs(args)
        return Math.sqrt(Math.pow(vec.x - this.x,2) + Math.pow(vec.y - this.y,2) + Math.pow(vec.z - this.z,2))
    }
    public length()
    {
        return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)
    }
    public normalize()
    {
        const length = this.length()
        if(length == 0) return new Vec3
        return new Vec3(
            this.x / length,
            this.y / length,
            this.z / length
        )
    }
    public invert()
    {
        return this.multiply(-1)
    }
    public round()
    {
        return new Vec3(Math.round(this.x),Math.round(this.y),Math.round(this.z),Math.round(this.w))
    }
}