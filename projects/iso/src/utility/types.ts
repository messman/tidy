/** Shortcut for the keys of an object: `(keyof T)[]`. */
export type KeysOf<T> = (keyof T)[];

export type Not<T, TKeys extends keyof T> = { [P in TKeys]?: undefined };

export type Nullable<T, TKeys extends keyof T> = { [P in TKeys]: T[P] | null };