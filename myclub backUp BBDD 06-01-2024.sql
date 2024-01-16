-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 06-01-2024 a las 13:18:36
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
  `id_ac` int(11) NOT NULL,
  `id_m` int(11) NOT NULL,
  `titulo` varchar(200) NOT NULL,
  `fechaHora` datetime NOT NULL,
  `lugar` varchar(200) NOT NULL,
  `curso_ac` varchar(10) NOT NULL,
  `descripcion` varchar(250) NOT NULL,
  `material` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `actividades`
--

INSERT INTO `actividades` (`id_ac`, `id_m`, `titulo`, `fechaHora`, `lugar`, `curso_ac`, `descripcion`, `material`) VALUES
(1, 4, 'futbol', '2024-01-03 19:25:34', 'pabellon san juan bosco', '4epo', 'futbol', 'ninguno'),
(2, 4, 'futbol', '2024-01-03 19:25:34', 'pabellon san juan bosco', '4epo', 'futbol', 'ninguno'),
(3, 4, 'baloncesto', '2024-01-07 19:25:34', 'Parque abeyo', '4epo', 'baloncesto', 'ganas de meter canata');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `director`
--

CREATE TABLE `director` (
  `id_d` int(11) NOT NULL,
  `id_u` int(11) NOT NULL,
  `nom_d` varchar(50) NOT NULL,
  `apel1_d` varchar(50) NOT NULL,
  `apel2_d` varchar(50) NOT NULL,
  `gmail_d` varchar(50) NOT NULL,
  `club` varchar(50) NOT NULL,
  `fecha_eleccion` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `director`
--

INSERT INTO `director` (`id_d`, `id_u`, `nom_d`, `apel1_d`, `apel2_d`, `gmail_d`, `club`, `fecha_eleccion`) VALUES
(1, 27, 'paco', 'gonzalez', 'fernadez', '', 'anciles', '2023-10-02'),
(9, 1, '1', '1', '1', '1', '1', '2023-11-20'),
(10, 27, 'paco', 'rodriguez', 'rodriguez', 'director@gmail.com', 'ANCILES', '2023-10-10');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `familiar`
--

CREATE TABLE `familiar` (
  `id_f` int(11) NOT NULL,
  `nom_f` varchar(50) NOT NULL,
  `apel1_f` varchar(50) NOT NULL,
  `apel2_f` varchar(50) NOT NULL,
  `tlf_f` varchar(9) NOT NULL,
  `direccion` varchar(150) NOT NULL,
  `localidad` varchar(150) NOT NULL,
  `cp` varchar(5) NOT NULL,
  `parentesco` varchar(50) NOT NULL,
  `gmail_f` varchar(50) NOT NULL,
  `id_s` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `monitor`
--

CREATE TABLE `monitor` (
  `id_m` int(11) NOT NULL,
  `id_u` int(11) NOT NULL,
  `id_d` int(11) NOT NULL,
  `nom_m` varchar(50) NOT NULL,
  `apel1_m` varchar(50) NOT NULL,
  `apel2_m` varchar(50) NOT NULL,
  `tlf_m` varchar(9) NOT NULL,
  `curso_m` varchar(5) NOT NULL,
  `gmail_m` varchar(50) NOT NULL,
  `carne_conducir` tinyint(1) NOT NULL,
  `titulo_monitor` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `monitor`
--

INSERT INTO `monitor` (`id_m`, `id_u`, `id_d`, `nom_m`, `apel1_m`, `apel2_m`, `tlf_m`, `curso_m`, `gmail_m`, `carne_conducir`, `titulo_monitor`) VALUES
(1, 28, 1, 'monitor', 'monitor', 'monitor', '222333444', '4epo', 'monitor@gmail.com', 1, 0),
(4, 50, 9, 'campelo', 'campelo', 'campelo', '000999666', '5epo', 'campelo@gmail.com', 1, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `socios`
--

CREATE TABLE `socios` (
  `id_s` int(11) NOT NULL,
  `id_u` int(11) NOT NULL,
  `curso_s` varchar(10) NOT NULL,
  `nom_s` varchar(50) NOT NULL,
  `apel1_s` varchar(50) NOT NULL,
  `apel2_s` varchar(50) NOT NULL,
  `fechNac` date NOT NULL,
  `tlf_s` varchar(9) DEFAULT NULL,
  `colegio` varchar(200) NOT NULL,
  `fecha_inscrip` date NOT NULL,
  `observacines` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `socios`
--

INSERT INTO `socios` (`id_s`, `id_u`, `curso_s`, `nom_s`, `apel1_s`, `apel2_s`, `fechNac`, `tlf_s`, `colegio`, `fecha_inscrip`, `observacines`) VALUES
(1, 30, '4epo', 'socio', 'socio', 'socio', '2023-11-21', NULL, 'teresianas', '2023-11-22', 'ninguna'),
(2, 30, '4epo', 'socio', 'socio', 'socio', '2023-11-21', NULL, 'teresianas', '2023-11-22', 'ninguna');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_u` int(11) NOT NULL,
  `nom_usu` varchar(100) NOT NULL,
  `pass_usu` varchar(250) NOT NULL,
  `tipo_user` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_u`, `nom_usu`, `pass_usu`, `tipo_user`) VALUES
(16, 'juan', '673d4b1d7deabe33d0037d3a39927ec3d56397a45f5eb9ac0512c75808c293f0d022e04adc5555cd3644d18cf79e9e9ebaea7e3a8e96744b0c49312a7f8af398', 'usuarios'),
(17, 'besu', 'bc13a61b5d7c717ae85c1d7a2fd0d0e696d491e7af231d472cab3988650e97ce5fe6199a1acf08f4550675917c2ba91a5f50220e8726d1d05258743cc6d583ec', 'monitor'),
(18, 'miguel', 'e1fc7a4313def98ae5303b0448c89d9a5126f3239608950859f3ea6fdeb8b19f6f7c103ecf97700be851cfbf8cda756c0929498021c675c643809eeeb4ebcbda', 'monitor'),
(19, 'alejandro', '998f36e8dcd68c6b97770daf3aed5bd2aa2ac4da4ef71e8ebe94f32fce7d0f8c30bc9be502ca79fa9ca66e8e8e00ec0a21bf8ec3252736df01f54ff40ae6fd6e', 'director'),
(20, 'alex', '35f319ca1dfc9689f5a33631c8f93ed7c3120ee7afa05b1672c7df7b71f63a6753def5fd3ac9db2eaf90ccab6bff31a486b51c7095ff958d228102b84efd7736', 'socios'),
(23, 'papa', 'cf8ed21a3a300ff5e6e15e0502b2f95672ba740add8117fb714cfc73523ba3330a1a23266b561184759379374e775fa12f9fbd127b5bbd68665285e4c3cd72c8', 'padres'),
(27, 'director', '376785415685b3ea67620da49571f303ea750dd30e6543f001d3d629115dcc5e3bcf52af35c6c34d10fa27f79e11e6482cc3e725d7fb856ae127d54a7c5d2d22', 'director'),
(28, 'monitor', 'd1a29ffc0c004008f8a6b5baf04a220e902876bf03758bde949c995c8c7fe9bf1db7c4e9d30d42761675d6815022138eccef2a54fc24d586aaa00939f261cc2e', 'monitor'),
(29, 'padre', '038eec68d1c1a9ded302496a5bc5b9266329aafc9a547785f69d11b2ae0294595641e6d95714f0fdf5f52571a415174fefd1f8e641f9b469f67307b9cbf8d1dc', 'padres'),
(30, 'socio', 'd6feb0b6676b7ae185581a8fb490fc1c12651346366fc24ddff28e1292e707c0bc5c09fc6018796ebf85e6e1b511c89109b145be32cf67ddcf9b955e8ab3bb58', 'socios'),
(47, '0', '31bca02094eb78126a517b206a88c73cfa9ec6f704c7030d18212cace820f025f00bf0ea68dbf3f3a5436ca63b53bf7bf80ad8d5de7d8359d0b7fed9dbc3ab99', 'director'),
(48, '1', '4dff4ea340f0a823f15d3f4f01ab62eae0e5da579ccb851f8db9dfe84c58b2b37b89903a740e1ee172da793a6e79d560e5f7f9bd058a12a280433ed6fa46510a', 'director'),
(50, 'campelo', '240f1de95af91dccaaed7effe298d6e901d8b688f66478bd5c42ee91bbd475364f2bb3444d40fbad4876d47cd94066ac1227d60ad0834b5af6269f6fcf81ec03', 'monitor');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `actividades`
--
ALTER TABLE `actividades`
  ADD PRIMARY KEY (`id_ac`);

--
-- Indices de la tabla `director`
--
ALTER TABLE `director`
  ADD PRIMARY KEY (`id_d`);

--
-- Indices de la tabla `familiar`
--
ALTER TABLE `familiar`
  ADD PRIMARY KEY (`id_f`);

--
-- Indices de la tabla `monitor`
--
ALTER TABLE `monitor`
  ADD PRIMARY KEY (`id_m`);

--
-- Indices de la tabla `socios`
--
ALTER TABLE `socios`
  ADD PRIMARY KEY (`id_s`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_u`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `actividades`
--
ALTER TABLE `actividades`
  MODIFY `id_ac` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `director`
--
ALTER TABLE `director`
  MODIFY `id_d` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `familiar`
--
ALTER TABLE `familiar`
  MODIFY `id_f` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `monitor`
--
ALTER TABLE `monitor`
  MODIFY `id_m` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `socios`
--
ALTER TABLE `socios`
  MODIFY `id_s` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_u` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
