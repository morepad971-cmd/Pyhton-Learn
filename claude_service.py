"""
Claude AI Service for generating county descriptions
Uses Anthropic API to create brief and detailed descriptions
"""

import os
from anthropic import Anthropic

# Initialize Anthropic client with API key from environment
client = Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))

BRIEF_PROMPT = """You are a Liberia geography expert. Provide a single sentence description of {county} county in Liberia. 
Include one key characteristic (geographic, economic, or cultural). Keep it under 20 words.
Format: Just the sentence, no labels or quotes."""

DETAILED_PROMPT = """You are a Liberia geography and travel expert. Provide a comprehensive 2-3 sentence description of {county} county in Liberia.
Include:
1. Geographic location and climate
2. Agricultural or economic significance
3. Unique features for travelers or investors

Be informative but concise. Use plain language."""

def get_county_description(county_name, brief=True):
    """
    Generate AI description for a county using Claude.
    
    Args:
        county_name (str): Name of Liberian county
        brief (bool): If True, return one-sentence description. If False, detailed paragraph.
        
    Returns:
        dict: {'description': str, 'type': 'brief' or 'detailed', 'error': optional error message}
    """
    try:
        prompt = BRIEF_PROMPT if brief else DETAILED_PROMPT
        prompt = prompt.format(county=county_name)
        
        message = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=150 if brief else 300,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            timeout=10.0
        )
        
        description = message.content[0].text.strip()
        
        return {
            'success': True,
            'description': description,
            'type': 'brief' if brief else 'detailed',
            'county': county_name
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': f"Failed to generate description: {str(e)}",
            'county': county_name
        }

def get_multi_descriptions(county_name):
    """
    Get both brief and detailed descriptions for a county in parallel.
    
    Args:
        county_name (str): Name of Liberian county
        
    Returns:
        dict: {'brief': str, 'detailed': str, 'county': str}
    """
    brief_result = get_county_description(county_name, brief=True)
    detailed_result = get_county_description(county_name, brief=False)
    
    return {
        'county': county_name,
        'brief': brief_result.get('description', 'N/A') if brief_result.get('success') else 'Unable to generate',
        'detailed': detailed_result.get('description', 'N/A') if detailed_result.get('success') else 'Unable to generate'
    }
