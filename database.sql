create user dormitory@localhost;
-- drop database dormitory;
create schema dormitory;

use dormitory;
grant all privileges on dormitory.* to dormitory@localhost;

CREATE TABLE `user` (
	`uid`	varchar(10)	NOT NULL,
	`id`	varchar(12)	NOT NULL,
	`passwd`	char(64)	NOT NULL,
	`salt`	char(8)	NOT NULL,
	`name`	text	NOT NULL,
	`sex`	tinyint(1)	NOT NULL,
	`phone`	int(11)	NOT NULL,
	`address`	text	NULL
);

CREATE TABLE `room_user` (
	`uid`	varchar(10)	NOT NULL,
	`rid`	int(3)	NOT NULL
);

CREATE TABLE `reward` (
	`rid`	varchar(10)	NOT NULL,
	`type`	tinyint(1)	NOT NULL	DEFAULT 0	COMMENT '0:벌점, 1:상점',
	`name`	text	NOT NULL,
	`alert`	tinyint(1)	NOT NULL	DEFAULT 0	COMMENT '안보냄, 보냄'
);

CREATE TABLE `reward_user` (
	`yid`	varchar(10)	NOT NULL,
	`uid`	varchar(10)	NOT NULL,
	`rid`	varchar(10)	NOT NULL,
	`date`	timestamp	NOT NULL	DEFAULT current_timestamp,
	`reason`	longtext	NULL	DEFAULT "사유 없음"
);

CREATE TABLE `washer` (
	`rid`	int(3)	NOT NULL,
	`type`	tinyint(1)	NOT NULL	DEFAULT 0	COMMENT '0: 세탁기, 1: 건조기',
	`loc`	tinyint(1)	NOT NULL	COMMENT '세탁기 위치',
	`num`	tinyint(1)	NOT NULL	COMMENT '세탁기 번호',
	`status`	tinyint(1)	NOT NULL	DEFAULT 1	COMMENT '세탁기 상태, 꺼짐, 켜짐',
	`lefttime`	datetime	NULL
);

CREATE TABLE `washer_reservation` (
	`yid`	varchar(10)	NOT NULL,
	`uid`	varchar(10)	NOT NULL,
	`rid`	int(3)	NOT NULL,
	`state`	tinyint(1)	NOT NULL	DEFAULT 0	COMMENT '사용전, 사용중',
	`when`	timestamp	NULL	DEFAULT current_timestamp
);

CREATE TABLE `room` (
	`rid`	int(3)	NOT NULL,
	`loc`	tinyint(1)	NOT NULL	DEFAULT 0
);

CREATE TABLE `inout` (
	`uid`	varchar(10)	NOT NULL,
	`date`	timestamp	NOT NULL	DEFAULT current_timestamp,
	`type`	tinyint(1)	NOT NULL	DEFAULT 1	COMMENT '출, 입'
);

CREATE TABLE `music` (
	`rid`	varchar(10)	NOT NULL,
	`uid`	varchar(10)	NOT NULL,
	`musicid`	varchar(15)	NOT NULL,
	`time`	timestamp	NOT NULL	DEFAULT current_timestamp
);

CREATE TABLE `music_vote` (
	`uid`	varchar(10)	NOT NULL,
	`rid`	varchar(10)	NOT NULL
);

CREATE TABLE `outgo` (
	`uid`	varchar(10)	NOT NULL,
	`fri`	tinyint(1)	NOT NULL,
	`sat`	tinyint(1)	NOT NULL,
	`sun`	tinyint(1)	NOT NULL,
	`reason`	longtext	NOT NULL,
	`dest`	longtext	NULL
);

CREATE TABLE `refresh` (
	`uid`	varchar(10)	NOT NULL,
	`refresh`	text	NOT NULL
);

ALTER TABLE `user` ADD CONSTRAINT `PK_USER` PRIMARY KEY (
	`uid`
);

