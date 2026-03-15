;; Aegis Emergency Circuit Breaker
;; Provides emergency pause, withdrawal, and admin recovery mechanisms
;; for the Aegis protocol to protect user funds in case of exploits.

(define-constant CONTRACT-OWNER tx-sender)
(define-constant err-not-authorized (err u200))
(define-constant err-contract-paused (err u201))
(define-constant err-already-paused (err u202))
(define-constant err-not-paused (err u203))
(define-constant err-cooldown-active (err u204))

;; Circuit breaker state
(define-data-var is-paused bool false)
(define-data-var pause-block uint u0)
(define-data-var emergency-admin principal CONTRACT-OWNER)
(define-data-var total-emergency-withdrawals uint u0)

;; Cooldown: prevents rapid pause/unpause (minimum 10 blocks)
(define-data-var min-pause-cooldown uint u10)

;; Emergency withdrawal tracking
(define-map emergency-withdrawals principal uint)
(define-map withdrawal-timestamps principal uint)

;; ==========================
;; ADMIN FUNCTIONS
;; ==========================

;; Pause the entire protocol
(define-public (pause-protocol)
    (begin
        (asserts! (is-eq tx-sender (var-get emergency-admin)) err-not-authorized)
        (asserts! (not (var-get is-paused)) err-already-paused)
        (var-set is-paused true)
        (var-set pause-block block-height)
        (print { action: "protocol-paused", admin: tx-sender, block: block-height })
        (ok true)
    )
)

;; Resume the protocol after cooldown
(define-public (resume-protocol)
    (begin
        (asserts! (is-eq tx-sender (var-get emergency-admin)) err-not-authorized)
        (asserts! (var-get is-paused) err-not-paused)
        (asserts! (>= block-height (+ (var-get pause-block) (var-get min-pause-cooldown))) err-cooldown-active)
        (var-set is-paused false)
        (print { action: "protocol-resumed", admin: tx-sender, block: block-height })
        (ok true)
    )
)

;; Transfer emergency admin role
(define-public (transfer-emergency-admin (new-admin principal))
    (begin
        (asserts! (is-eq tx-sender (var-get emergency-admin)) err-not-authorized)
        (var-set emergency-admin new-admin)
        (print { action: "admin-transferred", from: tx-sender, to: new-admin })
        (ok true)
    )
)

;; Emergency withdraw STX (only when paused)
(define-public (emergency-withdraw-stx (amount uint))
    (begin
        (asserts! (var-get is-paused) err-not-paused)
        (asserts! (> amount u0) (err u101))
        (let (
            (prev-withdrawn (default-to u0 (map-get? emergency-withdrawals tx-sender)))
        )
            (map-set emergency-withdrawals tx-sender (+ prev-withdrawn amount))
            (map-set withdrawal-timestamps tx-sender block-height)
            (var-set total-emergency-withdrawals (+ (var-get total-emergency-withdrawals) amount))
            (try! (as-contract (stx-transfer? amount tx-sender tx-sender)))
            (print { action: "emergency-withdraw", user: tx-sender, amount: amount })
            (ok true)
        )
    )
)

;; ==========================
;; READ-ONLY FUNCTIONS
;; ==========================

(define-read-only (get-protocol-status)
    {
        paused: (var-get is-paused),
        pause-block: (var-get pause-block),
        admin: (var-get emergency-admin),
        total-emergency-withdrawals: (var-get total-emergency-withdrawals)
    }
)

(define-read-only (get-emergency-withdrawal (user principal))
    (default-to u0 (map-get? emergency-withdrawals user))
)

(define-read-only (is-protocol-paused)
    (var-get is-paused)
)
