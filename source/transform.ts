import { IToString } from "./common/string"
import { NodeJSCustomInspect } from "./common/types"
import { degreeToRadian, radianToDegree } from "./geometry/angle"
import { IToMat3, Mat3 } from "./matrices/mat3"
import { IToMat4, Mat4 } from "./matrices/mat4"
import { Quaternion, QuaternionLike } from "./quaternion"
import { Vec2, Vec2Like } from "./vectors/vec2"
import { Vec3, Vec3Like } from "./vectors/vec3"

export class Transform2D implements IToMat3, IToString
{
    public origin: Vec2 = Vec2.zero
    public localPosition: Vec2
    public localRotation: number
    public get localRotationDegree(): number {return radianToDegree(this.localRotation)}
    public set localRotationDegree(v: number) {this.localRotation = degreeToRadian(v)}
    public localScale: Vec2
    public get globalPosition(): Vec2
    {
        let position = Vec2.zero
        let transform: Transform2D | undefined = this
        while(transform !== undefined)
        {
            position = position.add(transform.localPosition).add(transform.origin)
            transform = transform.parent
        }
        return position
    }
    public get globalRotation(): number
    {
        let rotation = 0
        let transform: Transform2D | undefined = this
        while(transform !== undefined)
        {
            rotation += transform.localRotation
            transform = transform.parent
        }
        return rotation
    }
    public get globalRotationDegree(): number {return radianToDegree(this.globalRotation)}
    public get globalScale(): Vec2
    {
        let scale = Vec2.one
        let transform: Transform2D | undefined = this
        while(transform !== undefined)
        {
            scale = scale.naiveMultiply(transform.localScale)
            transform = transform.parent
        }
        return scale
    }
    public constructor(position: Vec2Like,rotation: number,scale: Vec2Like,public parent?: Transform2D)
    {
        this.localPosition = Vec2.resolve(position)
        this.localRotation = rotation
        this.localScale = Vec2.resolve(scale)
    }
    public toString(): string
    {
        return `${this.localPosition.toString()}|${this.localRotation}|${this.localScale.toString()}`
    }
    public get [Symbol.toStringTag](): string
    {
        return "Transform2D"
    }
    public [NodeJSCustomInspect](): string
    {
        return `Transform2D <${this.toString()}>`
    }
    public toMat3(): Mat3
    {
        return new Mat3()
        .scale(this.localScale)
        .rotate(this.localRotation)
        .translate(this.localPosition)
    }
    public toGlobalMat3(): Mat3
    {
        let result = new Mat3
        let transform: Transform2D | undefined = this
        while(transform !== undefined)
        {
            result = result.multiply(transform.toMat3())
            transform = transform.parent
        }
        return result
    }
}

/**
 * Represents a 3D transform for 3D graphics
 */
export class Transform3D implements IToMat4, IToString
{
    public origin: Vec3 = Vec3.zero
    /**
     * The local position
     */
    public localPosition: Vec3
    /**
     * The local rotation
     */
    public localRotation: Quaternion
    /**
     * The local scale
     */
    public localScale: Vec3
    public get globalPosition(): Vec3
    {
        let position = Vec3.zero
        let transform: Transform3D | undefined = this
        while(transform !== undefined)
        {
            position = position.add(transform.localPosition).add(transform.origin)
            transform = transform.parent
        }
        return position
    }
    public get globalRotation(): Quaternion
    {
        let rotation = Quaternion.zero
        let transform: Transform3D | undefined = this
        while(transform !== undefined)
        {
            rotation = rotation.add(transform.localRotation)
            transform = transform.parent
        }
        return rotation
    }
    public get globalScale(): Vec3
    {
        let scale = Vec3.one
        let transform: Transform3D | undefined = this
        while(transform !== undefined)
        {
            scale = scale.naiveMultiply(transform.localScale)
            transform = transform.parent
        }
        return scale
    }
    /**
     * Create a new transform with `position`, `rotation` and `scale`
     * @param position The position as a Vec3
     * @param rotation The rotation as a Quaternion
     * @param scale The scale as a Vec3
     */
    public constructor(position: Vec3Like,rotation: QuaternionLike,scale: Vec3Like,public parent?: Transform3D)
    {
        this.localPosition = Vec3.resolve(position)
        this.localRotation = Quaternion.resolve(rotation)
        this.localScale = Vec3.resolve(scale)
    }
    public toString(): string
    {
        return `${this.localPosition.toString()}|${this.localRotation.toString()}|${this.localScale.toString()}`
    }
    public get [Symbol.toStringTag](): string
    {
        return "Transform2D"
    }
    public [NodeJSCustomInspect](): string
    {
        return `Transform2D <${this.toString()}>`
    }
    /**
     * Convert the transform into a 4x3 matrix
     * @returns A 4x4 matrix from the transform
     */
    public toMat4(): Mat4
    {
        return new Mat4()
        .scale(this.localScale)
        .multiply(this.localRotation)
        .translate(this.localPosition)
    }
    public toGlobalMat4(): Mat4
    {
        let result = new Mat4
        let transform: Transform3D | undefined = this
        while(transform !== undefined)
        {
            result = result.multiply(transform.toMat4())
            transform = transform.parent
        }
        return result
    }
}