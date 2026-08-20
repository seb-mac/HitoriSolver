import tkinter as tk
import math
import logging

#region Logger
class ColoredFormatter(logging.Formatter):
    """Picks an ANSI colour for the level name based on the log level."""
    LEVEL_COLORS = {
        logging.DEBUG:    "\033[0;32m",  # green
        logging.INFO:     "\033[0;36m",  # cyan
        logging.WARNING:  "\033[0;33m",  # orange/yellow
        logging.ERROR:    "\033[0;31m",  # red
        logging.CRITICAL: "\033[1;31m",  # bold red
    }
    RESET = "\033[0m"

    def format(self, record: logging.LogRecord):
        color = self.LEVEL_COLORS.get(record.levelno, "")
        original = record.levelname
        record.levelname = f"{color}{original}{self.RESET}"
        try:
            return super().format(record)
        finally:
            record.levelname = original  # don't leak the colour into other handlers


_handler = logging.StreamHandler()
_handler.setFormatter(ColoredFormatter("%(levelname)s: %(message)s"))
logging.basicConfig(
    level=logging.INFO,
    handlers=[_handler],
)
#endregion

data = [
'1','1','2','5','2','3','4','2','1','4','2','3','1','4','1','3','2','1','3','4','1','5','4','5','3',
]
"""
const ReturnedNodeList = document.getElementsByClassName("hitori-cell-back")[0].childNodes;
let result = "";

console.log(ReturnedNodeList);

for (let i = 1; i < ReturnedNodeList.length; i++) {
let item = ReturnedNodeList[i];
let Number = item.children[0].innerHTML;
console.log(Number);
result += "'" + Number + "'" + ",";
};
console.log(result);
"""

UNASSIGNED = 0
WHITE = 1
BLACK = 2

# region Object
class Board:
    def __init__(self, data: list[str]):
        self.root = tk.Tk()
        self.size = int(math.sqrt(len(data)))
        self.adjustment: int = 15
        self.data: list[int] = [int(data) for data in data]
        self.states: list[int] = [0 for _ in data]
        self.states = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        self.cell_labels: list[tk.Label] = []
        self.other_widgets: list[tk.Widget] = []

        self.LIGHT_THEME: dict[str | int, list[str]] = {
            "grid": ["#1b1b1b"],  # Grid
            "background": ["#f7fafc"],  # Background
            0: ["#000000", "#CCCCCC"],  # Unassigned cells
            1: ["#000000", "#FFFFFF"],  # White cells
            2: ["#999999", "#000000"],  # Black cells
        }
        
        self.DARK_THEME: dict[str | int, list[str]] = {
            "grid": ["#191919"],  # Grid
            "background": ["#1c1e20"],  # Background
            # [ Font, Background]
            0: ["#191919", "#bdbdbd"],  # Unassigned cells
            1: ["#191919", "#e5e5e5"],  # White cells
            2: ["#949494", "#191919"],  # Black cells
        }

        self.current_theme: dict[str | int, list[str]] = self.LIGHT_THEME

    def get_index(self, row: int, col: int):
        """
        Function: get_index
        
        Description: Returns the list index of a cell at row 'row' and column 'col'
        
        Author: Seb Machac
        
        Input: row (int), col (int)
        
        Output: index (int)
        """
        return row * self.size + col

    def get_coords(self, index: int) -> tuple[int, int]:
        """
        Function: get_coords
        
        Description: Returns the coords (tuple[int, int]) as (row, col??)
        
        Author: Seb Machac
        
        Input: index (int)
        
        Output: coords (tuple[int, int])
        """
        return divmod(index, self.size)

    def get_neighbors(self, index: int) -> list[int]:
        """
        Function: get_neighbors
        
        Description: Returns the valid indices of touching neighbors (up, down, left, right)
        
        Author: Seb Machac
        
        Input: index (int)
        
        Output: neighbors (list[int])
        """
        row, col = divmod(index, self.size)
        neighbors = []

        for dr, dc in [(-1, 0), #Up
                       (1,0), #Down
                       (0,-1), #Left
                       (0,1)]: #Right
            r, c = row + dr, col + dc
            if 0 <= r < self.size and 0 <= c < self.size:
                neighbors.append(r * self.size + c)
        return neighbors

    def next_iter(self): #TODO
        logging.debug("Next Iteration Called")
        logging.info(f'Blacks: {self.get_neighbors(8)}\n')
        for neighbor in self.get_neighbors(9):
            self.states[neighbor] = BLACK
        self.refresh_board()

    def generate_ui(self):
        self.other_widgets = []
        self.labels = []
        cell_id = 0
        column_id = 0
        row_id = 0
        self.grid_frame = tk.Frame(self.root, background=self.current_theme["grid"][0])
        self.grid_frame.grid(row=0, column=0)

        while row_id < self.size:
            while column_id < self.size:
                state = self.states[cell_id]
                colours = self.current_theme[state]

                cell = tk.Label(self.grid_frame, 
                                width=3,
                                height=1,
                                font=("ArialMT", 13), 
                                text=str(data[cell_id]), 
                                bg=colours[1],
                                fg=colours[0])
                
                cell.grid(row=row_id, column=column_id, padx=1, pady=1)
                self.cell_labels.append(cell)

                cell_id += 1
                column_id += 1

            row_id += 1
            column_id = 0

        self.controls_frame = tk.Frame(self.root, background=self.current_theme["background"][0])
        self.controls_frame.grid(row=1, column=0)

        self.theme_button = tk.Button(self.controls_frame,
                                     command=self.switch_theme,
                                     text="Theme",)
        self.theme_button.grid(row=0, column=0)

        self.next_button = tk.Button(self.controls_frame,
                                     command=self.next_iter,
                                     text="Next")
        self.next_button.grid(row=0, column=1)

        self.other_widgets += [self.grid_frame, self.controls_frame, self.next_button, self.theme_button, self.root]
        self.root.mainloop()

    def refresh_board(self):
        for widget in self.other_widgets:
            logging.info(self.current_theme["background"][0])
            print(type(widget))
            if isinstance(widget, (tk.Frame, tk.Button)):
                print(widget)
                widget.config(
                    bg=self.current_theme["background"][0]
                )

        for idx, label in enumerate(self.cell_labels):
            state = self.states[idx]
            colours = self.current_theme[state]
            label.config(
                bg=colours[1],
                fg=colours[0],
                text=str(self.data[idx]),
            )

    def switch_theme(self):
        self.current_theme = self.DARK_THEME if self.current_theme == self.LIGHT_THEME else self.LIGHT_THEME
        self.refresh_board()
    
    def isDetected(self, cell: int) -> bool:

        if (
            ((self.size - 1) < cell < ((self.size**2) - self.size))  # Trim vertically
            and (
                # Check Vertically
                self.data[cell - self.size] == self.data[cell + self.size]
            )
        ):
            return True
        return bool(
            # Trim left
            cell % self.size != 0
            # Trim right
            and cell % self.size != (self.size - 1)
            # Check horizontally
            and self.data[cell - 1] == self.data[cell + 1]
        )

    def has_adjacent_blacks(self) -> bool:
        """
        Function: has_adjacent_blacks
        
        Description: Returns true if any two black cells touch
        
        Author: Seb Machac
        
        Input: state_array (list[int])
        
        Output: is_valid (bool)
        """
        for i in range(len(self.states)):
            if self.states[i] == BLACK:
                for neighbor in self.get_neighbors(i):
                    if self.states[neighbor] == BLACK:
                        return True
        return False

    def has_duplicate_whites(self) -> bool:
        """
        Function: has_duplicate_whites
        
        Description: Returns true if any row or col has identical whites
        
        Author: Seb Machac
        
        Output: is_valid (bool)
        """
        #Check rows
        for r in range(self.size):
            seen_in_row = set()
            for c in range(self.size):
                idx = self.get_index(r, c)
                if self.states[idx] == WHITE:
                    val = self.data[idx]
                    if val in seen_in_row:
                        return True
                    seen_in_row.add(val)

        #Check columns
        for c in range(self.size):
            seen_in_col = set()
            for r in range(self.size):
                idx = self.get_index(r, c)
                if self.states[idx] == WHITE:
                    val = self.data[idx]
                    if val in seen_in_col:
                        return True
                    seen_in_col.add(val)
        return False
    
