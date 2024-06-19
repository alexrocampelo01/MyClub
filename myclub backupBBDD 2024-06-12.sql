-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 12-06-2024 a las 13:05:49
-- Versión del servidor: 10.4.27-MariaDB
-- Versión de PHP: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `myclub`
--
CREATE DATABASE IF NOT EXISTS `myclub` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `myclub`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `actividades`
--

CREATE TABLE `actividades` (
  `id` int(11) NOT NULL,
  `id_m` int(11) NOT NULL,
  `titulo` varchar(200) NOT NULL,
  `fechaHora_start` datetime NOT NULL,
  `fechaHora_end` datetime DEFAULT NULL,
  `lugar` varchar(200) NOT NULL,
  `curso_ac` varchar(10) NOT NULL,
  `descripcion` varchar(250) NOT NULL,
  `material` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `actividades`
--

INSERT INTO `actividades` (`id`, `id_m`, `titulo`, `fechaHora_start`, `fechaHora_end`, `lugar`, `curso_ac`, `descripcion`, `material`) VALUES
(1, 4, 'balonmano', '2024-01-07 19:25:34', NULL, 'Pabelln variio las ventas', '1eso', 'entrenamiento y partidoin de balonmano', ''),
(2, 41, 'futbol1', '2024-01-03 03:25:34', NULL, 'pabellon san juan bosco1', '4epo1', 'futbol1', 'ninguno1'),
(3, 4, 'baloncesto', '2024-02-13 19:25:34', NULL, 'Parque abeyo', '4epo', 'baloncesto', 'ganas de meter canata'),
(6, 4, 'baloncesto', '2024-02-07 19:25:34', NULL, 'Parque abeyo', '4epo', 'baloncesto', 'ganas de meter canata'),
(7, 4, 'baloncesto', '2024-02-12 19:25:34', NULL, 'Parque abeyo', '5epo', 'fultbol', 'ganas de meter canata'),
(8, 4, 'baloncesto', '2024-02-20 19:25:34', NULL, 'Parque abeyo', '5epo', 'batalla nerf', 'ganas de meter canata'),
(9, 4, 'baloncesto', '2024-02-20 19:25:34', NULL, 'Parque abeyo', '5epo', 'batalla nerf', 'ganas de meter canata'),
(10, 2, 'titulo', '2024-04-14 18:06:50', '2024-04-17 18:06:50', 'lugar', '5epo', 'descripcion ', 'material'),
(28, 0, 'f', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'f', '', 'f ', 'f'),
(29, 2, 'Titulo', '2024-06-17 18:20:39', '2024-06-19 18:20:39', 'algun sitio', '6EPO', 'descripcion', 'material'),
(30, 0, 'faaaaaaa', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'fa', '', 'fa ', 'fa'),
(31, 2, 'faaaaaaa', '2022-03-16 21:28:00', '2025-03-16 18:30:00', 'fa', '4EPO', 'fa ', 'fa'),
(32, 2, 'faaaaaaa', '2022-03-16 21:28:00', '2025-03-16 18:30:00', 'fa', '4EPO', 'fa ', 'fa'),
(33, 2, 'futbol', '2024-03-14 18:00:00', '2024-03-15 20:00:00', 'anciles', '4EPO', 'pasarlo bien ', 'botas y balon'),
(34, 2, 'baloncesto', '2024-03-15 18:00:00', '2024-03-15 20:00:00', 'anciles', '4EPO', 'pasarlo bien ', 'nada'),
(35, 2, 'scrach', '2024-04-16 18:00:00', '2024-04-16 20:00:00', 'anciles', '6EPO', 'aprender a programar ', 'tablet'),
(36, 2, 'puesia', '2024-03-17 18:00:00', '2024-03-17 20:00:00', 'anciles', '6EPO', 'que bonito es poemizar ', 'cuedarno y boli'),
(37, 2, 'aa', '2024-04-17 16:00:00', '2024-04-18 16:00:00', 'ooo', '1ESO', 'ooo', 'ooo'),
(38, 2, '', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '', '4EPO', ' ', ''),
(39, 2, '', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '', '4EPO', ' ', ''),
(40, 2, '', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '', '4EPO', ' ', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `director`
--

CREATE TABLE `director` (
  `id` int(11) NOT NULL,
  `id_u` int(11) NOT NULL,
  `club` varchar(100) NOT NULL,
  `fechaEleccion` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `director`
--

INSERT INTO `director` (`id`, `id_u`, `club`, `fechaEleccion`) VALUES
(1, 2, 'anciles', '2024-03-23 11:57:56'),
(2, 2, 'torla', '2023-10-10 00:00:00'),
(5, 51, 'o', '2022-02-10 00:00:00'),
(6, 52, 'director', '2021-01-01 00:00:00'),
(7, 79, '', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `familiares`
--

CREATE TABLE `familiares` (
  `id` int(11) NOT NULL,
  `id_u` int(11) NOT NULL,
  `id_s` int(11) NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `localidad` varchar(255) NOT NULL,
  `cp` int(5) NOT NULL,
  `parentesco` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `familiares`
--

INSERT INTO `familiares` (`id`, `id_u`, `id_s`, `direccion`, `localidad`, `cp`, `parentesco`) VALUES
(1, 5, 1, 'ALGO', 'ALGUNA', 24009, 'PADRE'),
(2, 5, 2, 'republica argentina 2d', 'leon', 24007, 'padre'),
(3, 5, 2, 'republica argentina 2d', 'leon', 24007, 'padre'),
(4, 5, 2, 'republica argentina 2d', 'leon', 24007, 'padre'),
(5, 6, 2, 'republica argentina 20d', 'leon', 24007, 'madre'),
(6, 5, 2, 'republica argentina 2d', 'leon', 24007, 'padre'),
(7, 6, 2, 'republica argentina 20d', 'leon', 24007, 'madre'),
(8, 5, 2, 'republica argentina 2d', 'leon', 24007, 'padre'),
(9, 74, 8, '', '', 44, 'Tutor legar'),
(10, 74, 8, 'f', 'f', 44, 'Tutor legar'),
(11, 75, 8, 'f', 'f', 44, 'Tutor legar');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lista`
--

CREATE TABLE `lista` (
  `id` int(11) NOT NULL,
  `id_s` int(11) NOT NULL,
  `id_a` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `monitores`
--

CREATE TABLE `monitores` (
  `id` int(11) NOT NULL,
  `id_u` int(11) NOT NULL,
  `id_d` int(11) NOT NULL,
  `curso` varchar(10) NOT NULL,
  `carne_c` tinyint(1) NOT NULL,
  `titulo_m` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `monitores`
--

INSERT INTO `monitores` (`id`, `id_u`, `id_d`, `curso`, `carne_c`, `titulo_m`) VALUES
(2, 3, 1, '5epo', 1, 0),
(3, 56, 2, '4EPO', 0, 0),
(4, 69, 1, '5EPO', 0, 0),
(5, 76, 1, '5EPO', 0, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `socios`
--

CREATE TABLE `socios` (
  `id` int(11) NOT NULL,
  `id_u` int(11) NOT NULL,
  `curso` varchar(10) NOT NULL,
  `colegio` varchar(100) NOT NULL,
  `observaciones` varchar(255) NOT NULL,
  `fechaNacimiento` datetime NOT NULL,
  `fechaInscrip` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `socios`
--

INSERT INTO `socios` (`id`, `id_u`, `curso`, `colegio`, `observaciones`, `fechaNacimiento`, `fechaInscrip`) VALUES
(1, 5, '5epo', 'virgen blanca', 'feo', '2024-03-23 19:22:38', '2024-03-23 19:22:38'),
(2, 4, '4epo', 'agustinas', 'ninguna', '2023-11-21 00:00:00', '2023-11-22 00:00:00'),
(3, 4, '4epo', 'agustinas', 'ninguna', '2023-11-21 00:00:00', '2023-11-22 00:00:00'),
(4, 4, '4epo', 'agustinas', 'ninguna', '2023-11-21 00:00:00', '2023-11-22 00:00:00'),
(5, 4, '4epo', 'agustinas', 'ninguna', '2023-11-21 00:00:00', '2023-11-22 00:00:00'),
(6, 4, '4epo', 'agustinas', 'ninguna', '2023-11-21 00:00:00', '2023-11-22 00:00:00'),
(7, 4, '4epo', 'agustinas', 'ninguna', '2023-11-21 00:00:00', '2023-11-22 00:00:00'),
(8, 4, '4epo', 'agustinas', 'ninguna', '2023-11-21 00:00:00', '2023-11-22 00:00:00'),
(9, 4, '4epo', 'agustinas', 'ninguna', '2023-11-21 00:00:00', '2023-11-22 00:00:00'),
(10, 57, '', 'cole', '', '2025-05-14 00:00:00', '2026-05-14 00:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nom_usu` varchar(100) NOT NULL,
  `pass` varchar(255) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `apel1` varchar(100) NOT NULL,
  `apel2` varchar(100) NOT NULL,
  `correo` varchar(50) NOT NULL,
  `tlf` int(9) NOT NULL,
  `tipo_user` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nom_usu`, `pass`, `nom`, `apel1`, `apel2`, `correo`, `tlf`, `tipo_user`) VALUES
(1, 'alroca', 'alroca', 'alejandro', 'rodriguez', 'CAMPELO', 'alroca@gmail.com', 858470610, 'director'),
(2, 'director', '376785415685b3ea67620da49571f303ea750dd30e6543f001d3d629115dcc5e3bcf52af35c6c34d10fa27f79e11e6482cc3e725d7fb856ae127d54a7c5d2d22', 'dire', 'dire', 'dire', 'dire@gmail', 777777777, 'director'),
(3, 'monitor', 'd1a29ffc0c004008f8a6b5baf04a220e902876bf03758bde949c995c8c7fe9bf1db7c4e9d30d42761675d6815022138eccef2a54fc24d586aaa00939f261cc2e', 'moni', 'moni', 'moni', 'moni@gmail.com', 222222222, 'monitor'),
(4, 'socio', 'd6feb0b6676b7ae185581a8fb490fc1c12651346366fc24ddff28e1292e707c0bc5c09fc6018796ebf85e6e1b511c89109b145be32cf67ddcf9b955e8ab3bb58', 'socio', 'socio', 'socio', 'socio@gmail.com', 111111111, 'socio'),
(5, 'familiar', '33264264b0a14afe4f9f8a5cf9978ee67dba15f90232b0d62fa26ecace88edde93d495adaf2444a2d7c37007b8add1a12e28883b0b1cbff5f78029798f3c67ef', 'fami', 'fami', 'fami', 'fami@gmail.com', 555555555, 'familiar'),
(6, 'familiar2', '8b6dc84e69236b921cba15c8be7a913dba783488ae27ab36b597939daef792801259c59fa4bb22525ca3df4d663a8ac372e21c016b4d1ae257f5da04ae17b8d0', 'fami2', 'fami2', 'fami2', 'fami2@gmail.com', 555555555, 'familiar2'),
(18, 'alejandro', '998f36e8dcd68c6b97770daf3aed5bd2aa2ac4da4ef71e8ebe94f32fce7d0f8c30bc9be502ca79fa9ca66e8e8e00ec0a21bf8ec3252736df01f54ff40ae6fd6e', 'alejandro', 'rodriguez', 'campelo', 'alejandro@gmail.com', 222333444, 'director'),
(76, 'donJavier', 'e788c9098e9af811c184fc759a95d743925c4ed2c3a25c0f23f8e44b920709d60ebfa47bde9fd25e2c257d9e49cdf0f6de1c35119493ea4d0d756f56de19366b', 'javier', 'peromarta', 'segundo', 'alguno', 33, 'monitor'),
(77, '', 'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e', '', '', '', '', 0, 'director'),
(78, 'aabcaa', 'f6c5600ed1dbdcfdf829081f5417dccbbd2b9288e0b427e65c8cf67e274b69009cd142475e15304f599f429f260a661b5df4de26746459a3cef7f32006e5d1c1', '', '', '', '', 0, 'director'),
(79, 'aabcaar', 'f6c5600ed1dbdcfdf829081f5417dccbbd2b9288e0b427e65c8cf67e274b69009cd142475e15304f599f429f260a661b5df4de26746459a3cef7f32006e5d1c1', 'aa', 'aa', 'aa', 'aaaa', 222, 'director'),
(80, 'y', '121b4774a759924a2929c4a412fb6e31b9aaa746466840efcc4a76d69a94149e2364e3983d646feafaa1b511785e5c9e90aedc30da6a6bead5520ecc99c6626a', 'y', 'y', 'y', 'y', 789, 'director');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `actividades`
--
ALTER TABLE `actividades`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `director`
--
ALTER TABLE `director`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `familiares`
--
ALTER TABLE `familiares`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `lista`
--
ALTER TABLE `lista`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `monitores`
--
ALTER TABLE `monitores`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `socios`
--
ALTER TABLE `socios`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `actividades`
--
ALTER TABLE `actividades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT de la tabla `director`
--
ALTER TABLE `director`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `familiares`
--
ALTER TABLE `familiares`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `lista`
--
ALTER TABLE `lista`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `monitores`
--
ALTER TABLE `monitores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `socios`
--
ALTER TABLE `socios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=81;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
