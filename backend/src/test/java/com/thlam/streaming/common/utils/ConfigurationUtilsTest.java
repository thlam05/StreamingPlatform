package com.thlam.streaming.common.utils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

class ConfigurationUtilsTest {

    @Test
    void returnsConfiguredValue() {
        assertThat(ConfigurationUtils.requireProperty("configured", "TEST_PROPERTY"))
                .isEqualTo("configured");
    }

    @Test
    void rejectsMissingOrBlankValue() {
        assertThatThrownBy(() -> ConfigurationUtils.requireProperty(null, "TEST_PROPERTY"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("TEST_PROPERTY must be configured");
        assertThatThrownBy(() -> ConfigurationUtils.requireProperty("  ", "TEST_PROPERTY"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("TEST_PROPERTY must be configured");
    }
}
