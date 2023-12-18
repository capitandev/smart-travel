create table products (
   id int not null auto_increment primary key,
   name varchar(50) not null,
   modelnumber varchar(15) not null,
   series varchar(30) not null
);


INSERT INTO products (name, modelnumber, series) VALUES ('Eric Clapton Stratocaster', '0117602806', 'Artist');
INSERT INTO products (name, modelnumber, series) VALUES
('Jeff Beck Stratocaster', '0119600805', 'Artist'), 
	('American Deluxe Stratocaster', '011900', 'American Deluxe'),
	('American Deluxe Tele', '011950', 'American Deluxe'),
	('Jim Adkins JA-90 Telecaster Thinline', '0262350538', 'Artist'),
	('Vintage Hot Rod 57 Strat', '0100132809', 'Vintage Hot Rod'),
	('American Vintage 57 Stratocaster Reissue', '0100102806', 'American Vintage'),
	('American Standard Stratocaster', '0110400700', 'American Standard'),
	('Road Worn Player Stratocaster HSS', '0131610309', 'Road Worn'),
	('Road Worn Player Telecaster', '0131082306', 'Road Worn');