import yaml
from datetime import datetime
from gemini_integration import GeminiIntegration
from linkedin_automation import LinkedInAutomation
# from indeed_automation import IndeedAutomation
# from ziprecruiter_autom import ZipRecruiterAutomation
import sqlite3
import os
import fitz  
from utils import setup_logging, random_delay

class JobApplicationAutomator:
    def __init__(self, config_path):
        with open(config_path, 'r') as f:
            self.config = yaml.safe_load(f)
        
        # Setup AI
        self.ai = GeminiIntegration(self.config['gemini_api_key'])
        
        # Setup platforms
        self.platforms = {
            'linkedin': LinkedInAutomation(
                self.config['platforms']['linkedin']['username'],
                self.config['platforms']['linkedin']['password']
            ),
            # 'indeed': IndeedAutomation(
            #     self.config['platforms']['indeed']['username'],
            #     self.config['platforms']['indeed']['password']
            # ),
            # 'ziprecruiter': ZipRecruiterAutomation(
            #     self.config['platforms']['ziprecruiter']['username'],
            #     self.config['platforms']['ziprecruiter']['password']
            # )
        }
        
        # Setup database
        self.db = sqlite3.connect('data/applications_log.db')
        self._init_db()
        
        # Load resume
        self.resume_text = self._load_resume()
        
        # Setup logging
        self.logger = setup_logging()
    
    def _init_db(self):
        cursor = self.db.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS applications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                platform TEXT,
                job_title TEXT,
                company TEXT,
                date_applied TEXT,
                status TEXT DEFAULT 'applied',
                notes TEXT,
                job_url TEXT
            )
        ''')
        self.db.commit()
    
    def _load_resume(self):
        resume_dir = 'data/resumes'
        resume_files = os.listdir(resume_dir)
        if not resume_files:
            raise FileNotFoundError("No resume files found in data/resumes directory")
    
        latest_resume = sorted(resume_files)[-1]
        resume_path = os.path.join(resume_dir, latest_resume)
    
    # Read PDF and extract text
        doc = fitz.open(resume_path)
        resume_text = ""
        for page in doc:
            resume_text += page.get_text()
        doc.close()

        return resume_text
    
    def run(self):
        try:
            self.logger.info("Starting job application automation")
            
            # Apply to jobs on each platform
            for platform_name, platform in self.platforms.items():
                self.logger.info(f"Processing platform: {platform_name}")
                
                # Login to platform
                try:
                    platform.login()
                except Exception as e:
                    self.logger.error(f"Failed to login to {platform_name}: {str(e)}")
                    continue
                
                # Search for jobs
                jobs = platform.search_jobs(
                    self.config['settings']['keywords'],
                    self.config['settings']['preferred_locations'][0]
                )
                
                self.logger.info(f"Found {len(jobs)} jobs on {platform_name}")
                
                # Apply to jobs
                applications_today = 0
                max_applications = self.config['settings']['max_applications_per_day']
                
                for job in jobs[:max_applications]:
                    if applications_today >= max_applications:
                        break
                    
                    try:
                        # Get job details
                        job_title, company, job_description = platform.get_job_details(job)
                        
                        # Generate tailored cover letter
                        cover_letter = self.ai.generate_cover_letter(
                            job_description,
                            company,
                            self.resume_text
                        )
                        
                        # Apply to job
                        success = platform.apply_to_job(
                            job,
                            'data/resumes/latest_resume.pdf',
                            cover_letter
                        )
                        
                        if success:
                            applications_today += 1
                            self._log_application(
                                platform_name,
                                job_title,
                                company,
                                platform.get_job_url(job)
                            )
                            self.logger.info(f"Successfully applied to {job_title} at {company}")
                            random_delay(30, 120)  # Random delay between applications
                        else:
                            self.logger.warning(f"Failed to apply to {job_title} at {company}")
                            
                    except Exception as e:
                        self.logger.error(f"Error applying to job: {str(e)}")
                        continue
                
                platform.close()
                
        except KeyboardInterrupt:
            self.logger.info("Application process interrupted by user")
        except Exception as e:
            self.logger.error(f"Fatal error: {str(e)}")
        finally:
            self.db.close()
            self.logger.info("Job application automation completed")
    
    def _log_application(self, platform, title, company, url):
        cursor = self.db.cursor()
        cursor.execute('''
            INSERT INTO applications (platform, job_title, company, date_applied, job_url)
            VALUES (?, ?, ?, ?, ?)
        ''', (platform, title, company, datetime.now().isoformat(), url))
        self.db.commit()

if __name__ == "__main__":
    automator = JobApplicationAutomator('config/config.yaml')  # Changed from JobApplicationAutomation
    automator.run()