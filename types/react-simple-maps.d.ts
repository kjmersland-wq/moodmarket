declare module "react-simple-maps" {
  import { ComponentProps, ReactNode } from "react";

  export interface ComposableMapProps {
    projection?: string;
    projectionConfig?: Record<string, unknown>;
    width?: number;
    height?: number;
    className?: string;
    style?: React.CSSProperties;
    children?: ReactNode;
  }

  export interface ZoomableGroupProps {
    center?: [number, number];
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    children?: ReactNode;
    onMoveStart?: (pos: { coordinates: [number, number]; zoom: number }, e: MouseEvent) => void;
    onMove?: (pos: { x: number; y: number; zoom: number; dragging: boolean }, e: MouseEvent) => void;
    onMoveEnd?: (pos: { coordinates: [number, number]; zoom: number }, e: MouseEvent) => void;
  }

  export interface GeographiesProps {
    geography: string | object;
    children: (data: { geographies: Geography[] }) => ReactNode;
  }

  export interface Geography {
    rsmKey: string;
    id: string | number;
    properties: Record<string, string | number>;
    [key: string]: unknown;
  }

  export interface GeographyProps {
    geography: Geography;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
    };
    onMouseEnter?: (evt: React.MouseEvent) => void;
    onMouseLeave?: (evt: React.MouseEvent) => void;
    onClick?: (evt: React.MouseEvent) => void;
    className?: string;
  }

  export interface MarkerProps {
    coordinates: [number, number];
    children?: ReactNode;
    onClick?: (evt: React.MouseEvent) => void;
  }

  export function ComposableMap(props: ComposableMapProps): JSX.Element;
  export function ZoomableGroup(props: ZoomableGroupProps): JSX.Element;
  export function Geographies(props: GeographiesProps): JSX.Element;
  export function Geography(props: GeographyProps): JSX.Element;
  export function Marker(props: MarkerProps): JSX.Element;
}
