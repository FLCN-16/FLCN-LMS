"use client";
import { createPlayer, videoFeatures } from "@videojs/react";
import { MinimalVideoSkin, Video } from "@videojs/react/video";
import "@videojs/react/video/minimal-skin.css";
const Player = createPlayer({ features: videoFeatures });
function PlayerComponent({ src }) {
    return (<Player.Provider>
      <MinimalVideoSkin>
        <Video src={src} playsInline/>
      </MinimalVideoSkin>
    </Player.Provider>);
}
export default PlayerComponent;
