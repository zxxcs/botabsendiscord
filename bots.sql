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


create table Siswa
(
    NIM varchar(10) PRIMARY KEY,
    Nama text NOT NULL
);

create table Absen
(
    ID int PRIMARY KEY,
    Tanggal datetime not null,
    NIM varchar(10) NOT NULL,
    foreign key (NIM) REFERENCES siswa(NIM)
);

# insert into siswa (Nama, NIM)
# values ('Joko','1234567890'),
#        ('VIctor','1234567891'),
#        ('Daniel','1234567892');
#
# insert into absen (ID, Tanggal, NIM)
# values (1, '2022-03-03 08:40:45', '1234567890'),
#        (2, '2022-03-03 08:42:48', '1234567891'),
#        (3, '2022-03-10 08:42:48', '1234567891');


