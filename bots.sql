/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE = ''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS = @@UNIQUE_CHECKS, UNIQUE_CHECKS = 0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS = 0 */;
/*!40101 SET @OLD_SQL_MODE = @@SQL_MODE, SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES = @@SQL_NOTES, SQL_NOTES = 0 */;

create database if not exists dbabsen;
use dbabsen;

drop table if exists Absen;
drop table if exists siswa;


create table siswa
(
    Nama text NOT NULL ,
    NIM varchar(10) PRIMARY KEY
);

create table Absen
(
    ID int PRIMARY KEY,
    Status int,
    NIM varchar(10) NOT NULL,
    foreign key (NIM) REFERENCES siswa(NIM)
);

insert into siswa (Nama, NIM)
values ('Joko','2440011123');

insert into absen (ID, Status, NIM)
values (12323,1,'2440011123'),(456,1,'2440018847');

