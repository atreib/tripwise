"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";

interface NextLinkProps
  extends React.ComponentPropsWithoutRef<typeof NextLink> {
  children: React.ReactNode;
}

export function Link({ children, ...props }: NextLinkProps) {
  const [isIosSafari, setIsIosSafari] = useState(false);
  const LinkComponent = isIosSafari ? "a" : NextLink;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ua = window?.navigator?.userAgent;
    const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
    const webkit = !!ua.match(/WebKit/i);
    const iOSSafari = iOS && webkit && !ua.match(/CriOS/i);
    setIsIosSafari(iOSSafari);
  }, []);

  return (
    <LinkComponent {...props} href={props.href.toString()} prefetch={false}>
      {children}
    </LinkComponent>
  );
}
