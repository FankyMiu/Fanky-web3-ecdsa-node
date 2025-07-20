import { useState } from "react";
import { sign } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes, hexToBytes, bytesToHex } from "ethereum-cryptography/utils";

export default function App() {
  const [sender, setSender] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [queryAddress, setQueryAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [nonce, setNonce] = useState(0);
  const [txHistory, setTxHistory] = useState([]);

  // 查餘額
  async function fetchBalance() {
    setError("");
    if (!queryAddress) return;
    try {
      const res = await fetch(`http://localhost:3042/balance/${queryAddress.toLowerCase()}`);
      if (!res.ok) throw new Error("Balance query failed!");
      const data = await res.json();
      setBalance(data.balance);

      // 同時查 nonce
      const resN = await fetch(`http://localhost:3042/nonce/${queryAddress.toLowerCase()}`);
      const dataN = await resN.json();
      setNonce(dataN.nonce);
    } catch (e) {
      setBalance("");
      setError(e.message);
    }
  }

  // 查詢交易紀錄
  async function fetchTxs() {
    setError("");
    try {
      const res = await fetch("http://localhost:3042/transactions");
      if (!res.ok) throw new Error("Transaction history query failed!");
      const data = await res.json();
      setTxHistory(data.reverse());
    } catch (e) {
      setTxHistory([]);
      setError(e.message);
    }
  }

  // 取得目標帳號 nonce
  async function getSenderNonce(address) {
    const res = await fetch(`http://localhost:3042/nonce/${address.toLowerCase()}`);
    const data = await res.json();
    return data.nonce;
  }

  // 發送
  async function handleSend() {
    setError("");
    setResult("");
    try {
      if (!sender || !recipient || !amount || !privateKey) throw new Error("Please fill in all fields!");
      const senderLc = sender.toLowerCase(), recipientLc = recipient.toLowerCase();
      const nonceValue = await getSenderNonce(senderLc);

      const message = `${senderLc}|${recipientLc}|${amount}|${nonceValue}`;
      const messageHash = keccak256(utf8ToBytes(message));
      const privateKeyBytes = hexToBytes(privateKey.trim());
      const [signature, recoveryBit] = await sign(messageHash, privateKeyBytes, { recovered: true });

      // Debug
      console.log("[Client] message:", message);
      console.log("[Client] messageHash:", bytesToHex(messageHash));
      console.log("[Client] signature:", Array.from(signature), signature.length);
      console.log("[Client] recoveryBit:", recoveryBit);

      const res = await fetch("http://localhost:3042/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: senderLc,
          recipient: recipientLc,
          amount: Number(amount),
          nonce: nonceValue,
          signature: Array.from(signature),
          recoveryBit,
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || "Transaction failed!");
      setResult(JSON.stringify(body));
      fetchBalance(); // update balance and nonce
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div style={{ padding: 32, fontFamily: "sans-serif" }}>
      <h1>Ethereum Wallet (with Nonce, Replay Attack Protected)</h1>
      {/* Balance Query */}
      <section>
        <h2>Check Balance</h2>
        <input
          value={queryAddress}
          onChange={e => setQueryAddress(e.target.value.toLowerCase())}
          style={{ width: 400 }}
          placeholder="Enter Ethereum address (0x...)"
        />
        <button onClick={fetchBalance}>Check</button>
        <span style={{ marginLeft: 10 }}>
          Balance: {balance} | Nonce: {nonce}
        </span>
      </section>
      <hr />
      {/* Send Transaction */}
      <section>
        <h2>Send Transaction</h2>
        <div>
          <label>Sender Address:{" "}
            <input style={{ width: 400 }} value={sender} onChange={e => setSender(e.target.value.toLowerCase())} placeholder="Sender 0x..." />
          </label>
        </div>
        <div>
          <label>Recipient Address:{" "}
            <input style={{ width: 400 }} value={recipient} onChange={e => setRecipient(e.target.value.toLowerCase())} placeholder="Recipient 0x..." />
          </label>
        </div>
        <div>
          <label>Amount:{" "}
            <input value={amount} onChange={e => setAmount(e.target.value)} type="number" />
          </label>
        </div>
        <div>
          <label>Sender Private Key:{" "}
            <input style={{ width: 400 }} value={privateKey} onChange={e => setPrivateKey(e.target.value)} placeholder="Sender private key (hex)" />
          </label>
        </div>
        <button onClick={handleSend}>Send</button>
        {result && <pre>Result: {result}</pre>}
        {error && <div style={{ color: "red" }}>Error: {error}</div>}
      </section>
      <hr />
      {/* Transaction History */}
      <section>
        <h2>Transaction History</h2>
        <button onClick={fetchTxs}>Load History</button>
        <ul>
          {txHistory.map((tx, i) => (
            <li key={i}>
              <span>[{tx.time}]</span><br />
              <span>From: <span style={{ fontFamily: "monospace" }}>{tx.sender.slice(0, 10)}...</span></span> →
              <span>To: <span style={{ fontFamily: "monospace" }}>{tx.recipient.slice(0, 10)}...</span></span>
              , Amount: <b>{tx.amount}</b>, Nonce: <b>{tx.nonce}</b>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
