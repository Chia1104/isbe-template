import { sha3_512 } from "js-sha3";

const sha3512 = (data: string) => {
  // return await crypto.subtle
  //   .digest("SHA-512", new TextEncoder().encode(data))
  //   .then((buf) => {
  //     return Array.prototype.map
  //       .call(new Uint8Array(buf), (x) => `00${x.toString(16)}`.slice(-2))
  //       .join("");
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //     return "";
  //   });
  return sha3_512(data);
};

export default sha3512;
