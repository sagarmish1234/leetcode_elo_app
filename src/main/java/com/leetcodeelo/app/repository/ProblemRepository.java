package com.leetcodeelo.app.repository;

import com.leetcodeelo.app.entity.Problem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Set;

public interface ProblemRepository extends JpaRepository<Problem, Long> {

    @Query(value = "SELECT id FROM problem", nativeQuery = true)
    Set<Long> findAllIdsNative();
}
