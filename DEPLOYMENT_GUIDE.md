# MCQ-prep Deployment Guide

This repository now includes a `docker/`, `terraform/`, `kubernetes/`, `jenkins/`, `monitoring/`, and `.github/workflows/` folders with example deployment and CI/CD configurations.

Quick steps:
- Review and update `terraform/terraform.tfvars` with your AWS settings.
- Review `docker/docker-compose.yml` and `docker/*.Dockerfile` for local testing.
- Run the local stack with: docker-compose -f docker/docker-compose.yml up --build
- CI/CD workflows are in `.github/workflows/deploy.yml` and `jenkins/Jenkinsfile`.

See the files in the `devops` folders for full instructions and examples.
