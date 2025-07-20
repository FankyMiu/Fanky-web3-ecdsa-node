const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");

// 1. 產生隨機 private key (32 bytes)
const privateKey = secp.utils.randomPrivateKey();
console.log("private key:", toHex(privateKey));

// 2. 由 private key 推導出完整公鑰（uncompressed，130字hex，04開頭）
const publicKey = secp.getPublicKey(privateKey);
console.log("public key:", toHex(publicKey));

// 3. （可選步驟）推導「以太坊格式」錢包地址
const address = keccak256(publicKey.slice(1)).slice(-20);
console.log("address: 0x" + toHex(address));
