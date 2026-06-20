/// Testnet-only mock SUI-price coin for Sentinel UI testing.
/// Anyone can mint up to 100 tSUI per call via a shared MintCap.
#[allow(deprecated_usage, lint(public_entry))]
module test_sui::test_sui {
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::url;

    public struct TEST_SUI has drop {}

    /// Shared treasury so anyone can mint without owning the cap.
    public struct MintCap has key {
        id: UID,
        cap: TreasuryCap<TEST_SUI>,
    }

    /// 100 SUI (9 decimals)
    const MAX_MINT: u64 = 100_000_000_000;
    const E_EXCEEDS_MAX: u64 = 0;

    fun init(witness: TEST_SUI, ctx: &mut TxContext) {
        let (cap, metadata) = coin::create_currency(
            witness,
            9,
            b"tSUI",
            b"Test SUI",
            b"Testnet mock-SUI for Sentinel demos. Worthless.",
            option::some(url::new_unsafe_from_bytes(
                b"https://assets.coingecko.com/coins/images/26375/small/sui-ocean-square.png"
            )),
            ctx,
        );
        transfer::public_freeze_object(metadata);
        transfer::share_object(MintCap { id: object::new(ctx), cap });
    }

    /// Mint up to 100 tSUI to `recipient`. Free for anyone on testnet.
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
        mut existing: Coin<TEST_SUI>,
        ctx: &mut TxContext,
    ) {
        assert!(amount <= MAX_MINT, E_EXCEEDS_MAX);
        let extra = coin::mint(&mut mint_cap.cap, amount, ctx);
        coin::join(&mut existing, extra);
        transfer::public_transfer(existing, ctx.sender());
    }
}
