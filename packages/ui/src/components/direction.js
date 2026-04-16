"use client";
import { Direction } from "radix-ui";
import * as React from "react";
function DirectionProvider({ dir, direction, children, }) {
    return (<Direction.DirectionProvider dir={direction ?? dir}>
      {children}
    </Direction.DirectionProvider>);
}
const useDirection = Direction.useDirection;
export { DirectionProvider, useDirection };
