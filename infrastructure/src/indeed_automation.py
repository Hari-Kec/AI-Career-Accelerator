# from selenium import webdriver
# from selenium.webdriver.common.by import By
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.support import expected_conditions as EC
# from selenium.common.exceptions import NoSuchElementException, TimeoutException
# import time
# from utils import random_delay
# import os

# class IndeedAutomation:
#     def __init__(self, username, password):
#         self.username = username
#         self.password = password
#         self.driver = webdriver.Chrome()
#         self.logged_in = False
        
#     def login(self):
#         self.driver.get("https://secure.indeed.com/account/login")
#         time.sleep(random_delay(2, 3))
        
#         # Handle email/password login
#         try:
#             email_field = WebDriverWait(self.driver, 10).until(
#                 EC.presence_of_element_located((By.ID, "ifl-InputFormField-3"))
#             )
#             email_field.send_keys(self.username)
            
#             password_field = self.driver.find_element(By.ID, "ifl-InputFormField-4")
#             password_field.send_keys(self.password)
            
#             signin_button = self.driver.find_element(By.XPATH, '//button[@type="submit"]')
#             signin_button.click()
            
#             # Wait for login to complete
#             WebDriverWait(self.driver, 20).until(
#                 EC.presence_of_element_located((By.ID, "jobsearch"))
#             )
#             self.logged_in = True
#         except Exception as e:
#             raise Exception(f"Indeed login failed: {str(e)}")
    
#     def search_jobs(self, keywords, location="Remote"):
#         if not self.logged_in:
#             self.login()
            
#         search_url = f"https://www.indeed.com/jobs?q={keywords}&l={location}"
#         self.driver.get(search_url)
#         time.sleep(random_delay(3, 5))
        
#         # Get all job listings
#         jobs = self.driver.find_elements(By.XPATH, '//div[contains(@class, "job_seen_beacon")]')
#         return jobs
    
#     def apply_to_job(self, job_element, resume_path, cover_letter):
#         job_element.click()
#         time.sleep(random_delay(2, 4))
        
#         try:
#             # Click apply button
#             apply_button = WebDriverWait(self.driver, 10).until(
#                 EC.element_to_be_clickable((By.XPATH, '//button[contains(@id, "applyButton")]'))
#             )
#             apply_button.click()
#             time.sleep(random_delay(2, 3))
            
#             # Switch to iframe if present
#             try:
#                 iframe = WebDriverWait(self.driver, 5).until(
#                     EC.presence_of_element_located((By.XPATH, '//iframe[@id="vjs-container-iframe"]'))
#                 )
#                 self.driver.switch_to.frame(iframe)
#             except:
#                 pass
            
#             # Handle resume upload
#             try:
#                 upload_btn = WebDriverWait(self.driver, 5).until(
#                     EC.presence_of_element_located((By.XPATH, '//input[@type="file"]'))
#                 )
#                 upload_btn.send_keys(os.path.abspath(resume_path))
#                 time.sleep(random_delay(2, 3))
#             except:
#                 pass
                
#             # Fill in application form
#             self._fill_application_form(cover_letter)
            
#             # Submit application
#             submit_btn = WebDriverWait(self.driver, 10).until(
#                 EC.element_to_be_clickable((By.XPATH, '//button[contains(text(), "Submit") or contains(text(), "Apply")]'))
#             )
#             submit_btn.click()
#             time.sleep(random_delay(3, 5))
            
#             return True
#         except Exception as e:
#             print(f"Failed to apply to job: {str(e)}")
#             try:
#                 self.driver.find_element(By.XPATH, '//button[text()="Cancel"]').click()
#             except:
#                 pass
#             return False
    
#     def _fill_application_form(self, cover_letter):
#         # This would contain logic to fill Indeed's application form
#         # Implementation depends on your specific needs
#         pass
    
#     def close(self):
#         self.driver.quit()