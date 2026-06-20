"""
generate_embeddings.py

One-time, offline data-preparation script. This is NOT a backend service —
run it manually, locally, whenever the NODES corpus below changes. It embeds
each node's description with a sentence-transformer model, projects the
embeddings into 2D with UMAP, and writes a static JSON file that gets
bundled into the React/TypeScript frontend for the embedding-space
visualization.

Requirements:
    pip install sentence-transformers umap-learn numpy

Output:
    ../src/data/embeddingSpace.json (relative to this script's location)
"""

import os
import json

import numpy as np
import umap
from sentence_transformers import SentenceTransformer


NODES = [
    {"id": "sklearn", "label": "Scikit-learn", "cluster": "ml", "type": "skill",
     "description": "Scikit-learn for training regression models that score floorplan design quality across multiple dimensions."},
    {"id": "numpy", "label": "NumPy", "cluster": "ml", "type": "skill",
     "description": "NumPy for numerical computation and array operations underlying machine learning pipelines."},
    {"id": "pandas", "label": "Pandas", "cluster": "ml", "type": "skill",
     "description": "Pandas for data manipulation, cleaning, and preprocessing structured datasets."},
    {"id": "regression", "label": "Regression Models", "cluster": "ml", "type": "skill",
     "description": "Regression models trained on floorplan datasets to predict spatial quality scores."},
    {"id": "dqi", "label": "Custom Scoring Systems", "cluster": "ml", "type": "skill",
     "description": "Designing custom weighted scoring indices that combine multiple quantitative dimensions into a single interpretable metric."},
    {"id": "groq", "label": "Groq API", "cluster": "ml", "type": "skill",
     "description": "Groq API for fast LLM inference, used to generate natural language design feedback."},
    {"id": "opencv", "label": "OpenCV", "cluster": "cv", "type": "skill",
     "description": "OpenCV for computer vision tasks including image processing and geometric feature extraction."},
    {"id": "svgparse", "label": "SVG Parsing", "cluster": "cv", "type": "skill",
     "description": "Parsing SVG floorplan files to extract room boundaries, walls, and structural elements."},
    {"id": "networkx", "label": "NetworkX", "cluster": "cv", "type": "skill",
     "description": "NetworkX for modeling floorplans as graphs to quantify spatial connectivity and circulation flow between rooms."},
    {"id": "spatial", "label": "Spatial Analysis", "cluster": "cv", "type": "skill",
     "description": "Spatial syntax analysis measuring circulation, adjacency, and zoning efficiency in architectural layouts."},
    {"id": "floorplan", "label": "Floorplan Feature Extraction", "cluster": "cv", "type": "skill",
     "description": "Extracting geometric and structural features from architectural floorplans for automated quality assessment."},
    {"id": "falcon512", "label": "Falcon-512 / FN-DSA", "cluster": "crypto", "type": "skill",
     "description": "Falcon-512 post-quantum digital signature scheme used to sign railway ticket authentication data."},
    {"id": "liboqs", "label": "liboqs", "cluster": "crypto", "type": "skill",
     "description": "liboqs library providing post-quantum cryptographic primitives resistant to quantum computer attacks."},
    {"id": "pqc", "label": "Post-Quantum Cryptography", "cluster": "crypto", "type": "skill",
     "description": "Post-quantum cryptography designing authentication systems resilient against both classical and quantum adversaries."},
    {"id": "datamatrix", "label": "DataMatrix Barcodes", "cluster": "crypto", "type": "skill",
     "description": "Encoding cryptographic signatures into DataMatrix barcodes for printed physical ticket verification."},
    {"id": "wireprotocol", "label": "Wire Protocol Design", "cluster": "crypto", "type": "skill",
     "description": "Designing a custom binary wire protocol to pack cryptographic signatures within barcode capacity constraints."},
    {"id": "hsm", "label": "HSM Simulation", "cluster": "crypto", "type": "skill",
     "description": "Simulating a Hardware Security Module to manage key generation and signing operations securely."},
    {"id": "ecdsa", "label": "ECDSA", "cluster": "crypto", "type": "skill",
     "description": "ECDSA elliptic curve digital signatures used for classical cryptographic authentication."},
    {"id": "fastapi", "label": "FastAPI", "cluster": "backend", "type": "skill",
     "description": "FastAPI for building high-performance Python microservices and REST APIs."},
    {"id": "microservices", "label": "Microservices", "cluster": "backend", "type": "skill",
     "description": "Designing independent microservices that communicate to form a complete distributed system."},
    {"id": "redis", "label": "Redis", "cluster": "backend", "type": "skill",
     "description": "Redis for real-time event metering and background worker coordination in distributed systems."},
    {"id": "postgresql", "label": "PostgreSQL", "cluster": "backend", "type": "skill",
     "description": "PostgreSQL relational database for persistent multi-tenant application data."},
    {"id": "s3", "label": "AWS S3", "cluster": "backend", "type": "skill",
     "description": "AWS S3 with presigned URLs for direct client-to-cloud file uploads bypassing server bandwidth limits."},
    {"id": "razorpay", "label": "Razorpay API", "cluster": "backend", "type": "skill",
     "description": "Razorpay payment API integration for automated invoice generation based on usage thresholds."},
    {"id": "jwt", "label": "JWT Auth", "cluster": "backend", "type": "skill",
     "description": "JWT-based authentication for secure multi-tenant access control."},
    {"id": "pytest", "label": "pytest", "cluster": "backend", "type": "skill",
     "description": "pytest for writing comprehensive unit tests covering cryptographic signing and verification logic."},
    {"id": "docker", "label": "Docker", "cluster": "backend", "type": "skill",
     "description": "Docker for containerizing applications and ensuring consistent deployment environments."},
    {"id": "kubernetes", "label": "Kubernetes", "cluster": "backend", "type": "skill",
     "description": "Kubernetes for orchestrating containerized services with automatic scaling and deployment."},
    {"id": "react", "label": "React", "cluster": "backend", "type": "skill",
     "description": "React with TypeScript for building responsive frontend interfaces with real-time data synchronization."},
    {"id": "spacy", "label": "spaCy", "cluster": "nlp", "type": "skill",
     "description": "spaCy for training custom named entity recognition models on domain-specific legal text."},
    {"id": "ner", "label": "Named Entity Recognition", "cluster": "nlp", "type": "skill",
     "description": "Named entity recognition extracting judges, petitioners, respondents, and case details from legal judgments."},
    {"id": "doccano", "label": "Doccano", "cluster": "nlp", "type": "skill",
     "description": "Doccano annotation tool used to produce gold-standard labeled training data for NLP models."},
    {"id": "pymupdf", "label": "PyMuPDF", "cluster": "nlp", "type": "skill",
     "description": "PyMuPDF for ingesting and cleaning raw PDF documents before text extraction."},
    {"id": "legalai", "label": "Legal NLP", "cluster": "nlp", "type": "skill",
     "description": "Applying natural language processing to the legal domain, where off-the-shelf models struggle with specialized vocabulary."},
    {"id": "finetuning", "label": "NER Fine-tuning", "cluster": "nlp", "type": "skill",
     "description": "Fine-tuning pretrained NER models on annotated legal datasets to improve domain-specific accuracy."},
    {"id": "archintel", "label": "ArchIntel", "cluster": "research", "type": "project",
     "description": "ArchIntel: an ML pipeline that evaluates architectural floorplan quality from SVG inputs using a custom Design Quality Index across spatial efficiency, circulation flow, room proportionality, natural light, and structural balance."},
    {"id": "railwaypq", "label": "Railway PQ-Auth", "cluster": "research", "type": "project",
     "description": "Railway PQ-Auth: a post-quantum cryptographic authentication system for printed Indian Railway tickets using Falcon-512 signatures encoded into DataMatrix barcodes."},
    {"id": "nexusstorage", "label": "Nexus Storage", "cluster": "research", "type": "project",
     "description": "Nexus Storage: a multi-tenant cloud storage platform with direct-to-S3 uploads, real-time usage metering, and automated billing."},
    {"id": "highcourtner", "label": "High Court NER", "cluster": "research", "type": "project",
     "description": "High Court NER: an NLP pipeline extracting legal entities from Indian High Court judgments, addressing the lack of labeled legal NLP datasets in India."},
    {"id": "ednataxonomy", "label": "eDNA Taxonomy System", "cluster": "research", "type": "project",
     "description": "An AI-driven eDNA taxonomy system using DNABERT and UMAP for unsupervised species clustering, built as a Smart India Hackathon 2025 finalist project."},
    {"id": "paperwriting", "label": "Research Paper Writing", "cluster": "research", "type": "skill",
     "description": "Writing and structuring academic research papers on spatial syntax graphs and post-quantum cryptographic systems."},
    {"id": "svnit", "label": "SVNIT Internship", "cluster": "research", "type": "skill",
     "description": "Research internship experience contributing to applied machine learning initiatives."},
]


