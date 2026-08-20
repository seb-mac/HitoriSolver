import tkinter as tk
import math
import logging

logging.basicConfig(level=logging.DEBUG)
data = [
'15','25','11','20','10','8','25','18','21','13','10','19','22','1','20','24','6','4','25','25','2','20','16','20','12','5','21','10','25','6','10','4','5','7','5','8','13','13','3','14','5','18','3','2','17','24','1','9','16','10','10','18','12','13','5','24','22','4','12','2','22','25','21','6','12','7','12','1','19','10','11','15','10','8','9','20','17','4','23','1','17','24','17','9','5','25','14','5','10','15','23','3','16','14','19','5','5','13','17','21','13','20','13','7','22','2','19','5','22','25','13','24','3','22','4','14','19','17','15','19','16','19','19','23','19','22','13','14','7','8','5','3','2','15','16','4','5','9','19','6','13','24','21','7','18','13','25','12','13','20','18','19','5','21','4','16','4','6','11','15','11','1','5','9','10','5','14','4','13','18','3','23','4','17','4','14','16','5','7','2','22','10','7','8','14','23','14','24','17','14','13','14','6','25','3','25','17','4','22','19','12','14','8','17','5','11','23','21','14','18','5','15','5','5','16','10','22','10','1','8','4','9','5','2','4','10','24','3','11','18','10','11','13','20','10','9','11','4','21','10','22','11','25','10','15','17','10','23','6','2','14','8','5','9','18','1','25','12','4','3','2','3','10','22','24','18','17','12','16','13','5','21','19','12','11','2','3','19','3','20','5','5','8','5','9','5','18','14','3','17','5','11','23','24','3','13','5','25','21','16','23','10','9','8','23','22','14','23','25','14','24','4','14','11','21','2','15','2','18','16','14','6','17','1','23','16','2','14','19','25','14','21','17','14','10','20','14','11','8','14','6','8','22','14','5','1','7','14','3','23','18','11','12','18','9','14','20','15','23','17','18','16','20','24','7','18','25','18','5','4','20','20','3','18','6','7','3','23','18','23','21','6','24','3','4','13','3','19','17','8','15','17','5','22','23','20','10','17','25','17','3','13','17','4','19','23','1','4','16','6','22','4','8','7','4','21','5','4','4','20','4','11','18','3','10','11','5','2','23','17','20','12','10','3','22','1','22','7','20','18','5','13','14','6','20','15','14','8','5','24','10','9','23','6','21','13','23','1','19','22','23','7','23','18','23','25','23','11','23','8','23','4','23','24','23','16','6','20','4','7','9','11','3','16','7','5','16','12','16','22','16','2','16','17','24','7','14','10','16','15','24','15','5','10','12','19','20','24','13','1','19','8','17','16','17','11','7','3','23','5','21','7','6','4','5','13','10','7','22','10','3','6','16','17','10','15','10','6','2','23','6','21','20','6','25','6','24','10','9','10','12','23','18','22','14','12','15','19','12','11','22','17','1','22','20','3','12','24','21','22','9','12','2','12','7','4','3','20','15','24','12','18','9','22','20','16','5','13','23','12','8','19','2','10','6','4','17','20','14','20','19','9','21','5','22','17','9','14','2','10','3','10','23','10','12','9','9','15','5','11','8','22','7','10','18',
]
"""
"1","3","1","2","3",
"2","2","1","4","3",
"2","5","1","1","3",
"1","4","2","5","1",
"4","1","1","3","3",
        """
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
# region Object
class Board:
    def __init__(self, data: list[str]):
        self.root = tk.Tk()
        self.size = int(math.sqrt(len(data)))
        self.adjustment = 15
        self.data = [int(data) for data in data]

        self.LIGHT_THEME: dict[str, list[str]] = {
            "end": ["\x1b[0m", ""],
            # Format: \x1b[38;5;<fg>;48;5;<bg>m
            "grid": ["\x1b[1;38;5;0;48;2;204;204;204m", "#1b1b1b"],  # Bold black text on grey (#CCCCCC) background (for grid)
            "selected": ["\x1b[38;5;231;48;5;0m", "#000000"],  # white text on black (selected cells)
            "cleared": ["\x1b[38;5;0;48;5;231m", "#FFFFFF"],  # black text on white (cleared cells)
            "normal": ["\x1b[38;5;231;48;2;204;204;204m", "#CCCCCC"]  # white text on dark grey (normal cells)
        }
        
        self.DARK_THEME: dict[str, list[str]] = {
            "end": ["", ""],
            # Format: \x1b[38;5;<fg>;48;5;<bg>m
            "grid": ["", "#6d6d6d"],  # Bold black text on grey (#CCCCCC) background (for grid)
            "selected": ["", "#191919"],  # white text on black (selected cells)
            "cleared": ["", "#e5e5e5"],  # black text on white (cleared cells)
            "normal": ["", "#BDBDBD"]  # white text on dark grey (normal cells) #TODO ANSI Colours
        }
        
        self.current_theme = self.LIGHT_THEME

    def apply_theme_to_widget(self, widget, theme):
        """Apply theme colors to Label, Button, or Frame."""
        wtype = type(widget)

        if wtype is tk.Label:
            widget.configure(bg=theme["bg"], fg=theme["fg"])

        elif wtype is tk.Button:
            widget.configure(
                bg=theme["bg"],
                fg=theme["fg"],
                activebackground=theme["activebackground"],
                activeforeground=theme["activeforeground"]
            )

        elif wtype is tk.Frame:
            widget.configure(bg=theme["bg"])

    def apply_theme_recursively(self, widget, theme):
        """Recursively apply theme to widget and all its children."""
        self.apply_theme_to_widget(widget, theme)
        for child in widget.winfo_children():
            self.apply_theme_recursively(child, theme)


    def toggle_theme(self):
        print("changed theme")
        logging.info(f"Updated theme to: '{self.current_theme}'")
        self.current_theme = self.DARK_THEME if self.current_theme == self.LIGHT_THEME else self.LIGHT_THEME
        self.root.update_idletasks()
    
    def print(self):
        cell_id = 0
        column_id = 0
        row_id = 0
        row = f"{self.current_theme['grid'][0]}|{self.current_theme['end'][0]}"

        print(f"{self.current_theme['grid'][0]}| {'-' * ((self.size * 4) + self.adjustment)} |{self.current_theme['end'][0]}")
        while row_id < self.size:
            while column_id < self.size:
                cell_color = (
                    self.current_theme["cleared"][0]
                    if self.isDetected(cell_id)
                    else self.current_theme["normal"][0]
                )
                row += f"{cell_color} {data[cell_id]} {self.current_theme['end'][0]}{self.current_theme['grid'][0]}|{self.current_theme['end'][0]}"

                cell_id += 1
                column_id += 1

            print(row)
            print(
                f"{self.current_theme['grid'][0]}| {'-' * ((self.size * 4) + self.adjustment)} |{self.current_theme['end'][0]}"
            )

            row = f"{self.current_theme['grid'][0]}|{self.current_theme['end'][0]}"
            row_id += 1
            column_id = 0

    def generate_ui(self):
        cell_id = 0
        column_id = 0
        row_id = 0
        self.grid_frame = tk.Frame(self.root, background=self.current_theme["grid"][1])
        self.grid_frame.grid(row=0, column=0)

        self.options_frame = tk.Frame(self.root, background=self.current_theme["grid"][1])
        self.options_frame.grid(row=1, column=0)

        while row_id < self.size:
            while column_id < self.size:
                cell_color = (
                    self.current_theme["cleared"][1]
                    if self.isDetected(cell_id)
                    else self.current_theme["normal"][1]
                )
                cell = tk.Label(self.grid_frame, 
                                width=3,
                                height=1,
                                font=("ArialMT", 13), 
                                text=data[cell_id], 
                                background=cell_color)
                cell.grid(row=row_id, column=column_id, padx=1, pady=1)

                cell_id += 1
                column_id += 1

            row_id += 1
            column_id = 0

        self.theme_button = tk.Button(self.options_frame, text="Theme", command=self.toggle_theme)
        self.theme_button.grid(row=0, column=0)
        self.root.mainloop()

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


board1 = Board(data)
board1.print()
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
