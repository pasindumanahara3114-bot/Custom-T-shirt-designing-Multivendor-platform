/**
 * PrinthubApplication - Main entry point for the PrintHub Backend.
 */
package com.printhub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
public class PrinthubApplication {

	public static void main(String[] args) {
		SpringApplication.run(PrinthubApplication.class, args);
	}

	@Bean
	public CommandLineRunner fixDatabase(JdbcTemplate jdbcTemplate) {
		return args -> {
			try {
				// Drop the stray column caused by previous ddl-auto runs
				jdbcTemplate.execute("ALTER TABLE users DROP COLUMN profile_complete");
				System.out.println("Dropped stray profile_complete column successfully.");
			} catch (Exception e) {
				System.out.println("Column profile_complete likely already dropped or doesn't exist.");
			}
		};
	}
}

