# UniDefi - Projet final Alyra


## Equipe
Groupe de travail constitué de:
- Arthur Coudol (développeur blockchain)
- Mike Cyrille (consultant DeFi)
- Guillaume Richard (consultant DeFi)



## Liens
[Application déployée sur Vercel](https://unidefi-teal.vercel.app/)    
[Adresse du contrat Unidefi déployé sur Sepolia et vérifié](https://sepolia.etherscan.io/address/0x84dFE0580C985981776355bc4F2668Db287331CD#code) :
`0x84dFE0580C985981776355bc4F2668Db287331CD`



## Périmètre de l'application
Le périmètre s'est concentré sur la partie DeFi (finance décentralisée) avec les fonctionnalités suivantes:
- Pool de liquidité à 2 assets USDC et UDFI (token projet): possibilité d'ajouter ou de retirer de la liquidité, avec gestion de LP tokens
- Swap: conversion 'USDC -> UDFI' ou 'UDFI -> USDC'



## Stack technique
Backend:
- Solidity
- Hardhat et Chai pour les tests

Frontend:
- NextJS, React, Chakra-UI, RainbowKit



## Integration continue
- Git/Github pour historisation/versionning des scripts
- Versel pour le déploiement public avec régénération automatisé du déploiement à chaque push
- Tests avec Hardhat et Chai, pour contrôle de non-regression à chaque nouvelle modification
- Couverture des tests 100%



## Smart Contracts
- Usdc.sol: contrat ERC20 temporaire, sera remplacé par un appel à l'address du contrat USDC officiel en mainnet
- Udfi.sol: contrat ERC20 du token projet
- Unidefi.sol: contrat maître, gérant les fonctionnalités du Swap et d'une Liquidity Pool, avec gestion attribution/burn de LP tokens (stockés en mapping)



## Sécurité
Les contrats ERC20 héritent du standard d'Openzeppelin
Pas de tableaux, pas de boucle for
Contrôles sur le respect du ratio de la pool
L'attribution/burn des LP tokens se fait par le biais de fonctions private pour éviter toute manipulation externe



## Optimisations
Peu de variables globales
Toutes sont déclarées en portée private 
Utilisation d'un mapping pour la gestion des LP ( address => uint )
Utilisation de custom errors
Attention portée aux types de fonctions: private, external, pure view