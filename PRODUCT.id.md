# Sentinel — Asuransi Crash Satu Jam untuk BTC

Spesifikasi produk, v1.0 (ruang lingkup hackathon)

Track: DeepBook Predict (Sui Overflow)

## 1. One-liner

> Lindungi BTC Anda untuk satu jam ke depan. Premi: $1,40. Diselesaikan on-chain dalam waktu kurang dari 60 menit.

Sentinel adalah aplikasi konsumen dengan satu tujuan. Pengguna memberi tahu kami berapa banyak BTC yang mereka pegang, kami memberikan satu premi, mereka menekan satu tombol, dan mereka mendapat satu tanda terima. Jika BTC anjlok melewati harga trigger sebelum satu jam berakhir, mereka dibayar otomatis. Di balik layar, ini persis satu `predict::mint` dengan harga yang tepat dari binary DOWN deep out-of-the-money di DeepBook Predict, ditambah perhitungan premi yang transparan dari permukaan volatilitas SVI yang live.

## 2. Mengapa produk ini

- **Reframing, bukan penemuan.** Binary downside deep-OTM *adalah* asuransi crash parametric. Tidak ada yang di luar meja opsi memikirkannya seperti itu. Kami menjual framing asuransi: premi, coverage, trigger, payout, tanda terima.
- **Primitif yang hanya Predict yang memungkinkan.** Ini membutuhkan (a) strike apa pun yang dihargai terhadap permukaan vol live, bukan event yang dicantumkan manual, (b) expiry rolling sub-jam, dan (c) vault (PLP) yang selalu mengambil sisi lain. Polymarket/Kalshi tidak bisa melakukan ketiganya.
- **Ramah demo.** Cerita pengguna lengkap — beli polis, pantau satu jam, dibayar (atau tidak) — selesai dalam satu slot demo.

## 3. Pengguna target

Seseorang yang memegang BTC, bukan trader opsi, dan merasakan risiko event (FOMC minutes, rilis CPI, likuidasi berantai di Jumat malam). Mereka tidak akan pernah membuka strike ladder. Mereka akan menekan tombol yang bertuliskan "Lindungi Bitcoin saya untuk satu jam ke depan — $1,40".

## 4. Definisi produk

### 4.1 Polis

Polis Sentinel adalah kontrak asuransi parametric dengan payout tetap:

| Istilah | Definisi |
|---|---|
| Underlying | BTC/USD, diselesaikan oleh oracle BTC Predict |
| Jendela coverage | Dari pembelian hingga expiry oracle sub-jam yang dipilih (≈ 30–60 menit) |
| Trigger | Harga strike `K` di bawah spot saat ini (default: 2% di bawah, disesuaikan ke grid strike oracle) |
| Payout | Jumlah tetap `P` dalam dUSDC, dibayar jika BTC diselesaikan **di atau di bawah** `K` saat expiry |
| Premi | Biaya ask on-chain untuk mint `P` kontrak binary DOWN pada strike `K` |

Ini adalah asuransi parametric, dan UI harus menyatakannya dengan jelas: payout all-or-nothing saat settlement. BTC di `K − $1` saat expiry membayar jumlah penuh; BTC di `K + $1` membayar nol; crash yang pulih sepenuhnya sebelum print settlement membayar nol.

### 4.2 Penentuan ukuran coverage — satu input

Pengguna memasukkan kepemilikan BTC mereka `B`. Kami menentukan ukuran payout untuk menutupi kerugian mark-to-market hingga trigger:

```
P = B × (S − K)
```

di mana `S` adalah spot saat ini dan `K` adalah strike trigger. Jika BTC anjlok tepat ke trigger, payout sama dengan kerugian kertas pengguna. Crash yang lebih dalam kurang tercover relatif terhadap kerugian — ini diungkapkan, bukan disembunyikan (lihat §7). Kontrak Predict adalah unit payout $1 dalam dUSDC (6 desimal, `1_000_000 = 1 kontrak = $1`), jadi kuantitas yang di-mint hanyalah `P` yang diekspresikan dalam unit dUSDC.

Contoh pada spot $100.000, trigger 2% di bawah ($98.000 disesuaikan ke grid):

| BTC dipegang | Coverage (payout) | Harga down wajar (SVI) | Premi ditampilkan |
|---|---|---|---|
| 0,05 BTC | $100 | ~1,0¢ | ~$1,40 |
| 0,5 BTC | $1.000 | ~1,0¢ | ~$14 |
| 2 BTC | $4.000 | ~1,0¢ | ~$56 |

