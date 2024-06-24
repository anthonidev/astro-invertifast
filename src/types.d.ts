interface NavItem {
  title: string;
  url: string;
}
interface FeatureItem {
  description: string;
  icon: string;
  title: string;
}
interface CarruselItem {
  src: ImageMetadata;
  alt: string;
}

declare module "aos";
