export function matrix<T>(m: number, n: number, defaultValue: T): T[][] {
    return Array.from({
        // generate array of length m
        length: m
        // inside map function generate array of size n
        // and fill it with `0`
    }, () => new Array(n).fill(defaultValue));
};

export function isUndefined<T>(arg: T | undefined): arg is undefined {
    return typeof arg === "undefined";
}