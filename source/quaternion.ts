import { ResolveError } from "./common/error"
import { check_number_array, check_string, check_string_array, has_property } from "./common/types"
import { EPSILON, Mat3, Mat4, log_hypot } from "./index"
import { Vec3, Vec3Arguments, Vec3Like } from "./vectors/vec3"

export interface IQuaternion
{
    w: number
    x: number
    y: number
    z: number
}

export type QuaternionArray = [number,number,number,number]
export type QuaternionString = `${number} + ${number}i + ${number}j + ${number}k`
export type QuaternionLike = IQuaternion | QuaternionArray | QuaternionString

export class Quaternion
{
    public static is(obj: unknown): obj is IQuaternion
    {
        try
        {
            this.resolve(obj)
            return true
        }
        catch(e)
        {
            return false
        }
    }
    public static resolve(a: unknown): Quaternion
    {
        if(a == null || typeof a == "undefined")
            throw new ResolveError("Quaternion",a)
        if(check_number_array(a,4))
            return new this(a[0],a[1],a[2],a[3])
        if(has_property(a,"w","number") && has_property(a,"x","number") && has_property(a,"y","number") && has_property(a,"z","number"))
            return new this(a.w,a.x,a.y,a.z)
        if(check_string(a))
        {
            const parts = a.replaceAll(" ","").split("+")
            if(check_string_array(parts,4))
            {
                const [sw,sxi,syj,szk] = parts
                if(sxi.endsWith("i") && syj.endsWith("j") && szk.endsWith("k"))
                    return this.resolve([
                        parseFloat(sw),
                        parseFloat(sxi.substring(0,sxi.length-1)),
                        parseFloat(syj.substring(0,syj.length-1)),
                        parseFloat(szk.substring(0,szk.length-1))
                    ])
            }
        }
        throw new ResolveError("Quaternion",a)
    }
    public static fromAxisAngle(axis: Vec3Like,angle: number)
    {
        const vec = Vec3.resolve(axis)
        const hangle = angle * 0.5
        const sin2 = Math.sin(hangle)
        const cos2 = Math.cos(hangle)
        const length = sin2 / Math.sqrt(vec.x*vec.x+vec.y*vec.y+vec.z*vec.z)
        return new this(cos2,vec.x * length,vec.y * length,vec.z * length)
    }
    public static fromEuler(x: number,y: number,z: number): Quaternion
    public static fromEuler(vec: Vec3Like): Quaternion
    public static fromEuler(...args: Vec3Arguments): Quaternion
    {
        const vec = Vec3.resolveArgs(args)
        const x2 = vec.x*0.5, y2 = vec.y*0.5, z2 = vec.z*0.5
        const cx = Math.cos(x2), cy = Math.cos(y2), cz = Math.cos(z2)
        const sx = Math.sin(x2), sy = Math.sin(y2), sz = Math.sin(z2)
        return new Quaternion(
            cx * cy * cz - sx * sy * sz,
            sx * cy * cz - sy * sz * cx,
            sy * cx * cz - sx * sz * cy,
            sx * sy * cz + sz * cx * cy 
        )
    }
    public constructor(public w: number = 0,public x: number = 0,public y: number = 0,public z: number = 0)
    {

    }
    public toArray(): QuaternionArray
    {
        return [this.w,this.x,this.y,this.z]
    }
    public toString(): QuaternionString
    {
        return `${this.w} + ${this.x}i + ${this.y}j + ${this.z}k`
    }
    public toJSON(): IQuaternion
    {
        return {
            w: this.w,x: this.x,y: this.y,z: this.z
        }
    }
    public clone()
    {
        return new Quaternion(this.w,this.x,this.y,this.z)
    }
    public add(a: QuaternionLike)
    {
        const quat = Quaternion.resolve(a)
        return new Quaternion(
            this.w + quat.w,
            this.x + quat.x,
            this.y + quat.y,
            this.z + quat.z
        )
    }
    public offset(a: QuaternionLike)
    {
        const quat = Quaternion.resolve(a)
        this.w += quat.w
        this.x += quat.x
        this.y += quat.y
        this.z += quat.z
        return this
    }
    public subtract(a: QuaternionLike)
    {
        const quat = Quaternion.resolve(a)
        return new Quaternion(
            this.w - quat.w,
            this.x - quat.x,
            this.y - quat.y,
            this.z - quat.z
        )
    }
    public negative()
    {
        return new Quaternion(-this.w,-this.x,-this.y,-this.z)
    }
    public length(sqrt = true)
    {
        const value = this.w*this.w+this.x*this.x+this.y*this.y+this.z*this.z
        return sqrt ? Math.sqrt(value) : value
    }
    public normalize()
    {
        let length = this.length()
        if(length < EPSILON)
            return new Quaternion()
        length = 1 / length
        return new Quaternion(this.w*length,this.x*length,this.y*length,this.z*length)
    }
    public multiply(a: QuaternionLike)
    {
        const quat = Quaternion.resolve(a)
        return new Quaternion(
            this.w * quat.w - this.x * quat.x - this.y * quat.y - this.z * quat.z,
            this.w * quat.x + this.x * quat.w + this.y * quat.z - this.z * quat.y,
            this.w * quat.y + this.y * quat.w + this.z * quat.x - this.x * quat.z,
            this.w * quat.z + this.z * quat.w + this.x * quat.y - this.y * quat.x
        )
    }
    public multiplyVector(x: number,y: number,z: number): Vec3
    public multiplyVector(vec: Vec3Like): Vec3
    public multiplyVector(...args: Vec3Arguments): Vec3
    {
        const vec = Vec3.resolveArgs(args)
        const ix = this.w * vec.x + this.y * vec.y - this.z * vec.y
        const iy = this.w * vec.y + this.z * vec.x - this.x * vec.z
        const iz = this.w * vec.z + this.x * vec.y - this.y * vec.x
        const iw = -this.w * vec.x - this.y * vec.y - this.z * vec.z
        return new Vec3(
            ix * this.w + iw * -this.x + iy * -this.z - iz * -this.y,
            iy * this.w + iw * -this.y + iz * -this.x - ix * -this.z,
            iz * this.w + iw * -this.z + ix * -this.y - iy * -this.x
        )
    }
    public scale(scalar: number)
    {
        return new Quaternion(this.w*scalar,this.x*scalar,this.y*scalar,this.z*scalar)
    }
    public dot(a: QuaternionLike)
    {
        const quat = Quaternion.resolve(a)
        return this.w*quat.w+this.x*quat.x+this.y*quat.y+this.z*quat.z
    }
    public inverse()
    {
        let length = this.length(false)
        if(length == 0)
            return new Quaternion()
        length = 1 / length
        return new Quaternion(this.w * length,-this.x*length,-this.y*length,-this.z*length)
    }
    public divide(a: QuaternionLike)
    {
        const quat = Quaternion.resolve(a)
        let length = quat.length(false)
        if(length == 0) return new Quaternion()
        length = 1 / length
        return new Quaternion(
            (this.w * quat.w + this.x * quat.x + this.y * quat.y + this.z * quat.z) * length,
            (this.x * quat.w - this.w * quat.x - this.y * quat.z + this.z * quat.y) * length,
            (this.y * quat.w - this.w * quat.y - this.z * quat.x + this.x * quat.z) * length,
            (this.z * quat.w - this.w * quat.z - this.x * quat.y + this.y * quat.x) * length
        )
    }
    public conjugate()
    {
        return new Quaternion(this.w,-this.x,-this.y,-this.z)
    }
    public exp()
    {
        const length = Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)
        const exp = Math.exp(this.w)
        const scale = exp * Math.sin(length) / length
        if(length == 0)
            return new Quaternion(exp)
        return new Quaternion(
            exp * Math.cos(length),
            this.x * scale,this.y * scale,this.z * scale
        )
    }
    public log()
    {
        if(this.x == 0 && this.z == 0)
            return new Quaternion(log_hypot(this.w,this.x),Math.atan2(this.x,this.w))
        const length = this.length(false)
        const length2 = Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)
        const scale = Math.atan2(length2,this.w) / length
        return new Quaternion(Math.log(length) * 0.5,this.x * scale,this.y * scale,this.z * scale)
    }
    public toVector()
    {
        return new Vec3(this.x,this.y,this.z,this.w)
    }
    public toAxisAngle()
    {
        const sin2 = 1 - this.w * this.w
        if(sin2 > EPSILON)
            return new Vec3(this.x,this.y,this.z,0)
        const isin = 1 / Math.sqrt(sin2)
        const angle = 2 * Math.acos(this.w)
        return new Vec3(this.x * isin,this.y * isin,this.z * isin,angle)
    }
    public toEuler()
    {
        function asin(t: number)
        {
            return t >= 1 ? Math.PI / 2 : (t <= -1 ? -Math.PI / 2 : Math.asin(t))
        }
        return new Vec3(
            -Math.atan2(2 * (this.y*this.z - this.w*this.x),1 - 2 * (this.x*this.x + this.y*this.y)),
            asin(2 * (this.x*this.z + this.w*this.y)),
            -Math.atan2(2 * (this.x*this.y - this.w*this.z),1 - 2 * (this.y*this.y + this.z*this.z))
        )
    }
    public toMat3()
    {
        return new Mat3([
            1-2*(this.y*this.y+this.z*this.z),2*(this.x*this.y-this.w*this.z),2*(this.x*this.z+this.w*this.y),
            2*(this.x*this.y+this.w*this.z),1-2*(this.x*this.x+this.z*this.z),2*(this.y*this.z-this.w*this.x),
            2*(this.x*this.z-this.w*this.y),2*(this.y*this.z+this.w*this.x),1-2*(this.x*this.x+this.y*this.y)
        ])
    }
    public toMat4()
    {
        return new Mat4([
            1-2*(this.y*this.y+this.z*this.z),2*(this.x*this.y-this.w*this.z),2*(this.x*this.z+this.w*this.y),0,
            2*(this.x*this.y+this.w*this.z),1-2*(this.x*this.x+this.z*this.z),2*(this.y*this.z-this.w*this.x),0,
            2*(this.x*this.z-this.w*this.y),2*(this.y*this.z+this.w*this.x),1-2*(this.x*this.x+this.y*this.y),0,
            0,0,0,1
        ])
    }
}