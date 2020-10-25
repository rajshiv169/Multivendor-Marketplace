CREATE DATABASE multivendor CHARACTER SET utf8 COLLATE utf8_general_ci;
USE multivendor;

CREATE TABLE IF NOT EXISTS ownerProfile (
	id int(11) NOT NULL AUTO_INCREMENT,
	name varchar(50) NOT NULL,
	email varchar(100) NOT NULL,
	phone varchar(30) NOT NULL,
	encryPassword varchar(100) NOT NULL,
	salt varchar(100),
	role tinyint(1) NOT NULL DEFAULT '0',
	companyID int NULL,
	createdAt TIMESTAMP,
	updatedAt TIMEStAMP,
	PRIMARY KEY (id)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

CREATE TABLE IF NOT EXISTS companyDetails (
	id int(11) NOT NULL AUTO_INCREMENT,
	pan_number int(30) NOT NULL,
	company_name varchar(50) NOT NULL,
	registration_no int(30) NOT NULL,
	dda_no int(30) NOT NULL,
	createdAt TIMESTAMP,
	updatedAt TIMEStAMP,
	PRIMARY KEY (id)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1  ;

CREATE TABLE IF NOT EXISTS purchaseDetails (
	id int(11) NOT NULL AUTO_INCREMENT,
	buyer int NOT NULL,
	saler int NOT NULL,
	photo varchar(200) NOT NULL,
	status tinyint(1) NOT NULL DEFAULT '0',
	createdAt TIMESTAMP,
	updatedAt TIMEStAMP,
	PRIMARY KEY (id)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1  ;

CREATE TABLE IF NOT EXISTS paymentDetails (
	id int(11) NOT NULL AUTO_INCREMENT,
	estimated int(40) NOT NULL,
	payment int(30),
	status tinyint(1) NOT NULL DEFAULT '0',
	purchaseID int NOT NULL,
	createdAt TIMESTAMP,
	updatedAt TIMEStAMP,
	PRIMARY KEY (id)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1  ;

CREATE TABLE IF NOT EXISTS orderDetails (
	id int(11) NOT NULL AUTO_INCREMENT,
	ownerID int NOT NULL,
	purchaseID int NOT NULL,
	createdAt TIMESTAMP,
	updatedAt TIMEStAMP,
	PRIMARY KEY (id),
	FOREIGN KEY (ownerID) REFERENCES ownerProfile (id),
	FOREIGN KEY (purchaseID) REFERENCES purchaseDetails (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

CREATE TABLE IF NOT EXISTS payments (
	id int(11) NOT NULL AUTO_INCREMENT,
	paymentID int NOT NULL,
	createdAt TIMESTAMP,
	updatedAt TIMEStAMP,
	PRIMARY KEY (id),
	FOREIGN KEY (paymentID) REFERENCES paymentDetails (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

ALTER TABLE ownerProfile
	ADD FOREIGN KEY (companyID) REFERENCES companyDetails (id);
	
ALTER TABLE purchaseDetails
	ADD FOREIGN KEY (buyer) REFERENCES ownerProfile (id),
	ADD FOREIGN KEY (saler) REFERENCES ownerProfile (id);

ALTER TABLE paymentDetails
	ADD FOREIGN KEY (purchaseID) REFERENCES purchaseDetails (id);



