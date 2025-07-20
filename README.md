# ECDSA Wallet Demo (Node.js + React)

## 專案簡介
本專案實作以 ECDSA 私鑰產生、前端離線簽章及後端驗證、Nonce 防重放等關鍵資安機制，模擬以太坊核心錢包功能。

## 功能亮點
- Ethereum address 格式錢包全自動生成
- Client 端安全私鑰管理，Never uploaded to server
- 支援資產查詢、簽章認證與防 replay 資安設計
- Tech stack: Node.js, Express, React, secp256k1, Keccak256

## 快速開始
1. 安裝依賴（Client/Server 皆要安裝）
2. 啟動 Server：`npm run start`  
3. 啟動 Client：`cd client && npm run dev`

## 🧑‍💻 學習與實作要點

> This repository demonstrates the core cryptographic workflow of a minimalistic Ethereum-like wallet, including key generation, client-side signing, and stateless server verification. The implementation adopts industry best practices, separating private key management strictly on client-side and employing nonce-based replay protection on the server for optimal security.  
> 
> Throughout this project, I deepened my understanding of core blockchain primitives, ECDSA mechanics, and the importance of robust security design in decentralized applications.

### 1. 環境建置
- 熟悉 Node/React 專案初始化與多目錄協作
- 學會 terminal、VSCode tool chain 使用

### 2. 錢包/帳戶生成 & Ethereum 地址規範
- 自動批量產生私鑰 → 從公鑰推導 Ethereum address
- 私鑰僅本地 wallets.txt 儲存，嚴禁進版控

### 3. 資產查詢 & 轉帳基礎
- 端到端 client-server 流程打通
- 使用 address 查詢餘額、發送交易

### 4. ECDSA 簽章 + Nonce 防重放
- 前端本地簽章、server 僅驗證 signature
- 加入 nonce 機制模擬主網 Replay Protection
- Server 嚴謹驗證資金、nonce、簽章有效性

### 5. Debug 與資安細節
- Address 格式/大小寫 bug、私鑰拷貝錯誤警覺
- 錯誤簽章測試/重送防禦，反覆驗證資安設計

## 🦾 最佳實踐 / 自我成長

- 強化對 ECDSA/資安流程的第一手理解
- 養成每步紀錄 debug/心得、便於日後持續精進
- 完整端到端實作 → 能用於 web3 求職或入門教材

## 📁 專案結構建議

```
ecdsa-node/
  ├─ server/
  ├─ client/
  ├─ wallets/
  │    └─ ecdsa-wallets.txt
  ├─ readme.md
  └─ notes/
       ├─ learning-journey.md
       └─ bug-records.md
```

## 📖 延伸閱讀  
- [ECDSA 介紹](https://blog.cloudflare.com/ecdsa-the-digital-signature-algorithm-of-a-better-internet/)
- [Web3 密碼學設計模式](https://arxiv.org/pdf/2311.18057.pdf)

