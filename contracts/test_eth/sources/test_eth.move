/// Testnet-only mock ETH coin for Sentinel UI testing.
/// Anyone can mint up to 10 tETH per call via a shared MintCap.
#[allow(deprecated_usage, lint(public_entry))]
module test_eth::test_eth {
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::url;

    public struct TEST_ETH has drop {}

    /// Shared treasury so anyone can mint without owning the cap.
    public struct MintCap has key {
        id: UID,
        cap: TreasuryCap<TEST_ETH>,
    }

    /// 10 ETH (8 decimals)
    const MAX_MINT: u64 = 1_000_000_000;
    const E_EXCEEDS_MAX: u64 = 0;

    fun init(witness: TEST_ETH, ctx: &mut TxContext) {
        let (cap, metadata) = coin::create_currency(
            witness,
            8,
            b"tETH",
            b"Test ETH",
            b"Testnet ETH for Sentinel demos. Worthless.",
            option::some(url::new_unsafe_from_bytes(
                b"https://assets.coingecko.com/coins/images/279/small/ethereum.png"
            )),
            ctx,
        );
        transfer::public_freeze_object(metadata);
        transfer::share_object(MintCap { id: object::new(ctx), cap });
    }

    /// Mint up to 10 tETH to `recipient`. Free for anyone on testnet.
    public entry fun mint(
        mint_cap: &mut MintCap,
        amount: u64,
        recipient: address,
        ctx: &mut TxContext,
    ) {
        assert!(amount <= MAX_MINT, E_EXCEEDS_MAX);
        let coin = coin::mint(&mut mint_cap.cap, amount, ctx);
        transfer::public_transfer(coin, recipient);
    }

    /// Mint `amount` and merge into `existing`, return to caller.
    public entry fun mint_and_merge(
        mint_cap: &mut MintCap,
        amount: u64,
        mut existing: Coin<TEST_ETH>,
        ctx: &mut TxContext,
    ) {
        assert!(amount <= MAX_MINT, E_EXCEEDS_MAX);
        let extra = coin::mint(&mut mint_cap.cap, amount, ctx);
        coin::join(&mut existing, extra);
        transfer::public_transfer(existing, ctx.sender());
    }
}
