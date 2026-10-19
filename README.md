# WebShield - URL Phishing Risk Scanner

WebShield is a Flask web application that evaluates URLs using transparent, rule-based indicators and returns a risk score with explanations of the signals found.

**Live application:** [webshield-uph8.onrender.com](https://webshield-uph8.onrender.com)

> **Important:** WebShield is an educational risk-assessment tool, not a definitive malware or phishing detector. Heuristic checks can produce false positives and false negatives. Do not use a result as the sole basis for deciding whether a link is safe.

## Features

- Browser-based URL scanning with a 0-100 risk score.
- `LOW`, `MEDIUM`, and `HIGH` risk classifications.
- Explanations for indicators such as suspicious terms, non-HTTPS URLs, IP-address hosts, long URLs, multiple hyphens, and complex query strings.
- JSON API for programmatic URL scanning.
- Health-check endpoint and Render Blueprint configuration.

## How the analysis works

The application applies weighted checks to the submitted URL. The score is capped at 100 and mapped to risk levels as follows:

| Score | Risk level |
| --- | --- |
| 0-39 | LOW |
| 40-69 | MEDIUM |
| 70-100 | HIGH |

The scanner examines URL structure and patterns; it does not fetch or inspect the destination page, use a trained machine-learning model, or consult a live threat-intelligence database. A low score does not guarantee that a URL is safe.

## Technology

- Python and Flask
- HTML, CSS, and JavaScript
- Gunicorn for production serving
- Render Blueprint for deployment

## Run locally

Requires Python 3.8 or newer.

```bash
git clone https://github.com/AdityaMane231105/WebShield-Cybersecurity-Scanner.git
cd WebShield-Cybersecurity-Scanner/webshield_project
python -m venv .venv
```

Activate the virtual environment, install dependencies, and start Flask:

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

Open [http://127.0.0.1:5000](http://127.0.0.1:5000) in a browser. Flask's development server is intended for local development; deployment uses Gunicorn as configured in `render.yaml`.

## API

### `POST /api/scan`

Request JSON:

```json
{
  "url": "https://example.com"
}
```

Example using the live deployment:

```bash
curl -X POST https://webshield-uph8.onrender.com/api/scan \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

A successful response includes `success`, the normalized `url`, `result`, numeric `score`, a list of `reasons`, `scan_time_ms`, and a timestamp. A missing URL returns HTTP 400 with an error message.

### Other endpoints

| Path | Method | Purpose |
| --- | --- | --- |
| `/` | GET, POST | Web scanner interface |
| `/health` | GET | Service health status |
| `/stats` | GET | Demo statistics endpoint; values are static placeholders |

## Deploy to Render

The repository includes `render.yaml`. Create a Render Blueprint connected to this repository; it builds from `webshield_project`, installs `requirements.txt`, serves the Flask app with Gunicorn, and checks `/health`.

## Repository layout

```text
webshield_project/
  app.py                 Flask routes and URL scoring logic
  requirements.txt       Python dependencies
  templates/             HTML templates
  static/                CSS, JavaScript, and static assets
  README.md              Application-specific documentation
render.yaml              Render Blueprint configuration
```

## Contributing

Issues and pull requests are welcome. For scanner changes, include a clear description of the behavior and, where practical, examples covering relevant URL patterns. Do not submit real credentials or sensitive URLs in issues.