-- phpMyAdmin SQL Dump
-- version 4.0.10.18
-- https://www.phpmyadmin.net
--
-- Host: localhost:3306
-- Generation Time: Jan 16, 2018 at 12:54 AM
-- Server version: 10.1.24-MariaDB-cll-lve
-- PHP Version: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `cstawr_stream`
--

-- --------------------------------------------------------

--
-- Table structure for table `water`
--

CREATE TABLE IF NOT EXISTS `water` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `user` varchar(39) NOT NULL,
  `site` enum('ttv','ust','lst','yut','nnd') NOT NULL,
  `chan` varchar(50) NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `stream` (`chan`,`site`,`user`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=47727 ;

--
-- Dumping data for table `water`
--

INSERT INTO `water` (`ID`, `user`, `site`, `chan`, `created`) VALUES
(47353, '52.124.70.95', 'ttv', 'calebhart42', '2018-01-15 19:34:03'),
(47504, '90.199.232.27', 'ust', '21938540', '2018-01-15 21:49:52'),
(47635, '24.30.58.26', 'ttv', 'amaxing1', '2018-01-15 23:30:18'),
(47699, '108.81.244.164', 'ttv', 'avoidingthepuddle', '2018-01-16 00:25:30'),
(47697, '67.8.25.102', 'ttv', 'fkospaceexploration', '2018-01-16 00:22:21'),
(47688, '66.249.84.223', 'ttv', 'amaxing1', '2018-01-16 00:17:12'),
(47671, '98.210.97.165', 'ttv', 'amaxing1', '2018-01-16 00:00:10'),
(47668, '75.133.247.88', 'ttv', 'lpngaming', '2018-01-15 23:55:07'),
(47654, '142.197.43.191', 'ttv', 'amaxing1', '2018-01-15 23:41:14'),
(47501, '96.54.89.135', 'ttv', 'sundayfunday', '2018-01-15 21:47:33'),
(47590, '96.242.155.26', 'ttv', 'sundayfunday', '2018-01-15 22:52:13'),
(47674, '68.228.92.144', 'ttv', 'floe', '2018-01-16 00:03:07'),
(47705, '108.180.151.161', 'ttv', 'amaxing1', '2018-01-16 00:33:08'),
(47413, '184.147.47.243', 'ust', '21938540', '2018-01-15 20:42:33'),
(47718, '189.155.24.148', 'ttv', 'amaxing1', '2018-01-16 00:52:15'),
(47656, '187.131.77.12', 'ttv', 'amaxing1', '2018-01-15 23:47:50'),
(47385, '24.217.245.98', 'ttv', 'nerdjosh', '2018-01-15 20:11:38'),
(47633, '86.187.166.77', 'ttv', 'amaxing1', '2018-01-15 23:29:37'),
(47650, '73.237.225.55', 'ttv', 'amaxing1', '2018-01-15 23:38:21'),
(47717, '67.181.254.81', 'ttv', 'fkospaceexploration', '2018-01-16 00:52:01'),
(47698, '50.65.163.123', 'ttv', 'fkospaceexploration', '2018-01-16 00:25:04'),
(47700, '169.236.78.22', 'ttv', 'amaxing1', '2018-01-16 00:26:16'),
(47713, '87.142.98.164', 'ttv', 'fkospaceexploration', '2018-01-16 00:49:15'),
(47556, '67.253.203.12', 'ttv', 'thisislijoe', '2018-01-15 22:21:14'),
(47632, '45.26.47.173', 'ttv', 'thisislijoe', '2018-01-15 23:25:48'),
(47725, '184.64.211.45', 'ttv', 'Amouranth', '2018-01-16 00:53:45'),
(47710, '187.132.128.131', 'ttv', 'avoidingthepuddle', '2018-01-16 00:43:53'),
(47703, '184.167.249.28', 'ttv', 'avoidingthepuddle', '2018-01-16 00:31:44'),
(47623, '71.178.185.33', 'ttv', 'sundayfunday', '2018-01-15 23:12:15'),
(47712, '68.187.58.167', 'ttv', 'avoidingthepuddle', '2018-01-16 00:48:48'),
(47726, '98.176.202.248', 'ttv', 'videos', '2018-01-16 00:54:01'),
(47689, '66.249.84.193', 'ttv', 'lpngaming', '2018-01-16 00:17:25'),
(47564, '76.188.27.13', 'ttv', 'Amouranth', '2018-01-15 22:25:34'),
(47369, '86.187.166.122', 'ttv', 'Trepound380', '2018-01-15 19:56:25'),
(47381, '82.13.255.223', 'ttv', 'poongkotv', '2018-01-15 20:05:20'),
(47614, '173.35.169.183', 'ttv', 'maximilian_dood', '2018-01-15 23:09:54'),
(47609, '173.33.73.185', 'ttv', 'sundayfunday', '2018-01-15 23:03:46');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
