import { ResolveError } from "../common/error"
import { Vec3Like, Vec3, Vec3Arguments } from "../vectors/vec3"
import { isValidNumber, isValidString, hasTypedProperty, NodeJSCustomInspect, IToString, isFixedTypeArray, isFixedArray, checkFixedTypeArray } from "@ntf/types"
import { IToMat3, Mat3Like } from "./mat3"
import { BoundingBox, BoundingBoxLike } from "../geometry/bbox"

export interface IMat4
{
    m00: number
    m01: number
    m02: number
    m03: number

    m10: number
    m11: number
    m12: number
    m13: number

    m20: number
    m21: number
    m22: number
    m23: number

    m30: number
    m31: number
    m32: number
    m33: number
}

export interface IToMat4
{
    toMat4(): Mat4Like
}

export type Mat4Array = [number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number]
export type Mat4NestedArray = [[number,number,number,number],[number,number,number,number],[number,number,number,number],[number,number,number,number]]
export type Mat4String = `${number},${number},${number},${number},${number},${number},${number},${number},${number},${number},${number},${number},${number},${number},${number},${number}`
export type Mat4Like = IMat4 | Mat4Array | Mat4NestedArray | Mat4String | number | IToMat4
export type Mat4Arguments = [mat: Mat4Like] | Mat4Array

