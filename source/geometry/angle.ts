export const MAX_ANGLE_DEGREE = 360
export const cap_angle_degree = (angle: number) => angle % MAX_ANGLE_DEGREE

export const radian_to_degree = (angle: number) => angle * (180/Math.PI)
export const degree_to_radian = (angle: number) => angle * (Math.PI/180)