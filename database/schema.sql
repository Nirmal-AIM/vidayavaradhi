-- Vidyavaradhi Database Schema
-- Database: u941670923_vidyavaradhi

-- Create users table
CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(20) NOT NULL PRIMARY KEY,
  `email` varchar(255) NOT NULL UNIQUE,
  `password_hash` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` enum('learner', 'trainer', 'policymaker') NOT NULL DEFAULT 'learner',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login` timestamp NULL DEFAULT NULL,
  `is_active` boolean NOT NULL DEFAULT TRUE,
  `email_verified` boolean NOT NULL DEFAULT FALSE,
  `profile_data` json NULL,
  INDEX `idx_email` (`email`),
  INDEX `idx_role` (`role`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create sessions table for better session management (optional)
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` varchar(255) NOT NULL PRIMARY KEY,
  `user_id` varchar(20) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ip_address` varchar(45) NULL,
  `user_agent` text NULL,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_expires_at` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create OTP verification table
CREATE TABLE IF NOT EXISTS `otp_verifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `email` varchar(255) NOT NULL,
  `otp_code` varchar(10) NOT NULL,
  `purpose` enum('registration', 'password_reset', 'email_verification') NOT NULL DEFAULT 'registration',
  `expires_at` timestamp NOT NULL,
  `is_used` boolean NOT NULL DEFAULT FALSE,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_email_otp` (`email`, `otp_code`),
  INDEX `idx_expires_at` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create user profiles table for additional user data
CREATE TABLE IF NOT EXISTS `user_profiles` (
  `user_id` varchar(20) NOT NULL PRIMARY KEY,
  `phone` varchar(20) NULL,
  `date_of_birth` date NULL,
  `gender` enum('male', 'female', 'other', 'prefer_not_to_say') NULL,
  `location` varchar(255) NULL,
  `bio` text NULL,
  `skills` json NULL,
  `interests` json NULL,
  `education_level` varchar(100) NULL,
  `work_experience` varchar(100) NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create login attempts tracking table
CREATE TABLE IF NOT EXISTS `login_attempts` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `ip` varchar(45) NOT NULL,
  `attempt_count` int(11) NOT NULL DEFAULT 1,
  `reset_time` timestamp NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_ip_reset` (`ip`, `reset_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create survey responses table
CREATE TABLE IF NOT EXISTS `survey_responses` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` varchar(20) NOT NULL,
  `survey_id` varchar(36) NOT NULL,
  `response_data` json NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_survey_id` (`survey_id`),
  INDEX `idx_user_survey` (`user_id`, `survey_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;