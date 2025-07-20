const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

// Address => Balance
const balances = {
  "0xc3c7d78fa6de9b557b1538bc1b6298bba0f81777": 100,
  "0xf4209eba167e6c792628e795aa827aba0b38d2fc": 50,
  "0x0f1bb773c1eb3c20dbef0c9e78d974b45fce6baf": 25
};

// Address => Nonce
const nonces = {
  "0xc3c7d78fa6de9b557b1538bc1b6298bba0f81777": 0,
  "0xf4209eba167e6c792628e795aa827aba0b38d2fc": 0,
  "0x0f1bb773c1eb3c20dbef0c9e78d974b45fce6baf": 0
};

const transactions = [];

// 查餘額
app.get("/balance/:address", (req, res) => {
  const address = req.params.address.toLowerCase();
  res.send({ balance: balances[address] || 0 });
});

// 查 nonce
app.get("/nonce/:address", (req, res) => {
  const address = req.params.address.toLowerCase();
  res.send({ nonce: nonces[address] || 0 });
});

// 查紀錄
app.get("/transactions", (req, res) => {
  res.json(transactions);
});

// 轉帳（含 nonce 驗證）
app.post("/send", async (req, res) => {
  const { sender, recipient, amount, nonce, signature, recoveryBit } = req.body;

  const senderLower = sender.toLowerCase();
  const recipientLower = recipient.toLowerCase();

  // 驗證 nonce（重放防護核心）
  if (nonce !== (nonces[senderLower] || 0)) {
    res.status(400).send({ message: "Invalid nonce or replay attack!" });
    return;
  }

  const message = `${senderLower}|${recipientLower}|${amount}|${nonce}`;
  const messageHash = keccak256(utf8ToBytes(message));
  let publicKey;
  try {
    publicKey = secp.recoverPublicKey(
      messageHash,
      Uint8Array.from(signature),
      recoveryBit
    );
  } catch (err) {
    res.status(400).send({ message: "Invalid signature!" });
    return;
  }

  const recoveredAddress = "0x" + toHex(keccak256(publicKey.slice(1)).slice(-20));
  if (recoveredAddress.toLowerCase() !== senderLower) {
    res.status(400).send({ message: "Signature does not match sender address!" });
    return;
  }

  setInitialBalance(senderLower);
  setInitialBalance(recipientLower);

  if (balances[senderLower] < amount) {
    res.status(400).send({ message: "Insufficient balance!" });
    return;
  }

  // 資產操作
  balances[senderLower] -= amount;
  balances[recipientLower] += amount;
  nonces[senderLower] = nonce + 1; // nonce 成功交易後+1

  transactions.push({
    sender: senderLower, recipient: recipientLower, amount, nonce,
    time: new Date().toISOString()
  });

  res.send({ balance: balances[senderLower] });
});

function setInitialBalance(address) {
  if (balances[address] === undefined) balances[address] = 0;
  if (nonces[address] === undefined) nonces[address] = 0;
}

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
