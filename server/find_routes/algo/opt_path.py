import math
from queue import PriorityQueue
from .cell import Cell
import json
import os
import sys

os_base = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(os_base,"mapdata" ,"coordinate_graph.json"), "r") as file:
    graph = json.load(file)

def find_path(start,end):
    all_cells = {}

    Cell.GRAPH = graph
    Cell.END_COORDS = graph[end]["coords"]

    # Define the start and end nodes
    start_node = start
    end_node = end

    Cell.END_COORDS = graph[end_node]["coords"]

    start_cell = Cell(start_node,None)
    end_cell = Cell(end_node,None)

    all_cells[start_node] = start_cell

    # Initialize the start node
    start_cell.g = 0
    start_cell.f = start_cell.h

    # Create thet open and closed sets
    open_set = PriorityQueue()
    closed_set = set()

    # Add the start node to the open set
    open_set.put((start_cell.f,start_cell))

    # A* algorithm loop
    while not open_set.empty():
        current_node = open_set.get()[1]

        if current_node.name in closed_set:
            continue

        # Checking neighbors
        for neighbor, distance in current_node.get_neighbors().items():
            
            tentative_g = current_node.g + distance["distance"]

            if neighbor in closed_set:
                continue
            
            # If the neighbor is not in the open set, create a new cell
            if neighbor not in all_cells:
                neighbor_cell = Cell(neighbor, current_node)
                neighbor_cell.g = tentative_g
                neighbor_cell.f = neighbor_cell.g + neighbor_cell.h
                open_set.put((neighbor_cell.f, neighbor_cell))
            # If the neighbor is in the open set, check if this path is better
            else:
                neighbor_cell = all_cells[neighbor]
                if tentative_g < neighbor_cell.g:
                    neighbor_cell.g = tentative_g
                    neighbor_cell.f = neighbor_cell.g + neighbor_cell.h
                    neighbor_cell.parent = current_node
                    all_cells[neighbor] = neighbor_cell
                    open_set.put((neighbor_cell.f, neighbor_cell))

        # Add the current node to the closed set
        closed_set.add(current_node.name)
        
        # If the current node is the end node, reconstruct the path
        if current_node.name == end_cell.name:
            path = []
            while current_node:
                # Append the current node to the path
                current_info = [current_node.name,(current_node.x, current_node.y)]
                if current_node.parent:
                    current_info.append(current_node.g - current_node.parent.g)

                path.append(current_info)
                current_node = current_node.parent
            return path[::-1]
        
    # If we reach here, it means no path was found
    return None