(Tarif efektif ~1,4¢ = harga wajar + spread, dengan floor seperti dijelaskan di §4.4.)

### 4.3 Pemilihan strike dan expiry (otomatis)

Pengguna tidak pernah melihat strike ladder. Aplikasi memilih:

- **Oracle/expiry:** `OracleSVI` BTC aktif dengan expiry terdekat yang **≥ 15 menit ke depan** (agar polis punya coverage bermakna dan quote tidak settle di bawah kita). Jika oracle depan expire lebih cepat, roll ke yang berikutnya. Oracle berasal dari `GET /predicts/:predict_id/oracles`.
- **Strike:** `K = floor_to_tick(S × 0,98)` pada grid strike oracle tersebut (`min_strike + n × tick_size`). Satu trigger default di v1; selector 3 opsi "lebih banyak coverage / lebih murah" (−1,5% / −2% / −3%) adalah stretch goal, bukan MVP.

Guard: jika ask post-spread untuk binary DOWN pada `K` akan melebihi 10¢ per kontrak (yaitu pasar panik dan ini bukan lagi "deep OTM"), aplikasi melebarkan trigger satu tick demi tick hingga ask ≤ 10¢, dan menampilkan trigger yang disesuaikan. Kami tidak pernah diam-diam menjual asuransi mahal sebagai asuransi murah.

### 4.4 Perhitungan premi yang transparan

Premi **bukan** dibuat-buat oleh kami. Ini adalah ask protokol sendiri, di-preview via `predict::get_trade_amounts` (devInspect) sebelum pembelian, dan nilai on-chain saat mint bersifat otoritatif. Aplikasi memecahnya untuk pengguna:

```
ask = fair_price(SVI) + spread
premium = ask × quantity
```

- `fair_price` adalah probabilitas tersirat SVI bahwa BTC settle di bawah `K`, dievaluasi dari parameter `OracleSVIUpdated` terbaru (juga dilayani di `GET /oracles/:oracle_id/svi/latest`).
- `spread = max(min_spread, base_spread × √(p(1−p)) × utilization_term)` — default: base 2%, floor 0,5%, melebar dengan utilisasi vault.
- **Floor protokol:** Predict menolak mint dengan ask di bawah `min_ask_price = 1¢` per kontrak (`default_min_ask_price = 10_000_000` pada skala 1e9). Binary deep-OTM karenanya biayanya **minimal 1% dari coverage per polis**, meskipun nilai wajar SVI lebih rendah. Layar breakdown premi menampilkan floor ini secara eksplisit saat mengikat: "Nilai wajar: 0,3¢ · Minimum yang protokol jual: 1¢."

Tanda terima menampilkan: nilai wajar, spread, tarif efektif (premi ÷ coverage), dan biaya setara tahunan, sehingga pengguna (atau juri) yang skeptis dapat mengaudit angkanya. Ini adalah pilar "perhitungan premi transparan dari permukaan SVI" — kami menunjukkan perhitungan kami alih-alih mengutip angka black-box.

### 4.5 Proteksi slippage

`predict::mint` mengutip terhadap state vault post-trade, jadi ask yang dieksekusi bisa berbeda dari preview. PTB pembelian melakukan pengecekan ulang: jika biaya eksekusi akan melebihi premi yang ditampilkan lebih dari 5%, klien abort sebelum signing (preview dijalankan ulang segera sebelum sign). Premi yang dikutip di layar memiliki timer freshness 15 detik dan auto-refresh.

## 5. Pengalaman pengguna

### 5.1 Layar (ada tiga)

**Layar 1 — Quote (seluruh homepage)**

- Satu input: "Berapa banyak BTC yang Anda pegang?" (numerik, dengan helper deteksi saldo jika wallet terhubung)
- Baris live: "Jika BTC turun di bawah **$98.000** sebelum **14:30 UTC**, Anda mendapat **$1.000**."
- Satu tombol: **Lindungi Bitcoin saya — $14,20**
- Expander kecil "Bagaimana ini dihargai?" → breakdown premi dari §4.4.

**Layar 2 — Tanda terima**

Ditampilkan segera setelah transaksi mint terkonfirmasi:

