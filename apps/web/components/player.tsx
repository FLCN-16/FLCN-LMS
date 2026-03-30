"use client"

import { createPlayer, videoFeatures } from "@videojs/react"
import { MinimalVideoSkin, Video, type VideoProps } from "@videojs/react/video"

import "@videojs/react/video/minimal-skin.css"

const Player = createPlayer({ features: videoFeatures })

interface PlayerProps extends VideoProps {
  isDrmContent?: boolean
}

function PlayerComponent({ src }: PlayerProps) {
  return (
    <Player.Provider>
      <MinimalVideoSkin>
        <Video src={src} playsInline />
      </MinimalVideoSkin>
    </Player.Provider>
  )
}

export default PlayerComponent
