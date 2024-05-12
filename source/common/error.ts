export class ResolveError extends Error
{
    public constructor(public readonly target: string,public readonly value: unknown)
    {
        super(`can't resolve ${value} to ${target}`)
    }
}