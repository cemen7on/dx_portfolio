ALTER TABLE pictures ADD cover_order SMALLINT(2) UNSIGNED NULL DEFAULT NULL;
ALTER TABLE videos ADD cover_order SMALLINT(2) UNSIGNED NULL DEFAULT NULL;

ALTER TABLE pictures ADD INDEX inx_cover_order(cover_order);
ALTER TABLE videos ADD INDEX inx_cover_order(cover_order);