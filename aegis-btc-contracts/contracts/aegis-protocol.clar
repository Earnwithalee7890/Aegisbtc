;; Aegis Protocol Core Contract
;; Unified contract for STX Vault, sBTC Vault, and USDCx Borrowing

(define-constant err-not-authorized (err u100))
(define-constant err-invalid-amount (err u101))
(define-constant err-insufficient-collateral (err u102))
(define-constant err-faucet-limit (err u103))

;; Define internal tokens
(define-fungible-token mock-sbtc)
(define-fungible-token usdcx)

;; Tracking state
(define-map stx-deposits principal uint)
(define-map sbtc-deposits principal uint)
(define-map borrowed-usdcx principal uint)
(define-map faucet-last-claim principal uint)
(define-map subscriptions principal principal)

(define-data-var total-sbtc-locked uint u0)
(define-data-var total-usdcx-borrowed uint u0)

;; ==========================
;; FAUCET (24h Limit)
;; ==========================
(define-public (faucet-mock-sbtc)
    (let (
        (last-claim (default-to u0 (map-get? faucet-last-claim tx-sender)))
    )
    (begin
        (asserts! (>= block-height (+ last-claim u144)) err-faucet-limit)
        (try! (ft-mint? mock-sbtc u100000000000 tx-sender))
        (map-set faucet-last-claim tx-sender block-height)
        (print { action: "faucet-claim", user: tx-sender, amount: u100000000000 })
        (ok true)
    ))
)

;; ==========================
;; DEX SWAP (sBTC/USDCx)
;; ==========================
(define-public (swap-sbtc-to-usdcx (amount uint))
    (begin
        (try! (ft-burn? mock-sbtc amount tx-sender))
        ;; Price: 1 sBTC = 65,000 USDCx
        (try! (ft-mint? usdcx (* amount u65000) tx-sender))
        (print { action: "swap", user: tx-sender, from: "sbtc", to: "usdcx", amount: amount })
        (ok true)
    )
)

(define-public (swap-usdcx-to-sbtc (amount uint))
    (begin
        (try! (ft-burn? usdcx amount tx-sender))
        ;; Inverse Price
        (try! (ft-mint? mock-sbtc (/ amount u65000) tx-sender))
        (print { action: "swap", user: tx-sender, from: "usdcx", to: "sbtc", amount: amount })
        (ok true)
    )
)

;; ==========================
;; VAULT & LENDING
;; ==========================
(define-public (deposit-stx (amount uint))
    (begin
        (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
        (let ((curr (default-to u0 (map-get? stx-deposits tx-sender))))
            (map-set stx-deposits tx-sender (+ curr amount))
            (print { action: "deposit-stx", user: tx-sender, amount: amount })
            (ok true))
    )
)

(define-public (deposit-sbtc (amount uint))
    (begin
        (try! (ft-transfer? mock-sbtc amount tx-sender (as-contract tx-sender)))
        (let ((curr (default-to u0 (map-get? sbtc-deposits tx-sender))))
            (map-set sbtc-deposits tx-sender (+ curr amount))
            (var-set total-sbtc-locked (+ (var-get total-sbtc-locked) amount))
            (print { action: "deposit-sbtc", user: tx-sender, amount: amount })
            (ok true))
    )
)

(define-public (borrow-usdcx (amount uint))
    (let (
        (debt (default-to u0 (map-get? borrowed-usdcx tx-sender)))
        (collateral (default-to u0 (map-get? sbtc-deposits tx-sender)))
    )
    (begin
        ;; Basic security: must have sBTC collateral
        (asserts! (> collateral u0) err-insufficient-collateral)
        (map-set borrowed-usdcx tx-sender (+ debt amount))
        (var-set total-usdcx-borrowed (+ (var-get total-usdcx-borrowed) amount))
        (try! (ft-mint? usdcx amount tx-sender))
        (print { action: "borrow", user: tx-sender, amount: amount })
        (ok true))
    )
)

(define-public (repay-usdcx (amount uint))
    (let ((debt (default-to u0 (map-get? borrowed-usdcx tx-sender))))
    (begin
        (asserts! (>= debt amount) err-invalid-amount)
        (map-set borrowed-usdcx tx-sender (- debt amount))
        (var-set total-usdcx-borrowed (- (var-get total-usdcx-borrowed) amount))
        (try! (ft-burn? usdcx amount tx-sender))
        (print { action: "repay", user: tx-sender, amount: amount })
        (ok true))
    )
)

(define-public (set-subscription (recipient principal))
    (begin
        (map-set subscriptions tx-sender recipient)
        (print { action: "set-subscription", user: tx-sender, recipient: recipient })
        (ok true)
    )
)

;; ==========================
;; READ-ONLY
;; ==========================
(define-read-only (get-stx-balance (user principal)) (default-to u0 (map-get? stx-deposits user)))
(define-read-only (get-sbtc-balance (user principal)) (default-to u0 (map-get? sbtc-deposits user)))
(define-read-only (get-usdcx-debt (user principal)) (default-to u0 (map-get? borrowed-usdcx user)))
(define-read-only (get-subscription (user principal)) (map-get? subscriptions user))
(define-read-only (get-stats)
    {
        total-sbtc: (var-get total-sbtc-locked),
        total-usdcx: (var-get total-usdcx-borrowed)
    }
)
