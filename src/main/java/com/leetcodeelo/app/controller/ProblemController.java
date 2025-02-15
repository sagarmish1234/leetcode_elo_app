package com.leetcodeelo.app.controller;

import com.leetcodeelo.app.dto.ProblemDto;
import com.leetcodeelo.app.service.RatingService;
import com.leetcodeelo.app.service.Status;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/problems")
@CrossOrigin("*")
public class ProblemController {


    private final RatingService ratingService;

    public ProblemController(RatingService ratingService) {
        this.ratingService = ratingService;
    }


    @GetMapping
    public List<ProblemDto> getProblems() {
        return ratingService.getProblems();
    }


    @PutMapping("/{id}/status/{status}")
    public void updateProblemStatus(@PathVariable Long id, @PathVariable Status status) {
        ratingService.updateProblemStatus(id, status);
    }


}
