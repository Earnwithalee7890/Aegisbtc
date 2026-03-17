import DeployClient from './DeployClient';

const CONTRACT_CODE = `;; Aegis STX & sBTC Unified Vault
;; Real smart contract for depositing actual STX and SIP-010 sBTC on Testnet

(define-constant err-not-authorized (err u100))
(define-constant err-invalid-amount (err u101))

;; Maps for tracking deposits
(define-map stx-deposits principal uint)
(define-map sbtc-deposits principal uint)

(define-data-var total-stx-locked uint u0)
(define-data-var total-sbtc-locked uint u0)

;; Store user yield subscriptions/streams
(define-map subscriptions principal principal)

;; ==========================
;; STX VAULT FUNCTIONS
;; ==========================

(define-public (deposit-stx (amount uint))
    (begin
        (asserts! (> amount u0) err-invalid-amount)
        ;; Actually transfer STX from the user to the contract
        (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
        
        ;; Update records
        (let ((current-balance (default-to u0 (map-get? stx-deposits tx-sender))))
            (map-set stx-deposits tx-sender (+ current-balance amount))
            (var-set total-stx-locked (+ (var-get total-stx-locked) amount))
            (ok true)
        )
    )
)

;; ==========================
;; sBTC VAULT FUNCTIONS
;; ==========================

(define-public (deposit-sbtc (amount uint))
    (begin
        (asserts! (> amount u0) err-invalid-amount)
        ;; Actually transfer sBTC from the user to the contract
        ;; Using the real Testnet sBTC contract ID
        (try! (contract-call? 'SP3Y2ZSH8P7D50B0VBTSX11S7XSG24M1VB9HQJ02R.sbtc transfer amount tx-sender (as-contract tx-sender) none))
        
        ;; Update records
        (let ((current-balance (default-to u0 (map-get? sbtc-deposits tx-sender))))
            (map-set sbtc-deposits tx-sender (+ current-balance amount))
            (var-set total-sbtc-locked (+ (var-get total-sbtc-locked) amount))
            (ok true)
        )
    )
)

;; ==========================
;; SUBSCRIPTIONS & YIELD
;; ==========================

;; Register a subscription (who gets the yield?)
(define-public (set-subscription (recipient principal))
    (begin
        (map-set subscriptions tx-sender recipient)
        (ok true)
    )
)

;; ==========================
;; READ ONLY
;; ==========================

(define-read-only (get-stx-balance (user principal))
    (default-to u0 (map-get? stx-deposits user))
)

(define-read-only (get-sbtc-balance (user principal))
    (default-to u0 (map-get? sbtc-deposits user))
)

(define-read-only (get-total-stx-liquidity)
    (var-get total-stx-locked)
)

(define-read-only (get-total-sbtc-liquidity)
    (var-get total-sbtc-locked)
)`;

export default function DeployTestnetPage() {
  return (
    <div className="pt-24 min-h-screen bg-surface-950 flex flex-col justify-center items-center">
      <DeployClient contractCode={CONTRACT_CODE} />
    </div>
  );
}
