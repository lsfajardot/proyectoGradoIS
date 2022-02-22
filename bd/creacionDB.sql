-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`tipo_evento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`tipo_evento` (
  `id_evento` INT NOT NULL,
  `desc_evento` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_evento`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`tipo_ident`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`tipo_ident` (
  `id_tipo_ident` INT NOT NULL,
  `desc_tipo_ident` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_tipo_ident`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`usuarios` (
  `id_usuario` INT NOT NULL AUTO_INCREMENT,
  `doc_ident` INT NOT NULL,
  `tipo_doc` INT NOT NULL,
  `nombre` VARCHAR(300) NOT NULL,
  `primer_ape` VARCHAR(50) NOT NULL,
  `segundo_ape` VARCHAR(50) NOT NULL,
  `fecha_nac` DATETIME NULL,
  `celular` INT NULL,
  `email` VARCHAR(200) NULL,
  `tipo_ident_id_tipo_ident` INT NOT NULL,
  PRIMARY KEY (`id_usuario`, `doc_ident`, `tipo_doc`, `tipo_ident_id_tipo_ident`),
  INDEX `fk_usuarios_tipo_ident1_idx` (`tipo_ident_id_tipo_ident` ASC) VISIBLE,
  CONSTRAINT `fk_usuarios_tipo_ident1`
    FOREIGN KEY (`tipo_ident_id_tipo_ident`)
    REFERENCES `mydb`.`tipo_ident` (`id_tipo_ident`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`eventos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`eventos` (
  `id_eventos` INT NOT NULL AUTO_INCREMENT,
  `lat` DECIMAL(30) NOT NULL,
  `lon` DECIMAL(30) NOT NULL,
  `tipo_event` INT NOT NULL,
  `fecha_event` DATETIME NOT NULL,
  `doc_ident` INT NOT NULL,
  `tipo_doc` INT NOT NULL,
  `tipo_evento_id_evento` INT NOT NULL,
  `usuarios_id_usuario` INT NOT NULL,
  `usuarios_doc_ident` INT NOT NULL,
  `usuarios_tipo_doc` INT NOT NULL,
  PRIMARY KEY (`id_eventos`, `tipo_evento_id_evento`, `usuarios_id_usuario`, `usuarios_doc_ident`, `usuarios_tipo_doc`),
  INDEX `fk_eventos_tipo_evento_idx` (`tipo_evento_id_evento` ASC) VISIBLE,
  INDEX `fk_eventos_usuarios1_idx` (`usuarios_id_usuario` ASC, `usuarios_doc_ident` ASC, `usuarios_tipo_doc` ASC) VISIBLE,
  CONSTRAINT `fk_eventos_tipo_evento`
    FOREIGN KEY (`tipo_evento_id_evento`)
    REFERENCES `mydb`.`tipo_evento` (`id_evento`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_eventos_usuarios1`
    FOREIGN KEY (`usuarios_id_usuario` , `usuarios_doc_ident` , `usuarios_tipo_doc`)
    REFERENCES `mydb`.`usuarios` (`id_usuario` , `doc_ident` , `tipo_doc`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
