package com.thlam.streaming.livestream.service;

import static org.assertj.core.api.Assertions.assertThat;

import com.thlam.streaming.livestream.entity.StreamIngestConfig;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class StreamCredentialServiceTest {

    @Test
    void generatedKeyMatchesFingerprintButIsNotStoredAsPlaintext() {
        StreamCredentialProperties credentialProperties = new StreamCredentialProperties();
        credentialProperties.setCredentialEncryptionKey("MDEyMzQ1Njc4OWFiY2RlZjAxMjM0NTY3ODlhYmNkZWY=");
        IngestProperties ingestProperties = new IngestProperties();
        ingestProperties.setRtmpUrl("rtmps://localhost/live");
        StreamCredentialService service = new StreamCredentialService(credentialProperties, ingestProperties);

        StreamCredentialService.GeneratedCredentials generated = service.generate(UUID.randomUUID());
        StreamIngestConfig config = new StreamIngestConfig(
                UUID.randomUUID(),
                generated.streamId(),
                generated.rtmpUrl(),
                generated.encryptedKey(),
                generated.fingerprint(),
                generated.keySuffix());

        assertThat(service.matches(generated.plaintextKey(), config)).isTrue();
        assertThat(service.matches("invalid-key", config)).isFalse();
        assertThat(new String(generated.encryptedKey())).doesNotContain(generated.plaintextKey());
        assertThat(generated.playbackUrl())
                .isEqualTo("http://localhost:8081/hls/live/" + generated.plaintextKey() + ".m3u8");
    }

    @Test
    void variantPlaybackUrlsUseTheSourcePlaylistName() {
        PlaybackUrlService service = new PlaybackUrlService();

        assertThat(service.variantUrl(
                "http://localhost:8081/hls/live/key.m3u8", PlaybackUrlService.QUALITY_720P))
                .isEqualTo("http://localhost:8081/hls/live/key_720p.m3u8");
        assertThat(service.variantUrl(
                "http://localhost:8081/hls/live/key.m3u8", PlaybackUrlService.QUALITY_360P))
                .isEqualTo("http://localhost:8081/hls/live/key_360p.m3u8");
    }
}
