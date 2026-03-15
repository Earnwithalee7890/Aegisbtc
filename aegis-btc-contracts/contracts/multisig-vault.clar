;; Multi-Signature Vault Contract
;; Requires 2 of 3 signatures to execute vault administration commands.

(define-constant err-not-authorized (err u300))
(define-constant err-already-signed (err u301))
(define-constant err-invalid-tx (err u302))

(define-data-var owners (list 3 principal) (list 'SP1XZ2H86M60YJ7H1EGEBMT2R8X767V0Q59Q2E8Q3 'SP2M3A5NYYQDB8A1QDBJ4N0T6A5K7V430Y4X1Z0K8 'SP31B2WKV05Z7X2B2XTYH8QK0BMMT42D0GZ5Y3Y3V))
(define-data-var required-signatures uint u2)
(define-map pending-txs uint { action: (string-ascii 20), params: uint, threshold: uint })
(define-map signatures { tx-id: uint, signer: principal } bool)
(define-data-var current-tx-id uint u0)

(define-public (propose-action (action (string-ascii 20)) (params uint))
    (begin
        (asserts! (is-some (index-of (var-get owners) tx-sender)) err-not-authorized)
        (let ((tx-id (+ (var-get current-tx-id) u1)))
            (map-set pending-txs tx-id { action: action, params: params, threshold: u0 })
            (var-set current-tx-id tx-id)
            (map-set signatures { tx-id: tx-id, signer: tx-sender } true)
            (ok tx-id)
        )
    )
)