- ID polis (digest tx mint), coverage, trigger, countdown expiry, premi dibayar
- Baris harga BTC live dengan trigger digambar di atasnya (data: `GET /oracles/:oracle_id/prices` + event stream)
- Chip status: `ACTIVE` → `EXPIRED — NO CLAIM` atau `PAID — $1.000`
- "Bagikan tanda terima" (export gambar — artefak viral)

**Layar 3 — Riwayat**

Daftar polis sebelumnya untuk wallet yang terhubung (dari `GET /managers/:manager_id/positions/summary` dan `GET /positions/minted?` difilter berdasarkan manager). Setiap baris: tanggal, coverage, premi, hasil.

### 5.2 Alur penggunaan pertama (plumbing tersembunyi)

1. Hubungkan wallet Sui (`@mysten/dapp-kit`).
2. Jika wallet tidak punya `PredictManager`, PTB pembelian menambahkan `predict::create_manager` di awal.
3. Jika saldo dUSDC manager < premi, PTB menambahkan `predict_manager::deposit` dari koin dUSDC wallet. Di testnet, aplikasi menampilkan link form request DUSDC saat wallet tidak memegangnya.
4. Mint. Satu signature total — pembuatan manager, deposit, dan mint digabung dalam satu PTB.

### 5.3 Alur payout (tanpa aksi pengguna)

Layanan keeper memantau event `OracleSettled`. Untuk setiap polis Sentinel yang oracle-nya settle di atau di bawah trigger, keeper memanggil `predict::redeem_permissionless<DUSDC>` — payout masuk ke `PredictManager` pengguna, lalu aplikasi menampilkan "Tarik $1.000 ke wallet" satu tap di layar tanda terima (withdrawal manager hanya owner, jadi langkah terakhir butuh signature pengguna). Polis yang expire out-of-the-money berubah ke `EXPIRED — NO CLAIM` tanpa transaksi diperlukan.

Opsional (stretch): "Batalkan polis" sebelum expiry via `predict::redeem`, mengembalikan nilai bid saat ini sebagai refund sebagian.

## 6. Integrasi protokol

### 6.1 Target (Sui testnet, branch `predict-testnet-4-16`)

| Hal | Nilai |
|---|---|
| Paket Predict | `0xf5ea2b3749c65d6e56507cc35388719aadb28f9cab873696a2f8687f5c785138` |
| Objek Predict | `0xc8736204d12f0a7277c86388a68bf8a194b0a14c5538ad13f22cbd8e2a38028a` |
| Aset quote | `e95040085976bfd54a1a07225cd46c8a2b4e8e2b6732f140a0fc49850ba73e1a::dusdc::DUSDC` |
| Indexer | `https://predict-server.testnet.mystenlabs.com` |

### 6.2 Panggilan on-chain yang digunakan

| Panggilan | Kapan |
|---|---|
| `predict::create_manager` | Hanya pembelian pertama |
| `predict_manager::deposit<DUSDC>` | Saat saldo manager < premi |
| `market_key::down(oracle_id, expiry, strike)` | Membangun kunci posisi |
| `predict::get_trade_amounts` (devInspect) | Preview premi + pengecekan ulang pre-sign |
| `predict::mint<DUSDC>` | Pembelian |
| `predict::redeem_permissionless<DUSDC>` | Keeper mengklaim payout yang settle |
| `predict::redeem<DUSDC>` | Stretch: pembatalan awal |
| `predict_manager::withdraw<DUSDC>` | Pengguna menarik payout ke wallet |

### 6.3 Jalur baca

Sesuai pembagian yang direkomendasikan protokol:

- **predict-server** untuk semua yang bisa di-render: daftar dan state oracle, SVI terbaru, riwayat harga, posisi manager, riwayat mint/redeem.
- **Sui event stream** (`OraclePricesUpdated`, `OracleSVIUpdated`, `OracleSettled`) untuk baris harga live dan flip settlement instan di layar tanda terima.
- **Pembacaan objek langsung** untuk saldo `PredictManager` dan `OracleSVI` segera sebelum membangun PTB pembelian.

### 6.4 Arsitektur

```
┌────────────────────────┐
│  Next.js PWA           │  quote · tanda terima · riwayat
│  @mysten/dapp-kit      │  wallet, signing PTB
│  @mysten/codegen       │  binding Predict bertipe
└──────┬─────────┬───────┘
       │         │
       │         └────────────► predict-server (REST)   data render
       │
       ▼
   Sui testnet  ◄──────────────  Keeper (layanan Node)
   predict::mint                 memantau OracleSettled,
   predict::redeem_permissionless memicu klaim payout
```

