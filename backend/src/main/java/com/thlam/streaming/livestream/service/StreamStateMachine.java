package com.thlam.streaming.livestream.service;

import com.thlam.streaming.common.exception.InvalidRequestException;
import com.thlam.streaming.livestream.entity.StreamStatus;
import java.util.Locale;
import org.springframework.stereotype.Component;

@Component
public class StreamStateMachine {

    public Transition transition(StreamStatus current, String event) {
        String normalizedEvent = event == null ? "" : event.trim().toLowerCase(Locale.ROOT);
        return switch (current) {
            case SCHEDULED -> switch (normalizedEvent) {
                case "broadcast_started" -> new Transition(StreamStatus.LIVE, false);
                case "cancel_stream" -> new Transition(StreamStatus.CANCELLED, false);
                default -> invalid(current, normalizedEvent);
            };
            case LIVE -> switch (normalizedEvent) {
                case "broadcast_started" -> new Transition(StreamStatus.LIVE, true);
                case "broadcast_stopped", "disconnect_timeout", "credential_rotated" ->
                        new Transition(StreamStatus.ENDED, false);
                case "terminate_stream", "credential_revoked" ->
                        new Transition(StreamStatus.CANCELLED, false);
                default -> invalid(current, normalizedEvent);
            };
            case ENDED -> alreadyTerminal(StreamStatus.ENDED, normalizedEvent);
            case CANCELLED -> alreadyTerminal(StreamStatus.CANCELLED, normalizedEvent);
        };
    }

    private Transition alreadyTerminal(StreamStatus status, String event) {
        if ((status == StreamStatus.ENDED
                && (event.equals("broadcast_stopped") || event.equals("disconnect_timeout")
                || event.equals("credential_rotated")))
                || (status == StreamStatus.CANCELLED
                && (event.equals("terminate_stream") || event.equals("credential_revoked")))) {
            return new Transition(status, true);
        }
        return invalid(status, event);
    }

    private Transition invalid(StreamStatus status, String event) {
        throw new InvalidRequestException(
                "Event " + event + " is not allowed from stream status " + status.getCode());
    }

    public record Transition(StreamStatus nextStatus, boolean duplicate) {
    }
}
