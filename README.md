# Axway Repository CLI

### Prerequisites

The Axway CLI requires [Node.js][1] 10.19.0 or newer.

## Installation

```sh
$ axway pm install @axway/axway-repository-cli
```

## Quick Start

List of the available Axway Repository commands

```sh
$ axway repo
```
alias for

```sh
$ axway repository
```

## Commands

Axway Repository CLI covers multiple repository types

### Docker

#### List all available Docker commands
```sh
$ axway repository docker

USAGE: axway repository docker <command> [options]

DOCKER COMMANDS:
  ls, list       List all available Axway Repository images
  pull           Pull an image from Axway Repository
  search         Search the Axway Repository for images
  set            Setup docker native command for Axway Repository
  unset          Remove Axway Repository from docker

```

#### Show available Docker images

```sh
$ axway repository docker ls

NAME                 TAG     TITLE                           DESCRIPTION               SHA256
apimanagement/apigw  7.6.2   API Gateway 7.6.2               API Gateway docker image  f9fdea3b0bca9cf34456a49a82127
apimanagement/anm    7.6.2   API Gateway Node Manager 7.6.2  Admin Node Manager image  ce5635c13c8313e63ac307fb511fb1

```

#### Pull a Docker image

```sh
$ axway repository docker pull

USAGE: axway repository docker pull [options] <IMAGE>

PULL ARGUMENTS:
  image          Docker image name

```

#### Search for a Docker images

```sh
$ axway repository docker search

USAGE: axway repository docker search [options] <TERM>

SEARCH ARGUMENTS:
  term           The image name

SEARCH OPTIONS:
  --full-names   Show image full names
  --limit        Max number of search results
  --offset       Retrieving search results with offset pagination

$ axway repository docker search api

NAME                 TAG    TITLE              DESCRIPTION               SHA256
apimanagement/apigw  7.6.2  API Gateway 7.6.2  API Gateway docker image  f9fdea3b0bca9cf34456a49a82127
```

### Helm
> Helm uses a packaging format called charts. A chart is a collection of files that describe a related set of Kubernetes resources.
#### List all available Helm commands



```sh
$ axway repository helm

USAGE: axway repository helm <command> [options]

HELM COMMANDS:
  set            Setup Axway Helm Repository
  unset          Remove Axway Repository from helm

```


## Legal

This project is open source under the [Apache Public License v2][2] and is developed by
[Axway, Inc](http://www.axway.com/) and the community. Please read the [`LICENSE`][2] file included
in this distribution for more information.

[1]: https://nodejs.org/
[2]: ./LICENSE
