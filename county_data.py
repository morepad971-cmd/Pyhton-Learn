# Liberian County Data with Climate Context and Descriptions
# Data includes coordinates, climate descriptions, and seasonal information

COUNTIES_DATA = {
    'Bomi': {
        'lat': 6.75,
        'lon': -11.23,
        'description': 'Bomi County, located in northwestern Liberia, is known for its coastal influence and dense vegetation. This region experiences a tropical climate with significant rainfall throughout the year.',
        'climate': 'Tropical, humid coastal region',
        'season': 'Rainy Season',
        'population_context': 'Sparsely populated county known for mining and fishing',
        'color_code': '#3498db'  # Blue for coastal/water influence
    },
    'Bong': {
        'lat': 7.17,
        'lon': -9.53,
        'description': 'Bong County, in central Liberia, is characterized by its forested terrain and mineral-rich landscape. The region experiences a humid tropical climate with well-distributed rainfall patterns.',
        'climate': 'Humid tropical forest climate',
        'season': 'Rainy Season',
        'population_context': 'Known for iron ore deposits and forest resources',
        'color_code': '#27ae60'  # Green for forest
    },
    'Gbarpolu': {
        'lat': 7.41,
        'lon': -9.95,
        'description': 'Gbarpolu County is located in northwestern Liberia and features a mix of forest and savanna landscapes. This region receives substantial rainfall and maintains consistent temperatures year-round.',
        'climate': 'Transitional forest-savanna climate',
        'season': 'Rainy Season',
        'population_context': 'Remote county with agricultural potential',
        'color_code': '#e67e22'  # Orange for transitional zone
    },
    'Grand Bassa': {
        'lat': 5.87,
        'lon': -9.70,
        'description': 'Grand Bassa County is a coastal region in south-central Liberia known for its beaches and maritime activities. The county experiences high humidity and consistent warm temperatures.',
        'climate': 'Maritime tropical climate',
        'season': 'Rainy Season',
        'population_context': 'Coastal county with fishing and tourism potential',
        'color_code': '#1abc9c'  # Teal for coastal areas
    },
    'Grand Cape Mount': {
        'lat': 7.30,
        'lon': -11.37,
        'description': 'Grand Cape Mount County sits on Liberia\'s northwestern coastline and is heavily influenced by Atlantic weather patterns. This region is characterized by strong ocean breezes and high precipitation.',
        'climate': 'Oceanic tropical climate',
        'season': 'Rainy Season',
        'population_context': 'Strategic coastal location with fishing industry',
        'color_code': '#2980b9'  # Deep blue for ocean
    },
    'Grand Gedeh': {
        'lat': 4.43,
        'lon': -8.44,
        'description': 'Grand Gedeh County is in southeastern Liberia and features dense rainforest ecosystems. The region experiences equatorial climate conditions with high temperatures and abundant moisture.',
        'climate': 'Equatorial rainforest climate',
        'season': 'Rainy Season',
        'population_context': 'Remote rainforest region with biodiversity',
        'color_code': '#16a085'  # Dark teal for rainforest
    },
    'Grand Kru': {
        'lat': 4.08,
        'lon': -8.15,
        'description': 'Grand Kru County occupies Liberia\'s southeastern corner and is part of the Upper Guinea rainforest. This region maintains warm temperatures year-round with consistent high rainfall.',
        'climate': 'Tropical rainforest climate',
        'season': 'Rainy Season',
        'population_context': 'Remote southeastern county with pristine forests',
        'color_code': '#1e8449'  # Forest green
    },
    'Lofa': {
        'lat': 8.41,
        'lon': -10.13,
        'description': 'Lofa County is in northeastern Liberia and experiences a subtropical highland climate due to its elevation. The region features rolling hills and receives significant rainfall.',
        'climate': 'Subtropical highland climate',
        'season': 'Rainy Season',
        'population_context': 'Elevated region with agricultural communities',
        'color_code': '#8e44ad'  # Purple for highland region
    },
    'Margibi': {
        'lat': 6.30,
        'lon': -10.18,
        'description': 'Margibi County is in coastal western Liberia and includes the major city of Kakatown. This region experiences a humid tropical climate with seasonal rainfall variations.',
        'climate': 'Humid tropical coastal climate',
        'season': 'Rainy Season',
        'population_context': 'Populated region with commercial activity',
        'color_code': '#16a085'  # Teal
    },
    'Maryland': {
        'lat': 4.69,
        'lon': -7.58,
        'description': 'Maryland County is located in southeastern Liberia near the Ivory Coast border. This region features dense vegetation and experiences tropical conditions with high moisture levels.',
        'climate': 'Tropical equatorial climate',
        'season': 'Rainy Season',
        'population_context': 'Border region with rich forest resources',
        'color_code': '#27ae60'  # Green
    },
    'Montserrado': {
        'lat': 6.31,
        'lon': -10.81,
        'description': 'Montserrado County hosts Liberia\'s capital, Monrovia, and is the most developed and populated region. The county experiences a tropical climate with warm temperatures and high rainfall throughout the year.',
        'climate': 'Tropical humid climate',
        'season': 'Rainy Season',
        'population_context': 'Most populous county with capital city',
        'color_code': '#c0392b'  # Red for urban/developed
    },
    'Nimba': {
        'lat': 7.63,
        'lon': -8.82,
        'description': 'Nimba County is located in northern Liberia near Guinea\'s border and features the Nimba Mountains. The region has a subtropical climate influenced by elevation and receives substantial precipitation.',
        'climate': 'Subtropical mountainous climate',
        'season': 'Rainy Season',
        'population_context': 'Mountain region with mineral resources',
        'color_code': '#8e44ad'  # Purple for mountains
    },
    'River Cess': {
        'lat': 5.34,
        'lon': -9.13,
        'description': 'River Cess County is in south-central Liberia and is characterized by river systems and coastal influence. This region experiences consistent tropical weather with high humidity.',
        'climate': 'Tropical riverine climate',
        'season': 'Rainy Season',
        'population_context': 'River-based region with fishing communities',
        'color_code': '#2980b9'  # Blue for water
    },
    'River Gee': {
        'lat': 4.80,
        'lon': -8.71,
        'description': 'River Gee County is in southeastern Liberia and features multiple river systems flowing through forested terrain. The region maintains equatorial climate conditions with year-round warmth.',
        'climate': 'Equatorial climate with riverine influence',
        'season': 'Rainy Season',
        'population_context': 'Remote southeastern county',
        'color_code': '#1abc9c'  # Teal
    },
    'Sinoe': {
        'lat': 5.00,
        'lon': -10.91,
        'description': 'Sinoe County is in south-central Liberia and features a mix of coastal and forest ecosystems. The region experiences high rainfall and warm temperatures characteristic of equatorial regions.',
        'climate': 'Equatorial coastal climate',
        'season': 'Rainy Season',
        'population_context': 'Coastal region with forest resources',
        'color_code': '#16a085'  # Teal
    }
}

def get_county_data(county_name):
    """Get full data for a specific county."""
    return COUNTIES_DATA.get(county_name)

def get_all_counties_data():
    """Return all county data."""
    return COUNTIES_DATA

def get_county_color(county_name):
    """Get weather color code for a county based on climate characteristics."""
    data = COUNTIES_DATA.get(county_name)
    return data['color_code'] if data else '#667eea'
