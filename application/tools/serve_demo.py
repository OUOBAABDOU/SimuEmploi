"""Serve only the public S0 demo and the read-only example catalogue."""

from pathlib import Path

from fastapi import HTTPException
from fastapi.responses import FileResponse, HTMLResponse
from simuemploi.app import create_app
from starlette.middleware.trustedhost import TrustedHostMiddleware
from starlette.staticfiles import StaticFiles

APPLICATION = Path(__file__).resolve().parents[1]
PUBLIC = APPLICATION / "demo" / "public"
REVIEW = APPLICATION / "docs" / "sprints" / "S0-cloture" / "maquettes"
VIDEO_ROOT = APPLICATION / "demo" / "video"
VIDEO_FILE = (
    APPLICATION.parent / "livrables" / "SimuEmploi_Demonstration_Commentee_v01.mp4"
)


def create_demo_app():
    app = create_app(environment="local")
    # Reuse the real catalogue, without exposing Swagger or OpenAPI through the tunnel.
    allowed = {
        "/health/live",
        "/api/v1/scenarios",
        "/api/v1/scenarios/{scenario_id}",
    }
    app.router.routes = [
        r for r in app.router.routes if getattr(r, "path", None) in allowed
    ]
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["localhost", "127.0.0.1", "testserver", "*.trycloudflare.com"],
    )

    @app.middleware("http")
    async def demo_headers(request, call_next):
        response = await call_next(request)
        response.headers["Cache-Control"] = "no-store"
        response.headers["Referrer-Policy"] = "no-referrer"
        response.headers["X-Frame-Options"] = "SAMEORIGIN"
        response.headers["Permissions-Policy"] = (
            "camera=(), microphone=(), geolocation=()"
        )
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; script-src 'self' 'unsafe-inline'; "
            "style-src 'self' 'unsafe-inline'; img-src 'self' data:; "
            "connect-src 'self'; frame-src 'self'; frame-ancestors 'self'; "
            "object-src 'none'; base-uri 'self'; form-action 'self'"
        )
        return response

    @app.get("/", include_in_schema=False)
    def portal():
        return FileResponse(PUBLIC / "index.html", media_type="text/html")

    @app.get("/demo.css", include_in_schema=False)
    def style():
        return FileResponse(PUBLIC / "demo.css", media_type="text/css")

    @app.get("/demo.js", include_in_schema=False)
    def script():
        return FileResponse(PUBLIC / "demo.js", media_type="text/javascript")

    @app.get("/video", include_in_schema=False)
    def video_page():
        return FileResponse(PUBLIC / "video.html", media_type="text/html")

    @app.api_route("/video-demo.mp4", methods=["GET", "HEAD"], include_in_schema=False)
    def video_file(download: bool = False):
        if not VIDEO_FILE.is_file():
            raise HTTPException(status_code=404)
        return FileResponse(
            VIDEO_FILE,
            media_type="video/mp4",
            filename=VIDEO_FILE.name,
            content_disposition_type="attachment" if download else "inline",
        )

    @app.get("/video-poster.png", include_in_schema=False)
    def video_poster():
        return FileResponse(VIDEO_ROOT / "poster.png", media_type="image/png")

    @app.get("/video-demo.vtt", include_in_schema=False)
    def video_subtitles():
        return FileResponse(VIDEO_ROOT / "sous-titres.vtt", media_type="text/vtt")

    @app.get("/video-chapters.json", include_in_schema=False)
    def video_chapters():
        return FileResponse(
            VIDEO_ROOT / "chapitres.json", media_type="application/json"
        )

    @app.get("/video.js", include_in_schema=False)
    def video_script():
        return FileResponse(PUBLIC / "video.js", media_type="text/javascript")

    @app.get("/maquettes/{filename}", include_in_schema=False)
    def mockup(filename: str):
        if filename not in {"candidat.html", "medias.html"}:
            raise HTTPException(status_code=404)
        source = (REVIEW / filename).read_text(encoding="utf-8")
        source = source.replace('href="../atelier.html"', 'href="/" target="_top"')
        source = source.replace("Retour à l’atelier", "Retour au guide des tests")
        return HTMLResponse(source)

    built = APPLICATION / "frontend" / "dist"
    if not (built / "index.html").is_file():
        raise RuntimeError(
            "Construire le frontend avec --base=/application/ avant le lancement."
        )
    app.mount(
        "/application", StaticFiles(directory=built, html=True), name="application"
    )
    return app
