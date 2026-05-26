-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: startersql
-- ------------------------------------------------------
-- Server version	8.0.46

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
-- Table structure for table `admin_users`
--

DROP TABLE IF EXISTS `admin_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_users` (
  `id` int NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `salary` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_users`
--

LOCK TABLES `admin_users` WRITE;
/*!40000 ALTER TABLE `admin_users` DISABLE KEYS */;
INSERT INTO `admin_users` VALUES (101,'Anil Kumar','anil@example.com','Male','1985-04-12',60000),(102,'Pooja Sharma','pooja@example.com','Female','1992-09-20',58000),(103,'Rakesh Yadav','rakesh@example.com','Male','1989-11-05',54000),(104,'Fatima Begum','fatima@example.com','Female','1990-06-30',62000);
/*!40000 ALTER TABLE `admin_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `image_url` varchar(255) DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(100) DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `quantity` int DEFAULT '1',
  `price` decimal(10,2) DEFAULT NULL,
  `added_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `image_url` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `status` enum('Pending','Shipped','Delivered','Cancelled') DEFAULT 'Pending',
  `user_id` int NOT NULL,
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuC-HNKI1GlrzY1LLd3td39cfe2ZW5EyY9J7w2XEvAyQ&s&ec=121657058',1990.00,'Pending',1),(15,'https://rukminim2.flixcart.com/image/1536/1536/xif0q/watch/i/4/i/-original-imahfsz79hfg5hwy.jpeg?q=90',1995.00,'Pending',2);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `color` varchar(100) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `description` text,
  `image` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (8,'Titan Workwear Green Dial',1995.00,'Green','Watch','Titan','https://rukminim2.flixcart.com/image/1536/1536/xif0q/watch/i/4/i/-original-imahfsz79hfg5hwy.jpeg?q=90'),(9,'Titan Karishma Blue Dial',3994.00,'Blue/Silver/Gold','Watch','Titan','https://rukminim2.flixcart.com/image/1536/1536/xif0q/watch/x/3/l/-original-imahg62zutb2fhyy.jpeg?q=90'),(10,'Titan Workwear Silver Dial',1995.00,'Silver','Watch','Titan','https://rukminim2.flixcart.com/image/1536/1536/xif0q/watch/v/9/w/-original-imahfts8b3b8gbwh.jpeg?q=90'),(11,'Titan Lagan White Dial Silver & Gold',3994.00,'Silver & Gold','Watch','Titan','https://rukminim2.flixcart.com/image/1536/1536/xif0q/watch/a/b/3/-original-imahg62zuzccmgky.jpeg?q=90'),(12,'Titan Workwear Black Dial Leather Strap',3845.00,'Black','Watch','Titan','https://rukminim2.flixcart.com/image/1536/1536/xif0q/watch/q/e/1/-original-imahg62xsyz7u9gh.jpeg?q=90'),(13,'Titan Karishma Silver Dial Stainless Steel',1994.00,'Silver','Watch','Titan','https://rukminim2.flixcart.com/image/1536/1536/xif0q/watch/q/k/a/-original-imahfszad22qrcuy.jpeg?q=90'),(14,'Titan Analog Watch - For Men Gold Dial',1994.00,'Gold','Watch','Titan','https://rukminim2.flixcart.com/image/1536/1536/xif0q/watch/x/9/f/-original-imahfsz7pq7r68bd.jpeg?q=90'),(15,'Titan Karishma Anthracite',3299.00,'Grey Metal','Watch','Display Type Analog Occasion Formal Diameter 47 mm Dial Color Grey','https://rukminim2.flixcart.com/image/1536/1536/xif0q/watch/e/n/o/-original-imahg62grk3bgdfv.jpeg?q=90'),(16,'Rolex Yacht-Master 42 Gold',3523449.00,'Gold/Black','Watch','Rolex','https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQXWkfiGc6rPswmcPn3g6dRQ3N7KURQBULF47jym8BVCvJC9vrnDPXnpc_ZNencEuhro8EesCxQYXMxWgfXA4wwmIgcwHtN'),(24,'Rolex Daytona Cosmograph',1200000.00,'White/Black','Watch','Rolex','https://images.unsplash.com/photo-1547996160-81dfa63595aa'),(31,'Rolex Datejust 41',750000.00,'Silver/Blue','Watch','Rolex','https://i0.wp.com/haute24.com/wp-content/uploads/2025/11/01-25.png?fit=600%2C800&ssl=1'),(32,'Rolex GMT-Master II Pepsi',950000.00,'Blue/Red','Watch','Rolex','https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcT56xuauiWzBMd598tF65LrldaI2Gi0Rr0GLciarJxgv2QGBgnAwir3TP_zMx3rNp0D5D8DPNy_iH0foecwDDQfZX44DlaSXw'),(33,'Rolex Explorer II',700000.00,'White','Watch','Rolex','https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTEm8IoH0r0QmAJwPWgcpEelQctEpWf2wDDrsPOC7ztVS5RZK6t2HycJeX2oVizrqjXuiZCwvNoLQOdVtKkU_zNXbT1IwgQxygsEpwV3sDN5UEBl4S_KT7r'),(34,'Rolex Sky-Dweller',1400000.00,'Black','Watch','Rolex','https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRevSOa0aYr6WrCQ9jRR4rISV4IfzYjIhvtIka9icUt8jQfBdDI1Ywr5FCsUxKH9CULn4u-BoVN0h0xt0wJxgGOMspPAeKcNzElJ5IB1bL_aagz3Q26LNwj'),(35,'Rolex Oyster Perpetual 36',600000.00,'Green','Watch','Rolex','https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTx2SE3yQRlKKel7KpopbSu6azx7rw6DuGXwwLjkP4b53fLWErx0Ds3QGc4DF4extW4VZvFtAAj9xqXdcuyreEiixujkBPA'),(36,'Rolex Day-Date President',1800000.00,'Gold','Watch','Rolex','https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQcf2sFTjadEh3YiYhVcG7b4ZYsbG7ApnCYrPWw6cyQSU84XauwTcJPicQWj3BxW1JlFJctuxafx-jAwr1vyIVOYF_0Vkx5lQ'),(37,'Casio G-Shock GM-2110D-2ADR Analog Watch',21995.00,'Silver Blue','Watch','G-Shock Analog-Digital Stainless Steel Series','https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRN7Lgz8hr07ho63fjtGr21YNfQKZmjjMte2d_G9xrgcuwXq9oB708kegkJjvHzpGuwLEPx1deDAoe4Jdc6JVToFe3LzBPmlLC6sNwzelffIJ4DnJzF1JR8CxGNM0C1L_OHhUUpfbo&usqp=CAc'),(38,'Casio G-Shock GBM-2100-1ADR Bluetooth Watch',19995.00,'Black Silver','Watch','Bluetooth Solar Powered Analog Digital Watch','https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQALHjancMwa8neYRlVz4xqheNY2MzfrZvBO7wxWyQY5x1NIec6gDsAGwdzFq4D1LSk13ZueiKylVnJuWXGJwQ77Ro117v7srN8zY3rcjIltd8rH0a1S60POz67TRB5CzkbVDWYDg&usqp=CAc'),(39,'Casio G-Shock GA-2100-1A1DR Black Watch',9195.00,'Black','Watch','Carbon Core Guard Analog Digital Watch','https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSRoChgyla-9DuDRhiE2BmeeKwbSGC_6mKNvsMveetad6_rbbnxqwEI47rlx44PELt-hjUSoLx471jfgTDHbWJJNcg1XGzDuDmp1e80apEnnhCRuP7Xhym6HNiXyI2lcQoy5bmHOIY&usqp=CAc'),(40,'Casio G-Shock GMC-B2100AD-2ADR Premium Watch',59995.00,'Silver Sky Blue','Watch','Full Metal Chronograph Bluetooth Watch','https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcROJMVkUC3Fc0Z3NYD3u7eVZBsOy6LAP5osmGy7MnpXQ6bnF6Q14fBMacAakpV4APsN0hQnxER3QkKFP9lU-D_ldNVcAXckEk9an8B-gwgjb-S7ymxyCaCDmDvl9RsgoRhqdd1B9vI&usqp=CAc'),(41,'Casio G-Shock GG-1000-1A3DR Mudmaster Watch',19995.00,'Black Green','Watch','Mudmaster Twin Sensor Analog Digital Watch','https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSW6kipw6KwyjT-OsfMm2fluiojATfGxI4KyBGyFoNu7KW4sLl4GY69CSg7NIjmU2R_6-TWMnpqw8IxwMJLtGzYSfpY5-1pxyTzZTn6hcNaaSOq2zIgu4hcd2vzegH7jfP5yYr_UxwgHQ&usqp=CAc'),(42,'Casio G-Shock GBM-2100A-1A2DR Tough Solar Watch',19995.00,'Black Blue','Watch','Tough Solar Bluetooth Analog Digital Watch','https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRdGAOrvnekYuKGiU8Egk4eR0pcSaNkyQBEEMMBA661rluZAdoLbQolouAP3_kjg1x0zlXrW0rUGUifwRbq5B2KLcGDhn2FCOkBhOYHQ15WfWc6EztF7JQyjuNNJuy_BYcumsJC64s&usqp=CAc'),(43,'Casio G-Shock GMW-B5000D-1DR Digital Watch',38396.00,'Silver','Watch','Full Metal Tough Solar Digital Watch','https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTb31QFwaY1CZfJVUtum3NOZT-qTxroPU7srRuCWUoqabgJzZszhPB4BNEWxGRnEn8LK2L9FYuoow_EhEc8LCPO93WNwPF-i00I4djz_xqr&usqp=CAc'),(44,'Casio G-Shock GBM-2100A-1A3DR Green Dial Watch',19995.00,'Black Green','Watch','Bluetooth Tough Solar Green Dial Watch','https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTniIiQWe_h1GfchZJXHU0Ki2Nmo1JpUPI3jRlh4mG31xr1m-9erbE6OovGveKuI20uh2sQd4zTyYLzkjRSQs9OiFPxbZjGzJb_SXOcCIpoEjKC8ueQGKSYkGAQoFDARsz37ZcaG7I&usqp=CAc');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sellers`
--

DROP TABLE IF EXISTS `sellers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sellers` (
  `id` varchar(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sellers`
--

LOCK TABLES `sellers` WRITE;
/*!40000 ALTER TABLE `sellers` DISABLE KEYS */;
INSERT INTO `sellers` VALUES ('62cf','Sam Tiwari','Sam@seller.com','abc@123'),('928f','Bhavesh chouhan','Bhavesh@seller.com','abc@123'),('c372','Samm','sam@text.com','abc@123'),('ca25','sonu','sonu@text.com','abc@123'),('e5f4','Bhavesh Chouhan','chouhanbhavesh860@gmail.com','1233');
/*!40000 ALTER TABLE `sellers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_log`
--

DROP TABLE IF EXISTS `user_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `created_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_log`
--

LOCK TABLES `user_log` WRITE;
/*!40000 ALTER TABLE `user_log` DISABLE KEYS */;
INSERT INTO `user_log` VALUES (1,28,'rohan','2026-04-27 18:17:09'),(2,31,'rohan','2026-04-27 18:18:19');
/*!40000 ALTER TABLE `user_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Riya ','riya11@gmail.com','1234'),(2,'Bhavesh Chouhan','chouhanbhavesh860@gmail.com','1234'),(3,'roy','roy11@gmail.com','1234'),(4,'','',''),(6,'Aniket chouhan','aniketchouhan314@gmail.com','1234');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-16  0:12:38
