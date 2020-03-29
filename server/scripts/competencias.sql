DROP TABLE IF EXISTS `competencia`;
CREATE TABLE `competencia` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(70) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1024 DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `voto`;
CREATE TABLE `voto` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `pelicula_id` int(11) unsigned NOT NULL,
  `competencia_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`)
);

-- Se ejecuta para crear la FK que relaciona la tabla voto con las tablas pelicula y competencia.
ALTER TABLE `voto` add FOREIGN KEY (`pelicula_id`) REFERENCES pelicula(`id`);
ALTER TABLE `voto` add FOREIGN KEY (`competencia_id`) REFERENCES competencia(`id`);

-- Se ejecuta para crear la FK que relaciona las tablas competencia y genero. 
ALTER TABLE `competencia` ADD COLUMN genero_id int(11) unsigned;
ALTER TABLE `competencia` ADD FOREIGN KEY (`genero_id`) REFERENCES genero(id);

-- Se ejecuta para crear la FK que relaciona las tablas competencia y director. 
ALTER TABLE `competencia` ADD COLUMN `director_id` int(11) unsigned;
ALTER TABLE `competencia` ADD FOREIGN KEY (`director_id`) REFERENCES director(`id`);

-- Se ejecuta para crear la FK que relaciona las tablas competencia y actor. 
ALTER TABLE `competencia` ADD COLUMN `actor_id` int(11) unsigned;
ALTER TABLE `competencia` ADD FOREIGN KEY (`actor_id`) REFERENCES actor(`id`);
