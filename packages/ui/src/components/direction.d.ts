import { Direction } from "radix-ui";
import * as React from "react";
declare function DirectionProvider({ dir, direction, children, }: React.ComponentProps<typeof Direction.DirectionProvider> & {
    direction?: React.ComponentProps<typeof Direction.DirectionProvider>["dir"];
}): React.JSX.Element;
declare const useDirection: typeof Direction.useDirection;
export { DirectionProvider, useDirection };
//# sourceMappingURL=direction.d.ts.map