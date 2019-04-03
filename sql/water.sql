-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.1.38-MariaDB-cll-lve - MariaDB Server
-- Server OS:                    Linux
-- HeidiSQL Version:             9.5.0.5196
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping structure for table cstawr_stream.water
CREATE TABLE IF NOT EXISTS `water` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `user` varchar(39) NOT NULL,
  `site` enum('ttv','ust','lst','yut','nnd','any') NOT NULL,
  `chan` varchar(100) NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `start_time` datetime DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `stream` (`chan`,`site`,`user`)
) ENGINE=MyISAM AUTO_INCREMENT=415543 DEFAULT CHARSET=latin1;

-- Dumping data for table cstawr_stream.water: 35 rows
/*!40000 ALTER TABLE `water` DISABLE KEYS */;
INSERT INTO `water` (`ID`, `user`, `site`, `chan`, `created`, `start_time`) VALUES
	(415162, '173.73.232.93', 'ttv', 'auctaway', '2019-04-02 21:45:11', '2019-04-02 13:37:28'),
	(415467, '213.243.132.194', 'ttv', 'ecterim_', '2019-04-03 00:57:35', '2019-04-02 22:43:09'),
	(415535, '174.21.39.29', 'ttv', 'unknown_legund', '2019-04-03 02:02:42', '2019-04-02 22:43:09'),
	(415470, '24.108.75.131', 'ttv', 'ecterim_', '2019-04-03 00:59:08', '2019-04-02 22:43:09'),
	(415343, '184.64.211.45', 'ttv', 'redhot100', '2019-04-03 00:00:25', '2019-04-02 22:35:59'),
	(415272, '76.64.171.63', 'ttv', 'redhot100', '2019-04-02 23:23:29', '2019-04-02 22:35:59'),
	(415505, '23.121.92.112', 'ttv', 'maximilian_dood', '2019-04-03 01:25:56', NULL),
	(415455, '68.190.54.71', 'ttv', 'deeeeeon', '2019-04-03 00:52:17', '2019-04-03 00:36:03'),
	(415326, '69.10.107.89', 'ttv', 'ecterim_', '2019-04-02 23:44:10', '2019-04-02 22:43:09'),
	(415465, '67.181.254.81', 'ttv', 'ecterim_', '2019-04-03 00:55:33', '2019-04-02 22:43:09'),
	(415542, '67.241.12.23', 'ttv', 'unknown_legund', '2019-04-03 02:13:12', '2019-04-02 22:43:09'),
	(415444, '99.253.4.33', 'ttv', 'ecterim_', '2019-04-03 00:46:44', '2019-04-02 22:43:09'),
	(415335, '52.124.70.95', 'ttv', 'vinesauce', '2019-04-02 23:52:15', NULL),
	(415297, '50.65.163.123', 'ttv', 'ecterim_', '2019-04-02 23:34:47', '2019-04-02 22:43:09'),
	(415453, '23.252.194.72', 'ttv', 'calebhart42', '2019-04-03 00:52:05', '2019-04-02 22:11:59'),
	(415533, '209.159.241.150', 'ttv', 'unknown_legund', '2019-04-03 01:56:25', '2019-04-02 22:43:09'),
	(415539, '69.116.12.118', 'ttv', 'unknown_legund', '2019-04-03 02:10:05', '2019-04-02 22:43:09'),
	(415357, '70.29.86.217', 'ttv', 'redhot100', '2019-04-03 00:04:58', '2019-04-02 22:35:59'),
	(415142, '174.21.62.67', 'ttv', 'auctaway', '2019-04-02 21:17:39', '2019-04-02 13:37:28'),
	(415490, '99.198.217.9', 'ttv', 'ecterim_', '2019-04-03 01:10:32', '2019-04-02 22:43:09'),
	(415480, '88.130.155.52', 'ttv', 'redhot100', '2019-04-03 01:05:58', '2019-04-02 22:35:59'),
	(415362, '72.178.1.250', 'yut', 'ZUmIzYv031k', '2019-04-03 00:11:21', NULL),
	(415541, '207.81.137.173', 'ttv', 'unknown_legund', '2019-04-03 02:12:26', '2019-04-02 22:43:09'),
	(415532, '98.232.178.80', 'ttv', 'unknown_legund', '2019-04-03 01:55:24', '2019-04-02 22:43:09'),
	(415534, '72.220.36.64', 'ttv', 'unknown_legund', '2019-04-03 01:57:46', '2019-04-02 22:43:09'),
	(415227, '96.38.135.114', 'ttv', 'calebhart42', '2019-04-02 22:37:57', '2019-04-02 22:11:59'),
	(415463, '68.187.58.167', 'ttv', 'ecterim_', '2019-04-03 00:54:47', '2019-04-02 22:43:09'),
	(415522, '67.253.202.174', 'ttv', 'calebhart42', '2019-04-03 01:38:42', '2019-04-02 22:11:59'),
	(415356, '72.179.41.116', 'yut', 'ZLRpc3qT7rI', '2019-04-03 00:02:49', NULL),
	(415219, '85.202.229.7', 'ttv', '8wayrun', '2019-04-02 22:31:16', NULL),
	(415346, '24.79.68.88', 'ttv', 'unknown_legund', '2019-04-03 00:01:13', '2019-04-02 22:43:09'),
	(415537, '169.236.1.253', 'ttv', 'macaw45', '2019-04-03 02:07:16', '2019-04-03 01:51:07');
/*!40000 ALTER TABLE `water` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
