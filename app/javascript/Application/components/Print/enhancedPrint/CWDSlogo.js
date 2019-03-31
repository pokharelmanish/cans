import React from 'react'
import PropTypes from 'prop-types'
// could not use other image formate because safari print does not support
// size must use px because firefox print does not support rem for svg
const CWDSlogo = props => {
  return (
    <svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width="64px"
      height="64px"
      viewBox="0 0 1400 1400"
      preserveAspectRatio="xMidYMid meet"
    >
      <g id="layer101" fill="#f27d19" stroke="none">
        <path d="M575 1394 c-178 -47 -268 -96 -375 -204 -146 -148 -200 -279 -200 -485 0 -140 17 -213 76 -327 52 -101 192 -241 289 -290 136 -68 195 -83 340 -83 120 0 137 3 218 31 122 44 190 87 277 175 127 127 187 267 197 454 5 94 2 122 -17 195 -35 133 -91 230 -190 330 -139 141 -275 200 -475 205 -66 2 -129 1 -140 -1z" />
      </g>
      <g id="layer102" fill="#0fbcce" stroke="none">
        <path d="M575 1394 c-158 -42 -261 -94 -355 -181 -39 -36 -69 -68 -66 -70 3 -3 -6 -15 -19 -27 -34 -30 -93 -143 -115 -223 -27 -94 -28 -281 -1 -375 34 -119 86 -204 185 -304 97 -97 166 -139 301 -185 60 -21 89 -24 200 -24 120 0 137 3 218 31 122 44 190 87 277 175 127 127 187 267 197 454 5 94 2 122 -17 195 -35 133 -91 230 -190 330 -139 141 -275 200 -475 205 -66 2 -129 1 -140 -1z m25 -143 c24 -7 24 -8 -15 -26 -59 -28 -142 -86 -215 -151 -36 -32 -57 -49 -48 -39 16 17 14 21 -39 76 -55 57 -56 58 -84 43 -16 -8 -29 -12 -29 -9 0 6 94 54 144 72 45 16 183 41 231 41 17 0 41 -3 55 -7z" />
      </g>
      <g id="layer103" fill="#a3cd41" stroke="none">
        <path d="M575 1394 c-158 -42 -261 -94 -355 -181 -39 -36 -69 -68 -66 -70 3 -3 -6 -15 -19 -27 -34 -30 -93 -143 -115 -223 -27 -94 -28 -281 -1 -375 34 -119 86 -204 185 -304 97 -97 166 -139 301 -185 60 -21 89 -24 200 -24 120 0 137 3 218 31 122 44 190 87 277 175 127 127 187 267 197 454 5 94 2 122 -17 195 -35 133 -91 230 -190 330 -139 141 -275 200 -475 205 -66 2 -129 1 -140 -1z m25 -143 c24 -7 24 -8 -15 -26 -59 -28 -142 -86 -215 -151 -36 -32 -57 -49 -48 -39 16 17 14 21 -39 76 -55 57 -56 58 -84 43 -16 -8 -29 -12 -29 -9 0 6 94 54 144 72 45 16 183 41 231 41 17 0 41 -3 55 -7z m215 -170 c64 -23 140 -75 173 -120 l23 -31 -41 -61 c-48 -70 -51 -70 -100 27 -33 64 -83 118 -103 111 -6 -2 -15 -11 -21 -21 -9 -14 -6 -22 16 -39 15 -13 49 -68 78 -130 47 -102 52 -108 77 -105 22 2 38 19 76 77 54 81 62 81 73 -1 l6 -44 -71 -33 c-45 -20 -78 -30 -91 -26 -11 4 -62 31 -112 61 -51 30 -100 54 -109 54 -10 0 -46 -9 -81 -20 -66 -21 -108 -25 -108 -12 0 4 30 37 66 72 83 82 89 93 64 115 -18 17 -21 15 -78 -39 -35 -34 -65 -54 -73 -51 -8 3 -29 26 -47 50 -31 41 -33 46 -19 65 48 68 164 119 275 120 47 0 92 -7 127 -19z m-406 -237 c24 -30 40 -58 37 -62 -8 -8 -116 45 -116 57 0 18 19 61 27 61 5 0 28 -25 52 -56z m39 -125 c34 -13 27 -37 -13 -45 -45 -8 -58 -30 -39 -67 18 -34 50 -33 47 1 -3 22 0 23 55 20 43 -2 57 -7 57 -18 0 -11 -13 -16 -43 -18 -27 -2 -45 -9 -49 -19 -16 -40 80 -46 126 -7 51 43 34 98 -33 106 -51 5 -39 22 33 46 92 29 107 28 177 -14 32 -20 77 -45 99 -56 l39 -21 -57 -28 c-31 -16 -57 -32 -57 -34 0 -3 12 -23 27 -46 29 -44 50 -46 45 -6 -3 32 34 60 75 55 43 -5 43 -40 -1 -73 -42 -32 -44 -43 -15 -54 21 -7 21 -8 -8 -29 -16 -11 -52 -30 -79 -40 -146 -58 -299 -24 -412 90 -72 72 -104 142 -110 241 l-5 78 59 -26 c33 -15 69 -31 82 -36z m607 -109 c-9 -27 -18 -50 -20 -50 -2 0 -15 11 -29 25 -14 14 -32 25 -41 25 -8 0 -15 6 -15 13 0 14 113 57 118 45 2 -5 -4 -30 -13 -58z" />
      </g>
      <g id="layer104" fill="#faa917" stroke="none">
        <path d="M595 1393 c-62 -7 -158 -39 -234 -78 -66 -34 -218 -161 -206 -173 2 -3 -4 -11 -15 -19 -25 -17 -88 -130 -114 -203 -16 -45 -20 -82 -20 -205 -1 -171 7 -211 67 -330 32 -62 61 -101 131 -171 50 -50 110 -100 133 -112 l43 -22 -44 55 c-61 74 -92 129 -121 215 -14 41 -25 77 -25 82 0 4 28 -15 63 -43 74 -60 196 -121 288 -143 91 -22 237 -21 333 4 226 57 407 217 487 429 31 82 34 123 14 199 -30 115 -90 216 -185 312 -91 92 -173 143 -293 180 -63 20 -224 32 -302 23z m5 -142 c24 -7 24 -8 -15 -26 -59 -28 -142 -86 -215 -151 -36 -32 -57 -49 -48 -39 16 17 14 21 -39 76 -55 57 -56 58 -84 43 -16 -8 -29 -12 -29 -9 0 6 94 54 144 72 45 16 183 41 231 41 17 0 41 -3 55 -7z m215 -170 c64 -23 140 -75 173 -120 l23 -31 -41 -61 c-48 -70 -51 -70 -100 27 -33 64 -83 118 -103 111 -6 -2 -15 -11 -21 -21 -9 -14 -6 -22 16 -39 15 -13 49 -68 78 -130 47 -102 52 -108 77 -105 22 2 38 19 76 77 54 81 62 81 73 -1 l6 -44 -71 -33 c-45 -20 -78 -30 -91 -26 -11 4 -62 31 -112 61 -51 30 -100 54 -109 54 -10 0 -46 -9 -81 -20 -66 -21 -108 -25 -108 -12 0 4 30 37 66 72 83 82 89 93 64 115 -18 17 -21 15 -78 -39 -35 -34 -65 -54 -73 -51 -8 3 -29 26 -47 50 -31 41 -33 46 -19 65 48 68 164 119 275 120 47 0 92 -7 127 -19z m-406 -237 c24 -30 40 -58 37 -62 -8 -8 -116 45 -116 57 0 18 19 61 27 61 5 0 28 -25 52 -56z m39 -125 c34 -13 27 -37 -13 -45 -45 -8 -58 -30 -39 -67 18 -34 50 -33 47 1 -3 22 0 23 55 20 43 -2 57 -7 57 -18 0 -11 -13 -16 -43 -18 -27 -2 -45 -9 -49 -19 -16 -40 80 -46 126 -7 51 43 34 98 -33 106 -51 5 -39 22 33 46 92 29 107 28 177 -14 32 -20 77 -45 99 -56 l39 -21 -57 -28 c-31 -16 -57 -32 -57 -34 0 -3 12 -23 27 -46 29 -44 50 -46 45 -6 -3 32 34 60 75 55 43 -5 43 -40 -1 -73 -42 -32 -44 -43 -15 -54 21 -7 21 -8 -8 -29 -16 -11 -52 -30 -79 -40 -146 -58 -299 -24 -412 90 -72 72 -104 142 -110 241 l-5 78 59 -26 c33 -15 69 -31 82 -36z m607 -109 c-9 -27 -18 -50 -20 -50 -2 0 -15 11 -29 25 -14 14 -32 25 -41 25 -8 0 -15 6 -15 13 0 14 113 57 118 45 2 -5 -4 -30 -13 -58z" />
      </g>
      <g id="layer105" fill="#ffcc0a" stroke="none">
        <path d="M595 1393 c-122 -13 -275 -87 -372 -179 l-68 -64 88 41 c110 51 204 71 316 67 l86 -3 -50 -24 c-186 -91 -315 -234 -381 -423 -29 -81 -44 -274 -27 -338 18 -70 204 -188 354 -224 36 -9 107 -16 161 -16 261 0 491 134 617 360 28 52 34 73 38 143 2 45 5 99 7 120 2 20 1 37 -3 37 -3 0 -7 16 -9 37 -7 106 -180 315 -320 386 -39 21 -100 46 -135 57 -63 20 -224 32 -302 23z m220 -312 c64 -23 140 -75 173 -120 l23 -31 -41 -61 c-48 -70 -51 -70 -100 27 -33 64 -83 118 -103 111 -6 -2 -15 -11 -21 -21 -9 -14 -6 -22 16 -39 15 -13 49 -68 78 -130 47 -102 52 -108 77 -105 22 2 38 19 76 77 54 81 62 81 73 -1 l6 -44 -71 -33 c-45 -20 -78 -30 -91 -26 -11 4 -62 31 -112 61 -51 30 -100 54 -109 54 -10 0 -46 -9 -81 -20 -66 -21 -108 -25 -108 -12 0 4 30 37 66 72 83 82 89 93 64 115 -18 17 -21 15 -78 -39 -35 -34 -65 -54 -73 -51 -8 3 -29 26 -47 50 -31 41 -33 46 -19 65 48 68 164 119 275 120 47 0 92 -7 127 -19z m-406 -237 c24 -30 40 -58 37 -62 -8 -8 -116 45 -116 57 0 18 19 61 27 61 5 0 28 -25 52 -56z m39 -125 c34 -13 27 -37 -13 -45 -45 -8 -58 -30 -39 -67 18 -34 50 -33 47 1 -3 22 0 23 55 20 43 -2 57 -7 57 -18 0 -11 -13 -16 -43 -18 -27 -2 -45 -9 -49 -19 -16 -40 80 -46 126 -7 51 43 34 98 -33 106 -51 5 -39 22 33 46 92 29 107 28 177 -14 32 -20 77 -45 99 -56 l39 -21 -57 -28 c-31 -16 -57 -32 -57 -34 0 -3 12 -23 27 -46 29 -44 50 -46 45 -6 -3 32 34 60 75 55 43 -5 43 -40 -1 -73 -42 -32 -44 -43 -15 -54 21 -7 21 -8 -8 -29 -16 -11 -52 -30 -79 -40 -146 -58 -299 -24 -412 90 -72 72 -104 142 -110 241 l-5 78 59 -26 c33 -15 69 -31 82 -36z m607 -109 c-9 -27 -18 -50 -20 -50 -2 0 -15 11 -29 25 -14 14 -32 25 -41 25 -8 0 -15 6 -15 13 0 14 113 57 118 45 2 -5 -4 -30 -13 -58z" />
      </g>
      <g id="layer106" fill="#fdfefe" stroke="none">
        <path d="M579 1222 c-176 -88 -301 -229 -365 -414 -29 -81 -44 -274 -27 -338 18 -70 204 -188 354 -224 36 -9 107 -16 161 -16 200 0 384 79 519 223 l30 32 -5 105 c-9 182 -72 325 -201 456 -90 90 -176 144 -291 180 -94 30 -106 30 -175 -4z m236 -141 c64 -23 140 -75 173 -120 l23 -31 -41 -61 c-48 -70 -51 -70 -100 27 -33 64 -83 118 -103 111 -6 -2 -15 -11 -21 -21 -9 -14 -6 -22 16 -39 15 -13 49 -68 78 -130 47 -102 52 -108 77 -105 22 2 38 19 76 77 54 81 62 81 73 -1 l6 -44 -71 -33 c-45 -20 -78 -30 -91 -26 -11 4 -62 31 -112 61 -51 30 -100 54 -109 54 -10 0 -46 -9 -81 -20 -66 -21 -108 -25 -108 -12 0 4 30 37 66 72 83 82 89 93 64 115 -18 17 -21 15 -78 -39 -35 -34 -65 -54 -73 -51 -8 3 -29 26 -47 50 -31 41 -33 46 -19 65 48 68 164 119 275 120 47 0 92 -7 127 -19z m-406 -237 c24 -30 40 -58 37 -62 -8 -8 -116 45 -116 57 0 18 19 61 27 61 5 0 28 -25 52 -56z m39 -125 c34 -13 27 -37 -13 -45 -45 -8 -58 -30 -39 -67 18 -34 50 -33 47 1 -3 22 0 23 55 20 43 -2 57 -7 57 -18 0 -11 -13 -16 -43 -18 -27 -2 -45 -9 -49 -19 -16 -40 80 -46 126 -7 51 43 34 98 -33 106 -51 5 -39 22 33 46 92 29 107 28 177 -14 32 -20 77 -45 99 -56 l39 -21 -57 -28 c-31 -16 -57 -32 -57 -34 0 -3 12 -23 27 -46 29 -44 50 -46 45 -6 -3 32 34 60 75 55 43 -5 43 -40 -1 -73 -42 -32 -44 -43 -15 -54 21 -7 21 -8 -8 -29 -16 -11 -52 -30 -79 -40 -146 -58 -299 -24 -412 90 -72 72 -104 142 -110 241 l-5 78 59 -26 c33 -15 69 -31 82 -36z m607 -109 c-9 -27 -18 -50 -20 -50 -2 0 -15 11 -29 25 -14 14 -32 25 -41 25 -8 0 -15 6 -15 13 0 14 113 57 118 45 2 -5 -4 -30 -13 -58z" />
      </g>
    </svg>
  )
}

export default CWDSlogo
