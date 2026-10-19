# WebShield - Phishing Risk Scanner

WebShield is a web application for assessing potentially suspicious URLs. It applies transparent, rule-based checks to a submitted URL and returns a risk score with explanations of the signals it found.

**Try WebShield:** [https://webshield-uph8.onrender.com](https://webshield-uph8.onrender.com)

> **Important:** WebShield is an educational risk-assessment tool, not a definitive phishing or malware detector. Its heuristic checks may produce false positives and false negatives. A low-risk result does not guarantee that a URL is safe; use other security controls and judgment before opening links or sharing sensitive information.

## Key features

- Scan URLs through a browser-based interface or JSON API.
- Receive a risk score from 0 to 100 and a `LOW`, `MEDIUM`, or `HIGH` classification.
- Review the indicators that contributed to a result, including suspicious domain or path terms, missing HTTPS, IP-based hosts, long URLs, multiple hyphens, and query strings.
- Check service health through a dedicated endpoint.
- Deploy with the included Render Blueprint configuration.

## How it works

WebShield analyzes URL text and structure using weighted heuristics. The application does not visit the destination page, run a trained machine-learning model, or query a live threat-intelligence service.

| Score | Risk level |
| --- | --- |
| 0-39 | LOW |
| 40-69 | MEDIUM |
| 70-100 | HIGH |

These categories are assessments from the application's rules, not a guarantee that a site is safe or malicious.

## Technology

- **Backend:** Python, Flask, Gunicorn
- **Frontend:** HTML, CSS, JavaScript
- **Deployment:** Render Blueprint

## Run locally

**Prerequisite:** Python 3.8 or newer.

```bash
git clone https://github.com/AdityaMane231105/WebShield-Cybersecurity-Scanner.git
cd WebShield-Cybersecurity-Scanner/webshield_project
python -m venv .venv
```

Activate the virtual environment, install the dependencies, and start the app:

**Windows PowerShell**

```powershell
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python app.py
```

**macOS/Linux**

```bash
source .venv/bin/activate
python -m pip install -r requirements.txt
python app.py
```

Open [http://127.0.0.1:5000](http://127.0.0.1:5000). The built-in Flask server is for local development; the Render configuration runs the application with Gunicorn.

## API reference

### `POST /api/scan`

Submit a URL as JSON:

```json
{
  "url": "https://example.com"
}
```

Example against the deployed application:

```bash
curl -X POST https://webshield-uph8.onrender.com/api/scan \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

A successful response includes `success`, the normalized `url`, `result`, numeric `score`, `reasons`, `scan_time_ms`, and a timestamp. A request without a URL returns HTTP 400.

### Other endpoints

| Endpoint | Method | Description |
| --- | --- | --- |
| `/` | GET, POST | Web scanner interface |
| `/health` | GET | Health status and timestamp |
| `/stats` | GET | Static demo statistics; values are placeholders, not live usage metrics |

## Deployment

The root `render.yaml` configures a Render web service with `webshield_project` as its root directory. Render installs `requirements.txt`, starts the app with Gunicorn, and uses `/health` for health checks. To deploy, create a Render Blueprint connected to this repository.

## Project objective

WebShield aims to make basic URL risk analysis accessible and understandable. By showing the indicators behind a score, the project can help users learn to recognize common suspicious URL patterns and make more informed decisions online.

## Repository structure

```text
webshield_project/
  app.py                 Flask application and URL analysis rules
  requirements.txt       Python dependencies
  templates/             HTML templates
  static/                CSS, JavaScript, and assets
  README.md              Application documentation
render.yaml              Render deployment configuration
```

## Contributing

Contributions and issue reports are welcome. Describe the change clearly and include relevant examples when reporting scanner behavior. Do not post credentials, private data, or sensitive URLs in issues.