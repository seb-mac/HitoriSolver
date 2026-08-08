"""
Convert a Hitori board screenshot into a flat list of digit strings,
e.g. ['1','1','2','5','2', ...] in row-major order.

Approach:
1. Threshold the image to isolate the grid's black border/lines.
2. Use OpenCV to find the outer board contour, then split it evenly
   into an N x N grid (Hitori boards are always square).
3. For each cell, crop out a center region (avoiding the black grid
   lines), upscale it, and OCR the single digit with Tesseract
   restricted to digit characters.
4. Return the results as a flat list, row by row, left to right.

Requirements: opencv-python, pytesseract, and the `tesseract` binary
installed on the system (apt install tesseract-ocr).
"""

import cv2
import numpy as np
import pytesseract


def board_image_to_array(image_path: str, grid_size: int | None = None, debug: bool = False):
    img = cv2.imread(image_path)
    if img is None:
        raise FileNotFoundError(f"Could not read image: {image_path}")

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Threshold so the black border/grid lines become white on black bg,
    # which makes contour detection reliable regardless of cell fill color.
    _, thresh = cv2.threshold(gray, 100, 255, cv2.THRESH_BINARY_INV)

    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        raise ValueError("No contours found - could not locate the board outline.")

    # The board itself is the largest contour (the thick outer border).
    board_contour = max(contours, key=cv2.contourArea)
    x, y, w, h = cv2.boundingRect(board_contour)

    board = gray[y:y + h, x:x + w]

    # Auto-detect grid size (e.g. 5 for a 5x5 board) by counting
    # horizontal line crossings if not explicitly provided.
    if grid_size is None:
        grid_size = _detect_grid_size(board)

    cell_h = h / grid_size
    cell_w = w / grid_size

    results = []
    # psm 10 (treat image as a single character) fails on some digit shapes
    # (e.g. "4") in this font, so try a couple of page-segmentation modes
    # in order until one returns a digit.
    psm_modes = [8, 6, 13]

    for row in range(grid_size):
        for col in range(grid_size):
            cy1 = int(row * cell_h)
            cy2 = int((row + 1) * cell_h)
            cx1 = int(col * cell_w)
            cx2 = int((col + 1) * cell_w)

            cell = board[cy1:cy2, cx1:cx2]

            # Shrink inward by a margin to avoid capturing grid line pixels.
            mh, mw = cell.shape
            margin_y = int(mh * 0.18)
            margin_x = int(mw * 0.18)
            cell_crop = cell[margin_y:mh - margin_y, margin_x:mw - margin_x]

            # Binarize + upscale for better OCR accuracy on small digits.
            _, cell_bin = cv2.threshold(cell_crop, 0, 255,
                                         cv2.THRESH_BINARY + cv2.THRESH_OTSU)
            cell_bin = cv2.resize(cell_bin, None, fx=4, fy=4,
                                   interpolation=cv2.INTER_CUBIC)

            digit = ''
            for psm in psm_modes:
                cfg = f'--oem 3 --psm {psm} -c tessedit_char_whitelist=0123456789'
                text = pytesseract.image_to_string(cell_bin, config=cfg).strip()
                digit = ''.join(ch for ch in text if ch.isdigit())
                if digit:
                    break

            if debug:
                cv2.imwrite(f'/home/claude/debug_r{row}_c{col}.png', cell_bin)

            if not digit:
                raise ValueError(
                    f"Could not read a digit at row {row}, col {col}. "
                    f"Raw OCR output was: {text!r}. Try debug=True to inspect " # type: ignore
                    f"the cropped cell images."
                )

            results.append(digit)

    return results


def _detect_grid_size(board_gray, max_size: int = 12) -> int:
    """Guess N for an N x N board by testing which grid size gives the
    strongest average edge signal along candidate row/column lines."""
    h, _w = board_gray.shape
    best_n, best_score = 0, -1
    for n in range(3, max_size + 1):
        score: int | float = 0
        for i in range(1, n):
            y: int = int(h * i / n)
            row_slice = board_gray[max(0, y - 1):y + 2, :]
            score += 255 - np.mean(row_slice)  # darker line = higher score
        score /= (n - 1)
        if score > best_score:
            best_score, best_n = score, n
    return best_n


if __name__ == "__main__":
    arr = board_image_to_array('image.png', debug=True)
    print(arr)
    print(len(arr))