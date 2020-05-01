-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table 'editor'
-- 
-- ---

DROP TABLE IF EXISTS `editor`;
    
CREATE TABLE `editor` (
  `editor_id` INTEGER(11) NOT NULL AUTO_INCREMENT,
  `editor_name` VARCHAR(20) NOT NULL,
  `editor_account` VARCHAR(50) NOT NULL,
  `editor_password` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`editor_id`)
);

-- ---
-- Table 'answer'
-- 
-- ---

DROP TABLE IF EXISTS `answer`;
    
CREATE TABLE `answer` (
  `answer_id` INTEGER(11) NOT NULL AUTO_INCREMENT,
  `survey_id` INTEGER(11) NOT NULL,
  `ques_id` INTEGER(11) NOT NULL,
  `answer_content` VARCHAR(255) NOT NULL,
  `subject_id_subject` INTEGER(11) NOT NULL,
  PRIMARY KEY (`answer_id`)
);

-- ---
-- Table 'template'
-- 
-- ---

DROP TABLE IF EXISTS `template`;
    
CREATE TABLE `template` (
  `template_id` INTEGER(11) NOT NULL AUTO_INCREMENT,
  `survey_id_survey` INTEGER(11) NOT NULL,
  PRIMARY KEY (`template_id`)
);

-- ---
-- Table 'survey'
-- 
-- ---

DROP TABLE IF EXISTS `survey`;
    
CREATE TABLE `survey` (
  `survey_id` INTEGER(11) NOT NULL AUTO_INCREMENT,
  `editor_id_editor` INTEGER(11) NOT NULL,
  `survey_name` VARCHAR(100) NOT NULL,
  `survey_description` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`survey_id`)
);

-- ---
-- Table 'question'
-- 
-- ---

DROP TABLE IF EXISTS `question`;
    
CREATE TABLE `question` (
  `ques_id` INTEGER(11) NOT NULL AUTO_INCREMENT,
  `survey_id_survey` INTEGER(11) NOT NULL,
  `ques_div` VARCHAR(10) NOT NULL,
  `ques_type` VARCHAR(11) NOT NULL,
  `ques_content` VARCHAR(255) NOT NULL,
  `ques_required` VARCHAR(10) NOT NULL,
  `para_div_paragraph` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`ques_id`)
);

-- ---
-- Table 'option'
-- 
-- ---

DROP TABLE IF EXISTS `option`;
    
CREATE TABLE `option` (
  `option_id` INTEGER(11) NOT NULL AUTO_INCREMENT,
  `survey_id_survey` INTEGER(11) NOT NULL,
  `option_content` VARCHAR(150) NOT NULL,
  `ques_div_question` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`option_id`)
);

-- ---
-- Table 'subject'
-- 
-- ---

DROP TABLE IF EXISTS `subject`;
    
CREATE TABLE `subject` (
  `subject_id` INTEGER(11) NOT NULL AUTO_INCREMENT,
  `subject_name` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`subject_id`)
);

-- ---
-- Table 'paragraph'
-- 
-- ---

DROP TABLE IF EXISTS `paragraph`;
    
CREATE TABLE `paragraph` (
  `para_id` INTEGER(11) NOT NULL AUTO_INCREMENT,
  `survey_id_survey` INTEGER(11) NOT NULL,
  `para_div` VARCHAR(10) NOT NULL,
  `para_name` VARCHAR(100) NOT NULL,
  `para_description` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`para_id`)
);

-- ---
-- Table 'linear'
-- 
-- ---

DROP TABLE IF EXISTS `linear`;
    
CREATE TABLE `linear` (
  `linear_id` INTEGER(11) NOT NULL AUTO_INCREMENT,
  `survey_id_survey` INTEGER(11) NOT NULL,
  `start_number` VARCHAR(5) NOT NULL,
  `end_number` VARCHAR(5) NOT NULL,
  `start_content` VARCHAR(20) NOT NULL,
  `end_content` VARCHAR(20) NOT NULL,
  `ques_div_question` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`linear_id`)
);

-- ---
-- Foreign Keys 
-- ---

ALTER TABLE `answer` ADD FOREIGN KEY (subject_id_subject) REFERENCES `subject` (`subject_id`);
ALTER TABLE `template` ADD FOREIGN KEY (survey_id_survey) REFERENCES `survey` (`survey_id`);
ALTER TABLE `survey` ADD FOREIGN KEY (editor_id_editor) REFERENCES `editor` (`editor_id`);
ALTER TABLE `question` ADD FOREIGN KEY (survey_id_survey) REFERENCES `survey` (`survey_id`);
ALTER TABLE `option` ADD FOREIGN KEY (survey_id_survey) REFERENCES `survey` (`survey_id`);
ALTER TABLE `paragraph` ADD FOREIGN KEY (survey_id_survey) REFERENCES `survey` (`survey_id`);
ALTER TABLE `linear` ADD FOREIGN KEY (survey_id_survey) REFERENCES `survey` (`survey_id`);

-- ---
-- Table Properties
-- ---

-- ALTER TABLE `editor` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `answer` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `template` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `survey` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `question` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `option` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `subject` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `paragraph` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `linear` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO `editor` (`editor_id`,`editor_name`,`editor_account`,`editor_password`) VALUES
-- ('','','','');
-- INSERT INTO `answer` (`answer_id`,`survey_id`,`ques_id`,`answer_content`,`subject_id_subject`) VALUES
-- ('','','','','');
-- INSERT INTO `template` (`template_id`,`survey_id_survey`) VALUES
-- ('','');
-- INSERT INTO `survey` (`survey_id`,`editor_id_editor`,`survey_name`,`survey_description`) VALUES
-- ('','','','');
-- INSERT INTO `question` (`ques_id`,`survey_id_survey`,`ques_div`,`ques_type`,`ques_content`,`ques_required`,`para_div_paragraph`) VALUES
-- ('','','','','','','');
-- INSERT INTO `option` (`option_id`,`survey_id_survey`,`option_content`,`ques_div_question`) VALUES
-- ('','','','');
-- INSERT INTO `subject` (`subject_id`,`subject_name`) VALUES
-- ('','');
-- INSERT INTO `paragraph` (`para_id`,`survey_id_survey`,`para_div`,`para_name`,`para_description`) VALUES
-- ('','','','','');
-- INSERT INTO `linear` (`linear_id`,`survey_id_survey`,`start_number`,`end_number`,`start_content`,`end_content`,`ques_div_question`) VALUES
-- ('','','','','','','');