Keeper adalah satu proses Node kecil: subscribe ke `OracleSettled` untuk paket Predict, cari posisi Sentinel terbuka pada oracle tersebut dari `/positions/minted` dikurangi `/positions/redeemed`, submit `redeem_permissionless` dalam satu PTB per manager. Stateless; aman untuk restart.

## 7. Pengungkapan (ditampilkan di produk, tidak disembunyikan)

1. **Parametric, bukan indemnity.** Payout tetap dan all-or-nothing pada print settlement. Crash lebih dalam dari trigger membayar jumlah tetap yang sama; crash yang pulih sebelum settlement expiry tidak membayar apa pun.
2. **Jendela coverage adalah expiry oracle,** bukan literal 60 menit dari pembelian. Waktu expiry pasti ada di quote dan tanda terima.
3. **Counterparty adalah vault PLP.** Payout bergantung pada solvabilitas vault; protokol membatasi total exposure maksimal 80% dari modal vault, dan mint bisa ditolak saat vault penuh kapasitas.
4. **Premi minimum 1% dari coverage** karena floor ask protokol, meskipun nilai wajar lebih rendah.
5. **Bukan asuransi teregulasi.** Ini posisi opsi on-chain yang disajikan dengan framing asuransi.

## 8. Mode kegagalan dan penanganan

| Kondisi | Perilaku |
|---|---|
| Oracle stale (> 30 detik tanpa update harga) | Quote dinonaktifkan, "Harga sementara tidak tersedia" |
| Trading dijeda (`ETradingPaused`) | Sama seperti di atas, dengan alasan |
| Ask di luar batas (`EAskPriceOutOfBounds`) | Quote ulang; jika floor-clamped, tampilkan pengungkapan floor |
| Cap exposure vault tercapai | "Coverage habis untuk jam ini — jendela berikutnya pukul HH:MM" |
| Biaya eksekusi > preview + 5% | Abort sebelum signing, quote ulang |
| Expiry terdekat < 15 menit | Quote terhadap oracle berikutnya |
| Lag predict-server setelah tx | Tanda terima di-render dari efek tx + pembacaan objek langsung dulu, data server backfill |
| Keeper down | Layar tanda terima menawarkan tombol manual "Klaim payout" memanggil `redeem` dari wallet owner |

## 9. Ruang lingkup

### MVP (harus berfungsi end-to-end untuk penilaian)

- BTC saja, dUSDC saja, satu trigger default (−2%), expiry valid terdekat
- Layar quote dengan premi live dan breakdown transparan
- PTB pembelian single-signature (create manager + deposit + mint)
- Layar tanda terima dengan baris harga live dan status settlement
- Keeper auto-claim via `redeem_permissionless`
- Tarik ke wallet

### Stretch (berdasarkan prioritas)

1. Selector trigger (−1,5% / −2% / −3%) dengan premi live per opsi
2. Pembatalan awal dengan refund sebagian
3. Gambar tanda terima yang bisa dibagikan
4. Perpanjangan otomatis ("tetap lindungi saya jam demi jam") — mint berulang di setiap expiry baru
5. Varian deductible berbasis range (`mint_range` bear band) untuk payout proporsional

### Eksplisit di luar ruang lingkup

- Beberapa underlying, fiat on-ramp, kustodi BTC nyata (kami mengasuransi exposure harga, kami tidak pernah menyentuh BTC pengguna), fitur LP/vault, hardening deployment mainnet.

## 10. Kriteria sukses

- **Batas minimum hackathon:** mengintegrasikan kontrak Predict testnet; alur lengkap (quote → mint → settle → payout) dapat diuji end-to-end oleh juri.
- **Skrip demo (≤ 3 menit):** masukkan 0,5 BTC → lihat premi $14 dengan expander matematika terbuka → satu signature → tanda terima dengan baris trigger live → fast-forward ke oracle yang settle dari polis yang sudah dibeli sebelumnya → payout sudah diklaim keeper → tarik ke wallet.
- **Batas kualitas:** premi yang dikutip dalam 5% dari biaya eksekusi pada ≥ 95% pembelian; keeper mengklaim dalam 60 detik setelah `OracleSettled`; nol posisi settle yang terlantar selama periode demo.
