-- MySQL dump 10.13  Distrib 8.4.3, for Win64 (x86_64)
--
-- Host: localhost    Database: sama_avis
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--



DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `icone` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Voirie','road'),(2,'Eclairage','lightbulb'),(3,'Propreté','trash'),(4,'Eau','droplet'),(5,'Santé','heart'),(6,'Autre','circle'),(7,'Voirie','road'),(8,'Eclairage','lightbulb'),(9,'Propreté','trash'),(10,'Eau','droplet'),(11,'Santé','heart'),(12,'Autre','circle'),(13,'Voirie','road'),(14,'Eclairage','lightbulb'),(15,'Propreté','trash'),(16,'Eau','droplet'),(17,'Santé','heart'),(18,'Autre','circle'),(19,'Voirie','road'),(20,'Eclairage','lightbulb'),(21,'Propreté','trash'),(22,'Eau','droplet'),(23,'Santé','heart'),(24,'Autre','circle'),(25,'Voirie','road'),(26,'Eclairage','lightbulb'),(27,'Propreté','trash'),(28,'Eau','droplet'),(29,'Santé','heart'),(30,'Autre','circle'),(31,'Voirie','road'),(32,'Eclairage','lightbulb'),(33,'Propreté','trash'),(34,'Eau','droplet'),(35,'Santé','heart'),(36,'Autre','circle'),(37,'Voirie','road'),(38,'Eclairage','lightbulb'),(39,'Propreté','trash'),(40,'Eau','droplet'),(41,'Santé','heart'),(42,'Autre','circle'),(43,'Voirie','road'),(44,'Eclairage','lightbulb'),(45,'Propreté','trash'),(46,'Eau','droplet'),(47,'Santé','heart'),(48,'Autre','circle'),(49,'Voirie','road'),(50,'Eclairage','lightbulb'),(51,'Propreté','trash'),(52,'Eau','droplet'),(53,'Santé','heart'),(54,'Autre','circle'),(55,'Voirie','road'),(56,'Eclairage','lightbulb'),(57,'Propreté','trash'),(58,'Eau','droplet'),(59,'Santé','heart'),(60,'Autre','circle'),(61,'Voirie','road'),(62,'Eclairage','lightbulb'),(63,'Propreté','trash'),(64,'Eau','droplet'),(65,'Santé','heart'),(66,'Autre','circle');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `commentaires`
--

