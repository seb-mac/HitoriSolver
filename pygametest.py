import pygame
import math as m

pygame.init()


__DEBUGGING__ = True

TILE_SIZE = 128
MAP_SIZE = 5
TILE_BORDER = 2

# Tile color states
TILE_WHITE = 0
TILE_BLACK = 1
TILE_GRAY = 2
TILE_RED = 3

SCREEN_SIZE = TILE_SIZE * MAP_SIZE


TILE_IMAGES = {
    0: pygame.surface.Surface((TILE_SIZE, TILE_SIZE)),
    1: pygame.surface.Surface((TILE_SIZE, TILE_SIZE)),
    2: pygame.surface.Surface((TILE_SIZE, TILE_SIZE)),
    3: pygame.surface.Surface((TILE_SIZE, TILE_SIZE)),
}

screen = pygame.display.set_mode((SCREEN_SIZE, SCREEN_SIZE), pygame.DOUBLEBUF, 32)
clock = pygame.time.Clock()
running = True
font = pygame.font.Font(None, 100)

tile_colours = [
    [2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2]
]

tile_numbers = [
    [5,5,1,3,1],
    [1,2,5,4,4],
    [3,3,4,4,5],
    [5,4,3,2,4],
    [3,4,1,3,2]
]

tile_conflicts = [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
]

def get_click_pos(pos):
    x = m.floor(pos[0]/(TILE_SIZE+TILE_BORDER))
    y = m.floor(pos[1]/(TILE_SIZE+TILE_BORDER))
    print(f"Num: {get_tile_num((x,y))}")
    return (x,y)

def get_tile_colour(pos: tuple):
    """Return tile colour using (x, y) coordinates."""
    x, y = pos
    return tile_colours[y][x]


def get_tile_num(pos: tuple):
    """Return tile number using (x, y) coordinates."""
    x, y = pos
    return tile_numbers[y][x]



def draw_tile_map(screen, tile_colours, tile_images):
    for y, row in enumerate(tile_colours):
        for x, tile_type in enumerate(row):
            tile_x = x * TILE_SIZE + (x * TILE_BORDER)
            tile_y = y * TILE_SIZE + (y * TILE_BORDER)

            screen.blit(tile_images[tile_type], (tile_x, tile_y)) #Draw tiles and colours
            if tile_conflicts[y][x] == 1:
                screen.blit(tile_images[3], (tile_x, tile_y))
            screen.blit(font.render(str(tile_numbers[y][x]),True, (0,0,0)), (tile_x+(TILE_SIZE/2)-20, tile_y+(TILE_SIZE/2)-20)) #Draw tile text
            if __DEBUGGING__: #Only if in debugging mode
                # Show incremental updates as tiles are drawn
                pygame.display.flip()

def cycle_tile_colour(current: int) -> int:
    """Cycle through tile colors: 2 -> 0 -> 1 -> 2"""
    if current >= TILE_GRAY:
        return TILE_WHITE
    return current + 1

def clear_conflicts():
    """Clears any conflicts"""
    #for each tile in same row or column, check if still conflicts with current pos, if not set conflict 0
    for y, row in enumerate(tile_conflicts):
        for other_x, x in enumerate(row):
            if check_tile((other_x,y)) is None:
                tile_conflicts[y][x] = 0


def check_tile(pos: tuple) -> list | None:
    """Return (x, y) of a conflicting tile in the same row, or None."""
    x, y = pos
    # Only check if the clicked tile is currently white
    if tile_colours[y][x] != TILE_WHITE:
        return None

    current_number = tile_numbers[y][x]

    # Find other tiles in the same row with the same number and white colour
    conflicting_tiles = []

    for other_x, num in enumerate(tile_numbers[y]):
        if num == current_number and other_x != x and tile_colours[y][other_x] == TILE_WHITE:
            conflicting_tiles.append((other_x, y))

    # Find other tiles in the same column with the same number and white colour
    for other_y, rows in enumerate(tile_numbers):
        if rows[x] == current_number and other_y != y and tile_colours[other_y][x] == TILE_WHITE:
            conflicting_tiles.append((x, other_y))

    print(conflicting_tiles)
    return conflicting_tiles if conflicting_tiles else None



def update_tile(pos: tuple):
    """Update tile colour at (x, y) and mark conflicts using (x, y) coords."""
    x, y = pos
    tile_colours[y][x] = cycle_tile_colour(tile_colours[y][x])

    clear_conflicts()
    conflict = check_tile(pos)
    if conflict:
        print("BAD")
        for conflicting in conflict:
            conflict_x, conflict_y = conflicting
            tile_conflicts[conflict_y][conflict_x] = 1     

while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.MOUSEBUTTONDOWN:
            print(f'mouse: {get_click_pos(pygame.mouse.get_pos())}')
            update_tile(get_click_pos(pygame.mouse.get_pos()))

    screen.fill((0,0,0))

    draw_tile_map(screen, tile_colours, TILE_IMAGES)

    pygame.display.flip()
    clock.tick(10)

pygame.quit()