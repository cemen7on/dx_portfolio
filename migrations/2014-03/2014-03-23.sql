CREATE DATABASE DxPortfolio;

USE DxPortfolio;

CREATE TABLE Images(
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  width SMALLINT(4) NOT NULL,
  height SMALLINT(4) NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE Media(
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(500) NOT NULL,
  smallThumbId INT(10) UNSIGNED NULL DEFAULT NULL,
  bigThumbId INT(10) UNSIGNED NULL DEFAULT NULL,
  srcId INT(10) UNSIGNED NULL DEFAULT NULL,
  coverId INT(10) UNSIGNED NULL DEFAULT NULL,
  created TIMESTAMP NOT NULL DEFAULT 0,
  PRIMARY KEY(id)
);

CREATE TABLE Videos(
  mediaId INT(10) UNSIGNED NOT NULL,
  ytId VARCHAR(50) NOT NULL,
  CONSTRAINT Videos_ctMediaId FOREIGN KEY Videos_fkMediaId(mediaId) REFERENCES Media(id) ON UPDATE CASCADE ON DELETE CASCADE,
  PRIMARY KEY(mediaId)
);

CREATE TABLE PicturesType(
  id SMALLINT(2) UNSIGNED NOT NULL AUTO_INCREMENT,
  caption VARCHAR(255) NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE Pictures(
  mediaId INT(10) UNSIGNED NOT NULL,
  typeId SMALLINT(2) UNSIGNED NOT NULL,
  INDEX Pictures_ixTypeId(typeId),
  CONSTRAINT Pictures_ctTypeId FOREIGN KEY Pictures_fkTypeId(typeId) REFERENCES PicturesType(id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT Pictures_ctMediaId FOREIGN KEY Pictures_fkMediaId(mediaId) REFERENCES Media(id) ON UPDATE CASCADE ON DELETE CASCADE,
  PRIMARY KEY(mediaId)
);

CREATE TABLE Facade(
  data TEXT NULL DEFAULT NULL
);

INSERT INTO PicturesType(id, caption) VALUES
  (1, '2D Pictures'),
  (2, '3D Art');

-- TEST VALUES

INSERT INTO Images(id, name, width, height) VALUES
 (1, '1.jpg', 709, 1024),
 (2, '2.jpg', 1200, 702),
 (3, '3.jpg', 300, 210),
 (4, '4.jpg', 300, 210),
 (5, '5.jpg', 709, 1024),
 (6, '6.jpg', 1200, 702),
 (7, '7.jpg', 170, 702),
 (8, '8.jpg', 170, 1024),

 (9, '158.jpg', 300, 210),
 (10, '159.jpg', 1096, 796),
 (11, '160.jpg', 170, 796);


INSERT INTO Media(id, title, srcId, smallThumbId, bigThumbId, coverId, created) VALUES
  (1, 'Ninja', 1, 3, 5, 8, CURRENT_TIMESTAMP),
  (2, 'Knight', 2, 4, 7, 7, CURRENT_TIMESTAMP),
  (3, 'Woodcutter', null, 9, 10, 11, CURRENT_TIMESTAMP);

INSERT INTO Pictures(mediaId, typeId) VALUES
  (1, 1),
  (2, 1);

INSERT INTO Videos(mediaId, ytId) VALUES (3, 'CG5LiQv9Lkc');

INSERT INTO Facade(data) VALUES
  ('{"animations":[{"mediaId":"3","ytId":"CG5LiQv9Lkc","data":{"id":"3","title":"Woodcutter","smallThumbId":"9","bigThumbId":"10","srcId":null,"coverId":"11","created":"2015-07-22 10:20:18","src":[],"smallThumb":{"id":"9","name":"158.jpg","width":"300","height":"210","url":"http:\/\/local.dddimaxxx.com\/upload\/media\/smallThumbs\/158.jpg"},"bigThumb":{"id":"10","name":"159.jpg","width":"1096","height":"796","url":"http:\/\/local.dddimaxxx.com\/upload\/media\/bigThumbs\/159.jpg"},"cover":{"id":"11","name":"160.jpg","width":"170","height":"796","url":"http:\/\/local.dddimaxxx.com\/upload\/media\/covers\/160.jpg"}}}],"pictures2d":[{"mediaId":"2","typeId":"1","data":{"id":"2","title":"Knight","smallThumbId":"4","bigThumbId":"6","srcId":"2","coverId":"7","created":"2015-05-17 10:42:21","src":{"id":"2","name":"2.jpg","width":"1200","height":"702","url":"http:\/\/local.dddimaxxx.com\/upload\/media\/sources\/2.jpg"},"smallThumb":{"id":"4","name":"4.jpg","width":"300","height":"210","url":"http:\/\/local.dddimaxxx.com\/upload\/media\/smallThumbs\/4.jpg"},"bigThumb":{"id":"6","name":"6.jpg","width":"1200","height":"702","url":"http:\/\/local.dddimaxxx.com\/upload\/media\/bigThumbs\/6.jpg"},"cover":{"id":"7","name":"7.jpg","width":"170","height":"702","url":"http:\/\/local.dddimaxxx.com\/upload\/media\/covers\/7.jpg"}}},{"mediaId":"1","typeId":"1","data":{"id":"1","title":"Ninja","smallThumbId":"3","bigThumbId":"5","srcId":"1","coverId":"8","created":"2015-05-17 10:42:21","src":{"id":"1","name":"1.jpg","width":"709","height":"1024","url":"http:\/\/local.dddimaxxx.com\/upload\/media\/sources\/1.jpg"},"smallThumb":{"id":"3","name":"3.jpg","width":"300","height":"210","url":"http:\/\/local.dddimaxxx.com\/upload\/media\/smallThumbs\/3.jpg"},"bigThumb":{"id":"5","name":"5.jpg","width":"709","height":"1024","url":"http:\/\/local.dddimaxxx.com\/upload\/media\/bigThumbs\/5.jpg"},"cover":{"id":"8","name":"8.jpg","width":"170","height":"1024","url":"http:\/\/local.dddimaxxx.com\/upload\/media\/covers\/8.jpg"}}}],"art3d":[]}');