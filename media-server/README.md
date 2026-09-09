# Basic SRS media server

Standalone RTMP-to-HLS server for testing livestream input before integrating with the Spring backend.

## Start

```powershell
docker compose up -d
docker compose logs -f srs
```

Endpoints:

- RTMP ingest: `rtmp://localhost:1935/live`
- HLS playback: `http://localhost:8080/hls/live/<stream-name>.m3u8`

## Publish a test stream

Install FFmpeg and make sure it is on `PATH`:

```powershell
.\scripts\publish-test.ps1
```

The default stream is named `test`. Play it with VLC or another HLS-capable player:

```text
http://localhost:8080/hls/live/test.m3u8
```

## OBS settings

- Service: Custom
- Server: `rtmp://localhost:1935/live`
- Stream key: `test`
- Video codec: H.264
- Audio codec: AAC
- Keyframe interval: 6 seconds

## Stop

```powershell
docker compose down
```

This basic version does not validate stream keys or call the Spring backend. Those belong to the integration phase.
