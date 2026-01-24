import { ResolveError } from "../common/error"
import { isValidNumber, isValidString, hasTypedProperty, NodeJSCustomInspect, IToString, isFixedTypeArray, checkValidNumber } from "@ntf/types"
import { IToMat3, Mat3Like } from "../matrices/mat3"
import { IToMat4, Mat4Like } from "../matrices/mat4"
import { EPSILON, logHypot } from "../utils"
import { IToVec3, Vec3, Vec3Arguments, Vec3Like } from "../vectors/vec3"

export interface IQuaternion
{
    w: number
    x: number
    y: number
    z: number
}

export interface IToQuaternion
{
    toQuaternion(): QuaternionLike
}

export type QuaternionArray = [number,number,number,number]
export type QuaternionString = `${number} + ${number}i + ${number}j + ${number}k`
export type QuaternionLike = IQuaternion | QuaternionArray | QuaternionString | IToQuaternion
export type QuaternionArguments = QuaternionArray | [quaternion: QuaternionLike]

export class Quaternion implements IToVec3, IToMat3, IToMat4, IToString
{
    public w: number
    public x: number
    public y: number
    public z: number
    public static is(a: unknown): a is IQuaternion
    {
        return typeof this.cast(a) != "undefined"
    }
    public static resolve(a: unknown): Quaternion
    {
        const value = this.cast(a)
        if(typeof value != "undefined")
            return value
        throw new ResolveError("Quaternion",a)
    }
    public static resolveArgs(args: QuaternionArguments): Quaternion
    {
        if(isFixedTypeArray(args,isValidNumber,4))
            return new this(args[0],args[1],args[2],args[3])
        return this.resolve(args[0])
    }
    public static cast(a: unknown): Quaternion | undefined
    {
        if(a == null || typeof a == "undefined")
            return undefined
        if(isFixedTypeArray(a,isValidNumber,4))
            return new this(a[0]!,a[1]!,a[2]!,a[3]!)
        if(hasTypedProperty(a,"toQuaternion","function"))
            return this.cast(a.toQuaternion())
        if(hasTypedProperty(a,"w","number") && hasTypedProperty(a,"x","number") && hasTypedProperty(a,"y","number") && hasTypedProperty(a,"z","number"))
            return new this(a.w,a.x,a.y,a.z)
        if(isValidString(a))
        {
            const parts = a.replaceAll(" ","").split("+")
            if(isFixedTypeArray(parts,isValidString,4))
            {
                const [sw,sxi,syj,szk] = parts
                if(sw && sxi?.endsWith("i") && syj?.endsWith("j") && szk?.endsWith("k"))
                    return this.cast([
                        parseFloat(sw),
                        parseFloat(sxi.substring(0,sxi.length-1)),
                        parseFloat(syj.substring(0,syj.length-1)),
                        parseFloat(szk.substring(0,szk.length-1))
                    ])
            }
        }
        return undefined
    }
    public static fromAxisAngle(axis: Vec3Like,angle: number): Quaternion
    public static fromAxisAngle(x: number,y: number,z: number,angle: number): Quaternion
    public static fromAxisAngle(...args: [æxis: Vec3Like,angle: number] | [x: number,y: number,z: number,angle: number])
    {
        const axis = isFixedTypeArray(args,isValidNumber,4) ? new Vec3(args[0],args[1],args[2]) : Vec3.resolve(args[0])
        const angle = isFixedTypeArray(args,isValidNumber,4) ? args[3] : args[1]
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
    public static get zero(): Quaternion {return new Quaternion(0,0,0,0)}
    public constructor(w: number,x: number,y: number,z: number)
    {
        checkValidNumber(w)
        checkValidNumber(x)
        checkValidNumber(y)
        checkValidNumber(z)
        this.w = w
        this.x = x
        this.y = y
        this.z = z
    }
    public toArray(): QuaternionArray
    {
        return [this.w,this.x,this.y,this.z]
    }
    public toString(): QuaternionString
    {
        return `${this.w} + ${this.x}i + ${this.y}j + ${this.z}k`
    }
    public get [Symbol.toStringTag](): string
    {
        return "Quaternion"
    }
    public [NodeJSCustomInspect](): string
    {
        return `Quaternion <${this.toString()}>`
    }
    public toJSON(): IQuaternion
    {
        return {
            w: this.w,x: this.x,y: this.y,z: this.z
        }
    }
    public clone(): Quaternion
    {
        return new Quaternion(this.w,this.x,this.y,this.z)
    }
    public add(quaternion: QuaternionLike): Quaternion
    public add(...quaternion: QuaternionArray): Quaternion
    public add(...args: QuaternionArguments): Quaternion
    {
        const quat = Quaternion.resolveArgs(args)
        return new Quaternion(
            this.w + quat.w,
            this.x + quat.x,
            this.y + quat.y,
            this.z + quat.z
        )
    }
    public offset(quaternion: QuaternionLike): this
    public offset(...quaternion: QuaternionArray): this
    public offset(...args: QuaternionArguments): this
    {
        const quat = Quaternion.resolveArgs(args)
        this.w += quat.w
        this.x += quat.x
        this.y += quat.y
        this.z += quat.z
        return this
    }
    public subtract(quaternion: QuaternionLike): Quaternion
    public subtract(...quaternion: QuaternionArray): Quaternion
    public subtract(...args: QuaternionArguments): Quaternion
    {
        const quat = Quaternion.resolveArgs(args)
        return new Quaternion(
            this.w - quat.w,
            this.x - quat.x,
            this.y - quat.y,
            this.z - quat.z
        )
    }
    public negative(): Quaternion
    {
        return new Quaternion(-this.w,-this.x,-this.y,-this.z)
    }
    public length(sqrt: boolean = true): number
    {
        const value = this.w*this.w+this.x*this.x+this.y*this.y+this.z*this.z
        return sqrt ? Math.sqrt(value) : value
    }
    public normalize(): Quaternion
    {
        let length = this.length()
        if(length < EPSILON)
            return Quaternion.zero
        length = 1 / length
        return new Quaternion(this.w*length,this.x*length,this.y*length,this.z*length)
    }
    public multiply(quaternion: QuaternionLike): Quaternion
    public multiply(...quaternion: QuaternionArray): Quaternion
    public multiply(...args: QuaternionArguments): Quaternion
    {
        const quat = Quaternion.resolveArgs(args)
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
    public scale(scalar: number): Quaternion
    {
        return new Quaternion(this.w*scalar,this.x*scalar,this.y*scalar,this.z*scalar)
    }
    public dot(quaternion: QuaternionLike): number
    public dot(...quaternion: QuaternionArray): number
    public dot(...args: QuaternionArguments): number
    {
        const quat = Quaternion.resolveArgs(args)
        return this.w*quat.w+this.x*quat.x+this.y*quat.y+this.z*quat.z
    }
    public inverse(): Quaternion
    {
        let length = this.length(false)
        if(length == 0)
            return Quaternion.zero
        length = 1 / length
        return new Quaternion(this.w * length,-this.x*length,-this.y*length,-this.z*length)
    }
    public divide(quaternion: QuaternionLike): Quaternion
    public divide(...quaternion: QuaternionArray): Quaternion
    public divide(...args: QuaternionArguments): Quaternion
    {
        const quat = Quaternion.resolveArgs(args)
        let length = quat.length(false)
        if(length == 0) return Quaternion.zero
        length = 1 / length
        return new Quaternion(
            (this.w * quat.w + this.x * quat.x + this.y * quat.y + this.z * quat.z) * length,
            (this.x * quat.w - this.w * quat.x - this.y * quat.z + this.z * quat.y) * length,
            (this.y * quat.w - this.w * quat.y - this.z * quat.x + this.x * quat.z) * length,
            (this.z * quat.w - this.w * quat.z - this.x * quat.y + this.y * quat.x) * length
        )
    }
    public conjugate(): Quaternion
    {
        return new Quaternion(this.w,-this.x,-this.y,-this.z)
    }
    public exp(): Quaternion
    {
        const length = Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)
        const exp = Math.exp(this.w)
        const scale = exp * Math.sin(length) / length
        if(length == 0)
            return new Quaternion(exp,0,0,0)
        return new Quaternion(
            exp * Math.cos(length),
            this.x * scale,this.y * scale,this.z * scale
        )
    }
    public log(): Quaternion
    {
        if(this.x == 0 && this.z == 0)
            return new Quaternion(logHypot(this.w,this.x),Math.atan2(this.x,this.w),0,0)
        const length = this.length(false)
        const length2 = Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)
        const scale = Math.atan2(length2,this.w) / length
        return new Quaternion(Math.log(length) * 0.5,this.x * scale,this.y * scale,this.z * scale)
    }
    public toVec3(): Vec3Like
    {
        return [this.x,this.y,this.z,this.w]
    }
    public toAxisAngle(): Vec3
    {
        const sin2 = 1 - this.w * this.w
        if(sin2 > EPSILON)
            return new Vec3(this.x,this.y,this.z,0)
        const isin = 1 / Math.sqrt(sin2)
        const angle = 2 * Math.acos(this.w)
        return new Vec3(this.x * isin,this.y * isin,this.z * isin,angle)
    }
    public toEuler(): Vec3
    {
        function __asin__(t: number)
        {
            return t >= 1 ? Math.PI / 2 : (t <= -1 ? -Math.PI / 2 : Math.asin(t))
        }
        return new Vec3(
            -Math.atan2(2 * (this.y*this.z - this.w*this.x),1 - 2 * (this.x*this.x + this.y*this.y)),
            __asin__(2 * (this.x*this.z + this.w*this.y)),
            -Math.atan2(2 * (this.x*this.y - this.w*this.z),1 - 2 * (this.y*this.y + this.z*this.z))
        )
    }
    public toMat3(): Mat3Like
    {
        return [
            1-2*(this.y*this.y+this.z*this.z),2*(this.x*this.y-this.w*this.z),2*(this.x*this.z+this.w*this.y),
            2*(this.x*this.y+this.w*this.z),1-2*(this.x*this.x+this.z*this.z),2*(this.y*this.z-this.w*this.x),
            2*(this.x*this.z-this.w*this.y),2*(this.y*this.z+this.w*this.x),1-2*(this.x*this.x+this.y*this.y)
        ]
    }
    public toMat4(): Mat4Like
    {
        return [
            1-2*(this.y*this.y+this.z*this.z),2*(this.x*this.y-this.w*this.z),2*(this.x*this.z+this.w*this.y),0,
            2*(this.x*this.y+this.w*this.z),1-2*(this.x*this.x+this.z*this.z),2*(this.y*this.z-this.w*this.x),0,
            2*(this.x*this.z-this.w*this.y),2*(this.y*this.z+this.w*this.x),1-2*(this.x*this.x+this.y*this.y),0,
            0,0,0,1
        ]
    }
}