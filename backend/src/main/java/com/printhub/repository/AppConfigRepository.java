package com.printhub.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.printhub.model.AppConfig;

@Repository
public interface AppConfigRepository extends JpaRepository<AppConfig, Long> {
}
