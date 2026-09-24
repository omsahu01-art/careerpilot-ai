from pathlib import Path
from uuid import uuid4
import re
import zipfile
import xml.etree.ElementTree as ET

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pypdf import PdfReader


app = FastAPI(
    title="CareerPilot AI API",
    description="Backend API for CareerPilot AI career and skill readiness platform",
    version="1.0.0",
)


# -------------------------------------------------------------------
# CORS
# -------------------------------------------------------------------

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


# -------------------------------------------------------------------
# File configuration
# -------------------------------------------------------------------

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_EXTENSIONS = {".pdf", ".docx"}
MAX_FILE_SIZE = 10 * 1024 * 1024


# -------------------------------------------------------------------
# Skill knowledge base
# -------------------------------------------------------------------

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
    "Node.js": [
        "node.js",
        "nodejs",
        "node js",
    ],
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


# -------------------------------------------------------------------
# Resume extraction
# -------------------------------------------------------------------

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


# -------------------------------------------------------------------
# Text and skill detection
# -------------------------------------------------------------------

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


# -------------------------------------------------------------------
# Chat API
# -------------------------------------------------------------------

class ChatRequest(BaseModel):
    message: str
    context: dict = Field(default_factory=dict)


def get_first_value(
    data: dict,
    keys: list[str],
    default=None,
):
    """
    Safely read a value when frontend/backend naming
    may use slightly different field names.
    """

    for key in keys:
        value = data.get(key)

        if value is not None and value != "":
            return value

    return default


def get_gap_info(gap: dict) -> tuple[str, str, str]:
    """
    Normalize different possible gap object formats.

    This prevents responses such as:
    'target requirement is Not specified'
    when the frontend has the requirement under
    another common field name.
    """

    skill = get_first_value(
        gap,
        [
            "skill",
            "name",
            "title",
        ],
        "target skill",
    )

    current_level = get_first_value(
        gap,
        [
            "currentLevel",
            "current_level",
            "current",
            "level",
        ],
        "Not detected",
    )

    required_level = get_first_value(
        gap,
        [
            "requiredLevel",
            "required_level",
            "required",
            "targetLevel",
            "target_level",
            "target",
        ],
        "Intermediate",
    )

    return (
        str(skill),
        str(current_level),
        str(required_level),
    )


def get_project_info(
    project_context: dict,
) -> tuple[str | None, str | None]:
    project = project_context or {}

    project_data = project.get("project")

    if isinstance(project_data, dict):
        title = get_first_value(
            project_data,
            [
                "title",
                "name",
            ],
            None,
        )

        description = get_first_value(
            project_data,
            [
                "description",
                "summary",
            ],
            None,
        )

        return (
            str(title) if title else None,
            str(description) if description else None,
        )

    if isinstance(project_data, str):
        return project_data, None

    title = get_first_value(
        project,
        [
            "title",
            "name",
        ],
        None,
    )

    description = get_first_value(
        project,
        [
            "description",
            "summary",
        ],
        None,
    )

    return (
        str(title) if title else None,
        str(description) if description else None,
    )


