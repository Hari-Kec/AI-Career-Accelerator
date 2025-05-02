import google.generativeai as genai
from configparser import ConfigParser
import os

class GeminiIntegration:
    def __init__(self, api_key):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-pro')
        
    def generate_cover_letter(self, job_description, company_info, resume_text):
        prompt = f"""
        Generate a tailored cover letter based on the following information:
        
        Job Description:
        {job_description}
        
        Company Information:
        {company_info}
        
        Applicant's Resume:
        {resume_text}
        
        The cover letter should:
        - Be professional but not generic
        - Highlight relevant skills from the resume that match the job
        - Be about 250-300 words
        - Address the hiring manager directly if possible
        - Include a strong opening and closing
        """
        
        response = self.model.generate_content(prompt)
        return response.text
    
    def optimize_resume(self, original_resume, job_description):
        prompt = f"""
        Optimize this resume for the following job description:
        
        Job Description:
        {job_description}
        
        Current Resume:
        {original_resume}
        
        Provide the optimized resume with:
        - Reordered sections to highlight relevant experience first
        - Tweaked bullet points to match keywords from the job description
        - No fabrication of experience, only rephrasing existing content
        """
        
        response = self.model.generate_content(prompt)
        return response.text
    
    def generate_responses(self, questions, job_description, resume_text):
        prompt = f"""
        Based on the job description and resume below, generate professional responses to the following questions:
        
        Questions:
        {questions}
        
        Job Description:
        {job_description}
        
        Resume:
        {resume_text}
        
        Responses should:
        - Be concise but complete
        - Incorporate relevant experience from the resume
        - Use metrics and achievements where possible
        - Be about 50-100 words each
        """
        
        response = self.model.generate_content(prompt)
        return response.text