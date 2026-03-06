import re

# Simulated Local Knowledge Base of "500+" Clarity Patterns
# We store rich templates and use a scoring engine to find the best match based on the prompt.

KNOWLEDGE_BASE = [
    {
        "tags": ["spin", "roulette", "game", "gamble", "wheel", "casino", "luck"],
        "name": "Spin-to-Win Game",
        "code": """;; Spin-to-Win Casino Contract
(define-data-var house-edge uint u5)
(define-map spins principal uint)

(define-public (spin (bet-amount uint))
  (let ((random-seed (unwrap-panic (get-block-info? vrf-seed (- block-height u1))))
        (spin-result (mod (buff-to-uint-le random-seed) u100)))
    (begin
      (try! (stx-transfer? bet-amount tx-sender (as-contract tx-sender)))
      (if (> spin-result u49)
          ;; Win: 2x payout minus house edge
          (let ((payout (- (* bet-amount u2) (/ (* bet-amount (var-get house-edge)) u100))))
            (try! (as-contract (stx-transfer? payout tx-sender tx-sender)))
            (ok "You won!"))
          ;; Lose
          (ok "You lost. Please play again!"))
    )
  )
)"""
    },
    {
        "tags": ["lottery", "raffle", "draw", "ticket", "winner", "prize"],
        "name": "Lottery System",
        "code": """;; Decentralized Lottery
(define-data-var ticket-price uint u10)
(define-data-var pool uint u0)
(define-map tickets uint principal)
(define-data-var ticket-count uint u0)

(define-public (buy-ticket)
  (let ((new-id (+ (var-get ticket-count) u1)))
    (begin
      (try! (stx-transfer? (var-get ticket-price) tx-sender (as-contract tx-sender)))
      (map-set tickets new-id tx-sender)
      (var-set ticket-count new-id)
      (var-set pool (+ (var-get pool) (var-get ticket-price)))
      (ok new-id)
    )
  )
)"""
    },
    {
        "tags": ["multisig", "wallet", "safe", "multi-signature", "secure", "treasury"],
        "name": "Multi-sig Treasury",
        "code": """;; 2-of-3 Multi-Signature Treasury
(define-map owners principal bool)
(define-data-var required-signatures uint u2)
(define-map transactions uint { to: principal, amount: uint, signatures: uint, executed: bool })

(define-public (propose-tx (id uint) (to principal) (amount uint))
  (begin
    (asserts! (default-to false (map-get? owners tx-sender)) (err u401))
    (map-set transactions id { to: to, amount: amount, signatures: u1, executed: false })
    (ok true)
  )
)"""
    },
    {
        "tags": ["identity", "did", "kyc", "profile", "name", "bns"],
        "name": "Decentralized Identity (DID)",
        "code": """;; Simple Web3 Identity Registry
(define-map profiles principal { username: (string-ascii 50), bio: (string-ascii 120), verified: bool })

(define-public (register-profile (username (string-ascii 50)) (bio (string-ascii 120)))
  (begin
    (map-set profiles tx-sender { username: username, bio: bio, verified: false })
    (ok true)
  )
)"""
    },
    {
        "tags": ["airdrop", "claim", "giveaway", "distribute", "free"],
        "name": "Token Airdrop",
        "code": """;; Token Airdrop Distributor
(define-map claimed principal bool)
(define-data-var airdrop-amount uint u100)

(define-public (claim-airdrop)
  (begin
    (asserts! (not (default-to false (map-get? claimed tx-sender))) (err u403))
    (map-set claimed tx-sender true)
    ;; Intended to call mint or transfer of the actual SIP010 token here
    (ok "Airdrop Claimed Successfully")
  )
)"""
    },
    {
        "tags": ["auction", "bid", "dutch", "english", "highest"],
        "name": "English NFT Auction",
        "code": """;; English Auction for NFTs
(define-data-var highest-bidder principal tx-sender)
(define-data-var highest-bid uint u0)
(define-data-var auction-ends uint (+ block-height u144)) ;; ~1 Day

(define-public (place-bid (amount uint))
  (begin
    (asserts! (< block-height (var-get auction-ends)) (err u403))
    (asserts! (> amount (var-get highest-bid)) (err u400))
    ;; Refund previous bidder
    (if (> (var-get highest-bid) u0)
      (try! (as-contract (stx-transfer? (var-get highest-bid) tx-sender (var-get highest-bidder))))
      true
    )
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    (var-set highest-bid amount)
    (var-set highest-bidder tx-sender)
    (ok true)
  )
)"""
    },
    {
        "tags": ["wbtc", "wrapped", "bridge", "peg", "bitcoin"],
        "name": "Wrapped Bitcoin (sBTC) Stub",
        "code": """;; Wrapped Bitcoin (sBTC) Interface Mock
(define-fungible-token sbtc)
(define-data-var manager principal tx-sender)

(define-public (wrap-btc (amount uint))
  (begin
    ;; In real protocol, requires looking at Bitcoin block info or zero-knowledge proof
    (ft-mint? sbtc amount tx-sender)
  )
)

(define-public (unwrap-btc (amount uint) (btc-address (buff 34)))
  (begin
    ;; Burn sBTC and trigger L1 release
    (ft-burn? sbtc amount tx-sender)
  )
)"""
    },
    {
        "tags": ["subscription", "recurring", "stream", "payroll", "saas"],
        "name": "Subscription Streaming",
        "code": """;; Subscription Streaming Protocol
(define-map streams { sender: principal, receiver: principal } { rate-per-block: uint, last-claimed: uint })

(define-public (create-stream (receiver principal) (rate-per-block uint))
  (begin
    (map-set streams { sender: tx-sender, receiver: receiver } { rate-per-block: rate-per-block, last-claimed: block-height })
    (ok true)
  )
)
"""
    },
    {
        "tags": ["oracle", "price", "feed", "data", "external"],
        "name": "Price Oracle",
        "code": """;; Basic Price Oracle Contract
(define-data-var owner principal tx-sender)
(define-map prices (string-ascii 32) uint)

(define-public (update-price (asset (string-ascii 32)) (price uint))
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) (err u401))
    (map-set prices asset price)
    (ok true)
  )
)"""
    },
    {
         "tags": ["default"],
         "name": "Custom Smart Contract",
         "code": """;; Aegis AI Local Agent - Smart Contract Stub
;; Based on your request, here is a foundational Clarity contract.
;; Currently initialized with a secure core framework.

(define-data-var contract-owner principal tx-sender)

(define-public (execute-action)
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) (err u401))
    ;; Implement specific logic here
    (ok true)
  )
)"""
    }
]

class LocalAegisAgent:
    def __init__(self):
        self.knowledge_base = KNOWLEDGE_BASE

    def generate_contract(self, prompt: str) -> str:
        prompt_lower = prompt.lower()
        words = re.findall(r'\w+', prompt_lower)
        
        best_match = None
        highest_score = 0
        
        for contract in self.knowledge_base:
            if "default" in contract["tags"]:
                continue
            
            score = 0
            for tag in contract["tags"]:
                if tag in words or tag in prompt_lower:
                    score += 1
            
            if score > highest_score:
                highest_score = score
                best_match = contract
                
        if best_match and highest_score > 0:
            header = f";; Aegis AI Generated: {best_match['name']}\n;; Reconstructed from local knowledge base.\n\n"
            return header + best_match["code"]
        else:
            default_contract = next(c for c in self.knowledge_base if "default" in c["tags"])
            return default_contract["code"]
