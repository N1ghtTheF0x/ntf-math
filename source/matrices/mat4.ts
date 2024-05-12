import { ResolveError } from "../common/error"
import { Vec3Like, Vec3, Vec3Arguments } from "../vectors/vec3"
import { check_number_array, check_number, check_string, check_string_array, has_property, check_array } from "../common/types"

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
export type Mat4Array = [number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number]
export type Mat4NestedArray = [[number,number,number,number],[number,number,number,number],[number,number,number,number],[number,number,number,number]]
export type Mat4String = `${number},${number},${number},${number},${number},${number},${number},${number},${number},${number},${number},${number},${number},${number},${number},${number}`
export type Mat4Like = IMat4 | Mat4Array | Mat4NestedArray | Mat4String | number

export class Mat4 implements IMat4
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
        if(a == null || typeof a == "undefined")
            throw new ResolveError("Mat4",a)
        if(check_number_array(a,16))
        {
            return new this(a as Mat4Array)
        }
        if(check_array(a,undefined,4))
        {
            const row0 = a[0], row1 = a[1], row2 = a[2], row3 = a[3]
            if(check_number_array(row0,4) && check_number_array(row1,4) && check_number_array(row2,4) && check_number_array(row3,4))
                return new this([
                    row0[0],row0[1],row0[2],row0[3],
                    row1[0],row1[1],row1[2],row1[3],
                    row2[0],row2[1],row2[2],row2[3],
                    row3[0],row3[1],row3[2],row3[3]
                ])
        }
        if(check_string(a))
        {
            const parts = a.split(",")
            if(check_string_array(parts,16))
                return this.resolve(parts.map((i) => parseFloat(i)))
        }
        if(
            has_property(a,"m00","number") && has_property(a,"m01","number") && has_property(a,"m02","number") && has_property(a,"m03","number") &&
            has_property(a,"m10","number") && has_property(a,"m11","number") && has_property(a,"m12","number") && has_property(a,"m13","number") &&
            has_property(a,"m20","number") && has_property(a,"m21","number") && has_property(a,"m22","number") && has_property(a,"m23","number") &&
            has_property(a,"m30","number") && has_property(a,"m31","number") && has_property(a,"m32","number") && has_property(a,"m33","number")
        )
            return new this([
                a.m00,a.m01,a.m02,a.m03,
                a.m10,a.m11,a.m12,a.m13,
                a.m20,a.m21,a.m22,a.m23,
                a.m30,a.m31,a.m32,a.m33
            ])
        if(check_number(a))
        {
            return new this([a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a])
        }
        throw new ResolveError("Mat4",a)
    }
    public static is(a: unknown): a is Mat4Like
    {
        try
        {
            this.resolve(a as Mat4Like)
        }
        catch(e)
        {
            return false
        }
        return true
    }
    public static orthographic(left: number,right: number,bottom: number,top: number,near: number,far: number)
    {
        return new this([
            2/(right-left),0,0,0,
            0,2/(top-bottom),0,0,
            0,0,2/(near-far),0,
            (left+right)/(left-right),
            (bottom+top)/(bottom-top),
            (near+far)/(near-far),1
        ])
    }
    public static perspective(fov: number,aspect: number,near: number,far: number)
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
    public constructor(init: Mat4Array = [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])
    {
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
    public clone()
    {
        return new Mat4([
            this.m00,this.m01,this.m02,this.m03,
            this.m10,this.m11,this.m12,this.m13,
            this.m20,this.m21,this.m22,this.m23,
            this.m30,this.m31,this.m32,this.m33
        ])
    }
    public add(mat: Mat4Like)
    {
        const b = Mat4.resolve(mat)
        const m = new Mat4
        for(let index = 0;index < this._raw.length;index++)
            m._raw[index] = this._raw[index] + b._raw[index]
        return m
    }
    public subtract(mat: Mat4Like)
    {
        const b = Mat4.resolve(mat)
        const m = new Mat4
        for(let index = 0;index < this._raw.length;index++)
            m._raw[index] = this._raw[index] - b._raw[index]
        return m
    }
    public multiply(mat: Mat4Like): Mat4
    public multiply(scalar: number): Mat4
    public multiply(vec: Vec3Like): Vec3
    public multiply(a: Mat4Like | Vec3Like | number)
    {
        if(check_number(a))
        {
            return new Mat4([
                this.m00 * a,this.m01 * a,this.m02 * a,this.m03 * a,
                this.m10 * a,this.m11 * a,this.m12 * a,this.m13 * a,
                this.m20 * a,this.m21 * a,this.m22 * a,this.m23 * a,
                this.m30 * a,this.m31 * a,this.m32 * a,this.m33 * a
            ])
        }
        if(Mat4.is(a))
        {
            const b = Mat4.resolve(a)
            return new Mat4([
                b.m00 * this.m00 + b.m01 * this.m10 + b.m02 * this.m20 + b.m03 * this.m30,
                b.m00 * this.m01 + b.m01 * this.m11 + b.m02 * this.m21 + b.m03 * this.m31,
                b.m00 * this.m02 + b.m01 * this.m12 + b.m02 * this.m22 + b.m03 * this.m32,
                b.m00 * this.m03 + b.m01 * this.m13 + b.m02 * this.m23 + b.m03 * this.m33,

                b.m10 * this.m00 + b.m11 * this.m10 + b.m12 * this.m20 + b.m13 * this.m30,
                b.m10 * this.m01 + b.m11 * this.m11 + b.m12 * this.m21 + b.m13 * this.m31,
                b.m10 * this.m02 + b.m11 * this.m12 + b.m12 * this.m22 + b.m13 * this.m32,
                b.m10 * this.m03 + b.m11 * this.m13 + b.m12 * this.m23 + b.m13 * this.m33,

                b.m20 * this.m00 + b.m21 * this.m10 + b.m22 * this.m20 + b.m23 * this.m30,
                b.m20 * this.m01 + b.m21 * this.m11 + b.m22 * this.m21 + b.m23 * this.m31,
                b.m20 * this.m02 + b.m21 * this.m12 + b.m22 * this.m22 + b.m23 * this.m32,
                b.m20 * this.m03 + b.m21 * this.m13 + b.m22 * this.m23 + b.m23 * this.m33,

                b.m30 * this.m00 + b.m31 * this.m10 + b.m32 * this.m20 + b.m33 * this.m30,
                b.m30 * this.m01 + b.m31 * this.m11 + b.m32 * this.m21 + b.m33 * this.m31,
                b.m30 * this.m02 + b.m31 * this.m12 + b.m32 * this.m22 + b.m33 * this.m32,
                b.m30 * this.m03 + b.m31 * this.m13 + b.m32 * this.m23 + b.m33 * this.m33,
            ])
        }
        if(Vec3.is(a))
        {
            const b = Vec3.resolve(a)
            const vec = new Vec3(
                b.x * this.m00 + b.y * this.m10 + b.z * this.m20 + this.m30,
                b.x * this.m01 + b.y * this.m11 + b.z * this.m21 + this.m31,
                b.x * this.m02 + b.y * this.m12 + b.z * this.m22 + this.m32,
                b.x * this.m03 + b.y * this.m13 + b.z * this.m23 + this.m33
            )
            if(vec.w != 0)
                return vec.divide(vec.w)
            return vec
        }
        throw new ResolveError("Mat4 or Vec3 or number",a)
    }
    public translate(x: number,y: number,z: number): this
    public translate(vec: Vec3Like): this
    public translate(...args: Vec3Arguments)
    {
        const vec = Vec3.resolveArgs(args)
        return this.multiply([
            1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            vec.x,vec.y,vec.z,1
        ])
    }
    public rotateX(angle: number)
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
    public rotateY(angle: number)
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
    public rotateZ(angle: number)
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
    public rotate(x: number,y: number,z: number): this
    public rotate(vec: Vec3Like): this
    public rotate(...args: Vec3Arguments)
    {
        const vec = Vec3.resolveArgs(args)
        return this.rotateX(vec.x).rotateY(vec.y).rotateZ(vec.z)
    }
    public scale(x: number,y: number,z: number): this
    public scale(vec: Vec3Like): this
    public scale(...args: Vec3Arguments)
    {
        const vec = Vec3.resolveArgs(args)
        return this.multiply([
            vec.x,0,0,0,
            0,vec.y,0,0,
            0,0,vec.z,0,
            0,0,0,1
        ])
    }
    public inverse()
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
}