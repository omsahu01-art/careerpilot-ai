from pathlib import Path
from uuid import uuid4
import re
import zipfile
import xml.etree.ElementTree as ET

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader


app = FastAPI(
    title="CareerPilot AI API",
    description="Backend API for CareerPilot AI career and skill readiness platform",
    version="1.0.0",
)


# Allow Vite frontend on common development ports.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:5177",
        "http://localhost:5178",
        "http://localhost:5179",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_EXTENSIONS = {".pdf", ".docx"}
MAX_FILE_SIZE = 10 * 1024 * 1024


SKILL_LIBRARY = {
    "Python": ["python"],
    "SQL": ["sql"],
    "Excel": ["excel", "microsoft excel"],
    "Power BI": ["power bi", "powerbi"],
    "Tableau": ["tableau"],
    "Pandas": ["pandas"],
    "NumPy": ["numpy"],
    "Scikit-learn": ["scikit-learn", "scikit learn", "sklearn"],
    "Machine Learning": ["machine learning", "machine-learning"],
    "Deep Learning": ["deep learning"],
    "Generative AI": [
        "generative ai",
        "generative artificial intelligence",
    ],
    "Artificial Intelligence": [
        "artificial intelligence",
        "ai",
    ],
    "Data Analytics": [
        "data analytics",
        "data analysis",
        "data analyst",
    ],
    "Data Visualization": [
        "data visualization",
        "data visualisation",
    ],
    "Statistics": [
        "statistics",
        "statistical analysis",
    ],
    "Java": ["java"],
    "C++": ["c++"],
    "C": [" c ", "c programming"],
    "JavaScript": ["javascript", "java script"],
    "TypeScript": ["typescript"],
    "React": ["react", "react.js", "reactjs"],
    "Node.js": ["node.js", "nodejs", "node js"],
    "Express.js": [
        "express.js",
        "expressjs",
        "express js",
    ],
    "HTML": ["html"],
    "CSS": ["css"],
    "REST APIs": [
        "rest api",
        "rest apis",
        "restful api",
        "restful apis",
    ],
    "Git": ["git", "github", "gitlab"],
    "Docker": ["docker"],
    "Kubernetes": ["kubernetes", "k8s"],
    "AWS": ["aws", "amazon web services"],
    "Azure": ["azure", "microsoft azure"],
    "GCP": ["gcp", "google cloud"],
    "MongoDB": ["mongodb", "mongo db"],
    "PostgreSQL": ["postgresql", "postgres"],
    "MySQL": ["mysql"],
    "Firebase": ["firebase"],
    "FastAPI": ["fastapi"],
    "Flask": ["flask"],
    "Django": ["django"],
    "Figma": ["figma"],
    "Canva": ["canva"],
    "PowerPoint": [
        "powerpoint",
        "microsoft powerpoint",
    ],
    "Jupyter": [
        "jupyter",
        "jupyter notebook",
    ],
}


def extract_pdf_text(file_path: Path) -> str:
    """
    Extract readable text from a PDF using pypdf.
    """
    reader = PdfReader(str(file_path))

    pages = []

    for page in reader.pages:
        text = page.extract_text() or ""

        if text.strip():
            pages.append(text.strip())

    return "\n\n".join(pages)


def extract_docx_text(file_path: Path) -> str:
    """
    Extract text from a DOCX file without python-docx/lxml.

    DOCX files are ZIP archives containing XML files.
    We read word/document.xml directly using Python's
    built-in zipfile and XML libraries.
    """

    paragraphs = []

    namespace = {
        "w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
    }

    try:
        with zipfile.ZipFile(file_path, "r") as document_zip:
            if "word/document.xml" not in document_zip.namelist():
                raise ValueError(
                    "Invalid DOCX file: word/document.xml not found"
                )

            xml_data = document_zip.read("word/document.xml")

        root = ET.fromstring(xml_data)

        for paragraph in root.findall(".//w:p", namespace):
            text_parts = []

            for text_node in paragraph.findall(".//w:t", namespace):
                if text_node.text:
                    text_parts.append(text_node.text)

            paragraph_text = "".join(text_parts).strip()

            if paragraph_text:
                paragraphs.append(paragraph_text)

    except zipfile.BadZipFile as error:
        raise ValueError(
            "The uploaded DOCX file is corrupted or invalid"
        ) from error

    except ET.ParseError as error:
        raise ValueError(
            "Could not read the DOCX document structure"
        ) from error

    return "\n".join(paragraphs)


def extract_resume_text(
    file_path: Path,
    file_extension: str,
) -> str:
    if file_extension == ".pdf":
        return extract_pdf_text(file_path)

    if file_extension == ".docx":
        return extract_docx_text(file_path)

    raise ValueError("Unsupported file type")


