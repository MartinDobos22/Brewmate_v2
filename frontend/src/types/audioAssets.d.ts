/**
 * Metro resolves a bundled sound file to an asset handle, which `expo-audio`
 * takes as its source. The bundler has always done this; only the declaration
 * is missing, so this states what is already there rather than asserting a
 * type over it.
 */
declare module '*.wav' {
  const asset: number;
  export default asset;
}
