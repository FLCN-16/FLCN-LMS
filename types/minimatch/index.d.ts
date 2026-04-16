// Minimal local type stub for `minimatch`.
//
// Why this exists:
// - Some parts of the toolchain implicitly reference a "minimatch" type library.
// - Our backend `tsconfig.json` includes `typeRoots: ["../../types", "../../node_modules/@types"]`.
// - When TypeScript can't find proper typings for minimatch, it fails compilation.
// - This stub unblocks compilation; replace with real typings if/when the dependency graph is fixed.

declare module "minimatch" {
  export interface IOptions {
    debug?: boolean;
    nobrace?: boolean;
    noglobstar?: boolean;
    dot?: boolean;
    noext?: boolean;
    nocase?: boolean;
    nonull?: boolean;
    matchBase?: boolean;
    nocomment?: boolean;
    nonegate?: boolean;
    flipNegate?: boolean;
  }

  export interface Minimatch {
    pattern: string;
    options: IOptions;
    set: Array<Array<string | RegExp>>;
    regexp: RegExp | null;
    negate: boolean;
    comment: boolean;
    empty: boolean;

    makeRe(): RegExp | false;
    match(f: string, partial?: boolean): boolean;
  }

  export function minimatch(path: string, pattern: string, options?: IOptions): boolean;
  export function filter(pattern: string, options?: IOptions): (path: string) => boolean;
  export function makeRe(pattern: string, options?: IOptions): RegExp | false;
  export function match(list: readonly string[], pattern: string, options?: IOptions): string[];

  export const Minimatch: {
    new (pattern: string, options?: IOptions): Minimatch;
  };

  export default minimatch;
}
