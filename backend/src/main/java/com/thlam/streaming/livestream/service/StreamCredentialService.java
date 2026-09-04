package com.thlam.streaming.livestream.service;

import com.thlam.streaming.common.exception.InvalidRequestException;
import com.thlam.streaming.livestream.entity.StreamIngestConfig;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.HexFormat;
import java.util.UUID;
import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StreamCredentialService {

    private static final int KEY_SIZE_BYTES = 32;
    private static final int GCM_TAG_LENGTH_BITS = 128;
    private static final int IV_LENGTH_BYTES = 12;
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final StreamCredentialProperties properties;
    private final IngestProperties ingestProperties;

    public GeneratedCredentials generate(UUID streamId) {
        String rtmpUrl = requireProperty(ingestProperties.getRtmpUrl(), "INGEST_RTMP_URL");
        byte[] keyBytes = new byte[KEY_SIZE_BYTES];
        SECURE_RANDOM.nextBytes(keyBytes);
        String plaintextKey = Base64.getUrlEncoder().withoutPadding().encodeToString(keyBytes);
        return new GeneratedCredentials(
                streamId,
                rtmpUrl,
                encrypt(plaintextKey),
                fingerprint(plaintextKey),
                plaintextKey.substring(plaintextKey.length() - 4),
                plaintextKey);
    }

    public boolean matches(String plaintextKey, StreamIngestConfig config) {
        if (plaintextKey == null || plaintextKey.isBlank()) {
            return false;
        }
        return MessageDigest.isEqual(
                fingerprint(plaintextKey).getBytes(StandardCharsets.US_ASCII),
                config.getStreamKeyFingerprint().getBytes(StandardCharsets.US_ASCII));
    }

    private byte[] encrypt(String plaintextKey) {
        try {
            byte[] iv = new byte[IV_LENGTH_BYTES];
            SECURE_RANDOM.nextBytes(iv);
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            cipher.init(Cipher.ENCRYPT_MODE, encryptionKey(), new GCMParameterSpec(GCM_TAG_LENGTH_BITS, iv));
            byte[] encrypted = cipher.doFinal(plaintextKey.getBytes(StandardCharsets.UTF_8));
            byte[] result = new byte[iv.length + encrypted.length];
            System.arraycopy(iv, 0, result, 0, iv.length);
            System.arraycopy(encrypted, 0, result, iv.length, encrypted.length);
            return result;
        } catch (GeneralSecurityException exception) {
            throw new IllegalStateException("Unable to encrypt stream credentials", exception);
        }
    }

    private SecretKeySpec encryptionKey() {
        String encodedKey = requireProperty(
                properties.getCredentialEncryptionKey(), "STREAM_CREDENTIAL_ENCRYPTION_KEY");
        final byte[] key;
        try {
            key = Base64.getDecoder().decode(encodedKey);
        } catch (IllegalArgumentException exception) {
            throw new InvalidRequestException("STREAM_CREDENTIAL_ENCRYPTION_KEY must be base64 encoded");
        }
        if (key.length != KEY_SIZE_BYTES) {
            throw new InvalidRequestException("STREAM_CREDENTIAL_ENCRYPTION_KEY must decode to 32 bytes");
        }
        return new SecretKeySpec(key, "AES");
    }

    private String fingerprint(String plaintextKey) {
        try {
            return HexFormat.of().formatHex(
                    MessageDigest.getInstance("SHA-256")
                            .digest(plaintextKey.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is unavailable", exception);
        }
    }

    private String requireProperty(String value, String name) {
        if (value == null || value.isBlank()) {
            throw new InvalidRequestException(name + " is not configured");
        }
        return value;
    }

    public record GeneratedCredentials(
            UUID streamId,
            String rtmpUrl,
            byte[] encryptedKey,
            String fingerprint,
            String keySuffix,
            String plaintextKey) {
    }
}
