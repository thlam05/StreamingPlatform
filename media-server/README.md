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

The default `test` stream is transcoded into two additional HLS renditions:

- 720p: `http://localhost:8080/hls/live/<stream-name>_720p.m3u8`
- 360p: `http://localhost:8080/hls/live/<stream-name>_360p.m3u8`

## Publish a test stream

Install FFmpeg and make sure it is on `PATH`:

```powershell
.\scripts\publish-test.ps1
```

The default stream is named `test`. Play it with VLC or another HLS-capable player:

```text
http://localhost:8080/hls/live/test.m3u8
```

Transcoded playback URLs:

```text
http://localhost:8080/hls/live/test_720p.m3u8
http://localhost:8080/hls/live/test_360p.m3u8
```

The transcoding rule currently targets only `live/test`, which prevents the
generated streams from being transcoded again. If you use another stream name,
update the `transcode live/test` rule in `config/srs.conf`.

SRS starts FFmpeg from the path bundled in the SRS container. Verify it with:

```powershell
docker compose exec srs /usr/local/srs/objs/ffmpeg/bin/ffmpeg -version
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
