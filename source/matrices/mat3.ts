import { ResolveError } from "../common/error"
import { check_array, check_number, check_number_array, check_string, check_string_array, has_property } from "../common/types"
import { Vec2Like, Vec2, Vec2Arguments } from "../vectors/vec2"
import { Mat4Like } from "./mat4"

export interface IMat3
{
    m00: number
    m01: number
    m02: number

    m10: number
    m11: number
    m12: number

    m20: number
    m21: number
    m22: number
}
export type Mat3Array = [number,number,number,number,number,number,number,number,number]
export type Mat3NestedArray = [[number,number,number],[number,number,number],[number,number,number]]
export type Mat3String = `${number},${number},${number},${number},${number},${number},${number},${number},${number}`
export type Mat3Like = IMat3 | Mat3Array | Mat3NestedArray | Mat3String | number

export class Mat3 implements IMat3
{
    protected _raw: Mat3Array
    public get m00(){return this._raw[0]}
    public set m00(val){this._raw[0] = val}
    public get m01(){return this._raw[1]}
    public set m01(val){this._raw[1] = val}
    public get m02(){return this._raw[2]}
    public set m02(val){this._raw[2] = val}
    public get m10(){return this._raw[3]}
    public set m10(val){this._raw[3] = val}
    public get m11(){return this._raw[4]}
    public set m11(val){this._raw[4] = val}
    public get m12(){return this._raw[5]}
    public set m12(val){this._raw[5] = val}
    public get m20(){return this._raw[6]}
    public set m20(val){this._raw[6] = val}
    public get m21(){return this._raw[7]}
    public set m21(val){this._raw[7] = val}
    public get m22(){return this._raw[8]}
    public set m22(val){this._raw[8] = val}
    public static resolve(a: unknown): Mat3
    {
        const value = this.cast(a)
        if(typeof value != "undefined")
            return value
        throw new ResolveError("Mat3",a)
    }
    public static cast(a: unknown): Mat3 | undefined
    {
        if(a == null || typeof a == "undefined")
            return undefined
        if(check_number_array(a,9))
        {
            return new this(a as Mat3Array)
        }
        if(check_array(a,undefined,3))
        {
            const row0 = a[0], row1 = a[1], row2 = a[2]
            if(check_number_array(row0,3) && check_number_array(row1,3) && check_number_array(row2,3))
                return new this([
                    row0[0],row0[1],row0[2],
                    row1[0],row1[1],row1[2],
                    row2[0],row2[1],row2[2],
                ])
        }
        if(check_string(a))
        {
            const parts = a.split(",")
            if(check_string_array(parts,9))
                return this.cast(parts.map((i) => parseFloat(i)))
        }
        if(
            has_property(a,"m00","number") && has_property(a,"m01","number") && has_property(a,"m02","number") &&
            has_property(a,"m10","number") && has_property(a,"m11","number") && has_property(a,"m12","number") &&
            has_property(a,"m20","number") && has_property(a,"m21","number") && has_property(a,"m22","number")
        )
            return new this([
                a.m00,a.m01,a.m02,
                a.m10,a.m11,a.m12,
                a.m20,a.m21,a.m22
            ])
        if(check_number(a))
        {
            return new this([a,a,a,a,a,a,a,a,a])
        }
        return undefined
    }
    public static is(a: unknown): a is Mat3Like
    {
        return typeof this.cast(a) != "undefined"
    }
    public static projection(width: number,height: number)
    {
        return new this([
            2/width,0,0,
            0,-2/height,0,
            -1,1,1
        ])
    }
    public constructor(init: Mat3Array = [1,0,0,0,1,0,0,0,1])
    {
        if(!check_number_array(init,9))
            throw new TypeError("expected a number array with 9 elements")
        this._raw = init
    }
    public toArray(): Mat3Array
    {
        return [
            this.m00,this.m01,this.m02,
            this.m10,this.m11,this.m12,
            this.m20,this.m21,this.m22
        ]
    }
    public toNestetArray(): Mat3NestedArray
    {
        return [
            [this.m00,this.m01,this.m02],
            [this.m10,this.m11,this.m12],
            [this.m20,this.m21,this.m22]
        ]
    }
    public toJSON(): IMat3
    {
        return {
            m00: this.m00,m01: this.m01,m02: this.m02,
            m10: this.m10,m11: this.m11,m12: this.m12,
            m20: this.m20,m21: this.m21,m22: this.m22
        }
    }
    public toString(): Mat3String
    {
        return `${this.m00},${this.m01},${this.m02},${this.m10},${this.m11},${this.m12},${this.m20},${this.m21},${this.m22}`
    }
    public clone()
    {
        return new Mat3([
            this.m00,this.m01,this.m02,
            this.m10,this.m11,this.m12,
            this.m20,this.m21,this.m22
        ])
    }
    public equals(mat: Mat3Like)
    {
        const m = Mat3.resolve(mat)
        for(let index = 0;index < this._raw.length;index++)
            if(this._raw[index] != m._raw[index])
                return false
        return true
    }
    public add(mat: Mat3Like)
    {
        const b = Mat3.resolve(mat)
        const m = new Mat3
        for(let index = 0;index < this._raw.length;index++)
            m._raw[index] = this._raw[index] + b._raw[index]
        return m
    }
    public subtract(mat: Mat3Like)
    {
        const b = Mat3.resolve(mat)
        const m = new Mat3
        for(let index = 0;index < this._raw.length;index++)
            m._raw[index] = this._raw[index] - b._raw[index]
        return m
    }
    public multiply(mat: Mat3Like): Mat3
    public multiply(scalar: number): Mat3
    public multiply(a: Mat3Like | number)
    {
        if(check_number(a))
            return new Mat3([
                this.m00 * a,this.m01 * a,this.m02 * a,
                this.m10 * a,this.m11 * a,this.m12 * a,
                this.m20 * a,this.m21 * a,this.m22 * a
            ])
        const b = Mat3.resolve(a)
        return new Mat3([
            b.m00 * this.m00 + b.m01 * this.m10 + b.m02 * this.m20,
            b.m00 * this.m01 + b.m01 * this.m11 + b.m02 * this.m21,
            b.m00 * this.m02 + b.m01 * this.m12 + b.m02 * this.m22,
            b.m10 * this.m00 + b.m11 * this.m10 + b.m12 * this.m20,
            b.m10 * this.m01 + b.m11 * this.m11 + b.m12 * this.m21,
            b.m10 * this.m02 + b.m11 * this.m12 + b.m12 * this.m22,
            b.m20 * this.m00 + b.m21 * this.m10 + b.m22 * this.m20,
            b.m20 * this.m01 + b.m21 * this.m11 + b.m22 * this.m21,
            b.m20 * this.m02 + b.m21 * this.m12 + b.m22 * this.m22
        ])
    }
    public translate(x: number,y: number): Mat3
    public translate(vec: Vec2Like): Mat3
    public translate(...args: Vec2Arguments)
    {
        const vec = Vec2.resolveArgs(args)
        return this.multiply([
            1,0,0,
            0,1,0,
            vec.x,vec.y,1
        ])
    }
    public rotate(angle: number)
    {
        const c = Math.cos(angle)
        const s = Math.sin(angle)
        return this.multiply([
            c,-s,0,
            s,c,0,
            0,0,1
        ])
    }
    public scale(x: number,y: number): Mat3
    public scale(vec: Vec2Like): Mat3
    public scale(...args: Vec2Arguments)
    {
        const vec = Vec2.resolve(args)
        return this.multiply([
            vec.x,0,0,
            0,vec.y,0,
            0,0,1
        ])
    }
    public determinant()
    {
        return this.m00 * this.m11 * this.m22 - this.m21 * this.m12 -
               this.m01 * this.m10 * this.m22 - this.m12 * this.m20 +
               this.m02 * this.m10 * this.m21 - this.m11 * this.m20
    }
    public inverse()
    {
        const det = this.determinant()
        return new Mat3([
            (this.m11 * this.m22 - this.m21 * this.m12) * det,(this.m02 * this.m21 - this.m01 * this.m22) * det,(this.m01 * this.m12 - this.m02 * this.m11) * det,
            (this.m12 * this.m20 - this.m10 * this.m22) * det,(this.m00 * this.m22 - this.m02 * this.m20) * det,(this.m10 * this.m02 - this.m00 * this.m12) * det,
            (this.m10 * this.m21 - this.m20 * this.m11) * det,(this.m20 * this.m01 - this.m00 * this.m21) * det,(this.m00 * this.m11 - this.m10 * this.m01) * det
        ])
    }
    public toMat4(): Mat4Like
    {
        return [
            this.m00,this.m01,this.m02,0,
            this.m10,this.m11,this.m12,0,
            this.m20,this.m20,this.m22,0,
            0,0,0,1
        ]
    }
}
