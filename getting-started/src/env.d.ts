declare module '*.bmp' {
  const src: string;
  export default src;
}
declare module '*.gif' {
  const src: string;
  export default src;
}
declare module '*.jpg' {
  const src: string;
  export default src;
}
declare module '*.jpeg' {
  const src: string;
  export default src;
}
declare module '*.png' {
  const src: string;
  export default src;
}
declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  import { FunctionComponent, SVGProps, SVGSVGElement } from 'react';
  export const ReactComponent: FunctionComponent<
    SVGProps<SVGSVGElement> & { title?: string; className?: string }
  >;
  const src: string;
  export default src;
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
