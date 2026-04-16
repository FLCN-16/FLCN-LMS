import { type VideoProps } from "@videojs/react/video";
import "@videojs/react/video/minimal-skin.css";
interface PlayerProps extends VideoProps {
    isDrmContent?: boolean;
}
declare function PlayerComponent({ src }: PlayerProps): import("react").JSX.Element;
export default PlayerComponent;
//# sourceMappingURL=player.d.ts.map