# PALETTE.md

Derived mechanically from `brand/rb-lockup.png` by `scripts/extract-brand.mjs`.
Not sampled by eye. Re-run the script to regenerate.

Source: png, 2000x2000. 613,015 of 4,000,000 pixels counted as solid interior of the mark.

Pixels excluded, and why:

- 3,386,017 (84.7%) - alpha < 250
- 968 (0.0%) - edge or antialiased (a 4-neighbour differs by more than 10/255)
- 0 (0.0%) - neutral and lighter than luminance 0.9 (page ground)
- 0 (0.0%) - neutral and darker than luminance 0.02 (pure black)

Ground removal is judged on chroma first: a colour with real chroma is never
discarded as black or white, however dark or light it is. A brand navy can sit
well below any plain black threshold and still be a brand colour.

The rows below are CLUSTER CENTROIDS. Where the mark is drawn as a gradient,
each row is the average of a band rather than a colour anyone chose, so the
tokens in `src/styles/tokens.css` are sampled at the gradient ENDPOINTS instead
and will read a few units away from these. Both are measurements of the same
file; neither is an eyeball.

## Colours found

| # | Hex | OKLCH | Share of mark | Where it appears |
|---|-----|-------|---------------|------------------|
| 1 | `#163d64` | `oklch(0.3534107547602303 0.08157552991515865 251.49474378445572)` | 27.4% | centroid 45% across, 38% down; spans x 27-1965, y 241-1424 |
| 2 | `#14527e` | `oklch(0.4240986174043334 0.09492540280958577 244.887190776821)` | 18.9% | centroid 44% across, 38% down; spans x 505-1157, y 565-947 |
| 3 | `#126797` | `oklch(0.49025843467555663 0.10729978843749133 241.03156548859363)` | 14.3% | centroid 42% across, 56% down; spans x 392-1157, y 948-1304 |
| 4 | `#f8a411` | `oklch(0.7817624276294444 0.16460347985391824 71.88466361948592)` | 13.1% | centroid 75% across, 39% down; spans x 1160-1758, y 594-969 |
| 5 | `#fbc903` | `oklch(0.8561423208566983 0.17459585426665075 90.51702123041636)` | 12.1% | centroid 75% across, 59% down; spans x 1160-1760, y 970-1304 |
| 6 | `#f47e1f` | `oklch(0.7141656151162882 0.1731132300393635 52.2445723547101)` | 11.9% | centroid 75% across, 18% down; spans x 1160-1718, y 241-593 |
| 7 | `#117cb1` | `oklch(0.5559666804126014 0.11940806626981318 238.3308356484197)` | 2.3% | centroid 16% across, 76% down; spans x 221-437, y 1464-1570 |
