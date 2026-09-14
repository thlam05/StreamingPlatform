# Basic SRS media server

RTMP-to-HLS server with an internal callback gateway for synchronizing publish
state with the Spring backend.

## Start

```powershell
docker compose up -d
docker compose logs -f srs
```

Endpoints:

- RTMP ingest: `rtmp://localhost:1935/live`
- HLS playback: `http://localhost:8081/hls/live/<stream-name>.m3u8`
- SRS callback gateway: `http://localhost:8082/srs/hooks` (internal use)

Set `INGEST_CALLBACK_SECRET` in the environment shared with the backend before
starting the stack. The gateway adds that secret to SRS callbacks and proxies
them to `/api/v1/internal/srs/hooks`. SRS control API listens on port `1985`
inside the Docker network and is not published to the host.

The default `test` stream is transcoded into two additional HLS renditions:

- 720p: `http://localhost:8081/hls/live/<stream-name>_720p.m3u8`
- 360p: `http://localhost:8081/hls/live/<stream-name>_360p.m3u8`

## Publish a test stream

Install FFmpeg and make sure it is on `PATH`:

```powershell
.\scripts\publish-test.ps1
```

The default stream is named `test`. Play it with VLC or another HLS-capable player:

```text
http://localhost:8081/hls/live/test.m3u8
```

Transcoded playback URLs:

```text
http://localhost:8081/hls/live/test_720p.m3u8
http://localhost:8081/hls/live/test_360p.m3u8
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

SRS validates every publish request through the internal gateway before accepting
it. The backend compares the token in the SRS `param` field with the active
stream credential, and only an accepted callback can make a stream live.
