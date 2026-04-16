import Image from "next/image";
import appLogo from "@/public/logo.svg";
function AppLogo({ alt = "App logo", ...props }) {
    return <Image src={appLogo} alt={alt} {...props}/>;
}
export default AppLogo;
