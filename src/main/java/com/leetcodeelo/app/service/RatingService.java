package com.leetcodeelo.app.service;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.leetcodeelo.app.dto.ProblemDto;
import com.leetcodeelo.app.entity.Problem;
import com.leetcodeelo.app.repository.ProblemRepository;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URL;
import java.util.*;

@Service
public class RatingService {

    private final ProblemRepository problemRepository;

    private final CacheManager cacheManager;

    public RatingService(ProblemRepository problemRepository, CacheManager cacheManager) {
        this.problemRepository = problemRepository;
        this.cacheManager = cacheManager;
    }


    @Scheduled(fixedDelay = 7 * 24 * 60 * 60 * 1000)
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
        System.out.println("To be inserted:" + problems.size());
        problemRepository.saveAll(problems);
        System.out.println("Inserted successfully");
    }

    @Cacheable("problems")
    public List<ProblemDto> getProblems() {
        return problemRepository.findAll().stream().map(problem -> {
            return new ProblemDto(problem.getId(), problem.getTitle(), problem.getTitleSlug(), problem.getRating(), problem.getStatus());
        }).sorted(Comparator.comparing(ProblemDto::rating)).toList();
    }

    public void updateProblemStatus(Long id, Status status) {
        Optional<Problem> problem = problemRepository.findById(id);
        if (problem.isEmpty())
            throw new RuntimeException("No problem found with the given id:" + id);
        problem.get().setStatus(status);
        problemRepository.save(problem.get());
        Cache problems = cacheManager.getCache("problems");
        if (problems != null)
            problems.clear();
    }


}
