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
 (8, '8.jpg', 170, 1024);

INSERT INTO Media(id, title, srcId, smallThumbId, bigThumbId, coverId, created) VALUES
  (1, 'Ninja', 1, 3, 5, 8, CURRENT_TIMESTAMP),
  (2, 'Knight', 2, 4, 7, 7, CURRENT_TIMESTAMP),
  (3, 'Knight1', 2, 4, 7, 7, CURRENT_TIMESTAMP),
  (4, 'Knight2', 2, 4, 7, 7, CURRENT_TIMESTAMP),
  (5, 'Knight3', 2, 4, 7, 7, CURRENT_TIMESTAMP);

INSERT INTO Pictures(mediaId, typeId) VALUES
  (1, 1),
  (2, 1),
  (3, 1),
  (4, 1),
  (5, 1);

/*
echo json_encode(array(
    'animations'=>array(),
    'pictures2d'=>array(
        array('mediaId'=>1, 'typeId'=>1, 'data'=>array('id'=>1, 'title'=>'Ninja', 'created'=>time())),
        array('mediaId'=>2, 'typeId'=>1, 'data'=>array('id'=>2, 'title'=>'Knight', 'created'=>time()))
    ),
    'art3d'=>array()
));
*/

INSERT INTO Facade(data) VALUES
  ('{"animations":[],"pictures2d":[{"mediaId":"2","typeId":"1","data":{"id":"2","title":"Knight","smallThumbId":"4","bigThumbId":"7","srcId":"2","coverId":"7","created":"2015-05-17 10:42:21","src":{"id":"2","name":"2.jpg","width":"1200","height":"702","url":"http:\/\/local.dddimaxxx.com\/upload\/media\/sources\/2.jpg"},"smallThumb":{"id":"4","name":"4.jpg","width":"300","height":"210","url":"http:\/\/local.dddimaxxx.com\/upload\/media\/smallThumbs\/4.jpg"},"bigThumb":{"id":"7","name":"7.jpg","width":"170","height":"702","url":"http:\/\/local.dddimaxxx.com\/upload\/media\/bigThumbs\/7.jpg"},"cover":{"id":"7","name":"7.jpg","width":"170","height":"702","url":"http:\/\/local.dddimaxxx.com\/upload\/media\/covers\/7.jpg"}}},{"mediaId":"1","typeId":"1","data":{"id":"1","title":"Ninja","smallThumbId":"3","bigThumbId":"5","srcId":"1","coverId":"8","created":"2015-05-17 10:42:21","src":{"id":"1","name":"1.jpg","width":"709","height":"1024","url":"http:\/\/local.dddimaxxx.com\/upload\/media\/sources\/1.jpg"},"smallThumb":{"id":"3","name":"3.jpg","width":"300","height":"210","url":"http:\/\/local.dddimaxxx.com\/upload\/media\/smallThumbs\/3.jpg"},"bigThumb":{"id":"5","name":"5.jpg","width":"709","height":"1024","url":"http:\/\/local.dddimaxxx.com\/upload\/media\/bigThumbs\/5.jpg"},"cover":{"id":"8","name":"8.jpg","width":"170","height":"1024","url":"http:\/\/local.dddimaxxx.com\/upload\/media\/covers\/8.jpg"}}}],"art3d":[]}');