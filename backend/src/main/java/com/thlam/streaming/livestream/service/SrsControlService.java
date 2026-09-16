package com.thlam.streaming.livestream.service;

import java.net.URI;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.util.UriUtils;

@Service
@RequiredArgsConstructor
public class SrsControlService {

    private static final Logger LOGGER = LoggerFactory.getLogger(SrsControlService.class);

    private final IngestProperties ingestProperties;

    public void kickPublisher(String clientId) {
        String controlUrl = ingestProperties.getSrsControlUrl();
        if (clientId == null || clientId.isBlank() || controlUrl == null || controlUrl.isBlank()) {
            return;
        }
        String endpoint = controlUrl.replaceAll("/+$", "") + "/api/v1/clients/"
                + UriUtils.encodePathSegment(clientId, java.nio.charset.StandardCharsets.UTF_8);
        try {
            RestClient restClient = RestClient.create();
            var request = restClient.delete().uri(URI.create(endpoint));
            if (ingestProperties.getSrsControlSecret() != null
                    && !ingestProperties.getSrsControlSecret().isBlank()) {
                request.header("X-SRS-Control-Secret", ingestProperties.getSrsControlSecret());
            }
            request.retrieve().toBodilessEntity();
        } catch (RestClientException | IllegalArgumentException exception) {
            // The database transition remains authoritative; SRS will be reconciled by its next callback.
            LOGGER.warn("Unable to kick SRS publisher client {}", clientId, exception);
        }
    }
}
