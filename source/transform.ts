import { Mat4 } from "./matrices/mat4"
import { Quaternion, QuaternionLike } from "./quaternion"
import { Vec3, Vec3Like } from "./vectors/vec3"

/**
 * Represents a 3D transform for 3D graphics
 */
export class Transform
{
    /**
     * The position of the object
     */
    public position: Vec3
    /**
     * The rotation of the object
     */
    public rotation: Quaternion
    /**
     * The scale of the object
     */
    public scale: Vec3
    /**
     * Create a new transform with `position`, `rotation` and `scale`
     * @param position The position as a Vec3
     * @param rotation The rotation as a Quaternion
     * @param scale The scale as a Vec3
     */
    public constructor(position: Vec3Like,rotation: QuaternionLike,scale: Vec3Like)
    {
        this.position = Vec3.resolve(position)
        this.rotation = Quaternion.resolve(rotation)
        this.scale = Vec3.resolve(scale)
    }
    /**
     * Convert the transform into a 4x3 matrix
     * @returns A 4x4 matrix from the transform
     */
    public toMat4()
    {
        return new Mat4()
        .translate(this.position)
        .multiply(this.rotation.toMat4())
        .scale(this.scale)
    }
}