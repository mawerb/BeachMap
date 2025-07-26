import math

class Cell:
    GRAPH = None
    END_COORDS = None

    def __init__(self, name, parent : object):
        
        self._name = name

        self._parent = parent
        self._neighbors = self.get_neighbors()

        self._x = self.GRAPH[name]["coords"][0]
        self._y = self.GRAPH[name]["coords"][1]

        self._f = float('inf')
        self._g = float('inf')
        self._h = self.calculate_h(Cell.END_COORDS)

    @property
    def name(self):
        return self._name
    
    @property
    def parent(self):
        return self._parent
    
    @parent.setter
    def parent(self, value):
        self._parent = value
    
    @property
    def neighbors(self):
        return self._neighbors

    @property
    def x(self):
        return self._x
    
    @property
    def y(self):
        return self._y
    
    @property
    def f(self):
        return self._f
    
    @f.setter
    def f(self, value):
        self._f = value
    
    @property
    def g(self):
        return self._g
    
    @g.setter
    def g(self, value):
        self._g = value

    @property
    def h(self):
        return self._h

    def calculate_h(self, destination_coords):
        delta_lat = destination_coords[0] - self.x
        delta_lon = destination_coords[1] - self.y
        avg_lat = (destination_coords[0] + self.x) / 2

        miles_per_lat = 69.0
        miles_per_lon = 69.0 * math.cos(math.radians(avg_lat))
        # Using Euclidean distance for heuristic calculation  
        return math.sqrt((miles_per_lat * delta_lat) ** 2 + (miles_per_lon * delta_lon) ** 2)
    
    def get_neighbors(self):
        return self.GRAPH[self.name]['neighbors']

    def get_coords(self):
        return (self.x, self.y)
        
    def __lt__(self, other):
        return self.f < other.f