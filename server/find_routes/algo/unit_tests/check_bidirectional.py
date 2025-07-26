import json

with open("/Users/mawer/busRoutes/csulbroutes/find_routes/algo/mapdata/coordinate_graph.json", "r") as file:
    graph = json.load(file)

for node in graph:
    if node.startswith("_"):
        continue
    for neighbor in graph[node]["neighbors"]:
        if node not in graph[neighbor]["neighbors"]:
            print("node :", node, "neighbor:", neighbor)