"""Check the public demo boundary, not candidate validation."""

import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from tools.serve_demo import VIDEO_FILE, create_demo_app


@pytest.fixture
def client():
    return TestClient(create_demo_app())


def test_real_catalog_and_built_application(client):
    assert client.get("/health/live").json()["status"] == "ok"
    items = client.get("/api/v1/scenarios").json()["items"]
    assert len(items) == 3
    assert client.get(f"/api/v1/scenarios/{items[0]['id']}").status_code == 200
    assert client.get("/application/").status_code == 200
    assert "/application/assets/" in client.get("/application/").text


@pytest.mark.parametrize(
    "path",
    [
        "/docs",
        "/openapi.json",
        "/atelier.html",
        "/preuves-humaines.json",
        "/.env",
        "/.git/config",
        "/maquettes/atelier.html",
        "/maquettes/%2e%2e%2fatelier.html",
        "/application/../backend/pyproject.toml",
    ],
)
def test_internal_files_are_not_public(client, path):
    assert client.get(path).status_code == 404


def test_no_write_endpoint_and_no_capture(client):
    assert (
        client.post("/api/v1/scenarios", json={"answer": "fiction"}).status_code == 405
    )
    response = client.get("/")
    assert response.status_code == 200
    assert (
        response.headers["permissions-policy"]
        == "camera=(), microphone=(), geolocation=()"
    )
    assert response.headers["x-frame-options"] == "SAMEORIGIN"
    assert response.headers["cache-control"] == "no-store"
    assert "frame-ancestors 'self'" in response.headers["content-security-policy"]


def test_mockups_return_to_public_guide(client):
    for name in ["candidat.html", "medias.html"]:
        response = client.get(f"/maquettes/{name}")
        assert response.status_code == 200
        assert "../atelier.html" not in response.text
        assert 'href="/" target="_top"' in response.text


def test_tunnel_host_allowed_other_host_refused(client):
    assert (
        client.get("/", headers={"Host": "example.trycloudflare.com"}).status_code
        == 200
    )
    assert client.get("/", headers={"Host": "unrelated.example"}).status_code == 400


def test_video_player_and_streaming(client):
    assert client.get("/video").status_code == 200
    assert client.get("/video-poster.png").headers["content-type"] == "image/png"
    assert client.get("/video-demo.vtt").text.startswith("WEBVTT")
    head = client.head("/video-demo.mp4")
    assert head.status_code == 200
    assert head.content == b""
    assert int(head.headers["content-length"]) == VIDEO_FILE.stat().st_size
    chunk = client.get("/video-demo.mp4", headers={"Range": "bytes=0-1023"})
    assert chunk.status_code == 206
    assert len(chunk.content) == 1024
    assert chunk.headers["content-type"] == "video/mp4"
    downloaded = client.head("/video-demo.mp4?download=true")
    assert "attachment" in downloaded.headers["content-disposition"]
