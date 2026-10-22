// Hand-drawn, smoothed and symmetrised body outlines, checked against front photos
// on 2026-10-20. No automatic pixel tracing and no changes to instrument photos.
// Source-coordinate curves are normalised to the same displayed BODY length.
// A shared pattern is deliberately reused across levels, not invented anew for each SB code.
export const modelOutlineDefinitions = {
  "rogeri": {
    "label": "Rogeri",
    "center": 118,
    "top": 182,
    "bottom": 538,
    "halfPath": "M 118 182 H 128\nC 132 193 154 201 171 213\nC 188 225 198 239 198 255\nC 198 271 194 285 190 295\nQ 189 298 194 302\nC 183 301 178 309 176 322\nC 172 345 177 368 187 376\nQ 195 382 203 378\nQ 205 380 203 384\nC 200 391 210 410 216 429\nC 225 451 227 472 219 493\nC 208 522 172 538 118 538",
    "referenceImage": "https://cscproducts.com/img/product/basses/rogeri-maple-top.jpg"
  },
  "busetto": {
    "label": "Busetto",
    "center": 118,
    "top": 221,
    "bottom": 541,
    "halfPath": "M 118 221 H 128\nC 135 236 152 244 167 259\nC 182 275 188 294 187 313\nL 185 333\nC 174 337 169 346 169 358\nC 169 371 175 382 184 388\nC 191 392 196 399 195 405\nC 195 410 199 415 204 425\nC 215 445 218 464 214 485\nC 209 522 175 541 118 541",
    "referenceImage": "https://cscproducts.com/img/product/basses/busetto-top.jpg"
  },
  "mirecourt": {
    "label": "Mirecourt",
    "center": 118,
    "top": 213,
    "bottom": 540,
    "halfPath": "M118 213 H128 C134 236 156 248 174 268 C190 285 195 304 190 325 C178 325 172 335 171 350 C169 369 175 385 183 390 Q190 394 196 391 L199 400 C205 418 216 439 219 462 C226 513 191 540 118 540",
    "referenceImage": "https://cscproducts.com/img/product/basses/mirecourt-top.jpg"
  },
  "classic": {
    "label": "Shen Classic, violin corners",
    "center": 118,
    "top": 210,
    "bottom": 538,
    "halfPath": "M118 210 H128 C132 228 155 239 172 252 C192 267 196 286 190 307 Q186 318 190 324 C177 322 170 333 170 351 C168 370 175 387 186 391 Q193 394 199 390 L201 397 C197 406 209 425 213 446 C225 503 191 538 118 538",
    "referenceImage": "https://cscproducts.com/img/product/basses/standard-top.jpg"
  },
  "fiveEighths": {
    "label": "Shen 5/8",
    "center": 118,
    "top": 212,
    "bottom": 538,
    "halfPath": "M118 212 H128 C135 226 156 238 174 257 C191 275 199 296 193 314 L191 326 C178 326 171 338 171 354 C170 372 177 386 187 391 Q192 393 197 390 L200 398 C206 419 215 437 217 458 C223 507 190 538 118 538",
    "referenceImage": "https://cscproducts.com/img/product/basses/sb3005-8-top.jpg"
  },
  "willow": {
    "label": "Shen Willow 3/4",
    "center": 118,
    "top": 194,
    "bottom": 538,
    "halfPath": "M118 194 H129 C134 210 158 226 176 245 C193 262 198 286 194 310 C179 310 172 324 171 342 C170 361 177 377 187 382 Q194 386 201 383 C211 406 220 433 220 459 C223 511 185 538 118 538",
    "referenceImage": "https://cscproducts.com/img/product/basses/sb200willow34-top.jpg"
  },
  "gemunder": {
    "label": "Gemunder",
    "center": 118,
    "top": 204,
    "bottom": 541,
    "halfPath": "M118 204 H128 C134 222 158 234 176 250 C196 267 198 290 193 321 C179 320 172 332 172 350 C172 371 179 387 190 390 L200 390 L204 399 C214 424 221 448 220 474 C219 518 182 541 118 541",
    "referenceImage": "https://cscproducts.com/img/product/basses/gemunder-top.jpg"
  },
  "gamba": {
    "label": "Shen 3/4, gamba outline",
    "center": 118,
    "top": 212,
    "bottom": 541,
    "halfPath": "M118 212 H128 C136 229 157 240 176 261 C194 281 199 302 193 328 C180 328 173 340 172 356 C172 373 177 387 188 390 L196 391 L200 400 C210 422 217 448 216 472 C214 517 180 541 118 541",
    "referenceImage": "https://cscproducts.com/img/product/basses/sb150gamba-top.jpg"
  },
  "panormo": {
    "label": "Panormo",
    "center": 640,
    "top": 156,
    "bottom": 1700,
    "halfPath": "M640 156 H676 C689 198 741 217 799 249 C947 313 1029 385 1011 493 C1009 573 1001 642 980 681 Q974 693 994 703 L987 715 C947 693 916 723 905 766 C885 832 901 960 932 1006 C958 1045 1006 1053 1035 1033 L1040 1048 C1019 1090 1067 1178 1100 1289 C1133 1419 1116 1545 1059 1605 C975 1680 728 1700 640 1700",
    "referenceImage": "src/content/instruments/bass-0004/hero.png"
  }
} as const;

export type ModelOutlineKey = keyof typeof modelOutlineDefinitions;
