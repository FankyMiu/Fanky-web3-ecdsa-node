# ECDSA Web App 學習歷程 & 技術重點

## 📚 專案簡介

本專案為以 Node.js & React 建構的端到端 ECDSA Wallet Dapp，包含私鑰產生、本地簽章（signature）、server驗證等，以模擬以太坊錢包在 web3 實務中完整的安全流程。  
自學過程涵蓋從前端私鑰安全、地址生成、簽章與 nonce 資安防護，至 Server 驗證防重放攻擊等全鏈條設計。

## 🏗️ 專案技術架構

- **前端 (client)：** React、私鑰本地存儲與簽章產生
- **後端 (server)：** Node.js (Express)、signature 驗證、address 資料管理、nonce 防重放
- **錢包金鑰生成：** secp256k1、Keccak256 地址實作
- **通訊流程：** 只傳已簽名數據，絕不曝光私鑰

## 🧑‍💻 學習與實作要點

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

