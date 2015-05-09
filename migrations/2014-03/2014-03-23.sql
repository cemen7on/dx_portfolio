CREATE DATABASE DxPortfolio;

USE DxPortfolio;

CREATE TABLE Videos(
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(500) NOT NULL,
  description TEXT NULL DEFAULT NULL,
  smallThumb INT(10) UNSIGNED NULL DEFAULT NULL,
  bigThumb INT(10) UNSIGNED NULL DEFAULT NULL,
  ytId VARCHAR(50) NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE PicturesType(
  id SMALLINT(2) UNSIGNED NOT NULL AUTO_INCREMENT,
  caption VARCHAR(255) NOT NULL,
  PRIMARY KEY(id)
);

INSERT INTO PicturesType(id, caption) VALUES
  (1, '2D Pictures'),
  (2, '3D Art');

CREATE TABLE Pictures(
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  typeId SMALLINT(2) UNSIGNED NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT NULL DEFAULT NULL,
  smallThumb INT(10) UNSIGNED NULL DEFAULT NULL,
  bigThumb INT(10) UNSIGNED NULL DEFAULT NULL,
  src INT(10) UNSIGNED NULL DEFAULT NULL,
  INDEX ixPicturesTypeId(typeId),
  CONSTRAINT ctPicturesTypeId FOREIGN KEY fkPicturesTypeId(typeId) REFERENCES PicturesType(id) ON UPDATE CASCADE ON DELETE CASCADE,
  PRIMARY KEY(id)
);

CREATE TABLE Images(
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  width SMALLINT(4) NOT NULL,
  height SMALLINT(4) NOT NULL,
  PRIMARY KEY(id)
);