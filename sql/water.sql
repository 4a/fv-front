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
) ENGINE=MyISAM AUTO_INCREMENT=413482 DEFAULT CHARSET=latin1;

-- Dumping data for table cstawr_stream.water: 42 rows
/*!40000 ALTER TABLE `water` DISABLE KEYS */;
INSERT INTO `water` (`ID`, `user`, `site`, `chan`, `created`, `start_time`) VALUES
	(413481, '45.46.177.206', 'ttv', 'iplaywinner', '2019-03-31 19:22:58', '2019-03-31 13:02:21'),
	(413453, '68.231.17.249', 'ttv', 'iplaywinner', '2019-03-31 19:01:53', '2019-03-31 13:02:21'),
	(413454, '96.114.65.132', 'ttv', 'iplaywinner', '2019-03-31 19:05:35', '2019-03-31 13:02:21'),
	(413412, '108.168.126.16', 'ttv', 'iplaywinner', '2019-03-31 18:51:57', '2019-03-31 13:02:21'),
	(413460, '149.248.183.48', 'ttv', 'teamsp00ky', '2019-03-31 19:07:43', '2019-03-31 12:51:12'),
	(413469, '67.181.254.81', 'ttv', 'iplaywinner', '2019-03-31 19:16:52', '2019-03-31 13:02:21'),
	(413285, '67.160.137.131', 'ttv', 'mfbiscuits', '2019-03-31 16:48:40', NULL),
	(413430, '67.184.136.186', 'ttv', 'iplaywinner', '2019-03-31 18:56:56', '2019-03-31 13:02:21'),
	(413463, '73.7.110.66', 'ttv', 'iplaywinner', '2019-03-31 19:08:45', '2019-03-31 13:02:21'),
	(413452, '96.242.155.26', 'ttv', 'iplaywinner', '2019-03-31 19:01:52', '2019-03-31 13:02:21'),
	(413448, '73.185.2.157', 'ttv', 'auctaway', '2019-03-31 19:00:12', '2019-03-31 15:14:25'),
	(413342, '97.81.213.28', 'ttv', 'capcomfighters', '2019-03-31 17:41:26', '2019-03-30 08:25:38'),
	(413388, '189.209.63.198', 'ttv', 'vgbootcamp', '2019-03-31 18:42:33', NULL),
	(413464, '201.124.241.248', 'ttv', 'teamsp00ky', '2019-03-31 19:10:52', '2019-03-31 12:51:12'),
	(413471, '52.124.70.95', 'ttv', 'calebhart42', '2019-03-31 19:17:38', NULL),
	(413210, '184.64.211.45', 'ttv', 'miayarin', '2019-03-31 15:50:10', '2019-03-30 08:25:38'),
	(413346, '99.244.188.3', 'ttv', 'eleaguetv', '2019-03-31 17:55:43', '2019-03-31 14:02:35'),
	(413419, '85.202.229.7', 'ttv', 'iplaywinner', '2019-03-31 18:54:35', '2019-03-31 13:02:21'),
	(413371, '180.24.193.199', 'ttv', 'auctaway', '2019-03-31 18:35:34', '2019-03-31 15:14:25'),
	(413358, '105.212.49.107', 'ttv', 'iplaywinner', '2019-03-31 18:23:06', '2019-03-31 13:02:21'),
	(413429, '174.21.105.18', 'ttv', 'iplaywinner', '2019-03-31 18:55:50', '2019-03-31 13:02:21'),
	(413330, '96.114.65.138', 'ttv', 'capcomfighters', '2019-03-31 17:29:46', '2019-03-30 08:25:38'),
	(413132, '91.153.84.193', 'ttv', 'eleaguetv', '2019-03-31 14:18:50', '2019-03-31 14:02:35'),
	(413219, '47.219.164.201', 'ttv', 'capcomfighters', '2019-03-31 15:54:40', '2019-03-30 08:25:38'),
	(413457, '99.253.4.33', 'ttv', 'iplaywinner', '2019-03-31 19:07:31', '2019-03-31 13:02:21'),
	(413416, '82.23.204.134', 'ttv', 'iplaywinner', '2019-03-31 18:52:51', '2019-03-31 13:02:21'),
	(413183, '23.121.92.112', 'ttv', 'iplaywinner', '2019-03-31 15:24:47', '2019-03-31 13:02:21'),
	(413408, '24.28.102.212', 'ttv', 'auctaway', '2019-03-31 18:51:40', '2019-03-31 15:14:25'),
	(413173, '100.12.226.203', 'ttv', 'auctaway', '2019-03-31 15:14:25', NULL),
	(413458, '24.159.231.185', 'ttv', 'teamsp00ky', '2019-03-31 19:07:35', '2019-03-31 12:51:12'),
	(413238, '71.198.202.252', 'ttv', 'capcomfighters', '2019-03-31 16:07:38', '2019-03-30 08:25:38'),
	(413472, '86.144.218.226', 'ttv', 'iplaywinner', '2019-03-31 19:18:05', '2019-03-31 13:02:21'),
	(413475, '72.220.36.64', 'ttv', 'iplaywinner', '2019-03-31 19:22:02', '2019-03-31 13:02:21'),
	(413312, '213.243.132.194', 'ttv', 'capcomfighters', '2019-03-31 17:08:36', '2019-03-30 08:25:38'),
	(413465, '50.65.163.123', 'ttv', 'iplaywinner', '2019-03-31 19:11:41', '2019-03-31 13:02:21'),
	(413258, '45.19.110.125', 'ttv', 'capcomfighters', '2019-03-31 16:24:43', '2019-03-30 08:25:38'),
	(413135, '94.134.88.143', 'ttv', 'teamsp00ky', '2019-03-31 14:20:41', '2019-03-31 12:51:12'),
	(413467, '173.66.38.249', 'ttv', 'capcomfighters', '2019-03-31 19:16:09', '2019-03-30 08:25:38'),
	(413407, '24.28.102.212', 'ttv', 'iplaywinner', '2019-03-31 18:51:40', '2019-03-31 15:14:25'),
	(413455, '73.254.242.139', 'ttv', 'iplaywinner', '2019-03-31 19:05:51', '2019-03-31 13:02:21'),
	(413310, '98.225.47.226', 'ttv', 'capcomfighters', '2019-03-31 17:07:37', '2019-03-30 08:25:38'),
	(413474, '67.241.12.23', 'ttv', 'teamsp00ky', '2019-03-31 19:21:39', '2019-03-31 12:51:12');
/*!40000 ALTER TABLE `water` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