DROP TABLE IF EXISTS `commentaires`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `commentaires` (
  `id` char(36) NOT NULL,
  `ticket_id` char(36) NOT NULL,
  `utilisateur_id` char(36) NOT NULL,
  `contenu` text NOT NULL,
  `date_creation` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ticket_id` (`ticket_id`),
  KEY `utilisateur_id` (`utilisateur_id`),
  CONSTRAINT `commentaires_ibfk_1` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `commentaires_ibfk_2` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commentaires`
--

LOCK TABLES `commentaires` WRITE;
/*!40000 ALTER TABLE `commentaires` DISABLE KEYS */;
/*!40000 ALTER TABLE `commentaires` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historique_statuts`
--

DROP TABLE IF EXISTS `historique_statuts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historique_statuts` (
  `id` char(36) NOT NULL,
  `ticket_id` char(36) NOT NULL,
  `ancien_statut` varchar(50) DEFAULT NULL,
  `nouveau_statut` varchar(50) NOT NULL,
  `modifie_par` char(36) DEFAULT NULL,
  `date_changement` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ticket_id` (`ticket_id`),
  KEY `modifie_par` (`modifie_par`),
  CONSTRAINT `historique_statuts_ibfk_1` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `historique_statuts_ibfk_2` FOREIGN KEY (`modifie_par`) REFERENCES `utilisateurs` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historique_statuts`
--

LOCK TABLES `historique_statuts` WRITE;
/*!40000 ALTER TABLE `historique_statuts` DISABLE KEYS */;
INSERT INTO `historique_statuts` VALUES ('e4afabfc-5765-467d-9d75-73c64ff8f6bc','313ede4d-0a63-4ff4-ae43-a1ddc2dd6e24',NULL,'recu',NULL,'2026-04-04 14:38:23');
/*!40000 ALTER TABLE `historique_statuts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` char(36) NOT NULL,
  `utilisateur_id` char(36) NOT NULL,
  `ticket_id` char(36) NOT NULL,
  `message` text NOT NULL,
  `lu` tinyint(1) DEFAULT '0',
  `date_creation` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `utilisateur_id` (`utilisateur_id`),
  KEY `ticket_id` (`ticket_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tickets` (
  `id` char(36) NOT NULL,
  `utilisateur_id` char(36) DEFAULT NULL,
  `titre` varchar(255) NOT NULL,
  `categorie` varchar(100) NOT NULL,
  `description` text,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `statut` enum('recu','assigne','en_cours','resolu') NOT NULL DEFAULT 'recu',
  `date_creation` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `utilisateur_id` (`utilisateur_id`),
  CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets`
--

LOCK TABLES `tickets` WRITE;
/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
INSERT INTO `tickets` VALUES ('131dd1cd-2e48-11f1-ab9c-005056c00001',NULL,'Nid-de-poule dangereux','voirie','Grand nid-de-poule au milieu de la chaussée, risque pour les motos.',14.6937,-17.4441,NULL,'en_cours','2026-04-02 03:57:31'),('131dea68-2e48-11f1-ab9c-005056c00001',NULL,'Lampadaire en panne','eclairage','Lampadaire éteint depuis 3 jours, rue très sombre la nuit.',14.696,-17.4478,NULL,'assigne','2026-04-02 03:57:31'),('131decd9-2e48-11f1-ab9c-005056c00001',NULL,'Dépôt sauvage de déchets','proprete','Tas d\'ordures devant l\'école, mauvaise odeur.',14.6892,-17.4402,NULL,'resolu','2026-04-02 03:57:31'),('131dee3e-2e48-11f1-ab9c-005056c00001',NULL,'Fuite d\'eau sur la chaussée','eau','Eau qui coule en permanence depuis une canalisation, gaspillage important.',14.7012,-17.451,NULL,'recu','2026-04-02 03:57:31'),('131def51-2e48-11f1-ab9c-005056c00001',NULL,'Trottoir effondré','voirie','Le trottoir est complètement cassé, dangereux pour les piétons.',14.6878,-17.4455,NULL,'recu','2026-04-02 03:57:31'),('131df01b-2e48-11f1-ab9c-005056c00001',NULL,'Bouche d\'égout ouverte','voirie','Bouche d\'égout sans couvercle, risque de chute.',14.6945,-17.4389,NULL,'assigne','2026-04-02 03:57:31'),('131df0c5-2e48-11f1-ab9c-005056c00001',NULL,'Déchets devant le marché','proprete','Les poubelles n\'ont pas été ramassées depuis une semaine.',14.6921,-17.4467,NULL,'en_cours','2026-04-02 03:57:31'),('131df18e-2e48-11f1-ab9c-005056c00001',NULL,'Panne d\'eau dans le quartier','eau','Pas d\'eau courante depuis ce matin dans tout le quartier.',14.6998,-17.4423,NULL,'resolu','2026-04-02 03:57:31'),('131df240-2e48-11f1-ab9c-005056c00001',NULL,'Route inondée','voirie','Route impraticable après les pluies, eau stagnante.',14.6855,-17.449,NULL,'recu','2026-04-02 03:57:31'),('131df2fa-2e48-11f1-ab9c-005056c00001',NULL,'3 lampadaires éteints','eclairage','Toute une portion de la rue est dans le noir, insécurité.',14.6975,-17.435,NULL,'recu','2026-04-02 03:57:31'),('313ede4d-0a63-4ff4-ae43-a1ddc2dd6e24',NULL,'sopjfvdfpj','voirie','spojcd*fs, m',14.786346071615341,-17.28614578825543,'/uploads/1775313503340-168469723.jpg','recu','2026-04-04 14:38:23'),('3c8ffa37-2e48-11f1-ab9c-005056c00001',NULL,'Nid-de-poule dangereux','voirie','Grand nid-de-poule au milieu de la chaussée, risque pour les motos.',14.6937,-17.4441,NULL,'en_cours','2026-04-02 03:58:41'),('3c900142-2e48-11f1-ab9c-005056c00001',NULL,'Lampadaire en panne','eclairage','Lampadaire éteint depuis 3 jours, rue très sombre la nuit.',14.696,-17.4478,NULL,'assigne','2026-04-02 03:58:41'),('3c90022c-2e48-11f1-ab9c-005056c00001',NULL,'Dépôt sauvage de déchets','proprete','Tas d\'ordures devant l\'école, mauvaise odeur.',14.6892,-17.4402,NULL,'resolu','2026-04-02 03:58:41'),('3c900312-2e48-11f1-ab9c-005056c00001',NULL,'Fuite d\'eau sur la chaussée','eau','Eau qui coule en permanence depuis une canalisation, gaspillage important.',14.7012,-17.451,NULL,'recu','2026-04-02 03:58:41'),('3c9003ac-2e48-11f1-ab9c-005056c00001',NULL,'Trottoir effondré','voirie','Le trottoir est complètement cassé, dangereux pour les piétons.',14.6878,-17.4455,NULL,'recu','2026-04-02 03:58:41'),('3c900432-2e48-11f1-ab9c-005056c00001',NULL,'Bouche d\'égout ouverte','voirie','Bouche d\'égout sans couvercle, risque de chute.',14.6945,-17.4389,NULL,'assigne','2026-04-02 03:58:41'),('3c9004d0-2e48-11f1-ab9c-005056c00001',NULL,'Déchets devant le marché','proprete','Les poubelles n\'ont pas été ramassées depuis une semaine.',14.6921,-17.4467,NULL,'en_cours','2026-04-02 03:58:41'),('3c900579-2e48-11f1-ab9c-005056c00001',NULL,'Panne d\'eau dans le quartier','eau','Pas d\'eau courante depuis ce matin dans tout le quartier.',14.6998,-17.4423,NULL,'resolu','2026-04-02 03:58:41'),('3c900605-2e48-11f1-ab9c-005056c00001',NULL,'Route inondée','voirie','Route impraticable après les pluies, eau stagnante.',14.6855,-17.449,NULL,'recu','2026-04-02 03:58:41'),('3c90068d-2e48-11f1-ab9c-005056c00001',NULL,'3 lampadaires éteints','eclairage','Toute une portion de la rue est dans le noir, insécurité.',14.6975,-17.435,NULL,'recu','2026-04-02 03:58:41'),('520d7d51-2e48-11f1-ab9c-005056c00001',NULL,'Nid-de-poule dangereux','voirie','Grand nid-de-poule au milieu de la chaussée, risque pour les motos.',14.6937,-17.4441,NULL,'en_cours','2026-04-02 03:59:17'),('520d85fe-2e48-11f1-ab9c-005056c00001',NULL,'Lampadaire en panne','eclairage','Lampadaire éteint depuis 3 jours, rue très sombre la nuit.',14.696,-17.4478,NULL,'assigne','2026-04-02 03:59:17'),('520d8713-2e48-11f1-ab9c-005056c00001',NULL,'Dépôt sauvage de déchets','proprete','Tas d\'ordures devant l\'école, mauvaise odeur.',14.6892,-17.4402,NULL,'resolu','2026-04-02 03:59:17'),('520d87b5-2e48-11f1-ab9c-005056c00001',NULL,'Fuite d\'eau sur la chaussée','eau','Eau qui coule en permanence depuis une canalisation, gaspillage important.',14.7012,-17.451,NULL,'recu','2026-04-02 03:59:17'),('520d88a0-2e48-11f1-ab9c-005056c00001',NULL,'Trottoir effondré','voirie','Le trottoir est complètement cassé, dangereux pour les piétons.',14.6878,-17.4455,NULL,'recu','2026-04-02 03:59:17'),('520d8940-2e48-11f1-ab9c-005056c00001',NULL,'Bouche d\'égout ouverte','voirie','Bouche d\'égout sans couvercle, risque de chute.',14.6945,-17.4389,NULL,'assigne','2026-04-02 03:59:17'),('520d89cd-2e48-11f1-ab9c-005056c00001',NULL,'Déchets devant le marché','proprete','Les poubelles n\'ont pas été ramassées depuis une semaine.',14.6921,-17.4467,NULL,'en_cours','2026-04-02 03:59:17'),('520d8a82-2e48-11f1-ab9c-005056c00001',NULL,'Panne d\'eau dans le quartier','eau','Pas d\'eau courante depuis ce matin dans tout le quartier.',14.6998,-17.4423,NULL,'resolu','2026-04-02 03:59:17'),('520d8c0e-2e48-11f1-ab9c-005056c00001',NULL,'Route inondée','voirie','Route impraticable après les pluies, eau stagnante.',14.6855,-17.449,NULL,'recu','2026-04-02 03:59:17'),('520d8d25-2e48-11f1-ab9c-005056c00001',NULL,'3 lampadaires éteints','eclairage','Toute une portion de la rue est dans le noir, insécurité.',14.6975,-17.435,NULL,'recu','2026-04-02 03:59:17'),('532a10b9-2e48-11f1-ab9c-005056c00001',NULL,'Nid-de-poule dangereux','voirie','Grand nid-de-poule au milieu de la chaussée, risque pour les motos.',14.6937,-17.4441,NULL,'en_cours','2026-04-02 03:59:19'),('532a1a43-2e48-11f1-ab9c-005056c00001',NULL,'Lampadaire en panne','eclairage','Lampadaire éteint depuis 3 jours, rue très sombre la nuit.',14.696,-17.4478,NULL,'assigne','2026-04-02 03:59:19'),('532a1b5e-2e48-11f1-ab9c-005056c00001',NULL,'Dépôt sauvage de déchets','proprete','Tas d\'ordures devant l\'école, mauvaise odeur.',14.6892,-17.4402,NULL,'resolu','2026-04-02 03:59:19'),('532a1c0c-2e48-11f1-ab9c-005056c00001',NULL,'Fuite d\'eau sur la chaussée','eau','Eau qui coule en permanence depuis une canalisation, gaspillage important.',14.7012,-17.451,NULL,'recu','2026-04-02 03:59:19'),('532a1cad-2e48-11f1-ab9c-005056c00001',NULL,'Trottoir effondré','voirie','Le trottoir est complètement cassé, dangereux pour les piétons.',14.6878,-17.4455,NULL,'recu','2026-04-02 03:59:19'),('532a1d3b-2e48-11f1-ab9c-005056c00001',NULL,'Bouche d\'égout ouverte','voirie','Bouche d\'égout sans couvercle, risque de chute.',14.6945,-17.4389,NULL,'assigne','2026-04-02 03:59:19'),('532a1dce-2e48-11f1-ab9c-005056c00001',NULL,'Déchets devant le marché','proprete','Les poubelles n\'ont pas été ramassées depuis une semaine.',14.6921,-17.4467,NULL,'en_cours','2026-04-02 03:59:19'),('532a1e81-2e48-11f1-ab9c-005056c00001',NULL,'Panne d\'eau dans le quartier','eau','Pas d\'eau courante depuis ce matin dans tout le quartier.',14.6998,-17.4423,NULL,'resolu','2026-04-02 03:59:19'),('532a1f1c-2e48-11f1-ab9c-005056c00001',NULL,'Route inondée','voirie','Route impraticable après les pluies, eau stagnante.',14.6855,-17.449,NULL,'recu','2026-04-02 03:59:19'),('532a1fb0-2e48-11f1-ab9c-005056c00001',NULL,'3 lampadaires éteints','eclairage','Toute une portion de la rue est dans le noir, insécurité.',14.6975,-17.435,NULL,'recu','2026-04-02 03:59:19'),('64c8d4f3-2f02-11f1-ab9c-005056c00001',NULL,'Nid-de-poule dangereux','voirie','Grand nid-de-poule au milieu de la chaussée, risque pour les motos.',14.6937,-17.4441,NULL,'en_cours','2026-04-03 02:11:15'),('64c8e992-2f02-11f1-ab9c-005056c00001',NULL,'Lampadaire en panne','eclairage','Lampadaire éteint depuis 3 jours, rue très sombre la nuit.',14.696,-17.4478,NULL,'assigne','2026-04-03 02:11:15'),('64c8ed75-2f02-11f1-ab9c-005056c00001',NULL,'Dépôt sauvage de déchets','proprete','Tas d\'ordures devant l\'école, mauvaise odeur.',14.6892,-17.4402,NULL,'resolu','2026-04-03 02:11:15'),('64c8ef1d-2f02-11f1-ab9c-005056c00001',NULL,'Fuite d\'eau sur la chaussée','eau','Eau qui coule en permanence depuis une canalisation, gaspillage important.',14.7012,-17.451,NULL,'recu','2026-04-03 02:11:15'),('64c8f08f-2f02-11f1-ab9c-005056c00001',NULL,'Trottoir effondré','voirie','Le trottoir est complètement cassé, dangereux pour les piétons.',14.6878,-17.4455,NULL,'recu','2026-04-03 02:11:15'),('64c8f212-2f02-11f1-ab9c-005056c00001',NULL,'Bouche d\'égout ouverte','voirie','Bouche d\'égout sans couvercle, risque de chute.',14.6945,-17.4389,NULL,'assigne','2026-04-03 02:11:15'),('64c8f3b8-2f02-11f1-ab9c-005056c00001',NULL,'Déchets devant le marché','proprete','Les poubelles n\'ont pas été ramassées depuis une semaine.',14.6921,-17.4467,NULL,'en_cours','2026-04-03 02:11:15'),('64c8f897-2f02-11f1-ab9c-005056c00001',NULL,'Panne d\'eau dans le quartier','eau','Pas d\'eau courante depuis ce matin dans tout le quartier.',14.6998,-17.4423,NULL,'resolu','2026-04-03 02:11:15'),('64c8fbed-2f02-11f1-ab9c-005056c00001',NULL,'Route inondée','voirie','Route impraticable après les pluies, eau stagnante.',14.6855,-17.449,NULL,'recu','2026-04-03 02:11:15'),('64c8fe09-2f02-11f1-ab9c-005056c00001',NULL,'3 lampadaires éteints','eclairage','Toute une portion de la rue est dans le noir, insécurité.',14.6975,-17.435,NULL,'recu','2026-04-03 02:11:15'),('6e7dbbb6-2e48-11f1-ab9c-005056c00001',NULL,'Nid-de-poule dangereux','voirie','Grand nid-de-poule au milieu de la chaussée, risque pour les motos.',14.6937,-17.4441,NULL,'en_cours','2026-04-02 04:00:05'),('6e7dc641-2e48-11f1-ab9c-005056c00001',NULL,'Lampadaire en panne','eclairage','Lampadaire éteint depuis 3 jours, rue très sombre la nuit.',14.696,-17.4478,NULL,'assigne','2026-04-02 04:00:05'),('6e7dc7d9-2e48-11f1-ab9c-005056c00001',NULL,'Dépôt sauvage de déchets','proprete','Tas d\'ordures devant l\'école, mauvaise odeur.',14.6892,-17.4402,NULL,'resolu','2026-04-02 04:00:05'),('6e7dc8cb-2e48-11f1-ab9c-005056c00001',NULL,'Fuite d\'eau sur la chaussée','eau','Eau qui coule en permanence depuis une canalisation, gaspillage important.',14.7012,-17.451,NULL,'recu','2026-04-02 04:00:05'),('6e7dc9b2-2e48-11f1-ab9c-005056c00001',NULL,'Trottoir effondré','voirie','Le trottoir est complètement cassé, dangereux pour les piétons.',14.6878,-17.4455,NULL,'recu','2026-04-02 04:00:05'),('6e7dca95-2e48-11f1-ab9c-005056c00001',NULL,'Bouche d\'égout ouverte','voirie','Bouche d\'égout sans couvercle, risque de chute.',14.6945,-17.4389,NULL,'assigne','2026-04-02 04:00:05'),('6e7dcbc2-2e48-11f1-ab9c-005056c00001',NULL,'Déchets devant le marché','proprete','Les poubelles n\'ont pas été ramassées depuis une semaine.',14.6921,-17.4467,NULL,'en_cours','2026-04-02 04:00:05'),('6e7dcce4-2e48-11f1-ab9c-005056c00001',NULL,'Panne d\'eau dans le quartier','eau','Pas d\'eau courante depuis ce matin dans tout le quartier.',14.6998,-17.4423,NULL,'resolu','2026-04-02 04:00:05'),('6e7dce31-2e48-11f1-ab9c-005056c00001',NULL,'Route inondée','voirie','Route impraticable après les pluies, eau stagnante.',14.6855,-17.449,NULL,'recu','2026-04-02 04:00:05'),('6e7dcff0-2e48-11f1-ab9c-005056c00001',NULL,'3 lampadaires éteints','eclairage','Toute une portion de la rue est dans le noir, insécurité.',14.6975,-17.435,NULL,'recu','2026-04-02 04:00:05'),('88080d6f-2e48-11f1-ab9c-005056c00001',NULL,'Nid-de-poule dangereux','voirie','Grand nid-de-poule au milieu de la chaussée, risque pour les motos.',14.6937,-17.4441,NULL,'en_cours','2026-04-02 04:00:47'),('88081b63-2e48-11f1-ab9c-005056c00001',NULL,'Lampadaire en panne','eclairage','Lampadaire éteint depuis 3 jours, rue très sombre la nuit.',14.696,-17.4478,NULL,'assigne','2026-04-02 04:00:47'),('88081d15-2e48-11f1-ab9c-005056c00001',NULL,'Dépôt sauvage de déchets','proprete','Tas d\'ordures devant l\'école, mauvaise odeur.',14.6892,-17.4402,NULL,'resolu','2026-04-02 04:00:47'),('88081dce-2e48-11f1-ab9c-005056c00001',NULL,'Fuite d\'eau sur la chaussée','eau','Eau qui coule en permanence depuis une canalisation, gaspillage important.',14.7012,-17.451,NULL,'recu','2026-04-02 04:00:47'),('88081ef3-2e48-11f1-ab9c-005056c00001',NULL,'Trottoir effondré','voirie','Le trottoir est complètement cassé, dangereux pour les piétons.',14.6878,-17.4455,NULL,'recu','2026-04-02 04:00:47'),('8808202b-2e48-11f1-ab9c-005056c00001',NULL,'Bouche d\'égout ouverte','voirie','Bouche d\'égout sans couvercle, risque de chute.',14.6945,-17.4389,NULL,'assigne','2026-04-02 04:00:47'),('88082130-2e48-11f1-ab9c-005056c00001',NULL,'Déchets devant le marché','proprete','Les poubelles n\'ont pas été ramassées depuis une semaine.',14.6921,-17.4467,NULL,'en_cours','2026-04-02 04:00:47'),('8808225a-2e48-11f1-ab9c-005056c00001',NULL,'Panne d\'eau dans le quartier','eau','Pas d\'eau courante depuis ce matin dans tout le quartier.',14.6998,-17.4423,NULL,'resolu','2026-04-02 04:00:47'),('8808240b-2e48-11f1-ab9c-005056c00001',NULL,'Route inondée','voirie','Route impraticable après les pluies, eau stagnante.',14.6855,-17.449,NULL,'recu','2026-04-02 04:00:47'),('880824eb-2e48-11f1-ab9c-005056c00001',NULL,'3 lampadaires éteints','eclairage','Toute une portion de la rue est dans le noir, insécurité.',14.6975,-17.435,NULL,'recu','2026-04-02 04:00:47'),('f5c8d759-2ea6-11f1-ab9c-005056c00001',NULL,'Nid-de-poule dangereux','voirie','Grand nid-de-poule au milieu de la chaussée, risque pour les motos.',14.6937,-17.4441,NULL,'en_cours','2026-04-02 15:16:44'),('f5c8f85c-2ea6-11f1-ab9c-005056c00001',NULL,'Lampadaire en panne','eclairage','Lampadaire éteint depuis 3 jours, rue très sombre la nuit.',14.696,-17.4478,NULL,'assigne','2026-04-02 15:16:44'),('f5c8feb8-2ea6-11f1-ab9c-005056c00001',NULL,'Dépôt sauvage de déchets','proprete','Tas d\'ordures devant l\'école, mauvaise odeur.',14.6892,-17.4402,NULL,'resolu','2026-04-02 15:16:44'),('f5c903fa-2ea6-11f1-ab9c-005056c00001',NULL,'Fuite d\'eau sur la chaussée','eau','Eau qui coule en permanence depuis une canalisation, gaspillage important.',14.7012,-17.451,NULL,'recu','2026-04-02 15:16:44'),('f5c908a3-2ea6-11f1-ab9c-005056c00001',NULL,'Trottoir effondré','voirie','Le trottoir est complètement cassé, dangereux pour les piétons.',14.6878,-17.4455,NULL,'recu','2026-04-02 15:16:44'),('f5c90ce0-2ea6-11f1-ab9c-005056c00001',NULL,'Bouche d\'égout ouverte','voirie','Bouche d\'égout sans couvercle, risque de chute.',14.6945,-17.4389,NULL,'assigne','2026-04-02 15:16:44'),('f5c9113b-2ea6-11f1-ab9c-005056c00001',NULL,'Déchets devant le marché','proprete','Les poubelles n\'ont pas été ramassées depuis une semaine.',14.6921,-17.4467,NULL,'en_cours','2026-04-02 15:16:44'),('f5c91579-2ea6-11f1-ab9c-005056c00001',NULL,'Panne d\'eau dans le quartier','eau','Pas d\'eau courante depuis ce matin dans tout le quartier.',14.6998,-17.4423,NULL,'resolu','2026-04-02 15:16:44'),('f5c92167-2ea6-11f1-ab9c-005056c00001',NULL,'Route inondée','voirie','Route impraticable après les pluies, eau stagnante.',14.6855,-17.449,NULL,'recu','2026-04-02 15:16:44'),('f5c92459-2ea6-11f1-ab9c-005056c00001',NULL,'3 lampadaires éteints','eclairage','Toute une portion de la rue est dans le noir, insécurité.',14.6975,-17.435,NULL,'recu','2026-04-02 15:16:44');
/*!40000 ALTER TABLE `tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilisateurs`
--

DROP TABLE IF EXISTS `utilisateurs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utilisateurs` (
  `id` char(36) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `role` enum('citoyen','admin') NOT NULL DEFAULT 'citoyen',
  `date_creation` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilisateurs`
--

LOCK TABLES `utilisateurs` WRITE;
/*!40000 ALTER TABLE `utilisateurs` DISABLE KEYS */;
INSERT INTO `utilisateurs` VALUES ('42e87ac0-afbd-4e34-a631-78b0d3888353','QOJHIZO IDHN','aliounecissendiaye2@gmail.com','$2b$10$U491vRvhIxHX9IKiuX3qluWYan7Alr9h7KasieejB4oMH81Zq8q7S','citoyen','2026-04-04 13:28:33'),('64cf6400-2f02-11f1-ab9c-005056c00001','Administrateur','admin@samaavis.sn','$2b$10$cIohm/LVEntGbAeKBFNlvOXBRj9REXxDstfqryRTeLi9xYb424HbC','admin','2026-04-03 02:11:15'),('86983fee-5b2f-4120-9464-149957b1788c','Amadou Diallo','amadou@gmail.com','$2b$10$qbfb1SLUQFS0yofqv.EgdOYMS0DCrtWyqj3hjXX2zm0faO5H5/Ofe','citoyen','2026-04-03 02:02:42');
/*!40000 ALTER TABLE `utilisateurs` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-04 14:54:37
