data = [
   '7','4','4','5','4','3','10','1','4','2','3','5','1','3','8','9','7','4','2','7','4','1','4','6','2','4','5','4','7','3','10','7','2','9','7','5','7','8','1','7','6','3','6','8','4','1','4','9','4','10','9','6','8','6','10','6','4','5','3','6','8','9','10','7','1','2','8','6','8','5','1','4','1','2','7','8','9','1','6','8','5','8','6','8','9','4','8','2','8','1','2','10','3','4','3','6','2','7','8','2',     
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
    def __init__(self, size: int, data: list[str]):
        self.size = size
        self.data = data
        self.data = [int(data) for data in self.data]

        self.colour_map = {
            "end": "\x1b[0m",
            # Format: \x1b[38;5;<fg>;48;5;<bg>m
            "grid": "\x1b[1;38;5;0;48;2;204;204;204m",  # Bold black text on grey (#CCCCCC) background (for grid)
            "selected": "\x1b[38;5;231;48;5;0m",  # white text on black (selected cells)
            "cleared": "\x1b[38;5;0;48;5;231m",  # black text on white (cleared cells)
            "normal": "\x1b[38;5;231;48;2;204;204;204m",  # white text on dark grey (normal cells)
        }

    def show(self):
        cell_id = 0
        column_id = 0
        row_id = 0
        row = f"{self.colour_map['grid']}|{self.colour_map['end']}"

        print(f"{self.colour_map['grid']}| {'-' * 17} |{self.colour_map['end']}")
        while row_id < self.size:
            while column_id < self.size:
                cell_color = (
                    self.colour_map["cleared"]
                    if self.isDetected(cell_id)
                    else self.colour_map["normal"]
                )
                row += f"{cell_color} {data[cell_id]} {self.colour_map['end']}{self.colour_map['grid']}|{self.colour_map['end']}"

                cell_id += 1
                column_id += 1

            print(row)
            print(
                f"{self.colour_map['grid']}| {'-' * ((self.size * 4) - 1)} |{self.colour_map['end']}"
            )

            row = f"{self.colour_map['grid']}|{self.colour_map['end']}"
            row_id += 1
            column_id = 0

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


# board1 = Board(10, data)
# board1.show()

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


show()
#endregion
