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
    }
}
