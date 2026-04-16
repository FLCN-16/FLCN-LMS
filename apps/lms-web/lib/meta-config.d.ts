import { type Metadata } from "next";
import { type OpenGraph } from "next/dist/lib/metadata/types/opengraph-types";
type ColorMode = "light" | "dark";
export declare const siteConfig: {
    readonly name: "FLCN LMS";
    readonly title: "FLCN LMS – Multi";
    readonly description: "Isomorphic is the ultimate React TypeScript Admin Template. Streamline your admin dashboard development with a feature-rich, responsive, and highly customizable solution.";
    readonly url: "https://isomorphic-furyroad.vercel.app";
    readonly ogImage: "https://s3.amazonaws.com/redqteam.com/isomorphic-furyroad/itemdep/isobanner.png";
    readonly logo: any;
    readonly icon: any;
    readonly mode: ColorMode;
    readonly locale: "en_US";
    readonly authors: readonly [{
        readonly name: "RedQ Team";
        readonly url: "https://redq.io";
    }];
};
interface MetaObjectOptions {
    title?: string;
    description?: string;
    openGraph?: OpenGraph;
    noIndex?: boolean;
    canonicalUrl?: string;
}
declare const metaObject: ({ title, description, openGraph, noIndex, canonicalUrl, }?: MetaObjectOptions) => Metadata;
export default metaObject;
//# sourceMappingURL=meta-config.d.ts.map