from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException
import time
import random
import yaml
import os
from datetime import datetime
import sqlite3
import logging

class LinkedInJobApplicator:
    def __init__(self, config_path):
        # Load configuration
        with open(config_path, 'r') as f:
            self.config = yaml.safe_load(f)
        
        # Setup browser
        self.driver = webdriver.Chrome()
        self.driver.maximize_window()
        
        # Setup logging
        self.setup_logging()
        self.logger = logging.getLogger('linkedin_autoapply')
        
        # User details
        self.linkedin_username = self.config['platforms']['linkedin']['username']
        self.linkedin_password = self.config['platforms']['linkedin']['password']
        self.resume_path = os.path.abspath(self.config['resume_path'])
        self.search_keywords = self.config['settings']['keywords']
        self.locations = self.config['settings']['preferred_locations']
        self.max_applications = self.config['settings']['max_applications_per_day']
        
        # Setup database
        self.db = sqlite3.connect('applications.db')
        self._init_db()
    
    def setup_logging(self):
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('application_log.log'),
                logging.StreamHandler()
            ]
        )
    
    def _init_db(self):
        cursor = self.db.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS applications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                job_title TEXT,
                company TEXT,
                date_applied TEXT,
                status TEXT,
                job_url TEXT
            )
        ''')
        self.db.commit()
    
    def random_delay(self, min_sec=2, max_sec=5):
        time.sleep(random.uniform(min_sec, max_sec))
    
    def login(self):
        self.logger.info("Logging in to LinkedIn")
        self.driver.get("https://www.linkedin.com/login")
        
        # Accept cookies if present
        try:
            cookie_btn = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, '//button[contains(text(), "Accept")]'))
            )
            cookie_btn.click()
            self.random_delay()
        except:
            pass
        
        # Fill login form
        email_field = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.ID, "username"))
        )
        email_field.send_keys(self.linkedin_username)
        
        password_field = self.driver.find_element(By.ID, "password")
        password_field.send_keys(self.linkedin_password)
        
        login_button = self.driver.find_element(By.XPATH, '//button[@type="submit"]')
        login_button.click()
        
        # Verify login
        try:
            WebDriverWait(self.driver, 20).until(
                EC.presence_of_element_located((By.XPATH, '//input[contains(@aria-label, "Search")]'))
            )
            self.logger.info("Successfully logged in")
            return True
        except TimeoutException:
            self.logger.error("Login failed")
            return False
    
    def search_jobs(self, keyword, location):
        self.logger.info(f"Searching for {keyword} jobs in {location}")
        search_url = f"https://www.linkedin.com/jobs/search/?keywords={keyword}&location={location}&f_AL=true"
        self.driver.get(search_url)
        self.random_delay(3, 5)
        
        # Scroll to load more jobs
        last_height = self.driver.execute_script("return document.body.scrollHeight")
        while True:
            self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            self.random_delay(2, 3)
            new_height = self.driver.execute_script("return document.body.scrollHeight")
            if new_height == last_height:
                break
            last_height = new_height
        
        # Get job listings
        jobs = self.driver.find_elements(By.XPATH, '//li[contains(@class, "jobs-search-results__list-item")]')
        self.logger.info(f"Found {len(jobs)} jobs")
        return jobs
    
    def get_job_details(self, job_element):
        try:
            job_element.click()
            self.random_delay(2, 3)
            
            # Get job title
            title = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.XPATH, '//h2[contains(@class, "jobs-details-top-card__job-title")]'))
            ).text
            
            # Get company name
            company = self.driver.find_element(By.XPATH, '//a[contains(@class, "jobs-details-top-card__company-url")]').text
            
            # Get job description
            desc = self.driver.find_element(By.XPATH, '//div[contains(@class, "jobs-description")]').text
            
            # Get job URL
            url = self.driver.current_url
            
            return title, company, desc, url
        except Exception as e:
            self.logger.error(f"Error getting job details: {str(e)}")
            return None, None, None, None
    
    def apply_to_job(self):
        try:
            # Click Easy Apply button
            easy_apply_btn = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, '//button[contains(@class, "jobs-apply-button")]'))
            )
            easy_apply_btn.click()
            self.random_delay(2, 3)
            
            # Go through application pages
            while True:
                # Upload resume if field exists
                try:
                    upload_btn = WebDriverWait(self.driver, 5).until(
                        EC.presence_of_element_located((By.XPATH, '//input[contains(@name, "file")]'))
                    )
                    upload_btn.send_keys(self.resume_path)
                    self.random_delay(2, 3)
                except:
                    pass
                
                # Fill required fields
                self.fill_required_fields()
                
                # Check if next button exists
                try:
                    next_btn = WebDriverWait(self.driver, 5).until(
                        EC.element_to_be_clickable((By.XPATH, '//button[contains(@aria-label, "Continue to next step")]'))
                    )
                    next_btn.click()
                    self.random_delay(2, 3)
                except:
                    break
            
            # Submit application
            submit_btn = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, '//button[contains(@aria-label, "Submit application")]'))
            )
            submit_btn.click()
            self.random_delay(3, 5)
            
            # Close confirmation
            try:
                close_btn = WebDriverWait(self.driver, 10).until(
                    EC.element_to_be_clickable((By.XPATH, '//button[contains(@aria-label, "Dismiss")]'))
                )
                close_btn.click()
            except:
                pass
            
            return True
        except Exception as e:
            self.logger.error(f"Application failed: {str(e)}")
            try:
                self.driver.find_element(By.XPATH, '//button[contains(@aria-label, "Dismiss")]').click()
            except:
                pass
            return False
    
    def fill_required_fields(self):
        # This is where you would implement field filling logic
        # For now, just a placeholder
        pass
    
    def log_application(self, title, company, url, status):
        cursor = self.db.cursor()
        cursor.execute('''
            INSERT INTO applications (job_title, company, date_applied, status, job_url)
            VALUES (?, ?, ?, ?, ?)
        ''', (title, company, datetime.now().isoformat(), status, url))
        self.db.commit()
    
    def run(self):
        try:
            if not self.login():
                return
            
            applications_today = 0
            
            for location in self.locations:
                for keyword in self.search_keywords:
                    if applications_today >= self.max_applications:
                        break
                    
                    jobs = self.search_jobs(keyword, location)
                    
                    for job in jobs:
                        if applications_today >= self.max_applications:
                            break
                        
                        title, company, desc, url = self.get_job_details(job)
                        if not title:
                            continue
                        
                        self.logger.info(f"Applying to {title} at {company}")
                        
                        success = self.apply_to_job()
                        status = "success" if success else "failed"
                        self.log_application(title, company, url, status)
                        
                        if success:
                            applications_today += 1
                            self.logger.info(f"Successfully applied to {title} at {company}")
                            self.random_delay(30, 120)  # Respectful delay between applications
                        else:
                            self.logger.warning(f"Failed to apply to {title} at {company}")
        
        except Exception as e:
            self.logger.error(f"Error in main execution: {str(e)}")
        finally:
            self.driver.quit()
            self.db.close()
            self.logger.info("Application process completed")

if __name__ == "__main__":
    # Sample config.yaml structure:
    """
    platforms:
      linkedin:
        username: "your_email@example.com"
        password: "your_password"
    resume_path: "data/resumes/your_resume.pdf"
    settings:
      keywords: ["Software Engineer", "Python Developer"]
      preferred_locations: ["Remote", "New York"]
      max_applications_per_day: 20
    """
    
    applicator = LinkedInJobApplicator('config.yaml')
    applicator.run()