board1 = Board(data)
board1.generate_ui()

#endregion

# region Functions

import math

data = [int(data) for data in data]
size = int(math.sqrt(len(data)))


colour_map = {
        "end": "\x1b[0m",
        # Format: \x1b[38;5;<fg>;48;5;<bg>m
        "grid": "\x1b[1;38;5;0;48;2;204;204;204m",  # Bold black text on grey (#CCCCCC) background (for grid)
        "selected": "\x1b[38;5;231;48;5;0m",  # white text on black (selected cells)
        "cleared": "\x1b[38;5;0;48;5;231m",  # black text on white (cleared cells)
        "normal": "\x1b[38;5;231;48;2;204;204;204m",  # white text on dark grey (normal cells)
    }

def isDetected(cell: int) -> bool:

    if (
        ((size - 1) < cell < ((size**2) - size))  # Trim vertically
        and (
            # Check Vertically
            data[cell - size] == data[cell + size]
        )
    ):
        return True
    
    return bool(
        # Trim left
        cell % size != 0
        # Trim right
        and cell % size != (size - 1)
        # Check horizontally
        and data[cell - 1] == data[cell + 1])

def show():
    cell_id = 0
    column_id = 0
    row_id = 0
    row = f"{colour_map['grid']}|{colour_map['end']}"

    print(f"{colour_map['grid']}| {'-' * 17} |{colour_map['end']}")
    while row_id < size:
        while column_id < size:
            cell_color = (
                colour_map["cleared"]
                if isDetected(cell_id)
                else colour_map["normal"]
            )
            row += f"{cell_color} {data[cell_id]} {colour_map['end']}{colour_map['grid']}|{colour_map['end']}"

            cell_id += 1
            column_id += 1

        print(row)
        print(
            f"{colour_map['grid']}| {'-' * ((size * 4) - 1)} |{colour_map['end']}"
        )

        row = f"{colour_map['grid']}|{colour_map['end']}"
        row_id += 1
        column_id = 0


# show()
#endregion
