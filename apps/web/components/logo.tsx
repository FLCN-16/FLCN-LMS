import Image, { type ImageProps } from "next/image"

import appLogo from "@/public/logo.svg"

type LogoProps = Omit<ImageProps, "src" | "alt"> & { alt?: string }

function AppLogo({ alt = "App logo", ...props }: LogoProps) {
  return <Image src={appLogo} alt={alt} {...props} />
}

export default AppLogo
