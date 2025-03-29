
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from datetime import datetime
from flask_cors import CORS
import cloudinary
import cloudinary.uploader
import google.generativeai as genai
import PyPDF2
import io
import json

# Cloudinary Configuration
cloudinary.config(
    cloud_name="dqzzfjaqc",
    api_key="963278231344531",
    api_secret="_m3DrNq-nfDWkHhfmn3yvivs1ZU"
)

# Flask App Initialization
app = Flask(__name__)
CORS(app)

# MongoDB Configuration
app.config["MONGO_URI"] = "mongodb+srv://shubhambendre04:tGeCJTpuCNIjJVq3@cluster0.mvsff.mongodb.net/job?retryWrites=true&w=majority&appName=Cluster0"
mongo = PyMongo(app)

# Gemini API Configuration
genai.configure(api_key="AIzaSyDdK7ukD2lO9kli33tX1v0wv1RBzbxhAgY")

def extract_pdf_text(file):
    """
    Extract text from PDF file
    """
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file.read()))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text
    except Exception as e:
        print(f"PDF extraction error: {e}")
        return ""

def analyze_resume_match(resume_text, job_description):
    """
    Analyze resume matching with job description using Gemini
    """
    model = genai.GenerativeModel('gemini-1.5-pro-latest')
    
    prompt = f"""
    You are an expert technical recruiter specializing in tech roles (Software Engineering, Data Science, Data Analyst, Big Data Engineering).

    Carefully analyze the following resume and job description:

    Resume:
    {resume_text}

    Job Description:
    {job_description}

    Your task is to:
    1. Calculate precise percentage match between resume and job description
    2. Identify missing keywords critical for the role
    3. Provide a concise profile summary

    Return ONLY a JSON in this exact format:
    {{
        "JD_Match": "X%",
        "MissingKeywords": [],
        "Profile_Summary": "Concise evaluation of candidate's profile"
    }}

    Guidelines:
    - Match percentage based on skills, experience, and relevance
    - Be critical and competitive in assessment
    - Missing keywords should be specific technical skills or experience gaps
    - Profile summary should highlight strengths and potential improvements
    """

    try:
        response = model.generate_content(prompt)
        
        # Safely parse the JSON response
        try:
            # Remove any markdown code block markers
            json_str = response.text.strip('```json\n```')
            match_data = json.loads(json_str)
        except json.JSONDecodeError:
            # Fallback to a default structure if JSON parsing fails
            match_data = {
                "JD_Match": "0%",
                "MissingKeywords": [],
                "Profile_Summary": "Unable to parse resume details"
            }
        
        return match_data
    
    except Exception as e:
        print(f"Error in resume matching: {e}")
        return {
            "JD_Match": "0%",
            "MissingKeywords": [],
            "Profile_Summary": "Error in analysis"
        }
    
