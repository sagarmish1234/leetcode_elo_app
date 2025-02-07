package com.leetcodeelo.app.entity;

import com.leetcodeelo.app.service.Status;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table
@Getter
@Setter
public class Problem {

    @Id
    private Long id;

    private String title;

    private String titleSlug;

    private Float rating;

    @Enumerated(EnumType.STRING)
    private Status status;

}
