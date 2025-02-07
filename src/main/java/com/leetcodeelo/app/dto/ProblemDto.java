package com.leetcodeelo.app.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ProblemDto(
        @JsonProperty("ID") Long id,
        @JsonProperty("Title") String title,
        @JsonProperty("TitleSlug") String titleSlug,
        @JsonProperty("Rating") Float rating
) {
}
