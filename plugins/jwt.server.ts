import type { PublicKeyInput, JsonWebKeyInput } from "crypto";
import jwt from "jsonwebtoken";

export default defineNuxtPlugin((_nuxtApp) => {
  return {
    provide: {
      verifyJwtToken: (
        token: string,
        secret:
          | jwt.Secret
          | PublicKeyInput
          | Buffer<ArrayBufferLike>
          | JsonWebKeyInput,
        options?: jwt.VerifyOptions & { complete: true }
      ) => {
        return jwt.verify(token, secret, options);
      },
    },
  };
});
