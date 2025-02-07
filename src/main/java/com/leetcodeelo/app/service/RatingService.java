package com.leetcodeelo.app.service;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.leetcodeelo.app.dto.ProblemDto;
import com.leetcodeelo.app.entity.Problem;
import com.leetcodeelo.app.repository.ProblemRepository;
import org.apache.commons.io.IOUtils;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

@Service
public class RatingService {

    private final ProblemRepository problemRepository;

    public RatingService(ProblemRepository problemRepository) {
        this.problemRepository = problemRepository;
    }


    @Scheduled(fixedDelay = 60000)
    public void updateProblemList() throws IOException {
        System.out.println("Started");
        URL url = new URL("https://raw.githubusercontent.com/zerotrac/leetcode_problem_rating/refs/heads/main/data.json");

        ObjectMapper mapper = new ObjectMapper()
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        ProblemDto[] problemDtos = mapper.readValue(url, ProblemDto[].class);
        Set<Long> existingProblems = problemRepository.findAllIdsNative();

        List<Problem> problems = Arrays.stream(problemDtos)
                .filter(problemDto -> !existingProblems.contains(problemDto.id()))
                .map(problemDto -> {
                    Problem problem = new Problem();
                    problem.setId(problemDto.id());
                    problem.setRating(problemDto.rating());
                    problem.setTitle(problemDto.title());
                    problem.setTitleSlug(problemDto.titleSlug());
                    problem.setStatus(Status.PENDING);
                    return problem;
                }).toList();
        System.out.println("To be inserted:"+problems.size());
        problemRepository.saveAll(problems);
        System.out.println("Inserted successfully");
    }


}
