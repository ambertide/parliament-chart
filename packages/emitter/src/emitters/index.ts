import { Emitter } from "./Emitter";
import { twitterEmitter } from "./twitterEmitter";

export const emitters: Record<string, Emitter> = {
  twitter: twitterEmitter
};