export class Mat4 implements IMat4, IToMat3, IToString
{
    protected _raw: Mat4Array
    public get m00(){return this._raw[0]}
    public set m00(val){this._raw[0] = val}
    public get m01(){return this._raw[1]}
    public set m01(val){this._raw[1] = val}
    public get m02(){return this._raw[2]}
    public set m02(val){this._raw[2] = val}
    public get m03(){return this._raw[3]}
    public set m03(val){this._raw[3] = val}
    public get m10(){return this._raw[4]}
    public set m10(val){this._raw[4] = val}
    public get m11(){return this._raw[5]}
    public set m11(val){this._raw[5] = val}
    public get m12(){return this._raw[6]}
    public set m12(val){this._raw[6] = val}
    public get m13(){return this._raw[7]}
    public set m13(val){this._raw[7] = val}
    public get m20(){return this._raw[8]}
    public set m20(val){this._raw[8] = val}
    public get m21(){return this._raw[9]}
    public set m21(val){this._raw[9] = val}
    public get m22(){return this._raw[10]}
    public set m22(val){this._raw[10] = val}
    public get m23(){return this._raw[11]}
    public set m23(val){this._raw[11] = val}
    public get m30(){return this._raw[12]}
    public set m30(val){this._raw[12] = val}
    public get m31(){return this._raw[13]}
    public set m31(val){this._raw[13] = val}
    public get m32(){return this._raw[14]}
    public set m32(val){this._raw[14] = val}
    public get m33(){return this._raw[15]}
    public set m33(val){this._raw[15] = val}
    public static resolve(a: unknown): Mat4
    {
        const value = this.cast(a)
        if(typeof value != "undefined")
            return value
        throw new ResolveError("Mat4",a)
    }
    public static resolveArgs(args: Mat4Arguments): Mat4
    {
        if(isFixedTypeArray(args,isValidNumber,16))
            return new this(args)
        return this.resolve(args[0])
    }
    public static cast(a: unknown): Mat4 | undefined
    {
        if(a == null || typeof a == "undefined")
            return undefined
        if(isValidString(a))
        {
            const parts = a.split(",")
            if(isFixedTypeArray(parts,isValidString,16))
                return this.cast(parts.map((i) => parseFloat(i)))
        }
        if(isValidNumber(a))
        {
            return new this([a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a])
        }
        if(isFixedTypeArray(a,isValidNumber,16))
        {
            return new this(a as Mat4Array)
        }
        if(isFixedArray(a,4))
        {
            const row0 = a[0], row1 = a[1], row2 = a[2], row3 = a[3]
            if(isFixedTypeArray(row0,isValidNumber,4) && isFixedTypeArray(row1,isValidNumber,4) && isFixedTypeArray(row2,isValidNumber,4) && isFixedTypeArray(row3,isValidNumber,4))
                return new this([
                    row0[0]!,row0[1]!,row0[2]!,row0[3]!,
                    row1[0]!,row1[1]!,row1[2]!,row1[3]!,
                    row2[0]!,row2[1]!,row2[2]!,row2[3]!,
                    row3[0]!,row3[1]!,row3[2]!,row3[3]!
                ])
        }
        if(hasTypedProperty(a,"toMat4","function"))
            return this.cast(a.toMat4())
        if(
            hasTypedProperty(a,"m00","number") && hasTypedProperty(a,"m01","number") && hasTypedProperty(a,"m02","number") && hasTypedProperty(a,"m03","number") &&
            hasTypedProperty(a,"m10","number") && hasTypedProperty(a,"m11","number") && hasTypedProperty(a,"m12","number") && hasTypedProperty(a,"m13","number") &&
            hasTypedProperty(a,"m20","number") && hasTypedProperty(a,"m21","number") && hasTypedProperty(a,"m22","number") && hasTypedProperty(a,"m23","number") &&
            hasTypedProperty(a,"m30","number") && hasTypedProperty(a,"m31","number") && hasTypedProperty(a,"m32","number") && hasTypedProperty(a,"m33","number")
        )
            return new this([
                a.m00,a.m01,a.m02,a.m03,
                a.m10,a.m11,a.m12,a.m13,
                a.m20,a.m21,a.m22,a.m23,
                a.m30,a.m31,a.m32,a.m33
            ])
        return undefined
    }
    public static is(a: unknown): a is Mat4Like
    {
        return typeof this.cast(a) != "undefined"
    }
    public static orthographic(left: number,right: number,bottom: number,top: number,near: number,far: number): Mat4
    public static orthographic(bbox: BoundingBoxLike,near: number,far: number): Mat4
    public static orthographic(...args: [left: number,right: number,bottom: number,top: number,near: number,far: number] | [bbox: BoundingBoxLike,near: number,far: number]): Mat4
    {
        const bbox = isFixedTypeArray(args,isValidNumber,6) ? new BoundingBox(args[0],args[1],args[2],args[3]) : BoundingBox.resolve(args[0])
        const near = isFixedTypeArray(args,isValidNumber,6) ? args[4] : args[1]
        const far = isFixedTypeArray(args,isValidNumber,6) ? args[5] : args[2]
        return new this([
            2/(bbox.right-bbox.left),0,0,0,
            0,2/(bbox.top-bbox.bottom),0,0,
            0,0,2/(near-far),0,
            (bbox.left+bbox.right)/(bbox.left-bbox.right),
            (bbox.bottom+bbox.top)/(bbox.bottom-bbox.top),
            (near+far)/(near-far),1
        ])
    }
    public static perspective(fov: number,aspect: number,near: number,far: number): Mat4
    {
        const f = Math.tan(Math.PI * 0.5 - 0.5 * fov)
        const rangeInv = 1.0 / (near - far)
        return new this([
            f / aspect,0,0,0,
            0,f,0,0,
            0,0,(near + far) * rangeInv,-1,
            0,0,near * far * rangeInv * 2,0
        ])
    }
    public static pointAt(position: Vec3Like,target: Vec3Like,up: Vec3Like): Mat4
    {
        const newForward = Vec3.resolve(target).subtract(position).normalize()
        const a = newForward.multiply(Vec3.resolve(up).dot(newForward))
        const newUp = Vec3.resolve(up).subtract(a).normalize()
        const newRight = newUp.cross(newForward)
        const pos = Vec3.resolve(position)
        return new this([
            newRight.x,newRight.y,newRight.z,0,
            newUp.x,newUp.y,newUp.z,0,
            newForward.x,newForward.y,newForward.z,0,
            pos.x,pos.y,pos.z,1
        ])
    }
    public constructor(init: Mat4Array = [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])
    {
        checkFixedTypeArray(init,isValidNumber,16)
        this._raw = init
    }
    public toArray(): Mat4Array
    {
        return [
            this.m00,this.m01,this.m02,this.m03,
            this.m10,this.m11,this.m12,this.m13,
            this.m20,this.m21,this.m22,this.m23,
            this.m30,this.m31,this.m32,this.m33
        ]
    }
    public toNestetArray(): Mat4NestedArray
    {
        return [
            [this.m00,this.m01,this.m02,this.m03],
            [this.m10,this.m11,this.m12,this.m13],
            [this.m20,this.m21,this.m22,this.m23],
            [this.m30,this.m31,this.m32,this.m33]
        ]
    }
    public toJSON(): IMat4
    {
        return {
            m00: this.m00,m01: this.m01,m02: this.m02,m03: this.m03,
            m10: this.m10,m11: this.m11,m12: this.m12,m13: this.m13,
            m20: this.m20,m21: this.m21,m22: this.m22,m23: this.m23,
            m30: this.m20,m31: this.m21,m32: this.m22,m33: this.m23
        }
    }
    public toString(): Mat4String
    {
        return `${this.m00},${this.m01},${this.m02},${this.m03},${this.m10},${this.m11},${this.m12},${this.m13},${this.m20},${this.m21},${this.m22},${this.m23},${this.m30},${this.m31},${this.m32},${this.m33}`
    }
    public get [Symbol.toStringTag](): string
    {
        return "Mat4"
    }
    public [NodeJSCustomInspect](): string
    {
        return `Mat4 <${this.toString()}>`
    }
    public clone(): Mat4
    {
        return new Mat4([
            this.m00,this.m01,this.m02,this.m03,
            this.m10,this.m11,this.m12,this.m13,
            this.m20,this.m21,this.m22,this.m23,
            this.m30,this.m31,this.m32,this.m33
        ])
    }
    public equals(mat: Mat4Like): boolean
    public equals(...mat: Mat4Array): boolean
    public equals(...args: Mat4Arguments): boolean
    {
        const m = Mat4.resolveArgs(args)
        for(let index = 0;index < this._raw.length;index++)
            if(this._raw[index] != m._raw[index])
                return false
        return true
    }
    public add(mat: Mat4Like): Mat4
    public add(...mat: Mat4Array): Mat4
    public add(...args: Mat4Arguments): Mat4
    {
        const b = Mat4.resolveArgs(args)
        const m = new Mat4
        for(let index = 0;index < this._raw.length;index++)
            m._raw[index] = this._raw[index]! + b._raw[index]!
        return m
    }
    public subtract(mat: Mat4Like): Mat4
    public subtract(...mat: Mat4Array): Mat4
    public subtract(...args: Mat4Arguments): Mat4
    {
        const b = Mat4.resolveArgs(args)
        const m = new Mat4
        for(let index = 0;index < this._raw.length;index++)
            m._raw[index] = this._raw[index]! - b._raw[index]!
        return m
    }
    public multiply(mat: Mat4Like): Mat4
    public multiply(...mat: Mat4Array): Mat4
    public multiply(scalar: number): Mat4
    public multiply(vec: Vec3Like): Vec3
    public multiply(...args: [vec: Vec3Like] | [scalar: number] | Mat4Arguments)
    {
        if(isFixedTypeArray(args,isValidNumber,1))
        {
            const scalar = args[0]
            return new Mat4([
                this.m00 * scalar,this.m01 * scalar,this.m02 * scalar,this.m03 * scalar,
                this.m10 * scalar,this.m11 * scalar,this.m12 * scalar,this.m13 * scalar,
                this.m20 * scalar,this.m21 * scalar,this.m22 * scalar,this.m23 * scalar,
                this.m30 * scalar,this.m31 * scalar,this.m32 * scalar,this.m33 * scalar
            ])
        }
        const vec = Vec3.cast(args[0])
        if(vec !== undefined)
        {
            const result = new Vec3(
                vec.x * this.m00 + vec.y * this.m10 + vec.z * this.m20 + this.m30,
                vec.x * this.m01 + vec.y * this.m11 + vec.z * this.m21 + this.m31,
                vec.x * this.m02 + vec.y * this.m12 + vec.z * this.m22 + this.m32,
                vec.x * this.m03 + vec.y * this.m13 + vec.z * this.m23 + this.m33
            )
            if(result.w != 0)
                return result.divide(result.w)
            return result
        }
        const mat = Mat4.resolveArgs(args as Mat4Arguments)

        return new Mat4([
            mat.m00 * this.m00 + mat.m01 * this.m10 + mat.m02 * this.m20 + mat.m03 * this.m30,
            mat.m00 * this.m01 + mat.m01 * this.m11 + mat.m02 * this.m21 + mat.m03 * this.m31,
            mat.m00 * this.m02 + mat.m01 * this.m12 + mat.m02 * this.m22 + mat.m03 * this.m32,
            mat.m00 * this.m03 + mat.m01 * this.m13 + mat.m02 * this.m23 + mat.m03 * this.m33,

            mat.m10 * this.m00 + mat.m11 * this.m10 + mat.m12 * this.m20 + mat.m13 * this.m30,
            mat.m10 * this.m01 + mat.m11 * this.m11 + mat.m12 * this.m21 + mat.m13 * this.m31,
            mat.m10 * this.m02 + mat.m11 * this.m12 + mat.m12 * this.m22 + mat.m13 * this.m32,
            mat.m10 * this.m03 + mat.m11 * this.m13 + mat.m12 * this.m23 + mat.m13 * this.m33,

            mat.m20 * this.m00 + mat.m21 * this.m10 + mat.m22 * this.m20 + mat.m23 * this.m30,
            mat.m20 * this.m01 + mat.m21 * this.m11 + mat.m22 * this.m21 + mat.m23 * this.m31,
            mat.m20 * this.m02 + mat.m21 * this.m12 + mat.m22 * this.m22 + mat.m23 * this.m32,
            mat.m20 * this.m03 + mat.m21 * this.m13 + mat.m22 * this.m23 + mat.m23 * this.m33,

            mat.m30 * this.m00 + mat.m31 * this.m10 + mat.m32 * this.m20 + mat.m33 * this.m30,
            mat.m30 * this.m01 + mat.m31 * this.m11 + mat.m32 * this.m21 + mat.m33 * this.m31,
            mat.m30 * this.m02 + mat.m31 * this.m12 + mat.m32 * this.m22 + mat.m33 * this.m32,
            mat.m30 * this.m03 + mat.m31 * this.m13 + mat.m32 * this.m23 + mat.m33 * this.m33,
        ])
    }
    public translate(x: number,y: number,z: number): Mat4
    public translate(vec: Vec3Like): Mat4
    public translate(...args: Vec3Arguments): Mat4
    {
        const vec = Vec3.resolveArgs(args)
        return this.multiply([
            1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            vec.x,vec.y,vec.z,1
        ])
    }
    public rotateX(angle: number): Mat4
    {
        const c = Math.cos(angle)
        const s = Math.sin(angle)
        return this.multiply([
            1,0,0,0,
            0,c,s,0,
            0,-s,c,0,
            0,0,0,1
        ])
    }
    public rotateY(angle: number): Mat4
    {
        const c = Math.cos(angle)
        const s = Math.sin(angle)
        return this.multiply([
            c,0,-s,0,
            0,1,0,0,
            s,0,c,0,
            0,0,0,1
        ])
    }
    public rotateZ(angle: number): Mat4
    {
        const c = Math.cos(angle)
        const s = Math.sin(angle)
        return this.multiply([
            c,s,0,0,
            -s,c,0,0,
            0,0,1,0,
            0,0,0,1
        ])
    }
    public rotate(x: number,y: number,z: number): Mat4
    public rotate(vec: Vec3Like): Mat4
    public rotate(...args: Vec3Arguments): Mat4
    {
        const vec = Vec3.resolveArgs(args)
        return this.rotateX(vec.x).rotateY(vec.y).rotateZ(vec.z)
    }
    public scale(x: number,y: number,z: number): Mat4
    public scale(vec: Vec3Like): Mat4
    public scale(...args: Vec3Arguments): Mat4
    {
        const vec = Vec3.resolveArgs(args)
        return this.multiply([
            vec.x,0,0,0,
            0,vec.y,0,0,
            0,0,vec.z,0,
            0,0,0,1
        ])
    }
    public inverse(): Mat4
    {
        return new Mat4([
            this.m00,this.m10,this.m20,0,
            this.m01,this.m11,this.m21,0,
            this.m02,this.m12,this.m22,0,
            -(this.m30*this.m00+this.m31*this.m10+this.m32*this.m20),
            -(this.m30*this.m01+this.m31*this.m11+this.m32*this.m21),
            -(this.m30*this.m02+this.m31*this.m12+this.m32*this.m22),
            1
        ])
    }
    public toMat3(): Mat3Like
    {
        return [
            this.m00,this.m01,this.m03,
            this.m10,this.m11,this.m13,
            this.m30,this.m31,this.m33
        ]
    }
}