def generate_chat_response(
    message: str,
    context: dict,
) -> str:
    """
    Deterministic CareerPilot Assistant.

    Current version intentionally does not use an external LLM.
    It uses the structured CareerPilot context supplied
    by the frontend and responds in Hinglish.
    """

    question = message.strip().lower()

    role = context.get("role") or {}

    role_title = get_first_value(
        role,
        [
            "title",
            "name",
        ],
        "selected role",
    )

    alignment = context.get("alignment") or {}

    alignment_value = get_first_value(
        alignment,
        [
            "alignment",
            "score",
            "percentage",
        ],
        None,
    )

    gaps_data = context.get("gaps") or {}

    if isinstance(gaps_data, list):
        gaps = gaps_data
    else:
        gaps = gaps_data.get("gaps") or []

    roadmap = context.get("roadmap") or {}
    weeks = roadmap.get("weeks") or []

    project_context = context.get("project") or {}

    project_title, project_description = get_project_info(
        project_context
    )

    if not question:
        return (
            "Haan, poochho 😊 "
            "Main aapke skills, role alignment, "
            "skill gaps, roadmap aur projects ke "
            "baare mein help kar sakta hoon."
        )

    # ---------------------------------------------------------------
    # Greetings
    # ---------------------------------------------------------------

    if question in {
        "hi",
        "hello",
        "hey",
        "hii",
        "hlo",
        "namaste",
    }:
        return (
            "Hi! 👋 Main aapka CareerPilot Assistant hoon. "
            "Aap mujhse apne skills, selected role, "
            "skill gaps, roadmap ya project ke baare mein "
            "Hinglish mein pooch sakte ho."
        )

    # ---------------------------------------------------------------
    # Skill gaps
    # ---------------------------------------------------------------

    if (
        "gap" in question
        or "gaps" in question
        or "missing" in question
        or "miss" in question
        or "weak" in question
        or "kamzor" in question
        or "kami" in question
        or "sabse important skill" in question
    ):
        if gaps:
            top_gap = gaps[0]

            if isinstance(top_gap, dict):
                skill, current_level, required_level = get_gap_info(
                    top_gap
                )
            else:
                skill = str(top_gap)
                current_level = "Not detected"
                required_level = "Intermediate"

            return (
                f"Aapki sabse important skill gap **{skill}** hai. "
                f"Abhi aapke resume analysis mein iska current level "
                f"**{current_level}** hai, jabki **{role_title}** role "
                f"ke liye target level **{required_level}** hai. "
                f"Aap apne personalized roadmap mein is skill ko "
                f"priority dekar improve kar sakte ho."
            )

        return (
            f"Abhi aapke **{role_title}** analysis mein koi major "
            f"skill gap detect nahi hua hai. Aap apni existing "
            f"skills ko strong karne aur practical projects banane "
            f"par focus kar sakte ho."
        )

    # ---------------------------------------------------------------
    # Alignment / role match
    # ---------------------------------------------------------------

    if (
        "match" in question
        or "alignment" in question
        or "role" in question
        or "fit" in question
        or "kitna match" in question
        or "kaisa match" in question
    ):
        if isinstance(
            alignment_value,
            (int, float),
        ):
            return (
                f"Aapke current resume evidence ke basis par "
                f"**{role_title}** role ke saath approximately "
                f"**{alignment_value}% alignment** hai. "
                f"Ye ek evidence-based role alignment estimate hai, "
                f"hiring prediction nahi. "
                f"Missing aur partial skills par kaam karke "
                f"aap apni profile ko aur strengthen kar sakte ho."
            )

        return (
            f"Aapka selected role **{role_title}** hai. "
            f"Matching aur Alignment analysis ke basis par "
            f"aap dekh sakte ho ki kaunsi skills already available "
            f"hain aur kin skills par aur focus karna hai."
        )

    # ---------------------------------------------------------------
    # Roadmap
    # ---------------------------------------------------------------

    if (
        "roadmap" in question
        or "learn" in question
        or "seekh" in question
        or "week" in question
        or "kya karu" in question
        or "kaise improve" in question
    ):
        if weeks:
            first_week = weeks[0]

            if isinstance(first_week, dict):
                week_title = get_first_value(
                    first_week,
                    [
                        "title",
                        "name",
                        "skill",
                    ],
                    "pehla learning module",
                )

                week_number = get_first_value(
                    first_week,
                    [
                        "week",
                        "weekNumber",
                        "number",
                    ],
                    None,
                )
            else:
                week_title = str(first_week)
                week_number = None

            if week_number:
                return (
                    f"Aapke roadmap ka **Week {week_number}** "
                    f"**{week_title}** par focus karta hai. "
                    f"Pehle is module ko complete karo, phir next "
                    f"module par move karo. Is tarah aap step-by-step "
                    f"apne skill gaps cover kar sakte ho."
                )

            return (
                f"Aapke roadmap ka starting focus "
                f"**{week_title}** hai. "
                f"Pehle is module ko complete karo aur phir "
                f"next learning module par move karo. "
                f"Roadmap ka purpose aapke important skill gaps "
                f"ko step-by-step improve karna hai."
            )

        return (
            f"Aapke **{role_title}** roadmap mein priority "
            f"skill gaps ko improve karna hai. "
            f"Modules ko step-by-step complete karo aur "
            f"progress tracker se apni learning track karo."
        )

    # ---------------------------------------------------------------
    # Project
    # ---------------------------------------------------------------

    if (
        "project" in question
        or "portfolio" in question
        or "project suggest" in question
        or "project batao" in question
    ):
        if project_title:
            if project_description:
                return (
                    f"Aapke liye recommended project "
                    f"**{project_title}** hai. "
                    f"Is project ka focus {project_description} "
                    f"par hai. "
                    f"Ye project aapko apni current skill gaps ko "
                    f"practically demonstrate karne mein help karega."
                )

            return (
                f"Aapke liye recommended project "
                f"**{project_title}** hai. "
                f"Is project ko build karte waqt apni missing aur "
                f"partial skills ko practically use karne par focus karo."
            )

        return (
            f"**{role_title}** ke liye aisa project choose karo "
            f"jo aapki missing ya developing skills ko practically "
            f"demonstrate kare. Aapke CareerPilot Projects section "
            f"mein recommended project bhi check kar sakte ho."
        )

    # ---------------------------------------------------------------
    # Skills
    # ---------------------------------------------------------------

    if (
        "skill" in question
        or "skills" in question
        or "meri skills" in question
        or "mere skills" in question
    ):
        resume = context.get("resume") or {}

        resume_skills = resume.get("skills") or []

        if resume_skills:
            skill_names = []

            for item in resume_skills[:6]:
                if isinstance(item, dict):
                    skill_name = get_first_value(
                        item,
                        [
                            "skill",
                            "name",
                        ],
                        None,
                    )

                    if skill_name:
                        skill_names.append(
                            str(skill_name)
                        )
                elif isinstance(item, str):
                    skill_names.append(item)

            if skill_names:
                skills_text = ", ".join(
                    skill_names
                )

                return (
                    f"Resume analysis ke basis par aapki detected "
                    f"skills mein **{skills_text}** shamil hain. "
                    f"CareerPilot in skills ko selected role ki "
                    f"requirements ke saath compare karta hai."
                )

        return (
            "Abhi mujhe resume se detected skills ka detailed "
            "context nahi mila hai. Resume analysis complete hone "
            "ke baad main aapki skills explain kar sakta hoon."
        )

    # ---------------------------------------------------------------
    # Help
    # ---------------------------------------------------------------

    if (
        "help" in question
        or "kya pooch" in question
        or "kya puch" in question
        or "what can" in question
        or "tum kya" in question
    ):
        return (
            "Aap mujhse Hinglish mein kuch bhi career-related "
            "pooch sakte ho, jaise:\n\n"
            "• Meri sabse important skill gap kya hai?\n"
            "• Mera selected role kaisa match karta hai?\n"
            "• Mujhe apna roadmap samjhao.\n"
            "• Mujhe ek project suggest karo.\n"
            "• Meri skills kaun si detect hui hain?"
        )

    # ---------------------------------------------------------------
    # Default response
    # ---------------------------------------------------------------

    return (
        f"Main aapke **{role_title}** career analysis ko "
        f"samajhne mein help kar sakta hoon. "
        f"Aap mujhse skill gaps, role alignment, roadmap, "
        f"detected skills ya project recommendations ke baare "
        f"mein Hinglish mein pooch sakte ho."
    )


@app.post("/api/chat")
def chat(request: ChatRequest):
    if not request.message.strip():
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty",
        )

    response = generate_chat_response(
        request.message,
        request.context,
    )

    return {
        "status": "success",
        "message": response,
    }


# -------------------------------------------------------------------
# Existing API routes
# -------------------------------------------------------------------

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