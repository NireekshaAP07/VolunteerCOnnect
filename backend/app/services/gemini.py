import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-pro')
else:
    model = None

async def improve_description(title: str, description: str):
    if not model:
        return description + " (AI Enhancement skipped: API Key missing)"
    
    prompt = f"""
    Act as a professional NGO coordinator. Improve the following volunteering event description to make it more engaging, clear, and professional.
    Keep it concise but impactful.
    
    Title: {title}
    Original Description: {description}
    
    Improved Description:
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Error calling Gemini: {e}")
        return description

async def categorize_event(description: str):
    if not model:
        return "General"
    
    prompt = f"""
    Categorize the following volunteering event into one of these categories: 
    Education, Health, Environment, Relief, Animals, Community.
    Return ONLY the category name.
    
    Description: {description}
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Error calling Gemini: {e}")
        return "Community"

async def ask_assistant(message: str):
    if not model:
        return "I'm sorry, my AI capabilities are currently offline. Please configure the GEMINI_API_KEY."
    
    prompt = f"""
    Act as a friendly, supportive, and knowledgeable AI Assistant for the VolunteerConnect platform. 
    You are here to help volunteers with any questions they have, including finding locations, offering motivation if they are tired, or giving general volunteering advice. 
    Keep your answers concise, encouraging, and helpful.
    
    User says: {message}
    
    Assistant response:
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Error calling Gemini: {e}")
        return "I'm sorry, I'm having trouble connecting right now. Please try again later!"
