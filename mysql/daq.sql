CREATE SCHEMA `daq` DEFAULT CHARACTER SET utf8mb4 ;

USE daq;

CREATE TABLE `daq`.`uoutrd` (
  `uoutrd_id` INT NOT NULL,
  `value` FLOAT NOT NULL,
  PRIMARY KEY (`uoutrd_id`));

SELECT * FROM uoutrd;

INSERT INTO uoutrd VALUES
(1, 1.1),
(2, 1.2),
(3, 1.3),
(4, 1.4);

INSERT INTO uoutrd VALUES
(3, 1.3);

UPDATE uoutrd 
SET value = 0
WHERE uoutrd_id = 2;

SELECT @@autocommit;

SET autocommit = OFF;
-- ON, OFF

DELETE FROM uoutrd 
WHERE uoutrd_id = 3;

DELETE FROM uoutrd
WHERE uoutrd_id BETWEEN 1 AND 4;

ROLLBACK;

TRUNCATE TABLE uoutrd; -- ROLLBACK not work in thi mode