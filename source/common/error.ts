/**
 * A error when a value wasn't able to be resolved to another type
 */
export class ResolveError extends Error
{
    /**
     * Create a resolve exception
     * @param target The target type name
     * @param value A value
     */
    public constructor(public readonly target: string,public readonly value: unknown)
    {
        super(`Can't resolve ${value} to ${target}`)
    }
}