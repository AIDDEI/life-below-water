declare module "*.png"
declare module "*.jpg"
declare module "*.mp3"
declare module "*.wav"
declare module "*.jpeg"
declare module "*.json"

// binary files
declare module "*.bin" {
    const value: any;
    export default value;
}


