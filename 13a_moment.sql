-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Máj 14. 15:39
-- Kiszolgáló verziója: 10.4.25-MariaDB
-- PHP verzió: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `13a_moment`
--
CREATE DATABASE IF NOT EXISTS `13a_moment` DEFAULT CHARACTER SET utf8 COLLATE utf8_hungarian_ci;
USE `13a_moment`;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `categories`
--

CREATE TABLE `categories` (
  `id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `name` varchar(30) COLLATE utf8_hungarian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
('0b4c6da6-3cda-4237-a419-d760911c9776', 'Festészet'),
('2d2ea0f4-a99f-40c6-b225-8b11a1dcfca8', 'Emberek'),
('6ef3090b-19d2-4b77-a4e1-d7d2a869623f', 'Kúltúra'),
('9a0696df-6b81-4972-b016-8777dc5f87d8', 'Növények'),
('a2d73bf9-151c-42d8-ae7c-bc85f72c1ef5', 'Sport'),
('c0ae9858-5f11-4332-a3cd-08235a4673be', 'Tájkép'),
('f6153b19-5d6f-41b3-96e0-1cd926586605', 'Állatok');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `commentlikes`
--

CREATE TABLE `commentlikes` (
  `userID` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `commentID` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `commentlikes`
--

INSERT INTO `commentlikes` (`userID`, `commentID`) VALUES
('028c0c59-194d-4a8f-b230-9a203e36312f', '95269b46-fa6e-4e9c-a427-12029c5fde6b');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `comments`
--

CREATE TABLE `comments` (
  `id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `userID` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `postID` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `message` text COLLATE utf8_hungarian_ci NOT NULL,
  `likes` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `comments`
--

INSERT INTO `comments` (`id`, `userID`, `postID`, `message`, `likes`, `createdAt`) VALUES
('4491a849-9f98-46f8-b221-73be7ae876f9', '109a7efd-f678-4ec9-8e77-28b2d06f048a', '5ff504d1-0c3d-431c-9e6e-a7343092a2ca', 'Ne szólj bele, hogy tartom a kutyámat! Kap eleget!', 0, '2025-05-14 13:28:05'),
('80053b11-d6e5-4733-98a3-051c1224b939', '028c0c59-194d-4a8f-b230-9a203e36312f', '5ff504d1-0c3d-431c-9e6e-a7343092a2ca', 'Adj neki több ételt! Szegény éhezik, látszik a szemén!', 0, '2025-05-14 13:27:11'),
('95269b46-fa6e-4e9c-a427-12029c5fde6b', '109a7efd-f678-4ec9-8e77-28b2d06f048a', '761772a1-b560-4170-863c-5a41d1a85932', 'Itt már én is jártam. Nekem is nagyon tetszett!', 1, '2025-05-14 13:28:34'),
('ab46b4ae-a1fa-4599-bcd7-687d18418904', '028c0c59-194d-4a8f-b230-9a203e36312f', '761772a1-b560-4170-863c-5a41d1a85932', 'Igen, csodálatos hely!', 0, '2025-05-14 13:29:19');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `postlikes`
--

CREATE TABLE `postlikes` (
  `userID` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `postID` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `postlikes`
--

INSERT INTO `postlikes` (`userID`, `postID`) VALUES
('109a7efd-f678-4ec9-8e77-28b2d06f048a', '761772a1-b560-4170-863c-5a41d1a85932');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `posts`
--

CREATE TABLE `posts` (
  `id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `userID` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `title` varchar(120) COLLATE utf8_hungarian_ci NOT NULL,
  `description` varchar(600) COLLATE utf8_hungarian_ci DEFAULT NULL,
  `categoryID` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `image` text COLLATE utf8_hungarian_ci NOT NULL,
  `visible` tinyint(1) NOT NULL DEFAULT 1,
  `likes` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `posts`
--

INSERT INTO `posts` (`id`, `userID`, `title`, `description`, `categoryID`, `image`, `visible`, `likes`, `createdAt`) VALUES
('5ff504d1-0c3d-431c-9e6e-a7343092a2ca', '109a7efd-f678-4ec9-8e77-28b2d06f048a', 'Ez egy nagyon szép kutya', 'Ez a kutya az étellel szemezik', 'f6153b19-5d6f-41b3-96e0-1cd926586605', 'https://res.cloudinary.com/dntjplkcp/image/upload/f_auto,q_auto/kutyu-1747228652088?_a=BAMAJaTG0', 1, 0, '2025-05-14 13:17:33'),
('761772a1-b560-4170-863c-5a41d1a85932', '028c0c59-194d-4a8f-b230-9a203e36312f', 'Ez egy tájkép', 'Ahogy megy le a nap, a torony nagyon szép fényekben tündököl!', '0b4c6da6-3cda-4237-a419-d760911c9776', 'https://res.cloudinary.com/dntjplkcp/image/upload/f_auto,q_auto/tajkep-1747229164068?_a=BAMAJaTG0', 1, 1, '2025-05-14 13:26:05');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `replies`
--

CREATE TABLE `replies` (
  `commentID` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `replyID` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `replies`
--

INSERT INTO `replies` (`commentID`, `replyID`) VALUES
('80053b11-d6e5-4733-98a3-051c1224b939', '4491a849-9f98-46f8-b221-73be7ae876f9'),
('95269b46-fa6e-4e9c-a427-12029c5fde6b', 'ab46b4ae-a1fa-4599-bcd7-687d18418904');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `userfollows`
--

CREATE TABLE `userfollows` (
  `followerID` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `followedID` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `userfollows`
--

INSERT INTO `userfollows` (`followerID`, `followedID`) VALUES
('028c0c59-194d-4a8f-b230-9a203e36312f', '109a7efd-f678-4ec9-8e77-28b2d06f048a');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `username` varchar(18) COLLATE utf8_hungarian_ci NOT NULL,
  `email` varchar(100) COLLATE utf8_hungarian_ci NOT NULL,
  `password` varchar(60) COLLATE utf8_hungarian_ci NOT NULL,
  `role` enum('admin','user') COLLATE utf8_hungarian_ci NOT NULL DEFAULT 'user',
  `profilePicture` text COLLATE utf8_hungarian_ci DEFAULT NULL,
  `followerCount` int(11) NOT NULL DEFAULT 0,
  `followedCount` int(11) NOT NULL DEFAULT 0,
  `banned` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `restoreCode` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `profilePicture`, `followerCount`, `followedCount`, `banned`, `createdAt`, `restoreCode`) VALUES
('028c0c59-194d-4a8f-b230-9a203e36312f', 'teszt2', 'teszt2@gmail.com', '5503054db09108585089953a43a4b84856b9dff2', 'user', 'https://res.cloudinary.com/dntjplkcp/image/upload/f_auto,q_auto/testgif-1747229537733?_a=BAMAJaTG0', 0, 0, 0, '2025-05-14 13:08:27', '8482879a-6a9d-4686-a88c-6c2c624d516c'),
('109a7efd-f678-4ec9-8e77-28b2d06f048a', 'teszt1', 'teszt1@gmail.com', '5503054db09108585089953a43a4b84856b9dff2', 'user', 'defaultpfp.jpg', 1, 0, 0, '2025-05-14 13:07:59', 'd83843e0-26e6-424a-b0c6-f567978db20d'),
('d7334fe0-1ec1-48af-8a88-540e736cf2de', 'admin', 'admin@gmail.com', '5503054db09108585089953a43a4b84856b9dff2', 'admin', 'defaultpfp.jpg', 0, 0, 0, '2025-05-14 13:08:45', 'ab56c110-baf1-4ca6-b4a7-859d3d08b85a');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `commentlikes`
--
ALTER TABLE `commentlikes`
  ADD PRIMARY KEY (`userID`,`commentID`),
  ADD UNIQUE KEY `commentlikes_user_i_d_comment_i_d` (`userID`,`commentID`),
  ADD KEY `commentID` (`commentID`);

--
-- A tábla indexei `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userID` (`userID`),
  ADD KEY `postID` (`postID`);

--
-- A tábla indexei `postlikes`
--
ALTER TABLE `postlikes`
  ADD PRIMARY KEY (`userID`,`postID`),
  ADD UNIQUE KEY `postlikes_user_i_d_post_i_d` (`userID`,`postID`),
  ADD KEY `postID` (`postID`);

--
-- A tábla indexei `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userID` (`userID`),
  ADD KEY `categoryID` (`categoryID`);

--
-- A tábla indexei `replies`
--
ALTER TABLE `replies`
  ADD PRIMARY KEY (`commentID`,`replyID`),
  ADD UNIQUE KEY `replies_comment_i_d_reply_i_d` (`commentID`,`replyID`),
  ADD KEY `replyID` (`replyID`);

--
-- A tábla indexei `userfollows`
--
ALTER TABLE `userfollows`
  ADD PRIMARY KEY (`followerID`,`followedID`),
  ADD UNIQUE KEY `userfollows_follower_i_d_followed_i_d` (`followerID`,`followedID`),
  ADD KEY `followedID` (`followedID`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `commentlikes`
--
ALTER TABLE `commentlikes`
  ADD CONSTRAINT `commentlikes_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `commentlikes_ibfk_2` FOREIGN KEY (`commentID`) REFERENCES `comments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`postID`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `postlikes`
--
ALTER TABLE `postlikes`
  ADD CONSTRAINT `postlikes_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `postlikes_ibfk_2` FOREIGN KEY (`postID`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `posts_ibfk_2` FOREIGN KEY (`categoryID`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `replies`
--
ALTER TABLE `replies`
  ADD CONSTRAINT `replies_ibfk_1` FOREIGN KEY (`commentID`) REFERENCES `comments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `replies_ibfk_2` FOREIGN KEY (`replyID`) REFERENCES `comments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `userfollows`
--
ALTER TABLE `userfollows`
  ADD CONSTRAINT `userfollows_ibfk_1` FOREIGN KEY (`followerID`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `userfollows_ibfk_2` FOREIGN KEY (`followedID`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
