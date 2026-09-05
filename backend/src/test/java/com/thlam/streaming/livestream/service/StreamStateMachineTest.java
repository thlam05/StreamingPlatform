package com.thlam.streaming.livestream.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.thlam.streaming.livestream.entity.StreamStatus;
import org.junit.jupiter.api.Test;

class StreamStateMachineTest {

    private final StreamStateMachine stateMachine = new StreamStateMachine();

    @Test
    void startsScheduledStreamOnlyFromBroadcastEvent() {
        StreamStateMachine.Transition transition = stateMachine.transition(
                StreamStatus.SCHEDULED, "broadcast_started");

        assertThat(transition.nextStatus()).isEqualTo(StreamStatus.LIVE);
        assertThat(transition.duplicate()).isFalse();
    }

    @Test
    void rejectsTerminalStreamRestart() {
        assertThatThrownBy(() -> stateMachine.transition(StreamStatus.ENDED, "broadcast_started"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("not allowed");
    }

    @Test
    void treatsRepeatedStopAsIdempotent() {
        StreamStateMachine.Transition transition = stateMachine.transition(
                StreamStatus.ENDED, "broadcast_stopped");

        assertThat(transition.nextStatus()).isEqualTo(StreamStatus.ENDED);
        assertThat(transition.duplicate()).isTrue();
    }
}
