import DeployClient from './DeployClient';

const CONTRACT_CODE = `;; Aegis Unified Protocol v3.1 (Mainnet Edition)
;; Optimized for Maximum Stacks Wallet Compatibility
;; Purpose: Bitcoin-Backed Synthetic Liquidity & AI Risk Management

;; Error codes
(define-constant ERR_UNAUTHORIZED (err u100))
(define-constant ERR_INVALID_AMOUNT (err u101))

;; Internal Protocol Tokens
(define-fungible-token aegis-sbtc)
(define-fungible-token aegis-usdcx)

;; Data Storage
(define-map vault-balances principal uint)
(define-map vault-stx-balances principal uint)
(define-map debt-balances principal uint)

;; --- 1. THE FAUCET (FOR DEMO/TESTING) ---
(define-public (faucet-mock-sbtc)
    (begin
        (try! (ft-mint? aegis-sbtc u100000000000 tx-sender))
        (ok true)))

;; --- 2. DEPOSIT TO VAULT ---
;; Lock Aegis sBTC
(define-public (deposit-sbtc (amount uint))
    (let (
        (current-bal (default-to u0 (map-get? vault-balances tx-sender)))
    )
    (begin
        (asserts! (> amount u0) ERR_INVALID_AMOUNT)
        (try! (ft-burn? aegis-sbtc amount tx-sender))
        (map-set vault-balances tx-sender (+ current-bal amount))
        (ok true))))

;; Lock native STX
(define-public (deposit-stx (amount uint))
    (let (
        (current-bal (default-to u0 (map-get? vault-stx-balances tx-sender)))
    )
    (begin
        (asserts! (> amount u0) ERR_INVALID_AMOUNT)
        (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
        (map-set vault-stx-balances tx-sender (+ current-bal amount))
        (ok true))))

;; --- 3. BORROW USDCx ---
(define-public (borrow-usdcx (amount uint))
    (let (
        (collateral (default-to u0 (map-get? vault-balances tx-sender)))
        (stx-collateral (default-to u0 (map-get? vault-stx-balances tx-sender)))
        (current-debt (default-to u0 (map-get? debt-balances tx-sender)))
    )
    (begin
        ;; Guard: User must have some collateral
        (asserts! (or (> collateral u0) (> stx-collateral u0)) ERR_UNAUTHORIZED)
        (try! (ft-mint? aegis-usdcx amount tx-sender))
        (map-set debt-balances tx-sender (+ current-debt amount))
        (ok true))))

;; --- 4. DEX SWAP ---
(define-public (swap-sbtc-to-usdcx (amount uint))
    (begin
        (try! (ft-burn? aegis-sbtc amount tx-sender))
        (try! (ft-mint? aegis-usdcx (* amount u65000) tx-sender))
        (ok true)))

(define-public (swap-stx-to-usdcx (amount uint))
    (begin
        (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
        ;; Demo: 1 STX = 2.5 USDCx
        (try! (ft-mint? aegis-usdcx (/ (* amount u25) u10) tx-sender))
        (ok true)))

;; --- 5. READ ONLY GETTERS ---
(define-read-only (get-sbtc-balance (user principal))
    (default-to u0 (map-get? vault-balances user)))

(define-read-only (get-stx-balance (user principal))
    (default-to u0 (map-get? vault-stx-balances user)))

(define-read-only (get-usdcx-debt (user principal))
    (default-to u0 (map-get? debt-balances user)))`;

export default function DeployTestnetPage() {
  return (
    <div className="pt-24 min-h-screen bg-surface-950 flex flex-col justify-center items-center">
      <DeployClient contractCode={CONTRACT_CODE} />
    </div>
  );
}