@app.route('/api/jobs/create', methods=['POST'])
def create_job():
    try:
        # Get job data from request
        job_data = request.json

        # Validate required fields
        required_fields = ['title', 'description', 'department']
        for field in required_fields:
            if not job_data.get(field):
                return jsonify({"error": f"{field} is required"}), 400

        # Prepare job document
        job_document = {
            "title": job_data['title'],
            "department": job_data['department'],
            "location": job_data.get('location', ''),
            "description": job_data['description'],
            "required_skills": job_data.get('requiredSkills', []),
            "experience_level": job_data.get('experienceLevel', ''),
            "min_experience": job_data.get('minExperience', 0),
            "max_experience": job_data.get('maxExperience', 0),
            "created_at": datetime.utcnow(),
            "status": "active"
        }

        # Insert job into MongoDB
        result = mongo.db.jobs.insert_one(job_document)

        return jsonify({
            "message": "Job created successfully",
            "job_id": str(result.inserted_id)
        }), 201

    except Exception as e:
        print(f"Error creating job: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    try:
        # Retrieve all active jobs
        jobs = list(mongo.db.jobs.find({"status": "active"}))
        
        # Convert ObjectId to string
        for job in jobs:
            job['_id'] = str(job['_id'])
        
        return jsonify(jobs), 200

    except Exception as e:
        print(f"Error retrieving jobs: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/jobs/<job_id>/upload-resumes', methods=['POST'])
def upload_resumes(job_id):
    try:
        # Check if files were uploaded
        if 'resumes' not in request.files:
            return jsonify({"error": "No files uploaded"}), 400

        uploaded_resumes = []
        candidate_details = []

        # Fetch the job description
        job = mongo.db.jobs.find_one({"_id": ObjectId(job_id)})
        job_description = job.get('description', '')

        # Process each uploaded file
        for file in request.files.getlist('resumes'):
            # Upload resume to Cloudinary
            try:
                upload_result = cloudinary.uploader.upload(
                    file, 
                    folder='resumes',
                    resource_type='raw'
                )
            except Exception as e:
                print(f"Cloudinary upload error: {e}")
                return jsonify({"error": "Failed to upload to Cloudinary"}), 500
            
            resume_url = upload_result['secure_url']

            # Extract text from PDF
            file.seek(0)  # Reset file pointer
            resume_text = extract_pdf_text(file)

            # Use Gemini to extract candidate information
            model = genai.GenerativeModel('gemini-1.5-pro-latest')
            
            prompt = f"""
            Extract the following information from the resume text:
            Resume Text: {resume_text}

            Please return a JSON with these fields:
            {{
                "full_name": "",
                "email": "",
                "phone": "",
                "current_job_title": "",
                "education": "",
                "skills": []
            }}
            """

            try:
                response = model.generate_content(prompt)
                
                # Try to parse the response safely
                try:
                    # Remove any markdown code block markers
                    json_str = response.text.strip('```json\n```')
                    extracted_data = json.loads(json_str)
                except json.JSONDecodeError:
                    # Fallback parsing if direct JSON fails
                    extracted_data = {
                        "full_name": "N/A",
                        "email": "N/A",
                        "phone": "N/A",
                        "current_job_title": "N/A",
                        "education": "N/A",
                        "skills": []
                    }

                # Analyze resume match
                match_result = analyze_resume_match(resume_text, job_description)

                # Prepare candidate information
                candidate_info = {
                    "job_id": job_id,
                    "resume_url": resume_url,
                    "name": extracted_data.get('full_name', 'N/A'),
                    "email": extracted_data.get('email', 'N/A'),
                    "phone": extracted_data.get('phone', 'N/A'),
                    "current_job_title": extracted_data.get('current_job_title', 'N/A'),
                    "education": extracted_data.get('education', 'N/A'),
                    "skills": extracted_data.get('skills', []),
                    "uploaded_at": datetime.utcnow(),
                    "match_result": match_result,
                    "match_percentage": float(match_result['JD_Match'].rstrip('%'))
                }

                # Store candidate information in MongoDB
                result = mongo.db.candidates.insert_one(candidate_info)
                candidate_info['_id'] = str(result.inserted_id)

                uploaded_resumes.append(resume_url)
                candidate_details.append(candidate_info)

            except Exception as parse_error:
                print(f"Error parsing resume: {parse_error}")
                # Continue with other files even if one fails
                continue

        return jsonify({
            "message": "Resumes uploaded successfully",
            "uploaded_resumes": uploaded_resumes,
            "candidate_details": candidate_details
        }), 201

    except Exception as e:
        print(f"Error uploading resumes: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/jobs/<job_id>', methods=['GET'])
def get_job_details(job_id):
    try:
        # Convert job_id to ObjectId
        object_id = ObjectId(job_id)
        
        # Find the job in MongoDB
        job = mongo.db.jobs.find_one({"_id": object_id})
        
        if job:
            # Convert ObjectId to string
            job['_id'] = str(job['_id'])
            
            # Convert datetime to ISO format string for JSON serialization
            job['created_at'] = job['created_at'].isoformat()
            
            # Fetch candidates for this job, sorted by match percentage in descending order
            candidates = list(mongo.db.candidates.find({"job_id": job_id}).sort("match_percentage", -1))
            for candidate in candidates:
                candidate['_id'] = str(candidate['_id'])
            
            job['candidates'] = candidates
            
            return jsonify(job), 200
        else:
            return jsonify({"error": "Job not found"}), 404

    except Exception as e:
        print(f"Error retrieving job details: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/jobs/<job_id>/candidates', methods=['GET'])
def get_job_candidates(job_id):
    try:
        # Fetch candidates for this job, sorted by match percentage in descending order
        candidates = list(mongo.db.candidates.find({"job_id": job_id}).sort("match_percentage", -1))
        
        for candidate in candidates:
            candidate['_id'] = str(candidate['_id'])
        
        return jsonify(candidates), 200

    except Exception as e:
        print(f"Error retrieving job candidates: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/candidates/<candidate_id>', methods=['GET'])
def get_candidate_details(candidate_id):
    try:
        # Convert candidate_id to ObjectId
        object_id = ObjectId(candidate_id)
        
        # Find the candidate in MongoDB
        candidate = mongo.db.candidates.find_one({"_id": object_id})
        
        if candidate:
            # Convert ObjectId to string
            candidate['_id'] = str(candidate['_id'])
            
            # Convert datetime fields to ISO format string for JSON serialization
            if 'uploaded_at' in candidate:
                candidate['uploaded_at'] = candidate['uploaded_at'].isoformat()
            
            return jsonify(candidate), 200
        else:
            return jsonify({"error": "Candidate not found"}), 404

    except Exception as e:
        print(f"Error retrieving candidate details: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/candidates', methods=['GET'])
def get_all_candidates():
    try:
        # Fetch all candidates from the database
        candidates = list(mongo.db.candidates.find())
        
        # Convert ObjectId to string and format datetime fields
        for candidate in candidates:
            candidate['_id'] = str(candidate['_id'])
            if 'uploaded_at' in candidate:
                candidate['uploaded_at'] = candidate['uploaded_at'].isoformat()
        
        return jsonify(candidates), 200
    except Exception as e:
        print(f"Error retrieving candidates: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(debug=True)