def normalize_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"\s+", " ", text)

    return f" {text} "


def find_skill_evidence(
    original_text: str,
    skill: str,
    keywords: list[str],
) -> str | None:
    lines = [
        line.strip()
        for line in original_text.splitlines()
        if line.strip()
    ]

    normalized_keywords = [
        keyword.lower().strip()
        for keyword in keywords
    ]

    for line in lines:
        line_lower = line.lower()

        for keyword in normalized_keywords:
            if keyword in line_lower:
                return line[:300]

    return None


def detect_skill_level(
    resume_text: str,
    skill: str,
) -> str:
    text = resume_text.lower()

    advanced_terms = [
        "advanced",
        "expert",
        "lead",
        "led",
        "architected",
        "designed",
        "production",
        "deployed",
    ]

    intermediate_terms = [
        "developed",
        "built",
        "implemented",
        "analyzed",
        "worked with",
        "used",
        "created",
        "project",
        "intern",
        "internship",
    ]

    skill_lower = skill.lower()

    position = text.find(skill_lower)

    if position == -1:
        return "Beginner"

    context_start = max(
        0,
        position - 250,
    )

    context_end = min(
        len(text),
        position + len(skill_lower) + 350,
    )

    context = text[
        context_start:context_end
    ]

    if any(
        term in context
        for term in advanced_terms
    ):
        return "Advanced"

    if any(
        term in context
        for term in intermediate_terms
    ):
        return "Intermediate"

    return "Beginner"


def extract_skills(
    resume_text: str,
) -> list[dict]:
    normalized_resume = normalize_text(
        resume_text
    )

    detected_skills = []

    for skill, keywords in SKILL_LIBRARY.items():
        matched_keyword = None

        for keyword in keywords:
            normalized_keyword = (
                keyword.lower().strip()
            )

            if (
                f" {normalized_keyword} "
                in normalized_resume
            ):
                matched_keyword = keyword
                break

        if not matched_keyword:
            continue

        evidence = find_skill_evidence(
            resume_text,
            skill,
            keywords,
        )

        level = detect_skill_level(
            resume_text,
            skill,
        )

        if level == "Advanced":
            confidence = 95
        elif level == "Intermediate":
            confidence = 85
        else:
            confidence = 70

        detected_skills.append(
            {
                "skill": skill,
                "level": level,
                "confidence": confidence,
                "evidence": (
                    evidence
                    or "Skill mentioned in resume"
                ),
                "source": "explicit",
            }
        )

    return detected_skills


@app.get("/")
def root():
    return {
        "message": "CareerPilot AI API is running",
        "status": "success",
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "CareerPilot AI Backend",
    }


@app.post("/api/resume/upload")
async def upload_resume(
    file: UploadFile = File(...),
):
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file selected",
        )

    file_extension = Path(
        file.filename
    ).suffix.lower()

    if file_extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=(
                "Only PDF and DOCX files are allowed"
            ),
        )

    file_content = await file.read()

    if len(file_content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=(
                "File size must be less than 10 MB"
            ),
        )

    file_id = str(uuid4())

    safe_filename = (
        f"{file_id}{file_extension}"
    )

    file_path = (
        UPLOAD_DIR / safe_filename
    )

    file_path.write_bytes(file_content)

    try:
        resume_text = extract_resume_text(
            file_path,
            file_extension,
        )

    except Exception as error:
        file_path.unlink(
            missing_ok=True
        )

        raise HTTPException(
            status_code=400,
            detail=(
                f"Could not read resume: {str(error)}"
            ),
        )

    if not resume_text.strip():
        file_path.unlink(
            missing_ok=True
        )

        raise HTTPException(
            status_code=400,
            detail=(
                "No readable text was found in the "
                "resume. If this is a scanned PDF, "
                "OCR will be added later."
            ),
        )

    skills = extract_skills(
        resume_text
    )

    return {
        "status": "success",
        "message": (
            "Resume uploaded, text extracted, "
            "and skills detected successfully"
        ),
        "file_id": file_id,
        "original_filename": file.filename,
        "file_type": file_extension.replace(
            ".",
            "",
        ),
        "file_size": len(file_content),
        "text_length": len(resume_text),
        "skill_count": len(skills),
        "skills": skills,
        "resume_text": resume_text,
    }


@app.post("/api/resume/{file_id}/skills")
def get_resume_skills(
    file_id: str,
):
    return {
        "status": "success",
        "message": (
            "Skill extraction currently happens "
            "during resume upload. Database "
            "persistence will be added in the "
            "next stage."
        ),
        "file_id": file_id,
    }