ALTER TABLE `room_user` ADD CONSTRAINT `PK_ROOM_USER` PRIMARY KEY (
	`uid`,
	`rid`
);

ALTER TABLE `reward` ADD CONSTRAINT `PK_REWARD` PRIMARY KEY (
	`rid`
);

ALTER TABLE `reward_user` ADD CONSTRAINT `PK_REWARD_USER` PRIMARY KEY (
	`yid`,
	`uid`,
	`rid`
);

ALTER TABLE `washer` ADD CONSTRAINT `PK_WASHER` PRIMARY KEY (
	`rid`
);

ALTER TABLE `washer_reservation` ADD CONSTRAINT `PK_WASHER_RESERVATION` PRIMARY KEY (
	`yid`,
	`uid`,
	`rid`
);

ALTER TABLE `room` ADD CONSTRAINT `PK_ROOM` PRIMARY KEY (
	`rid`
);

ALTER TABLE `inout` ADD CONSTRAINT `PK_INOUT` PRIMARY KEY (
	`uid`
);

ALTER TABLE `music` ADD CONSTRAINT `PK_MUSIC` PRIMARY KEY (
	`rid`,
	`uid`
);

ALTER TABLE `music_vote` ADD CONSTRAINT `PK_MUSIC_VOTE` PRIMARY KEY (
	`uid`,
	`rid`
);

ALTER TABLE `outgo` ADD CONSTRAINT `PK_OUTGO` PRIMARY KEY (
	`uid`
);

ALTER TABLE `refresh` ADD CONSTRAINT `PK_REFRESH` PRIMARY KEY (
	`uid`
);

ALTER TABLE `room_user` ADD CONSTRAINT `FK_user_TO_room_user_1` FOREIGN KEY (
	`uid`
)
REFERENCES `user` (
	`uid`
);

ALTER TABLE `room_user` ADD CONSTRAINT `FK_room_TO_room_user_1` FOREIGN KEY (
	`rid`
)
REFERENCES `room` (
	`rid`
);

ALTER TABLE `reward_user` ADD CONSTRAINT `FK_user_TO_reward_user_1` FOREIGN KEY (
	`uid`
)
REFERENCES `user` (
	`uid`
);

ALTER TABLE `reward_user` ADD CONSTRAINT `FK_reward_TO_reward_user_1` FOREIGN KEY (
	`rid`
)
REFERENCES `reward` (
	`rid`
);

ALTER TABLE `washer_reservation` ADD CONSTRAINT `FK_user_TO_washer_reservation_1` FOREIGN KEY (
	`uid`
)
REFERENCES `user` (
	`uid`
);

ALTER TABLE `washer_reservation` ADD CONSTRAINT `FK_washer_TO_washer_reservation_1` FOREIGN KEY (
	`rid`
)
REFERENCES `washer` (
	`rid`
);

ALTER TABLE `inout` ADD CONSTRAINT `FK_user_TO_inout_1` FOREIGN KEY (
	`uid`
)
REFERENCES `user` (
	`uid`
);

ALTER TABLE `music` ADD CONSTRAINT `FK_user_TO_music_1` FOREIGN KEY (
	`uid`
)
REFERENCES `user` (
	`uid`
);

ALTER TABLE `music_vote` ADD CONSTRAINT `FK_user_TO_music_vote_1` FOREIGN KEY (
	`uid`
)
REFERENCES `user` (
	`uid`
);

ALTER TABLE `music_vote` ADD CONSTRAINT `FK_music_TO_music_vote_1` FOREIGN KEY (
	`rid`
)
REFERENCES `music` (
	`rid`
);

ALTER TABLE `outgo` ADD CONSTRAINT `FK_user_TO_outgo_1` FOREIGN KEY (
	`uid`
)
REFERENCES `user` (
	`uid`
);

ALTER TABLE `refresh` ADD CONSTRAINT `FK_user_TO_refresh_1` FOREIGN KEY (
	`uid`
)
REFERENCES `user` (
	`uid`
);

