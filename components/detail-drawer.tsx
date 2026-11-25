"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { DetailPanelExpansion } from "./detail-panel-expansion";
import { useRef, type ComponentProps, type Ref, type RefObject } from "react";
import { cn } from "../lib/utils";

type DetailDrawerProps = Pick<
  ComponentProps<typeof Dialog.Content>,
  "aria-busy" | "children" | "className"
> & {
  titleId: string;
  onClose: () => void;
  ref?: Ref<HTMLDivElement>;
  swipeToClose?: boolean;
  restoreFocusRef?: RefObject<HTMLElement | null>;
};

/** Modal behavior shared by the financial detail panels. */
export function DetailDrawer({
  titleId,
  onClose,
  className,
  swipeToClose,
  restoreFocusRef,
  ...content
}: DetailDrawerProps) {
  const origin = useRef<Element | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  return (
    <DetailPanelExpansion>
      {({ style }) => (
        <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
            <Dialog.Content
              {...content}
              style={style}
              data-detail-drawer=""
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={undefined}
              onOpenAutoFocus={(event) => {
                origin.current = document.activeElement;
                const panel = event.target;
                if (panel instanceof HTMLElement) {
                  event.preventDefault();
                  panel.focus({ preventScroll: true });
                }
              }}
              onCloseAutoFocus={(event) => {
                event.preventDefault();
                // Radix restores focus asynchronously. A different panel may already be open.
                if (
                  document.querySelector('[role="dialog"][aria-modal="true"]')
                )
                  return;
                const previous = restoreFocusRef?.current ?? origin.current;
                if (
                  (previous instanceof HTMLElement ||
                    previous instanceof SVGElement) &&
                  previous !== document.body &&
                  previous.isConnected
                ) {
                  previous.focus({ preventScroll: true });
                  return;
                }
                document
                  .getElementById("main-content")
                  ?.focus({ preventScroll: true });
              }}
              onTouchStart={
                swipeToClose
                  ? (event) => {
                      touchStart.current = null;
                      if (
                        event.touches.length !== 1 ||
                        (event.target instanceof Element &&
                          event.target.closest(
                            "a, button, input, select, [role='slider'], svg",
                          ))
                      )
                        return;
                      const { clientX: x, clientY: y } = event.touches[0];
                      touchStart.current = { x, y };
                    }
                  : undefined
              }
              onTouchCancel={() => {
                touchStart.current = null;
              }}
              onTouchEnd={
                swipeToClose
                  ? (event) => {
                      const start = touchStart.current;
                      touchStart.current = null;
                      if (
                        !start ||
                        event.touches.length ||
                        !event.changedTouches.length
                      )
                        return;
                      const { clientX, clientY } = event.changedTouches[0];
                      const dx = clientX - start.x;
                      if (dx > 64 && dx > Math.abs(clientY - start.y) * 2)
                        onClose();
                    }
                  : undefined
              }
              className={cn(
                "fixed inset-y-0 end-0 z-50 h-dvh max-h-full w-full overscroll-contain bg-background shadow-2xl outline-none",
                className,
              )}
            />
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </DetailPanelExpansion>
  );
}

export function DrawerTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Dialog.Title asChild>
      <span className={className}>{children}</span>
    </Dialog.Title>
  );
}