def normalize_to_range(values, low=5.0, high=95.0):
    """Min-max normalize a 1D array of values to [low, high]."""
    vmin = values.min()
    vmax = values.max()
    span = vmax - vmin
    if span == 0:
        # all values identical — place everything at the midpoint
        return np.full_like(values, (low + high) / 2.0)
    return low + (values - vmin) / span * (high - low)


def main():
    print("Loading sentence-transformer model 'all-MiniLM-L6-v2' "
          "(first run downloads ~80MB, may take a moment)...")
    model = SentenceTransformer('all-MiniLM-L6-v2')
    print("Model loaded.")

    descriptions = [node["description"] for node in NODES]

    print(f"Encoding {len(descriptions)} node descriptions...")
    embeddings = model.encode(descriptions, show_progress_bar=True)

    # Clamp n_neighbors so UMAP doesn't error out on small node counts.
    n_neighbors = min(15, len(NODES) - 1)
    print(f"Running UMAP (n_neighbors={n_neighbors})...")
    reducer = umap.UMAP(
        n_neighbors=n_neighbors,
        min_dist=0.3,
        n_components=2,
        metric='cosine',
        random_state=42,
    )
    coords_2d = reducer.fit_transform(embeddings)

    # Normalize each axis independently to a 5-95 range (matches the
    # StarNode.x/y 0-100 convention used elsewhere in the frontend, with
    # 5 units of padding on each side so nodes don't render at the edges).
    x_norm = normalize_to_range(coords_2d[:, 0])
    y_norm = normalize_to_range(coords_2d[:, 1])

    output = []
    for i, node in enumerate(NODES):
        output.append({
            "id": node["id"],
            "label": node["label"],
            "cluster": node["cluster"],
            "type": node["type"],
            "x": round(float(x_norm[i]), 2),
            "y": round(float(y_norm[i]), 2),
            "embedding": embeddings[i].tolist(),
        })

    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.normpath(
        os.path.join(script_dir, "..", "src", "data", "embeddingSpace.json")
    )

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w") as f:
        json.dump(output, f, indent=2)

    size_kb = os.path.getsize(output_path) / 1024
    print("\nDone.")
    print(f"  Nodes processed: {len(output)}")
    print(f"  Output file:     {output_path}")
    print(f"  File size:       {size_kb:.1f} KB")


if __name__ == "__main__":
    main()