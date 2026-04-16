import { type ImageProps } from "next/image";
type LogoProps = Omit<ImageProps, "src" | "alt"> & {
    alt?: string;
};
declare function AppLogo({ alt, ...props }: LogoProps): import("react").JSX.Element;
export default AppLogo;
//# sourceMappingURL=logo.d.ts.map