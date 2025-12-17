export const MAX_ANGLE_DEGREE = 360
export const clampAngleDegree = (angle: number) => angle % MAX_ANGLE_DEGREE
export const clampAngleRadian = (angle: number) => clampAngleDegree(degreeToRadian(angle))

export const radianToDegree = (angle: number) => angle * (180/Math.PI)
export const degreeToRadian = (angle: number) => angle * (Math.PI/180)